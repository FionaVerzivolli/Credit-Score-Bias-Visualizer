#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <cstring>
#include <netinet/in.h> // For sockaddr_in
#include <unistd.h>     // For close()

#define PORT 9001
#define BUFFER_SIZE 1024

// Lightweight Base64 encoding
std::string base64Encode(const unsigned char *data, size_t length)
{
    const char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    std::string encoded;
    int val = 0, valb = -6;
    for (size_t i = 0; i < length; i++)
    {
        val = (val << 8) + data[i];
        valb += 8;
        while (valb >= 0)
        {
            encoded.push_back(table[(val >> valb) & 0x3F]);
            valb -= 6;
        }
    }
    if (valb > -6)
        encoded.push_back(table[((val << 8) >> (valb + 8)) & 0x3F]);
    while (encoded.size() % 4)
        encoded.push_back('=');
    return encoded;
}

// Minimal SHA-1 implementation
class SHA1
{
public:
    static constexpr size_t HASH_SIZE = 20;

    static void hash(const unsigned char *data, size_t length, unsigned char output[HASH_SIZE])
    {
        reset();
        update(data, length);
        finalize();
        std::memcpy(output, digest, HASH_SIZE);
    }

private:
    static constexpr size_t BLOCK_SIZE = 64;

    static inline uint32_t leftRotate(uint32_t value, uint32_t count)
    {
        return (value << count) | (value >> (32 - count));
    }

    static void reset()
    {
        totalLength = 0;
        bufferLength = 0;

        state[0] = 0x67452301;
        state[1] = 0xEFCDAB89;
        state[2] = 0x98BADCFE;
        state[3] = 0x10325476;
        state[4] = 0xC3D2E1F0;
    }

    static void update(const unsigned char *data, size_t length)
    {
        totalLength += length;

        while (length > 0)
        {
            size_t chunkSize = std::min(length, BLOCK_SIZE - bufferLength);
            std::memcpy(buffer + bufferLength, data, chunkSize);

            bufferLength += chunkSize;
            data += chunkSize;
            length -= chunkSize;

            if (bufferLength == BLOCK_SIZE)
            {
                processBlock();
                bufferLength = 0;
            }
        }
    }

    static void finalize()
    {
        buffer[bufferLength++] = 0x80;

        if (bufferLength > BLOCK_SIZE - 8)
        {
            std::memset(buffer + bufferLength, 0, BLOCK_SIZE - bufferLength);
            processBlock();
            bufferLength = 0;
        }

        std::memset(buffer + bufferLength, 0, BLOCK_SIZE - bufferLength - 8);
        uint64_t totalBits = totalLength * 8;
        for (int i = 0; i < 8; ++i)
        {
            buffer[BLOCK_SIZE - 1 - i] = totalBits & 0xFF;
            totalBits >>= 8;
        }
        processBlock();

        for (int i = 0; i < 5; ++i)
        {
            digest[i * 4] = (state[i] >> 24) & 0xFF;
            digest[i * 4 + 1] = (state[i] >> 16) & 0xFF;
            digest[i * 4 + 2] = (state[i] >> 8) & 0xFF;
            digest[i * 4 + 3] = state[i] & 0xFF;
        }
    }

    static void processBlock()
    {
        uint32_t w[80];
        for (int i = 0; i < 16; ++i)
        {
            w[i] = (buffer[i * 4] << 24) | (buffer[i * 4 + 1] << 16) |
                   (buffer[i * 4 + 2] << 8) | buffer[i * 4 + 3];
        }
        for (int i = 16; i < 80; ++i)
        {
            w[i] = leftRotate(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
        }

        uint32_t a = state[0], b = state[1], c = state[2], d = state[3], e = state[4];
        for (int i = 0; i < 80; ++i)
        {
            uint32_t f, k;
            if (i < 20)
            {
                f = (b & c) | ((~b) & d);
                k = 0x5A827999;
            }
            else if (i < 40)
            {
                f = b ^ c ^ d;
                k = 0x6ED9EBA1;
            }
            else if (i < 60)
            {
                f = (b & c) | (b & d) | (c & d);
                k = 0x8F1BBCDC;
            }
            else
            {
                f = b ^ c ^ d;
                k = 0xCA62C1D6;
            }

            uint32_t temp = leftRotate(a, 5) + f + e + k + w[i];
            e = d;
            d = c;
            c = leftRotate(b, 30);
            b = a;
            a = temp;
        }

        state[0] += a;
        state[1] += b;
        state[2] += c;
        state[3] += d;
        state[4] += e;
    }

    static uint32_t state[5];
    static unsigned char buffer[BLOCK_SIZE];
    static size_t bufferLength;
    static size_t totalLength;
    static unsigned char digest[HASH_SIZE];
};

uint32_t SHA1::state[5];
unsigned char SHA1::buffer[SHA1::BLOCK_SIZE];
size_t SHA1::bufferLength = 0;
size_t SHA1::totalLength = 0;
unsigned char SHA1::digest[SHA1::HASH_SIZE];

std::string generateSecWebSocketAccept(const std::string &secWebSocketKey)
{
    const std::string magicKey = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    std::string concatenated = secWebSocketKey + magicKey;

    unsigned char hash[SHA1::HASH_SIZE];
    SHA1::hash(reinterpret_cast<const unsigned char *>(concatenated.c_str()), concatenated.size(), hash);

    return base64Encode(hash, SHA1::HASH_SIZE);
}

std::string createHandshakeResponse(const std::string &request)
{
    std::istringstream requestStream(request);
    std::string line;
    std::string secWebSocketKey;

    while (std::getline(requestStream, line))
    {
        if (line.find("Sec-WebSocket-Key:") != std::string::npos)
        {
            secWebSocketKey = line.substr(line.find(":") + 2);
            secWebSocketKey.erase(secWebSocketKey.find("\r"));
            break;
        }
    }

    if (secWebSocketKey.empty())
    {
        std::cerr << "Error: Sec-WebSocket-Key not found in handshake request!" << std::endl;
        return "";
    }

    std::string secWebSocketAccept = generateSecWebSocketAccept(secWebSocketKey);
    std::string response =
        "HTTP/1.1 101 Switching Protocols\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        "Sec-WebSocket-Accept: " +
        secWebSocketAccept + "\r\n\r\n";
    return response;
}

int main()
{
    int server_fd, client_fd;
    struct sockaddr_in address;
    char buffer[BUFFER_SIZE] = {0};

    // Create server socket
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0)
    {
        perror("Socket creation failed");
        return -1;
    }

    std::cout << "Socket created successfully." << std::endl;

    // Configure server address
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    // Bind socket to the specified port
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0)
    {
        perror("Bind failed");
        close(server_fd);
        return -1;
    }
    std::cout << "Socket bound to port " << PORT << "." << std::endl;

    // Start listening for incoming connections
    if (listen(server_fd, 3) < 0)
    {
        perror("Listen failed");
        close(server_fd);
        return -1;
    }
    std::cout << "Server listening on ws://localhost:" << PORT << std::endl;

    while (true)
    {
        socklen_t addrlen = sizeof(address);
        if ((client_fd = accept(server_fd, (struct sockaddr *)&address, &addrlen)) < 0)
        {
            perror("Accept failed");
            continue;
        }

        std::cout << "Client connected!" << std::endl;

        // Read WebSocket handshake request
        int bytesRead = read(client_fd, buffer, BUFFER_SIZE);
        if (bytesRead <= 0)
        {
            std::cerr << "Error reading handshake or client disconnected immediately." << std::endl;
            close(client_fd);
            continue;
        }

        std::cout << "Received handshake request:\n"
                  << buffer << std::endl;

        // Send WebSocket handshake response
        std::string handshakeResponse = createHandshakeResponse(buffer);
        send(client_fd, handshakeResponse.c_str(), handshakeResponse.size(), 0);
        std::cout << "Handshake response sent." << std::endl;

        // Handle WebSocket messages
        while (true)
        {
            memset(buffer, 0, BUFFER_SIZE);
            bytesRead = read(client_fd, buffer, BUFFER_SIZE);

            if (bytesRead <= 0)
            {
                std::cout << "Client disconnected!" << std::endl;
                close(client_fd);
                break;
            }

            // Decode WebSocket frames properly
            uint8_t opcode = buffer[0] & 0x0F;
            bool isFinalFrame = buffer[0] & 0x80;

            if (opcode == 0x8)
            { // Close frame
                std::cout << "Client sent a close frame." << std::endl;
                close(client_fd);
                break;
            }

            // Assume the payload length is small (no extended length)
            size_t payloadStart = 2; // Skip the first two bytes (opcode and payload length)
            size_t payloadLength = buffer[1] & 0x7F;

            std::string message(buffer + payloadStart, payloadLength);
            std::cout << "Message received: " << message << std::endl;

            // Respond to the client
            std::string response = "Message received and processed!";
            send(client_fd, response.c_str(), response.size(), 0);
            std::cout << "Response sent to client." << std::endl;
        }
    }

    close(server_fd);
    return 0;
}

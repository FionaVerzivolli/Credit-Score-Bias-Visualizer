#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <cstring>
#include <netinet/in.h> // For sockaddr_in
#include <unistd.h>     // For close()

#define PORT 9001
#define BUFFER_SIZE 1024
#define MAX_PAYLOAD_LENGTH 65536 // Define a reasonable maximum payload length

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

// Function to send a WebSocket message to the client
void sendMessage(int client_fd, const std::string &message)
{
    std::vector<unsigned char> frame;

    // Set FIN bit and text frame opcode
    frame.push_back(0x81);

    // Determine payload length
    size_t messageLength = message.size();
    if (messageLength <= 125)
    {
        frame.push_back(static_cast<unsigned char>(messageLength));
    }
    else if (messageLength <= 65535)
    {
        frame.push_back(126);
        frame.push_back((messageLength >> 8) & 0xFF);
        frame.push_back(messageLength & 0xFF);
    }
    else
    {
        frame.push_back(127);
        for (int i = 7; i >= 0; --i)
        {
            frame.push_back((messageLength >> (8 * i)) & 0xFF);
        }
    }

    // Add the message payload
    frame.insert(frame.end(), message.begin(), message.end());

    // Send the constructed frame to the client
    send(client_fd, frame.data(), frame.size(), 0);
}

// Function to parse incoming WebSocket frames and extract payload data
std::string parseFrame(const unsigned char *buffer, size_t length)
{
    if (length < 2)
    {
        std::cerr << "Error: Frame is too short!" << std::endl;
        return "";
    }

    bool fin = (buffer[0] & 0x80) != 0; // FIN bit
    unsigned char opcode = buffer[0] & 0x0F;

    if (opcode != 0x1) // Only handle text frames for now
    {
        std::cerr << "Error: Unsupported opcode!" << std::endl;
        return "";
    }

    bool masked = (buffer[1] & 0x80) != 0; // Mask bit
    size_t payloadLength = buffer[1] & 0x7F;
    size_t offset = 2;

    if (payloadLength == 126)
    {
        if (length < 4)
        {
            std::cerr << "Error: Frame too short for extended payload length!" << std::endl;
            return "";
        }
        payloadLength = (buffer[2] << 8) | buffer[3];
        offset += 2;
    }
    else if (payloadLength == 127)
    {
        if (length < 10)
        {
            std::cerr << "Error: Frame too short for extended payload length!" << std::endl;
            return "";
        }
        payloadLength = 0;
        for (int i = 0; i < 8; ++i)
        {
            payloadLength = (payloadLength << 8) | buffer[offset + i];
        }
        offset += 8;
    }

    if (masked)
    {
        if (length < offset + 4 + payloadLength)
        {
            std::cerr << "Error: Frame too short for masked payload!" << std::endl;
            return "";
        }

        unsigned char maskingKey[4];
        std::memcpy(maskingKey, buffer + offset, 4);
        offset += 4;

        std::string payload(payloadLength, '\0');
        for (size_t i = 0; i < payloadLength; ++i)
        {
            payload[i] = buffer[offset + i] ^ maskingKey[i % 4];
        }
        return payload;
    }
    else
    {
        if (length < offset + payloadLength)
        {
            std::cerr << "Error: Frame too short for unmasked payload!" << std::endl;
            return "";
        }
        return std::string(reinterpret_cast<const char *>(buffer + offset), payloadLength);
    }
}

// Main function to handle WebSocket server communication
int main()
{
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0)
    {
        std::cerr << "Error: Failed to create socket!" << std::endl;
        return 1;
    }

    sockaddr_in server_addr{};
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
    {
        std::cerr << "Error: Failed to bind socket!" << std::endl;
        close(server_fd);
        return 1;
    }

    if (listen(server_fd, 5) < 0)
    {
        std::cerr << "Error: Failed to listen on socket!" << std::endl;
        close(server_fd);
        return 1;
    }

    std::cout << "WebSocket server started on port " << PORT << std::endl;

    while (true)
    {
        sockaddr_in client_addr{};
        socklen_t client_len = sizeof(client_addr);
        int client_fd = accept(server_fd, (struct sockaddr *)&client_addr, &client_len);
        if (client_fd < 0)
        {
            std::cerr << "Error: Failed to accept client connection!" << std::endl;
            continue;
        }

        char buffer[BUFFER_SIZE] = {0};
        ssize_t bytesRead = recv(client_fd, buffer, BUFFER_SIZE, 0);
        if (bytesRead <= 0)
        {
            std::cerr << "Error: Failed to read handshake request!" << std::endl;
            close(client_fd);
            continue;
        }

        std::string handshakeResponse = createHandshakeResponse(buffer);
        if (handshakeResponse.empty())
        {
            std::cerr << "Error: Invalid WebSocket handshake request!" << std::endl;
            close(client_fd);
            continue;
        }

        send(client_fd, handshakeResponse.c_str(), handshakeResponse.size(), 0);
        std::cout << "Handshake completed with client!" << std::endl;

        while (true)
        {
            bytesRead = recv(client_fd, buffer, BUFFER_SIZE, 0);
            if (bytesRead <= 0)
            {
                std::cerr << "Error: Client disconnected or read error!" << std::endl;
                break;
            }

            std::string message = parseFrame(reinterpret_cast<unsigned char *>(buffer), bytesRead);
            if (!message.empty())
            {
                std::cout << "Received: " << message << std::endl;

                // Echo the received message back to the client
                sendMessage(client_fd, message);
            }
        }

        close(client_fd);
        std::cout << "Client connection closed!" << std::endl;
    }

    close(server_fd);
    return 0;
}

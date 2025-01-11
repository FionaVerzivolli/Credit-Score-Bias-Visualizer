#include <iostream>
#include <curl/curl.h>
#include <string>
#include <fstream>
#include <stdexcept>

// Helper to read Supabase settings from settings.json (Manual JSON parsing)
std::string getSetting(const std::string &key)
{
    std::ifstream file("settings.json");
    if (!file.is_open())
    {
        throw std::runtime_error("Failed to open settings.json");
    }

    std::string line, content;
    while (std::getline(file, line))
    {
        content += line; // Combine all lines into a single string
    }

    // Search for the key and extract its value
    size_t keyPos = content.find("\"" + key + "\"");
    if (keyPos == std::string::npos)
    {
        throw std::runtime_error("Key not found: " + key);
    }

    size_t colonPos = content.find(":", keyPos);
    size_t start = content.find("\"", colonPos) + 1;
    size_t end = content.find("\"", start);

    if (start == std::string::npos || end == std::string::npos)
    {
        throw std::runtime_error("Value not found for key: " + key);
    }

    return content.substr(start, end - start);
}

// Callback function to handle HTTP responses
size_t writeCallback(void *contents, size_t size, size_t nmemb, std::string *output)
{
    size_t totalSize = size * nmemb;
    output->append((char *)contents, totalSize);
    return totalSize;
}

// Function to fetch data from Supabase (GET request)
// Function to fetch data from Supabase (GET request)
void fetchFromSupabase()
{
    std::string url = getSetting("supabase_url") + "/rest/v1/users";
    std::string apiKey = getSetting("supabase_anon_key");

    // Append the API key as a query parameter (optional but helps avoid errors)
    url += "?apikey=" + apiKey;

    std::string response;
    CURL *curl = curl_easy_init();
    if (curl)
    {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, ("apikey: " + apiKey).c_str());
        headers = curl_slist_append(headers, ("Authorization: Bearer " + apiKey).c_str());
        headers = curl_slist_append(headers, "Content-Type: application/json");

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        CURLcode res = curl_easy_perform(curl);
        if (res != CURLE_OK)
        {
            std::cerr << "cURL Error: " << curl_easy_strerror(res) << std::endl;
        }
        else
        {
            std::cout << "Response: " << response << std::endl;
        }

        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
}

// Function to insert data into Supabase (POST request)
void insertIntoSupabase(const std::string &name, int age)
{
    std::string url = getSetting("supabase_url") + "/rest/v1/users";
    std::string apiKey = getSetting("supabase_anon_key");

    // Append the API key as a query parameter (optional but helps avoid errors)
    url += "?apikey=" + apiKey;

    std::string jsonData = "{\"name\": \"" + name + "\", \"age\": " + std::to_string(age) + "}";

    CURL *curl = curl_easy_init();
    if (curl)
    {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, ("apikey: " + apiKey).c_str());
        headers = curl_slist_append(headers, ("Authorization: Bearer " + apiKey).c_str());
        headers = curl_slist_append(headers, "Content-Type: application/json");

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonData.c_str());

        CURLcode res = curl_easy_perform(curl);
        if (res != CURLE_OK)
        {
            std::cerr << "cURL Error: " << curl_easy_strerror(res) << std::endl;
        }
        else
        {
            std::cout << "Data inserted successfully!" << std::endl;
        }

        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
}

int main()
{
    try
    {
        // Fetch users from Supabase
        std::cout << "Fetching data from Supabase...\n";
        fetchFromSupabase();

        // Insert a new user into Supabase
        std::cout << "Inserting data into Supabase...\n";
        insertIntoSupabase("John Doe", 25);
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    return 0;
}

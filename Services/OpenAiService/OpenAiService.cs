using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using promptle.Services.OpenAiService;
using Promptle.Function.Models;

namespace Promptle.Function.Services;


public class OpenAiService : IOpenAiService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OpenAiService> _logger;
    private const string OpenAiEndpoint = "https://api.openai.com/v1/chat/completions";
    private const string DefaultModel = "gpt-4o";
    private const int MaxTokens = 300;
    private const string DescribeImagePrompt = "Create a precise, seven-word prompt capturing this image's essence, using detailed and nuanced language with minimal common terms";

    public OpenAiService(HttpClient httpClient, ILogger<OpenAiService> logger)
    {
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {Environment.GetEnvironmentVariable("OPENAI_API_KEY")}");
        _logger = logger;
    }

    public async Task<string[]> GetImageDescriptionWords(string imageUrl)
    {
        var requestData = CreateRequestData(imageUrl);
        var response = await MakeOpenAiRequest(requestData);
        return ProcessResponse(response);
    }

    private static object CreateRequestData(string imageUrl) =>
        new
        {
            model = "gpt-4o",
            messages = new[]
            {
                new
                {
                    role = "user",
                    content = new object[]
                    {
                        new
                        {
                            type = "text",
                            text = "Create a precise, seven-word prompt capturing this image's essence, using detailed and nuanced language with minimal common terms"
                        },
                        new
                        {
                            type = "image_url",
                            image_url = new { url = imageUrl }
                        }
                    }
                }
            },
            max_tokens = 300
        };



    private async Task<OpenAiResponse> MakeOpenAiRequest(object requestData)
    {
        var json = JsonSerializer.Serialize(requestData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(OpenAiEndpoint, content);
        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("OpenAI API error: {Response}", responseContent);
            throw new HttpRequestException($"OpenAI API returned {response.StatusCode}: {responseContent}");
        }

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var openAiResponse = JsonSerializer.Deserialize<OpenAiResponse>(responseContent, options);

        if (openAiResponse?.Choices == null || openAiResponse.Choices.Length == 0)
        {
            throw new InvalidOperationException("OpenAI API returned no choices");
        }

        return openAiResponse;
    }

    private static string[] ProcessResponse(OpenAiResponse response)
    {
        var description = response.Choices[0].Message?.Content;
        if (string.IsNullOrEmpty(description))
        {
            throw new InvalidOperationException("OpenAI API returned empty description");
        }

        return description.Split(' ')
            .Select(word => new string(word.Where(char.IsLetter).ToArray()).ToUpper())
            .ToArray();
    }
}

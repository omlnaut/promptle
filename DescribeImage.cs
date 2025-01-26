using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Promptle.Function
{
    public class DescribeImage
    {
        private readonly ILogger<DescribeImage> _logger;
        private readonly HttpClient _httpClient;
        private readonly string _openAiApiKey;

        public DescribeImage(ILogger<DescribeImage> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
            _openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_openAiApiKey}");
        }

        [Function("DescribeImage")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            _logger.LogInformation("Processing image description request");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonSerializer.Deserialize<ImageRequest>(requestBody);

            if (string.IsNullOrEmpty(data?.ImageUrl))
            {
                return new BadRequestObjectResult("Please provide an image URL");
            }

            try
            {
                var requestData = new
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
                                    image_url = new { url = data.ImageUrl }
                                }
                            }
                        }
                    },
                    max_tokens = 300
                };

                var json = JsonSerializer.Serialize(requestData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"OpenAI API error: {responseContent}");
                    return new StatusCodeResult((int)response.StatusCode);
                }

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                
                var openAiResponse = JsonSerializer.Deserialize<OpenAiResponse>(responseContent, options);
                var description = openAiResponse?.Choices?[0]?.Message?.Content;

                if (string.IsNullOrEmpty(description))
                {
                    return new BadRequestObjectResult("Failed to generate description");
                }

                var words = description.Split(' ')
                    .Select(word => new string(word.Where(c => char.IsLetter(c)).ToArray()).ToUpper())
                    .ToList();

                return new OkObjectResult(new { words });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing request: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }

        private class ImageRequest
        {
            public string ImageUrl { get; set; }
        }

        private class OpenAiResponse
        {
            public string Id { get; set; }
            public string Object { get; set; }
            public long Created { get; set; }
            public string Model { get; set; }
            public Choice[] Choices { get; set; }
            public Usage Usage { get; set; }
            public string ServiceTier { get; set; }
            public string SystemFingerprint { get; set; }
        }

        private class Choice
        {
            public int Index { get; set; }
            public Message Message { get; set; }
            public object LogProbs { get; set; }
            public string FinishReason { get; set; }
        }

        private class Message
        {
            public string Role { get; set; }
            public string Content { get; set; }
            public object Refusal { get; set; }
        }

        private class Usage
        {
            public int PromptTokens { get; set; }
            public int CompletionTokens { get; set; }
            public int TotalTokens { get; set; }
            public PromptTokensDetails PromptTokensDetails { get; set; }
            public CompletionTokensDetails CompletionTokensDetails { get; set; }
        }

        private class PromptTokensDetails
        {
            public int CachedTokens { get; set; }
            public int AudioTokens { get; set; }
        }

        private class CompletionTokensDetails
        {
            public int ReasoningTokens { get; set; }
            public int AudioTokens { get; set; }
            public int AcceptedPredictionTokens { get; set; }
            public int RejectedPredictionTokens { get; set; }
        }
    }
}

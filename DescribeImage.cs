using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Promptle.Function.Models;
using Promptle.Function.Services;

namespace Promptle.Function;

public class DescribeImage
{
    private readonly ILogger<DescribeImage> _logger;
    private readonly IOpenAiService _openAiService;

    public DescribeImage(ILogger<DescribeImage> logger, IOpenAiService openAiService)
    {
        _logger = logger;
        _openAiService = openAiService;
    }

    [Function("DescribeImage")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
    {
        try
        {
            _logger.LogInformation("Processing image description request");
            
            var imageRequest = await ParseRequest(req);
            if (imageRequest.ValidationResult is BadRequestObjectResult badRequest)
            {
                return badRequest;
            }

            var words = await _openAiService.GetImageDescriptionWords(imageRequest.ImageUrl);
            return new OkObjectResult(new { words });
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error communicating with OpenAI API");
            return new StatusCodeResult(StatusCodes.Status502BadGateway);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error processing request");
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }

    private static async Task<(string ImageUrl, IActionResult ValidationResult)> ParseRequest(HttpRequest req)
    {
        string requestBody;
        try
        {
            requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonSerializer.Deserialize<ImageRequest>(requestBody);

            if (string.IsNullOrEmpty(data?.ImageUrl))
            {
                return (null, new BadRequestObjectResult("Please provide an image URL"));
            }

            return (data.ImageUrl, null);
        }
        catch (JsonException)
        {
            return (null, new BadRequestObjectResult("Invalid request format"));
        }
    }
}

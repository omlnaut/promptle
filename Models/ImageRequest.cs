using System.Text.Json.Serialization;

namespace Promptle.Function.Models;

public class ImageRequest
{
    [JsonPropertyName("imageUrl")]
    public string ImageUrl { get; set; }
}

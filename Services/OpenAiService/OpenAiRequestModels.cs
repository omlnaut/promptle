namespace promptle.Services.OpenAiService;
    
    public class OpenAiRequestData
    {
        public string? Model { get; set; }
        public OpenAiMessage[] Messages { get; set; } = Array.Empty<OpenAiMessage>();
        public int MaxTokens { get; set; }

        public static OpenAiRequestData FromContents(string model, OpenAiContent[] contents, int maxTokens)
        {
            return new OpenAiRequestData
            {
                Model = model,
                Messages = new[] { new OpenAiMessage { Content = contents } },
                MaxTokens = maxTokens
            };
        }
    }

    public class OpenAiMessage
    {
        public string Role { get; set; } = string.Empty;
        public OpenAiContent[] Content { get; set; } = Array.Empty<OpenAiContent>();
    }

    public abstract class OpenAiContent
    {
        public string Type { get; set; } = string.Empty;
    }

    public class OpenAiTextContent : OpenAiContent
    {
        public string Text { get; set; } = string.Empty;
    }

    public class OpenAiImageUrlContent : OpenAiContent
    {
        public OpenAiImage ImageUrl { get; set; } = new OpenAiImage();
    }

    public class OpenAiImage
    {
        public string Url { get; set; } = string.Empty;
    }
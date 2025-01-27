namespace Promptle.Function.Services;

public interface IOpenAiService
{
    /// <summary>
    /// Returns an array of words that describe the image. Each element is exactly one word containing only letters. Without any whitespace, punctuation or numbers
    /// </summary>
    /// <param name="imageUrl"></param>
    /// <returns></returns>
    Task<string[]> GetImageDescriptionWords(string imageUrl);
}

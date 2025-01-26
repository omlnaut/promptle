using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Promptle.Function.Services;

var builder = FunctionsApplication.CreateBuilder(args);

// Register OpenAiService and configure HttpClient
builder.Services.AddHttpClient<IOpenAiService, OpenAiService>(client =>
{
    var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
});

// Register the service interface with its implementation
builder.Services.AddScoped<IOpenAiService, OpenAiService>();

builder.ConfigureFunctionsWebApplication();

var app = builder.Build();

app.Run();

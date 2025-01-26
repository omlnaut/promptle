using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Promptle.Function.Services;

var builder = FunctionsApplication.CreateBuilder(args);

// Register OpenAiService and configure HttpClient
builder.Services.AddHttpClient();
// Register the service interface with its implementation
builder.Services.AddScoped<IOpenAiService, OpenAiService>();

builder.ConfigureFunctionsWebApplication();

// Application Insights isn't enabled by default. See https://aka.ms/AAt8mw4.
// builder.Services
//     .AddApplicationInsightsTelemetryWorkerService()
//     .ConfigureFunctionsApplicationInsights();

builder.Build().Run();

using Microsoft.OpenApi.Models;
using Pixelmon.Api.Attributes;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Pixelmon.Api.Swagger;

public sealed class AdminAuthorizationOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (!context.ApiDescription.ActionDescriptor.EndpointMetadata
            .OfType<AdminProtectedAttribute>()
            .Any())
        {
            return;
        }

        operation.Security ??= [];
        operation.Security.Add(new OpenApiSecurityRequirement
        {
            [new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            }] = []
        });

        operation.Responses.TryAdd("401", new OpenApiResponse { Description = "A valid admin bearer token is required." });
    }
}
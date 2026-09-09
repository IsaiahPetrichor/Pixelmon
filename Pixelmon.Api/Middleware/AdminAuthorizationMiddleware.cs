using Pixelmon.Api.Attributes;
using Pixelmon.Api.Services;

namespace Pixelmon.Api.Middleware;

public sealed class AdminAuthorizationMiddleware(
    RequestDelegate next,
    IConfiguration configuration,
    AdminTokenService tokenService)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.GetEndpoint()?.Metadata.GetMetadata<AdminProtectedAttribute>() is not null)
        {
            var token = context.Request.Headers.Authorization.ToString();
            token = token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                ? token["Bearer ".Length..].Trim()
                : null;

            var configuredUsername = configuration["AdminAccess:Username"] ?? string.Empty;
            if (!tokenService.IsValid(token, configuredUsername))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }
        }

        await next(context);
    }
}
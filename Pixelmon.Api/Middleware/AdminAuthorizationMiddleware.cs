using Pixelmon.Api.Attributes;
using Pixelmon.Api.Services;

namespace Pixelmon.Api.Middleware;

public sealed class AdminAuthorizationMiddleware(
    RequestDelegate next,
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

            if (!tokenService.IsValid(token, out var authToken))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            var protectedRoute = context.GetEndpoint()!.Metadata.GetMetadata<AdminProtectedAttribute>()!;
            if (authToken!.PermissionLevel > protectedRoute.MinimumPermissionLevel)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return;
            }

            context.Items[nameof(AuthToken)] = authToken;
        }

        await next(context);
    }
}
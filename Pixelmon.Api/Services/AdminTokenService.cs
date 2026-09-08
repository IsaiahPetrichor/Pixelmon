using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Pixelmon.Api.Services;

public sealed class AdminTokenService(IConfiguration configuration)
{
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(1);
    private readonly byte[] _signingKey = Encoding.UTF8.GetBytes(configuration["AdminAccess:ApiKey"] ?? string.Empty);

    public string CreateToken(string username)
    {
        var payload = new AdminTokenPayload(username, DateTimeOffset.UtcNow.Add(TokenLifetime).ToUnixTimeSeconds());
        var payloadBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(payload));
        var encodedPayload = Base64UrlEncode(payloadBytes);
        var signature = Sign(encodedPayload);

        return $"{encodedPayload}.{signature}";
    }

    public bool IsValid(string? token, string configuredUsername)
    {
        if (string.IsNullOrWhiteSpace(token)) return false;

        var tokenParts = token.Split('.', 2);
        if (tokenParts.Length != 2) return false;

        var expectedSignature = Sign(tokenParts[0]);
        var providedSignature = Encoding.UTF8.GetBytes(tokenParts[1]);
        var expectedSignatureBytes = Encoding.UTF8.GetBytes(expectedSignature);

        if (providedSignature.Length != expectedSignatureBytes.Length ||
            !CryptographicOperations.FixedTimeEquals(providedSignature, expectedSignatureBytes))
        {
            return false;
        }

        try
        {
            var payload = JsonSerializer.Deserialize<AdminTokenPayload>(Base64UrlDecode(tokenParts[0]));
            return payload is not null &&
                FixedTimeEquals(payload.Username, configuredUsername) &&
                payload.ExpiresAt > DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        }
        catch (FormatException)
        {
            return false;
        }
        catch (JsonException)
        {
            return false;
        }
    }

    private string Sign(string value)
    {
        return Base64UrlEncode(HMACSHA256.HashData(_signingKey, Encoding.UTF8.GetBytes(value)));
    }

    private static bool FixedTimeEquals(string providedValue, string configuredValue)
    {
        var providedBytes = Encoding.UTF8.GetBytes(providedValue);
        var configuredBytes = Encoding.UTF8.GetBytes(configuredValue);

        return providedBytes.Length == configuredBytes.Length &&
            CryptographicOperations.FixedTimeEquals(providedBytes, configuredBytes);
    }

    private static string Base64UrlEncode(byte[] bytes)
    {
        return Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    }

    private static byte[] Base64UrlDecode(string value)
    {
        var paddedValue = value.Replace('-', '+').Replace('_', '/');
        paddedValue += new string('=', (4 - paddedValue.Length % 4) % 4);
        return Convert.FromBase64String(paddedValue);
    }

    private sealed record AdminTokenPayload(string Username, long ExpiresAt);
}
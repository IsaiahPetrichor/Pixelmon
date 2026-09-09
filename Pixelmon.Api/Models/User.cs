namespace Pixelmon.Api.Models;

public class User
{
    public required int Id { get; set; }
    public required string Username { get; set; }
    public string? PasswordHash { get; set; }
    public required int RankId { get; set; }
    public required DateTime CreatedAt { get; set; }
}

public sealed record AuthenticatedUser(int Id, string Username, string PasswordHash, int PermissionLevel);
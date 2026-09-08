namespace Pixelmon.Api.Models;

public class StaffRank
{
    public required int Id { get; set; }
    public required string RankName { get; set; }
    public required int PermissionLevel { get; set; }
}
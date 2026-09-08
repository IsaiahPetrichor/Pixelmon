namespace Pixelmon.Api.Models;

public class WorkItem
{
    public required int Id { get; set; }
    public required int RegionId { get; set; }
    public required int RouteId { get; set; }
    public int AssignedToId { get; set; }
    public required int WorkAreaId { get; set; }
    public required int StatusId { get; set; }
    public required string ShortDescription { get; set; }
    public string? LongDescription { get; set; }
}
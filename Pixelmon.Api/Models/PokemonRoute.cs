namespace Pixelmon.Api.Models;

public class PokemonRoute
{
    public required int Id { get; set; }
    public required int RegionId { get; set; }
    public required string RouteName { get; set; }
}
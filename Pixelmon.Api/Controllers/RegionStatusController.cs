using Microsoft.AspNetCore.Mvc;

namespace Pixelmon.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class RegionStatusController(ILogger<RegionStatusController> logger) : ControllerBase
{
    private readonly ILogger<RegionStatusController> _logger = logger;

    [HttpGet]
    public async Task<IActionResult> GetRegionStatuses()
    {
        _logger.LogInformation("GetRegionStatuses called.");

        var statuses = new { kanto = 74, hoenn = 32, sinnoh = 7 };
        return Ok(statuses);
    }

    [HttpGet("GetKantoStatus")]
    public async Task<IActionResult> GetKantoStatus()
    {
        _logger.LogInformation("GetKantoStatus called.");

        var status = new { regionName = "Kanto", Message = "Kanto is in progress." };
        return Ok(status);
    }

}

using Microsoft.AspNetCore.Mvc;

namespace Pixelmon.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class KantoStatusController(ILogger<KantoStatusController> logger) : ControllerBase
{
    private readonly ILogger<KantoStatusController> _logger = logger;

    [HttpGet(Name = "GetKantoStatus")]
    public async Task<IActionResult> GetKantoStatus()
    {
        _logger.LogInformation("GetKantoStatus called.");
        var status = new { Message = "Kanto is in progress." };
        return Ok(status);
    }
}

using Microsoft.AspNetCore.Mvc;
using Pixelmon.Api.Services;

namespace Pixelmon.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseTestController(
    ILogger<DatabaseTestController> logger,
    IDatabaseService databaseService) : ControllerBase
{
    private readonly ILogger<DatabaseTestController> _logger = logger;
    private readonly IDatabaseService _databaseService = databaseService;

    [HttpGet("GetRegions")]
    public async Task<IActionResult> GetRegions(CancellationToken cancellationToken)
    {
        _logger.LogInformation("[GetRegions] called. returning all database entries");

        var regions = await _databaseService.QueryRegions(cancellationToken);

        return Ok(regions);
    }

    [HttpGet("GetRoutes")]
    public async Task<IActionResult> GetRoutes(CancellationToken cancellationToken)
    {
        _logger.LogInformation("[GetRoutes] called. returning all routes.");

        var routes = await _databaseService.QueryRoutes(cancellationToken);

        return Ok(routes);
    }

    [HttpGet("GetWorkAreas")]
    public async Task<IActionResult> GetWorkAreas(CancellationToken cancellationToken)
    {
        _logger.LogInformation("[GetWorkAreas] called. returning all work areas.");

        var workAreas = await _databaseService.QueryWorkAreas(cancellationToken);

        return Ok(workAreas);
    }

    [HttpGet("GetStaffRanks")]
    public async Task<IActionResult> GetStaffRanks(CancellationToken cancellationToken)
    {
        _logger.LogInformation("[GetStaffRanks] called. returning all staff ranks.");

        var staffRanks = await _databaseService.QueryStaffRanks(cancellationToken);

        return Ok(staffRanks);
    }

    [HttpGet("GetStaff")]
    public async Task<IActionResult> GetStaff(CancellationToken cancellationToken)
    {
        _logger.LogInformation("[GetStaff] called. returning all staff.");

        var staff = await _databaseService.QueryStaff(cancellationToken);

        return Ok(staff);
    }

    [HttpGet("GetWorkItemStatuses")]
    public async Task<IActionResult> GetWorkItemStatuses(CancellationToken cancellationToken)
    {
        _logger.LogInformation("[GetWorkItemStatuses] called. returning all work item statuses.");

        var statuses = await _databaseService.QueryWorkItemStatuses(cancellationToken);

        return Ok(statuses);
    }

    [HttpGet("GetWorkItems")]
    public async Task<IActionResult> GetWorkItems(CancellationToken cancellationToken)
    {
        _logger.LogInformation("[GetWorkItems] called. returning all work items.");

        var workItems = await _databaseService.QueryWorkItems(cancellationToken);

        return Ok(workItems);
    }
}
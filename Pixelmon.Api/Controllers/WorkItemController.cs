using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Pixelmon.Api.Attributes;
using Pixelmon.Api.Models;
using Pixelmon.Api.Services;

namespace Pixelmon.Api.Controllers;

[ApiController]
[AdminProtected]
[Route("[controller]")]
public class WorkItemController(ILogger<WorkItemController> logger, IDatabaseService databaseService) : ControllerBase
{
    private readonly ILogger<WorkItemController> _logger = logger;
    private readonly IDatabaseService _databaseService = databaseService;

    [HttpGet("GetWorkItems/{regionName}")]
    public async Task<IActionResult> GetWorkItemsByRegion(string regionName, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"[GetWorkItems/{regionName}] called. returning all work items.");

        var regions = await _databaseService.QueryRegions(cancellationToken);
        var workItems = await _databaseService.QueryWorkItems(cancellationToken);

        var region = regions.SingleOrDefault((region) => region.RegionName.Equals(regionName, StringComparison.CurrentCultureIgnoreCase));

        if (region == null) return BadRequest("Invalid region provided");

        var workItemsForRegion = workItems.Select((workItem) => workItem.RegionId == region.Id);

        return Ok(workItemsForRegion);
    }

    [AdminProtected(minimumPermissionLevel: 2)]
    [HttpPost("AddWorkItem")]
    public async Task<IActionResult> CreateWorkItem([FromBody] WorkItemRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"[CreateWorkItem] called. making work item with data:\n{JsonSerializer.Serialize(request)}");

        bool createdInDb = await _databaseService.CreateWorkItem(request, cancellationToken);

        if (createdInDb)
        {
            return Created(string.Empty, request);
        }
        else
        {
            return BadRequest("Failed to create object in database, check your request parameters and try again.");
        }
    }

    [HttpPut("UpdateWorkItem/{id:int}")]
    public async Task<IActionResult> UpdateWorkItem(int id, [FromBody] WorkItemRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"[UpdateWorkItem/{id}] called. updating work item with data:\n{JsonSerializer.Serialize(request)}");

        bool updatedInDb = await _databaseService.UpdateWorkItem(id, request, cancellationToken);

        return updatedInDb
            ? NoContent()
            : NotFound("Work item was not found or could not be updated.");
    }

    [AdminProtected(minimumPermissionLevel: 2)]
    [HttpDelete("DeleteWorkItem/{id:int}")]
    public async Task<IActionResult> DeleteWorkItem(int id, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"[DeleteWorkItem/{id}] called. deleting work item.");

        bool deletedInDb = await _databaseService.DeleteWorkItem(id, cancellationToken);

        return deletedInDb
            ? NoContent()
            : NotFound("Work item was not found.");
    }
}
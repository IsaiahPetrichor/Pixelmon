using Microsoft.AspNetCore.Mvc;
using Pixelmon.Api.Services;

namespace Pixelmon.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class RegionStatusController(ILogger<RegionStatusController> logger, IDatabaseService databaseService) : ControllerBase
{
    private readonly ILogger<RegionStatusController> _logger = logger;
    private readonly IDatabaseService _databaseService = databaseService;

    [HttpGet]
    public async Task<IActionResult> GetRegionStatuses()
    {
        _logger.LogInformation("GetRegionStatuses called.");

        var regions = await _databaseService.QueryRegions();
        var routes = await _databaseService.QueryRoutes();
        var workAreas = await _databaseService.QueryWorkAreas();
        var workItems = await _databaseService.QueryWorkItems();

        Dictionary<string, double> allRegions = [];
        // seperate Regions
        foreach (var region in regions)
        {
            double regionCompletion = 0.00;

            Dictionary<string, double> allRoutes = [];
            // within each region seperate routes
            foreach (var route in routes)
            {
                double routeCompletion = 0.00;
                if (route.RegionId != region.Id) continue;

                var routeWorkItems = workItems
                    .Where(workItem => workItem.RegionId == region.Id && workItem.RouteId == route.Id)
                    .ToArray();
                if (routeWorkItems.Length == 0)
                {
                    allRoutes[route.RouteName] = 0.00;
                    continue;
                }

                Dictionary<string, double> allWorkAreas = [];
                // within each route seperate work items by Work Area
                foreach (var workArea in workAreas)
                {
                    // calculate the ratio of work items complete to incomplete for each area
                    var areaWorkItems = routeWorkItems.Where(workItem => workItem.WorkAreaId == workArea.Id).ToArray();
                    var completeItems = areaWorkItems.Count(workItem => workItem.StatusId == 3);
                    var totalItems = areaWorkItems.Length;

                    if (totalItems > 0)
                    {
                        allWorkAreas[workArea.AreaName] = (double)completeItems / totalItems;
                    }
                }
                // use work area ratios to calculate the average completion for the Route
                routeCompletion = allWorkAreas.Count > 0
                    ? allWorkAreas.Values.Average()
                    : 0.00;
                allRoutes[route.RouteName] = routeCompletion;
            }
            // use route ratios to calculate the average completion for the Region
            regionCompletion = allRoutes.Count > 0
                ? allRoutes.Values.Average()
                : 0.00;
            allRegions[region.RegionName] = Math.Floor(regionCompletion * 100);
        }
        // return the final completion for each region
        return Ok(allRegions);
    }

    [HttpGet("GetDetailedStatus")]
    public async Task<IActionResult> GetDetailedStatus()
    {
        _logger.LogInformation("GetDetailedStatus called.");

        var regions = await _databaseService.QueryRegions();
        var routes = await _databaseService.QueryRoutes();
        var workAreas = await _databaseService.QueryWorkAreas();
        var workItems = await _databaseService.QueryWorkItems();

        Dictionary<string, Dictionary<string, Dictionary<string, double>>> detailedStatus = [];

        foreach (var region in regions)
        {
            Dictionary<string, Dictionary<string, double>> regionStatus = [];

            foreach (var route in routes.Where(route => route.RegionId == region.Id))
            {
                Dictionary<string, double> routeStatus = [];
                var routeWorkItems = workItems
                    .Where(workItem => workItem.RegionId == region.Id && workItem.RouteId == route.Id)
                    .ToArray();
                if (routeWorkItems.Length == 0)
                {
                    regionStatus[route.RouteName] = routeStatus;
                    continue;
                }

                foreach (var workArea in workAreas)
                {
                    var areaWorkItems = routeWorkItems.Where(workItem => workItem.WorkAreaId == workArea.Id).ToArray();
                    var completeItems = areaWorkItems.Count(workItem => workItem.StatusId == 3);
                    var totalItems = areaWorkItems.Length;

                    if (totalItems > 0)
                    {
                        routeStatus[workArea.AreaName] = (double)completeItems / totalItems;
                    }
                }

                regionStatus[route.RouteName] = routeStatus;
            }

            detailedStatus[region.RegionName] = regionStatus;

        }
        return Ok(detailedStatus);
    }

}

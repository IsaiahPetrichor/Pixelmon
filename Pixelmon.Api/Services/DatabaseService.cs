using Npgsql;
using Pixelmon.Api.Models;

namespace Pixelmon.Api.Services;

public interface IDatabaseService
{
    Task<IReadOnlyList<T>> QueryAsync<T>(
        string sql,
        Func<NpgsqlDataReader, T> map,
        IEnumerable<NpgsqlParameter>? parameters = null,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PokemonRegion>> QueryRegions(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PokemonRoute>> QueryRoutes(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WorkArea>> QueryWorkAreas(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<StaffRank>> QueryStaffRanks(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Staff>> QueryStaff(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WorkItemStatus>> QueryWorkItemStatuses(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WorkItem>> QueryWorkItems(CancellationToken cancellationToken = default);
}

public sealed class DatabaseService(NpgsqlDataSource dataSource) : IDatabaseService
{
    public async Task<IReadOnlyList<T>> QueryAsync<T>(
        string sql,
        Func<NpgsqlDataReader, T> map,
        IEnumerable<NpgsqlParameter>? parameters = null,
        CancellationToken cancellationToken = default)
    {
        await using var command = dataSource.CreateCommand(sql);

        if (parameters is not null)
        {
            command.Parameters.AddRange(parameters.ToArray());
        }

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        var results = new List<T>();

        while (await reader.ReadAsync(cancellationToken))
        {
            results.Add(map(reader));
        }

        return results;
    }

    public async Task<IReadOnlyList<PokemonRegion>> QueryRegions(CancellationToken cancellationToken = default)
    {
        var regions = await QueryAsync(
            "SELECT id, region_name FROM regions",
            reader => new PokemonRegion
            {
                Id = reader.GetInt32(0),
                RegionName = reader.GetString(1)
            },
            cancellationToken: cancellationToken);

        return regions;
    }

    public async Task<IReadOnlyList<PokemonRoute>> QueryRoutes(CancellationToken cancellationToken = default)
    {
        var routes = await QueryAsync(
            "SELECT id, region_id, route_name FROM routes",
            reader => new PokemonRoute
            {
                Id = reader.GetInt32(0),
                RegionId = reader.GetInt32(1),
                RouteName = reader.GetString(2)
            },
            cancellationToken: cancellationToken);

        return routes;
    }

    public async Task<IReadOnlyList<WorkArea>> QueryWorkAreas(CancellationToken cancellationToken = default)
    {
        var workAreas = await QueryAsync(
            "SELECT id, area_name FROM workareas",
            reader => new WorkArea
            {
                Id = reader.GetInt32(0),
                AreaName = reader.GetString(1)
            },
            cancellationToken: cancellationToken);

        return workAreas;
    }

    public async Task<IReadOnlyList<StaffRank>> QueryStaffRanks(CancellationToken cancellationToken = default)
    {
        var staffRanks = await QueryAsync(
            "SELECT id, rank_name, permission_level FROM staffranks",
            reader => new StaffRank
            {
                Id = reader.GetInt32(0),
                RankName = reader.GetString(1),
                PermissionLevel = reader.GetInt32(2)
            },
            cancellationToken: cancellationToken);

        return staffRanks;
    }

    public async Task<IReadOnlyList<Staff>> QueryStaff(CancellationToken cancellationToken = default)
    {
        var staff = await QueryAsync(
            "SELECT id, username, rank_id FROM staff",
            reader => new Staff
            {
                Id = reader.GetInt32(0),
                Username = reader.GetString(1),
                RankId = reader.GetInt32(2)
            },
            cancellationToken: cancellationToken);

        return staff;
    }

    public async Task<IReadOnlyList<WorkItemStatus>> QueryWorkItemStatuses(CancellationToken cancellationToken = default)
    {
        var statuses = await QueryAsync(
            "SELECT id, status_name FROM workitemstatuses",
            reader => new WorkItemStatus
            {
                Id = reader.GetInt32(0),
                StatusName = reader.GetString(1)
            },
            cancellationToken: cancellationToken);

        return statuses;
    }

    public async Task<IReadOnlyList<WorkItem>> QueryWorkItems(CancellationToken cancellationToken = default)
    {
        var workItems = await QueryAsync(
            "SELECT id, region_id, route_id, assigned_to_id, work_area_id, status_id, short_description, long_description FROM workitems",
            reader => new WorkItem
            {
                Id = reader.GetInt32(0),
                RegionId = reader.GetInt32(1),
                RouteId = reader.GetInt32(2),
                AssignedToId = reader.GetInt32(3),
                WorkAreaId = reader.GetInt32(4),
                StatusId = reader.GetInt32(5),
                ShortDescription = reader.GetString(6),
                LongDescription = reader.IsDBNull(7) ? null : reader.GetString(7)
            },
            cancellationToken: cancellationToken);

        return workItems;
    }
}

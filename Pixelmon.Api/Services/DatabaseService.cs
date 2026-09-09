using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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

    Task<IReadOnlyList<User>> QueryUsers(CancellationToken cancellationToken = default);

    Task<AuthenticatedUser?> QueryUserForAuthentication(string username, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WorkItemStatus>> QueryWorkItemStatuses(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WorkItem>> QueryWorkItems(CancellationToken cancellationToken = default);

    Task<bool> CreateWorkItem(WorkItemRequest workItem, CancellationToken cancellationToken = default);

    Task<bool> UpdateWorkItem(int id, WorkItemRequest workItem, CancellationToken cancellationToken = default);

    Task<bool> DeleteWorkItem(int id, CancellationToken cancellationToken = default);
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

    public async Task<int> CreateAsync<T>(
       string sql,
       IEnumerable<NpgsqlParameter>? parameters = null,
       CancellationToken cancellationToken = default)
    {
        await using var command = dataSource.CreateCommand(sql);

        if (parameters is not null)
        {
            command.Parameters.AddRange(parameters.ToArray());
        }

        int rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);

        return rowsAffected;
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

    public async Task<IReadOnlyList<User>> QueryUsers(CancellationToken cancellationToken = default)
    {
        var user = await QueryAsync(
            "SELECT id, username, rank_id, created_at FROM users",
            reader => new User
            {
                Id = reader.GetInt32(0),
                Username = reader.GetString(1),
                RankId = reader.GetInt32(2),
                CreatedAt = reader.GetDateTime(3)
            },
            cancellationToken: cancellationToken);

        return user;
    }

    public async Task<AuthenticatedUser?> QueryUserForAuthentication(
        string username,
        CancellationToken cancellationToken = default)
    {
        var users = await QueryAsync(
            @"SELECT users.id, users.username, users.password_hash, staffranks.permission_level
              FROM users
              INNER JOIN staffranks ON staffranks.id = users.rank_id
              WHERE users.username = $1
              LIMIT 1",
            reader => new AuthenticatedUser(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                reader.GetInt32(3)),
            [new NpgsqlParameter { Value = username }],
            cancellationToken);

        return users.SingleOrDefault();
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

    public async Task<bool> CreateWorkItem(WorkItemRequest workitem, CancellationToken cancellationToken = default)
    {
        var numberCreated = await CreateAsync<WorkItem>(
            @"INSERT INTO workitems (region_id, route_id, assigned_to_id, work_area_id, status_id, short_description, long_description)
                VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [
                new NpgsqlParameter { Value = workitem.RegionId },
                new NpgsqlParameter { Value = workitem.RouteId },
                new NpgsqlParameter { Value = workitem.AssignedToId },
                new NpgsqlParameter { Value = workitem.WorkAreaId },
                new NpgsqlParameter { Value = workitem.StatusId },
                new NpgsqlParameter { Value = workitem.ShortDescription },
                new NpgsqlParameter { Value = workitem.LongDescription }
            ],
            cancellationToken: cancellationToken);

        return numberCreated > 0;
    }

    public async Task<bool> UpdateWorkItem(int id, WorkItemRequest workitem, CancellationToken cancellationToken = default)
    {
        var numberUpdated = await CreateAsync<WorkItem>(
            @"UPDATE workitems
                SET region_id = $1, route_id = $2, assigned_to_id = $3, work_area_id = $4,
                    status_id = $5, short_description = $6, long_description = $7
                WHERE id = $8",
            [
                new NpgsqlParameter { Value = workitem.RegionId },
                new NpgsqlParameter { Value = workitem.RouteId },
                new NpgsqlParameter { Value = workitem.AssignedToId },
                new NpgsqlParameter { Value = workitem.WorkAreaId },
                new NpgsqlParameter { Value = workitem.StatusId },
                new NpgsqlParameter { Value = workitem.ShortDescription },
                new NpgsqlParameter { Value = (object?)workitem.LongDescription ?? DBNull.Value },
                new NpgsqlParameter { Value = id }
            ],
            cancellationToken: cancellationToken);

        return numberUpdated > 0;
    }

    public async Task<bool> DeleteWorkItem(int id, CancellationToken cancellationToken = default)
    {
        var numberDeleted = await CreateAsync<WorkItem>(
            "DELETE FROM workitems WHERE id = $1",
            [new NpgsqlParameter { Value = id }],
            cancellationToken: cancellationToken);

        return numberDeleted > 0;
    }
}

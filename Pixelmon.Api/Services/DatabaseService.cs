using Npgsql;

namespace Pixelmon.Api.Services;

public interface IDatabaseService
{
    Task<IReadOnlyList<T>> QueryAsync<T>(
        string sql,
        Func<NpgsqlDataReader, T> map,
        IEnumerable<NpgsqlParameter>? parameters = null,
        CancellationToken cancellationToken = default);
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
}

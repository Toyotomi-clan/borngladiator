using Dapper;
using Npgsql;

namespace Borngladiator.Gladiator.Helper;

public static class DapperHelper
{
  public static async Task ExecuteWrite(CancellationToken ct, string sql, object paramsValue, string connectionString)
  {
    await using var connection = new NpgsqlConnection(connectionString);

    await connection.OpenAsync(ct);

    await using var transaction = await connection.BeginTransactionAsync(ct);

    await connection.ExecuteAsync(sql, paramsValue, transaction);

    await transaction.CommitAsync(ct);
  }
  public static async Task ExecuteMultipleWrite(CancellationToken ct, Dictionary<string,object> inserts,string connectionString)
  {
    await using var connection = new NpgsqlConnection(connectionString);

    await connection.OpenAsync(ct);

    await using var transaction = await connection.BeginTransactionAsync(ct);

    foreach (var (sql,paramsValue) in inserts)
    {
      await connection.ExecuteAsync(sql, paramsValue, transaction);
    }
    await transaction.CommitAsync(ct);
  }

  public static async Task<IEnumerable<T>?> Query<T>(string sql, object paramsValue, string connectionString)
  {
    await using var connection = new NpgsqlConnection(connectionString);

    await connection.OpenAsync();

    var query = connection.Query<T>(sql,paramsValue);

    return query;
  }
}

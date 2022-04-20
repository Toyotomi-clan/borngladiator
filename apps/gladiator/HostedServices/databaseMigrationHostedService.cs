namespace Borngladiator.Gladiator.HostedServices;

using DbUp;

public class databaseMigrationHostedService : IHostedService
{
  private IConfiguration _configuration;
  public databaseMigrationHostedService(IConfiguration configuration)
  {
    _configuration = configuration;
  }
  public Task StartAsync(CancellationToken cancellationToken)
  {
    //Todo: move this in a better location
    var connectionString = _configuration.GetSection("database:connection");

    if (connectionString == null || connectionString.Value == null)
    {
      throw new InvalidOperationException("require connection string");
    }

    var databaseScriptFolder = _configuration.GetSection("database:databaseScriptFolder");

    if (databaseScriptFolder == null || databaseScriptFolder.Value == null)
    {
      throw new InvalidOperationException("require database scripts folder for migration");
    }

    var currentDirectory = Directory.GetCurrentDirectory();
    var dbScriptsFolder = Directory.GetDirectories(currentDirectory,databaseScriptFolder.Value);

    var upgrader =
      DeployChanges.To
        .PostgresqlDatabase(connectionString.Value)
        .WithTransactionPerScript()
        .WithScriptsFromFileSystem(dbScriptsFolder[0])
        .LogToConsole()
        .Build();

    var isConnectSuccessful = upgrader.TryConnect(out var errorMessage);

    if (!isConnectSuccessful && !string.IsNullOrWhiteSpace(errorMessage))
    {
      throw new InvalidOperationException("Unable to connect to db");
    }

    var isUpgradeNeeded = upgrader.IsUpgradeRequired();

    if (isUpgradeNeeded)
    {
      //perform upgrade
      var result = upgrader.PerformUpgrade();

      if (!result.Successful)
      {
        //Todo: log
        throw new InvalidOperationException("Unable to upgrade db");
      }
      //Todo: log successful upgrade
    }
    return Task.CompletedTask;
  }

  public Task StopAsync(CancellationToken cancellationToken)
  {
    return Task.CompletedTask;
  }
}


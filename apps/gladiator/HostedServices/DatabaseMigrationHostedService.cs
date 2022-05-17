namespace Borngladiator.Gladiator.HostedServices;

using DbUp;

public class DatabaseMigrationHostedService : IHostedService
{
  private readonly IConfiguration _configuration;
  private ILogger<DatabaseMigrationHostedService> _logger;
  public DatabaseMigrationHostedService(IConfiguration configuration, ILogger<DatabaseMigrationHostedService> logger)
  {
    _configuration = configuration;
    _logger = logger;
  }
  public Task StartAsync(CancellationToken cancellationToken)
  {
    _logger.LogInformation("Starting database check");

    var connectionString = _configuration.GetSection("Database:Connection");

    if (connectionString == null || connectionString.Value == null)
    {
      throw new InvalidOperationException("require connection string");
    }

    var databaseScriptFolder = _configuration.GetSection("Database:DatabaseScriptFolder");

    if (databaseScriptFolder == null || databaseScriptFolder.Value == null)
    {
      throw new InvalidOperationException("require database scripts folder for migration");
    }

    var currentDirectory = Directory.GetCurrentDirectory();
    var dbScriptsFolder = Directory.GetDirectories(currentDirectory,databaseScriptFolder.Value);

    try
    {
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
        _logger.LogError("Unable to connect to the database {@errorMessage}",errorMessage);
        throw new InvalidOperationException("Unable to connect to db");
      }


      var isUpgradeNeeded = upgrader.IsUpgradeRequired();

      _logger.LogInformation("upgrade is {@required}",isUpgradeNeeded);

      if (isUpgradeNeeded)
      {
        _logger.LogInformation("starting is upgrade");

        var scriptsToExecute = upgrader.GetScriptsToExecute().Select(x => x.Name);

        var result = upgrader.PerformUpgrade();

        if (!result.Successful)
        {
          _logger.LogError(result.Error, "Total scripts " +
                                         "{@totalScripts}" +
                                         " {@scriptsToExecute} " +
                                         "{@errorScripts}", result.Scripts.Count(), scriptsToExecute,
            result.ErrorScript);
          throw result.Error;
        }

        _logger.LogInformation("Successfully ran database upgrade {@scriptsApplied}", scriptsToExecute);
      }

      if (!isUpgradeNeeded)
      {
        _logger.LogInformation("No Database Upgrade required");
      }
    }

    catch (Exception e)
    {
      _logger.LogError(e,"Error occured database while attempting to init database check / upgrade");
      throw;
    }

    return Task.CompletedTask;
  }

  public Task StopAsync(CancellationToken cancellationToken)
  {
    return Task.CompletedTask;
  }
}


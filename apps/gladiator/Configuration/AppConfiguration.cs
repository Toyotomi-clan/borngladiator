namespace Borngladiator.Gladiator.Configuration;

public class AppConfiguration
{
  public string SENDGRID_API_KEY { get; set; }

  public DatabaseOptions Database { get; set; }

  public OryOptions Ory { get; set; }

  public SendGridOptions SendGrid { get; set; }

  public ScheduleOptions Schedule { get; set; }

  public string HashIdsSalt { get; set; }

  public LifeExpectancyOptions LifeExpectancy { get; set; }

  public bool RunHostedService { get; set; }
}

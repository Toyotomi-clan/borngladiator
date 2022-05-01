using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Helper;
using Microsoft.Extensions.Options;
using Quartz;
using SendGrid;
using SendGrid.Helpers.Mail;
using Serilog;
using ILogger = Serilog.ILogger;

namespace Borngladiator.Gladiator.Cron;

[DisallowConcurrentExecution]

public class SendDailyEmail : IJob
{
  private readonly ILogger<SendDailyEmail> _logger;
  private readonly AppConfiguration _configuration;

  public SendDailyEmail(ILogger<SendDailyEmail> logger, IOptionsSnapshot<AppConfiguration> configuration)
  {
    _logger = logger;
    _configuration = configuration.Value;
  }


  public async Task Execute(IJobExecutionContext context)
  {
    _logger.LogInformation("starting email cron job at {@time}",DateTime.UtcNow);

    var sendgridKey = _configuration.SENDGRID_API_KEY;

    var client = new SendGridClient(sendgridKey);

    var from = new EmailAddress(_configuration.SendGrid.EmailFrom, "welcome to death clock");

    var users = await GetUsers();

    if (!(users.Item1.Count > 0))
    {
      _logger.LogInformation("no users to send email to");
      return;
    }

    if (!(users.Item2.Count > 0))
    {
      _logger.LogInformation("no params to contain user data for cron email job");
      return;
    }

    if (users.Item1.Count != users.Item2.Count)
    {
      _logger.LogInformation("{@users} don't match custom {@params} to send to",users.Item1.Count,users.Item2.Count);
      return;
    }

    //Todo: allow sendgrid to enable user to unsubscribe
    var msg = MailHelper
      .CreateMultipleTemplateEmailsToMultipleRecipients(from,users.Item1,_configuration.SendGrid.DailyReminderTemplateId,users.Item2);

    var response = await client.SendEmailAsync(msg);

    //check for response success or failure
    if (!response.IsSuccessStatusCode)
    {
      //Todo: log it
      //Todo: retry sending it later
    }

  }

  private async Task<Tuple<List<EmailAddress>,List<object>>> GetUsers()
  {
    var dictionary = new Dictionary<EmailAddress, object>();

    var getUserSql = @"select username,email,date_of_birth as DateOfBirth,subscribed from users";


    var users = await DapperHelper.Query<UserDto>(getUserSql, null, _configuration.Database.Connection);

    var userDtos = users as UserDto[] ?? users.ToArray();

    if (!userDtos.Any())
    {

      _logger.LogInformation("No users to send daily email out");

      return new Tuple<List<EmailAddress>, List<object>>(new List<EmailAddress>(), new List<object>());
    }

    foreach (var user in userDtos)
    {
      if (!user.Subscribed)
      {
        continue;
      }
      var email = new EmailAddress(user.Email, user.Username);

      var averageLifeExpectancy = user.Gender switch
      {
        "male" => _configuration.LifeExpectancy.Male,
        "female" => _configuration.LifeExpectancy.Female,
        _ => throw new InvalidOperationException("Must be either male or female")
      };

      var userParams = new
      {
        days_left = LifeExpectancyHelper.DaysLeft(averageLifeExpectancy,user.DateOfBirth),
        days_sleep = LifeExpectancyHelper.DaysLeft(averageLifeExpectancy,user.DateOfBirth, 0.3),
        days_work = LifeExpectancyHelper.DaysLeft(averageLifeExpectancy,user.DateOfBirth, 0.6),
        username = user.Username
      };

      if (!dictionary.TryAdd(email, userParams))
      {
        _logger.LogError("Unable to send email to {@user} in daily job with {@params}",email,userParams);
      }
    }

    return new Tuple<List<EmailAddress>, List<object>>(dictionary.Keys.ToList(),dictionary.Values.ToList());
  }
}

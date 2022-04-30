namespace Borngladiator.Gladiator.Configuration;

public class SendGridOptions
{
  public string EmailFrom { get; set; }

  public string WelcomeTemplateId { get; set; }

  //Todo: add this to the json
  //public string SendGridApiKey { get; set; }
}

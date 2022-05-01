namespace Borngladiator.Gladiator.Helper;

public static class LifeExpectancyHelper
{
  public static int TotalDaysLivedAndLeft(int averageExpectancy, DateTime dateOfBirth)
  {
    var userLifeExpectancy = dateOfBirth.AddYears(averageExpectancy);

    var difference = userLifeExpectancy.Subtract(dateOfBirth).TotalDays;

    return (int)difference;
  }
  public static int DaysLeft(int averageExpectancy, DateTime dateOfBirth)
  {
    var yearsLeft = dateOfBirth.AddYears(averageExpectancy);

    var difference = yearsLeft.Subtract(DateTime.UtcNow).TotalDays;

    return (int)difference;
  }
  public static int DaysLeft(int averageExpectancy, DateTime dateOfBirth,double after)
  {
    var difference = DaysLeft(averageExpectancy,dateOfBirth);

    var afterSleep = Convert.ToInt32(Math.Floor(difference - (difference * after)));

    return afterSleep;
  }
}

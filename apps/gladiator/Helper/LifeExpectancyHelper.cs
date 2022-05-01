namespace Borngladiator.Gladiator.Helper;

public static class LifeExpectancyHelper
{
  public static int DaysLeft(int averageExpectancy, DateTime dateOfBirth)
  {
    var userLifeExpectancy = dateOfBirth.AddYears(averageExpectancy);

    var difference = Convert.ToInt32(Math.Floor((userLifeExpectancy - dateOfBirth).TotalDays));

    return difference;
  }
  public static int DaysLeft(int averageExpectancy, DateTime dateOfBirth,double after)
  {
    var difference = DaysLeft(averageExpectancy,dateOfBirth);

    var afterSleep = Convert.ToInt32(Math.Floor(difference - (difference * after)));

    return afterSleep;
  }
}

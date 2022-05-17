namespace Borngladiator.Gladiator.Helper;

public static class LifeExpectancyHelper
{

  public static int GetAge(DateTime dateOfBirth)
  {
    return (DateTime.UtcNow.Year - dateOfBirth.Year);
  }
  public static DateTime LifeLeft(int averageExpectancy, DateTime dateOfBirth)
  {
    return dateOfBirth.AddYears(averageExpectancy);
  }
  public static int DaysLeft(int averageExpectancy, DateTime dateOfBirth)
  {
    var yearsLeft = dateOfBirth.AddYears(averageExpectancy);

    var difference = yearsLeft.Subtract(DateTime.UtcNow).TotalDays;

    return (int)difference;
  }

  public static int DaysSpent( DateTime dateOfBirth)
  {
    var daysSpent = DateTime.UtcNow.Subtract(dateOfBirth).TotalDays;

    return (int)daysSpent;
  }
}

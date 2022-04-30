using Borngladiator.Gladiator.Helper;
using Microsoft.AspNetCore.Authentication;

namespace Borngladiator.Gladiator.Features.CreateUser;

public static class SqlHelper
{
  public static Dictionary<string, object> CreateSqlDictionary(CreateUserDto req, AuthenticationTicket userPrinciple)
  {
    var createUserParams = new
    {
      user_id = userPrinciple.Principal.GetUserId(),
      username = userPrinciple.Principal.Identity?.Name,
      email = userPrinciple.Principal.GetUserEmail(),
      date_of_birth = req.DateOfBirth, subscribed = true,
      gender = req.Gender
    };

    var createUserSql =
      @"INSERT INTO users (user_id,username,email,date_of_birth,subscribed, gender)
      Values (@user_id,@username,@email,@date_of_birth,@subscribed,(select id from gender where gender = @gender) );";

    var userLastCheckedInParams = new
    {
      user_id = userPrinciple.Principal.GetUserId(),
      last_logged_in = DateTime.UtcNow
    };

    var userLastCheckedInSql = "INSERT INTO last_checking (user_id,last_logged_in) Values (@user_id,@last_logged_in);";

    var inserts = new Dictionary<string, object>
    {
      {createUserSql, createUserParams},
      {userLastCheckedInSql, userLastCheckedInParams}
    };
    return inserts;
  }
}

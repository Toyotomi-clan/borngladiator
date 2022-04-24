using FastEndpoints;
using FluentValidation;

namespace Borngladiator.Gladiator.Features.CreateUser;

public class CreateUserValidator : Validator<CreateUserDto>
{
  public CreateUserValidator()
  {
    RuleFor(x => x.DateOfBirth).NotEmpty().WithMessage("date of birth is required")
      .LessThan(DateTime.UtcNow.AddYears(-18)).WithMessage("user must be older than 18");

    RuleFor(x => x.Gender).NotEmpty().WithMessage("gender is required")
      .Must(x => x.Equals("male") || x.Equals("female")).WithMessage("please select right gender");
  }
}

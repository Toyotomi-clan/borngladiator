using FastEndpoints;
using FluentValidation;

namespace Borngladiator.Gladiator.Features.Subscribe;

public class SubscribeValidator : Validator<SubscribeDto>
{
  public SubscribeValidator()
  {
    RuleFor(x => x.Subscribe).NotNull().WithMessage("must be true or false");

    RuleFor(x => x.UnsubscribeId).NotEmpty().WithMessage("please provide a valid string");
  }
}

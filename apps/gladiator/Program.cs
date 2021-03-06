using System.Globalization;
using System.Net;
using System.Text.Json;
using Borngladiator.Gladiator;
using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Cron;
using Borngladiator.Gladiator.HostedServices;
using Borngladiator.Gladiator.Middleware;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Quartz;
using RestSharp.Extensions;
using Serilog;
using Serilog.Exceptions;
using ILogger = Serilog.ILogger;
using User = Borngladiator.Gladiator.Features.Shared.User;

var builder = WebApplication.CreateBuilder(args);

//Todo: Figure out how to do this in an interface / class part of the app / build process
/*
 Without this this response dateOfBirth would been DateOfBirth
 * {
  "statusCode": 400,
  "message": "One or more errors occured!",
  "errors": {
    "dateOfBirth": [
      "user must be older than 18"
    ],
    "gender": [
      "please select right gender"
    ]
  }
}
 */
ValidatorOptions.Global.PropertyNameResolver = (type, member, expr) => member.Name.ToCamelCase(CultureInfo.InvariantCulture);


//Todo: Ensure all configurations are populated on startup
builder.Services.Configure<AppConfiguration>(builder.Configuration);

//Todo: Hosted services interfers with creating open api client, figure out how to schedule them
//Todo: enable msbuild to run hosted client then openapi or make open api a hosted service
if (bool.Parse(builder.Configuration["RunHostedService"]))
{
  builder.Services.AddHostedService<DatabaseMigrationHostedService>();

  builder.Services.AddQuartz(x =>
  {
    x.UseMicrosoftDependencyInjectionJobFactory();

    var jobKeyName = "SendDailyEmail";
    // Create a "key" for the job
    var jobKey = new JobKey(jobKeyName);

    // Register the job with the DI container
    x.AddJob<SendDailyEmail>(opts => opts.WithIdentity(jobKey));

    // Create a trigger for the job
    x.AddTrigger(opts => opts
      .ForJob(jobKey) // link to the HelloWorldJob
      .WithIdentity($"{jobKeyName}-trigger") // give the trigger a unique name
      .WithCronSchedule(builder.Configuration["Schedule:DailyEmailCronJob"])); // run every 5 seconds
  });

  builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
}


// Add services to the container.

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddFastEndpoints();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();


builder.Services.AddTransient<User>();

builder.Services.AddCors(options =>
{
  //Todo: Get list of origins from config
  if (builder.Configuration["ASPNETCORE_ENVIRONMENT"] == "Production")
  {
    options.AddPolicy("AllowLocalHostCORS", policyBuilder => policyBuilder
      .WithOrigins("https://www.stoictemple.com")
      .WithOrigins("https://stoictemple.com")
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials());
  }
  else
  {
    options.AddPolicy("AllowLocalHostCORS", policyBuilder => policyBuilder
      .WithOrigins("localhost:4000")
      .WithOrigins("localhost:4200")
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials());
  }
});

builder.Services.AddAuthentication(OryAuthenticationDefaults.AuthenticationScheme).AddOry(o =>
{
  o.Realm = "my realm hello!";
  o.EndPoint = "lol for bants";
  o.Slug = "competent-benz-v5hxi6dzh2";
});



builder.Services.AddMemoryCache();

builder.Services.AddAuthorization(options =>
{
  options.FallbackPolicy = new AuthorizationPolicyBuilder()
    .AddAuthenticationSchemes(OryAuthenticationDefaults.AuthenticationScheme)
    .RequireAuthenticatedUser()
    .Build();
});


builder.Services.AddSingleton(Log.Logger);


builder.Host.UseSerilog(((context, configuration) =>
{
  //Todo: utilise configuration by injecting it to serilog instead of
  //including it variable by variable
  configuration.WriteTo.Seq(
      builder.Configuration["Seq:Url"],
      apiKey:builder.Configuration["Seq:ApiKey"])
    .Enrich.WithExceptionDetails()
    .Enrich.WithDemystifiedStackTraces()
    .Enrich.FromLogContext();
}));


var app = builder.Build();
app.UseDefaultExceptionHandler(app.Services.GetService<Logger<Exception>>(),true);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
if (!app.Environment.IsDevelopment())
{
  app.UseHttpsRedirection();
}


//Todo: dev local cleanup
//Todo: make react and back end utilise https
//Currently if 1 utilises the http and other https (.net app) it won't be considered to be part of the same origin
//

app.UseCors("AllowLocalHostCORS");
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<EnrichLogWithUserDetailsMiddleware>();

app.UseFastEndpoints();

app.Run();

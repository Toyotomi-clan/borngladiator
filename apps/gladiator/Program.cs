using Borngladiator.Gladiator;
using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Cron;
using Borngladiator.Gladiator.HostedServices;
using Borngladiator.Gladiator.Middleware;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Quartz;
using Serilog;
using ILogger = Serilog.ILogger;
using User = Borngladiator.Gladiator.Features.Shared.User;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHostedService<databaseMigrationHostedService>();

// Add services to the container.

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddFastEndpoints();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();


//Todo: Ensure all configurations are populated on startup
builder.Services.Configure<AppConfiguration>(builder.Configuration);

builder.Services.AddTransient<User>();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowLocalHostCORS", policyBuilder => policyBuilder
    .WithOrigins("http://localhost:4000")
    .WithOrigins("http://localhost:4200")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials());
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

builder.Services.AddSingleton(Log.Logger);

builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);



builder.Host.UseSerilog(((context, configuration) =>
{
  configuration.WriteTo.Seq("http://localhost:5341/")
    .Enrich.FromLogContext();
}));


var app = builder.Build();


app.UseDefaultExceptionHandler(); //add this

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

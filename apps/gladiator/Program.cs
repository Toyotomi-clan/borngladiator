using System.Net.Http.Headers;
using System.Text.Encodings.Web;
using Borngladiator.Gladiator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

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


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Todo: dev local cleanup
//Todo: make react and back end utilise https
//Currently if 1 utilises the http and other https (.net app) it won't be considered to be part of the same origin
//app.UseHttpsRedirection();

app.UseCors("AllowLocalHostCORS");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

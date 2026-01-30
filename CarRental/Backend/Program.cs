using Backend.Data;
using Backend.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure to use Railway's PORT environment variable
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Add services to the container.
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddControllers();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<RefreshTokensService>();

// Build connection string from environment variables DIRECTLY
var mysqlHost = Environment.GetEnvironmentVariable("MYSQLHOST");
var mysqlPort = Environment.GetEnvironmentVariable("MYSQLPORT");
var mysqlDatabase = Environment.GetEnvironmentVariable("MYSQLDATABASE");
var mysqlUser = Environment.GetEnvironmentVariable("MYSQLUSER");
var mysqlPassword = Environment.GetEnvironmentVariable("MYSQLPASSWORD");

// Build the connection string
var connectionString = $"Server={mysqlHost};Port={mysqlPort};Database={mysqlDatabase};User={mysqlUser};Password={mysqlPassword};";

// Log connection attempt (for debugging)
Console.WriteLine($"Connecting to MySQL at {mysqlHost}:{mysqlPort}");

builder.Services.AddDbContext<ApplicatinDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:5173",
                "https://car-rental-dusky-nine.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});

// JWT configuration
var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "12345678901234567890123456789012";
var jwtIssuer = "CarRentalAPI";
var jwtAudience = "CarRentalClient";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});
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

// Build connection string from environment variables
var mysqlHost = Environment.GetEnvironmentVariable("MYSQLHOST");
var mysqlPort = Environment.GetEnvironmentVariable("MYSQLPORT");
var mysqlDatabase = Environment.GetEnvironmentVariable("MYSQLDATABASE");
var mysqlUser = Environment.GetEnvironmentVariable("MYSQLUSER");
var mysqlPassword = Environment.GetEnvironmentVariable("MYSQLPASSWORD");

// Log environment variables (without password)
Console.WriteLine($"MYSQLHOST: {mysqlHost}");
Console.WriteLine($"MYSQLPORT: {mysqlPort}");
Console.WriteLine($"MYSQLDATABASE: {mysqlDatabase}");
Console.WriteLine($"MYSQLUSER: {mysqlUser}");
Console.WriteLine($"MYSQLPASSWORD: {(string.IsNullOrEmpty(mysqlPassword) ? "NOT SET" : "SET")}");

// Validate environment variables
if (string.IsNullOrEmpty(mysqlHost) || string.IsNullOrEmpty(mysqlPort) || 
    string.IsNullOrEmpty(mysqlDatabase) || string.IsNullOrEmpty(mysqlUser))
{
    throw new Exception("Required MySQL environment variables are not set");
}

// Build the connection string
var connectionString = $"Server={mysqlHost};Port={mysqlPort};Database={mysqlDatabase};User={mysqlUser};Password={mysqlPassword};";

Console.WriteLine($"Attempting to connect to MySQL at {mysqlHost}:{mysqlPort}");

try
{
    builder.Services.AddDbContext<ApplicatinDbContext>(options =>
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
    );
    Console.WriteLine("DbContext configured successfully");
}
catch (Exception ex)
{
    Console.WriteLine($"Error configuring DbContext: {ex.Message}");
    throw;
}

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

Console.WriteLine($"JWT_SECRET: {(string.IsNullOrEmpty(jwtKey) ? "NOT SET" : "SET")}");

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

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

Console.WriteLine("Application built successfully");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

Console.WriteLine($"Starting application on port {port}");

app.Run();
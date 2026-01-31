using Backend.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Security
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;
        
        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        
        public string GenerateToken(User u)
        {
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, u.Id.ToString()),
                new Claim(ClaimTypes.Email, u.Email),
                new Claim(ClaimTypes.Role, u.Role)
            };

            // Read JWT_SECRET from environment variable first, then fall back to appsettings
            var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET") 
                ?? _configuration["Jwt:Key"] 
                ?? throw new InvalidOperationException("JWT_SECRET is not configured");

            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "CarRentalAPI";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "CarRentalClient";
            var accessTokenMinutes = int.Parse(_configuration["Jwt:AccessTokenMinutes"] ?? "15");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(accessTokenMinutes),
                signingCredentials: creds
            );
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
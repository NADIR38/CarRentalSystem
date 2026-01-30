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
            new Claim(ClaimTypes.NameIdentifier,u.Id.ToString()),
            new Claim(ClaimTypes.Email,u.Email),
            new Claim(ClaimTypes.Role,u.Role)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["jwt:key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _configuration["jwt:Issuer"],
                audience: _configuration["jwt:Audience"],
                claims: claims,
expires: DateTime.UtcNow.AddMinutes(int.Parse(_configuration["jwt:AccessTokenMinutes"])),
signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);


        }
    }
}

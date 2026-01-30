using Azure.Core;
using Backend.Data;
using Backend.Models;
using Backend.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly PasswordService _passwordService;
        private readonly ApplicatinDbContext _dbContext;
        private readonly JwtService jwtService;
        private readonly RefreshTokensService refreshTokensService;
        private readonly IConfiguration _configuration;
        public AuthController(PasswordService passwordService, ApplicatinDbContext dbContext, JwtService jwtService, RefreshTokensService refreshTokensService, IConfiguration configuration)
        {
            _passwordService = passwordService;
            _dbContext = dbContext;
            this.jwtService = jwtService;
            this.refreshTokensService = refreshTokensService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto u)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == u.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }
            var isPasswordValid = _passwordService.VerifyPassword(user, u.Password);
            if (!isPasswordValid)
            {
                return Unauthorized("Invalid email or password");
            }
            var token = jwtService.GenerateToken(user);
            var refreshToken = refreshTokensService.GenerateRefreshTokes();
            _dbContext.RefreshTokens.Add(new RefreshTokens
            {
                refresh_token = refreshToken,
                user_id = user.Id,
                expires_at = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["jwt:RefreshTokenDays"]))
            });
            await _dbContext.SaveChangesAsync();
            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,           // HTTPS only
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(
                    Convert.ToDouble(_configuration["jwt:RefreshTokenDays"])
                )
            });

            return Ok(new { accessToken = token });
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto u)
        {
            var existingUser = await _dbContext.Users.AnyAsync(x => x.Email == u.Email);
            if (existingUser) return BadRequest("Email already in use");

            var user = new User
            {
                Email = u.Email,
                UserName = u.UserName,
                Role = "User", // ✅ Required field lazmi bharein
                CreatedAt = DateTime.UtcNow
            };

            // Password ko hash karke save karein
            user.Password = _passwordService.HashPassword(user, u.Password);

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("No refresh token");

            var stored = await _dbContext.RefreshTokens.Include(u => u.user).FirstOrDefaultAsync(x => x.refresh_token == refreshToken && !x.revoked && x.expires_at > DateTime.UtcNow);
            if (stored == null)
            {
                return Unauthorized("Invalid or expired refresh token");
            }
            stored.revoked = true;
            var refreshTokenNew = refreshTokensService.GenerateRefreshTokes();
            _dbContext.RefreshTokens.Add(new RefreshTokens
            {
                refresh_token = refreshTokenNew,
                user_id = stored.user_id,
                expires_at = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["jwt:RefreshTokenDays"]))
            });
            var newaccessToken = jwtService.GenerateToken(stored.user);
            await _dbContext.SaveChangesAsync();
            Response.Cookies.Append("refreshToken", refreshTokenNew, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(
                    Convert.ToDouble(_configuration["jwt:RefreshTokenDays"])
                )
            });

            return Ok(new { accessToken = newaccessToken });
        }
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Ok();

            var stored = await _dbContext.RefreshTokens.FirstOrDefaultAsync(x => x.refresh_token == refreshToken && !x.revoked && x.expires_at > DateTime.UtcNow);
            if (stored == null)
            {
                return Unauthorized("Invalid or expired refresh token");
            }
            stored.revoked = true;
            await _dbContext.SaveChangesAsync();
            Response.Cookies.Delete("refreshToken");
            return Ok("Logged out successfully");
        }
    }
}
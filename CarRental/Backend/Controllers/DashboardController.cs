using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicatinDbContext _context;

        public DashboardController(ApplicatinDbContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/admin
        [HttpGet("admin")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<AdminDashboardDto>> GetAdminDashboard()
        {
            var totalCars = await _context.Cars.CountAsync();
            var activeBookings = await _context.Bookings.CountAsync(b => b.Status == "Active");
            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == "Completed")
                .SumAsync(b => (decimal?)b.TotalPrice) ?? 0;
            var totalCustomers = await _context.Users.CountAsync();

            // Recent bookings
            var recentBookings = await _context.Bookings
                .Include(b => b.Cars)
                .Include(b => b.User)
                .OrderByDescending(b => b.CreatedAt)
                .Take(5)
                .Select(b => new BookingResponseDto
                {
                    Id = b.Id,
                    CarId = b.CarId,
                    CarMake = b.Cars.Make,
                    CarModel = b.Cars.Model,
                    UserEmail = b.User.Email,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    TotalPrice = b.TotalPrice,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            // Monthly revenue for chart (last 6 months)
            var monthlyRevenue = new List<MonthlyRevenueDto>();
            for (int i = 5; i >= 0; i--)
            {
                var month = DateTime.Now.AddMonths(-i);
                var revenue = await _context.Bookings
                    .Where(b => b.Status == "Completed" &&
                               b.CreatedAt.Year == month.Year &&
                               b.CreatedAt.Month == month.Month)
                    .SumAsync(b => (decimal?)b.TotalPrice) ?? 0;

                monthlyRevenue.Add(new MonthlyRevenueDto
                {
                    Month = month.ToString("MMM"),
                    Revenue = revenue
                });
            }

            return Ok(new AdminDashboardDto
            {
                TotalCars = totalCars,
                ActiveBookings = activeBookings,
                TotalRevenue = totalRevenue,
                TotalCustomers = totalCustomers,
                RecentBookings = recentBookings,
                MonthlyRevenue = monthlyRevenue
            });
        }

        // GET: api/dashboard/user
        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<UserDashboardDto>> GetUserDashboard()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var activeBookings = await _context.Bookings
                .CountAsync(b => b.UserId.ToString() == userId && b.Status == "Active");
            
            var totalBookings = await _context.Bookings
                .CountAsync(b => b.UserId.ToString() == userId);
            
            var totalSpent = await _context.Bookings
                .Where(b => b.UserId.ToString() == userId && b.Status == "Completed")
                .SumAsync(b => (decimal?)b.TotalPrice) ?? 0;

            // User's bookings
            var myBookings = await _context.Bookings
                .Include(b => b.Cars)
                .Where(b => b.UserId.ToString() == userId)
                .OrderByDescending(b => b.CreatedAt)
                .Take(10)
                .Select(b => new BookingResponseDto
                {
                    Id = b.Id,
                    CarId = b.CarId,
                    CarMake = b.Cars.Make,
                    CarModel = b.Cars.Model,
                    UserEmail = b.User.Email,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    TotalPrice = b.TotalPrice,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            return Ok(new UserDashboardDto
            {
                ActiveBookings = activeBookings,
                TotalBookings = totalBookings,
                TotalSpent = totalSpent,
                LoyaltyPoints = (int)(totalSpent / 10), // $10 = 1 point
                MyBookings = myBookings
            });
        }
    }

    public class AdminDashboardDto
    {
        public int TotalCars { get; set; }
        public int ActiveBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalCustomers { get; set; }
        public List<BookingResponseDto> RecentBookings { get; set; }
        public List<MonthlyRevenueDto> MonthlyRevenue { get; set; }
    }

    public class UserDashboardDto
    {
        public int ActiveBookings { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalSpent { get; set; }
        public int LoyaltyPoints { get; set; }
        public List<BookingResponseDto> MyBookings { get; set; }
    }

    public class MonthlyRevenueDto
    {
        public string Month { get; set; }
        public decimal Revenue { get; set; }
    }
}

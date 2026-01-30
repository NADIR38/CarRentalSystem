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
    public class BookingsController : ControllerBase
    {
        private readonly ApplicatinDbContext _context;

        public BookingsController(ApplicatinDbContext context)
        {
            _context = context;
        }

        // GET: api/bookings (Admin: all bookings, User: their bookings)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<BookingResponseDto>>> GetBookings()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            IQueryable<Bookings> bookingsQuery = _context.Bookings
                .Include(b => b.Cars)
                .Include(b => b.User);

            if (userRole?.ToLower() != "admin")
            {
                bookingsQuery = bookingsQuery.Where(b => b.UserId.ToString() == userId);
            }

            var bookings = await bookingsQuery
                .OrderByDescending(b => b.CreatedAt)
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

            return Ok(bookings);
        }

        // GET: api/bookings/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<BookingResponseDto>> GetBooking(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var booking = await _context.Bookings
                .Include(b => b.Cars)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            // Users can only view their own bookings
            if (userRole?.ToLower() != "admin" && booking.UserId.ToString() != userId)
            {
                return Forbid();
            }

            var response = new BookingResponseDto
            {
                Id = booking.Id,
                CarId = booking.CarId,
                CarMake = booking.Cars.Make,
                CarModel = booking.Cars.Model,
                UserEmail = booking.User.Email,
                StartDate = booking.StartDate,
                EndDate = booking.EndDate,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CreatedAt = booking.CreatedAt
            };

            return Ok(response);
        }

        // POST: api/bookings
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<BookingResponseDto>> CreateBooking(BookingDto bookingDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Validate dates
            if (bookingDto.StartDate < DateTime.Now.Date)
            {
                return BadRequest("Start date cannot be in the past");
            }

            if (bookingDto.EndDate <= bookingDto.StartDate)
            {
                return BadRequest("End date must be after start date");
            }

            // Get car and calculate price
            var car = await _context.Cars.FindAsync(bookingDto.CarId);
            if (car == null)
            {
                return NotFound("Car not found");
            }

            // Check if car is available for these dates
            var conflictingBooking = await _context.Bookings
                .Where(b => b.CarId == bookingDto.CarId &&
                           b.Status != "Cancelled" &&
                           ((b.StartDate <= bookingDto.StartDate && b.EndDate >= bookingDto.StartDate) ||
                            (b.StartDate <= bookingDto.EndDate && b.EndDate >= bookingDto.EndDate) ||
                            (b.StartDate >= bookingDto.StartDate && b.EndDate <= bookingDto.EndDate)))
                .FirstOrDefaultAsync();

            if (conflictingBooking != null)
            {
                return BadRequest("Car is not available for the selected dates");
            }

            // Calculate total price
            var days = (bookingDto.EndDate - bookingDto.StartDate).Days;
            var totalPrice = days * car.PricePerDay;

            var booking = new Bookings
            {
                UserId = int.Parse(userId),
                CarId = bookingDto.CarId,
                StartDate = bookingDto.StartDate,
                EndDate = bookingDto.EndDate,
                TotalPrice = totalPrice,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Fetch the created booking with includes
            var createdBooking = await _context.Bookings
                .Include(b => b.Cars)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == booking.Id);

            var response = new BookingResponseDto
            {
                Id = createdBooking.Id,
                CarId = createdBooking.CarId,
                CarMake = createdBooking.Cars.Make,
                CarModel = createdBooking.Cars.Model,
                UserEmail = createdBooking.User.Email,
                StartDate = createdBooking.StartDate,
                EndDate = createdBooking.EndDate,
                TotalPrice = createdBooking.TotalPrice,
                Status = createdBooking.Status,
                CreatedAt = createdBooking.CreatedAt
            };

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, response);
        }

        // PUT: api/bookings/5/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] string status)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            var validStatuses = new[] { "Pending", "Active", "Completed", "Cancelled" };
            if (!validStatuses.Contains(status))
            {
                return BadRequest("Invalid status");
            }

            booking.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/bookings/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            // Users can only cancel their own bookings
            if (userRole?.ToLower() != "admin" && booking.UserId.ToString() != userId)
            {
                return Forbid();
            }

            // Instead of deleting, mark as cancelled
            booking.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

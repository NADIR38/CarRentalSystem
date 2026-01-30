using Backend.Controllers;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController:ControllerBase
    {
        private  IConfiguration _configuration;
        private readonly ApplicatinDbContext _context;
        public CarsController(IConfiguration configuration, ApplicatinDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Cars>>> GetCars([FromQuery] string? search)
        {
            try
            {
                var cars = _context.Cars.AsQueryable();
                if (!string.IsNullOrEmpty(search))
                {
                    cars = cars.Where(c => c.Model == search || c.Make == search || c.LicensePlate == search);
                }
                return await cars.OrderByDescending(c => c.CreatedAt).ToListAsync(); 
            }            
            catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        [HttpPost]
        [Authorize(Roles ="admin")]
        public async Task<IActionResult> AddCar(CarDto carDto)
        {
            var car = new Cars
            {
                Make = carDto.Make,
                Model = carDto.Model,
                Year = carDto.Year,
                Color = carDto.Color,
                LicensePlate = carDto.LicensePlate,
                PricePerDay = carDto.PricePerDay,
                Transmission = "Manual", // Default value - update CarDto if needed
                FuelType = "Petrol" // Default value - update CarDto if needed
            };
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCarById), new { id = car.Id }, car);
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetCarById(int id)
        {
            try
            {
                var cars = await _context.Cars.FindAsync(id);
                if (cars == null)
                {
                    return NotFound("unable to find cars");
                }
                return Ok(cars);
            }
            catch (Exception ex)
            {
                throw new Exception("unable to find cars" + ex.Message);

            }
        }
        [HttpPut ("{id}")]
        [Authorize]
        public async Task<ActionResult<Cars>> UpdateCars(int id,Cars UpdatedCar)
        {
            if (id != UpdatedCar.Id)
            {
             return BadRequest("id mismatch");
            }
            if (UpdatedCar.PricePerDay <= 0)
            {
                return BadRequest("price must be greater than zero");
            }
            _context.Entry(UpdatedCar).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Cars.Any(c => c.Id == id))
                {
                    return NotFound("Car not found.");
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }
        [HttpDelete("{id}")]
        [Authorize(Roles ="admin")]
        public async Task<IActionResult> DeleteCars(int id)
        {
            var cars = await _context.Cars.FindAsync(id);
            if (cars == null)
            {
                return NotFound("car not found");

            }
            _context.Cars.Remove(cars);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}

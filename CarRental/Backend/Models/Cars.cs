    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace Backend.Models
    {
        public class Cars
        {
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int Id { get; set; }
            [Required(ErrorMessage ="Make is required")]
            [StringLength(100)]
            public string Make { get; set; }
            [Required(ErrorMessage = "Model is required")]
            [StringLength(100)]
            public string Model { get; set; }
            [Required(ErrorMessage ="Year is required")]
            public int Year { get; set; }
            [Required(ErrorMessage ="Color is required")]
            [StringLength(50)]
            public string Color { get; set; }
            //[Required(ErrorMessage ="Mileage is required")]
            [StringLength(50)]
            public string Transmission { get; set; }
            //[Required(ErrorMessage ="Fuel Type is required")]
            [StringLength(50)]
            public string FuelType { get; set; }
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            [Required(ErrorMessage ="License Plate is required")]
            [StringLength(20)]
            public string LicensePlate { get;  set; }
            public decimal PricePerDay { get; set; }
        }
   
    
        public class CarDto
        {
            public string Make { get; set; }
            public string Model { get; set; }
            public int Year { get; set; }
            public string Color { get; set; }
        
            public string LicensePlate { get; set; }
            public decimal PricePerDay { get; set; }
    }
    
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class RefreshTokens
    {
        [Key]
        public int id { get; set; }

        // Is attribute se EF ko pata chalega ke 'user' property isi column se judi hai
        [ForeignKey("user")]
        public int user_id { get; set; }

        public string refresh_token { get; set; }
        public bool revoked { get; set; }
        public DateTime expires_at { get; set; }

        // Navigation property
        public User user { get; set; } = null!;
    }
}
using Backend.Models;
using Microsoft.AspNetCore.Identity;
namespace Backend.Security
{
    public class PasswordService
    {
        private readonly PasswordHasher<User> _hasher = new();
        public string HashPassword(User user, string password)
        {
            return _hasher.HashPassword(user, password);
        }
        public bool VerifyPassword(User user, string providedPassword)
        {
           var result = _hasher.VerifyHashedPassword(user, user.Password, providedPassword);
            return result== PasswordVerificationResult.Success;

        }


    }
}

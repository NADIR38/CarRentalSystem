using System.Security.Cryptography;

namespace Backend.Security
{
    public class RefreshTokensService
    {
        public string GenerateRefreshTokes()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }

    }
}

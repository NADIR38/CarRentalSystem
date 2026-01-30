using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class ApplicatinDbContext : DbContext
    {
        public ApplicatinDbContext(DbContextOptions<ApplicatinDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Cars> Cars { get; set; }
        public DbSet<Bookings> Bookings { get; set; }
        public DbSet<RefreshTokens> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
           modelBuilder.Entity<User>().HasIndex(u => u.Email)
                .IsUnique();
            modelBuilder.Entity<Cars>().HasIndex(c => c.LicensePlate)
                .IsUnique();
            modelBuilder.Entity<Bookings>().HasIndex(c=>c.Status);

            modelBuilder.Entity<Cars>().Property(c => c.PricePerDay)
                .HasPrecision(10,2);
             modelBuilder.Entity<Bookings>().Property(b => b.TotalPrice)
                .HasPrecision(10,2);
            modelBuilder.Entity<Bookings>()
                .HasOne(b => b.Cars)
                .WithMany()
                .HasForeignKey(b => b.CarId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Bookings>().HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<User>().Property(u=>u.Id).HasColumnType("int").ValueGeneratedOnAdd();
            modelBuilder.Entity<Cars>().Property(u => u.Id).HasColumnType("int").ValueGeneratedOnAdd();
            modelBuilder.Entity<Bookings>().Property(u => u.Id).HasColumnType("int").ValueGeneratedOnAdd();
            modelBuilder.Entity<RefreshTokens>().Property(u => u.id).HasColumnType("int").ValueGeneratedOnAdd();
            modelBuilder.Entity<RefreshTokens>()
     .HasOne(rt => rt.user)          
     .WithMany()                     
     .HasForeignKey(rt => rt.user_id) 
     .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
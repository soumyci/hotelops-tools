using HotelOps.Api.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HotelOps.Api.Data
{
    public class AppDb : IdentityDbContext<AppUser> // or your base
    {
        public AppDb(DbContextOptions<AppDb> options) : base(options) { }

        public DbSet<Room> Rooms => Set<Room>();
        public DbSet<RoomType> RoomTypes => Set<RoomType>();
        public DbSet<RatePlan> RatePlans => Set<RatePlan>();

        public DbSet<Amenity> Amenities => Set<Amenity>();
        public DbSet<RoomAmenity> RoomAmenities => Set<RoomAmenity>();
        // Data/AppDb.cs  (add DbSets)
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Reservation> Reservations => Set<Reservation>();
        public DbSet<Payment> Payments => Set<Payment>();
        
        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b);

            // RoomType
            b.Entity<RoomType>()
                .HasIndex(x => x.Code)
                .IsUnique();

            // RatePlan (keep your precision/index config as you had)
            b.Entity<RatePlan>()
                .HasIndex(x => x.Code)
                .IsUnique();

            // Room
            b.Entity<Room>()
                .HasIndex(x => x.Code)
                .IsUnique();

            b.Entity<Room>()
                .Property(r => r.BasePrice)
                .HasPrecision(18, 2);

            // Amenity
            b.Entity<Amenity>()
                .HasIndex(x => x.Code)
                .IsUnique();

            // Join: RoomAmenity (composite key + FKs)
            b.Entity<RoomAmenity>()
                .HasKey(x => new { x.RoomId, x.AmenityId });

            b.Entity<RoomAmenity>()
                .HasOne(x => x.Room)
                .WithMany(r => r.RoomAmenities)
                .HasForeignKey(x => x.RoomId);

            b.Entity<RoomAmenity>()
                .HasOne(x => x.Amenity)
                .WithMany(a => a.RoomAmenities)
                .HasForeignKey(x => x.AmenityId);
        }
    }
}

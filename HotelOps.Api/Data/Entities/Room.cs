using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema; // <-- add

namespace HotelOps.Api.Data.Entities
{
    public class Room
    {
        public int Id { get; set; }

        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;

        // Room type link (required by the controller/DTOs)
        [Required] public  int RoomTypeId { get; set; }
        public RoomType? RoomType { get; set; }

        public int Capacity { get; set; }
        public decimal BasePrice { get; set; }

        // Many-to-many to amenities
        public List<RoomAmenity> RoomAmenities { get; set; } = new();
        [NotMapped] public string? Type { get; set; }
        [NotMapped] public string? AmenitiesCsv { get; set; }
        [NotMapped] public string? ImageUrl { get; set; }
    }
}

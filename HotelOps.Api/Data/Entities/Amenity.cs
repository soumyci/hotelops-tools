using System.Collections.Generic;

namespace HotelOps.Api.Data.Entities
{
    public class Amenity
    {
        public int Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public bool IsActive { get; set; } = true;

        public List<RoomAmenity> RoomAmenities { get; set; } = new();
    }
}

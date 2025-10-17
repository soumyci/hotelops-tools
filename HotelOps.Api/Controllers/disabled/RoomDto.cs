namespace HotelOps.Api.Models
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Type { get; set; } = default!;
        public int Capacity { get; set; }
        public decimal BasePrice { get; set; }
        public string? AmenitiesCsv { get; set; }
        public string? ImageUrl { get; set; }
    }
}

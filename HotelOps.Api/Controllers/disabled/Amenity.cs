using System.ComponentModel.DataAnnotations;

namespace HotelOps.Api.Data;

public class Amenity
{
  public int Id { get; set; }

  [Required, MaxLength(64)]
  public string Code { get; set; } = "";               // e.g., WIFI, AC, BREAKFAST

  [Required, MaxLength(128)]
  public string Name { get; set; } = "";

  public bool IsActive { get; set; } = true;

  // Inverse navigation (optional)
  public ICollection<Room> Rooms { get; set; } = new List<Room>();
}

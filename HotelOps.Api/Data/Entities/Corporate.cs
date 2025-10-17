// Corporate.cs
using System.ComponentModel.DataAnnotations;

namespace HotelOps.Api.Data;
public class Corporate
{
    public int Id { get; set; }
    [Required, MaxLength(128)]
    public string Name { get; set; } = "";
    public bool IsActive { get; set; } = true;
}

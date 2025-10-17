// Contract.cs
namespace HotelOps.Api.Data;

public class Contract
{
    public int Id { get; set; }
    public int CorporateId { get; set; }
    public bool IsActive { get; set; } = true;
}

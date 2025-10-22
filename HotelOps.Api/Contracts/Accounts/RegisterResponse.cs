namespace HotelOps.Api.Contracts.Accounts;

public class RegisterResponse
{
    public string UserName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public string? FullName { get; set; }
}

namespace HotelOps.Api.Contracts.Accounts
{
    public class RegisterDto
    {
        public string FullName { get; set; } = default!;
        public string Role { get; set; } = "staff";          // "admin" | "corporate" | "staff"
        public string? CompanyCode { get; set; }             // optional, just a code for now
        public string Password { get; set; } = default!;
    }

    public class RegisterResultDto
    {
        public string Id { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string Role { get; set; } = default!;
        public string? CompanyCode { get; set; }
    }
}

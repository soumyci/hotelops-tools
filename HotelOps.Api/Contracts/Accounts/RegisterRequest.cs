using System.ComponentModel.DataAnnotations;

namespace HotelOps.Api.Contracts.Accounts;

public class RegisterRequest
{
    [Required, MaxLength(64)]
    public string UserName { get; set; } = default!;   // login id (email or code)

    [MaxLength(160)]
    public string? FullName { get; set; }

    // UI label “Company Name” (optional for now)
    [MaxLength(160)]
    public string? CompanyName { get; set; }

    // "admin" | "staff" | "corporate" etc.
    [Required, MaxLength(32)]
    public string Role { get; set; } = "staff";

    [Required, MinLength(6), MaxLength(100)]
    public string Password { get; set; } = default!;

    [Required]
    [Compare(nameof(Password), ErrorMessage = "Passwords do not match.")]
    public string ConfirmPassword { get; set; } = default!;
}

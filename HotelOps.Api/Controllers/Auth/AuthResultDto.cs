namespace HotelOps.Api.Contracts.Auth
{
    public record AuthResultDto(string AccessToken, DateTime ExpiresAtUtc, string[] Roles);
}

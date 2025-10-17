namespace HotelOps.Api.Auth;

using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;          // <- add if not already
using System.IdentityModel.Tokens.Jwt;       // JwtRegisteredClaimNames
using System.Security.Claims;                // Claim, ClaimTypes, ClaimsIdentity

public class DemoAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string Scheme = "Demo";

#pragma warning disable CS0618 // ISystemClock is obsolete in .NET 8; fine for our custom handler
    public DemoAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock)
        : base(options, logger, encoder, clock) { }
#pragma warning restore CS0618

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // No header -> let other handlers try
        if (!Request.Headers.TryGetValue("Authorization", out var auth) ||
            string.IsNullOrWhiteSpace(auth))
            return Task.FromResult(AuthenticateResult.NoResult());

        var value = auth.ToString().Trim();

        // Accept both "Bearer Demo ..." and "Demo ..."
        if (value.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            value = value[7..].Trim();

        if (!value.StartsWith("Demo ", StringComparison.OrdinalIgnoreCase))
            return Task.FromResult(AuthenticateResult.Fail("Expect 'Demo' auth"));

        var payload = value["Demo ".Length..];

        // Parse: key=value; key=value; ...
        var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var part in payload.Split(';', StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = part.Split('=', 2, StringSplitOptions.TrimEntries);
            if (kv.Length == 2) dict[kv[0]] = kv[1];
        }

        var role  = dict.TryGetValue("role",  out var r) ? r : "Guest";
        var name  = dict.TryGetValue("name",  out var n) ? n : "Unknown";
        var email = dict.TryGetValue("email", out var e) ? e : "unknown@example.com";

        // Support comma-separated roles: "Admin,CorporateAdmin"
        var roles = role.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        if (roles.Length == 0) roles = new[] { "Guest" };

        // Claims
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name,  name ?? email ?? ""),
            new(ClaimTypes.Email, email ?? ""),
            new(JwtRegisteredClaimNames.Email, email ?? "")
        };
        foreach (var rr in roles)
            claims.Add(new Claim(ClaimTypes.Role, rr));

        var identity  = new ClaimsIdentity(claims, Scheme);
        var principal = new ClaimsPrincipal(identity);
        var ticket    = new AuthenticationTicket(principal, Scheme);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

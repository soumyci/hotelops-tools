namespace HotelOps.Api.Auth;

using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

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
        if (!Request.Headers.TryGetValue("Authorization", out var auth) ||
            string.IsNullOrWhiteSpace(auth))
            return Task.FromResult(AuthenticateResult.NoResult());

        var value = auth.ToString().Trim();

        // Accept both "Bearer Demo ..." and "Demo ..."
        if (value.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            value = value[7..].Trim();

        if (!value.StartsWith("Demo ", StringComparison.OrdinalIgnoreCase))
            return Task.FromResult(AuthenticateResult.Fail("Expect 'Demo' auth"));

        var payload = value.Substring("Demo ".Length);

        var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var part in payload.Split(';', StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = part.Split('=', 2, StringSplitOptions.TrimEntries);
            if (kv.Length == 2) dict[kv[0]] = kv[1];
        }

        var role  = dict.TryGetValue("role",  out var r) ? r : "Guest";
        var name  = dict.TryGetValue("name",  out var n) ? n : "Unknown";
        var email = dict.TryGetValue("email", out var e) ? e : "unknown@example.com";

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, name),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role),
        };

        var id     = new ClaimsIdentity(claims, Scheme);
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(id), Scheme);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

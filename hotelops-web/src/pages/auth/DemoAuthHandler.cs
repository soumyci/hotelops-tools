using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

public class DemoAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string Scheme = "Demo";

    public DemoAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
        : base(options, logger, encoder, clock) {}

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Read role from header; default to "Guest"
        var role = Request.Headers["X-Role"].ToString();
        if (string.IsNullOrWhiteSpace(role)) role = "Guest";

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, "demo"),
            new Claim(ClaimTypes.Role, role)
        };
        var identity = new ClaimsIdentity(claims, Scheme);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

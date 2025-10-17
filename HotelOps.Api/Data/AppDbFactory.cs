using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace HotelOps.Api.Data
{
    public class AppDbFactory : IDesignTimeDbContextFactory<AppDb>
    {
        public AppDb CreateDbContext(string[] args)
        {
            var cfg = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddJsonFile("appsettings.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            var cs = cfg.GetConnectionString("Default") ?? 
                     "Host=localhost;Port=5432;Database=hotelops_dev;Username=postgres;Password=postgres";

            var opts = new DbContextOptionsBuilder<AppDb>()
                .UseNpgsql(cs)
                .Options;

            return new AppDb(opts);
        }
    }
}

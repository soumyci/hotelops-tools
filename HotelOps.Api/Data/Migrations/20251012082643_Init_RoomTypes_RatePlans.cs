using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HotelOps.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class Init_RoomTypes_RatePlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RatePlans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    PriceModifier = table.Column<decimal>(type: "numeric", nullable: true),
                    IsPercent = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RatePlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoomTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    BasePrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RatePlans_Code",
                table: "RatePlans",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoomTypes_Code",
                table: "RoomTypes",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RatePlans");

            migrationBuilder.DropTable(
                name: "RoomTypes");
        }
    }
}

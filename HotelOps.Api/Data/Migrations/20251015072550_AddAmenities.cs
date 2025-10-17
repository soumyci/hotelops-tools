using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HotelOps.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAmenities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Amenities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Amenities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoomAmenities",
                columns: table => new
                {
                    RoomId = table.Column<int>(type: "integer", nullable: false),
                    AmenityId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomAmenities", x => new { x.RoomId, x.AmenityId });
                    table.ForeignKey(
                        name: "FK_RoomAmenities_Amenities_AmenityId",
                        column: x => x.AmenityId,
                        principalTable: "Amenities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoomAmenities_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Amenities_Code",
                table: "Amenities",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoomAmenities_AmenityId",
                table: "RoomAmenities",
                column: "AmenityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoomAmenities");

            migrationBuilder.DropTable(
                name: "Amenities");
        }
    }
}

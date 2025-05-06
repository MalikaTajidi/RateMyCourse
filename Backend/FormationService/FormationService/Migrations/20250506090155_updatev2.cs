using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormationService.Migrations
{
    /// <inheritdoc />
    public partial class updatev2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FormationName",
                table: "Formations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FormationName",
                table: "Formations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}

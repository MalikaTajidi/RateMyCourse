using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormationService.Migrations
{
    /// <inheritdoc />
    public partial class updatev4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FormationName",
                table: "Formations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FormationName",
                table: "Formations");
        }
    }
}

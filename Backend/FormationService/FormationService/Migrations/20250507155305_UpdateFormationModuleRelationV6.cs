using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormationService.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFormationModuleRelationV6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Modules");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Modules",
                type: "text",
                nullable: true);
        }
    }
}

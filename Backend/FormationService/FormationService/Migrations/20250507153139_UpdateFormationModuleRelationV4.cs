using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormationService.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFormationModuleRelationV4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Modules",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Modules");
        }
    }
}

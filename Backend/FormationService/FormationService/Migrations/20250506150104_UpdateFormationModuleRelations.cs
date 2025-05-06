using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormationService.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFormationModuleRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ModuleFormationId",
                table: "ModuleFormations",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModuleFormationId",
                table: "ModuleFormations");
        }
    }
}

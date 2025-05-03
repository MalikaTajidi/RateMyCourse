using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserService.Migrations
{
    /// <inheritdoc />
    public partial class modifiedUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Prenom",
                table: "Users",
                newName: "lastName");

            migrationBuilder.RenameColumn(
                name: "Nom",
                table: "Users",
                newName: "firstName");

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Password",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "lastName",
                table: "Users",
                newName: "Prenom");

            migrationBuilder.RenameColumn(
                name: "firstName",
                table: "Users",
                newName: "Nom");
        }
    }
}

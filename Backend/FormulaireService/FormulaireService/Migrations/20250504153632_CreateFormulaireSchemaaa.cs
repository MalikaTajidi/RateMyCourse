using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormulaireService.Migrations
{
    /// <inheritdoc />
    public partial class CreateFormulaireSchemaaa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SectionFormulaires_Questions_QuestionId",
                table: "SectionFormulaires");

            migrationBuilder.DropIndex(
                name: "IX_SectionFormulaires_QuestionId",
                table: "SectionFormulaires");

            migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "SectionFormulaires");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Questions",
                newName: "Intitule");

            migrationBuilder.AddColumn<int>(
                name: "SectionFormId",
                table: "Questions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SectionFormulaireSecFormId",
                table: "Questions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Questions_SectionFormulaireSecFormId",
                table: "Questions",
                column: "SectionFormulaireSecFormId");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_SectionFormulaires_SectionFormulaireSecFormId",
                table: "Questions",
                column: "SectionFormulaireSecFormId",
                principalTable: "SectionFormulaires",
                principalColumn: "SecFormId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_SectionFormulaires_SectionFormulaireSecFormId",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Questions_SectionFormulaireSecFormId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "SectionFormId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "SectionFormulaireSecFormId",
                table: "Questions");

            migrationBuilder.RenameColumn(
                name: "Intitule",
                table: "Questions",
                newName: "Content");

            migrationBuilder.AddColumn<int>(
                name: "QuestionId",
                table: "SectionFormulaires",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SectionFormulaires_QuestionId",
                table: "SectionFormulaires",
                column: "QuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_SectionFormulaires_Questions_QuestionId",
                table: "SectionFormulaires",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "QuestionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

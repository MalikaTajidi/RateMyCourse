using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormulaireService.Migrations
{
    /// <inheritdoc />
    public partial class AddSectionFormForeignKeyToQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_SectionFormulaires_SectionFormulaireSecFormId",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Questions_SectionFormulaireSecFormId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "SectionFormulaireSecFormId",
                table: "Questions");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_SectionFormId",
                table: "Questions",
                column: "SectionFormId");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_SectionFormulaires_SectionFormId",
                table: "Questions",
                column: "SectionFormId",
                principalTable: "SectionFormulaires",
                principalColumn: "SecFormId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_SectionFormulaires_SectionFormId",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Questions_SectionFormId",
                table: "Questions");

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
    }
}

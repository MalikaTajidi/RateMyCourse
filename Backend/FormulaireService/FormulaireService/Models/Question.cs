using FormulaireService.Models;
using System.ComponentModel.DataAnnotations;

public class Question
{
    [Key]
    public int QuestionId { get; set; }

    [Required]
    public string Content { get; set; }

    public int SectionFormId { get; set; }  // Clé étrangère vers SectionFormulaire
}

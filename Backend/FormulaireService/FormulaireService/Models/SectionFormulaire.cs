using System.ComponentModel.DataAnnotations;

namespace FormulaireService.Models
{
    public class SectionFormulaire
    {
        [Key]
        public int SecFormId { get; set; }
        public string Description { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; }

        public int FormulaireId { get; set; }
        public Formulaire Formulaire { get; set; }
    }

}

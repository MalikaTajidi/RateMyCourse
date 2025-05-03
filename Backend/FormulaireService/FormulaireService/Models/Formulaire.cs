using System.ComponentModel.DataAnnotations;

namespace FormulaireService.Models
{
    public class Formulaire
    {
        [Key]
        public int FormulaireId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }

}

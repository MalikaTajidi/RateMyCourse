using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FormulaireService.Models
{
    public class Formulaire
    {
        [Key]
        public int FormulaireId { get; set; }  // Clé primaire du formulaire
        [Required]
        public string Name { get; set; }        // Nom du formulaire
        [Required]
        public string Type { get; set; }        // Type du formulaire

        [JsonIgnore] // Ignorer cette propriété lors de la sérialisation
        public ICollection<SectionFormulaire> Sections { get; set; } // Relation 1:N avec SectionFormulaire
    }
}

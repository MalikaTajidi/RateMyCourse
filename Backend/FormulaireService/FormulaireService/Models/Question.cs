using System.ComponentModel.DataAnnotations;

namespace FormulaireService.Models
{
    public class Question
    {
        [Key]
        public int QuestionId { get; set; }
        public string Content { get; set; }
    }

}

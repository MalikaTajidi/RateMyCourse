using System.ComponentModel.DataAnnotations;

namespace UserService.Models
{
    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        public int UserId { get; set; }
        public Users User { get; set; }
    }

}

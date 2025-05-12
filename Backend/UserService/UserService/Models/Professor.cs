using System.ComponentModel.DataAnnotations;
using UserService.Models.UserService.Models;

namespace UserService.Models
{
    public class Professor
    {
        [Key]
        public int ProfId { get; set; }

        public int UserId { get; set; }
        public Users User { get; set; }
    }

}

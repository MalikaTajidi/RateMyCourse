using System.ComponentModel.DataAnnotations;
using UserService.Models.UserService.Models;

namespace UserService.Models
{
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }

        public int UserId { get; set; }
        public Users User { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace UserService.Models
{
    namespace UserService.Models
    {
        public class Users
        {
            [Key]
            public int Id { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role { get; set; } // Etudiant, Enseignant, Professionnel, Admin
            public int FormationId { get; set; }
            public bool IsFirstLogin { get; set; } = true;


        }
    }
}

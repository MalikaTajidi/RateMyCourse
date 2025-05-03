namespace UserService.Models
{
    public class Users
    {
        public Guid Id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // Etudiant, Enseignant, Professionnel, Admin
    }

}

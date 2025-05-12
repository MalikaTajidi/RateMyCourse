namespace UserService.Models.DTO
{
    public class AddUserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int FormationId { get; set; }
        //pour etudiant
        public int? NiveauId { get; set; }

    }
}

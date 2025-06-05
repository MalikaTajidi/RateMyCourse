using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserService.Models.DTO;
using UserService.Services;

namespace UserService.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly UserDbContext _context;


        public UserController(UserDbContext context)
        {
            _context = context;
        }

        [HttpPost("change-password")]
        public IActionResult ChangePassword(ChangePasswordDto dto)
        {
            var user = _context.Users.Find(dto.UserId);
            if (user == null)
                return NotFound();

            user.Password = PasswordHasher.HashPassword(dto.NewPassword);
            user.IsFirstLogin = false;
            _context.SaveChanges();

            return Ok(new { message = "Mot de passe modifié avec succès" });
        }


        [HttpPost("update-niveau")]
        public IActionResult UpdateStudentNiveau(UpdateStudentNiveauDto dto)
        {
            var student = _context.Students.FirstOrDefault(s => s.UserId == dto.UserId);
            if (student == null)
                return NotFound(new { message = "Étudiant introuvable." });

            student.NiveauId = dto.NiveauId;
            _context.SaveChanges();

            return Ok(new { message = "Niveau de l'étudiant mis à jour avec succès." });
        }


    }
}

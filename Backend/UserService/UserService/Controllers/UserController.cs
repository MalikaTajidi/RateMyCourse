using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserService.Models;
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

        [HttpGet("getStudents")]
        public IActionResult GetStudents()
        {
            var students = (from s in _context.Students
                            join u in _context.Users on s.UserId equals u.Id
                            select new
                            {
                                u.Id,
                                u.firstName,
                                u.lastName,
                                u.Email,
                                u.FormationId,
                                s.NiveauId
                            }).ToList();

            return Ok(students);
        }

        [HttpGet("getProfs")]
        public IActionResult GetProfs()
        {
            var students = (from p in _context.Profs
                            join u in _context.Users on p.UserId equals u.Id
                            select new
                            {
                                u.Id,
                                u.firstName,
                                u.lastName,
                                u.Email,
                                u.FormationId,
                            }).ToList();

            return Ok(students);
        }
        [HttpGet("students/{userId}")]
        public async Task<ActionResult<Student>> GetStudentByUserId(int userId)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
                return NotFound();

            return Ok(student);
        }

        [HttpGet("profs/{userId}")]
        public async Task<ActionResult<Professor>> GetProfessorByUserId(int userId)
        {
            var professor = await _context.Profs
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (professor == null)
                return NotFound();

            return Ok(professor);
        }



    }
}

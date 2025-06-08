using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserService.Models;
using UserService.Models.DTO;
using UserService.Models;
using UserService.Services;

namespace UserService.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly UserDbContext _context;
        private readonly TokenService _tokenService;


        public AuthController(UserDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;

        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto loginDto)
        {
            if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest("Email et mot de passe sont requis");
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return NotFound("Utilisateur introuvable");
            }

            bool isPasswordValid = PasswordHasher.VerifyPassword(loginDto.Password, user.Password);
            if (!isPasswordValid)
            {
                return BadRequest("Mot de passe incorrect");
            }

            if (user.IsFirstLogin)
            {
                return Ok(new
                {
                    message = "Première connexion. Veuillez changer votre mot de passe.",
                    firstLogin = true,
                    userId = user.Id,
                    role = user.Role
                });
            }

            var token = _tokenService.GenerateJwtToken(user);

            // Si c'est un étudiant, on récupère son NiveauId
            int? niveauId = null;
            if (user.Role == "Etudiant")
            {
                var student = _context.Students.FirstOrDefault(s => s.UserId == user.Id);
                if (student != null)
                {
                    niveauId = student.NiveauId;
                }
            }

            var userResponse = new
            {
                user.Id,
                user.Email,
                user.firstName,
                user.lastName,
                user.Role,
                user.FormationId,
                NiveauId = niveauId
            };

            return Ok(new
            {
                message = "Connexion réussie",
                firstLogin = false,
                token = token,
                user = userResponse
            });
        }



        [HttpPost("add-admin")]
        public IActionResult AddAdmin(AddUserDto dto)
        {
            var password = PasswordGenerator.GeneratePassword(10);
            //var existingUser = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            //if (existingUser != null)
            //{
            //    return BadRequest(new { message = "Cet email est déjà utilisé." });
            //}

            var user = new Users
            {
                firstName = dto.FirstName,
                lastName = dto.LastName,
                Email = dto.Email,
                FormationId = dto.FormationId,

                Role = "Admin",
                Password = PasswordHasher.HashPassword(password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();
            var admin = new Admin
            {
                UserId = user.Id
            };
            _context.Admins.Add(admin);
            _context.SaveChanges();

            EmailService.SendEmail(user.Email, "Votre compte admin a été créé", $"Mot de passe : {password}");
            return Ok(new
            {
                success = true,
                message = "Admint ajouté avec succès",
                userId = user.Id
            });
        }

        [HttpPost("add-prof")]
        public IActionResult AddProf(AddUserDto dto)
        {
            var password = PasswordGenerator.GeneratePassword(10);
            //var existingUser = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            //if (existingUser != null)
            //{
            //    return BadRequest(new { message = "Cet email est déjà utilisé." });
            //}


            var user = new Users
            {
                firstName = dto.FirstName,
                lastName = dto.LastName,
                Email = dto.Email,
                Role = "Prof",
                Password = PasswordHasher.HashPassword(password),
                FormationId = dto.FormationId
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var prof = new Professor
            {
                UserId = user.Id
            };
            _context.Profs.Add(prof);
            _context.SaveChanges();

            EmailService.SendEmail(user.Email, "Votre compte professeur a été créé", $"Mot de passe : {password}");
            return Ok(new
            {
                success = true,
                message = "Professeur ajouté avec succès",
                userId = user.Id
            });
        }

        [HttpPost("add-student")]
        public IActionResult AddStudent(AddUserDto dto)
        {
            var password = PasswordGenerator.GeneratePassword(10);
            //var existingUser = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            //if (existingUser != null)
            //{
            //    return BadRequest(new { message = "Cet email est déjà utilisé." });
            //}

            var user = new Users
            {
                firstName = dto.FirstName,
                lastName = dto.LastName,
                Email = dto.Email,
                Role = "Etudiant",
                Password = PasswordHasher.HashPassword(password),
                FormationId = dto.FormationId
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var student = new Student
            {
                UserId = user.Id,
                NiveauId = dto.NiveauId.HasValue ? dto.NiveauId.Value : 0
            };
            _context.Students.Add(student);
            _context.SaveChanges();

            EmailService.SendEmail(user.Email, "Votre compte étudiant a été créé", $"Mot de passe : {password}");
            return Ok(new
            {
                success = true,
                message = "Étudiant ajouté avec succès",
                userId = user.Id
            });
        }


        //[HttpPost("add-user")] 
        //public IActionResult AddUser(AddUserDto dto)
        //{
        //    var password = PasswordGenerator.GeneratePassword(10);

        //    var user = new Users
        //    {
        //        firstName = dto.FirstName,
        //        lastName = dto.LastName,
        //        Email = dto.Email,
        //        Role = dto.Role,
        //        Password = PasswordHasher.HashPassword(password),
        //        FormationId=dto.FormationId
        //    };

        //    _context.Users.Add(user);
        //    _context.SaveChanges();

        //    if (user.Role == "Prof")
        //    {
        //        var prof = new Professor
        //        {
        //            UserId = user.Id
        //        };
        //        _context.Profs.Add(prof);
        //    }
        //    else if (user.Role == "Etudiant")
        //    {
        //        var student = new Student
        //        {
        //            UserId = user.Id,
        //            NiveauId = dto.NiveauId.HasValue ? dto.NiveauId.Value : 0
        //        };
        //        _context.Students.Add(student);
        //    }

        //    _context.SaveChanges();

        //    string emailBody = $"Bonjour {user.firstName},\nVotre compte a été créé.\nVotre mot de passe est : {password}";
        //    EmailService.SendEmail(user.Email, "Votre compte a été créé", emailBody);

        //    return Ok(new { message = "Utilisateur ajouté avec succès et email envoyé." });
        //}
    }
}

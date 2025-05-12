using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FormulaireService.Models;
using System.Linq;
using System.Threading.Tasks;

namespace FormulaireService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormulairesController : ControllerBase
    {
        private readonly FormulaireDbContext _context;

        public FormulairesController(FormulaireDbContext context)
        {
            _context = context;
        }

        // POST: api/Formulaires
        [HttpPost]
        public async Task<IActionResult> CreateFormulaire([FromBody] FormulaireDTO dto)
        {
            if (dto == null)
                return BadRequest("Formulaire invalide.");

            var formulaire = new Formulaire
            {
                Name = dto.Name,
                Type = dto.Type,
                Sections = new List<SectionFormulaire>()
            };

            foreach (var sectionDto in dto.Sections)
            {
                var section = new SectionFormulaire
                {
                    Description = sectionDto.Description,
                    Questions = new List<Question>()
                };

                foreach (var questionDto in sectionDto.Questions)
                {
                    var question = new Question
                    {
                        Content = questionDto.Content
                        // Pas besoin d’assigner SectionFormulaire ici, car EF va le faire via la navigation
                    };
                    section.Questions.Add(question);
                }

                formulaire.Sections.Add(section);
            }

            _context.Formulaires.Add(formulaire);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFormulaireById), new { id = formulaire.FormulaireId }, formulaire);
        }


       

        // DELETE: api/Formulaires/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFormulaire(int id)
        {
            var formulaire = await _context.Formulaires
                .Include(f => f.Sections)
                    .ThenInclude(s => s.Questions)
                .FirstOrDefaultAsync(f => f.FormulaireId == id);

            if (formulaire == null)
                return NotFound();

            // Supprimer le formulaire et toutes ses sections et questions liées, en cascade (configuré dans OnModelCreating)
            _context.Formulaires.Remove(formulaire);
            await _context.SaveChangesAsync();

            // Retourner une réponse JSON avec le message de succès
            return Ok(new { message = "Form deleted successfully" });
        }


        // GET: api/Formulaires/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormulaireById(int id)
        {
            var formulaire = await _context.Formulaires
                .Include(f => f.Sections)  // Inclure les sections du formulaire
                    .ThenInclude(s => s.Questions)  // Inclure les questions de chaque section
                .FirstOrDefaultAsync(f => f.FormulaireId == id);

            if (formulaire == null)
                return NotFound();  // Si le formulaire n'est pas trouvé, retourner 404

            return Ok(new
            {
                formulaireId = formulaire.FormulaireId,
                name = formulaire.Name,
                type = formulaire.Type,
                sections = formulaire.Sections.Select(s => new
                {
                    secFormId = s.SecFormId,
                    description = s.Description,
                    questions = s.Questions.Select(q => new
                    {
                        questionId = q.QuestionId,
                        content = q.Content
                    })
                })
            });  // Retourner le formulaire trouvé avec ses sections et questions
        }



        // GET: api/Formulaires
        // GET: api/Formulaires
        [HttpGet]
        public async Task<IActionResult> GetFormulaires()
        {
            var formulaires = await _context.Formulaires
                .Include(f => f.Sections)  // Inclure les sections pour chaque formulaire
                    .ThenInclude(s => s.Questions)  // Inclure les questions pour chaque section
                .ToListAsync();  // Récupérer tous les formulaires avec leurs données liées

            var result = formulaires.Select(f => new
            {
                formulaireId = f.FormulaireId,
                name = f.Name,
                type = f.Type,
                sections = f.Sections.Select(s => new
                {
                    secFormId = s.SecFormId,
                    description = s.Description,
                    questions = s.Questions.Select(q => new
                    {
                        questionId = q.QuestionId,
                        content = q.Content
                    })
                })
            });

            return Ok(result);  // Retourner la liste des formulaires avec leurs sections et questions
        }


        [HttpPost("SectionFormulaires/Questions/{sectionFormId}")]
        public async Task<IActionResult> AddQuestionToSection(int sectionFormId, [FromBody] Question question)
        {
            // Vérifie que la section existe
            var section = await _context.SectionFormulaires
                                         .FirstOrDefaultAsync(s => s.SecFormId == sectionFormId);

            if (section == null)
                return NotFound("Section not found");

            // Associe la section à la question via la clé étrangère
            question.SectionFormId = section.SecFormId; // Clé étrangère

            // Ajoute la question à la base de données
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            // Retourne une réponse personnalisée
            return Ok(new { message = "Question ajoutée avec succès", question });
        }

        [HttpDelete("SectionFormulaires/deleteQuestions/{questionId}")]
        public async Task<IActionResult> DeleteQuestion(int questionId)
        {
            // Vérifier si la question existe dans la base de données
            var question = await _context.Questions
                                         .FirstOrDefaultAsync(q => q.QuestionId == questionId);

            if (question == null)
                return NotFound("Question not found");  // Retourner 404 si la question n'existe pas

            // Supprimer la question de la base de données
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            // Retourner un message de succès
            return Ok(new { message = "Question supprimée avec succès" });
        }


        [HttpDelete("DeleteSection/{secFormId}")]
        public async Task<IActionResult> DeleteSection(int secFormId)
        {
            // Vérifier si la section existe dans la base de données
            var section = await _context.SectionFormulaires
                                         .FirstOrDefaultAsync(s => s.SecFormId == secFormId);

            if (section == null)
                return NotFound("Section not found");  // Retourner 404 si la section n'existe pas

            // Supprimer la section de la base de données
            _context.SectionFormulaires.Remove(section);
            await _context.SaveChangesAsync();

            // Retourner un message de succès
            return Ok(new { message = "Section supprimée avec succès" });
        }





    }
}




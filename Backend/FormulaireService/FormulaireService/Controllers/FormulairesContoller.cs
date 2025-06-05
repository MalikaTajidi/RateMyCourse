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
                        // Pas besoin d�assigner SectionFormulaire ici, car EF va le faire via la navigation
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

            // Supprimer le formulaire et toutes ses sections et questions li�es, en cascade (configur� dans OnModelCreating)
            _context.Formulaires.Remove(formulaire);
            await _context.SaveChangesAsync();

            // Retourner une r�ponse JSON avec le message de succ�s
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
                return NotFound();  // Si le formulaire n'est pas trouv�, retourner 404

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
            });  // Retourner le formulaire trouv� avec ses sections et questions
        }



        // GET: api/Formulaires
        // GET: api/Formulaires
        [HttpGet]
        public async Task<IActionResult> GetFormulaires()
        {
            var formulaires = await _context.Formulaires
                .Include(f => f.Sections)  // Inclure les sections pour chaque formulaire
                    .ThenInclude(s => s.Questions)  // Inclure les questions pour chaque section
                .ToListAsync();  // R�cup�rer tous les formulaires avec leurs donn�es li�es

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
            // V�rifie que la section existe
            var section = await _context.SectionFormulaires
                                         .FirstOrDefaultAsync(s => s.SecFormId == sectionFormId);

            if (section == null)
                return NotFound("Section not found");

            // Associe la section � la question via la cl� �trang�re
            question.SectionFormId = section.SecFormId; // Cl� �trang�re

            // Ajoute la question � la base de donn�es
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            // Retourne une r�ponse personnalis�e
            return Ok(new { message = "Question ajout�e avec succ�s", question });
        }

        [HttpDelete("SectionFormulaires/deleteQuestions/{questionId}")]
        public async Task<IActionResult> DeleteQuestion(int questionId)
        {
            // V�rifier si la question existe dans la base de donn�es
            var question = await _context.Questions
                                         .FirstOrDefaultAsync(q => q.QuestionId == questionId);

            if (question == null)
                return NotFound("Question not found");  // Retourner 404 si la question n'existe pas

            // Supprimer la question de la base de donn�es
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            // Retourner un message de succ�s
            return Ok(new { message = "Question supprim�e avec succ�s" });
        }


        [HttpDelete("DeleteSection/{secFormId}")]
        public async Task<IActionResult> DeleteSection(int secFormId)
        {
            // V�rifier si la section existe dans la base de donn�es
            var section = await _context.SectionFormulaires
                                         .FirstOrDefaultAsync(s => s.SecFormId == secFormId);

            if (section == null)
                return NotFound("Section not found");  // Retourner 404 si la section n'existe pas

            // Supprimer la section de la base de donn�es
            _context.SectionFormulaires.Remove(section);
            await _context.SaveChangesAsync();

            // Retourner un message de succ�s
            return Ok(new { message = "Section supprim�e avec succ�s" });
        }

        // POST: api/Formulaires/{formulaireId}/Sections
        [HttpPost("{formulaireId}/Sections")]
        public async Task<IActionResult> AddSectionToFormulaire(int formulaireId, [FromBody] SectionFormulaire sectionDto)
        {
            // V�rifier que le formulaire existe
            var formulaire = await _context.Formulaires
                                           .Include(f => f.Sections)
                                           .FirstOrDefaultAsync(f => f.FormulaireId == formulaireId);

            if (formulaire == null)
                return NotFound("Formulaire not found");

            // Cr�er une nouvelle section
            var section = new SectionFormulaire
            {
                Description = sectionDto.Description,
                Questions = new List<Question>()  // On laisse vide ou rempli si n�cessaire
            };

            // Ajouter la section au formulaire
            formulaire.Sections.Add(section);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Section ajout�e avec succ�s", section });
        }




    }
}




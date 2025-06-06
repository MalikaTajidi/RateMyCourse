﻿using FormationService.dto;
using FormationService.Repositories.IRepos;
using FormationService.services.interfaces;
using Microsoft.AspNetCore.Mvc;


namespace FormationService.Controllers
{
    [Route("api/formationservice/formations")]
    [ApiController]
    public class FormationController : ControllerBase
    {
        private readonly IFormationService _formationService;
        private readonly IFormationRepository _repository;

        public FormationController(IFormationService formationService, IFormationRepository repository)
        {
            _formationService = formationService;
            _repository = repository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFormation([FromBody] FormationCreateDTO formationCreateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var formation = await _formationService.CreateFormationAsync(formationCreateDto);
            return CreatedAtAction(nameof(GetFormationById), new { id = formation.FormationId }, formation);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFormations()
        {
            var formations = await _formationService.GetAllFormationsAsync();
            return Ok(formations);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormationById(int id)
        {
            var formation = await _formationService.GetFormationByIdAsync(id);

            if (formation == null)
                return NotFound();

            return Ok(formation);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFormation(int id)
        {
            var result = await _formationService.DeleteFormationAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFormation(int id, [FromBody] FormationUpdateDTO formationUpdateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var formation = await _formationService.UpdateFormationAsync(id, formationUpdateDto);

            if (formation == null)
                return NotFound();

            return Ok(formation);
        }
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<FormationResponseDTO>>> SearchFormations([FromQuery] string? keyword)
        {
            var results = await _formationService.SearchFormationsAsync(keyword);
            return Ok(results);
        }

        [HttpGet("niveau/{niveauId}/modules")]
        public async Task<ActionResult<IEnumerable<ModuleByNiveauResponse>>> GetModulesByNiveau(int niveauId)
        {
            try
            {
                var modules = await _repository.GetModulesByNiveauIdAsync(niveauId);
                return Ok(modules);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpGet("modules/{id}")]
        public async Task<ActionResult<ModuleByNiveauResponse>> GetModuleById(int id)
        {
            try
            {
                var module = await _repository.GetModuleByIdAsync(id);
                if (module == null)
                    return NotFound();

                return Ok(module);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }


    }
}
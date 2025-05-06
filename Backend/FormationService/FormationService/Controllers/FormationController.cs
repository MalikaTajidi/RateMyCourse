using FormationService.dto;
using FormationService.services.interfaces;
using Microsoft.AspNetCore.Mvc;


namespace FormationService.Controllers
{
    [Route("api/formationservice/formations")]
    [ApiController]
    public class FormationController : ControllerBase
    {
        //private readonly IFormationService _service;

        //public FormationController(IFormationService service)
        //{
        //    _service = service;
        //}

        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<FormationReadDTO>>> GetAll()
        //=> Ok(await _service.GetAllAsync());

        //[HttpGet("{id}")]
        //public async Task<ActionResult<FormationReadDTO>> GetById(int id)
        //{
        //    var dto = await _service.GetByIdAsync(id);
        //    return dto == null ? NotFound() : Ok(dto);
        //}

        //[HttpGet("search")]
        //public async Task<ActionResult<IEnumerable<FormationReadDTO>>> Search([FromQuery] string? name, [FromQuery] string? school)
        //    => Ok(await _service.SearchAsync(name, school));

        //[HttpPost]
        //public async Task<ActionResult<FormationReadDTO>> Create(FormationCreateDTO dto)
        //{
        //    var created = await _service.CreateAsync(dto);
        //    return CreatedAtAction(nameof(GetById), new { id = created.FormationId }, created);
        //}

        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update(int id, FormationUpdateDTO dto)
        //{
        //    var success = await _service.UpdateAsync(id, dto);
        //    return success ? NoContent() : NotFound();
        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var success = await _service.DeleteAsync(id);
        //    return success ? NoContent() : NotFound();
        //}
    }
}

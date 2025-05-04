using FormationService.dto;
using FormationService.Models;
using FormationService.Repositories.IRepos;
using FormationService.services.interfaces;

namespace FormationService.services.Impl
{
    public class FormationService : IFormationService
    {
        private readonly IFormationRepository _repo;
        private readonly IMapper _mapper;

        public FormationService(IFormationRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<FormationReadDTO>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<FormationReadDTO>>(list);
        }

        public async Task<FormationReadDTO?> GetByIdAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity == null ? null : _mapper.Map<FormationReadDTO>(entity);
        }

        public async Task<IEnumerable<FormationReadDTO>> SearchAsync(string? name, string? school)
        {
            var results = await _repo.SearchAsync(name, school);
            return _mapper.Map<IEnumerable<FormationReadDTO>>(results);
        }

        public async Task<FormationReadDTO> CreateAsync(FormationCreateDTO dto)
        {
            var formation = _mapper.Map<Formation>(dto);
            await _repo.CreateAsync(formation);
            await _repo.SaveChangesAsync();
            return _mapper.Map<FormationReadDTO>(formation);
        }

        public async Task<bool> UpdateAsync(int id, FormationUpdateDTO dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            _mapper.Map(dto, existing);
            await _repo.UpdateAsync(existing);
            return await _repo.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            await _repo.DeleteAsync(existing);
            return await _repo.SaveChangesAsync();
        }

        //Task<IEnumerable<FormationReadDTO>> IFormationService.GetAllAsync()
        //{
        //    throw new NotImplementedException();
        //}

        //Task<FormationReadDTO?> IFormationService.GetByIdAsync(int id)
        //{
        //    throw new NotImplementedException();
        //}

        //Task<IEnumerable<FormationReadDTO>> IFormationService.SearchAsync(string? name, string? school)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<FormationReadDTO> CreateAsync(FormationCreateDTO dto)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<bool> UpdateAsync(int id, FormationUpdateDTO dto)
        //{
        //    throw new NotImplementedException();
        //}
    }
}

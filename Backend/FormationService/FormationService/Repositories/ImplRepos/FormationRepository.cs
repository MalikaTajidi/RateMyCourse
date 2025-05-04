using FormationService.Models;
using FormationService.Repositories.IRepos;
using Microsoft.EntityFrameworkCore;

namespace FormationService.Repositories.ImplRepos
{
    public class FormationRepository : IFormationRepository
    {
        private readonly FormationDbContext _context;

        public FormationRepository(FormationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Formation>> GetAllAsync()
            => await _context.Formations.ToListAsync();

        public async Task<Formation?> GetByIdAsync(int id)
            => await _context.Formations.FindAsync(id);

        public async Task<IEnumerable<Formation>> SearchAsync(string? name, string? school)
        {
            return await _context.Formations
                .Where(f =>
                    (string.IsNullOrEmpty(name) || f.FormationName.Contains(name)) &&
                    (string.IsNullOrEmpty(school) || f.SchoolName.Contains(school)))
                .ToListAsync();
        }

        public async Task CreateAsync(Formation formation)
            => await _context.Formations.AddAsync(formation);

        public async Task UpdateAsync(Formation formation)
            => _context.Formations.Update(formation);

        public async Task DeleteAsync(Formation formation)
            => _context.Formations.Remove(formation);

        public async Task<bool> SaveChangesAsync()
            => await _context.SaveChangesAsync() > 0;
    }
}


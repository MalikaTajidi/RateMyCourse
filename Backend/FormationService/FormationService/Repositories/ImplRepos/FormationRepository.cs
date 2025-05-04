using FormationService.Models;
using Microsoft.EntityFrameworkCore;

namespace FormationService.Repositories.ImplRepos
{
    public class FormationRepository
    {
        private readonly FormationDbContext _context;

        public FormationRepository(FormationDbContext context)
        {
            _context = context;
        }

        public async Task<Formation> AddFormationAsync(Formation formation)
        {
            _context.Formations.Add(formation);
            await _context.SaveChangesAsync();
            return formation;
        }

        public async Task<Formation> GetFormationByIdAsync(int id)
        {
            return await _context.Formations
                .Include(f => f.ModuleFormations)
                .FirstOrDefaultAsync(f => f.FormationId == id);
        }
    }
}


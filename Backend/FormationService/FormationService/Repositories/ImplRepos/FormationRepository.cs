using System;
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

        public async Task<Formation> CreateFormationAsync(Formation formation, string formationName, List<string> moduleNames)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Create or get niveau based on formation name
                var niveau = await _context.Niveaux
                    .FirstOrDefaultAsync(n => n.Name == formationName);

                if (niveau == null)
                {
                    niveau = new Niveau
                    {
                        Name = formationName,
                        ModuleFormations = new List<ModuleFormation>()
                    };
                    _context.Niveaux.Add(niveau);
                    await _context.SaveChangesAsync();
                }

                // Add the formation
                _context.Formations.Add(formation);
                await _context.SaveChangesAsync();

                // Create or get modules
                foreach (var moduleName in moduleNames)
                {
                    var module = await _context.Modules
                        .FirstOrDefaultAsync(m => m.Name == moduleName);

                    if (module == null)
                    {
                        module = new Module
                        {
                            Name = moduleName,
                            ModuleFormations = new List<ModuleFormation>()
                        };
                        _context.Modules.Add(module);
                        await _context.SaveChangesAsync();
                    }

                    // Create association between Formation, Niveau, and Module
                    var moduleFormation = new ModuleFormation
                    {
                        FormationId = formation.FormationId,
                        Formation = formation,
                        NiveauId = niveau.NiveauId,
                        Niveau = niveau,
                        ModuleId = module.ModuleId,
                        Module = module
                    };

                    _context.ModuleFormations.Add(moduleFormation);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return formation;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<Formation>> GetAllFormationsAsync()
        {
            return await _context.Formations
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Module)
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Niveau)
                .ToListAsync();
        }

        public async Task<Formation?> GetFormationByIdAsync(int id)
        {
            return await _context.Formations
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Module)
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Niveau)
                .FirstOrDefaultAsync(f => f.FormationId == id);
        }

        public async Task<bool> DeleteFormationAsync(int id)
        {
            var formation = await _context.Formations
                .Include(f => f.ModuleFormations)
                .FirstOrDefaultAsync(f => f.FormationId == id);

            if (formation == null)
                return false;

            // Remove ModuleFormation relationships
            _context.ModuleFormations.RemoveRange(formation.ModuleFormations);

            // Remove Formation
            _context.Formations.Remove(formation);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Formation?> UpdateFormationAsync(int id, Formation formation)
        {
            var existingFormation = await _context.Formations
                .FirstOrDefaultAsync(f => f.FormationId == id);

            if (existingFormation == null)
                return null;

            existingFormation.SchoolName = formation.SchoolName;
            existingFormation.Description = formation.Description;

            await _context.SaveChangesAsync();
            return existingFormation;
        }
    }
}



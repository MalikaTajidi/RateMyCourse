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

        public async Task<Formation> CreateFormationAsync(Formation formation, List<string> niveauNames, List<string> moduleNames)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                
                if (formation.ModuleFormations == null)
                {
                    formation.ModuleFormations = new List<ModuleFormation>();
                }

                // Step 1: Save the Formation with FormationName
                await _context.Formations.AddAsync(formation);
                await _context.SaveChangesAsync();

                // Step 2: Create or get modules
                var modules = new List<Module>();
                foreach (var moduleName in moduleNames)
                {
                    var module = await _context.Modules.FirstOrDefaultAsync(m => m.Name == moduleName);
                    if (module == null)
                    {
                        module = new Module
                        {
                            Name = moduleName,
                            ModuleFormations = new List<ModuleFormation>() // Initialiser la collection ModuleFormations
                        };
                        await _context.Modules.AddAsync(module);
                        await _context.SaveChangesAsync();
                    }
                    modules.Add(module);
                }

                // Step 3: Create the three niveaux from the FormationName
                var niveaux = new List<Niveau>();
                foreach (var niveauName in niveauNames)
                {
                    var niveau = new Niveau
                    {
                        Name = niveauName,
                        ModuleFormations = new List<ModuleFormation>() // Initialiser la collection ModuleFormations
                    };
                    await _context.Niveaux.AddAsync(niveau);
                    await _context.SaveChangesAsync();
                    niveaux.Add(niveau);
                }

                // Step 4: Create the relationships in ModuleFormation table
                foreach (var module in modules)
                {
                    foreach (var niveau in niveaux)
                    {
                        var moduleFormation = new ModuleFormation
                        {
                            FormationId = formation.FormationId,
                            Formation = formation,
                            ModuleId = module.ModuleId,
                            Module = module,
                            NiveauId = niveau.NiveauId,
                            Niveau = niveau
                        };

                        // Ajout aux collections de navigation
                        formation.ModuleFormations.Add(moduleFormation);
                        module.ModuleFormations.Add(moduleFormation);
                        niveau.ModuleFormations.Add(moduleFormation);

                        await _context.ModuleFormations.AddAsync(moduleFormation);
                    }
                }
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                // Return the formation with relationships loaded
                return await GetFormationByIdAsync(formation.FormationId);
            }
            catch (Exception)
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
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Charger la formation avec TOUTES ses relations
                var formation = await _context.Formations
                    .Include(f => f.ModuleFormations)
                        .ThenInclude(mf => mf.Module)
                    .Include(f => f.ModuleFormations)
                        .ThenInclude(mf => mf.Niveau)
                    .FirstOrDefaultAsync(f => f.FormationId == id);

                if (formation == null)
                    return false;

                // 2. Collecter tous les éléments à supprimer
                var moduleFormations = formation.ModuleFormations.ToList();
                var modules = moduleFormations.Select(mf => mf.Module).Distinct().ToList();
                var niveaux = moduleFormations.Select(mf => mf.Niveau).Distinct().ToList();

                // 3. Supprimer les relations ModuleFormation
                _context.ModuleFormations.RemoveRange(moduleFormations);

                // 4. Supprimer la formation
                _context.Formations.Remove(formation);

                // 5. Supprimer les niveaux spécifiques à cette formation
                foreach (var niveau in niveaux)
                {
                    // Vérifier si le niveau appartient exclusivement à cette formation
                    var isNiveauUsedElsewhere = await _context.ModuleFormations
                        .AnyAsync(mf => mf.NiveauId == niveau.NiveauId && mf.FormationId != id);

                    if (!isNiveauUsedElsewhere && niveau.Name.StartsWith(formation.FormationName))
                    {
                        _context.Niveaux.Remove(niveau);
                    }
                }

                // 6. Supprimer les modules orphelins
                foreach (var module in modules)
                {
                        _context.Modules.Remove(module);
                    
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Loguer l'erreur (ex)
                throw;
            }
        }

        public async Task<Formation?> UpdateFormationAsync(int id, Formation formation, List<string> moduleNames, bool updateNiveauNames)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingFormation = await _context.Formations
                    .Include(f => f.ModuleFormations)
                        .ThenInclude(mf => mf.Module)
                    .Include(f => f.ModuleFormations)
                        .ThenInclude(mf => mf.Niveau)
                    .FirstOrDefaultAsync(f => f.FormationId == id);

                if (existingFormation == null)
                    return null;

                // Mise à jour des propriétés de base de la formation
                existingFormation.FormationName = formation.FormationName;
                existingFormation.SchoolName = formation.SchoolName;
                existingFormation.Description = formation.Description;

                // Obtenir les niveaux existants pour cette formation
                var existingNiveaux = existingFormation.ModuleFormations
                    .Select(mf => mf.Niveau)
                    .DistinctBy(n => n.NiveauId)
                    .ToList();

                // Si le nom de formation a changé, mettre à jour les noms des niveaux
                if (updateNiveauNames)
                {
                    // Trouver les noms de niveau avec le format "Ancien Nom Formation X"
                    var oldFormationName = existingFormation.FormationName;

                    foreach (var niveau in existingNiveaux)
                    {
                        // Vérifier si le nom du niveau commence par l'ancien nom de formation
                        // OU si le niveau suit le format de nom standard "NomFormation X"
                        if (niveau.Name.StartsWith(oldFormationName) ||
                            (niveau.Name.Contains("1") || niveau.Name.Contains("2") || niveau.Name.Contains("3")))
                        {
                            // Extraire le suffixe (comme " 1", " 2", " 3")
                            string suffix = "";
                            if (niveau.Name.EndsWith("1")) suffix = " 1";
                            else if (niveau.Name.EndsWith("2")) suffix = " 2";
                            else if (niveau.Name.EndsWith("3")) suffix = " 3";

                            // Mettre à jour le nom de niveau avec le nouveau nom de formation
                            niveau.Name = formation.FormationName + suffix;
                        }
                    }
                }

                // Obtenir les modules existants associés à cette formation
                var existingModules = existingFormation.ModuleFormations
                    .Select(mf => mf.Module)
                    .DistinctBy(m => m.ModuleId)
                    .ToList();

                // Créer un dictionnaire des modules existants par nom
                var existingModulesByName = existingModules.ToDictionary(m => m.Name, StringComparer.OrdinalIgnoreCase);

                // Collection pour suivre les ModuleFormations à conserver
                var moduleFormationsToKeep = new HashSet<int>();

                // Traiter chaque nom de module fourni
                foreach (var moduleName in moduleNames)
                {
                    // Vérifier si ce module existe déjà pour cette formation
                    if (existingModulesByName.TryGetValue(moduleName, out var existingModule))
                    {
                        // Le module existe déjà avec le bon nom, conserver ses ModuleFormations
                        var moduleFormations = existingFormation.ModuleFormations
                            .Where(mf => mf.ModuleId == existingModule.ModuleId)
                            .ToList();

                        foreach (var mf in moduleFormations)
                        {
                            moduleFormationsToKeep.Add(mf.ModuleFormationId);
                        }
                    }
                    else
                    {
                        // Vérifier si le module existe dans la base de données
                        var module = await _context.Modules.FirstOrDefaultAsync(m => m.Name == moduleName);

                        if (module == null)
                        {
                            // Créer un nouveau module si nécessaire
                            module = new Module
                            {
                                Name = moduleName,
                                ModuleFormations = new List<ModuleFormation>()
                            };
                            await _context.Modules.AddAsync(module);
                            await _context.SaveChangesAsync();
                        }

                        // Créer des ModuleFormations pour ce module avec les niveaux existants
                        foreach (var niveau in existingNiveaux)
                        {
                            var moduleFormation = new ModuleFormation
                            {
                                FormationId = existingFormation.FormationId,
                                Formation = existingFormation,
                                ModuleId = module.ModuleId,
                                Module = module,
                                NiveauId = niveau.NiveauId,
                                Niveau = niveau
                            };

                            existingFormation.ModuleFormations.Add(moduleFormation);
                            module.ModuleFormations.Add(moduleFormation);
                            niveau.ModuleFormations.Add(moduleFormation);

                            await _context.ModuleFormations.AddAsync(moduleFormation);
                        }
                    }
                }

                // Identifier les ModuleFormations à supprimer (celles qui ne sont pas dans moduleFormationsToKeep 
                // et dont le module n'est pas dans moduleNames)
                var moduleFormationsToRemove = existingFormation.ModuleFormations
                    .Where(mf => !moduleFormationsToKeep.Contains(mf.ModuleFormationId) &&
                                 !moduleNames.Contains(mf.Module.Name, StringComparer.OrdinalIgnoreCase))
                    .ToList();

                // Supprimer les ModuleFormations qui ne sont plus nécessaires
                if (moduleFormationsToRemove.Any())
                {
                    _context.ModuleFormations.RemoveRange(moduleFormationsToRemove);

                    // Mise à jour des collections en mémoire
                    foreach (var mf in moduleFormationsToRemove)
                    {
                        existingFormation.ModuleFormations.Remove(mf);
                        mf.Module.ModuleFormations.Remove(mf);
                        mf.Niveau.ModuleFormations.Remove(mf);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetFormationByIdAsync(id);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<Formation> GetFormationWithModulesByIdAsync(int id)
        {
            return await _context.Formations
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Module)
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Niveau)
                .FirstOrDefaultAsync(f => f.FormationId == id);
        }

        public async Task<Module> GetModuleByNameAsync(string name)
        {
            return await _context.Modules
                .FirstOrDefaultAsync(m => m.Name == name);
        }
    }
}



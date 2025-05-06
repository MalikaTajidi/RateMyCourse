using FormationService.dto;
using FormationService.Models;
using FormationService.Repositories.IRepos;
using FormationService.services.interfaces;
using AutoMapper;

namespace FormationService.services.Impl
{
    public class FormationService : IFormationService
        {
            private readonly IFormationRepository _repository;
            private readonly IMapper _mapper;

            public FormationService(IFormationRepository repository, IMapper mapper)
            {
                _repository = repository;
                _mapper = mapper;
            }

            public async Task<FormationResponseDTO> CreateFormationAsync(FormationCreateDTO formationCreateDto)
            {
            
            var formation = new Formation
            {  
                SchoolName = formationCreateDto.SchoolName,
                Description = formationCreateDto.Description ?? string.Empty,
                FormationName = formationCreateDto.FormationName, 
                ModuleFormations = new List<ModuleFormation>()
            };

            // Generate three niveau names based on the FormationName
            var niveauNames = new List<string>
            {
                $"{formationCreateDto.FormationName} 1",
                $"{formationCreateDto.FormationName} 2",
                $"{formationCreateDto.FormationName} 3"
            };

            // Get module names from the request
            var moduleNames = formationCreateDto.Modules?.Select(m => m.Name).ToList() ?? new List<string>();
            var createdFormation = await _repository.CreateFormationAsync(formation, niveauNames, moduleNames);

            return await ConvertToResponseDTO(createdFormation);
        }

            public async Task<IEnumerable<FormationResponseDTO>> GetAllFormationsAsync()
            {
                var formations = await _repository.GetAllFormationsAsync();
                var formationDtos = new List<FormationResponseDTO>();

                foreach (var formation in formations)
                {
                    formationDtos.Add(await ConvertToResponseDTO(formation));
                }

                return formationDtos;
            }

            public async Task<FormationResponseDTO> GetFormationByIdAsync(int id)
            {
                var formation = await _repository.GetFormationByIdAsync(id);
                if (formation == null)
                    return null;

                return await ConvertToResponseDTO(formation);
            }

            public async Task<bool> DeleteFormationAsync(int id)
            {
                return await _repository.DeleteFormationAsync(id);
            }

        public async Task<FormationResponseDTO> UpdateFormationAsync(int id, FormationUpdateDTO formationUpdateDto)
        {
            // Récupérer la formation existante
            var existingFormation = await _repository.GetFormationWithModulesByIdAsync(id);
            if (existingFormation == null)
            {
                throw new KeyNotFoundException($"Formation avec l'ID {id} non trouvée");
            }

            // Mapper les propriétés de base
            var formationToUpdate = _mapper.Map<Formation>(formationUpdateDto);
            formationToUpdate.FormationId = id;

            // Préparer les mises à jour des modules
            var moduleUpdates = formationUpdateDto.Modules?
                .Select(m => new ModuleUpdateDTO
                {
                    ModuleId = m.ModuleId,
                    Name = m.Name
                })
                .ToList() ?? new List<ModuleUpdateDTO>();

            // Vérifier si le nom de la formation a changé
            bool formationNameChanged = existingFormation.FormationName != formationUpdateDto.FormationName;

            // Mise à jour de la formation avec ses modules
            var updatedFormation = await _repository.UpdateFormationAsync(
                id,
                formationToUpdate,
                moduleUpdates,
                formationNameChanged);

            return await ConvertToResponseDTO(updatedFormation);
        }


        private async Task<FormationResponseDTO> ConvertToResponseDTO(Formation formation)
            {
               
                formation = await _repository.GetFormationByIdAsync(formation.FormationId);

                var formationDto = new FormationResponseDTO
                {
                    FormationId = formation.FormationId,
                    SchoolName = formation.SchoolName,
                    Description = formation.Description,
                    FormationName = formation.FormationName
                };

                var modules = formation.ModuleFormations
                    .Select(mf => new ModuleResponse
                    {
                        ModuleId = mf.Module.ModuleId,
                        Name = mf.Module.Name
                    })
                    .DistinctBy(m => m.ModuleId)
                    .ToList();

                formationDto.Modules = modules;

                return formationDto;
            }
        public async Task<IEnumerable<FormationResponseDTO>> SearchFormationsAsync(string? keyword)
        {
            var formations = await _repository.SearchFormationsAsync(keyword);
            return formations.Select(f => ConvertToResponseDTO(f).Result);
        }
    }

    }


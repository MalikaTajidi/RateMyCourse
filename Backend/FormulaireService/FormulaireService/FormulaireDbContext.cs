using FormulaireService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;


namespace FormulaireService
{
    public class FormulaireDbContext : DbContext // <== inherit from DbContext
    {
        public FormulaireDbContext(DbContextOptions<FormulaireDbContext> options)
            : base(options) { }

        public DbSet<Formulaire> Formulaires { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<SectionFormulaire> SectionFormulaires { get; set; }  // renamed Profs to SectionFormulaires
    }
}

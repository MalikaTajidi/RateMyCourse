using FormulaireService;
using FormulaireService.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Enregistrement du DbContext
builder.Services.AddDbContext<FormulaireDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Enregistrement du repository g�n�rique
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Ajout des services pour les contr�leurs et Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Formulaire API",
        Version = "v1",
        Description = "API pour g�rer les formulaires"
    });
});

var app = builder.Build();

// Configuration du pipeline de requ�tes HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Formulaire API v1"));
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

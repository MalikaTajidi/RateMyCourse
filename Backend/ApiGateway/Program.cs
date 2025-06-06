using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// 👉 Charger la configuration Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// 👉 Ajouter CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") // votre app Angular
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// 👉 Ajouter Ocelot
builder.Services.AddOcelot();

// 👉 Ajouter le port pour l'API Gateway
builder.WebHost.UseUrls("http://localhost:7000");

var app = builder.Build();

// 👉 Utiliser CORS avant Ocelot
app.UseCors("AllowAngular");

// 👉 Middleware Ocelot
await app.UseOcelot();

app.Run();
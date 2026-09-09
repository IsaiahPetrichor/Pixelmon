using Npgsql;
using Microsoft.AspNetCore.Identity;
using Pixelmon.Api.Models;
using Microsoft.OpenApi.Models;
using Pixelmon.Api.Middleware;
using Pixelmon.Api.Services;
using Pixelmon.Api.Swagger;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddSingleton<AdminTokenService>();
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

var databaseConnectionString = builder.Configuration.GetConnectionString("PixelmonDatabase")
    ?? throw new InvalidOperationException(
        "The 'PixelmonDatabase' connection string is required. Configure ConnectionStrings:PixelmonDatabase.");

builder.Services.AddSingleton(NpgsqlDataSource.Create(databaseConnectionString));
builder.Services.AddSingleton<IDatabaseService, DatabaseService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "Admin token",
        In = ParameterLocation.Header,
        Description = "Enter the token returned by POST /AdminAuth/verify."
    });
    options.OperationFilter<AdminAuthorizationOperationFilter>();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();

        policy.WithOrigins("http://192.168.0.46")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

    options.AddPolicy("ProdPolicy", policy =>
    {
        policy.WithOrigins("https://isaiahpetrichor.github.io/")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("DevPolicy");
if (!app.Environment.IsDevelopment())
{
    app.UseCors("ProdPolicy");
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseMiddleware<AdminAuthorizationMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();

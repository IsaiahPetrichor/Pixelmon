using Npgsql;
using Pixelmon.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var databaseConnectionString = builder.Configuration.GetConnectionString("PixelmonDatabase")
    ?? throw new InvalidOperationException(
        "The 'PixelmonDatabase' connection string is required. Configure ConnectionStrings:PixelmonDatabase.");

builder.Services.AddSingleton(NpgsqlDataSource.Create(databaseConnectionString));
builder.Services.AddSingleton<IDatabaseService, DatabaseService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("DevPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

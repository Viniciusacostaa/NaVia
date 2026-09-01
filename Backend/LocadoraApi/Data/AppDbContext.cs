using Microsoft.EntityFrameworkCore;
using LocadoraApi.Models;

namespace LocadoraApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Carro> Carros { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }
    }
}
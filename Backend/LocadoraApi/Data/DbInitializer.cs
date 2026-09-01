using LocadoraApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LocadoraApi.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Garante que o banco de dados e as tabelas estejam criados
            context.Database.Migrate();

            // 1. Seed de Veículos (Garante que os veículos persistam de forma definitiva)
            if (!context.Carros.Any())
            {
                var carrosIniciais = new List<Carro>
                {
                    new Carro
                    {
                        Marca = "Honda",
                        Modelo = "Civic Touring 1.5 Turbo",
                        Ano = 2024,
                        Cor = "Preto Cristal",
                        Categoria = "Sedan",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 220.00m,
                        ImgUrl = "/civic.png"
                    },
                    new Carro
                    {
                        Marca = "Toyota",
                        Modelo = "Corolla Altis Hybrid",
                        Ano = 2024,
                        Cor = "Prata Lunar",
                        Categoria = "Sedan",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 210.00m,
                        ImgUrl = "/corolla.png"
                    },
                    new Carro
                    {
                        Marca = "Volkswagen",
                        Modelo = "Golf GTI 2.0 TSI",
                        Ano = 2023,
                        Cor = "Vermelho Tornado",
                        Categoria = "Hatchback",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 280.00m,
                        ImgUrl = "/golf.webp"
                    },
                    new Carro
                    {
                        Marca = "Jeep",
                        Modelo = "Compass Limited T270",
                        Ano = 2024,
                        Cor = "Cinza Granite",
                        Categoria = "SUV",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 260.00m,
                        ImgUrl = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60"
                    },
                    new Carro
                    {
                        Marca = "BMW",
                        Modelo = "320i M Sport 2.0",
                        Ano = 2024,
                        Cor = "Azul Portimão",
                        Categoria = "Luxo",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 450.00m,
                        ImgUrl = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60"
                    },
                    new Carro
                    {
                        Marca = "Porsche",
                        Modelo = "911 Carrera S",
                        Ano = 2023,
                        Cor = "Amarelo Racing",
                        Categoria = "Esportivo",
                        Cambio = "Automático",
                        Disponivel = false,
                        PrecoDiaria = 1200.00m,
                        ImgUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60"
                    },
                    new Carro
                    {
                        Marca = "Ford",
                        Modelo = "Mustang GT 5.0 V8",
                        Ano = 2023,
                        Cor = "Vermelho Race",
                        Categoria = "Esportivo",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 850.00m,
                        ImgUrl = "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&auto=format&fit=crop&q=60"
                    },
                    new Carro
                    {
                        Marca = "Toyota",
                        Modelo = "Hilux SRX 4x4 Diesel",
                        Ano = 2024,
                        Cor = "Branco Polar",
                        Categoria = "Picape",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 380.00m,
                        ImgUrl = "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop&q=60"
                    },
                    new Carro
                    {
                        Marca = "BYD",
                        Modelo = "Seal AWD 530cv",
                        Ano = 2024,
                        Cor = "Azul Glacial",
                        Categoria = "Elétrico",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 340.00m,
                        ImgUrl = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60"
                    },
                    new Carro
                    {
                        Marca = "Chevrolet",
                        Modelo = "Onix Premier 1.0 Turbo",
                        Ano = 2024,
                        Cor = "Cinza Drake",
                        Categoria = "Hatchback",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 130.00m,
                        ImgUrl = "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=60"
                    },
                    new Carro
                    {
                        Marca = "Hyundai",
                        Modelo = "Creta Ultimate 2.0",
                        Ano = 2024,
                        Cor = "Branco Perolizado",
                        Categoria = "SUV",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 195.00m,
                        ImgUrl = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60"
                    },
                    new Carro
                    {
                        Marca = "Volvo",
                        Modelo = "XC60 T8 Recharge",
                        Ano = 2024,
                        Cor = "Preto Ônix",
                        Categoria = "Luxo",
                        Cambio = "Automático",
                        Disponivel = true,
                        PrecoDiaria = 520.00m,
                        ImgUrl = "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=60"
                    }
                };

                context.Carros.AddRange(carrosIniciais);
                context.SaveChanges();
            }

            // 2. Seed de Usuários (Garante a existência da conta Admin e um Cliente de teste)
            var adminExistente = context.Usuarios.FirstOrDefault(u => u.Email == "admin@navia.com" || u.Nome.ToLower() == "admin");
            if (adminExistente == null)
            {
                var adminUser = new Usuario
                {
                    Nome = "Admin",
                    Email = "admin@navia.com",
                    Senha = "admin",
                    Telefone = "(11) 99999-0000",
                    FotoPerfil = "",
                    Tipo = "Admin"
                };
                context.Usuarios.Add(adminUser);
                context.SaveChanges();
            }
            else
            {
                // Garante que o tipo seja Admin e senha seja admin
                if (adminExistente.Tipo != "Admin" || adminExistente.Senha != "admin")
                {
                    adminExistente.Tipo = "Admin";
                    adminExistente.Senha = "admin";
                    context.SaveChanges();
                }
            }

            var clienteTeste = context.Usuarios.FirstOrDefault(u => u.Email == "cliente@navia.com");
            if (clienteTeste == null)
            {
                context.Usuarios.Add(new Usuario
                {
                    Nome = "Cliente Demonstração",
                    Email = "cliente@navia.com",
                    Senha = "cliente123",
                    Telefone = "(11) 98888-1111",
                    FotoPerfil = "",
                    Tipo = "Cliente"
                });
                context.SaveChanges();
            }
        }
    }
}

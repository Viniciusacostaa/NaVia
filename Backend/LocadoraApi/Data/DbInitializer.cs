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
                    ImgUrl = "/cars/civic.jpg"
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
                    ImgUrl = "/cars/corolla.jpg"
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
                    ImgUrl = "/cars/golf.jpg"
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
                    ImgUrl = "/cars/compass.jpg"
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
                    ImgUrl = "/cars/bmw320i.jpg"
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
                    ImgUrl = "/cars/porsche911.jpg"
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
                    ImgUrl = "/cars/mustang.jpg"
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
                    ImgUrl = "/cars/hilux.jpg"
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
                    ImgUrl = "/cars/bydseal.jpg"
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
                    ImgUrl = "/cars/onix.jpg"
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
                    ImgUrl = "/cars/creta.jpg"
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
                    ImgUrl = "/cars/volvo.jpg"
                }
            };

            if (!context.Carros.Any())
            {
                context.Carros.AddRange(carrosIniciais);
                context.SaveChanges();
            }
            else
            {
                // Sincroniza fotos e dados dos modelos existentes com os novos caminhos
                foreach (var carroSeed in carrosIniciais)
                {
                    var existente = context.Carros.FirstOrDefault(c => c.Marca == carroSeed.Marca && c.Modelo == carroSeed.Modelo);
                    if (existente != null)
                    {
                        existente.ImgUrl = carroSeed.ImgUrl;
                        existente.Cor = carroSeed.Cor;
                        existente.Categoria = carroSeed.Categoria;
                        existente.Ano = carroSeed.Ano;
                        existente.PrecoDiaria = carroSeed.PrecoDiaria;
                    }
                    else
                    {
                        context.Carros.Add(carroSeed);
                    }
                }
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

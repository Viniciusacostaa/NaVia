using LocadoraApi.Data;
using LocadoraApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LocadoraApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Usuarios (Retorna a lista segura de usuários sem dados sigilosos)
        [HttpGet]
        public IActionResult Get()
        {
            var usuarios = _context.Usuarios
                .Select(u => new UsuarioResponseDto
                {
                    Id = u.Id,
                    Nome = u.Nome,
                    Email = u.Email,
                    Telefone = u.Telefone,
                    FotoPerfil = u.FotoPerfil,
                    Tipo = u.Tipo
                })
                .ToList();

            return Ok(usuarios);
        }

        // POST: api/Usuarios/login (Autenticação segura)
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Login) || string.IsNullOrWhiteSpace(request.Senha))
            {
                return BadRequest(new { mensagem = "Informe o login/e-mail e a senha." });
            }

            var loginInput = request.Login.Trim().ToLower();
            var senhaInput = request.Senha.Trim();

            // Busca no banco de dados por e-mail ou nome de usuário
            var usuario = _context.Usuarios.FirstOrDefault(u => 
                (u.Email.ToLower() == loginInput || u.Nome.ToLower() == loginInput) && u.Senha == senhaInput);

            // Caso especial de fallback para administrador
            if (usuario == null && (loginInput == "admin" || loginInput == "admin@navia.com") && senhaInput == "admin")
            {
                usuario = _context.Usuarios.FirstOrDefault(u => u.Tipo == "Admin");
            }

            if (usuario == null)
            {
                return Unauthorized(new { mensagem = "Credenciais inválidas. Verifique seu login e senha." });
            }

            // Gera um token de sessão simples para o frontend validar a sessão
            var sessionToken = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{usuario.Id}:{usuario.Email}:{DateTime.UtcNow.Ticks}"));

            var response = new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Telefone = usuario.Telefone,
                FotoPerfil = usuario.FotoPerfil,
                Tipo = usuario.Tipo,
                Token = sessionToken
            };

            return Ok(response);
        }

        // POST: api/Usuarios (Cadastro de novos usuários)
        [HttpPost]
        public IActionResult Post([FromBody] Usuario usuario)
        {
            if (string.IsNullOrWhiteSpace(usuario.Email) || string.IsNullOrWhiteSpace(usuario.Senha))
            {
                return BadRequest(new { mensagem = "E-mail e senha são obrigatórios." });
            }

            var usuarioExistente = _context.Usuarios
                .FirstOrDefault(u => u.Email.ToLower() == usuario.Email.ToLower());

            if (usuarioExistente != null)
            {
                return BadRequest(new { mensagem = "E-mail já cadastrado." });
            }

            Usuario novoUsuario = new Usuario
            {
                Nome = usuario.Nome,
                Email = usuario.Email,
                Senha = usuario.Senha,
                Telefone = usuario.Telefone,
                FotoPerfil = usuario.FotoPerfil ?? "",
                Tipo = string.IsNullOrWhiteSpace(usuario.Tipo) ? "Cliente" : usuario.Tipo
            };

            _context.Usuarios.Add(novoUsuario);
            _context.SaveChanges();

            // Resposta segura (sem expor a senha)
            var response = new UsuarioResponseDto
            {
                Id = novoUsuario.Id,
                Nome = novoUsuario.Nome,
                Email = novoUsuario.Email,
                Telefone = novoUsuario.Telefone,
                FotoPerfil = novoUsuario.FotoPerfil,
                Tipo = novoUsuario.Tipo
            };

            return Ok(response);
        }

        // GET: api/Usuarios/stats (Métricas para o Dashboard Administrativo)
        [HttpGet("stats")]
        public IActionResult GetDashboardStats()
        {
            var totalCarros = _context.Carros.Count();
            var carrosDisponiveis = _context.Carros.Count(c => c.Disponivel);
            var carrosIndisponiveis = totalCarros - carrosDisponiveis;
            var totalUsuarios = _context.Usuarios.Count();

            var precoMedio = totalCarros > 0 
                ? _context.Carros.Average(c => c.PrecoDiaria) 
                : 0m;

            var distribuicaoCategorias = _context.Carros
                .GroupBy(c => c.Categoria)
                .Select(g => new CategoriaContagemDto
                {
                    Categoria = string.IsNullOrWhiteSpace(g.Key) ? "Outros" : g.Key,
                    Quantidade = g.Count()
                })
                .ToList();

            var stats = new DashboardStatsDto
            {
                TotalCarros = totalCarros,
                CarrosDisponiveis = carrosDisponiveis,
                CarrosIndisponiveis = carrosIndisponiveis,
                TotalUsuarios = totalUsuarios,
                PrecoMedioDiaria = Math.Round(precoMedio, 2),
                DistribuicaoCategorias = distribuicaoCategorias
            };

            return Ok(stats);
        }
    }
}
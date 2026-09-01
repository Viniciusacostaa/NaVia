using LocadoraApi.Data;
using LocadoraApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
namespace LocadoraApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{

    private readonly AppDbContext _context;

    public UsuariosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var usuarios = _context.Usuarios.ToList();

        return Ok(usuarios);
    }

    [HttpPost]
    public IActionResult Post([FromBody] Usuario usuario)
    {

        var usuarioExistente = _context.Usuarios
            .FirstOrDefault(u => u.Email == usuario.Email);
            
        if (usuarioExistente != null)
        {
            return BadRequest("E-mail já cadastrado.");
        }

        Usuario novoUsuario = new Usuario
        {
            Nome = usuario.Nome,
            Email = usuario.Email,
            Senha = usuario.Senha,
            Telefone = usuario.Telefone,
            FotoPerfil = usuario.FotoPerfil,
            Tipo = "Cliente"
        };

        _context.Usuarios.Add(novoUsuario);
        _context.SaveChanges();

        return Ok(novoUsuario);
    }
}
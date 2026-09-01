using LocadoraApi.Data;
using LocadoraApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace LocadoraApi.Controllers;


[ApiController]
[Route("api/[controller]")]
public class CarrosController : ControllerBase {
    private readonly AppDbContext _context;

    public CarrosController(AppDbContext context) {
        _context = context;
    }
    [HttpGet]
    public IActionResult Get() {
        var carros = _context.Carros.ToList();
        return Ok(carros);
    }

    [HttpPost]
    public IActionResult Post([FromBody] Carro carro) {
        _context.Carros.Add(carro);
        _context.SaveChanges();
        return Ok(carro);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, Carro carro) {
        var CarroExistente = _context.Carros.FirstOrDefault(x => x.Id == id);

        if (CarroExistente == null) {
            return NotFound();
        }

        CarroExistente.Ano = carro.Ano;
        CarroExistente.Cambio = carro.Cambio;
        CarroExistente.Categoria = carro.Categoria;
        CarroExistente.Cor = carro.Cor;
        CarroExistente.Disponivel = carro.Disponivel;
        CarroExistente.Marca = carro.Marca;
        CarroExistente.Modelo = carro.Modelo;
        CarroExistente.PrecoDiaria = carro.PrecoDiaria;
        CarroExistente.ImgUrl = carro.ImgUrl;

        _context.SaveChanges();

        return Ok(CarroExistente);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {

        var CarroExistente = _context.Carros.FirstOrDefault(x => x.Id == id);

        if (CarroExistente == null) {
            return NotFound();
        }
        _context.Carros.Remove(CarroExistente);

        _context.SaveChanges();

        return NoContent();

    }
}
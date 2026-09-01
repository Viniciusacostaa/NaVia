namespace LocadoraApi.Models
{
    public class LoginRequest
    {
        public string Login { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }

    public class UsuarioResponseDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string FotoPerfil { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }

    public class CategoriaContagemDto
    {
        public string Categoria { get; set; } = string.Empty;
        public int Quantidade { get; set; }
    }

    public class DashboardStatsDto
    {
        public int TotalCarros { get; set; }
        public int CarrosDisponiveis { get; set; }
        public int CarrosIndisponiveis { get; set; }
        public int TotalUsuarios { get; set; }
        public decimal PrecoMedioDiaria { get; set; }
        public List<CategoriaContagemDto> DistribuicaoCategorias { get; set; } = new();
    }
}

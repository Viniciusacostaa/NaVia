namespace LocadoraApi.Models {
    public class Carro {
        public int Id { get; set; }

        public string Marca { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public int Ano { get; set; }
        public string Cor { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string Cambio { get; set; } = string.Empty;
        public bool Disponivel { get; set; }
        public decimal PrecoDiaria { get; set; }

        public string ImgUrl { get; set; } = string.Empty;

    }
}
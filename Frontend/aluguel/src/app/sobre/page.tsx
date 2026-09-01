import "./sobre.css"
import Header from "@/app/components/Header/header"

const VALORES = [
    {
        titulo: "Transparência",
        texto: "Preços claros, sem taxas escondidas. Você sabe exatamente pelo que está pagando.",
    },
    {
        titulo: "Confiabilidade",
        texto: "Frota revisada e higienizada antes de cada locação, pronta para a estrada.",
    },
    {
        titulo: "Atendimento",
        texto: "Suporte próximo, do primeiro contato até a devolução do veículo.",
    },
]

const NUMEROS = [
    { valor: "8+", label: "anos de mercado" },
    { valor: "1.200+", label: "locações realizadas" },
    { valor: "35", label: "modelos na frota" },
    { valor: "4.8/5", label: "avaliação média" },
]

export default function Sobre() {
    return (
        <div className="sobre">
            <Header />

            <main className="sobre-corpo">
                {/* Hero */}
                <section className="sobre-hero">
                    <span className="sobre-tag">Sobre nós</span>
                    <h1 className="sobre-titulo">
                        Locação de veículos pensada para quem valoriza tempo e confiança
                    </h1>
                    <p className="sobre-texto">
                        A Aluguel e cia nasceu para simplificar a locação de veículos: processo
                        direto, frota bem cuidada e um atendimento que trata cada cliente como
                        único — seja para uma viagem de fim de semana ou uma necessidade
                        corporativa recorrente.
                    </p>
                </section>

                {/* Números */}
                <section className="sobre-numeros">
                    {NUMEROS.map((item) => (
                        <div key={item.label} className="numero-card">
                            <p className="numero-valor">{item.valor}</p>
                            <p className="numero-label">{item.label}</p>
                        </div>
                    ))}
                </section>

                {/* Missão */}
                <section className="sobre-bloco">
                    <div className="sobre-bloco-texto">
                        <h2 className="sobre-subtitulo">Nossa missão</h2>
                        <p className="sobre-texto">
                            Acreditamos que alugar um carro deveria ser tão simples quanto pedir
                            uma corrida. Por isso investimos em um catálogo atualizado, um
                            processo de reserva sem burocracia e uma equipe que resolve
                            imprevistos rapidamente — para que sua única preocupação seja
                            aproveitar o trajeto.
                        </p>
                    </div>
                </section>

                {/* Valores */}
                <section className="sobre-valores-secao">
                    <h2 className="sobre-subtitulo">O que nos guia</h2>
                    <div className="valores-grid">
                        {VALORES.map((valor) => (
                            <div key={valor.titulo} className="valor-card">
                                <h3 className="valor-titulo">{valor.titulo}</h3>
                                <p className="valor-texto">{valor.texto}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA final */}
                <section className="sobre-cta">
                    <h2 className="sobre-cta-titulo">Pronto para rodar com a gente?</h2>
                    <p className="sobre-texto">
                        Confira os modelos disponíveis no nosso catálogo e reserve em poucos
                        minutos.
                    </p>
                    <a href="/catalogo" className="sobre-cta-botao">
                        Ver catálogo
                    </a>
                </section>
            </main>
        </div>
    )
}
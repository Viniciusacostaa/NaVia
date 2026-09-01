"use client"

import "./catalogo.css"
import Header from "@/app/components/Header/header"
import { useEffect, useState, useMemo } from "react"

interface Carro {
    id: number
    marca: string
    modelo: string
    ano: number
    cor: string
    categoria: string
    cambio: string
    disponivel: boolean
    precoDiaria: number
    imgUrl?: string
}

export default function Catalogo() {
    const [carros, setCarros] = useState<Carro[]>([])
    const [carregando, setCarregando] = useState(true)
    const [busca, setBusca] = useState("")
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas")

    useEffect(() => {
        async function carregarCarros() {
            try {
                const resposta = await fetch("http://localhost:5277/api/Carros")
                const dados = await resposta.json()
                setCarros(dados)
            } catch (erro) {
                console.error("Erro ao carregar carros:", erro)
            } finally {
                setCarregando(false)
            }
        }

        carregarCarros()
    }, [])

    const categorias = useMemo(() => {
        const setCats = new Set<string>()
        carros.forEach(c => {
            if (c.categoria) setCats.add(c.categoria)
        })
        return ["Todas", ...Array.from(setCats)]
    }, [carros])

    const carrosFiltrados = useMemo(() => {
        return carros.filter(carro => {
            const matchBusca = (carro.marca + " " + carro.modelo + " " + carro.cor)
                .toLowerCase()
                .includes(busca.toLowerCase())
            const matchCat = categoriaSelecionada === "Todas" || carro.categoria === categoriaSelecionada
            return matchBusca && matchCat
        })
    }, [carros, busca, categoriaSelecionada])

    return (
        <div className="catalogo">
            <Header />

            <main className="catalogo-corpo">
                <div className="catalogo-intro">
                    <h1 className="catalogo-titulo">Catálogo de Veículos</h1>
                    <p className="catalogo-subtitulo">
                        {carregando
                            ? "Carregando catálogo..."
                            : `${carrosFiltrados.length} veículo(s) encontrado(s)`}
                    </p>
                </div>

                {/* Filtros e Busca */}
                <div className="catalogo-filtros">
                    <div className="catalogo-busca-wrapper">
                        <input
                            type="text"
                            placeholder="Buscar por marca, modelo..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="catalogo-busca-input"
                        />
                    </div>

                    <div className="catalogo-pills">
                        {categorias.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategoriaSelecionada(cat)}
                                className={`pill-categoria ${categoriaSelecionada === cat ? "pill-ativa" : ""}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {carregando && (
                    <div className="gridCard">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="cardCarro cardCarro-skeleton" />
                        ))}
                    </div>
                )}

                {!carregando && carrosFiltrados.length === 0 && (
                    <div className="catalogo-vazio">
                        <p>Nenhum veículo encontrado com os filtros selecionados.</p>
                    </div>
                )}

                {!carregando && carrosFiltrados.length > 0 && (
                    <div className="gridCard">
                        {carrosFiltrados.map((carro) => (
                            <div className="cardCarro" key={carro.id}>
                                <div className="cardCarro-foto-wrapper">
                                    {carro.imgUrl ? (
                                        <img
                                            src={carro.imgUrl}
                                            alt={`${carro.marca} ${carro.modelo}`}
                                            className="cardCarro-foto"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/civic.png"
                                            }}
                                        />
                                    ) : (
                                        <div className="cardCarro-placeholder">🚗</div>
                                    )}
                                    <span
                                        className={`badge-disponivel ${carro.disponivel ? "badge-sim" : "badge-nao"}`}
                                    >
                                        {carro.disponivel ? "Disponível" : "Indisponível"}
                                    </span>
                                </div>

                                <div className="cardCarro-conteudo">
                                    <div className="cardCarro-topo">
                                        <h2 className="marcaVeiculo">
                                            {carro.marca} {carro.modelo}
                                        </h2>
                                        <span className="badge-cat-tag">{carro.categoria}</span>
                                    </div>

                                    <div className="cardCarro-specs">
                                        <p className="textoVeiculo">
                                            <span className="specLabel">Ano:</span> {carro.ano}
                                        </p>
                                        <p className="textoVeiculo">
                                            <span className="specLabel">Cor:</span> {carro.cor}
                                        </p>
                                        <p className="textoVeiculo">
                                            <span className="specLabel">Câmbio:</span> {carro.cambio}
                                        </p>
                                    </div>

                                    <div className="cardCarro-rodape">
                                        <p className="precoVeiculo">
                                            R$ {carro.precoDiaria.toFixed(2)}
                                            <span className="precoUnidade">/dia</span>
                                        </p>
                                        <button
                                            type="button"
                                            className="btn-alugar"
                                            disabled={!carro.disponivel}
                                        >
                                            {carro.disponivel ? "Reservar" : "Indisponível"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
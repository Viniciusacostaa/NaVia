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

const FROTA_INICIAL: Carro[] = [
    {
        id: 1,
        marca: "Honda",
        modelo: "Civic Touring 1.5 Turbo",
        ano: 2024,
        cor: "Preto Cristal",
        categoria: "Sedan",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 220.0,
        imgUrl: "/cars/civic.jpg",
    },
    {
        id: 2,
        marca: "Toyota",
        modelo: "Corolla Altis Hybrid",
        ano: 2024,
        cor: "Prata Lunar",
        categoria: "Sedan",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 210.0,
        imgUrl: "/cars/corolla.jpg",
    },
    {
        id: 3,
        marca: "Volkswagen",
        modelo: "Golf GTI 2.0 TSI",
        ano: 2023,
        cor: "Vermelho Tornado",
        categoria: "Hatchback",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 280.0,
        imgUrl: "/cars/golf.jpg",
    },
    {
        id: 4,
        marca: "Jeep",
        modelo: "Compass Limited T270",
        ano: 2024,
        cor: "Cinza Granite",
        categoria: "SUV",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 260.0,
        imgUrl: "/cars/compass.jpg",
    },
    {
        id: 5,
        marca: "BMW",
        modelo: "320i M Sport 2.0",
        ano: 2024,
        cor: "Azul Portimão",
        categoria: "Luxo",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 450.0,
        imgUrl: "/cars/bmw320i.jpg",
    },
    {
        id: 6,
        marca: "Porsche",
        modelo: "911 Carrera S",
        ano: 2023,
        cor: "Amarelo Racing",
        categoria: "Esportivo",
        cambio: "Automático",
        disponivel: false,
        precoDiaria: 1200.0,
        imgUrl: "/cars/porsche911.jpg",
    },
    {
        id: 7,
        marca: "Ford",
        modelo: "Mustang GT 5.0 V8",
        ano: 2023,
        cor: "Vermelho Race",
        categoria: "Esportivo",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 850.0,
        imgUrl: "/cars/mustang.jpg",
    },
    {
        id: 8,
        marca: "Toyota",
        modelo: "Hilux SRX 4x4 Diesel",
        ano: 2024,
        cor: "Branco Polar",
        categoria: "Picape",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 380.0,
        imgUrl: "/cars/hilux.jpg",
    },
    {
        id: 9,
        marca: "BYD",
        modelo: "Seal AWD 530cv",
        ano: 2024,
        cor: "Azul Glacial",
        categoria: "Elétrico",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 340.0,
        imgUrl: "/cars/bydseal.jpg",
    },
    {
        id: 10,
        marca: "Chevrolet",
        modelo: "Onix Premier 1.0 Turbo",
        ano: 2024,
        cor: "Cinza Drake",
        categoria: "Hatchback",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 130.0,
        imgUrl: "/cars/onix.jpg",
    },
    {
        id: 11,
        marca: "Hyundai",
        modelo: "Creta Ultimate 2.0",
        ano: 2024,
        cor: "Branco Perolizado",
        categoria: "SUV",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 195.0,
        imgUrl: "/cars/creta.jpg",
    },
    {
        id: 12,
        marca: "Volvo",
        modelo: "XC60 T8 Recharge",
        ano: 2024,
        cor: "Preto Ônix",
        categoria: "Luxo",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 520.0,
        imgUrl: "/cars/volvo.jpg",
    }
]

export default function Catalogo() {
    const [carros, setCarros] = useState<Carro[]>(FROTA_INICIAL)
    const [carregando, setCarregando] = useState(false)
    const [busca, setBusca] = useState("")
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas")

    useEffect(() => {
        async function carregarCarros() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5277"
                const resposta = await fetch(`${baseUrl}/api/Carros`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                })
                if (resposta.ok) {
                    const dados = await resposta.json()
                    if (Array.isArray(dados) && dados.length > 0) {
                        setCarros(dados)
                    }
                }
            } catch (erro) {
                console.warn("Backend conectando. Usando catálogo pré-carregado.", erro)
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
                                                (e.target as HTMLImageElement).src = "/cars/civic.jpg"
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
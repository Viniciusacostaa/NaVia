"use client"

import "./globals.css"
import Header from "./components/Header/header"
import Image from "next/image"
import Link from "next/link"
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
  imgUrl: string
}

// Fallback robusto para garantir carregamento instantâneo e estabilidade visual
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
]

export default function Home() {
  const [carros, setCarros] = useState<Carro[]>(FROTA_INICIAL)
  const [carregando, setCarregando] = useState(false)
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("Todas")

  useEffect(() => {
    async function carregarCarros() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5277"

        const resposta = await fetch(`${baseUrl}/api/Carros`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        })

        if (resposta.ok) {
          const dados = await resposta.json()
          if (Array.isArray(dados) && dados.length > 0) {
            setCarros(dados)
          }
        }
      } catch (erro) {
        console.warn("Backend offline ou conectando. Utilizando catálogo pré-carregado.", erro)
      } finally {
        setCarregando(false)
      }
    }

    carregarCarros()
  }, [])

  const categorias = useMemo(() => {
    const list = ["Todas", "Sedan", "SUV", "Luxo", "Hatchback", "Elétrico", "Esportivo"]
    return list
  }, [])

  const carrosExibidos = useMemo(() => {
    if (categoriaFiltro === "Todas") {
      return carros.slice(0, 6)
    }
    return carros.filter((c) => c.categoria?.toLowerCase() === categoriaFiltro.toLowerCase())
  }, [carros, categoriaFiltro])

  return (
    <div className="main-home">
      <Header />

      <main className="corpo">
        {/* Hero Banner */}
        <section className="hero-home">
          <div className="hero-badge">
            <span className="hero-dot" />
            Frota 2024 & 2025 Pronta para Locação
          </div>
          <h1 className="titulo-home">
            A liberdade de dirigir o carro dos seus sonhos.
          </h1>
          <p className="subtitulo-home">
            Descubra a experiência definitiva de locação. Veículos revisados, tecnologia de ponta, 
            reserva descomplicada e atendimento VIP em qualquer lugar.
          </p>

          <div className="hero-actions">
            <Link href="/catalogo" className="btn-primary-hero">
              Explorar Catálogo Completo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/contato" className="btn-secondary-hero">
              Falar com Especialista
            </Link>
          </div>
        </section>

        {/* Vitrine de Veículos em Destaque */}
        <div className="section-header">
          <div>
            <h2 className="section-title">Modelos em Destaque</h2>
            <p className="section-subtitle">Selecione seu modelo preferido e reserve hoje mesmo</p>
          </div>
          <Link href="/catalogo" className="link-ver-todos">
            Ver todos ({carros.length})
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Filtros rápidos */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaFiltro(cat)}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "9999px",
                border: categoriaFiltro === cat ? "1px solid #00d2ff" : "1px solid rgba(160, 202, 242, 0.2)",
                background: categoriaFiltro === cat ? "rgba(0, 210, 255, 0.15)" : "rgba(19, 36, 56, 0.6)",
                color: categoriaFiltro === cat ? "#00d2ff" : "#94b8db",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {carregando && (
          <div className="grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bloco-skeleton" />
            ))}
          </div>
        )}

        {!carregando && carrosExibidos.length === 0 && (
          <div className="grid-vazio">
            <p>Nenhum veículo encontrado nesta categoria no momento.</p>
          </div>
        )}

        {!carregando && carrosExibidos.length > 0 && (
          <div className="grid">
            {carrosExibidos.map((carro, idx) => (
              <div
                key={carro.id || idx}
                className="carro-card-home"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="imagem-wrapper">
                  <span className="badge-cat-float">{carro.categoria}</span>
                  <span
                    className={`badge-status-float ${
                      carro.disponivel ? "badge-disponivel" : "badge-indisponivel"
                    }`}
                  >
                    {carro.disponivel ? "● Disponível" : "○ Indisponível"}
                  </span>

                  <Image
                    src={carro.imgUrl || "/cars/civic.jpg"}
                    alt={`Foto do ${carro.marca} ${carro.modelo}`}
                    fill
                    className="imagem-veiculo"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                    unoptimized
                  />
                </div>

                <div className="card-corpo">
                  <div className="card-topo-info">
                    <h3 className="marca-modelo-home">
                      {carro.marca} {carro.modelo}
                    </h3>
                    <p className="cor-veiculo-home">{carro.cor}</p>
                  </div>

                  <div className="specs-mini">
                    <div className="spec-mini-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{carro.ano}</span>
                    </div>
                    <span style={{ color: "rgba(160, 202, 242, 0.3)" }}>•</span>
                    <div className="spec-mini-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      <span>{carro.cambio}</span>
                    </div>
                  </div>

                  <div className="card-rodape-home">
                    <div className="preco-box">
                      <span className="preco-label">Diária a partir de</span>
                      <span className="preco-valor">
                        R$ {Number(carro.precoDiaria).toFixed(2)}
                        <span className="preco-unidade">/dia</span>
                      </span>
                    </div>

                    <Link href="/catalogo" className="btn-card-alugar">
                      Alugar
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vantagens NaVia */}
        <section className="secao-beneficios">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>
              Por que escolher a NaVia?
            </h2>
            <p style={{ color: "#94b8db", fontSize: "0.95rem" }}>
              Qualidade comprovada, transparência total e a melhor experiência para sua viagem.
            </p>
          </div>

          <div className="beneficios-grid">
            <div className="beneficio-card">
              <div className="beneficio-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="beneficio-titulo">Seguro Completo Incluso</h3>
              <p className="beneficio-desc">Proteção contra colisão, terceiros e assistência 24 horas em todo o território nacional.</p>
            </div>

            <div className="beneficio-card">
              <div className="beneficio-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 className="beneficio-titulo">Reserva 100% Descomplicada</h3>
              <p className="beneficio-desc">Processo digital sem burocracia. Aprovação imediata e retirada expressa em nossas unidades.</p>
            </div>

            <div className="beneficio-card">
              <div className="beneficio-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3 className="beneficio-titulo">Suporte VIP 24 Horas</h3>
              <p className="beneficio-desc">Nossa equipe de concierge e atendimento está sempre a postos para qualquer suporte na estrada.</p>
            </div>

            <div className="beneficio-card">
              <div className="beneficio-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h3 className="beneficio-titulo">Frota Nova e Revisada</h3>
              <p className="beneficio-desc">Veículos com menos de 2 anos de uso, higienizados e rigorosamente inspecionados a cada entrega.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
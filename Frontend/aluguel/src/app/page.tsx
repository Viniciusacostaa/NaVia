"use client"

import "./globals.css"
import Header from "./components/Header/header"
import Image from "next/image"
import { useEffect, useState } from "react"

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

export default function Home() {
  const [carros, setCarros] = useState<Carro[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarCarros() {
      try {
        // Pega a URL do ngrok configurada na Vercel (ou cai de volta no localhost se testar localmente)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5277"

        const resposta = await fetch(`${baseUrl}/api/Carros`, {
          headers: {
            // ESSENCIAL: Ignora a página de aviso em HTML do ngrok
            "ngrok-skip-browser-warning": "true",
          },
        })

        if (!resposta.ok) {
          throw new Error(`Erro HTTP: status ${resposta.status}`)
        }

        const dados: Carro[] = await resposta.json()
        setCarros(dados.slice(0, 3))
      } catch (erro) {
        console.error("Erro ao carregar carros:", erro)
      } finally {
        setCarregando(false)
      }
    }

    carregarCarros()
  }, [])

  return (
    <div className="main-home">
      <Header />

      <main className="corpo">
        <div className="intro">
          <h1 className="titulo-home">Seja bem-vindo!</h1>
          <p className="subtitulo-home">Alguns dos nossos modelos</p>
        </div>

        {carregando && (
          <div className="grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bloco bloco-skeleton" />
            ))}
          </div>
        )}

        {!carregando && carros.length === 0 && (
          <p className="grid-vazio">Nenhum veículo disponível no momento.</p>
        )}

        {!carregando && carros.length > 0 && (
          <div className="grid">
            {carros[0] && (
              <div className="bloco">
                <div className="imagem-wrapper">
                  <Image
                    src={carros[0].imgUrl}
                    alt={`Foto do ${carros[0].marca} ${carros[0].modelo}`}
                    fill
                    className="imagem-veiculo"
                    sizes="(max-width: 768px) 90vw, 380px"
                  />
                </div>

                <div className="sobre-veiculo">
                  <p className="nome-veiculo">
                    {carros[0].marca} {carros[0].modelo}
                  </p>
                </div>

                <div className="dados-veiculo">
                  <span className="dado-item">{carros[0].ano}</span>
                  <span className="dado-separador">•</span>
                  <span className="dado-item">R$ {carros[0].precoDiaria}/dia</span>
                </div>
              </div>
            )}

            {carros[1] && (
              <div className="bloco" style={{ animationDelay: "0.08s" }}>
                <div className="imagem-wrapper">
                  <Image
                    src="/civic.png"
                    alt={`Foto do ${carros[1].marca} ${carros[1].modelo}`}
                    fill
                    className="imagem-veiculo"
                    sizes="(max-width: 768px) 90vw, 380px"
                  />
                </div>

                <div className="sobre-veiculo">
                  <p className="nome-veiculo">
                    {carros[1].marca} {carros[1].modelo}
                  </p>
                </div>

                <div className="dados-veiculo">
                  <span className="dado-item">{carros[1].ano}</span>
                  <span className="dado-separador">•</span>
                  <span className="dado-item">R$ {carros[1].precoDiaria}/dia</span>
                </div>
              </div>
            )}

            {carros[2] && (
              <div className="bloco" style={{ animationDelay: "0.16s" }}>
                <div className="imagem-wrapper">
                  <Image
                    src="/golf.webp"
                    alt={`Foto do ${carros[2].marca} ${carros[2].modelo}`}
                    fill
                    className="imagem-veiculo"
                    sizes="(max-width: 768px) 90vw, 380px"
                  />
                </div>

                <div className="sobre-veiculo">
                  <p className="nome-veiculo">
                    {carros[2].marca} {carros[2].modelo}
                  </p>
                </div>

                <div className="dados-veiculo">
                  <span className="dado-item">{carros[2].ano}</span>
                  <span className="dado-separador">•</span>
                  <span className="dado-item">R$ {carros[2].precoDiaria}/dia</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
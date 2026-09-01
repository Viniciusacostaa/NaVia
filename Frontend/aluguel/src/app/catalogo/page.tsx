"use client"

import "./catalogo.css"
import Header from "@/app/components/Header/header"
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
}

export default function Catalogo() {
    const [carros, setCarros] = useState<Carro[]>([])
    const [carregando, setCarregando] = useState(true)

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

    return (
        <div className="catalogo">
            <Header />

            <main className="catalogo-corpo">
                <div className="catalogo-intro">
                    <h1 className="catalogo-titulo">Catálogo</h1>
                    <p className="catalogo-subtitulo">
                        {carregando ? "Carregando veículos..." : `${carros.length} veículos disponíveis para locação`}
                    </p>
                </div>

                {carregando && (
                    <div className="gridCard">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="cardCarro cardCarro-skeleton" />
                        ))}
                    </div>
                )}

                {!carregando && carros.length === 0 && (
                    <p className="catalogo-vazio">Nenhum veículo encontrado no momento.</p>
                )}

                {!carregando && carros.length > 0 && (
                    <div className="gridCard">
                        {carros.map((carro) => (
                            <div className="cardCarro" key={carro.id}>
                                <div className="cardCarro-topo">
                                    <h2 className="marcaVeiculo">
                                        {carro.marca} {carro.modelo}
                                    </h2>
                                    <span
                                        className={`badge-disponivel ${carro.disponivel ? "badge-sim" : "badge-nao"}`}
                                    >
                                        {carro.disponivel ? "Disponível" : "Indisponível"}
                                    </span>
                                </div>

                                <div className="cardCarro-specs">
                                    <p className="textoVeiculo">
                                        <span className="specLabel">Ano</span> {carro.ano}
                                    </p>
                                    <p className="textoVeiculo">
                                        <span className="specLabel">Cor</span> {carro.cor}
                                    </p>
                                    <p className="textoVeiculo">
                                        <span className="specLabel">Câmbio</span> {carro.cambio}
                                    </p>
                                    <p className="textoVeiculo">
                                        <span className="specLabel">Categoria</span> {carro.categoria}
                                    </p>
                                </div>

                                <p className="precoVeiculo">
                                    R$ {carro.precoDiaria}
                                    <span className="precoUnidade">/dia</span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
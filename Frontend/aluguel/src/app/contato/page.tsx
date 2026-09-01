"use client"

import Header from "../components/Header/header"
import { useState } from "react"
import "./contato.css"

export default function Contato() {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [telefone, setTelefone] = useState("")
    const [assunto, setAssunto] = useState("Reserva")
    const [mensagem, setMensagem] = useState("")
    const [enviando, setEnviando] = useState(false)
    const [enviadoComSucesso, setEnviadoComSucesso] = useState(false)
    const [faqAberta, setFaqAberta] = useState<number | null>(0)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setEnviando(true)

        setTimeout(() => {
            setEnviando(false)
            setEnviadoComSucesso(true)
            setNome("")
            setEmail("")
            setTelefone("")
            setMensagem("")
        }, 1200)
    }

    const faqs = [
        {
            pergunta: "Quais são os requisitos mínimos para alugar um veículo?",
            resposta: "É necessário possuir CNH válida na categoria B há pelo menos 2 anos, ter idade mínima de 21 anos e apresentar um cartão de crédito no nome do titular para o bloqueio caução."
        },
        {
            pergunta: "Como funciona o seguro e a proteção inclusa?",
            resposta: "Todas as nossas locações incluem cobertura básica e proteção contra roubo, colisão e danos a terceiros. Disponibilizamos também upgrades para franquia zero e assistência premium."
        },
        {
            pergunta: "Posso retirar em uma agência e devolver em outra?",
            resposta: "Sim! A NaVia possui o serviço One-Way, permitindo que você retire o veículo na loja de sua preferência ou aeroporto e devolva em qualquer uma das nossas filiais autorizadas."
        },
        {
            pergunta: "O que fazer em caso de emergência ou pane mecânica?",
            resposta: "Nossa assistência 24 horas está pronta para atendê-lo. Basta acionar o botão de WhatsApp ou ligar gratuitamente para o nosso 0800. Providenciamos guincho e carro reserva imediato."
        }
    ]

    return (
        <div className="contato-wrapper">
            <Header />

            <main className="contato-main">
                {/* Hero / Intro da Página */}
                <section className="contato-header">
                    <div className="contato-badge">
                        <span className="dot-pulse" />
                        Atendimento Exclusivo 24/7
                    </div>
                    <h1 className="contato-titulo-principal">Fale com a NaVia</h1>
                    <p className="contato-subtitulo-principal">
                        Estamos sempre disponíveis para tirar dúvidas, auxiliar na sua reserva ou fornecer suporte completo durante a sua viagem.
                    </p>
                </section>

                {/* Grid Principal: Info + Formulário */}
                <div className="contato-grid-layout">
                    {/* Coluna Esquerda: Canais de Atendimento */}
                    <div className="contato-info-col">
                        <h2 className="info-col-titulo">Canais Diretos</h2>
                        <p className="info-col-sub">Escolha o melhor canal para falar com nosso time especializado.</p>

                        <div className="cards-canais">
                            <a 
                                href="https://wa.me/5511999990000?text=Olá,%20gostaria%20de%20informações%20sobre%20o%20aluguel%20de%20veículos" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="canal-card canal-whatsapp"
                            >
                                <div className="canal-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                    </svg>
                                </div>
                                <div className="canal-detalhes">
                                    <span className="canal-label">WhatsApp VIP (Instantâneo)</span>
                                    <strong className="canal-valor">(11) 99999-0000</strong>
                                    <span className="canal-dica">Resposta em menos de 5 minutos</span>
                                </div>
                            </a>

                            <div className="canal-card">
                                <div className="canal-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                </div>
                                <div className="canal-detalhes">
                                    <span className="canal-label">Central 0800 Gratuita</span>
                                    <strong className="canal-valor">0800 777 9000</strong>
                                    <span className="canal-dica">Segunda a Domingo, 24 horas</span>
                                </div>
                            </div>

                            <div className="canal-card">
                                <div className="canal-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                </div>
                                <div className="canal-detalhes">
                                    <span className="canal-label">E-mail Corporativo</span>
                                    <strong className="canal-valor">contato@navia.com.br</strong>
                                    <span className="canal-dica">reservas@navia.com.br</span>
                                </div>
                            </div>

                            <div className="canal-card">
                                <div className="canal-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                </div>
                                <div className="canal-detalhes">
                                    <span className="canal-label">Sede Matriz & Retirada Express</span>
                                    <strong className="canal-valor">Av. Paulista, 1000 - Bela Vista</strong>
                                    <span className="canal-dica">São Paulo - SP • CEP 01310-100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita: Formulário de Contato */}
                    <div className="contato-form-col">
                        <div className="form-card-container">
                            <h2 className="form-titulo">Envie uma Mensagem</h2>
                            <p className="form-sub">Preencha os campos abaixo e nosso time retornará rapidamente.</p>

                            {enviadoComSucesso ? (
                                <div className="mensagem-sucesso-box">
                                    <div className="sucesso-icon">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                            <polyline points="22 4 12 14.01 9 11.01"/>
                                        </svg>
                                    </div>
                                    <h3>Mensagem enviada com sucesso!</h3>
                                    <p>Obrigado pelo contato. Um de nossos especialistas entrará em contato em breve através do seu e-mail ou WhatsApp.</p>
                                    <button
                                        type="button"
                                        onClick={() => setEnviadoComSucesso(false)}
                                        className="btn-nova-mensagem"
                                    >
                                        Enviar outra mensagem
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="form-contato">
                                    <div className="form-row-dupla">
                                        <div className="form-campo">
                                            <label htmlFor="nome">Nome Completo</label>
                                            <input
                                                type="text"
                                                id="nome"
                                                required
                                                placeholder="Seu nome completo"
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                            />
                                        </div>

                                        <div className="form-campo">
                                            <label htmlFor="email">E-mail</label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                placeholder="seu@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row-dupla">
                                        <div className="form-campo">
                                            <label htmlFor="telefone">Telefone / WhatsApp</label>
                                            <input
                                                type="tel"
                                                id="telefone"
                                                placeholder="(11) 99999-9999"
                                                value={telefone}
                                                onChange={(e) => setTelefone(e.target.value)}
                                            />
                                        </div>

                                        <div className="form-campo">
                                            <label htmlFor="assunto">Assunto</label>
                                            <select
                                                id="assunto"
                                                value={assunto}
                                                onChange={(e) => setAssunto(e.target.value)}
                                            >
                                                <option value="Reserva">Informações de Reserva</option>
                                                <option value="Cotacao">Cotação Corporativa</option>
                                                <option value="Suporte">Suporte em Andamento</option>
                                                <option value="Feedback">Feedback / Elogio</option>
                                                <option value="Outros">Outros Assuntos</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-campo">
                                        <label htmlFor="mensagem">Mensagem</label>
                                        <textarea
                                            id="mensagem"
                                            rows={4}
                                            required
                                            placeholder="Como podemos te ajudar hoje?"
                                            value={mensagem}
                                            onChange={(e) => setMensagem(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={enviando}
                                        className="btn-enviar-contato"
                                    >
                                        {enviando ? (
                                            <span className="spinner-enviando">Enviando mensagem...</span>
                                        ) : (
                                            <>
                                                Enviar Mensagem
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="m22 2-7 20-4-9-9-4Z"/>
                                                    <path d="M22 2 11 13"/>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Seção de FAQ Interativa */}
                <section className="faq-secao">
                    <div className="faq-header">
                        <span className="faq-badge">Tire suas dúvidas</span>
                        <h2 className="faq-titulo">Perguntas Frequentes</h2>
                        <p className="faq-sub">Respostas rápidas para as dúvidas mais comuns dos nossos clientes.</p>
                    </div>

                    <div className="faq-accordion">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className={`faq-item ${faqAberta === index ? "faq-item-aberto" : ""}`}
                            >
                                <button
                                    type="button"
                                    className="faq-pergunta-btn"
                                    onClick={() => setFaqAberta(faqAberta === index ? null : index)}
                                >
                                    <span>{faq.pergunta}</span>
                                    <svg 
                                        className="faq-arrow" 
                                        width="20" 
                                        height="20" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                    >
                                        <path d="m6 9 6 6 6-6"/>
                                    </svg>
                                </button>
                                {faqAberta === index && (
                                    <div className="faq-resposta">
                                        <p>{faq.resposta}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "../components/Header/header"
import "./login.css"

export default function Login() {
    const [login, setLogin] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setErro("")
        setCarregando(true)

        try {
            const resposta = await fetch("http://localhost:5277/api/Usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login: login.trim(),
                    senha: senha.trim()
                })
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                setErro(dados.mensagem || "Falha ao realizar login. Verifique suas credenciais.")
                return
            }

            // Armazenamento seguro de sessão no cliente
            localStorage.setItem("navia_user", JSON.stringify({
                id: dados.id,
                nome: dados.nome,
                email: dados.email,
                telefone: dados.telefone,
                fotoPerfil: dados.fotoPerfil,
                tipo: dados.tipo
            }))

            if (dados.token) {
                localStorage.setItem("navia_token", dados.token)
            }

            // Dispara evento para o Header atualizar imediatamente
            window.dispatchEvent(new Event("navia_auth_change"))

            // Redirecionamento condicional baseado no papel (Admin -> /dashboard | Cliente -> /catalogo)
            if (dados.tipo === "Admin") {
                router.push("/dashboard")
            } else {
                router.push("/catalogo")
            }
        } catch (err) {
            console.error("Erro na requisição de login:", err)
            setErro("Não foi possível conectar ao servidor. Verifique se o backend está em execução.")
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="login-page">
            <Header />

            <main className="menu-login">
                <div className="bloco-login">
                    <div className="bloco-login-header">
                        <div className="badge-seguranca">
                            <span className="dot-status" />
                            Acesso Seguro
                        </div>
                        <h1 className="titulo">Entrar na NaVia</h1>
                        <p className="subtitulo">Acesse sua conta para gerenciar ou alugar veículos</p>
                    </div>

                    {erro && (
                        <div className="alerta-erro" role="alert">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <span>{erro}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="caixa-login">
                        <div className="campo-grupo">
                            <label htmlFor="loginInput" className="label-campo">
                                Usuário ou E-mail
                            </label>
                            <input
                                type="text"
                                className="loginInput"
                                id="loginInput"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="admin ou seu@email.com"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="campo-grupo">
                            <label htmlFor="senhaInput" className="label-campo">
                                Senha
                            </label>
                            <input
                                type="password"
                                className="senhaInput"
                                id="senhaInput"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="botao-login"
                            disabled={carregando}
                        >
                            {carregando ? (
                                <span className="carregando-spinner">Entrando...</span>
                            ) : (
                                "Acessar Plataforma"
                            )}
                        </button>

                        <div className="rodape-login">
                            <Link href="/cadastro" className="link-cadastro">
                                Ainda não tem conta? <span className="link-destaque">Cadastre-se</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
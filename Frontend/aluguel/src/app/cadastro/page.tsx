"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "../components/Header/header"
import "./cadastro.css"

export default function Cadastro() {
    const [nome, setNome] = useState("")
    const [tel, setTel] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const router = useRouter()

    async function cadastrarUsuario(e: React.FormEvent) {
        e.preventDefault()
        setErro("")
        setCarregando(true)

        try {
            const usuario = {
                nome: nome.trim(),
                email: email.trim(),
                senha: senha.trim(),
                telefone: tel.trim(),
                tipo: "Cliente"
            }

            const resposta = await fetch("http://localhost:5277/api/Usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            })

            const dados = await resposta.json()

            if (resposta.ok) {
                setSucesso(true)
                setTimeout(() => {
                    router.push("/login")
                }, 1500)
            } else {
                setErro(dados.mensagem || "Erro ao cadastrar usuário. Verifique os dados informados.")
            }
        } catch (err) {
            console.error("Erro no cadastro:", err)
            setErro("Não foi possível conectar ao servidor. Tente novamente.")
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="cadastro-page">
            <Header />

            <main className="menu-cadastro">
                <div className="bloco-cadastro">
                    <div className="bloco-cadastro-header">
                        <h1 className="titulo">Criar Nova Conta</h1>
                        <p className="subtitulo">Preencha seus dados para alugar veículos na NaVia</p>
                    </div>

                    {sucesso && (
                        <div className="alerta-sucesso" role="alert">
                            <span>✅ Conta criada com sucesso! Redirecionando para o login...</span>
                        </div>
                    )}

                    {erro && (
                        <div className="alerta-erro" role="alert">
                            <span>⚠️ {erro}</span>
                        </div>
                    )}

                    <form onSubmit={cadastrarUsuario} className="caixa-cadastro">
                        <div className="campo-grupo">
                            <label htmlFor="nomeInput" className="label-campo">Nome Completo</label>
                            <input
                                type="text"
                                className="input"
                                id="nomeInput"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Seu nome completo"
                                required
                            />
                        </div>

                        <div className="campo-grupo">
                            <label htmlFor="telInput" className="label-campo">Telefone</label>
                            <input
                                type="tel"
                                id="telInput"
                                className="input"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        <div className="campo-grupo">
                            <label htmlFor="emailInput" className="label-campo">E-mail</label>
                            <input
                                type="email"
                                id="emailInput"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seuemail@exemplo.com"
                                required
                            />
                        </div>

                        <div className="campo-grupo">
                            <label htmlFor="senhaInput" className="label-campo">Senha</label>
                            <input
                                type="password"
                                className="input"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                id="senhaInput"
                                placeholder="Crie uma senha segura"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="botao-cadastro"
                            disabled={carregando || sucesso}
                        >
                            {carregando ? "Cadastrando..." : "Finalizar Cadastro"}
                        </button>

                        <div className="rodape-cadastro">
                            <Link href="/login" className="link-login">
                                Já possui uma conta? <span className="link-destaque">Entrar</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
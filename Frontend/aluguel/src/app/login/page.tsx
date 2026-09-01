import Header from "../components/Header/header"
import Link from "next/link"
import "./login.css"

export default function Login() {
    return (
        <div className="login">
            <Header />

            <div className="menu-login">
                <div className="bloco-login">
                    <p className="titulo">Login</p>
                    <div className="caixa-login">
                        <div>
                            <label htmlFor="login" className="login">Login</label>
                            <input type="text" className="loginInput" id="login" placeholder="Email" />
                        </div>
                        <div>
                            <label htmlFor="senha" className="senha">Senha </label>
                            <input type="password" className="senhaInput" id="senha" required />
                        </div>

                        <button className="botao-login">
                            <Link href="/dashboard">Entrar</Link>
                            </button>

                        <Link href="/cadastro" className="link-cadastro">
                            Ainda não tem conta? Cadastre-se
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
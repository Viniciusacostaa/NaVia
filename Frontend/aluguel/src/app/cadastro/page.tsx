"use client"

import Header from "../components/Header/header"
import { useState } from "react";
import "./cadastro.css"

export default function Cadastro() {

    const [nome, setNome] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");


    async function cadastrarUsuario() {

        const usuario = {
            nome,
            email,
            senha,
            telefone: tel
        };

        const resposta = await fetch("http://localhost:5277/api/Usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario),

        });

        if(resposta.ok){
            console.log("Usuario cadastrado");
        } else{
            console.log("Erro ao cadastrar");
        }
    }

    return (
        <div className="login">
            <Header />

            <div className="menu-cadastro">
                <div className="bloco-cadastro">
                    <p className="titulo">Login</p>
                    <div className="caixa-cadastro">
                        <div>
                            <label htmlFor="login" className="login">Nome </label>
                            <input type="text" className="input" id="login" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome de usuario" required />
                        </div>
                        <div>
                            <label htmlFor="tel" className="login">Telefone </label>
                            <input type="tel" id="tel" className="input" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="(xx) x xxxx-xxxx" />
                        </div>
                        <div>
                            <label htmlFor="email" className="login">Email </label>
                            <input type="email" id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@gmail.com" required />
                        </div>
                        <div>
                            <label htmlFor="senha" className="login">Senha </label>
                            <input type="password" className="input" value={senha} onChange={(e) => setSenha(e.target.value)} id="senha" required />
                        </div>

                        <button className="botao-login" onClick={cadastrarUsuario}>Cadastrar</button>

                    </div>
                </div>
            </div>
        </div>
    )
}
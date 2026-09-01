"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import "./header.css"

interface UsuarioLogado {
    id: number
    nome: string
    email: string
    tipo: string
}

export default function Header() {
    const [menuAberto, setMenuAberto] = useState(false)
    const [usuario, setUsuario] = useState<UsuarioLogado | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    function checarAutenticacao() {
        const userJson = localStorage.getItem("navia_user")
        if (userJson) {
            try {
                setUsuario(JSON.parse(userJson))
            } catch {
                setUsuario(null)
            }
        } else {
            setUsuario(null)
        }
    }

    useEffect(() => {
        checarAutenticacao()

        const handleAuthChange = () => checarAutenticacao()
        window.addEventListener("navia_auth_change", handleAuthChange)
        window.addEventListener("storage", handleAuthChange)

        return () => {
            window.removeEventListener("navia_auth_change", handleAuthChange)
            window.removeEventListener("storage", handleAuthChange)
        }
    }, [])

    function handleLogout() {
        localStorage.removeItem("navia_user")
        localStorage.removeItem("navia_token")
        setUsuario(null)
        window.dispatchEvent(new Event("navia_auth_change"))
        setMenuAberto(false)
        router.push("/login")
    }

    return (
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="marca">
                    Na<span className="marca-destaque">Via</span>
                </Link>

                {/* Navegação desktop */}
                <nav className="nav-desktop">
                    <Link
                        href="/catalogo"
                        className={`nav-link ${pathname === "/catalogo" ? "nav-link-ativo" : ""}`}
                    >
                        Catálogo
                    </Link>
                    <Link
                        href="/contato"
                        className={`nav-link ${pathname === "/contato" ? "nav-link-ativo" : ""}`}
                    >
                        Contato
                    </Link>
                    <Link
                        href="/sobre"
                        className={`nav-link ${pathname === "/sobre" ? "nav-link-ativo" : ""}`}
                    >
                        Sobre
                    </Link>

                    {/* Exibição condicional de acordo com autenticação */}
                    {usuario ? (
                        <div className="header-auth-area">
                            {usuario.tipo === "Admin" && (
                                <Link
                                    href="/dashboard"
                                    className={`nav-link-dashboard ${pathname === "/dashboard" ? "nav-link-dashboard-ativo" : ""}`}
                                >
                                    <span className="dot-admin-header" />
                                    Dashboard
                                </Link>
                            )}

                            <div className="usuario-badge-header">
                                <span className="nome-usuario-header">
                                    {usuario.nome.split(" ")[0]}
                                </span>
                                {usuario.tipo === "Admin" && (
                                    <span className="tag-admin-header">Admin</span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="btn-header-sair"
                                title="Sair da conta"
                            >
                                Sair
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className={`nav-link-login ${pathname === "/login" ? "nav-link-login-ativo" : ""}`}
                        >
                            Entrar
                        </Link>
                    )}
                </nav>

                {/* Botão hambúrguer (mobile) */}
                <button
                    className={menuAberto ? "botao-menu botao-menu-aberto" : "botao-menu"}
                    onClick={() => setMenuAberto(!menuAberto)}
                    aria-label="Abrir menu"
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            {/* Navegação mobile */}
            <nav className={menuAberto ? "nav-mobile nav-mobile-aberto" : "nav-mobile"}>
                <Link
                    href="/catalogo"
                    onClick={() => setMenuAberto(false)}
                    className="nav-link-mobile"
                >
                    Catálogo
                </Link>
                <Link
                    href="/contato"
                    onClick={() => setMenuAberto(false)}
                    className="nav-link-mobile"
                >
                    Contato
                </Link>
                <Link
                    href="/sobre"
                    onClick={() => setMenuAberto(false)}
                    className="nav-link-mobile"
                >
                    Sobre
                </Link>

                {usuario ? (
                    <>
                        {usuario.tipo === "Admin" && (
                            <Link
                                href="/dashboard"
                                onClick={() => setMenuAberto(false)}
                                className="nav-link-mobile nav-link-mobile-admin"
                            >
                                🛡️ Dashboard Administrativo
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="nav-link-mobile btn-mobile-sair"
                        >
                            Sair ({usuario.nome})
                        </button>
                    </>
                ) : (
                    <Link
                        href="/login"
                        onClick={() => setMenuAberto(false)}
                        className="nav-link-mobile nav-link-mobile-login"
                    >
                        Entrar na Conta
                    </Link>
                )}
            </nav>
        </header>
    )
}
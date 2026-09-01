"use client"

import { useState } from "react"
import Link from "next/link"
import "./header.css"

export default function Header() {
    const [menuAberto, setMenuAberto] = useState(false)

    return (
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="marca">
                    NaVia
                </Link>

                {/* Navegação desktop */}
                <nav className="nav-desktop">
                    <Link href="/catalogo" className="nav-link">Catálogo</Link>
                    <Link href="/contato" className="nav-link">Contato</Link>
                    <Link href="/sobre" className="nav-link">Sobre</Link>
                    <Link href="/login" className="nav-link">Login</Link>
                </nav>

                {/* Botão hambúrguer (mobile) */}
                <button
                    className={menuAberto ? "botao-menu botao-menu-aberto" : "botao-menu"}
                    onClick={() => setMenuAberto(!menuAberto)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            {/* Navegação mobile */}
            <nav className={menuAberto ? "nav-mobile nav-mobile-aberto" : "nav-mobile"}>
                <Link href="/catalogo" className="nav-link-mobile">Catálogo</Link>
                <Link href="/contato" className="nav-link-mobile">Contato</Link>
                <Link href="/sobre" className="nav-link-mobile">Sobre</Link>
            </nav>
        </header>
    )
}
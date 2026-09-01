"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Header from "../components/Header/header"
import "./dash.css"

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

interface UsuarioResumo {
    id: number
    nome: string
    email: string
    telefone: string
    tipo: string
}

interface DashboardStats {
    totalCarros: number
    carrosDisponiveis: number
    carrosIndisponiveis: number
    totalUsuarios: number
    precoMedioDiaria: number
    distribuicaoCategorias: { categoria: string; quantidade: number }[]
}

const CATEGORIAS_DISPONIVEIS = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Esportivo",
    "Luxo",
    "Picape",
    "Elétrico"
]

export default function Dashboard() {
    const router = useRouter()
    
    // Auth State
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioResumo | null>(null)
    const [autorizado, setAutorizado] = useState<boolean | null>(null)

    // Data State
    const [carros, setCarros] = useState<Carro[]>([])
    const [usuarios, setUsuarios] = useState<UsuarioResumo[]>([])
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [abaAtiva, setAbaAtiva] = useState<"frota" | "usuarios" | "metricas">("frota")

    // Filters
    const [busca, setBusca] = useState("")
    const [filtroCategoria, setFiltroCategoria] = useState("Todas")
    const [filtroStatus, setFiltroStatus] = useState("Todos")

    // Modals
    const [modalAberto, setModalAberto] = useState(false)
    const [carroEditando, setCarroEditando] = useState<Carro | null>(null)
    const [carroExcluindo, setCarroExcluindo] = useState<Carro | null>(null)
    const [salvando, setSalvando] = useState(false)
    const [mensagemFeedback, setMensagemFeedback] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        marca: "",
        modelo: "",
        ano: new Date().getFullYear(),
        cor: "",
        categoria: "Sedan",
        cambio: "Automático",
        disponivel: true,
        precoDiaria: 200,
        imgUrl: ""
    })

    // 1. Verificação de Autenticação e Papel de Admin
    useEffect(() => {
        const userJson = localStorage.getItem("navia_user")
        if (!userJson) {
            setAutorizado(false)
            setTimeout(() => router.push("/login"), 1500)
            return
        }

        try {
            const user = JSON.parse(userJson)
            if (user.tipo !== "Admin") {
                setAutorizado(false)
                setTimeout(() => router.push("/catalogo"), 1500)
                return
            }

            setUsuarioLogado(user)
            setAutorizado(true)
            carregarDadosCompletos()
        } catch (e) {
            setAutorizado(false)
            router.push("/login")
        }
    }, [router])

    // 2. Carregamento de dados do Backend
    async function carregarDadosCompletos() {
        setCarregando(true)
        try {
            const [respCarros, respUsuarios, respStats] = await Promise.all([
                fetch("http://localhost:5277/api/Carros"),
                fetch("http://localhost:5277/api/Usuarios"),
                fetch("http://localhost:5277/api/Usuarios/stats")
            ])

            if (respCarros.ok) {
                const dadosCarros = await respCarros.json()
                setCarros(dadosCarros)
            }

            if (respUsuarios.ok) {
                const dadosUsuarios = await respUsuarios.json()
                setUsuarios(dadosUsuarios)
            }

            if (respStats.ok) {
                const dadosStats = await respStats.json()
                setStats(dadosStats)
            }
        } catch (erro) {
            console.error("Erro ao carregar dados do dashboard:", erro)
            mostrarFeedback("erro", "Erro ao sincronizar dados com o servidor.")
        } finally {
            setCarregando(false)
        }
    }

    function mostrarFeedback(tipo: "sucesso" | "erro", texto: string) {
        setMensagemFeedback({ tipo, texto })
        setTimeout(() => setMensagemFeedback(null), 4000)
    }

    // 3. Alternar disponibilidade do veículo (1 clique)
    async function alternarDisponibilidade(carro: Carro) {
        const novoStatus = !carro.disponivel
        try {
            const resposta = await fetch(`http://localhost:5277/api/Carros/${carro.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...carro,
                    disponivel: novoStatus
                })
            })

            if (resposta.ok) {
                setCarros(prev =>
                    prev.map(c => (c.id === carro.id ? { ...c, disponivel: novoStatus } : c))
                )
                mostrarFeedback("sucesso", `Status do ${carro.modelo} atualizado para ${novoStatus ? "Disponível" : "Indisponível"}.`)
                
                // Atualiza stats
                if (stats) {
                    setStats({
                        ...stats,
                        carrosDisponiveis: novoStatus ? stats.carrosDisponiveis + 1 : stats.carrosDisponiveis - 1,
                        carrosIndisponiveis: novoStatus ? stats.carrosIndisponiveis - 1 : stats.carrosIndisponiveis + 1
                    })
                }
            } else {
                mostrarFeedback("erro", "Não foi possível atualizar o status.")
            }
        } catch (erro) {
            console.error("Erro ao alternar status:", erro)
            mostrarFeedback("erro", "Erro ao conectar com o servidor.")
        }
    }

    // 4. Modal de Criação / Edição
    function abrirModalCriacao() {
        setCarroEditando(null)
        setFormData({
            marca: "",
            modelo: "",
            ano: new Date().getFullYear(),
            cor: "",
            categoria: "Sedan",
            cambio: "Automático",
            disponivel: true,
            precoDiaria: 200,
            imgUrl: ""
        })
        setModalAberto(true)
    }

    function abrirModalEdicao(carro: Carro) {
        setCarroEditando(carro)
        setFormData({
            marca: carro.marca,
            modelo: carro.modelo,
            ano: carro.ano,
            cor: carro.cor,
            categoria: carro.categoria || "Sedan",
            cambio: carro.cambio || "Automático",
            disponivel: carro.disponivel,
            precoDiaria: carro.precoDiaria,
            imgUrl: carro.imgUrl || ""
        })
        setModalAberto(true)
    }

    async function salvarCarro(e: React.FormEvent) {
        e.preventDefault()
        setSalvando(true)

        try {
            if (carroEditando) {
                // Atualização (PUT)
                const resposta = await fetch(`http://localhost:5277/api/Carros/${carroEditando.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: carroEditando.id,
                        ...formData
                    })
                })

                if (resposta.ok) {
                    const carroAtualizado = await resposta.json()
                    setCarros(prev => prev.map(c => (c.id === carroEditando.id ? carroAtualizado : c)))
                    mostrarFeedback("sucesso", `Veículo ${carroAtualizado.modelo} atualizado com sucesso!`)
                    setModalAberto(false)
                } else {
                    mostrarFeedback("erro", "Erro ao salvar alterações no veículo.")
                }
            } else {
                // Criação (POST)
                const resposta = await fetch("http://localhost:5277/api/Carros", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                })

                if (resposta.ok) {
                    const novoCarro = await resposta.json()
                    setCarros(prev => [novoCarro, ...prev])
                    mostrarFeedback("sucesso", `Veículo ${novoCarro.modelo} adicionado à frota!`)
                    setModalAberto(false)
                    carregarDadosCompletos() // Recarrega stats
                } else {
                    mostrarFeedback("erro", "Erro ao cadastrar novo veículo.")
                }
            }
        } catch (erro) {
            console.error("Erro ao salvar veículo:", erro)
            mostrarFeedback("erro", "Erro de conexão ao salvar veículo.")
        } finally {
            setSalvando(false)
        }
    }

    // 5. Exclusão de veículo
    async function confirmarExclusao() {
        if (!carroExcluindo) return
        setSalvando(true)

        try {
            const resposta = await fetch(`http://localhost:5277/api/Carros/${carroExcluindo.id}`, {
                method: "DELETE"
            })

            if (resposta.ok) {
                setCarros(prev => prev.filter(c => c.id !== carroExcluindo.id))
                mostrarFeedback("sucesso", `Veículo removido com sucesso.`)
                setCarroExcluindo(null)
                carregarDadosCompletos()
            } else {
                mostrarFeedback("erro", "Erro ao excluir veículo.")
            }
        } catch (erro) {
            console.error("Erro ao excluir veículo:", erro)
            mostrarFeedback("erro", "Erro de conexão ao excluir veículo.")
        } finally {
            setSalvando(false)
        }
    }

    // 6. Logout
    function handleLogout() {
        localStorage.removeItem("navia_user")
        localStorage.removeItem("navia_token")
        window.dispatchEvent(new Event("navia_auth_change"))
        router.push("/login")
    }

    // 7. Filtros da Frota
    const carrosFiltrados = useMemo(() => {
        return carros.filter(carro => {
            const termo = busca.toLowerCase()
            const matchBusca = carro.marca.toLowerCase().includes(termo) ||
                carro.modelo.toLowerCase().includes(termo) ||
                carro.cor.toLowerCase().includes(termo)

            const matchCategoria = filtroCategoria === "Todas" || carro.categoria === filtroCategoria
            const matchStatus = filtroStatus === "Todos"
                ? true
                : filtroStatus === "Disponíveis"
                    ? carro.disponivel
                    : !carro.disponivel

            return matchBusca && matchCategoria && matchStatus
        })
    }, [carros, busca, filtroCategoria, filtroStatus])

    // Renderização de bloqueio caso não autorizado
    if (autorizado === false) {
        return (
            <div className="dash-container">
                <Header />
                <div className="dash-bloqueado">
                    <div className="bloqueado-card">
                        <div className="bloqueado-icone">🔒</div>
                        <h2>Acesso Restrito</h2>
                        <p>Esta página é exclusiva para administradores da NaVia.</p>
                        <p className="redirecionando-texto">Redirecionando para a página de acesso...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="dash-container">
            <Header />

            <main className="dash-corpo">
                {/* Cabeçalho do Dashboard */}
                <div className="dash-topbar">
                    <div className="dash-titulo-area">
                        <div className="badge-admin">
                            <span className="dot-admin" />
                            Painel do Administrador
                        </div>
                        <h1 className="dash-titulo">Dashboard de Controle</h1>
                        <p className="dash-subtitulo">
                            Gerencie a frota de veículos, clientes e métricas da plataforma em tempo real.
                        </p>
                    </div>

                    <div className="dash-acoes-topbar">
                        <button 
                            type="button" 
                            onClick={abrirModalCriacao} 
                            className="btn-novo-veiculo"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Novo Veículo
                        </button>

                        <button 
                            type="button" 
                            onClick={carregarDadosCompletos} 
                            className="btn-atualizar" 
                            title="Recarregar dados"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                            </svg>
                        </button>

                        <button 
                            type="button" 
                            onClick={handleLogout} 
                            className="btn-sair"
                        >
                            Sair
                        </button>
                    </div>
                </div>

                {/* Feedback Toast */}
                {mensagemFeedback && (
                    <div className={`toast-feedback toast-${mensagemFeedback.tipo}`}>
                        <span>{mensagemFeedback.texto}</span>
                    </div>
                )}

                {/* Cards de Métricas (KPIs) */}
                <section className="grid-kpis">
                    <div className="card-kpi">
                        <div className="kpi-icone-wrapper kpi-azul">
                            🚗
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-label">Frota Total</span>
                            <strong className="kpi-valor">
                                {stats ? stats.totalCarros : carros.length}
                            </strong>
                            <span className="kpi-subinfo">Veículos cadastrados</span>
                        </div>
                    </div>

                    <div className="card-kpi">
                        <div className="kpi-icone-wrapper kpi-verde">
                            🟢
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-label">Disponíveis</span>
                            <strong className="kpi-valor valor-destaque-verde">
                                {stats ? stats.carrosDisponiveis : carros.filter(c => c.disponivel).length}
                            </strong>
                            <span className="kpi-subinfo">
                                {carros.length > 0
                                    ? `${Math.round(((stats?.carrosDisponiveis || carros.filter(c => c.disponivel).length) / carros.length) * 100)}% da frota`
                                    : "0%"}
                            </span>
                        </div>
                    </div>

                    <div className="card-kpi">
                        <div className="kpi-icone-wrapper kpi-amarelo">
                            🔴
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-label">Em Locação / Indisp.</span>
                            <strong className="kpi-valor valor-destaque-amarelo">
                                {stats ? stats.carrosIndisponiveis : carros.filter(c => !c.disponivel).length}
                            </strong>
                            <span className="kpi-subinfo">Veículos alugados</span>
                        </div>
                    </div>

                    <div className="card-kpi">
                        <div className="kpi-icone-wrapper kpi-roxo">
                            👥
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-label">Usuários Cadastrados</span>
                            <strong className="kpi-valor">
                                {stats ? stats.totalUsuarios : usuarios.length}
                            </strong>
                            <span className="kpi-subinfo">Clientes e administradores</span>
                        </div>
                    </div>

                    <div className="card-kpi">
                        <div className="kpi-icone-wrapper kpi-ciano">
                            💵
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-label">Diária Média</span>
                            <strong className="kpi-valor">
                                R$ {stats ? stats.precoMedioDiaria.toFixed(2) : "0.00"}
                            </strong>
                            <span className="kpi-subinfo">Média de valor da diária</span>
                        </div>
                    </div>
                </section>

                {/* Abas de Navegação */}
                <div className="dash-abas">
                    <button
                        className={`aba-item ${abaAtiva === "frota" ? "aba-ativa" : ""}`}
                        onClick={() => setAbaAtiva("frota")}
                    >
                        🚘 Frota de Veículos ({carros.length})
                    </button>
                    <button
                        className={`aba-item ${abaAtiva === "usuarios" ? "aba-ativa" : ""}`}
                        onClick={() => setAbaAtiva("usuarios")}
                    >
                        👥 Usuários Cadastrados ({usuarios.length})
                    </button>
                    <button
                        className={`aba-item ${abaAtiva === "metricas" ? "aba-ativa" : ""}`}
                        onClick={() => setAbaAtiva("metricas")}
                    >
                        📊 Distribuição por Categoria
                    </button>
                </div>

                {/* CONTEÚDO DA ABA 1: FROTA DE VEÍCULOS */}
                {abaAtiva === "frota" && (
                    <div className="secao-frota">
                        {/* Filtros e Busca */}
                        <div className="barra-filtros">
                            <div className="campo-busca">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Buscar por marca, modelo ou cor..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="input-busca"
                                />
                            </div>

                            <div className="filtros-selects">
                                <select
                                    value={filtroCategoria}
                                    onChange={(e) => setFiltroCategoria(e.target.value)}
                                    className="select-filtro"
                                >
                                    <option value="Todas">Todas as Categorias</option>
                                    {CATEGORIAS_DISPONIVEIS.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                <select
                                    value={filtroStatus}
                                    onChange={(e) => setFiltroStatus(e.target.value)}
                                    className="select-filtro"
                                >
                                    <option value="Todos">Todos os Status</option>
                                    <option value="Disponíveis">Apenas Disponíveis</option>
                                    <option value="Indisponíveis">Apenas Indisponíveis</option>
                                </select>
                            </div>
                        </div>

                        {/* Listagem de Veículos */}
                        {carregando ? (
                            <div className="tabela-skeleton">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <div key={n} className="linha-skeleton" />
                                ))}
                            </div>
                        ) : carrosFiltrados.length === 0 ? (
                            <div className="estado-vazio">
                                <p>Nenhum veículo encontrado com os filtros selecionados.</p>
                            </div>
                        ) : (
                            <div className="tabela-container">
                                <table className="tabela-veiculos">
                                    <thead>
                                        <tr>
                                            <th>Veículo</th>
                                            <th>Categoria</th>
                                            <th>Ano / Cor</th>
                                            <th>Câmbio</th>
                                            <th>Diária</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {carrosFiltrados.map((carro) => (
                                            <tr key={carro.id} className="linha-veiculo">
                                                <td className="col-veiculo">
                                                    <div className="miniatura-veiculo">
                                                        {carro.imgUrl ? (
                                                            <img
                                                                src={carro.imgUrl}
                                                                alt={`${carro.marca} ${carro.modelo}`}
                                                                className="foto-miniatura"
                                                                onError={(e) => {
                                                                    // Fallback em caso de erro no link externo
                                                                    (e.target as HTMLImageElement).src = "/civic.png"
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="foto-placeholder">🚗</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <strong className="nome-carro">{carro.marca} {carro.modelo}</strong>
                                                        <span className="id-carro">ID: #{carro.id}</span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="tag-categoria">{carro.categoria || "Geral"}</span>
                                                </td>

                                                <td>
                                                    <span className="texto-secundario">{carro.ano} • {carro.cor}</span>
                                                </td>

                                                <td>
                                                    <span className="texto-secundario">{carro.cambio || "Automático"}</span>
                                                </td>

                                                <td>
                                                    <strong className="preco-tabela">R$ {carro.precoDiaria.toFixed(2)}</strong>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => alternarDisponibilidade(carro)}
                                                        className={`btn-toggle-status ${carro.disponivel ? "status-disponivel" : "status-indisponivel"}`}
                                                        title="Clique para alternar disponibilidade"
                                                    >
                                                        <span className="ponto-status" />
                                                        {carro.disponivel ? "Disponível" : "Indisponível"}
                                                    </button>
                                                </td>

                                                <td className="col-acoes">
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirModalEdicao(carro)}
                                                        className="btn-acao btn-editar"
                                                        title="Editar veículo"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                        </svg>
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setCarroExcluindo(carro)}
                                                        className="btn-acao btn-excluir"
                                                        title="Excluir veículo"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6"/>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                        </svg>
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* CONTEÚDO DA ABA 2: USUÁRIOS */}
                {abaAtiva === "usuarios" && (
                    <div className="secao-usuarios">
                        <div className="tabela-container">
                            <table className="tabela-veiculos">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>Telefone</th>
                                        <th>Papel / Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(u => (
                                        <tr key={u.id}>
                                            <td>#{u.id}</td>
                                            <td>
                                                <strong className="nome-usuario-tabela">{u.nome}</strong>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>{u.telefone || "Não informado"}</td>
                                            <td>
                                                <span className={`badge-usuario ${u.tipo === "Admin" ? "badge-tipo-admin" : "badge-tipo-cliente"}`}>
                                                    {u.tipo === "Admin" ? "🛡️ Administrador" : "👤 Cliente"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* CONTEÚDO DA ABA 3: DISTRIBUIÇÃO E MÉTRICAS */}
                {abaAtiva === "metricas" && (
                    <div className="secao-metricas">
                        <h2 className="subtitulo-secao">Distribuição da Frota por Categoria</h2>
                        <div className="grid-categorias-metricas">
                            {stats?.distribuicaoCategorias.map(cat => {
                                const porcentagem = stats.totalCarros > 0
                                    ? Math.round((cat.quantidade / stats.totalCarros) * 100)
                                    : 0
                                return (
                                    <div key={cat.categoria} className="card-categoria-metrica">
                                        <div className="cat-header">
                                            <strong>{cat.categoria}</strong>
                                            <span>{cat.quantidade} veículo(s)</span>
                                        </div>
                                        <div className="barra-progresso-bg">
                                            <div
                                                className="barra-progresso-fill"
                                                style={{ width: `${porcentagem}%` }}
                                            />
                                        </div>
                                        <span className="cat-porcentagem">{porcentagem}% da frota</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </main>

            {/* MODAL DE CRIAÇÃO / EDIÇÃO DE VEÍCULO */}
            {modalAberto && (
                <div className="modal-overlay" onClick={() => setModalAberto(false)}>
                    <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{carroEditando ? `Editar ${carroEditando.modelo}` : "Cadastrar Novo Veículo"}</h2>
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                className="btn-fechar-modal"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={salvarCarro} className="form-modal">
                            <div className="form-linha">
                                <div className="form-campo">
                                    <label>Marca *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.marca}
                                        onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                        placeholder="Ex: Honda, Toyota, BMW"
                                    />
                                </div>
                                <div className="form-campo">
                                    <label>Modelo *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.modelo}
                                        onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                                        placeholder="Ex: Civic Touring 1.5"
                                    />
                                </div>
                            </div>

                            <div className="form-linha">
                                <div className="form-campo">
                                    <label>Ano *</label>
                                    <input
                                        type="number"
                                        required
                                        min="1990"
                                        max="2030"
                                        value={formData.ano}
                                        onChange={(e) => setFormData({ ...formData, ano: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="form-campo">
                                    <label>Cor *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.cor}
                                        onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                                        placeholder="Ex: Preto Cristal"
                                    />
                                </div>
                            </div>

                            <div className="form-linha">
                                <div className="form-campo">
                                    <label>Categoria</label>
                                    <select
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                    >
                                        {CATEGORIAS_DISPONIVEIS.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-campo">
                                    <label>Câmbio</label>
                                    <select
                                        value={formData.cambio}
                                        onChange={(e) => setFormData({ ...formData, cambio: e.target.value })}
                                    >
                                        <option value="Automático">Automático</option>
                                        <option value="Manual">Manual</option>
                                        <option value="CVT">CVT</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-linha">
                                <div className="form-campo">
                                    <label>Preço da Diária (R$) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="10"
                                        required
                                        value={formData.precoDiaria}
                                        onChange={(e) => setFormData({ ...formData, precoDiaria: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="form-campo">
                                    <label>Disponibilidade Inicial</label>
                                    <select
                                        value={formData.disponivel ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, disponivel: e.target.value === "true" })}
                                    >
                                        <option value="true">Disponível para Locação</option>
                                        <option value="false">Indisponível / Em Manutenção</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-campo">
                                <label>URL da Imagem (ou arquivo local como /civic.png)</label>
                                <input
                                    type="text"
                                    value={formData.imgUrl}
                                    onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                                    placeholder="https://... ou /civic.png"
                                />
                            </div>

                            <div className="modal-botoes">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="btn-cancelar"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="btn-salvar"
                                >
                                    {salvando ? "Salvando..." : (carroEditando ? "Salvar Alterações" : "Cadastrar Veículo")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
            {carroExcluindo && (
                <div className="modal-overlay" onClick={() => setCarroExcluindo(null)}>
                    <div className="modal-conteudo modal-confirmacao" onClick={(e) => e.stopPropagation()}>
                        <div className="icone-aviso-exclusao">⚠️</div>
                        <h2>Confirmar Exclusão</h2>
                        <p>
                            Tem certeza que deseja excluir o veículo <strong>{carroExcluindo.marca} {carroExcluindo.modelo}</strong> da frota?
                        </p>
                        <p className="texto-alerta-exclusao">Esta ação não poderá ser desfeita.</p>

                        <div className="modal-botoes">
                            <button
                                type="button"
                                onClick={() => setCarroExcluindo(null)}
                                className="btn-cancelar"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarExclusao}
                                disabled={salvando}
                                className="btn-confirmar-exclusao"
                            >
                                {salvando ? "Excluindo..." : "Sim, Excluir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

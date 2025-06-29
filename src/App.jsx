import './App.css'
import AppRoutes from './routes/AppRoutes'
import Home from "./pages/Home.jsx"
import Perfil from './pages/Perfil.jsx'
import MeusEspacos from './pages/MeusEspacos.jsx'
import CadastroEvento from './pages/CadastroEvento.jsx'
import EventosProximos from './pages/EventosProximos.jsx'
import MeusEventos from './pages/MeusEventos.jsx'
import Pagamentos from './pages/Pagamentos.jsx'
import CadastroEspaco from './pages/CadastroEspaco.jsx'
import EventoDetalhes from './pages/EventoDetalhes';
import EspacoDetalhes from './pages/EspacoDetalhes';

import { Routes, Route} from "react-router-dom"
import './index.css'

function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/perfil" element={<Perfil />} />
    <Route path="/meus-espacos" element={<MeusEspacos />} />
    <Route path="/cadastro-evento" element={<CadastroEvento />} />
    <Route path="/eventos-proximos" element={<EventosProximos />} />
    <Route path="/meus-eventos" element={<MeusEventos />} />
    <Route path="/meus-espacos/novo" element={<CadastroEspaco />} />   
    <Route path="/evento/:id" element={<EventoDetalhes />} />
    <Route path="/espaco/:id" element={<EspacoDetalhes />} />
  </Routes>

}

export default App;

import './App.css'
import AppRoutes from './routes/AppRoutes'
import Home from "./pages/Home.jsx"
import Cadastro from './pages/CadastroForm.jsx'
import Login from './pages/Login.jsx'
import Perfil from './pages/Perfil.jsx'
import MeusEspacos from './pages/MeusEspacos.jsx'
import CadastroEvento from './pages/CadastroEvento.jsx'
import EventosProximos from './pages/EventosProximos.jsx'
import MeusEventos from './pages/MeusEventos.jsx'
import Pagamentos from './pages/Pagamentos.jsx'
import Ajuda from './pages/Ajuda.jsx'
import { Routes, Route} from "react-router-dom"
import './index.css'

function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/login" element={<Login />} />
    <Route path="/perfil" element={<Perfil />} />
    <Route path="/meus-espacos" element={<MeusEspacos />} />
    <Route path="/cadastro-evento" element={<CadastroEvento />} />
    <Route path="/eventos-proximos" element={<EventosProximos />} />
    <Route path="/meus-eventos" element={<MeusEventos />} />
    <Route path="/pagamentos" element={<Pagamentos />} />
    <Route path="/ajuda" element={<Ajuda />} />
  </Routes>

}

export default App;

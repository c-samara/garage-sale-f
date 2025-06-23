import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx"
import EventoDetalhes from "../pages/EventoDetalhes.jsx"

export default function AppRoutes () {
    return (
        <BrowserRouter>
        <Routes>
        
        <Route path="/" element={<Home/>} />
        <Route path="/evento/:id" element={<EventoDetalhes/>} />
        
        
        </Routes>
        </BrowserRouter>
    );
}
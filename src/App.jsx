import './App.css'
import AppRoutes from './routes/AppRoutes'
import Home from "./pages/Home.jsx"
import { Routes, Route} from "react-router-dom"
import './index.css'

function App() {
  return <Routes>

    <Route path="/" element={<Home />} />

  </Routes>

}

export default App;

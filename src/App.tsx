
import './App.css'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import { Header } from './components/common/Header/Header'
import Cart from './pages/Cart'

function App() {
  return (
    <Router basename="/HeavenlyKing">
      <div className="App">
        <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      </div>
    </Router>
  )
}


export default App
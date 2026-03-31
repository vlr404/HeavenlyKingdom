import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import { Header } from './components/common/Header/Header'

function App() {
  return (
    <Router basename="/HeavenlyKing">
      <div className="App">
        <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
      </div>
    </Router>
  )
}

export default App
import './App.css'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import { Header } from './components/common/Header/Header'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import Account from './pages/Account'
import AdminPage from './pages/Admin/AdminPage'
import { SearchProvider } from './context/SearchContext'

function App() {
  return (
    <Router basename="/HeavenlyKing">
      <SearchProvider>
        <div className="App">
          <Header />
          <div style={{ paddingTop: 'var(--header-height)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />

            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          </div>
        </div>
      </SearchProvider>
    </Router>
  )
}

export default App

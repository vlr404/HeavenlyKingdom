import './App.css'
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import { Header } from './components/common/Header/Header'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import Account from './pages/Account'
import AdminPage from './pages/Admin/AdminPage'
import OnlineCandlePage from './pages/OnlineCandlePage'
import IndulgencePage from './pages/IndulgencePage'
import PriestCabinet from './pages/PriestCabinet'
import ServicesPage from './pages/ServicesPage'
import { SearchProvider } from './context/SearchContext'
import { MediaProvider } from './context/MediaContext'
import { useAuthStore } from './entity/auth/authStore'

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user?.isAdmin) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const PriestGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || user?.role !== 'PRIEST') return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router basename="/HeavenlyKing/">
      <MediaProvider>
      <SearchProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/shop"           element={<Shop />} />
            <Route path="/cart"           element={<Cart />} />
            <Route path="/auth"           element={<Auth />} />
            <Route path="/account"        element={<Account />} />
            <Route path="/admin"          element={<AdminGuard><AdminPage /></AdminGuard>} />
            <Route path="/priest-cabinet" element={<PriestGuard><PriestCabinet /></PriestGuard>} />
            <Route path="/candles"        element={<OnlineCandlePage />} />
            <Route path="/indulgences"    element={<IndulgencePage />} />
            <Route path="/services"       element={<ServicesPage />} />
          </Routes>
        </div>
      </SearchProvider>
      </MediaProvider>
    </Router>
  )
}

export default App

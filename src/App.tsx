import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CustomerPortal from './pages/CustomerPortal';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationDetail from './pages/ApplicationDetail';

function Header() {
  const location = useLocation();
  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-logo">
          <span className="aws-badge">AWS</span>
          <h1>IW Migrate Credits</h1>
        </div>
        <nav className="header-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/apply" className={location.pathname.startsWith('/apply') ? 'active' : ''}>Apply for Credits</Link>
          <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''}>Admin Portal</Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/iw-migrate-credits">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<CustomerPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/application/:id" element={<ApplicationDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

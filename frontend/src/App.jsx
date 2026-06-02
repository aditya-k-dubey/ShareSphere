import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Dashboard from './pages/Dashboard';
import NgoDashboard from './pages/NgoDashboard';
import { RoleProvider } from './context/RoleContext';

/**
 * App
 * Root component for ShareSphere with internal routing.
 */
export default function App() {
  return (
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ngo-dashboard" element={<NgoDashboard />} />
        </Routes>
      </Router>
    </RoleProvider>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<div>Courses Page (coming soon)</div>} />
          <Route path="/users" element={<div>Users Page (coming soon)</div>} />
          <Route path="/settings" element={<div>Settings Page (coming soon)</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
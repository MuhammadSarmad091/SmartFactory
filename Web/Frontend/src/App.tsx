import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import Rooms from './pages/Rooms';
import Analytics from './pages/Analytics';
import UnityModel from './pages/UnityModel';
import Alerts from './pages/Alerts';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/machines" element={<Machines />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/unity-model" element={<UnityModel />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { PublicRoute } from './components/auth/PublicRoute'

// Auth Pages
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'

// Main App Pages
import DashboardLayout from './components/layout/DashboardLayout'
import MyCardsScreen from './screens/MyCardsScreen'
import ContactsScreen from './screens/ContactsScreen'
import SettingsScreen from './screens/SettingsScreen'
import AddBusinessCardScreen from './screens/AddBusinessCardScreen'
import EditBusinessCardScreen from './screens/EditBusinessCardScreen'
import BusinessCardScreen from './screens/BusinessCardScreen'
import QRScannerScreen from './screens/QRScannerScreen'
import ArchivedCardsScreen from './screens/ArchivedCardsScreen'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterScreen />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPasswordScreen />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<MyCardsScreen />} />
            <Route path="contacts" element={<ContactsScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
            <Route path="add-card" element={<AddBusinessCardScreen />} />
            <Route path="edit-card/:id" element={<EditBusinessCardScreen />} />
            <Route path="card/:id" element={<BusinessCardScreen />} />
            <Route path="scanner" element={<QRScannerScreen />} />
            <Route path="archived" element={<ArchivedCardsScreen />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App
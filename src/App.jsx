import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotifProvider } from './context/NotifContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { ToastContainer } from './components/shared/ToastContainer'
import { CircularLoader } from './components/shared/CircularLoader'

// Pages
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { DownloadPage } from './pages/DownloadPage'
import { KeysPage } from './pages/KeysPage'
import { NotFoundPage } from './pages/NotFoundPage'

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
      <CircularLoader size={48} />
    </div>
  )
}

export default function App() {
  return (
    <NotifProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/app" replace />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/download"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DownloadPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/keys"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <KeysPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </NotifProvider>
  )
}

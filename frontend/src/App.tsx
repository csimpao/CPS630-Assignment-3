import { useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import ApiContextProvider from './providers/api';
import { AuthProvider, useAuth } from './providers/auth';
import { createApi } from './providers/api/rest';
import { useSocketApi } from './providers/api/useSocketApi';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import BalancePage from './components/BalancePage';
import DashboardPage from './components/DashboardPage';
import AuctionRoomView from './components/AuctionRoomView';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@auction-platform/shared/domain';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function AuthenticatedApp() {
  const { token } = useAuth();

  const ioRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(
    io(BACKEND_URL, { auth: { token } }),
  );

  const restApi = createApi(BACKEND_URL);
  const socketApi = useSocketApi(ioRef.current);

  return (
    <ApiContextProvider restApi={restApi} socketApi={socketApi}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/auction/:auctionId" element={<AuctionRoomView />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ApiContextProvider>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <SignupPage />}
      />
      <Route
        path="*"
        element={user ? <AuthenticatedApp /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

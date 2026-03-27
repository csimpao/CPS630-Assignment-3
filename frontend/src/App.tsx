import { useRef } from 'react';
import ApiContextProvider from './providers/api';
import { createApi } from './providers/api/rest';
import { useSocketApi } from './providers/api/useSocketApi';
import { io, Socket } from 'socket.io-client';
import TestPage from './components/TestPage';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../shared/dist/socket';

const BACKEND_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';
console.log(BACKEND_URL);
function App() {
  const ioRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(
    io(BACKEND_URL),
  );

  const restApi = createApi(BACKEND_URL);
  const socketApi = useSocketApi(ioRef.current);

  return (
    <ApiContextProvider restApi={restApi} socketApi={socketApi}>
      <h1>hello world!</h1>
      <TestPage />
    </ApiContextProvider>
  );
}

export default App;

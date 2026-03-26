// client-to-server
// bidOnAuction(Partial<Auction>, Partial<Bid>) => Bid
// joinAuction(Partial<Auction>) => Ack
// leaveAuction(Partial<Auction>) => Ack

// server-to-client
// endAuction(Auction & Bid[]) => Ack
// receiveBidOnAuction(Bid) => Ack
import { io } from 'socket.io-client';

// use window url when in production
const WEBSOCKET_BASE_URL = import.meta.env.PROD
  ? undefined
  : 'http://localhost:3000';

const socket = io(WEBSOCKET_BASE_URL);

socket.on('connect', () => {});

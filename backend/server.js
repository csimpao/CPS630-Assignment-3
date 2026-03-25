import express from 'express';
import mongoose from 'mongoose';
import api from './api/index.js';
import seedDatabase from './seed.js';
import 'dotenv/config';
import cors from 'cors';

const PORT = 8080;


function main() {

  mongoose.connect(process.env.MONGODB_URI);

  const db = mongoose.connection;
  db.on('error', function(e) {
      console.log('error connecting:' + e);
  });
  db.on('open', function() {
      console.log('database connected!');
      seedDatabase();
  });

  const app = express();

  app.use(cors({
    origin: "http://localhost:5173",
  }));

  app.use(express.json());
  app.use('/api', api());

  app.use((req, res) => {
    res.status(404).json({ message: 'Page not found' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`server listening on port: ${PORT}`);
  });
}

main();
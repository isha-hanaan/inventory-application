import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import itemRoutes from './routes/items';

const app = express();
const PORT = 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/plywoodInventory';

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/items', itemRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Plywood Inventory API is running' });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to MongoDB', error);
    process.exit(1);
  });

import { Router } from 'express';
import Item from '../models/Item';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch items', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, length, width, thickness, type, price, quantity } = req.body;
    const item = new Item({ name, length, width, thickness, type, price, quantity });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Unable to create item', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: 'Unable to update item', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete item', error });
  }
});

export default router;

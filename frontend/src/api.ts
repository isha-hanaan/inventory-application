import axios from 'axios';
import { Item, ItemForm } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
});

export const getItems = async (): Promise<Item[]> => {
  const response = await api.get<Item[]>('/items');
  return response.data;
};

export const createItem = async (data: ItemForm): Promise<Item> => {
  const response = await api.post<Item>('/items', data);
  return response.data;
};

export const updateItem = async (id: string, data: ItemForm): Promise<Item> => {
  const response = await api.put<Item>(`/items/${id}`, data);
  return response.data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/items/${id}`);
};

// frontend/src/lib/api.ts

import axios from 'axios';
import { Email, Product } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchEmails(): Promise<Email[]> {
  const { data } = await axios.get<Email[]>(`${API_BASE}/emails`);
  return data;
}

// Add this function:
export async function uploadCatalog(form: FormData): Promise<void> {
  await axios.post(`${API_BASE}/catalog/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// If you also need fetchCatalog (optional):
export async function fetchCatalog(): Promise<Product[]> {
  const { data } = await axios.get<Product[]>(`${API_BASE}/catalog`);
  return data;
}

import axios, { AxiosInstance } from 'axios';
import { Floor, FloorMap, Car, Ticket, Payment, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const parkingAPI = {
  // Floors
  getFloors: async (): Promise<Floor[]> => {
    const response = await api.get<ApiResponse<Floor[]>>('/floors');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch floors');
  },

  getFloorMap: async (floorId: string): Promise<FloorMap> => {
    const response = await api.get<ApiResponse<FloorMap>>(`/floors/${floorId}/map`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch floor map');
  },

  // Cars
  checkInCar: async (licensePlate: string): Promise<Car> => {
    const response = await api.post<ApiResponse<Car>>('/cars/check-in', { licensePlate });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to check in car');
  },

  checkOutCar: async (ticketId: string): Promise<any> => {
    const response = await api.post<ApiResponse<any>>('/cars/check-out', { ticketId });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to check out car');
  },

  // Tickets
  generateTicket: async (carId: string, floorId?: string, slotId?: string): Promise<Ticket> => {
    const response = await api.post<ApiResponse<Ticket>>('/tickets', { carId, floorId, slotId });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to generate ticket');
  },

  getTicket: async (ticketId: string): Promise<Ticket> => {
    const response = await api.get<ApiResponse<Ticket>>(`/tickets/${ticketId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Ticket not found');
  },

  getPositionByTicket: async (ticketId: string): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(`/tickets/${ticketId}/position`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get car position');
  },

  // Payments
  processPayment: async (ticketId: string, amount: number, method: 'QR' | 'POS'): Promise<Payment> => {
    const response = await api.post<ApiResponse<Payment>>('/payments', { ticketId, amount, method });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to process payment');
  },

  // Health check
  health: async (): Promise<boolean> => {
    try {
      const response = await api.get('/health');
      return response.data.status === 'OK';
    } catch {
      return false;
    }
  }
};

export default parkingAPI;

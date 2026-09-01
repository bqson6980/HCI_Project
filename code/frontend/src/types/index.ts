export interface Floor {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  available: number;
  status: 'AVAILABLE' | 'NEARLY_FULL' | 'FULL';
  occupancyPercent: number;
}

export interface Slot {
  id: string;
  status: 'EMPTY' | 'OCCUPIED' | 'RESERVED';
  carId: string | null;
}

export interface Section {
  id: string;
  name: string;
  slots: Slot[];
  available: number;
  total: number;
}

export interface FloorMap {
  id: string;
  name: string;
  sections: Section[];
}

export interface Car {
  id: string;
  licensePlate: string;
  entryTime: Date;
  exitTime?: Date;
  floor?: string;
  slot?: string;
}

export interface Ticket {
  id: string;
  carId: string;
  entryTime: Date;
  exitTime?: Date;
  floor?: string;
  slot?: string;
  fee: number;
  paymentStatus: 'UNPAID' | 'PAID';
  paymentMethod?: 'QR' | 'POS';
}

export interface Payment {
  id: string;
  ticketId: string;
  amount: number;
  method: 'QR' | 'POS' | 'CASH';
  timestamp: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

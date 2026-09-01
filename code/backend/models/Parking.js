const { v4: uuidv4 } = require('uuid');
const mockData = require('./mock-data');

class Parking {
  constructor() {
    // Initialize with mock data
    this.floors = new Map();
    this.cars = new Map();
    this.tickets = new Map();
    this.payments = new Map();

    // Load mock data
    this.loadMockData();
  }

  loadMockData() {
    // Initialize 6 floors (B1-B6)
    mockData.floors.forEach(floorData => {
      this.floors.set(floorData.id, { ...floorData });
    });

    // Initialize mock cars
    mockData.cars.forEach(carData => {
      this.cars.set(carData.id, { ...carData });
    });

    // Initialize mock tickets
    mockData.tickets.forEach(ticketData => {
      this.tickets.set(ticketData.id, { ...ticketData });
    });
  }

  /**
   * Get information about all floors
   */
  getFloorsInfo() {
    const floorsArray = Array.from(this.floors.values());
    return floorsArray.map(floor => ({
      id: floor.id,
      name: floor.name,
      capacity: floor.capacity,
      occupied: floor.occupied,
      available: floor.capacity - floor.occupied,
      status: this.getFloorStatus(floor),
      occupancyPercent: Math.round((floor.occupied / floor.capacity) * 100)
    }));
  }

  /**
   * Get status of a floor based on occupancy
   */
  getFloorStatus(floor) {
    const occupancyPercent = (floor.occupied / floor.capacity) * 100;
    if (occupancyPercent >= 90) return 'FULL';
    if (occupancyPercent >= 70) return 'NEARLY_FULL';
    return 'AVAILABLE';
  }

  /**
   * Get detailed floor map with sections and slots
   */
  getFloorMap(floorId) {
    const floor = this.floors.get(floorId);
    if (!floor) return null;

    return {
      id: floor.id,
      name: floor.name,
      sections: floor.sections.map(section => ({
        id: section.id,
        name: section.name,
        slots: section.slots.map(slot => ({
          id: slot.id,
          status: slot.status,
          carId: slot.carId || null
        })),
        available: section.slots.filter(s => s.status === 'EMPTY').length,
        total: section.slots.length
      }))
    };
  }

  /**
   * Check in a car
   */
  checkInCar(licensePlate) {
    const carId = `CAR-${uuidv4().substring(0, 8).toUpperCase()}`;
    const car = {
      id: carId,
      licensePlate,
      entryTime: new Date(),
      exitTime: null,
      floor: null,
      slot: null
    };

    this.cars.set(carId, car);
    return {
      carId,
      licensePlate,
      entryTime: car.entryTime
    };
  }

  /**
   * Generate a parking ticket
   */
  generateTicket(carId, floorId = 'B1', slotId = null) {
    const car = this.cars.get(carId);
    if (!car) throw new Error('Car not found');

    const ticketId = `#P-${Math.random().toString().substring(2, 6)}`;
    
    // Calculate initial fee (based on time)
    const fee = this.calculateFee(new Date(), null);

    const ticket = {
      id: ticketId,
      carId,
      entryTime: new Date(),
      exitTime: null,
      floor: floorId,
      slot: slotId || 'A1', // Default slot if not specified
      fee,
      paymentStatus: 'UNPAID',
      paymentMethod: null
    };

    this.tickets.set(ticketId, ticket);

    // Update car reference
    car.floor = floorId;
    car.slot = slotId || 'A1';

    // Update floor occupancy
    const floor = this.floors.get(floorId);
    if (floor) {
      floor.occupied += 1;
    }

    return ticket;
  }

  /**
   * Get ticket information
   */
  getTicket(ticketId) {
    return this.tickets.get(ticketId) || null;
  }

  /**
   * Get car position based on ticket ID
   * Returns a position that is consistent for the same ticket ID
   */
  getCarPosition(ticketId) {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) {
      // If ticket not found, generate a position based on ticket ID for demo
      const hash = ticketId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const zones = ['A', 'B', 'C', 'D'];
      const zone = zones[hash % 4];
      const cluster = (hash % 6) + 1;
      const slot = (hash % 20) + 1;
      
      return {
        floor: 'B2',
        zone: zone,
        cluster: `${zone}${cluster}`,
        slot: `${zone}${cluster}.${slot}`,
        licensePlate: 'N/A',
        entryTime: new Date().toLocaleTimeString('vi-VN')
      };
    }

    // If ticket found, return its position
    const hash = ticketId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const zones = ['A', 'B', 'C', 'D'];
    const zone = zones[hash % 4];
    const cluster = (hash % 6) + 1;
    const slot = (hash % 20) + 1;

    return {
      floor: ticket.floor || 'B2',
      zone: zone,
      cluster: `${zone}${cluster}`,
      slot: `${zone}${cluster}.${slot}`,
      licensePlate: this.cars.get(ticket.carId)?.licensePlate || 'N/A',
      entryTime: new Date(ticket.entryTime).toLocaleTimeString('vi-VN')
    };
  }

  /**
   * Check out a car
   */
  checkOutCar(ticketId) {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const exitTime = new Date();
    ticket.exitTime = exitTime;

    // Calculate final fee
    const totalFee = this.calculateFee(ticket.entryTime, exitTime);
    ticket.fee = totalFee;

    const car = this.cars.get(ticket.carId);
    if (car) {
      car.exitTime = exitTime;
    }

    // Update floor occupancy
    const floor = this.floors.get(ticket.floor);
    if (floor && floor.occupied > 0) {
      floor.occupied -= 1;
    }

    return {
      carId: ticket.carId,
      ticketId,
      exitTime,
      totalFee,
      floor: ticket.floor,
      slot: ticket.slot
    };
  }

  /**
   * Calculate parking fee based on duration
   * Rate: 5,000 VND for 0-4 hours, 10,000 for 4-12 hours, 15,000 for overnight
   */
  calculateFee(entryTime, exitTime) {
    if (!exitTime) {
      // Default fee for new ticket
      return 5000;
    }

    const durationMs = exitTime - entryTime;
    const durationHours = durationMs / (1000 * 60 * 60);

    if (durationHours <= 4) return 5000;
    if (durationHours <= 12) return 10000;
    return 15000; // Overnight or longer
  }

  /**
   * Process payment
   */
  processPayment(ticketId, amount, method) {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    if (amount < ticket.fee) {
      throw new Error(`Amount ${amount} is less than required fee ${ticket.fee}`);
    }

    const paymentId = `PAY-${uuidv4().substring(0, 8).toUpperCase()}`;
    const payment = {
      id: paymentId,
      ticketId,
      amount,
      method, // 'QR' or 'POS'
      timestamp: new Date(),
      status: 'COMPLETED'
    };

    this.payments.set(paymentId, payment);

    // Update ticket payment status
    ticket.paymentStatus = 'PAID';
    ticket.paymentMethod = method;

    const change = amount - ticket.fee;

    return {
      paymentId,
      ticketId,
      amount,
      fee: ticket.fee,
      change,
      method,
      status: 'COMPLETED',
      timestamp: payment.timestamp
    };
  }
}

module.exports = Parking;

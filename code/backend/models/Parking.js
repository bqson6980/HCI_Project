const { v4: uuidv4 } = require('uuid');
const mockData = require('./mock-data');

class Parking {
  constructor() {
    // Initialize with mock data
    this.floors = new Map();
    this.cars = new Map();
    this.tickets = new Map();
    this.payments = new Map();
    this.parkingReservations = new Map();
    this.parkingLayout = this.createParkingLayout();

    // Load mock data
    this.loadMockData();
  }

  loadMockData() {
    // Initialize 6 floors (B1-B6)
    mockData.floors.forEach(floorData => {
      this.floors.set(floorData.id, JSON.parse(JSON.stringify(floorData)));
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

  /** Layout used by the B2 parking-position screen: 4 zones × 6 clusters × 20 slots. */
  createParkingLayout() {
    const fullClusters = new Set(['A2', 'B5', 'C3', 'D6']);
    return ['A', 'B', 'C', 'D'].map(zoneId => ({
      id: zoneId,
      clusters: Array.from({ length: 6 }, (_, index) => {
        const id = `${zoneId}${index + 1}`;
        const occupiedSlots = fullClusters.has(id)
          ? Array.from({ length: 20 }, (_, slot) => slot + 1)
          : [1, 3, 6, 9, 12];
        return { id, occupiedSlots, disabled: fullClusters.has(id) };
      })
    }));
  }

  getParkingLayout() {
    return this.parkingLayout.map(zone => ({
      ...zone,
      clusters: zone.clusters.map(cluster => ({
        ...cluster,
        occupiedSlots: [...cluster.occupiedSlots]
      }))
    }));
  }

  reserveParkingSlot({ zoneId, clusterId, slotNumber, ticketId, floorId = 'B2' }) {
    const normalizedTicketId = typeof ticketId === 'string' ? ticketId.trim().toUpperCase() : '';
    if (!normalizedTicketId) {
      throw new Error('Parking ticket ID is required');
    }

    const zone = this.parkingLayout.find(item => item.id === zoneId);
    const cluster = zone?.clusters.find(item => item.id === clusterId);

    if (!zone || !cluster || !Number.isInteger(slotNumber) || slotNumber < 1 || slotNumber > 20) {
      throw new Error('Invalid parking zone, cluster, or slot');
    }
    if (cluster.disabled || cluster.occupiedSlots.length >= 20) {
      throw new Error('Parking cluster is full');
    }
    if (cluster.occupiedSlots.includes(slotNumber)) {
      throw new Error('Parking slot is already occupied');
    }

    cluster.occupiedSlots.push(slotNumber);
    const parkingSlot = `${clusterId}.${slotNumber}`;
    
    // Update floor occupancy
    const floor = this.floors.get(floorId);
    if (floor && floor.occupied < floor.capacity) {
      floor.occupied += 1;
    }

    this.parkingReservations.set(normalizedTicketId, {
      floorId,
      zoneId,
      clusterId,
      slotNumber,
      parkingSlot
    });

    const ticket = this.tickets.get(normalizedTicketId);
    if (ticket) {
      ticket.floor = floorId;
      ticket.slot = parkingSlot;
      const car = this.cars.get(ticket.carId);
      if (car) {
        car.floor = floorId;
        car.slot = parkingSlot;
      }
    }

    return { parkingSlot, floorId, layout: this.getParkingLayout() };
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
      available: Math.max(0, floor.capacity - floor.occupied),
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
      sections: floor.sections ? floor.sections.map(section => ({
        id: section.id,
        name: section.name,
        slots: section.slots.map(slot => ({
          id: slot.id,
          status: slot.status,
          carId: slot.carId || null
        })),
        available: section.slots.filter(s => s.status === 'EMPTY').length,
        total: section.slots.length
      })) : []
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

    const ticketId = `#P-${Math.floor(1000 + Math.random() * 9000)}`;
    const fee = this.calculateFee(new Date(), null);

    const ticket = {
      id: ticketId,
      carId,
      entryTime: new Date(),
      exitTime: null,
      floor: floorId,
      slot: slotId || 'A1',
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
    if (floor && floor.occupied < floor.capacity) {
      floor.occupied += 1;
    }

    return ticket;
  }

  /**
   * Get ticket information
   */
  getTicket(ticketId) {
    const normalizedTicketId = typeof ticketId === 'string' ? ticketId.trim().toUpperCase() : '';
    return this.tickets.get(normalizedTicketId) || null;
  }

  /**
   * Get car position based on ticket ID
   */
  getCarPosition(ticketId) {
    const normalizedTicketId = typeof ticketId === 'string' ? ticketId.trim().toUpperCase() : '';
    const reservation = this.parkingReservations.get(normalizedTicketId);
    const ticket = this.tickets.get(normalizedTicketId);

    if (reservation) {
      const { floorId, clusterId, parkingSlot } = reservation;
      return {
        floor: floorId || 'B2',
        zone: clusterId.charAt(0),
        cluster: clusterId,
        slot: parkingSlot,
        licensePlate: ticket ? this.cars.get(ticket.carId)?.licensePlate || 'N/A' : 'N/A',
        entryTime: ticket ? new Date(ticket.entryTime).toLocaleTimeString('vi-VN') : 'N/A'
      };
    }

    if (!ticket) {
      const hash = normalizedTicketId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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

    const savedTicketSlot = typeof ticket.slot === 'string' ? ticket.slot.match(/^([A-D]\d)\.(\d{1,2})$/) : null;
    if (savedTicketSlot) {
      const cluster = savedTicketSlot[1];
      return {
        floor: ticket.floor || 'B2',
        zone: cluster.charAt(0),
        cluster,
        slot: ticket.slot,
        licensePlate: this.cars.get(ticket.carId)?.licensePlate || 'N/A',
        entryTime: new Date(ticket.entryTime).toLocaleTimeString('vi-VN')
      };
    }

    const hash = normalizedTicketId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
    const normalizedTicketId = typeof ticketId === 'string' ? ticketId.trim().toUpperCase() : '';
    const ticket = this.tickets.get(normalizedTicketId);
    if (!ticket) throw new Error('Ticket not found');

    const exitTime = new Date();
    ticket.exitTime = exitTime;

    const totalFee = this.calculateFee(ticket.entryTime, exitTime);
    ticket.fee = totalFee;

    const car = this.cars.get(ticket.carId);
    if (car) {
      car.exitTime = exitTime;
    }

    // Release slot and update floor occupancy
    this.releaseTicketSlot(normalizedTicketId, ticket.floor);

    return {
      carId: ticket.carId,
      ticketId: normalizedTicketId,
      exitTime,
      totalFee,
      floor: ticket.floor,
      slot: ticket.slot
    };
  }

  /**
   * Helper to release a reserved slot and decrement floor occupancy
   */
  releaseTicketSlot(normalizedTicketId, floorId) {
    const reservation = this.parkingReservations.get(normalizedTicketId);
    if (reservation) {
      const { zoneId, clusterId, slotNumber } = reservation;
      const zone = this.parkingLayout.find(item => item.id === zoneId);
      const cluster = zone?.clusters.find(item => item.id === clusterId);
      if (cluster) {
        cluster.occupiedSlots = cluster.occupiedSlots.filter(s => s !== slotNumber);
      }
      this.parkingReservations.delete(normalizedTicketId);
    }

    const targetFloorId = floorId || reservation?.floorId || 'B2';
    const floor = this.floors.get(targetFloorId);
    if (floor && floor.occupied > 0) {
      floor.occupied -= 1;
    }
  }

  /**
   * Calculate parking fee based on duration
   */
  calculateFee(entryTime, exitTime) {
    if (!exitTime) {
      return 4000;
    }
    const durationMs = exitTime - entryTime;
    const durationHours = durationMs / (1000 * 60 * 60);

    if (durationHours <= 4) return 4000;
    if (durationHours <= 12) return 8000;
    return 15000;
  }

  /**
   * Process payment
   */
  processPayment(ticketId, amount, method) {
    const normalizedTicketId = typeof ticketId === 'string' ? ticketId.trim().toUpperCase() : '';
    const ticket = this.tickets.get(normalizedTicketId);
    if (!ticket) throw new Error('Ticket not found');

    const paymentId = `PAY-${uuidv4().substring(0, 8).toUpperCase()}`;
    const payment = {
      id: paymentId,
      ticketId: normalizedTicketId,
      amount,
      method,
      timestamp: new Date(),
      status: 'COMPLETED'
    };

    this.payments.set(paymentId, payment);

    ticket.paymentStatus = 'PAID';
    ticket.paymentMethod = method;
    ticket.exitTime = new Date();

    // Release slot and decrease floor occupancy
    this.releaseTicketSlot(normalizedTicketId, ticket.floor);

    return {
      paymentId,
      ticketId: normalizedTicketId,
      amount,
      fee: ticket.fee,
      method,
      status: 'COMPLETED',
      timestamp: payment.timestamp,
      releasedFloor: ticket.floor,
      releasedSlot: ticket.slot
    };
  }
}

module.exports = Parking;

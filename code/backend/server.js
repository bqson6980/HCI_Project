const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const Parking = require('./models/Parking');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Parking System
const parkingSystem = new Parking();

// ============================================
// FLOOR ROUTES
// ============================================
app.get('/api/parking-layout', (req, res) => {
  try {
    res.json({ success: true, data: parkingSystem.getParkingLayout() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/parking-layout/reserve', (req, res) => {
  try {
    const { zoneId, clusterId, slotNumber, ticketId } = req.body;
    const result = parkingSystem.reserveParkingSlot({
      zoneId,
      clusterId,
      slotNumber: Number(slotNumber),
      ticketId,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/floors', (req, res) => {
  try {
    const floors = parkingSystem.getFloorsInfo();
    res.json({
      success: true,
      data: floors
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// CAR CHECK-IN ROUTES
// ============================================
app.post('/api/cars/check-in', (req, res) => {
  try {
    const { licensePlate } = req.body;
    if (!licensePlate) {
      return res.status(400).json({ success: false, error: 'License plate is required' });
    }

    const result = parkingSystem.checkInCar(licensePlate);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// TICKET ROUTES
// ============================================
app.post('/api/tickets', (req, res) => {
  try {
    const { carId, floorId, slotId } = req.body;
    if (!carId) {
      return res.status(400).json({ success: false, error: 'Car ID is required' });
    }

    const ticket = parkingSystem.generateTicket(carId, floorId, slotId);
    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tickets/:ticketId', (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = parkingSystem.getTicket(ticketId);
    
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tickets/:ticketId/position', (req, res) => {
  try {
    const { ticketId } = req.params;
    const position = parkingSystem.getCarPosition(ticketId);
    
    res.json({
      success: true,
      data: position
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// CAR CHECK-OUT ROUTES
// ============================================
app.post('/api/cars/check-out', (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ success: false, error: 'Ticket ID is required' });
    }

    const result = parkingSystem.checkOutCar(ticketId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// PAYMENT ROUTES
// ============================================
app.post('/api/payments', (req, res) => {
  try {
    const { ticketId, amount, method } = req.body;
    if (!ticketId || !amount || !method) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ticket ID, amount, and method are required' 
      });
    }

    const payment = parkingSystem.processPayment(ticketId, amount, method);
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// FLOOR MAP ROUTE (chi tiết khu vực của tầng)
// ============================================
app.get('/api/floors/:floorId/map', (req, res) => {
  try {
    const { floorId } = req.params;
    const floorMap = parkingSystem.getFloorMap(floorId);
    
    if (!floorMap) {
      return res.status(404).json({ success: false, error: 'Floor not found' });
    }

    res.json({
      success: true,
      data: floorMap
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚗 Parking Management Server is running on http://localhost:${PORT}`);
  console.log(`📋 API Documentation:`);
  console.log(`   - GET  /api/health                 - Health check`);
  console.log(`   - GET  /api/floors                 - Get all floors info`);
  console.log(`   - GET  /api/parking-layout         - Get B2 parking layout`);
  console.log(`   - POST /api/parking-layout/reserve - Reserve a B2 parking slot`);
  console.log(`   - GET  /api/floors/:floorId/map    - Get floor detailed map`);
  console.log(`   - POST /api/cars/check-in          - Check in car`);
  console.log(`   - POST /api/tickets                - Generate parking ticket`);
  console.log(`   - GET  /api/tickets/:ticketId      - Get ticket info`);
  console.log(`   - POST /api/cars/check-out         - Check out car`);
  console.log(`   - POST /api/payments               - Process payment`);
});

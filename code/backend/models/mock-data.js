// Mock data for Parking System
const mockData = {
  floors: [
    {
      id: 'B1',
      name: 'Tầng B1',
      capacity: 480,
      occupied: 180,
      sections: [
        {
          id: 'A',
          name: 'Khu A',
          slots: [
            { id: 'A1', status: 'EMPTY', carId: null },
            { id: 'A2', status: 'OCCUPIED', carId: 'CAR-001' },
            { id: 'A3', status: 'EMPTY', carId: null },
            { id: 'A4', status: 'OCCUPIED', carId: 'CAR-002' },
            { id: 'A5', status: 'EMPTY', carId: null },
            { id: 'A6', status: 'OCCUPIED', carId: 'CAR-003' },
          ]
        },
        {
          id: 'B',
          name: 'Khu B',
          slots: [
            { id: 'B1', status: 'OCCUPIED', carId: 'CAR-004' },
            { id: 'B2', status: 'OCCUPIED', carId: 'CAR-005' },
            { id: 'B3', status: 'EMPTY', carId: null },
            { id: 'B4', status: 'OCCUPIED', carId: 'CAR-006' },
            { id: 'B5', status: 'EMPTY', carId: null },
            { id: 'B6', status: 'OCCUPIED', carId: 'CAR-007' },
          ]
        },
        {
          id: 'C',
          name: 'Khu C',
          slots: [
            { id: 'C1', status: 'EMPTY', carId: null },
            { id: 'C2', status: 'EMPTY', carId: null },
            { id: 'C3', status: 'EMPTY', carId: null },
            { id: 'C4', status: 'OCCUPIED', carId: 'CAR-008' },
            { id: 'C5', status: 'EMPTY', carId: null },
            { id: 'C6', status: 'OCCUPIED', carId: 'CAR-009' },
          ]
        },
        {
          id: 'D',
          name: 'Khu D',
          slots: [
            { id: 'D1', status: 'OCCUPIED', carId: 'CAR-010' },
            { id: 'D2', status: 'OCCUPIED', carId: 'CAR-011' },
            { id: 'D3', status: 'OCCUPIED', carId: 'CAR-012' },
            { id: 'D4', status: 'EMPTY', carId: null },
            { id: 'D5', status: 'OCCUPIED', carId: 'CAR-013' },
            { id: 'D6', status: 'EMPTY', carId: null },
          ]
        }
      ]
    },
    {
      id: 'B2',
      name: 'Tầng B2',
      capacity: 480,
      occupied: 180,
      sections: [
        {
          id: 'A',
          name: 'Khu A',
          slots: Array.from({ length: 6 }, (_, i) => ({
            id: `A${i + 1}`,
            status: i % 3 === 0 ? 'OCCUPIED' : 'EMPTY',
            carId: i % 3 === 0 ? `CAR-${Math.random().toString(36).substring(7)}` : null
          }))
        },
        {
          id: 'B',
          name: 'Khu B',
          slots: Array.from({ length: 6 }, (_, i) => ({
            id: `B${i + 1}`,
            status: i % 2 === 0 ? 'OCCUPIED' : 'EMPTY',
            carId: i % 2 === 0 ? `CAR-${Math.random().toString(36).substring(7)}` : null
          }))
        },
        {
          id: 'C',
          name: 'Khu C',
          slots: Array.from({ length: 6 }, (_, i) => ({
            id: `C${i + 1}`,
            status: 'EMPTY',
            carId: null
          }))
        },
        {
          id: 'D',
          name: 'Khu D',
          slots: Array.from({ length: 6 }, (_, i) => ({
            id: `D${i + 1}`,
            status: i < 4 ? 'OCCUPIED' : 'EMPTY',
            carId: i < 4 ? `CAR-${Math.random().toString(36).substring(7)}` : null
          }))
        }
      ]
    },
    {
      id: 'B3',
      name: 'Tầng B3',
      capacity: 480,
      occupied: 360,
      sections: [
        { id: 'A', name: 'Khu A', slots: Array.from({ length: 6 }, (_, i) => ({ id: `A${i + 1}`, status: 'OCCUPIED', carId: `CAR-${i}` })) },
        { id: 'B', name: 'Khu B', slots: Array.from({ length: 6 }, (_, i) => ({ id: `B${i + 1}`, status: 'OCCUPIED', carId: `CAR-${i + 10}` })) },
        { id: 'C', name: 'Khu C', slots: Array.from({ length: 6 }, (_, i) => ({ id: `C${i + 1}`, status: i < 3 ? 'OCCUPIED' : 'EMPTY', carId: i < 3 ? `CAR-${i + 20}` : null })) },
        { id: 'D', name: 'Khu D', slots: Array.from({ length: 6 }, (_, i) => ({ id: `D${i + 1}`, status: i < 3 ? 'OCCUPIED' : 'EMPTY', carId: i < 3 ? `CAR-${i + 30}` : null })) }
      ]
    },
    {
      id: 'B4',
      name: 'Tầng B4',
      capacity: 480,
      occupied: 120,
      sections: [
        { id: 'A', name: 'Khu A', slots: Array.from({ length: 6 }, (_, i) => ({ id: `A${i + 1}`, status: 'EMPTY', carId: null })) },
        { id: 'B', name: 'Khu B', slots: Array.from({ length: 6 }, (_, i) => ({ id: `B${i + 1}`, status: i < 3 ? 'OCCUPIED' : 'EMPTY', carId: i < 3 ? `CAR-${i}` : null })) },
        { id: 'C', name: 'Khu C', slots: Array.from({ length: 6 }, (_, i) => ({ id: `C${i + 1}`, status: i < 2 ? 'OCCUPIED' : 'EMPTY', carId: i < 2 ? `CAR-${i + 10}` : null })) },
        { id: 'D', name: 'Khu D', slots: Array.from({ length: 6 }, (_, i) => ({ id: `D${i + 1}`, status: 'EMPTY', carId: null })) }
      ]
    },
    {
      id: 'B5',
      name: 'Tầng B5',
      capacity: 480,
      occupied: 384,
      sections: [
        { id: 'A', name: 'Khu A', slots: Array.from({ length: 6 }, (_, i) => ({ id: `A${i + 1}`, status: 'OCCUPIED', carId: `CAR-${i}` })) },
        { id: 'B', name: 'Khu B', slots: Array.from({ length: 6 }, (_, i) => ({ id: `B${i + 1}`, status: 'OCCUPIED', carId: `CAR-${i + 10}` })) },
        { id: 'C', name: 'Khu C', slots: Array.from({ length: 6 }, (_, i) => ({ id: `C${i + 1}`, status: i < 4 ? 'OCCUPIED' : 'EMPTY', carId: i < 4 ? `CAR-${i + 20}` : null })) },
        { id: 'D', name: 'Khu D', slots: Array.from({ length: 6 }, (_, i) => ({ id: `D${i + 1}`, status: i < 2 ? 'OCCUPIED' : 'EMPTY', carId: i < 2 ? `CAR-${i + 30}` : null })) }
      ]
    },
    {
      id: 'B6',
      name: 'Tầng B6',
      capacity: 480,
      occupied: 456,
      sections: [
        { id: 'A', name: 'Khu A', slots: Array.from({ length: 6 }, (_, i) => ({ id: `A${i + 1}`, status: 'OCCUPIED', carId: `CAR-${i}` })) },
        { id: 'B', name: 'Khu B', slots: Array.from({ length: 6 }, (_, i) => ({ id: `B${i + 1}`, status: 'OCCUPIED', carId: `CAR-${i + 10}` })) },
        { id: 'C', name: 'Khu C', slots: Array.from({ length: 6 }, (_, i) => ({ id: `C${i + 1}`, status: 'OCCUPIED', carId: `CAR-${i + 20}` })) },
        { id: 'D', name: 'Khu D', slots: Array.from({ length: 6 }, (_, i) => ({ id: `D${i + 1}`, status: i < 5 ? 'OCCUPIED' : 'EMPTY', carId: i < 5 ? `CAR-${i + 30}` : null })) }
      ]
    }
  ],
  cars: [
    { id: 'CAR-001', licensePlate: '52-F1 888.88', entryTime: new Date(Date.now() - 3600000), exitTime: null },
    { id: 'CAR-002', licensePlate: '52-F1 777.77', entryTime: new Date(Date.now() - 7200000), exitTime: null },
    { id: 'CAR-003', licensePlate: '52-F1 666.66', entryTime: new Date(Date.now() - 5400000), exitTime: null },
  ],
  tickets: [
    {
      id: 'P-0502',
      carId: 'CAR-001',
      entryTime: new Date(Date.now() - 3600000),
      exitTime: null,
      floor: 'B2',
      slot: 'A6.20',
      fee: 5000,
      paymentStatus: 'UNPAID',
      paymentMethod: null
    },
    { 
      id: '#P-8821', 
      carId: 'CAR-001', 
      entryTime: new Date(Date.now() - 3600000), 
      exitTime: null, 
      floor: 'B1', 
      slot: 'A2', 
      fee: 5000, 
      paymentStatus: 'UNPAID', 
      paymentMethod: null 
    },
    { 
      id: '#P-8822', 
      carId: 'CAR-002', 
      entryTime: new Date(Date.now() - 7200000), 
      exitTime: null, 
      floor: 'B1', 
      slot: 'A4', 
      fee: 10000, 
      paymentStatus: 'UNPAID', 
      paymentMethod: null 
    },
  ]
};

module.exports = mockData;

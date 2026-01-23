export const habitaciones = [
  {
    id: 'H1',
    numero: '101',
    tipo: 'suite',
    capacidad: 2,
    precio: 150,
    imagen:
      'https://www.cataloniahotels.com/es/blog/wp-content/uploads/2016/05/habitaci%C3%B3n-doble-catalonia-620x412.jpg',

  },
  {
    id: 'H2',
    numero: '102',
    tipo: 'doble',
    capacidad: 3,
    precio: 120,
    imagen:
      'https://i.pinimg.com/1200x/42/b6/8c/42b68cd2490f7a0467234a71b4d4d6fb.jpg',
  
  },
  {
    id: 'H3',
    numero: '103',
    tipo: 'individual',
    capacidad: 1,
    precio: 80,
    imagen:
      'https://www.anticcolonial.com/wp-content/uploads/2017/11/hotel-calpe-suitopia.jpg',
 
  },
  {
    id: 'H4',
    numero: '104',
    tipo: 'suite',
    capacidad: 4,
    precio: 200,
    imagen: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
  
  },
  {
    id: 'H5',
    numero: '105',
    tipo: 'doble',
    capacidad: 2,
    precio: 110,
    imagen: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',

  },
  {
    id: 'H6',
    numero: '106',
    tipo: 'doble',
    capacidad: 3,
    precio: 130,
    imagen: 'https://images.unsplash.com/photo-1445991842772-097fea258e7b',
  
  },
  {
    id: 'H7',
    numero: '107',
    tipo: 'individual',
    capacidad: 1,
    precio: 70,
    imagen:
      'https://i.pinimg.com/736x/48/55/6e/48556e9ad40f1a2c6914d0821a5677c8.jpg',
 
  },
  {
    id: 'H8',
    numero: '108',
    tipo: 'suite',
    capacidad: 2,
    precio: 180,
    imagen:
      'https://i.pinimg.com/1200x/d4/6f/88/d46f88696e03fb649d98c09e1d1e0e6e.jpg',
  
  },
  {
    id: 'H9',
    numero: '109',
    tipo: 'doble',
    capacidad: 2,
    precio: 115,
    imagen:
      'https://i.pinimg.com/1200x/c4/12/a0/c412a0688f05c0845340b441ca0aab6c.jpg',
  
  },
  {
    id: 'H10',
    numero: '110',
    tipo: 'premium',
    capacidad: 4,
    precio: 250,
    imagen:
      'https://i.pinimg.com/1200x/a7/6d/06/a76d067562b3ed9a97a8b07989138841.jpg',
  
  },
  {
    id: 'H11',
    numero: '111',
    tipo: 'premium',
    capacidad: 6,
    precio: 250,
    imagen:
      'https://i.pinimg.com/1200x/f6/ea/bb/f6eabb2d9cca3247b259f7c18c6ae404.jpg',
   
  },
  {
    id: 'H12',
    numero: '112',
    tipo: 'premium',
    capacidad: 3,
    precio: 250,
    imagen:
      'https://i.pinimg.com/1200x/28/ef/1a/28ef1a488c745c5607ffa7b667292489.jpg',
  
  },
  {
    id: 'H13',
    numero: '113',
    tipo: 'premium',
    capacidad: 6,
    precio: 250,
    imagen:
      'https://i.pinimg.com/736x/f6/fe/9d/f6fe9d30dd9b62a895fcbacfbb3c5d71.jpg',
  
  }
]

export const reservas = [
  // ============================
  // 1) RESERVAS COMPLETAS (3)
  // ============================

  {
    idReserva: 'R-0001',
    huesped: {
      nombre: 'María',
      apellido: 'Pérez',
      tipoDocumento: 'CC',
      numeroDocumento: '12345678',
      telefono: '3001234567',
      email: 'maria@example.com',
      direccion: 'Bogotá'
    },
    habitacion: {
      idHabitacion: 'H1',
      numero: '101',
      tipo: 'suite',
      capacidad: 2,
      precioPorNoche: 150
    },
    fechas: {
      checkIn: '2025-03-10',
      checkOut: '2025-03-15',
      noches: 5
    },
    pago: {
      metodo: 'tarjeta',
      montoTotal: 750,
      montoPagado: 300,
      saldoPendiente: 450,
      moneda: 'USD'
    },
    serviciosAdicionales: [
      { idServicio: 'D1', nombre: 'Desayuno buffet', precio: 20 },
      { idServicio: 'T1', nombre: 'Transporte aeropuerto', precio: 35 }
    ],
    estado: 'confirmada',
    notas: 'Llega tarde, después de las 11 pm.'
  },

  {
    idReserva: 'R-0002',
    huesped: {
      nombre: 'Carlos',
      apellido: 'Gómez',
      tipoDocumento: 'CC',
      numeroDocumento: '67544321',
      telefono: '3109988776',
      email: 'carlos@example.com',
      direccion: 'Medellín'
    },
    habitacion: {
      idHabitacion: 'H4',
      numero: '104',
      tipo: 'suite',
      capacidad: 4,
      precioPorNoche: 200
    },
    fechas: {
      checkIn: '2025-04-05',
      checkOut: '2025-04-08',
      noches: 3
    },
    pago: {
      metodo: 'efectivo',
      montoTotal: 600,
      montoPagado: 600,
      saldoPendiente: 0,
      moneda: 'USD'
    },
    serviciosAdicionales: [
      { idServicio: 'S1', nombre: 'Spa completo', precio: 50 }
    ],
    estado: 'confirmada',
    notas: 'Cliente celebra aniversario.'
  },

  {
    idReserva: 'R-0003',
    huesped: {
      nombre: 'Luisa',
      apellido: 'Martínez',
      tipoDocumento: 'CC',
      numeroDocumento: '99887766',
      telefono: '3205551122',
      email: 'luisa@example.com',
      direccion: 'Cali'
    },
    habitacion: {
      idHabitacion: 'H3',
      numero: '103',
      tipo: 'individual',
      capacidad: 1,
      precioPorNoche: 80
    },
    fechas: {
      checkIn: '2025-05-20',
      checkOut: '2025-05-23',
      noches: 3
    },
    pago: {
      metodo: 'transferencia',
      montoTotal: 240,
      montoPagado: 100,
      saldoPendiente: 140,
      moneda: 'USD'
    },
    serviciosAdicionales: [],
    estado: 'confirmada',
    notas: 'Solicita habitación silenciosa.'
  },

  // ============================
  // 2) RESERVAS POR RESERVAR (7)
  // ============================

  {
    idReserva: 'P-0004',
    idHabitacion: 'H2',
    fechas: {
      checkIn: '2025-06-10',
      checkOut: '2025-06-12'
    },
    estado: 'pendiente'
  },

  {
    idReserva: 'P-0005',
    idHabitacion: 'H5',
    fechas: {
      checkIn: '2025-02-01',
      checkOut: '2025-02-05'
    },
    estado: 'pendiente'
  },

  {
    idReserva: 'P-0006',
    idHabitacion: 'H6',
    fechas: {
      checkIn: '2025-07-15',
      checkOut: '2025-07-17'
    },
    estado: 'pendiente'
  },

  {
    idReserva: 'P-0007',
    idHabitacion: 'H7',
    fechas: {
      checkIn: '2025-08-20',
      checkOut: '2025-08-22'
    },
    estado: 'pendiente'
  },

  {
    idReserva: 'P-0008',
    idHabitacion: 'H8',
    fechas: {
      checkIn: '2025-09-01',
      checkOut: '2025-09-03'
    },
    estado: 'pendiente'
  },

  {
    idReserva: 'P-0009',
    idHabitacion: 'H9',
    fechas: {
      checkIn: '2025-10-10',
      checkOut: '2025-10-12'
    },
    estado: 'pendiente'
  },

  {
    idReserva: 'P-0010',
    idHabitacion: 'H10',
    fechas: {
      checkIn: '2025-11-05',
      checkOut: '2025-11-08'
    },
    estado: 'pendiente'
  }
]

export const servicios = [
  {
    id: "S1",
    nombre: "Desayuno buffet",
    descripcion: "Desayuno completo tipo buffet",
    precio: 30000,
    disponible: true
  },
  {
    id: "S2",
    nombre: "Transporte al hotel",
    descripcion: "Traslado desde el aeropuerto",
    precio: 50000,
    disponible: true
  }
];

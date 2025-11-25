export const habitaciones = [
  {
    id: "H1",
    numero: "101",
    tipo: "suite",
    capacidad: 2,
    precio: 150,
    imagen: "https://www.cataloniahotels.com/es/blog/wp-content/uploads/2016/05/habitaci%C3%B3n-doble-catalonia-620x412.jpg",
  },
  {
    id: "H2",
    numero: "102",
    tipo: "doble",
    capacidad: 3,
    precio: 120,
    imagen: "https://images.unsplash.com/photo-1560448075-bb4bd4f1b651",
  },
  {
    id: "H3",
    numero: "103",
    tipo: "individual",
    capacidad: 1,
    precio: 80,
    imagen: "https://www.anticcolonial.com/wp-content/uploads/2017/11/hotel-calpe-suitopia.jpg",
  },
  {
    id: "H4",
    numero: "104",
    tipo: "suite",
    capacidad: 4,
    precio: 200,
    imagen: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  },
  {
    id: "H5",
    numero: "105",
    tipo: "doble",
    capacidad: 2,
    precio: 110,
    imagen: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  },
  {
    id: "H6",
    numero: "106",
    tipo: "doble",
    capacidad: 3,
    precio: 130,
    imagen: "https://images.unsplash.com/photo-1445991842772-097fea258e7b",
  },
  {
    id: "H7",
    numero: "107",
    tipo: "individual",
    capacidad: 1,
    precio: 70,
    imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },
  {
    id: "H8",
    numero: "108",
    tipo: "suite",
    capacidad: 2,
    precio: 180,
    imagen: "https://images.unsplash.com/photo-1559599238-0f7d6af36a5a",
  },
  {
    id: "H9",
    numero: "109",
    tipo: "doble",
    capacidad: 2,
    precio: 115,
    imagen: "https://images.unsplash.com/photo-1617093727343-375008a3c59c",
  },
  {
    id: "H10",
    numero: "110",
    tipo: "premium",
    capacidad: 4,
    precio: 250,
    imagen: "https://images.unsplash.com/photo-1598300042247-bf88b50e6b5a",
  }
];


export const reservas = [
  // ============================
  // 1) RESERVAS COMPLETAS (3)
  // ============================

  {
    idReserva: "R-0001",
    huesped: {
      nombre: "María",
      apellido: "Pérez",
      tipoDocumento: "CC",
      numeroDocumento: "12345678",
      telefono: "3001234567",
      email: "maria@example.com",
      direccion: "Bogotá",
    },
    habitacion: {
      idHabitacion: "H1",
      numero: "101",
      tipo: "suite",
      capacidad: 2,
      precioPorNoche: 150,
    },
    fechas: {
      checkIn: "2025-03-10",
      checkOut: "2025-03-15",
      noches: 5,
    },
    pago: {
      metodo: "tarjeta",
      montoTotal: 750,
      montoPagado: 300,
      saldoPendiente: 450,
      moneda: "USD",
    },
    serviciosAdicionales: [
      { idServicio: "D1", nombre: "Desayuno buffet", precio: 20 },
      { idServicio: "T1", nombre: "Transporte aeropuerto", precio: 35 },
    ],
    estado: "confirmada",
    notas: "Llega tarde, después de las 11 pm.",
  },

  {
    idReserva: "R-0002",
    huesped: {
      nombre: "Carlos",
      apellido: "Gómez",
      tipoDocumento: "CC",
      numeroDocumento: "67544321",
      telefono: "3109988776",
      email: "carlos@example.com",
      direccion: "Medellín",
    },
    habitacion: {
      idHabitacion: "H4",
      numero: "104",
      tipo: "suite",
      capacidad: 4,
      precioPorNoche: 200,
    },
    fechas: {
      checkIn: "2025-04-05",
      checkOut: "2025-04-08",
      noches: 3,
    },
    pago: {
      metodo: "efectivo",
      montoTotal: 600,
      montoPagado: 600,
      saldoPendiente: 0,
      moneda: "USD",
    },
    serviciosAdicionales: [
      { idServicio: "S1", nombre: "Spa completo", precio: 50 },
    ],
    estado: "confirmada",
    notas: "Cliente celebra aniversario.",
  },

  {
    idReserva: "R-0003",
    huesped: {
      nombre: "Luisa",
      apellido: "Martínez",
      tipoDocumento: "CC",
      numeroDocumento: "99887766",
      telefono: "3205551122",
      email: "luisa@example.com",
      direccion: "Cali",
    },
    habitacion: {
      idHabitacion: "H3",
      numero: "103",
      tipo: "individual",
      capacidad: 1,
      precioPorNoche: 80,
    },
    fechas: {
      checkIn: "2025-05-20",
      checkOut: "2025-05-23",
      noches: 3,
    },
    pago: {
      metodo: "transferencia",
      montoTotal: 240,
      montoPagado: 100,
      saldoPendiente: 140,
      moneda: "USD",
    },
    serviciosAdicionales: [],
    estado: "confirmada",
    notas: "Solicita habitación silenciosa.",
  },

  // ============================
  // 2) RESERVAS POR RESERVAR (7)
  // ============================

  {
    idReserva: "P-0004",
    idHabitacion: "H2",
    fechas: {
      checkIn: "2025-06-10",
      checkOut: "2025-06-12",
    },
    estado: "pendiente",
  },

  {
    idReserva: "P-0005",
    idHabitacion: "H5",
    fechas: {
      checkIn: "2025-02-01",
      checkOut: "2025-02-05",
    },
    estado: "pendiente",
  },

  {
    idReserva: "P-0006",
    idHabitacion: "H6",
    fechas: {
      checkIn: "2025-07-15",
      checkOut: "2025-07-17",
    },
    estado: "pendiente",
  },

  {
    idReserva: "P-0007",
    idHabitacion: "H7",
    fechas: {
      checkIn: "2025-08-20",
      checkOut: "2025-08-22",
    },
    estado: "pendiente",
  },

  {
    idReserva: "P-0008",
    idHabitacion: "H8",
    fechas: {
      checkIn: "2025-09-01",
      checkOut: "2025-09-03",
    },
    estado: "pendiente",
  },

  {
    idReserva: "P-0009",
    idHabitacion: "H9",
    fechas: {
      checkIn: "2025-10-10",
      checkOut: "2025-10-12",
    },
    estado: "pendiente",
  },

  {
    idReserva: "P-0010",
    idHabitacion: "H10",
    fechas: {
      checkIn: "2025-11-05",
      checkOut: "2025-11-08",
    },
    estado: "pendiente",
  }
];

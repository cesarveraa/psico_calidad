import { tokens } from "../theme";

export const mockCompartidos = [
  {
    user: "Estudiante1",
    date: "01/05/2024",
    title: "Programas que ofrecemos",
    category: "Programas",
  },
  {
    user: "Estudiante2",
    date: "02/05/2024",
    title: "Unete a Psicopedagogia",
    category: "Reclutamiento",
  },
  {
    user: "Estudiante3",
    date: "03/05/2024",
    title: "Nuestros Docentes",
    category: "Docentes",
  },
  {
    user: "Estudiante4",
    date: "04/05/2024",
    title: "Nuestra Malla Curricular",
    category: "Malla",
  },
  {
    user: "Estudiante5",
    date: "05/05/2024",
    title: "Nuestros Eventos",
    category: "Eventos",
  },
];

export const mockBarData = [
  {
    country: "Facebook",
    "Programas": 137,
    Eventos: 96,
    Malla: 72,
    Docentes: 140,
    Reclutamiento: 72,
    Otros: 72,
  },
  {
    country: "Whatsapp",
    "Programas": 55,
    Eventos: 28,
    Malla: 58,
    Docentes: 29,
    Reclutamiento: 72,
    Otros: 32,
  },
  {
    country: "Twitter",
    "Programas": 109,
    Eventos: 23,
    Malla: 34,
    Docentes: 152,
    Reclutamiento: 72,
    Otros: 12,
  },
];

export const mockLineData = [
  {
    id: "Facebook",
    color: tokens("dark").greenAccent[500],
    data: [
      {
        x: "Docencia",
        y: 221,
      },
      {
        x: "Eventos",
        y: 75,
      },
      {
        x: "Malla curricular",
        y: 36,
      },
      {
        x: "Reclutamiento",
        y: 216,
      },
      {
        x: "Programas",
        y: 35,
      },
      {
        x: "Otros",
        y: 236,
      },
    ],
  },
  {
    id: "Whatsapp",
    color: tokens("dark").blueAccent[300],
    data: [
      {
        x: "Docencia",
        y: 101,
      },
      {
        x: "Eventos",
        y: 75,
      },
      {
        x: "Malla curricular",
        y: 36,
      },
      {
        x: "Reclutamiento",
        y: 216,
      },
      {
        x: "Programas",
        y: 35,
      },
      {
        x: "Otros",
        y: 236,
      },
    ],
  },
  {
    id: "Twitter",
    color: tokens("dark").redAccent[200],
    data: [
      {
        x: "Docencia",
        y: 101,
      },
      {
        x: "Eventos",
        y: 75,
      },
      {
        x: "Malla curricular",
        y: 36,
      },
      {
        x: "Reclutamiento",
        y: 216,
      },
      {
        x: "Programas",
        y: 35,
      },
      {
        x: "Otros",
        y: 236,
      },
    ],
  },
];

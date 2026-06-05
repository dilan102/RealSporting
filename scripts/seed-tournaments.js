#!/usr/bin/env node

/**
 * Script para sembrar torneos de referencia
 * Uso: node scripts/seed-tournaments.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Torneos Jugados (played)
  const playedTournaments = [
    {
      nombre: "Copa Metro 2025",
      descripcion: "Participación en la copa metropolitana con gran desempeño del equipo.",
      programacion:
        "Fase de grupos: 3-0 vs Academia del Valle\nCuartos: 2-1 vs Sporting Barranquilla\nSemifinales: 1-2 vs Millonarios",
      sede: "Estadio El Campín, Bogotá",
      categoria: "U-14",
      rival: "Múltiples rivales",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2025-04-15"),
      fechaFin: new Date("2025-05-30"),
      estado: "played",
      publicado: true,
    },
    {
      nombre: "Torneo Intercolegial 2025",
      descripcion: "Competencia entre colegios de Bogotá con gran participación.",
      programacion:
        "Octavos: 4-0 vs Colegio San Jorge\nCuartos: 3-1 vs Colegio Mayor\nSemifinales: 2-2 (4-3 penales) vs Colegio Salesiano",
      sede: "Cancha La Florida, Bogotá",
      categoria: "U-17",
      rival: "Colegios bogotanos",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2025-06-10"),
      fechaFin: new Date("2025-07-20"),
      estado: "played",
      publicado: true,
    },
    {
      nombre: "Liga Regional 2025",
      descripcion: "Participación en la liga regional de Cundinamarca.",
      programacion:
        "Jornada 1: 2-1 vs Deportivo Fusagasugá\nJornada 2: 1-1 vs Pereira FC\nJornada 3: 3-0 vs Boca Juniors Cali",
      sede: "Estadio Departamental, Bogotá",
      categoria: "U-14",
      rival: "Equipos de Cundinamarca",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2025-08-01"),
      fechaFin: new Date("2025-09-15"),
      estado: "played",
      publicado: true,
    },
    {
      nombre: "Torneo Amistoso Internacional",
      descripcion: "Torneo amistoso con equipos de otras regiones.",
      programacion:
        "Partido 1: 2-0 vs Atlético Huila\nPartido 2: 1-0 vs Boyacá Chicó\nPartido 3: 3-1 vs Cúcuta Deportivo",
      sede: "Cancha privada, Bogotá",
      categoria: "U-17",
      rival: "Equipos nacionales",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2025-10-05"),
      fechaFin: new Date("2025-10-20"),
      estado: "played",
      publicado: true,
    },
  ];

  // Torneos Ganados (won)
  const wonTournaments = [
    {
      nombre: "Campeonato Regional U-14 2024",
      descripcion: "Campeones de la región en categoría U-14. Logro histórico del club.",
      programacion:
        "Fase de grupos: 3-0\nSemifinales: 2-0 vs Unión Magdalena\nFinal: 1-0 vs Atlético Junior",
      sede: "Estadio Metropolitano, Barranquilla",
      categoria: "U-14",
      rival: "Atlético Junior",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2024-11-01"),
      fechaFin: new Date("2024-12-15"),
      estado: "won",
      publicado: true,
    },
    {
      nombre: "Copa Interna 2025",
      descripcion: "Ganadores de la copa interna entre categorías del club.",
      programacion:
        "Semifinal: 3-1 vs Categoría U-15\nFinal: 2-0 vs Categoría U-16",
      sede: "Sede Real Sporting, Bogotá",
      categoria: "U-17",
      rival: "Categorías internas",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2025-02-01"),
      fechaFin: new Date("2025-02-28"),
      estado: "won",
      publicado: true,
    },
    {
      nombre: "Torneo Clasificatorio 2024",
      descripcion: "Victoria en torneo clasificatorio para liga regional.",
      programacion: "Grupo A: 3-0, 2-0, 2-1\nFinal: 1-0 vs Deportivo Cali",
      sede: "Bogotá",
      categoria: "U-14",
      rival: "Deportivo Cali",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2024-05-10"),
      fechaFin: new Date("2024-06-05"),
      estado: "won",
      publicado: true,
    },
  ];

  // Torneos Por Jugar (future)
  const futureTournaments = [
    {
      nombre: "Copa Nacional 2026",
      descripcion:
        "Participación confirmada en la copa nacional. Oportunidad de competir a nivel nacional.",
      programacion: "Fase de grupos: TBD\nOctavos: TBD\nCuartos: TBD",
      sede: "Bogotá",
      categoria: "U-14",
      rival: "Por definir",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2026-07-15"),
      fechaFin: new Date("2026-08-30"),
      estado: "future",
      publicado: true,
    },
    {
      nombre: "Torneo Sudamericano U-17",
      descripcion:
        "Posible participación en torneo sudamericano. Competencia internacional de gran nivel.",
      programacion: "Fechas y rivales por confirmar",
      sede: "Por definir",
      categoria: "U-17",
      rival: "Equipos sudamericanos",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2026-08-10"),
      fechaFin: new Date("2026-09-20"),
      estado: "future",
      publicado: true,
    },
    {
      nombre: "Liga Regional 2026",
      descripcion: "Participación en la liga regular regional de Cundinamarca.",
      programacion: "Jornadas semanales de septiembre a noviembre",
      sede: "Estadio Departamental, Bogotá",
      categoria: "U-14 y U-17",
      rival: "Equipos de Cundinamarca",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2026-09-01"),
      fechaFin: new Date("2026-11-30"),
      estado: "future",
      publicado: true,
    },
    {
      nombre: "Torneo Amistoso Fin de Año",
      descripcion:
        "Torneo amistoso para cerrar la temporada. Preparación para próxima temporada.",
      programacion: "Varios partidos amistosos contra equipos locales",
      sede: "Bogotá",
      categoria: "U-14 y U-17",
      rival: "Equipos locales",
      imagen: "/brand/hero-training.jpg",
      fechaInicio: new Date("2026-11-15"),
      fechaFin: new Date("2026-12-20"),
      estado: "future",
      publicado: true,
    },
  ];

  try {
    console.log("🌱 Sembrando torneos de referencia...\n");

    // Limpiar torneos existentes
    console.log("🗑️  Limpiando torneos existentes...");
    await prisma.torneo.deleteMany({});
    console.log("✓ Base de datos limpiada\n");

    // Insertar torneos jugados
    console.log("📝 Creando torneos jugados...");
    for (const torneo of playedTournaments) {
      await prisma.torneo.create({ data: torneo });
      console.log(`  ✓ ${torneo.nombre}`);
    }

    // Insertar torneos ganados
    console.log("\n🏆 Creando torneos ganados...");
    for (const torneo of wonTournaments) {
      await prisma.torneo.create({ data: torneo });
      console.log(`  ✓ ${torneo.nombre}`);
    }

    // Insertar torneos por jugar
    console.log("\n📅 Creando torneos por jugar...");
    for (const torneo of futureTournaments) {
      await prisma.torneo.create({ data: torneo });
      console.log(`  ✓ ${torneo.nombre}`);
    }

    const total = playedTournaments.length + wonTournaments.length + futureTournaments.length;
    console.log("\n✅ Base de datos sembrada exitosamente!");
    console.log(`📊 Total: ${total} torneos creados\n`);
  } catch (error) {
    console.error("❌ Error al sembrar base de datos:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

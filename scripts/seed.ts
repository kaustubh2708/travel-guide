import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testLocations = [
  {
    name: "Eiffel Tower",
    description: "Iconic iron tower in Paris, France",
    latitude: 48.8584,
    longitude: 2.2945,
    country: "France",
    city: "Paris",
    category: "LANDMARKS"
  },
  {
    name: "Grand Canyon",
    description: "Massive canyon in Arizona, USA",
    latitude: 36.1064,
    longitude: -112.1129,
    country: "United States",
    city: "Arizona",
    category: "NATURE"
  },
  {
    name: "Bondi Beach",
    description: "Famous beach in Sydney, Australia",
    latitude: -33.8915,
    longitude: 151.2767,
    country: "Australia",
    city: "Sydney",
    category: "BEACH"
  },
  {
    name: "Taj Mahal",
    description: "White marble mausoleum in Agra, India",
    latitude: 27.1751,
    longitude: 78.0421,
    country: "India",
    city: "Agra",
    category: "LANDMARKS"
  },
  {
    name: "Mount Everest",
    description: "Highest peak in the world",
    latitude: 27.9881,
    longitude: 86.9250,
    country: "Nepal",
    city: "Khumbu",
    category: "NATURE"
  }
];

async function main() {
  try {
    // Clear existing data
    await prisma.travelSpot.deleteMany();
    console.log('Cleared existing data');

    // Add test locations
    for (const location of testLocations) {
      await prisma.travelSpot.create({
        data: location
      });
    }
    console.log('Added test locations successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
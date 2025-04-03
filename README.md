# Travel Guide Application

An interactive travel guide application that helps users discover and explore travel spots around the world. Built with Next.js, TypeScript, and OpenStreetMap.

## Features

- 🌍 Interactive world map with travel spots
- 🔍 Advanced filtering by country, city, and category
- 🌓 Dark mode support
- 📱 Responsive design
- 🎯 Smooth animations between locations
- 📊 Category-based organization
- 🔎 Search functionality

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React-Leaflet (OpenStreetMap)
  - Heroicons

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/travel-guide.git
   cd travel-guide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/travel_guide"
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL service
   # On macOS:
   brew services start postgresql
   
   # Create the database
   createdb travel_guide
   
   # Push the schema to the database
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
travel-guide/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── spots/        # API routes for travel spots
│   │   ├── page.tsx          # Main page component
│   │   └── layout.tsx        # Root layout
│   └── components/
│       ├── Map.tsx           # Interactive map component
│       └── SpotList.tsx      # List of travel spots
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
│   └── marker-icon.svg       # Custom map marker icon
└── package.json
```

## Features in Detail

### Map Component
- Interactive world map using OpenStreetMap
- Custom markers for travel spots
- Smooth animations when navigating between spots
- Popup information for each spot

### Spot List Component
- Filter spots by country, city, and category
- Search functionality
- Dark mode support
- Responsive design
- Visual indicators for selected spots

### API Routes
- GET /api/spots - Fetch all travel spots
- POST /api/spots - Create a new travel spot

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [Leaflet](https://leafletjs.com/) for the map library
- [Heroicons](https://heroicons.com/) for icons

# PTIT Parking Management System

## Overview

PTIT Parking Management System is a comprehensive solution for managing parking facilities at educational institutions. This web application provides a user-friendly interface for administrators and staff to handle daily parking operations, monthly card registrations, and generate statistical reports.

## Features

- **Authentication**: Secure login system with role-based access (admin/staff)
- **Dashboard**: Overview of key metrics and real-time parking status
- **Vehicle Management**:
  - Entry/exit recording with license plate recognition
  - Daily parking ticket issuance
  - Monthly card registration and management
- **Missing Card Reports**: Process and manage lost card incidents
- **Statistical Reporting**:
  - Traffic analysis with visual charts
  - Revenue reports by period (daily/weekly/monthly)
- **Admin Features**:
  - Staff management
  - Price configuration
  - Historical data access for all transactions

## Technology Stack

- **Frontend**: Next.js 14 (React)
- **UI Components**: Custom UI built with Tailwind CSS and shadcn/ui
- **State Management**: React Hooks and Context API
- **API Integration**: Custom fetch hooks with authentication
- **Data Visualization**: Chart.js for statistics and reports

## Project Structure

```
parking-management-ui/
├── app/                   # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected routes
│   │   ├── admin/         # Admin-specific pages
│   │   └── staff/         # Staff-specific pages
├── components/            # Reusable UI components
├── config/                # Configuration files
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm/yarn/pnpm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd parking-management-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or 
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment

The application can be deployed on any platform supporting Node.js applications. For the simplest deployment experience, use Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure environment variables as needed
4. Deploy

## Known Issues

- Dialog components may sometimes show double scrollbars in specific scenarios
- Performance optimization needed for large datasets in historical records

## Future Improvements

- Implement real-time notifications
- Enhance mobile responsiveness
- Add more detailed financial reporting
- Integrate with physical hardware (cameras, barriers)

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

Similar code found with 1 license type
# Intelligent Fuel Performance Monitoring (I-FPM) System

## Overview

This is a full-stack web application for monitoring and analyzing fuel performance data for maritime vessels. The system provides real-time dashboards, performance analytics, and compliance tracking for ship operators and fleet managers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom maritime color theme
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: React Query for server state management
- **Routing**: Wouter for client-side routing
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL-based sessions
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement with Vite integration

## Key Components

### Database Schema
- **Ships**: Core vessel information (name, IMO, type, deadweight, engine power)
- **Voyages**: Trip data linking ships to specific journeys
- **Fuel Data**: Performance metrics (SFOC, consumption rates, engine load)
- **Environmental Data**: Weather conditions affecting performance
- **Hull Condition**: Hull roughness and efficiency metrics
- **Trim Data**: Vessel trim optimization data
- **Compliance Data**: Regulatory compliance tracking (CII, EEOI)
- **Auxiliary Data**: Additional engine and system data

### Advanced Calculation Engine
- **Hull Performance Calculator**: Power-based and SFOC-based hull roughness index calculations
- **Weather Corrections**: ISO 15016 compliant environmental adjustments
- **Economic Analysis**: ROI calculations for hull cleaning and maintenance planning
- **Performance Degradation**: Trend analysis and maintenance recommendations

### Core Features
- **Real-time Monitoring**: Live fuel consumption and performance tracking
- **Performance Analytics**: SFOC analysis, efficiency trending, comparative reporting
- **Compliance Tracking**: CII rating, EEOI monitoring, regulatory compliance
- **Environmental Impact**: Weather-adjusted performance analysis
- **Hull Optimization**: Condition monitoring and trim optimization recommendations
- **Alert System**: Performance degradation and efficiency alerts
- **Hull Performance Calculator**: Advanced calculation engine for hull roughness index and efficiency analysis
- **CII Calculator**: Complete Carbon Intensity Indicator calculation with IMO formula implementation
- **Data Input System**: Comprehensive 5-tab data entry interface with validation
- **Export Functionality**: PDF reports and CSV data exports with real vessel data
- **Sidebar Navigation**: Organized analysis groups (FUEL, HULL, ENGINE, ENVIRONMENT) with contextual content

## Data Flow

1. **Data Generation**: Server startup generates realistic historical data for demonstration
2. **API Endpoints**: RESTful endpoints serve data to frontend components
3. **State Management**: React Query handles caching, synchronization, and updates
4. **Real-time Updates**: Periodic data fetching simulates live monitoring
5. **Visualization**: Charts and KPIs display processed performance metrics

## External Dependencies

### Key Libraries
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **drizzle-orm**: Type-safe database ORM
- **recharts**: Chart and visualization library
- **wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation utilities
- **zod**: Schema validation (via drizzle-zod)

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite middleware integrated with Express for seamless development
- **Environment Variables**: DATABASE_URL for database connection
- **Port Configuration**: Flexible port binding for various hosting environments

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild bundles server code for Node.js deployment
- **Database**: PostgreSQL with Drizzle migrations
- **Static Assets**: Served directly by Express in production

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Connection**: Environment-based database URL configuration
- **Development Data**: Automatic generation of realistic test data

The system is designed for scalability and maintainability, with clear separation between frontend and backend concerns, type safety throughout the stack, and a modern development experience.
# Overview

This is a Solar System Explorer application built with React, TypeScript, and Express. The application provides an interactive 3D visualization of the solar system using React Three Fiber and Three.js, with a 2D fallback for devices that don't support WebGL. Users can explore planets, view detailed information about each celestial body, and interact with an immersive solar system simulation.

The application features a full-stack architecture with a React frontend for the interactive solar system interface and an Express backend providing API capabilities. The project includes comprehensive UI components built with Radix UI and styled with Tailwind CSS, creating a modern and accessible user experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **3D Graphics**: React Three Fiber (@react-three/fiber) with Three.js for 3D solar system rendering
- **3D Extensions**: React Three Drei (@react-three/drei) for enhanced 3D controls and effects
- **2D Fallback**: Custom 2D solar system implementation using CSS animations for WebGL-unsupported devices
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design system for consistent UI styling
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **State Management**: Zustand for lightweight state management (audio and game states)
- **HTTP Client**: TanStack Query for server state management and data fetching

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API development
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Development**: tsx for TypeScript execution in development mode
- **Build Process**: esbuild for fast backend compilation and bundling
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage)

## Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Database**: PostgreSQL via Neon Database (@neondatabase/serverless) for serverless deployment
- **Migrations**: Drizzle Kit for database schema migrations and management
- **Schema**: Shared schema definitions between frontend and backend using Zod for validation
- **Development Storage**: In-memory storage implementation for development and testing

## Authentication and Authorization
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **User Schema**: Basic user authentication schema with username/password fields
- **Validation**: Zod schemas for input validation and type safety
- **Security**: Prepared for authentication implementation with user management interfaces

## External Dependencies
- **Database Provider**: Neon Database for managed PostgreSQL hosting
- **Font Resources**: Fontsource Inter for consistent typography
- **Development Tools**: Replit-specific plugins for development environment integration
- **Audio Support**: Browser-native audio APIs for sound effects and background music
- **3D Assets**: Support for GLTF/GLB 3D models and audio file formats (MP3, OGG, WAV)
- **Shader Support**: GLSL shader compilation via vite-plugin-glsl for custom visual effects

## Design Patterns
- **Component Architecture**: Modular React components with clear separation of concerns
- **Custom Hooks**: Reusable logic extraction for mobile detection and audio management
- **Error Boundaries**: Graceful fallback handling for WebGL and 3D rendering failures
- **Progressive Enhancement**: 2D fallback ensures functionality across all devices
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: Keyboard navigation and screen reader support via Radix UI primitives
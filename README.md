# Foo Database Connector

Professional database metadata connector built with Express.js and PostgreSQL

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://postgresql.org/)

A enterprise-grade REST API connector that extracts metadata from relational databases and generates **data lineage graphs** showing relationships between tables, views, and stored procedures.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Data Model](#data-model)
- [Development](#development)
- [Project Structure](#project-structure)

## Features

### Core Functionality
- **Metadata Extraction**: Queries database metadata tables for comprehensive system analysis
- **Data Lineage Graph**: Generates nodes and edges representing data flow relationships
- **Schema Filtering**: Excludes metadata schema objects from business logic graphs
- **SQL Parsing**: Intelligent parsing of stored procedure definitions to detect table dependencies

### Technical Highlights
- **Clean Architecture**: Separation of concerns with service layers and dependency injection
- **Performance Optimized**: Parallel queries and connection pooling
- **Production Ready**: Graceful shutdown, error handling, and health checks
- **Auto-Documentation**: Self-documenting API endpoints
- **Extensible**: Modular design for easy feature additions

## Architecture

### Design Patterns
- **Service Layer Pattern**: Business logic separated from HTTP concerns
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Loose coupling between components
- **Singleton Pattern**: Database connection management

### Data Flow
```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Procedures    │───▶│    Tables    │───▶│     Views       │
│   (Sources)     │    │  (Storage)   │    │ (Aggregation)   │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foo-database-connector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL database**
   ```bash
   # Start PostgreSQL service
   brew services start postgresql
   
   # Create database
   createdb foo_database
   
   # Initialize with sample data
   node init-postgres.js
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:3000/health
   ```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Auto-documented API overview |
| `/health` | GET | Health check and service status |
| `/api/metadata/tables` | GET | Retrieve all database tables |
| `/api/metadata/views` | GET | Retrieve all database views |
| `/api/metadata/procedures` | GET | Retrieve all stored procedures |
| `/api/graph` | GET | **Generate complete data lineage graph** |

### Example Requests

#### Get Data Lineage Graph
```bash
curl http://localhost:3000/api/graph
```

**Response Structure:**
```json
{
  "success": true,
  "graph": {
    "nodes": [
      {
        "id": "table_humanresources_employees",
        "type": "TABLE",
        "name": "employees",
        "schema": "humanresources",
        "fullyQualifiedName": "humanresources.employees"
      }
    ],
    "edges": [
      {
        "id": "edge_procedure_createEmployee_to_table_humanresources_employees",
        "sourceId": "procedure_createEmployee",
        "targetId": "table_humanresources_employees",
        "type": "PROCEDURE_TO_TABLE",
        "relationshipType": "INSERTS_INTO"
      }
    ]
  },
  "statistics": {
    "totalNodes": 7,
    "totalEdges": 6,
    "nodesByType": {
      "tables": 3,
      "views": 1,
      "procedures": 3
    }
  }
}
```

#### Get Metadata Tables
```bash
curl http://localhost:3000/api/metadata/tables
```

## Data Model

### Node Types
- **TABLE**: Database tables (storage entities)
- **VIEW**: Database views (aggregation entities)  
- **PROCEDURE**: Stored procedures (operation entities)

### Edge Types
- **`PROCEDURE_TO_TABLE`**: Procedure modifies table (INSERT/UPDATE/DELETE)
- **`TABLE_TO_VIEW`**: Table feeds data into view (SELECT)

### Sample Graph
```
createEmployee ──┐
createRole ─────┼──→ Tables ──┐
createSalary ───┘             └──→ employee_view
```

## Development

### Running in Development Mode
```bash
npm run dev  # Uses nodemon for auto-reload
```

### Testing Individual Components
```bash
# Test database connection
node -e "require('./src/config/database').connectToDatabase().then(() => console.log('✅ Connected'))"

# Test metadata service  
node -e "require('./src/config/database').connectToDatabase().then(() => require('./src/services/metadata-service').getAllTables().then(t => console.log('✅', t.length, 'tables')))"
```

### Environment Variables
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foo_database
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Project Structure

```
src/
├── config/
│   └── database.js           # PostgreSQL connection & pooling
├── services/
│   ├── metadata-service.js   # Database queries & business logic
│   └── graph-service.js      # Graph construction & algorithms
├── utils/
│   └── sql-parser.js         # SQL parsing utilities
└── app.js                    # Express app configuration

server.js                     # Server startup & graceful shutdown
init-postgres.js              # Database initialization script
```

### Key Design Decisions

#### Modular Architecture
- **Why**: Separation of concerns, testability, maintainability
- **Result**: Each module has single responsibility

#### Service Layer Pattern  
- **Why**: Business logic independent of HTTP layer
- **Result**: Reusable services, easier testing

#### SQL Parsing Strategy
- **Why**: Extract table dependencies from procedure definitions
- **Result**: Automated edge detection without manual mapping

## Technical Specifications

### Performance Features
- **Connection Pooling**: Efficient PostgreSQL connection management
- **Parallel Queries**: Concurrent metadata extraction
- **Lazy Loading**: Services instantiated on-demand

### Security Features
- **Input Validation**: SQL injection protection
- **Schema Filtering**: Prevents exposure of system metadata
- **Graceful Shutdown**: Clean resource cleanup

### Monitoring & Observability
- **Health Checks**: Service status verification
- **Structured Logging**: Request/response tracking
- **Error Handling**: Centralized error management

---

## About

**Built by Sebas Hernandez**

This project demonstrates:
- **Clean Architecture** principles
- **Performance optimization** techniques  
- **Production-ready** patterns
- **Data modeling** expertise
- **Modern Node.js** development

Perfect for enterprise data discovery and lineage analysis. 
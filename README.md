# Inventory Application

A full-stack plywood inventory management system built with React, Node.js, Express, MongoDB, and Docker.

## Features

- Add, update, and delete plywood items
- Inventory table with low stock highlighting
- Download daily inventory report as Excel (.xlsx)
- Backend REST API using MongoDB and Mongoose
- Dockerized frontend, backend, and MongoDB services

## Run with Docker

From the project root:

```powershell
npm run docker:up
```

Then open the frontend at `http://localhost:3000`.

## Services

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## API Endpoints

- `GET /items`
- `POST /items`
- `PUT /items/:id`
- `DELETE /items/:id`

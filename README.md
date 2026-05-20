# Project Name

An Express API utilizing MongoDB and Redis, orchestrated with Docker Compose.

---

## Prerequisites

Before running this project, ensure you have the following installed:
* **Docker Desktop** (includes Docker Compose)

## Getting Started

### 1. Start the Docker Containers

Run the following command in your terminal to download the necessary images and spin up the MongoDB, Redis, and application containers:

```bash
docker compose up
```
### 2. Verify MongoDB Connection
```http
GET http://localhost:3000/mongo
```

### Response

```json
{
  "mongo": "DB Connected",
  "database": "redis_mongo_db"
}
```

---

### 3. Verify Redis Connection
```http
GET http://localhost:3000/redis
```

### Response

```json
{
  "redis": "PONG"
}
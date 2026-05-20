# Project Name

An Express API utilizing MongoDB and Redis, orchestrated with Docker Compose.

---

## Prerequisites

Before running this project, ensure you have the following installed:

- **Docker Desktop** (includes Docker Compose)

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
```

---

---

## Banner APIs - Create / Update Banner

Stores a banner message in Redis.

### Request

```http
POST http://localhost:3000/banner
```

### Request Body

```json
{
  "message": "Welcome to Redis Banner API"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Banner updated successfully"
}
```

### Error Response

```json
{
  "error": "Banner message is required"
}
```

---

## Get Banner

Fetches the current banner message from Redis.

### Request

```http
GET http://localhost:3000/banner
```

### Success Response

```json
{
  "success": true,
  "banner": "Welcome to Redis Banner API"
}
```

### Error Response

```json
{
  "error": "No banner message found"
}
```

---

## Delete Banner

Deletes the banner message from Redis.

### Request

```http
DELETE http://localhost:3000/banner
```

### Success Response

```json
{
  "success": true,
  "message": "Banner deleted successfully"
}
```

---

## Check Banner Existence

Checks whether a banner message exists in Redis.

### Request

```http
GET http://localhost:3000/banner/exists
```

### Success Response

```json
{
  "success": true,
  "exists": 1
}
```

> Note: Redis returns `1` if the key exists and `0` if it does not exist.

---

---

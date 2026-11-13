# User Management REST API (Week 1 Project)

A complete RESTful API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** for managing user records. This project demonstrates full CRUD operations, schema validation, bulk creation, and server-side pagination.

---

## Table of Contents

- [Features](#features)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Run the Server](#4-run-the-server)
- [User Data Model & Validation](#user-data-model--validation)
- [API Endpoints Quick Reference](#api-endpoints-quick-reference)
- [Detailed API Documentation & Sample Responses](#detailed-api-documentation--sample-responses)
  - [1. Health Check](#1-health-check)
  - [2. Create a User](#2-create-a-user)
  - [3. Create Multiple Users (Bulk)](#3-create-multiple-users-bulk)
  - [4. Get All Users (Paginated)](#4-get-all-users-paginated)
  - [5. Get User by ID](#5-get-user-by-id)
  - [6. Update User by ID](#6-update-user-by-id)
  - [7. Delete User by ID](#7-delete-user-by-id)
- [Testing the API](#testing-the-api)
  - [Option A: Using Postman / Thunder Client](#option-a-using-postman--thunder-client)
  - [Option B: Using cURL (Command Line)](#option-b-using-curl-command-line)
  - [Recommended Step-by-Step Test Workflow](#recommended-step-by-step-test-workflow)
- [HTTP Status Codes Reference](#http-status-codes-reference)

---

## Features

- **Full CRUD Operations**: Create, read, update, and delete user profiles.
- **Bulk Creation**: Insert multiple user records simultaneously with `POST /api/users/bulk`.
- **Server-Side Pagination**: Browse users in chunks of 5 per page with metadata (`currentPage`, `totalPages`, `totalUsers`, `usersPerPage`).
- **Mongoose Data Validation**:
  - Enforced fields: `name`, `email`, and `age`.
  - Unique email constraints to prevent duplicate registrations.
  - Minimum age validation (must be at least 18 years old).
- **Automated Timestamps**: Tracks `createdAt` and `updatedAt` for all records.
- **Robust Error Handling**: Catches validation errors, invalid MongoDB ObjectIds (`CastError`), and duplicate key conflicts (`11000`).

---

## Project Architecture

```text
week1_project/
├── config/
│   └── db.js            # MongoDB connection setup using Mongoose
├── models/
│   └── userModel.js     # User schema definition and validation rules
├── routes/
│   └── userRoutes.js    # Express route handlers for User endpoints
├── .env                 # Environment variables (private, git-ignored)
├── .env.example         # Template for environment configuration
├── .gitignore           # Git ignore rules (node_modules, .env)
├── package.json         # Project metadata and dependencies
└── server.js            # Application entry point and server initialization
```

---

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js](https://expressjs.com/) (v5.x)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (v9.x)
- **Environment Management**: [dotenv](https://github.com/motdotla/dotenv)
- **Development Tool**: [nodemon](https://nodemon.io/)

---

## Prerequisites

Before running this project, ensure you have:
1. **Node.js** (v18.0.0 or higher) and **npm** installed.
2. A **MongoDB** database instance (either local MongoDB or a free [MongoDB Atlas](https://www.mongodb.com/atlas/database) cloud cluster).
3. An API client such as **Postman**, **Thunder Client** (VS Code extension), **Insomnia**, or **cURL**.

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository_url>
cd week1_project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory by copying the `.env.example` template:

```bash
cp .env.example .env
```

Open `.env` and fill in your connection details:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/user_crud_app?retryWrites=true&w=majority
```

> **Note**: Replace `<username>`, `<password>`, and host with your actual MongoDB credentials.

### 4. Run the Server

- **Development Mode** (with automatic reload via nodemon):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

Once started, the console should output:
```text
Server running on port 5000
MongoDB connected successfully!
```

---

## User Data Model & Validation

The Mongoose model (`models/userModel.js`) enforces the following structure:

| Field | Type | Required | Constraints / Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | Yes | Non-empty | Full name of the user |
| `email` | `String` | Yes | Unique index | Valid, unique email address |
| `age` | `Number` | Yes | Minimum: `18` | User age (must be $\ge 18$) |
| `createdAt` | `Date` | Auto | Managed by Mongoose | Timestamp when created |
| `updatedAt` | `Date` | Auto | Managed by Mongoose | Timestamp when last updated |

---

## API Endpoints Quick Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check / verification |
| `POST` | `/api/users` | Create a single user |
| `POST` | `/api/users/bulk` | Create multiple users in bulk |
| `GET` | `/api/users` | Get paginated users (5 per page, default `?page=1`) |
| `GET` | `/api/users/:id` | Get a specific user by MongoDB `_id` |
| `PUT` | `/api/users/:id` | Update a user by MongoDB `_id` |
| `DELETE` | `/api/users/bulk` | Delete multiple users by MongoDB `_id` |
| `DELETE` | `/api/users/:id` | Delete a user by MongoDB `_id` |

---

## Detailed API Documentation & Sample Responses

### 1. Health Check
Verifies that the server is up and listening.

- **Method**: `GET`
- **URL**: `/`
- **Request Headers**: *None required*

#### Expected Response
- **Status**: `200 OK`
```json
{
  "success": true,
  "message": "Express API is running!"
}
```

---

### 2. Create a User
Creates a new user record in the database.

- **Method**: `POST`
- **URL**: `/api/users`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "age": 24
}
```

#### Expected Responses
- **Status**: `201 Created` (Success)
```json
{
  "success": true,
  "data": {
    "_id": "6734c2b9a1d2e3f456789012",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "age": 24,
    "createdAt": "2026-11-13T16:20:00.000Z",
    "updatedAt": "2026-11-13T16:20:00.000Z",
    "__v": 0
  }
}
```

- **Status**: `400 Bad Request` (Age below 18)
```json
{
  "success": false,
  "message": "User validation failed: age: User must be at least 18 years old"
}
```

- **Status**: `400 Bad Request` (Duplicate email address)
```json
{
  "success": false,
  "message": "E11000 duplicate key error collection: user_crud_app.users index: email_1 dup key: { email: \"jane.doe@example.com\" }"
}
```

---

### 3. Create Multiple Users (Bulk)
Creates multiple user documents in a single request.

- **Method**: `POST`
- **URL**: `/api/users/bulk`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
[
  {
    "name": "Alice Smith",
    "email": "alice.smith@example.com",
    "age": 22
  },
  {
    "name": "Bob Johnson",
    "email": "bob.johnson@example.com",
    "age": 31
  }
]
```

#### Expected Responses
- **Status**: `201 Created` (Success)
```json
{
  "success": true,
  "message": "2 users created successfully",
  "data": [
    {
      "_id": "6734c311a1d2e3f456789013",
      "name": "Alice Smith",
      "email": "alice.smith@example.com",
      "age": 22,
      "createdAt": "2026-11-13T16:22:00.000Z",
      "updatedAt": "2026-11-13T16:22:00.000Z",
      "__v": 0
    },
    {
      "_id": "6734c311a1d2e3f456789014",
      "name": "Bob Johnson",
      "email": "bob.johnson@example.com",
      "age": 31,
      "createdAt": "2026-11-13T16:22:00.000Z",
      "updatedAt": "2026-11-13T16:22:00.000Z",
      "__v": 0
    }
  ]
}
```

- **Status**: `400 Bad Request` (Validation error in one or more records)
```json
{
  "success": false,
  "message": "User validation failed: age: User must be at least 18 years old"
}
```

---

### 4. Get All Users (Paginated)
Retrieves a paginated list of users. The endpoint returns 5 users per page by default.

- **Method**: `GET`
- **URL**: `/api/users` or `/api/users?page=1`
- **Query Parameters**:
  - `page` *(optional, integer)*: Target page number (default: `1`).

#### Expected Response
- **Status**: `200 OK`
```json
{
  "success": true,
  "currentPage": 1,
  "totalPages": 3,
  "totalUsers": 12,
  "usersPerPage": 5,
  "data": [
    {
      "_id": "6734c2b9a1d2e3f456789012",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "age": 24,
      "createdAt": "2026-11-13T16:20:00.000Z",
      "updatedAt": "2026-11-13T16:20:00.000Z",
      "__v": 0
    },
    {
      "_id": "6734c311a1d2e3f456789013",
      "name": "Alice Smith",
      "email": "alice.smith@example.com",
      "age": 22,
      "createdAt": "2026-11-13T16:22:00.000Z",
      "updatedAt": "2026-11-13T16:22:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### 5. Get User by ID
Retrieves details of a single user by their MongoDB `_id`.

- **Method**: `GET`
- **URL**: `/api/users/:id`
- **Path Parameter**:
  - `id`: The 24-character hexadecimal MongoDB `_id`.

#### Expected Responses
- **Status**: `200 OK` (User Found)
```json
{
  "success": true,
  "data": {
    "_id": "6734c2b9a1d2e3f456789012",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "age": 24,
    "createdAt": "2026-11-13T16:20:00.000Z",
    "updatedAt": "2026-11-13T16:20:00.000Z",
    "__v": 0
  }
}
```

- **Status**: `404 Not Found` (Valid ObjectId format, but does not exist)
```json
{
  "success": false,
  "message": "User not found"
}
```

- **Status**: `400 Bad Request` (Malformed / Invalid ObjectId format)
```json
{
  "success": false,
  "message": "Cast to ObjectId failed for value \"invalid_id_123\" (type string) at path \"_id\" for model \"User\""
}
```

---

### 6. Update User by ID
Updates one or more fields of an existing user. Runs model validators on update.

- **Method**: `PUT`
- **URL**: `/api/users/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Jane Updated",
  "age": 25
}
```

#### Expected Responses
- **Status**: `200 OK` (User Updated)
```json
{
  "success": true,
  "data": {
    "_id": "6734c2b9a1d2e3f456789012",
    "name": "Jane Updated",
    "email": "jane.doe@example.com",
    "age": 25,
    "createdAt": "2026-11-13T16:20:00.000Z",
    "updatedAt": "2026-11-13T16:25:00.000Z",
    "__v": 0
  }
}
```

- **Status**: `404 Not Found`
```json
{
  "success": false,
  "message": "User not found"
}
```

- **Status**: `400 Bad Request` (Validation error, e.g. age < 18 or duplicate email)
```json
{
  "success": false,
  "message": "Validation failed: age: User must be at least 18 years old"
}
```

---

### 7. Delete User by ID
Removes a user record by MongoDB `_id`.

- **Method**: `DELETE`
- **URL**: `/api/users/:id`

#### Expected Responses
- **Status**: `200 OK` (User Deleted)
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "_id": "6734c2b9a1d2e3f456789012",
    "name": "Jane Updated",
    "email": "jane.doe@example.com",
    "age": 25,
    "createdAt": "2026-11-13T16:20:00.000Z",
    "updatedAt": "2026-11-13T16:25:00.000Z",
    "__v": 0
  }
}
```

- **Status**: `404 Not Found`
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 8. Delete Multiple Users
Removes users whose MongoDB `_id` values are included in the request body.

- **Method**: `DELETE`
- **URL**: `/api/users/bulk`
- **Body**:
```json
{
  "ids": ["6734c2b9a1d2e3f456789012", "6734c2b9a1d2e3f456789013"]
}
```

The response includes `deletedCount`, the number of matching users removed. An empty list or invalid ID returns `400 Bad Request`.

---

## Testing the API

### Option A: Using Postman / Thunder Client

1. Open your API client (Postman or VS Code Thunder Client).
2. For `POST` and `PUT` requests:
   - Switch method to `POST` or `PUT`.
   - Add Header: `Content-Type: application/json`.
   - Under the **Body** tab, choose **raw** and select **JSON**.
   - Paste the sample request bodies provided above.
3. For `GET` and `DELETE` requests:
   - Set the appropriate HTTP method.
   - Provide the URL with query string or ID parameter.

---

### Option B: Using cURL (Command Line)

#### 1. Server Health Check
```bash
curl -X GET http://localhost:5000/
```

#### 2. Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Michael Mireku", "email": "michael@example.com", "age": 23}'
```
*Windows PowerShell equivalent:*
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/users" -Method Post -ContentType "application/json" -Body '{"name":"Michael Mireku","email":"michael@example.com","age":23}'
```

#### 3. Create Users in Bulk
```bash
curl -X POST http://localhost:5000/api/users/bulk \
  -H "Content-Type: application/json" \
  -d '[
    {"name": "Sarah Connor", "email": "sarah@example.com", "age": 29},
    {"name": "John Connor", "email": "johnc@example.com", "age": 19}
  ]'
```

#### 4. Get All Users (Page 1)
```bash
curl -X GET "http://localhost:5000/api/users?page=1"
```

#### 5. Get User by ID
```bash
curl -X GET http://localhost:5000/api/users/<USER_ID>
```

#### 6. Update User by ID
```bash
curl -X PUT http://localhost:5000/api/users/<USER_ID> \
  -H "Content-Type: application/json" \
  -d '{"name": "Michael M.", "age": 24}'
```

#### 7. Delete User by ID
```bash
curl -X DELETE http://localhost:5000/api/users/<USER_ID>
```

#### 8. Delete Multiple Users
```bash
curl -X DELETE http://localhost:5000/api/users/bulk \
  -H "Content-Type: application/json" \
  -d '{"ids": ["<USER_ID_1>", "<USER_ID_2>"]}'
```

---

### Recommended Step-by-Step Test Workflow

To test all functionality in sequence:

1. **Verify Server**: Send `GET /` and ensure you receive `{"success": true, "message": "Express API is running!"}`.
2. **Add Single User**: Send `POST /api/users` with valid user data. Copy the returned `_id`.
3. **Test Validation Rules**:
   - Send `POST /api/users` with an `age` of `17`. Observe the `400 Bad Request` response.
   - Send `POST /api/users` with the same `email`. Observe the duplicate key `400 Bad Request` response.
4. **Add Multiple Users**: Send `POST /api/users/bulk` with an array of user objects.
5. **View Pagination**: Send `GET /api/users?page=1` and `GET /api/users?page=2` to observe the 5-item limit and pagination fields.
6. **Fetch by ID**: Send `GET /api/users/<_id>` using the copied `_id`.
7. **Update User**: Send `PUT /api/users/<_id>` with updated fields.
8. **Delete User**: Send `DELETE /api/users/<_id>`. Verify deletion.
9. **Confirm Deletion**: Send `GET /api/users/<_id>` with the deleted `_id` to confirm it returns `404 Not Found`.

---

## HTTP Status Codes Reference

| Status Code | Meaning | When It's Returned |
| :--- | :--- | :--- |
| **`200 OK`** | Success | Returned for successful `GET`, `PUT`, and `DELETE` requests. |
| **`201 Created`** | Resource Created | Returned for successful `POST /api/users` and `POST /api/users/bulk`. |
| **`400 Bad Request`** | Client Error | Returned when validation fails (e.g. missing field, age $< 18$), duplicate email exists, or an invalid MongoDB ID format is provided. |
| **`404 Not Found`** | Resource Not Found | Returned when a requested user `_id` does not exist in the database. |
| **`500 Internal Error`** | Server Error | Returned when an unexpected database or server failure occurs. |

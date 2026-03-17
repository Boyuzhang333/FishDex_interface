# FishDex Backend API (MVP)

Simple Node.js + Express backend for a mobile app called **FishDex**.

This is an MVP implementation using **JSON file storage** (no database setup required).

## Folder Structure

```bash
FishDex_interface/
├── data/
│   ├── catches.json
│   └── users.json
├── src/
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── catches.js
│   │   └── identify.js
│   ├── services/
│   │   └── storage.js
│   └── server.js
├── package.json
└── README.md
```

## Features

1. Authentication
- `POST /register`
- `POST /login`

2. Fish recognition (mock)
- `POST /identify`
- Input: image (form-data key: `image`)
- Output: random `fish_name`

3. Catch records
- `POST /catches` (create catch)
- `GET /catches` (get user catches)
- `PUT /catches/:id` (update catch)

Catch fields:
- `image_url`
- `fish_type`
- `date`
- `location` (`lat`, `lng`)
- `size`
- `weather`
- `note`
- `privacy_level`

## How to Run (Step-by-Step)

1. Install dependencies:

```bash
npm install
```

2. Start server:

```bash
npm start
```

3. API will run at:

```text
http://localhost:3000
```

## API Examples

### 1) Register

`POST /register`

```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "Fish User"
}
```

### 2) Login

`POST /login`

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### 3) Identify Fish (mock)

`POST /identify`
- Header: `Authorization: Bearer <token>`
- Body: `form-data` with file key `image`

### 4) Create Catch

`POST /catches`
- Header: `Authorization: Bearer <token>`

```json
{
  "image_url": "https://example.com/fish.jpg",
  "fish_type": "Salmon",
  "date": "2026-01-01",
  "location": { "lat": 40.71, "lng": -74.0 },
  "size": "45 cm",
  "weather": "Sunny",
  "note": "Caught near the rocks",
  "privacy_level": "friends"
}
```

### 5) Get Catches

`GET /catches`
- Header: `Authorization: Bearer <token>`

### 6) Update Catch

`PUT /catches/:id`
- Header: `Authorization: Bearer <token>`
- Body: any catch fields to update

## Notes

- Storage is persisted in `data/users.json` and `data/catches.json`.
- For production, switch to MongoDB and secure secrets through environment variables.

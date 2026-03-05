# YojanaSathi (MERN)

## Project Structure

```text
yojanasathi/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.mjs
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── .env
└── README.md
```

## Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend API base: `https://yojanasathi.onrender.com/api`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend env includes:

```env
VITE_API_BASE_URL=https://yojanasathi.onrender.com
```

## API Routes (Current)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users`
- `DELETE /api/users/:id`
- `PATCH /api/users/ban/:id`
- `GET /api/schemes`
- `GET /api/quiz`

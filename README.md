# Movie Backend (NestJS)

Small backend for the Movie Search & Favorites app.  
It proxies OMDb searches and manages favorites (persisted to a local JSON file).

## Features
- `GET /movies?query=<q>&page=<n>` — search OMDb (10 results per page).
- `GET /favorites` — list favorites (persisted in `data/favorites.json`).
- `POST /favorites` — add favorite by `{ "imdbID": "<id>" }`.
- `DELETE /favorites/:imdbID` — remove favorite.
- Simple local JSON persistence (no DB required).
- Input validation (class-validator), basic error handling, unit test skeletons.

---

## Tech choices
- **NestJS** — structured, DI, scalable.
- **Axios** — HTTP client for OMDb.
- **class-validator / class-transformer** — DTO validation.
- **Local JSON file** persistence — quick and low friction for prototyping.

---

## Setup (local)
1. Clone / create project and enter folder:
```bash
cd movie-backend
```

2. Copy example env and set OMDb API key:
```bash
cp .env.example .env
# Edit .env and set OMDB_API_KEY (required)
```

3. Install dependencies:
```bash
npm install
```

> If you hit `ETARGET` for `class-validator@^0.15.0`, install a known version and re-run:
> ```bash
> npm install class-validator@0.14.0
> npm install
> ```

4. Start in development:
```bash
npm run start:dev
```

5. Build & start (production):
```bash
npm run build
npm start
```

---

## API (examples)
- Search:
```bash
curl "http://localhost:3000/movies?query=batman&page=1"
```

- List favorites:
```bash
curl "http://localhost:3000/favorites"
```

- Add favorite:
```bash
curl -X POST http://localhost:3000/favorites \
  -H "Content-Type: application/json" \
  -d '{"imdbID":"tt0372784"}'
```

- Remove favorite:
```bash
curl -X DELETE http://localhost:3000/favorites/tt0372784
```

---

## Files & structure (important bits)
- `src/movies/` — search controller + service.
- `src/favorites/` — favorites controller + service (uses `data/favorites.json`).
- `src/common/http-client.service.ts` — axios wrapper for OMDb (uses `OMDB_API_KEY`).
- `data/favorites.json` — created at runtime; contains favorite movies.

---

## Testing
Run unit tests (Jest):
```bash
npm test
```
There are starter tests in `test/` you can expand.

---

## Troubleshooting (common)
- `ETARGET No matching version found for class-validator@^0.15.0` → pin to a released version:
  ```bash
  npm install class-validator@0.14.0
  npm install
  ```
- `Cannot find module '@nestjs/testing'` → install the test helper:
  ```bash
  npm install -D @nestjs/testing@<your-nest-major> jest ts-jest @types/jest
  ```
- If `data/favorites.json` not created, the service will create it on first write — check file permissions.

---

## Next steps / improvements
- Replace JSON persistence with **SQLite + Prisma**.
- Add authentication (favorites per user).
- Add caching layer (Redis) for heavy OMDb usage.
- Add more tests (integration with `supertest`).

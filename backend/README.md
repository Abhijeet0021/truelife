# True Life Foundation — Backend API

Node.js + Express + MongoDB backend for the True Life Foundation website. Handles
contact messages, volunteer applications, donations (via Razorpay), and a
JWT-protected admin dashboard API.

## Requirements

- Node.js 18+
- A MongoDB database — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Razorpay](https://razorpay.com) account (only needed for live donations)

## Setup

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values
```

Edit `.env`:

- `MONGODB_URI` — your local or Atlas connection string
- `JWT_SECRET` — a long random string (generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from the Razorpay dashboard (optional until you launch donations)
- `CLIENT_ORIGIN` — your frontend URL(s), comma-separated

## Run

```bash
npm run dev      # auto-restarts on changes
npm start        # production
```

Server starts on `http://localhost:5001`.

## Create an admin login

```bash
node src/scripts/createAdmin.js admin@truelife.org "YourPassword" "Abhijeet Kumar"
```

## API endpoints

### Public
| Method | Path | Purpose |
|--------|------|---------|
| GET  | `/api/health` | Health check |
| POST | `/api/contact` | Submit a contact message |
| POST | `/api/volunteers` | Submit a volunteer application |
| GET  | `/api/donations/config` | Whether payments are enabled + public key |
| POST | `/api/donations/order` | Create a Razorpay order |
| POST | `/api/donations/verify` | Verify a completed payment |

### Admin (require `Authorization: Bearer <token>`)
| Method | Path | Purpose |
|--------|------|---------|
| POST  | `/api/admin/login` | Get a JWT |
| GET   | `/api/admin/stats` | Dashboard summary counts |
| GET   | `/api/admin/contacts` | List contact messages (paginated) |
| GET   | `/api/admin/volunteers` | List applications (`?status=` filter) |
| PATCH | `/api/admin/volunteers/:id` | Update an application's status |
| GET   | `/api/admin/donations` | List donations |

Pagination: `?page=1&limit=25`.

## Frontend connection

The React app reads the API base URL from `VITE_API_URL` (see
`../frontend/.env.example`). Set it to `http://localhost:5001/api` for local dev.

## Notes

- Public write endpoints are rate-limited (30 requests / 15 min per IP).
- Email notifications on new submissions are optional — set the `SMTP_*` vars
  and run `npm install nodemailer` to enable them.

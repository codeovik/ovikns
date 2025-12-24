ovikn is a full stack custom dropship website, where user can buy various dropship product by online with payonner payment gateway. Also ovikns provide admin panel for manage product, order, user and more.

## To run this website locally
```bash
# Clone the repository
git clone https://github.com/codeovik/ovikns.git

# Change into the project directory
cd ovikns

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables
# Create a .env file in both the backend and frontend directories
# and add the necessary environment variables (see below for details)

# Run the backend server
cd ../backend
node app.js

# Run the frontend development server
cd ../frontend
npm run dev
```

## Environment Variables
This project requires the following environment variables to be set:

### Frontend (`frontend/.env`)
### Backend (`backend/.env`)

```env
VITE_BACKEND_DOMAIN="http://localhost:5000"
```

```env
# basic setup
PORT=3000
MONGO_URI=
NODE_ENV="development"
FRONT_END_DOMAIN=http://localhost:5173

# google auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

# auth
JWT_SECRET=secret
ADMIN_PASSWORD=secret
ADMIN_JWT_SECRET=secret

# cludinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# stripe
STRIPE_API_KEY=
STRIPE_SECRET_KEY=
```

Make sure to add on these on 3rd party APIs

Google authorized JavaScript origins:
```
http://localhost:5173
```

Google authorized redirect URIs:
```
http://localhost:3000/api/v1/auth/google/callback
```

Stripe webhook URL (only hosted domain)
```
https://ovikns-backend.vercel.app/api/v1/webhook
```
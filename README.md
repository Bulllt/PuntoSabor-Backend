# Punto Sabor Backend

Backend API for Punto Sabor - A restaurant and dish discovery platform.

## Problem Statement

People don't know which restaurants in the city contain the food they are looking for.

## Solution

Enter the name of a dish (lasagna, meat, etc.) and the app will return a list of restaurants that contain that dish, along with prices, reviews, and more information.

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: Firebase Firestore
- **Environment**: Dotenv for configuration

## Project Structure

```
puntosabor-backend/
├── controllers/
│   ├── restaurantController.js
│   ├── dishController.js
│   └── reviewController.js
├── database/
│   ├── models/
│   │   ├── Restaurant.js
│   │   ├── Dish.js
│   │   └── Review.js
│   └── firebase.js
├── middlewares/
│   ├── validation.js
│   └── errorHandler.js
├── routes/
│   ├── restaurants.js
│   ├── dishes.js
│   ├── reviews.js
│   └── index.js
├── .env
├── index.js
├── package.json
└── README.md
```

## Database Structure

### Firestore Collections

```
restaurants/{restaurantId}
├── name: string
├── address: string
├── coordinates: geopoint
├── rating: number
└── dishes: subcollection
    └── {dishId}
        ├── name: string
        ├── description: string
        ├── price: number
        ├── category: string
        └── reviews: subcollection
            └── {reviewId}
                ├── userId: string
                ├── rating: number
                ├── comment: string
                └── timestamp: timestamp
```

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Bulllt/PuntoSabor-Backend.git
   cd PuntoSabor-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Firebase Setup**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Create a service account:
     - Go to Project Settings > Service Accounts
     - Generate new private key
     - Download the JSON file

4. **Environment Configuration**

   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration from the service account JSON:

   ```env
   PORT=3000
   NODE_ENV=development
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-client-email%40your-project.iam.gserviceaccount.com
   API_VERSION=v1
   ```

5. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

### Core Endpoints

#### Health Check

- `GET /health` - API health status

#### Restaurants

- `GET /restaurants` - Get all restaurants
- `GET /restaurants/:id` - Get restaurant by ID
- `POST /restaurants` - Create new restaurant
- `PUT /restaurants/:id` - Update restaurant
- `DELETE /restaurants/:id` - Delete restaurant
- `GET /restaurants/search?q=NAME` - Search restaurants by name
- `GET /restaurants/search/dish?dish=DISH_NAME` - Find restaurants by dish

#### Dishes

- `GET /restaurants/:restaurantId/dishes` - Get dishes from restaurant
- `GET /restaurants/:restaurantId/dishes/:dishId` - Get specific dish
- `POST /restaurants/:restaurantId/dishes` - Create new dish
- `PUT /restaurants/:restaurantId/dishes/:dishId` - Update dish
- `DELETE /restaurants/:restaurantId/dishes/:dishId` - Delete dish
- `GET /restaurants/:restaurantId/dishes/search?q=NAME` - Search dishes in restaurant
- `GET /restaurants/:restaurantId/dishes/category/:category` - Get dishes by category

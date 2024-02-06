# URL Shortener API

This repository contains the backend implementation of a URL shortener application, created using Express.js. The API provides functionality to shorten long URLs, making them more manageable and shareable.

## API Endpoints
* `POST /api/shorten`: Shorten a long URL.
* `GET /api/redirect/:key`: Returns the long URL that corresponds with the given key if exists.

## Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/joshuagatizz/url-shortener-api.git
   ```
2. **Install dependencies**
    ```bash
   cd url-shortener-api
   npm install
    ```
3. **Set up the environment variables**
    
    Create a `.env` file as follows.
    ```plain
    PORT=8080
    MONGO_URI="your-mongo-connection-string"
    MONGO_DB_NAME="your-database-name"
    MONGO_COLLECTION_NAME="your-colection-name"
   ```
4. **Run the app**
    ```bash
   npm run start
   ```

The API server will be running on http://localhost:8080.

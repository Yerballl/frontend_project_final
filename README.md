# CoinKeeper - Personal Finance Manager

**CoinKeeper** is a full—featured web-based personal finance management application developed as an analog of the popular CoinKeeper service. It allows users to track their income and expenses, manage accounts and categories, and analyze their financial activity using visual charts.

The project consists of two main parts:
1. **Backend**: REST API on Node.js and Express, which uses JSON files as data storage.
2.  **Frontend (CoinKeeper)**: A single-page SPA application on React using Redux for state management and Tailwind CSS for styling.

## Key features

### User Management:
* **Registration and Authentication**: Secure registration of new users and login using JWT (JSON Web Tokens).
* **Profile Management**: Users can view and update their profile information (name, email).
* **Password change**: The ability to change the account password.
* **Account Deletion**: Users can delete their account.

### Financial accounting:
* **Account Management**:
* Creation, reading, updating and deletion (CRUD) of bank accounts, wallets, etc.
    * Specify the initial balance, icons and colors for each account.
    * Automatic calculation of the current account balance based on transactions.
* **Category Management**:
* CRUD operations for income and expense categories.
    * Customize icons and colors for each category.
    * View the total turnover by category.
* **Transaction Management**:
    * Adding, reading, updating and deleting transactions (income/expenses).
    * Linking transactions to an account and category.
    * Specify the amount, date, and comment.
    *   Filtering transactions by account, category, type (income/expense) and date.
    * Pagination for the transaction list.

### Analytics and mapping:
* **Total Balance**: Displays the user's total balance across all accounts.
* **Statistics**:
    *   Visualization of income and expenses by category using pie charts.
    * Comparative bar chart of income and expenses by category.
    *   Filtering data on the statistics page by date and category.
* **Currency Conversion**: Displays balances and transactions in a user-selected currency (KZT, RUB, USD, EUR) using predefined exchange rates.

### Settings:
* **Application Settings**: Select the primary currency to display.
* **Help**: Help section (currently under development).

## Technology

### Backend:
*   **Node.js**
* **Express.js**: Web framework
* **JSON Files**: As a simple data store (`fs` module)
* **jsonwebtoken**: For JWT-based authentication
* **cors**: For processing CORS requests
* **nodemon**: For convenient development

### Frontend (CoinKeeper):
* **React**: Library for building user interfaces
* **Redux Toolkit**: For managing the application state
* **React Router DOM**: For routing
* **Axios**: For HTTP API requests
* **Tailwind CSS**: A utilitarian CSS framework for styling
*   **Chart.js & react-chartjs-2**: For displaying charts
* **Vite**: A build and development tool
* **ESLint**: For static code analysis

## Project structure

* `./`: The root directory of the project.
    *   `get_project_code.bat`, `CollectCode.ps1`: Scripts for assembling all the code into a single file.
    *   `package.json`: Dependencies for Chart.js (perhaps for generating reports or the general part).
    * `README.md `: This file.
* `backend/`: Contains the server part of the application.
    * `server.js `: The main server file Express.js .
    * `*.json`: Files used as a database (accounts.json, categories.json, transactions.json, users.json).
    *   `package.json`: Dependencies and scripts for the backend.
* `CoinKeeper/`: Contains the client part of the application (React).
    * `public/`: Static assets.
    * `src/`: The source code of the React application.
        * `components/`: Reusable UI components (for accounts, categories, transactions, layout, etc.).
        * `pages/`: Page components (Dashboard, Login, Stats, Settings, etc.).
        * `redux/`: Redux logic (store, slices for auth, transactions, categories, etc.).
        * `services/`: API client (api.js ).
        * `App.jsx`: The root component of the routing application.
        * `main.jsx`: The entry point of the React application.
        * `index.html `: The main HTML file.
    *   `package.json`: Dependencies and scripts for frontend.
    *   `vite.config.js`, `tailwind.config.js`, `eslint.config.js`: Configuration files.

## Project launch

### Backend:
1. Go to the 'backend` directory.
2. Install the dependencies: `npm install`
3. Start the server:
    * For development with automatic restart: `npm run dev`
    * For production: `npm start`
    The default server will be running on `http://localhost:8080 `.

### Frontend (CoinKeeper):
1. Go to the `CoinKeeper` directory.
2. Install the dependencies: `npm install`
3. Launch the development application: `npm run dev`
    The app will be available on `http://localhost:5173 ` (or another port specified by Vite).

## API Endpoints (Basic)

All endpoints start with `/api`. Authentication (Bearer Token) is required, except for `/users/register` and `/users/login'.

* **Users:**
   * `POST /users/register`
   *   `POST /users/login`
   *   `GET /users/me`
   *   `PUT /users/me`
   *   `DELETE /users/me`
* **Accounts:**
   * `GET /accounts`
   *   `POST /accounts`
   *   `GET /accounts/:id`
   *   `PUT /accounts/:id`
   *   `DELETE /accounts/:id`
* **Categories:**
   * `GET /categories` (returns user categories)
   * `GET /categories/summary` (categories with calculated balances)
   *   `POST /categories`
   *   `GET /categories/:id`
   *   `PUT /categories/:id`
   *   `DELETE /categories/:id`
* **Transactions:**
   * `GET /transactions` (with the possibility of filtering and pagination)
   *   `POST /transactions`
   *   `GET /transactions/:id`
   *   `PUT /transactions/:id`
   *   `DELETE /transactions/:id`
* **Balance:**
   * `GET /balance` (total user balance)

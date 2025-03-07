<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#tech-stack">Tech Stack</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#api-endpoints">API Endpoints</a>
      <ul>
          <li><a href="#authentication">Authentication</a></li>
          <li><a href="#orders-api">Orders API</a></li>
          <li><a href="#users-api">Users API</a></li>
      </ul>
    </li>
    <li><a href="#cors-configuration">CORS Configuration</a></li>
    <li><a href="#running-the-api">Running the API</a></li>
    <li><a href="#notes">Notes</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



## About The Project

SendIt Courier API is the backend component for the SendIt Courier Application. It provides a robust and efficient API for managing courier shipments, designed with scalability and security in mind. The API implements session-based authentication and role-based access control (RBAC) to ensure secure access for both administrators and regular users.

### ✨ Features

* ✅ **User Authentication (Session-based):** Secure login and logout functionality with persistent sessions using cookies.
* ✅ **Role-Based Access Control (RBAC):**  Differentiates access levels for administrators and regular users, ensuring data security and proper authorization.
* ✅ **Order Management:** Comprehensive API endpoints for creating, viewing, updating, and deleting shipment orders.
* ✅ **Admin Privileges:**  Admin users have elevated access to view all orders and manage user accounts.
* ✅ **Session Handling:**  Utilizes `express-session` to maintain user sessions, providing a seamless user experience.


### 🛠 Tech Stack

This project is built using the following technologies:

* **Backend:**  [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
* **Authentication:** Session-based with [express-session](https://www.npmjs.com/package/express-session)
* **CORS:** [cors](https://www.npmjs.com/package/cors) for Cross-Origin Resource Sharing


<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Getting Started

To get started with setting up the SendIt Courier API locally, follow these steps.

### ✅ Prerequisites

Ensure you have these tools installed:

* [Node.js](https://nodejs.org/en/) (v16 or later)
* [MongoDB](https://www.mongodb.com/docs/manual/installation/) - Make sure MongoDB is installed and running locally.

### ⚡ Installation

Follow these numbered steps to install and run the SendIt Courier API:

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/YOUR_GITHUB_USERNAME/sendit-backend.git](https://github.com/YOUR_GITHUB_USERNAME/sendit-backend.git)  # Replace with your repo URL
    cd sendit-backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start MongoDB Server:**
    Open a new terminal and start your MongoDB server:
    ```sh
    mongod
    ```

4.  **Run the API server:**
    Back in your project directory terminal, start the API:
    ```sh
    node server.js
    ```
    The API server will be running at `http://localhost:5000`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

The SendIt Courier API offers a range of endpoints for managing authentication and shipment orders. Explore the detailed [**API Endpoints**](#api-endpoints) section to understand how to interact with the API.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🔗 API Endpoints

Detailed documentation of all API endpoints:

### 🔐 Authentication Endpoints

| Endpoint        | Method | Description                       | Request Body                                  | Response (Success)                                                                                   |
|-----------------|--------|-----------------------------------|-----------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `/auth/login`   | `POST` | User login (Session-based)        | `json { "email": "user@example.com", "password": "password123" } ` | `json { "message": "Login successful", "user": { "_id": "userId123", "email": "user@example.com", "isAdmin": false } } ` |
| `/auth/logout`  | `POST` | User logout                       | None                                          | `json { "message": "Logged out successfully" } `                                                   |
| `/auth/session` | `GET`  | Check session status              | None                                          | `json { "isAuthenticated": true, "user": { "_id": "userId123", "email": "user@example.com" } } ` |

### 📦 Orders API Endpoints

| Endpoint                  | Method   | Authentication Required | Role          | Request Body (Example)                                                                                                                                                                                                                                                             | Response (Example)                                                                                                                                                                                                                         |
|---------------------------|----------|-------------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/orders`                 | `POST`   | ✅ Yes                  | Any User      | `json { "senderName": "John Doe", "senderAddress": "123 Main Street", "senderContact": "+1234567890", "receiverName": "Alice Smith", "receiverAddress": "789 Oak Street", "receiverContact": "+9876543210", "packageDescription": "Laptop", "packageWeight": 2.5, "specialInstructions": "Handle with care", "deliveryOption": "express", "pickupDropoff": "door", "paymentMethod": "cash" } ` | `json { "message": "Order stored successfully!", "order": { "_id": "orderId123", "status": "Pending" } } `             |
| `/orders/my-orders`        | `GET`    | ✅ Yes                  | Any User      | None                                                                                                                                                                                                                                                                                 | `json [ { "_id": "67beb93b7bc01f2db2bc08dd", "senderName": "Ben Johnson", "receiverName": "Bob Smith", "packageDescription": "Electronics - laptop", "status": "delivered" } ] `                  |
| `/orders`                 | `GET`    | ✅ Yes                  | Admin Only    | None                                                                                                                                                                                                                                                                                 | `json [ { "_id": "67beb93b7bc01f2db2bc08dd", "senderName": "Ben Johnson", "receiverName": "Bob Smith", "packageDescription": "Electronics - laptop", "status": "delivered" }, { "_id": "67beb9547bc01f2db2bc08df", "senderName": "Alice Johnson", "receiverName": "Bob Williams", "packageDescription": "Electronics - Laptop", "status": "Pending" } ] ` |
| `/orders/user/:userId`     | `GET`    | ✅ Yes                  | Admin Only    | None                                                                                                                                                                                                                                                                                 | Returns orders for the specified user.                                                                                                                                                                                                   |
| `/orders/:id`              | `PUT`    | ✅ Yes                  | Order Owner/Admin | Request body with fields to update (refer to Create Order Request for field examples).                                                                                                                                                                                             | `json { "message": "Order updated successfully", "order": { "_id": "orderId123", "status": "Delivered" } } `                                                                                                   |
| `/orders/:id`              | `DELETE` | ✅ Yes                  | Order Owner/Admin | None                                                                                                                                                                                                                                                                                 | `json { "message": "Order deleted successfully" } `                                                                                                                                                                     |

### 👤 Users API Endpoints

| Endpoint    | Method   | Authentication Required | Role       | Response (Example)                                                                                       |
|-------------|----------|-------------------------|------------|----------------------------------------------------------------------------------------------------------|
| `/users`    | `GET`    | ✅ Yes                  | Admin Only | `json [ { "_id": "userId123", "email": "user@example.com", "role": "user" }, { "_id": "adminId456", "email": "admin@example.com", "role": "admin" } ] ` |
| `/users/me` | `GET`    | ✅ Yes                  | Any User   | `json { "_id": "userId123", "email": "user@example.com", "role": "user" } `                            |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🌐 CORS Configuration

The API is configured for Cross-Origin Resource Sharing (CORS) to allow requests from your frontend application, typically running on Expo.

**Frontend URL:** `http://192.168.0.175:19006`

**Example CORS Setup (in `server.js`):**

```javascript
app.use(cors({
  origin: "[http://192.168.0.175:19006](http://192.168.0.175:19006)", // Your frontend URL
  credentials: true
}));

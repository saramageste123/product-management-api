# Product Management System

A **Full Stack** product management system composed of a **Java Spring Boot backend** and an **Angular frontend**, developed with a focus on clean architecture, scalability, maintainability, and real-world corporate application practices.

This project simulates a product management system similar to those used in **e-commerce platforms, product catalogs, and inventory management systems**, serving both as an in-depth learning **project and a professional portfolio project.**

## 🧩 Project Overview

The Product Management System is divided into two main modules:

* **Backend (REST API):** Responsible for business logic, data persistence, filtering, pagination, notifications management, validations, and security structure.
* **Frontend (Web App):** A modern and clean interface responsible for product management flows, notifications visualization, side navigation, reusable UI components, and API consumption.

Communication between the frontend and backend is done through a REST API, following widely adopted industry standards and maintaining a decoupled architecture between application layers.

## 🏗️ Repository Structure

```
product_management/
├── README.md            # General project documentation
├── product_api/         # Backend - Java + Spring Boot
│   └── README.md
└── product_front/       # Frontend - Angular
    └── README.md
```

Each module contains its own README with detailed information about architecture, features, and execution steps.


## ⚙️ Backend — Product Management API

The backend was developed using **Java 21 with Spring Boot**, following a layered architecture and development best practices.

### Main responsibilities

* Product management operations
* Dynamic pagination and sorting
* Product search and filtering
* Bulk product deletion
* Notifications management
* Low stock notifications
* Promotions management
* Data validation
* Global exception handling
* Security structure prepared for JWT authentication

📄 **Full documentation:**

👉 See the README inside the `product_api/` folder.


## 🎨 Frontend — Product Management Front

The frontend was developed using **Angular**, focusing on modular architecture, component reusability, and smooth user experience.

### Main features

* REST API integration
* Product listing and management
* Product creation and editing
* Bulk product deletion
* Side navigation menu
* Notifications popup and Hitory
* Promotions management
* About/Profile section
* Dynamic pagination and sorting
* Search integration with the backend
* Reusable modal components
* Loading and request state handling
* Component-based architecture organization

📄 **Full documentation:**

👉 See the README inside the `product_front/` folder.

## 🔄 Application Flow

1. The frontend sends HTTP requests to the backend API
2. The backend processes business rules, validations, filtering, and persistence
3. The API returns structured JSON responses
4. The frontend dynamically updates the interface without page reloads

This flow ensures:

* Decoupling between frontend and backend
* Easier scalability
* Better maintainability
* Cleaner application organization


## 🛠️ Technologies Used

### Backend

* Java 21
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Validation
* Spring Security
* Hibernate
* Lombok
* MySQL
* Maven

### Frontend

* Angular 21
* TypeScript
* RxJS
* Angular HttpClient
* Angular Router
* HTML5
* CSS3
* Angular CLI


## ▶️ Running the Full Project

### 1️⃣ Backend

```bash
cd product_api
mvn spring-boot:run
```

The API will be available at:

```
http://localhost:8080
```

### 2️⃣ Frontend

```bash
cd product_front
ng serve
```

The application will be available at:

```
http://localhost:4200
```

## 🚀 Project Goals

* Apply backend architecture best practices
* Develop a modern and scalable frontend application
* Simulate a real-world full stack project
* Build a maintainable and extensible system
* Serve as a professional portfolio project


## 📈 Next steps

🔐 Implement authentication and authorization (JWT)

🧪Add unit and integration tests

📄 Document the API with Swagger/OpenAPI


## 👩‍💻 Author

**Sara Mageste**

Software Developer

Java • Spring Boot • Angular • APIs REST

This project was developed for study purposes and as part of a professional portfolio.


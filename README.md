# Task Tracker

A full-stack task management application designed to help users organize, track, and manage their daily activities.

## Technologies and Tools

### Frontend
* React 19: UI library for building the user interface.
* Vite: Fast frontend build tool and development server.
* Tailwind CSS: Utility-first CSS framework for styling.
* React Router DOM: For client-side routing.
* React Hook Form: For form validation and handling.
* Axios: Promise-based HTTP client for the browser.
* React Toastify: For interactive notification popups.
* Node.js: Runtime environment for running the frontend tooling.
* ESLint, Vitest, Oxlint: Tools for code quality and testing.

### Backend
* Java 17: Core programming language.
* Spring Boot 4.1.0: Framework for creating stand-alone, production-grade Spring-based applications.
* Spring Security & JWT (jjwt): For secure user authentication and authorization.
* Spring Data JPA: Abstraction over JPA to handle relational data in Java.
* Spring WebSocket: For real-time updates and communication.
* Lombok: Java library to reduce boilerplate code.
* Maven: Dependency management and project build tool.

### Database
* MySQL: Relational database management system.

### Deployment & DevOps
* Docker: Used for containerizing both frontend and backend applications.
* Vercel: Hosting platform for the frontend application.
* Render: Cloud platform used to deploy the Spring Boot backend.
* Railway: Infrastructure platform used to host the MySQL database.

## Design Decisions

### Architecture Overview
The application follows a standard client-server architecture with a clear separation of concerns. 
* The Client (Frontend) is a single-page application (SPA) that provides an interactive user interface, handling view logic, form submissions, and routing. It communicates with the backend via RESTful APIs.
* The Server (Backend) is a Spring Boot application acting as the central processing unit. It exposes REST API endpoints, handles business logic, implements security rules, and manages data persistence.
* The Database (MySQL) stores persistent data such as user accounts and task records. It is accessed by the backend using Spring Data JPA.

### Key Implementation Decisions
* Containerization: Docker was chosen to ensure consistency across development, testing, and production environments, making deployment to varied platforms like Render and Vercel straightforward.
* Stateless Authentication: Implemented JWT (JSON Web Tokens) with Spring Security to keep the server stateless, allowing it to scale easily and reducing database lookups for session validation.
* Real-time Updates: Spring WebSocket is included to allow potential real-time synchronization between clients without requiring constant HTTP polling.
* Responsive Design: Utilized Tailwind CSS to ensure the UI is responsive and accessible across different screen sizes without writing custom CSS media queries.

## Setup Instructions

### Environment Configuration
Before running the applications, create the necessary environment variables. 
For the backend, you will need to set the JDBC URL, database credentials, and JWT secret. 
For the frontend, you will need to set the backend API URL.

### Database Setup
1. Install MySQL and ensure the service is running.
2. Create a new database for the application.
3. Update the `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` in the backend's `application.properties` or environment variables to match your local database credentials.

### Backend Setup
1. Ensure Java 17 and Maven are installed on your machine.
2. Navigate to the `backend` directory: `cd backend`
3. Resolve dependencies and build the project using Maven: `./mvnw clean install`
4. Run the Spring Boot application: `./mvnw spring-boot:run`
5. The backend will typically start on `http://localhost:8080`.

### Frontend Setup
1. Ensure Node.js is installed.
2. Navigate to the `frontend` directory: `cd frontend`
3. Install the required dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Access the application in your browser (typically at `http://localhost:5173`).

## Assumptions
* Each username is unique.
* Every task has one owner.

## Future Improvements
* Task comments
* File attachments
* Email reminders
* Calendar integration
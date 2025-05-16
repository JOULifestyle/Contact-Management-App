# Contact Management System

This project is a contact management system built using Node.js, Express, SQLite, and basic HTML/CSS for the frontend. It includes a REST API for CRUD operations on contacts and a simple frontend form to interact with the API.

## Table of Contents
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the App Locally](#running-the-app-locally)
- [Using RooCommander Commands](#using-roocommander-commands)
- [API Endpoints](#api-endpoints)

## Project Structure
The project is structured as follows:
```
.
├── backend
│   ├── app.js
│   ├── config
│   │   └── database.js---the db backup
│   ├── controllers
│   │   └── contactsController.js
│   ├── models
│   │   └── Contact.js
│   ├── routes
│   │   └── contacts.js
│   └── test-app.js
├── frontend
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── commands
│   ├── generate-contact-api.js
│   ├── generate-contact-form.js
│   ├── connect-api-ui.js
│   └── setup-git-and-push.js
├── .env
├── roocommander.config.json
└── README.md
```

## Getting Started
To get started with the project, follow these steps:

### Prerequisites
- Node.js installed on your machine
- npm (Node Package Manager) installed
- SQLite installed (if not using Sequelize)

### Installation
1. Clone the repository:
   ```sh
   git clone [https://github.com/JOULifestyle/roocode_project].git
   cd contact-management-system
   ```
2. Install the necessary dependencies:
   ```sh
   npm install
   ```

## Running the App Locally
1. Start the backend server:
   ```sh
   node backend/app.js
   ```
2. Serve the frontend:
   ```sh
   npx http-server frontend -p 8080
   ```
3. Open the frontend in your browser:
   ```sh
   start http://localhost:8080
   ```

## Using RooCommander Commands
RooCommander commands are provided to automate key actions in the project. The commands are stored in the `/commands` folder and registered in `roocommander.config.json`.

### Available Commands
- `generate-contact-api`: Builds the API for contact management.
- `generate-contact-form`: Creates the frontend form for contact management.
- `connect-api-ui`: Connects the frontend to the backend API.
- `setup-git-and-push`: Initializes the Git repo, creates a `.gitignore` file, commits the files, and pushes to GitHub.

### Running Commands
To run a command, use the following syntax:
```sh
roo <command-name>
```
For example, to generate the contact API:
```sh
roo generate-contact-api
```

## API Endpoints
The API endpoints for contact management are as follows:

### GET /api/contacts
- **Description**: Fetches a list of all contacts.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "123-456-7890"
    },
    ...
  ]
  ```

### POST /api/contacts
- **Description**: Adds a new contact.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "098-765-4321"
  }
  ```
- **Response**:
  ```json
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "098-765-4321"
  }
  ```

### PUT /api/contacts/:id
- **Description**: Updates an existing contact.
- **Request Body**:
  ```json
  {
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "098-765-4321"
  }
  ```
- **Response**:
  ```json
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "098-765-4321"
  }
  ```

### DELETE /api/contacts/:id
- **Description**: Deletes an existing contact.
- **Response**:
  ```json
  {
    "message": "Contact deleted successfully"
  }
  ```

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


By Israel Olasehinde

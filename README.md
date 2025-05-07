# Contact Management System

This project is a contact management system built using Node.js, Express, SQLite, and basic HTML/CSS for the frontend. It includes a REST API for CRUD operations and a simple frontend form to manage contacts.

## Project Structure
- `/backend`: Contains the Node.js and Express backend.
- `/frontend`: Contains the HTML, CSS, and JavaScript frontend.
- `/commands`: Contains the RooCommander commands.

## Dependencies
- `express`: Web framework for Node.js.
- `sequelize`: ORM for SQL databases.
- `sqlite3`: SQLite driver for Node.js.
- `dotenv`: Loads environment variables from a `.env` file.
- `axios`: HTTP client for making API requests.

## Environment Variables
Create a `.env` file in the root directory with the following content:
```
DB_NAME=contact_form
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
PORT=3000
```

## Running the App Locally
1. Install dependencies:
   ```sh
   npm install
   ```

2. Start the backend server:
   ```sh
   node backend/app.js
   ```

3. Start the frontend server:
   ```sh
   npx http-server frontend -p 8080
   ```

4. Open the frontend in your browser:
   ```
   http://localhost:8080
   ```

## Running RooCommander Commands
1. **generate-contact-api**: Builds the API.
   ```sh
   roo generate-contact-api
   ```

2. **generate-contact-form**: Creates the frontend form.
   ```sh
   roo generate-contact-form
   ```

3. **connect-api-ui**: Connects the frontend to the backend.
   ```sh
   roo connect-api-ui
   ```

4. **setup-git-and-push**: Initializes the Git repo, creates `.gitignore`, commits files, and pushes to GitHub.
   ```sh
   roo setup-git-and-push
   ```

## Contributing
Feel free to contribute to this project by submitting pull requests or opening issues.

## License
This project is licensed under the MIT License.
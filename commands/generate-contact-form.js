const fs = require('fs');
const path = require('path');

const generateContactForm = () => {
    const frontendPath = path.join(__dirname, '../frontend');

    // Create index.html
    const indexContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Management System</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Contact Management System</h1>
    <form id="contactForm">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <br>
        <label for="phone">Phone:</label>
        <input type="text" id="phone" name="phone" required>
        <br>
        <button type="submit">Add Contact</button>
    </form>
    <hr>
    <div id="contacts">
        <h2>Contacts</h2>
        <ul id="contactList"></ul>
    </div>

    <script src="script.js"></script>
</body>
</html>
`;
    fs.writeFileSync(path.join(frontendPath, 'index.html'), indexContent);

    // Create styles.css
    const stylesContent = `
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1, h2 {
    color: #333;
}

form {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-top: 10px;
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

#contacts {
    margin-top: 20px;
}

#contactList {
    list-style-type: none;
    padding: 0;
}

#contactList li {
    background-color: #f9f9f9;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
}
`;
    fs.writeFileSync(path.join(frontendPath, 'styles.css'), stylesContent);

    // Create script.js
    const scriptContent = `
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone })
        });

        if (response.ok) {
            const newContact = await response.json();
            addContactToList(newContact);
            form.reset();
        } else {
            alert('Failed to add contact');
        }
    });

    async function fetchContacts() {
        const response = await fetch('/api/contacts');
        if (response.ok) {
            const contacts = await response.json();
            contacts.forEach(addContactToList);
        } else {
            alert('Failed to fetch contacts');
        }
    }

    function addContactToList(contact) {
        const li = document.createElement('li');
        li.textContent = \`\${contact.name} - \${contact.email} - \${contact.phone}\`;
        contactList.appendChild(li);
    }

    fetchContacts();
});
`;
    fs.writeFileSync(path.join(frontendPath, 'script.js'), scriptContent);

    console.log('Contact form generated successfully');
};

module.exports = generateContactForm;
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');
    const searchInput = document.getElementById('searchInput');
    const submitButton = form.querySelector('button');

    const BASE_URL = 'http://localhost:3000/api/contacts';

    // Fetch all contacts when page loads
    fetchContacts();

    // Submit handler (Add or Update)
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const editId = form.dataset.editId;

        if (editId) {
            // Edit existing contact
            const response = await fetch(`${BASE_URL}/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, phone })
            });

            if (response.ok) {
                const updatedContact = await response.json();
                const tr = contactList.querySelector(`[data-id="${editId}"]`);
                tr.querySelector('td:nth-child(1)').textContent = updatedContact.name;
                tr.querySelector('td:nth-child(2)').textContent = updatedContact.email;
                tr.querySelector('td:nth-child(3)').textContent = updatedContact.phone;

                form.reset();
                delete form.dataset.editId;
                submitButton.textContent = 'Add';
            } else {
                alert('Failed to update contact');
            }
        } else {
            // Add new contact
            const response = await fetch(BASE_URL, {
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
        }
    });

    // Filter contacts as you type
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const contacts = Array.from(contactList.children);
        contacts.forEach(contact => {
            const text = contact.textContent.toLowerCase();
            contact.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Add a contact row to the table
    function addContactToList(contact) {
        const tr = document.createElement('tr');
        tr.dataset.id = contact.id;

        tr.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        // Edit button
        tr.querySelector('.edit-btn').addEventListener('click', async () => {
            const response = await fetch(`${BASE_URL}/${contact.id}`);
            if (response.ok) {
                const data = await response.json();
                document.getElementById('name').value = data.name;
                document.getElementById('email').value = data.email;
                document.getElementById('phone').value = data.phone;
                form.dataset.editId = data.id;
                submitButton.textContent = 'Update';
            } else {
                alert('Failed to fetch contact');
            }
        });

        // Delete button
        tr.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this contact?')) {
                const response = await fetch(`${BASE_URL}/${contact.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    tr.remove();
                } else {
                    alert('Failed to delete contact');
                }
            }
        });

        contactList.appendChild(tr);
    }

    // Load contacts on page load
    async function fetchContacts() {
        const response = await fetch(BASE_URL);
        if (response.ok) {
            const contacts = await response.json();
            contactList.innerHTML = ''; // clear old list
            contacts.forEach(addContactToList);
        } else {
            alert('Failed to fetch contacts');
        }
    }
});

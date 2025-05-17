document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');
    const searchInput = document.getElementById('searchInput');
    const submitButton = form.querySelector('button');

    const BASE_URL = 'https://contact-form-backend-pkif.onrender.com/api/contacts';

    // Status message row for showing loading/errors inside the table
    let statusRow;

    function showStatus(message) {
        if (!statusRow) {
            statusRow = document.createElement('tr');
            statusRow.innerHTML = `<td colspan="4" style="text-align:center; font-style: italic;">${message}</td>`;
            contactList.appendChild(statusRow);
        } else {
            statusRow.innerHTML = `<td colspan="4" style="text-align:center; font-style: italic;">${message}</td>`;
        }
    }

    function clearStatus() {
        if (statusRow) {
            contactList.removeChild(statusRow);
            statusRow = null;
        }
    }

    // Fetch all contacts with retry and loading
    const maxRetries = 3;
    let retryCount = 0;

    async function fetchContacts() {
        showStatus('Loading contacts...');
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error('Failed to fetch contacts');
            const contacts = await response.json();

            clearStatus();
            contactList.innerHTML = ''; // clear old list
            contacts.forEach(addContactToList);
            retryCount = 0; // reset retry count on success
        } catch (error) {
            if (retryCount < maxRetries) {
                retryCount++;
                showStatus(`Retrying to load contacts... (${retryCount})`);
                setTimeout(fetchContacts, 2000);
            } else {
                showStatus('Error loading contacts. Please try again later.');
                console.error('Fetch contacts error:', error);
            }
        }
    }

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
            showStatus('Loading contact...');
            try {
                const response = await fetch(`${BASE_URL}/${contact.id}`);
                if (!response.ok) throw new Error('Failed to fetch contact');
                const data = await response.json();
                document.getElementById('name').value = data.name;
                document.getElementById('email').value = data.email;
                document.getElementById('phone').value = data.phone;
                form.dataset.editId = data.id;
                submitButton.textContent = 'Update';
                clearStatus();
            } catch (error) {
                showStatus('Error loading contact. Please try again.');
                console.error('Fetch single contact error:', error);
            }
        });

        // Delete button
        tr.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this contact?')) {
                showStatus('Deleting contact...');
                try {
                    const response = await fetch(`${BASE_URL}/${contact.id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) throw new Error('Failed to delete contact');
                    tr.remove();
                    clearStatus();
                } catch (error) {
                    showStatus('Error deleting contact. Please try again.');
                    console.error('Delete contact error:', error);
                }
            }
        });

        contactList.appendChild(tr);
    }

    // Submit handler (Add or Update)
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const editId = form.dataset.editId;

        if (!name || !email || !phone) {
            alert('Please fill all fields.');
            return;
        }

        showStatus(editId ? 'Updating contact...' : 'Adding contact...');

        try {
            if (editId) {
                // Edit existing contact
                const response = await fetch(`${BASE_URL}/${editId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone })
                });

                if (!response.ok) throw new Error('Failed to update contact');
                const updatedContact = await response.json();

                const tr = contactList.querySelector(`[data-id="${editId}"]`);
                tr.querySelector('td:nth-child(1)').textContent = updatedContact.name;
                tr.querySelector('td:nth-child(2)').textContent = updatedContact.email;
                tr.querySelector('td:nth-child(3)').textContent = updatedContact.phone;

                form.reset();
                delete form.dataset.editId;
                submitButton.textContent = 'Add';
                clearStatus();
            } else {
                // Add new contact
                const response = await fetch(BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone })
                });

                if (!response.ok) throw new Error('Failed to add contact');
                const newContact = await response.json();
                addContactToList(newContact);
                form.reset();
                clearStatus();
            }
        } catch (error) {
            showStatus(editId ? 'Error updating contact. Please try again.' : 'Error adding contact. Please try again.');
            console.error('Submit contact error:', error);
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

    // Load contacts on page load
    fetchContacts();
});

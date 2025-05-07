document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const contactsDiv = document.getElementById('contacts');

    // Function to display contacts
    const displayContacts = (contacts) => {
        contactsDiv.innerHTML = '';
        contacts.forEach(contact => {
            const contactDiv = document.createElement('div');
            contactDiv.className = 'contact';
            contactDiv.innerHTML = `
        <strong>${contact.name}</strong> - ${contact.email} - ${contact.phone}
        <span class="edit" data-id="${contact.id}">Edit</span>
        <span class="delete" data-id="${contact.id}">Delete</span>
      `;
            contactsDiv.appendChild(contactDiv);
        });
    };

    // Function to fetch contacts
    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/contacts');
            const contacts = await response.json();
            displayContacts(contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    // Function to add a contact
    const addContact = async (contact) => {
        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact)
            });
            const newContact = await response.json();
            fetchContacts();
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    // Function to edit a contact
    const editContact = async (id, updatedContact) => {
        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedContact)
            });
            const editedContact = await response.json();
            fetchContacts();
        } catch (error) {
            console.error('Error editing contact:', error);
        }
    };

    // Function to delete a contact
    const deleteContact = async (id) => {
        try {
            await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    // Event listener for form submission
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        addContact({ name, email, phone });
        contactForm.reset();
    });

    // Event listener for edit button
    contactsDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit')) {
            const id = event.target.dataset.id;
            const contact = contactsDiv.querySelector(`.contact[data-id="${id}"]`);
            const name = contact.querySelector('strong').textContent.split(' - ')[0];
            const email = contact.querySelector('strong').textContent.split(' - ')[1];
            const phone = contact.querySelector('strong').textContent.split(' - ')[2];

            contactForm.querySelector('#name').value = name;
            contactForm.querySelector('#email').value = email;
            contactForm.querySelector('#phone').value = phone;

            contactForm.querySelector('button').textContent = 'Update Contact';
            contactForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const updatedName = document.getElementById('name').value;
                const updatedEmail = document.getElementById('email').value;
                const updatedPhone = document.getElementById('phone').value;

                editContact(id, { name: updatedName, email: updatedEmail, phone: updatedPhone });
                contactForm.reset();
                contactForm.querySelector('button').textContent = 'Add Contact';
            });
        }
    });

    // Event listener for delete button
    contactsDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete')) {
            const id = event.target.dataset.id;
            deleteContact(id);
        }
    });

    // Initial fetch of contacts
    fetchContacts();
});
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submissionsList = document.getElementById('submissions-list');
    const emptyState = document.getElementById('empty-state');

    // Utility: truncate long messages
    const truncateMessage = (message, length = 50) => {
        if (message.length > length) return message.slice(0, length) + '...';
        return message;
    };

    // Render submissions table
    function renderSubmissions() {
        const data = JSON.parse(localStorage.getItem('contact_submissions')) || [];

        if (!submissionsList) return;

        if (data.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            submissionsList.innerHTML = '';
            return;
        } else {
            if (emptyState) emptyState.classList.add('hidden');
        }

        submissionsList.innerHTML = data.slice().reverse().map((entry, index) => `
            <tr class="border-b border-gray-100">
                <td class="px-6 py-4 text-xs font-mono text-gray-400">${entry.submittedAt}</td>
                <td class="px-6 py-4 font-bold text-gray-800">${entry.name}</td>
                <td class="px-6 py-4 text-blue-600">${entry.email}</td>
                <td class="px-6 py-4 text-gray-600">
                    <span id="msg-${index}" class="block">${truncateMessage(entry.message)}</span>
                    ${entry.message.length > 50 ? `<button class="text-blue-500 text-sm mt-1 underline toggle-btn" data-index="${index}">Show more</button>` : ''}
                </td>
            </tr>
        `).join('');

        // Add click listeners for toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                const span = document.getElementById(`msg-${idx}`);
                const fullMessage = data[data.length - 1 - idx].message; // reverse order
                if (span.textContent.endsWith('...')) {
                    span.textContent = fullMessage;
                    this.textContent = 'Show less';
                } else {
                    span.textContent = truncateMessage(fullMessage);
                    this.textContent = 'Show more';
                }
            });
        });
    }

    // Save submission to localStorage
    const saveToLocalStorage = (data) => {
        const existingSubmissions = JSON.parse(localStorage.getItem('contact_submissions')) || [];
        const submissionWithDate = { ...data, submittedAt: new Date().toLocaleString() };
        existingSubmissions.push(submissionWithDate);
        localStorage.setItem('contact_submissions', JSON.stringify(existingSubmissions));
    };

    // Handle form submit
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            saveToLocalStorage(data);

            if (formMessage) {
                formMessage.textContent = `Submission saved successfully!`;
                formMessage.classList.remove('opacity-0');
                formMessage.classList.add('opacity-100', 'bg-blue-100', 'text-blue-800', 'text-center');
                setTimeout(() => formMessage.classList.replace('opacity-100', 'opacity-0'), 3000);
            }

            contactForm.reset();
            renderSubmissions(); // refresh table instantly
        });
    }

    // Initial render
    renderSubmissions();
});

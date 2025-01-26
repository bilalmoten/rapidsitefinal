(function () {
    function getFieldIdentifier(element) {
        console.log('Getting identifier for element:', element.tagName, {
            type: element.type,
            name: element.getAttribute('name'),
            id: element.getAttribute('id'),
            value: element.value
        });

        // Try name attribute first
        const name = element.getAttribute('name');
        if (name) return name;

        // Try id attribute
        const id = element.getAttribute('id');
        if (id) return id;

        // Try to get associated label text
        const labelFor = element.id ? document.querySelector(`label[for="${element.id}"]`) : null;
        if (labelFor) {
            console.log('Found label by for attribute:', labelFor.textContent);
            return labelFor.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
        }

        // Look for a label as a parent or ancestor
        let parent = element.parentElement;
        while (parent) {
            if (parent.tagName === 'LABEL') {
                console.log('Found parent label:', parent.textContent);
                return parent.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
            }
            // Also check for label as a previous sibling or any nearby label
            let sibling = parent.querySelector('label');
            if (sibling) {
                console.log('Found nearby label:', sibling.textContent);
                return sibling.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
            }
            parent = parent.parentElement;
        }

        // If all else fails, use the input type and a timestamp
        const fallbackId = `${element.type || element.tagName.toLowerCase()}_${Date.now()}`;
        console.log('Using fallback identifier:', fallbackId);
        return fallbackId;
    }

    function getFormFields(form) {
        console.log('Getting form fields for form:', {
            id: form.id,
            className: form.className,
            action: form.action
        });

        const data = {};
        // Expand selector to catch more input types
        const elements = form.querySelectorAll('input:not([type="submit"]):not([type="button"]), textarea, select');
        console.log('Found form elements:', elements.length);

        elements.forEach((element, index) => {
            console.log(`Processing element ${index + 1}/${elements.length}:`, {
                type: element.type,
                tagName: element.tagName,
                value: element.value,
                isVisible: element.offsetParent !== null
            });

            // Skip hidden elements and buttons
            if (element.type === 'submit' || element.type === 'button' || element.type === 'hidden') {
                console.log('Skipping element:', element.type);
                return;
            }

            // Get field identifier
            const fieldName = getFieldIdentifier(element);
            console.log('Field identifier:', fieldName);

            // Get field value based on type
            let value;
            if (element.type === 'checkbox') {
                value = element.checked;
            } else if (element.type === 'radio') {
                if (element.checked) {
                    value = element.value;
                } else {
                    return; // Skip unchecked radio buttons
                }
            } else if (element.tagName === 'SELECT') {
                value = Array.from(element.selectedOptions).map(opt => opt.value);
                if (!element.multiple) value = value[0];
            } else {
                value = element.value;
            }

            console.log('Field value:', value);
            data[fieldName] = value;
        });

        console.log('Final form data:', data);
        return data;
    }

    function initializeForms() {
        console.log('Starting form initialization...');
        const forms = document.querySelectorAll('form');
        console.log(`Found ${forms.length} forms on the page`);

        forms.forEach((form, index) => {
            console.log(`Initializing form ${index + 1}/${forms.length}:`, {
                id: form.id,
                className: form.className,
                action: form.action
            });

            // Skip if already initialized
            if (form.dataset.initialized) {
                console.log('Form already initialized, skipping');
                return;
            }
            form.dataset.initialized = 'true';

            form.addEventListener('submit', async function (e) {
                e.preventDefault();
                console.log('Form submit event triggered');

                // Get form data
                const data = getFormFields(form);
                console.log('Collected form data:', data);

                try {
                    if (!window.__WEBSITE_ID__) {
                        console.error('Website ID not found in window object');
                        throw new Error('Website ID not found');
                    }

                    const payload = {
                        websiteId: window.__WEBSITE_ID__,
                        formId: form.id || 'default',
                        data,
                        timestamp: new Date().toISOString(),
                    };
                    console.log('Preparing to submit payload:', payload);

                    const response = await fetch('/api/form-submissions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    });

                    console.log('Response status:', response.status);
                    const responseData = await response.json();
                    console.log('Response data:', responseData);

                    if (!response.ok) {
                        throw new Error(responseData.error || 'Submission failed');
                    }

                    // Handle success
                    form.reset();
                    showNotification('success', 'Form submitted successfully!');

                } catch (error) {
                    console.error('Form submission error:', error);
                    showNotification('error', error.message || 'Failed to submit form. Please try again.');
                }
            });

            console.log(`Form ${index + 1} initialized successfully`);
        });
    }

    // Initialize immediately if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('DOM already ready, initializing forms immediately');
        initializeForms();
    }

    // Also listen for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded event fired');
        initializeForms();
    });

    // Utility function for notifications
    function showNotification(type, message) {
        console.log('Showing notification:', { type, message });
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white z-50`;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
})(); 
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const tableBody = document.querySelector('#registrationsTable tbody');
    
    // Load registrations from localStorage
    let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    
    // Display existing registrations
    renderRegistrations();
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const surname = document.getElementById('surname').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        
        if (!name || !surname) {
            alert('Per favore inserisci sia il nome che il cognome');
            return;
        }
        
        // Add new registration
        registrations.push({
            id: Date.now(),
            name,
            surname,
            attendance
        });
        
        // Save to localStorage
        localStorage.setItem('registrations', JSON.stringify(registrations));
        
        // Update display
        renderRegistrations();
        
        // Reset form
        form.reset();
    });
    
    // Render all registrations
    function renderRegistrations() {
        tableBody.innerHTML = '';
        
        if (registrations.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    Nessuna registrazione trovata
                </td>
            `;
            tableBody.appendChild(row);
            return;
        }
        
        registrations.forEach(registration => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${registration.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${registration.surname}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${registration.attendance === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${registration.attendance === 'present' ? 'Presente' : 'Assente'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="toggleAttendance(${registration.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                        <i class="fas fa-exchange-alt"></i> Cambia
                    </button>
                    <button onclick="deleteRegistration(${registration.id})" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i> Elimina
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Toggle attendance status
    window.toggleAttendance = function(id) {
        registrations = registrations.map(reg => {
            if (reg.id === id) {
                return {
                    ...reg,
                    attendance: reg.attendance === 'present' ? 'absent' : 'present'
                };
            }
            return reg;
        });
        
        localStorage.setItem('registrations', JSON.stringify(registrations));
        renderRegistrations();
    };
    
    // Delete registration
    window.deleteRegistration = function(id) {
        if (confirm('Sei sicuro di voler eliminare questa registrazione?')) {
            registrations = registrations.filter(reg => reg.id !== id);
            localStorage.setItem('registrations', JSON.stringify(registrations));
            renderRegistrations();
        }
    };
});
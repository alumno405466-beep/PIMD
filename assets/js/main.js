// assets/js/main.js

// ===== SANITIZACIÓN =====
function sanitizeInput(input) {
    if (!input) return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// ===== MANEJO DE ERRORES =====
function handleError(error, userMessage = 'Algo salió mal') {
    console.error('Error:', {
        message: error.message,
        time: new Date().toISOString()
    });
    if (userMessage) alert(userMessage);
}

// ===== MENÚ OVERLAY (funciona en todas las páginas) =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        const menuToggle = document.getElementById('menuToggle');
        const menuOverlay = document.getElementById('menuOverlay');
        const closeMenu = document.getElementById('closeMenu');
        
        if (!menuToggle || !menuOverlay || !closeMenu) {
            console.log('Elementos de menú no encontrados (puede ser página sin menú)');
            return;
        }
        
        // Abrir menú
        menuToggle.addEventListener('click', function() {
            try {
                menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
                menuOverlay.classList.add('opacity-100', 'pointer-events-auto');
                document.body.style.overflow = 'hidden';
            } catch (error) {
                handleError(error, 'No se pudo abrir el menú');
            }
        });
        
        // Cerrar menú
        closeMenu.addEventListener('click', function() {
            try {
                menuOverlay.classList.add('opacity-0', 'pointer-events-none');
                menuOverlay.classList.remove('opacity-100', 'pointer-events-auto');
                document.body.style.overflow = '';
            } catch (error) {
                handleError(error);
            }
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOverlay.classList.contains('opacity-100')) {
                closeMenu.click();
            }
        });
        
        // Cerrar al hacer clic en un enlace del menú
        const menuLinks = menuOverlay.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu.click();
            });
        });
        
    } catch (error) {
        handleError(error, 'Error al inicializar el menú');
    }
    
    // ===== FORMULARIO DE CONTACTO (si existe) =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                const name = sanitizeInput(document.getElementById('name')?.value || '');
                const email = sanitizeInput(document.getElementById('email')?.value || '');
                const message = sanitizeInput(document.getElementById('message')?.value || '');
                
                if (!name || !email || !message) {
                    alert('Por favor, completa todos los campos');
                    return;
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Por favor, introduce un email válido');
                    return;
                }
                
                console.log('Formulario válido:', { name, email, message });
                alert('¡Mensaje enviado con éxito!');
                this.reset();
                
            } catch (error) {
                handleError(error, 'Error al enviar el mensaje');
            }
        });
    }
});
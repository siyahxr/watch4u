document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        window.location.href = '/login';
        return;
    }

    const userNameDisplay = document.getElementById('userName');
    if (userNameDisplay) {
        userNameDisplay.textContent = user.fullname || user.email;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = '/';
        });
    }
});

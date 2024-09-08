// theme.js

document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('theme-toggle');

    // Load saved theme preference from localStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        toggleSwitch.checked = currentTheme === 'dark-mode';
    }

    // Add event listener for theme toggle
    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });
});
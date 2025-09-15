// DOM elements
const hourHand = document.querySelector('.hour');
const minHand = document.querySelector('.min');
const secHand = document.querySelector('.sec');
const digitalClock = document.querySelector('.digital-clock');
const dateDisplay = document.querySelector('.date-display');
const switchBtn = document.querySelector('.switch-btn');
const body = document.body;

// Set up clock markers
function createMarkers() {
    const clock = document.querySelector('.clock');
    
    for (let i = 0; i < 60; i++) {
        const marker = document.createElement('div');
        marker.classList.add('marker');
        
        // Make every 5th marker a major one (for hours)
        if (i % 5 === 0) {
            marker.classList.add('major');
        }
        
        marker.style.transform = `rotate(${i * 6}deg) translateY(-9.2rem)`;
        clock.appendChild(marker);
    }
}

// Update clock function
function setClock() {
    const day = new Date();
    const hours = day.getHours();
    const minutes = day.getMinutes();
    const seconds = day.getSeconds();
    const milliseconds = day.getMilliseconds();
    
    // Calculate angles with smooth movement for seconds and minutes
    const secAngle = seconds * 6 + milliseconds * 0.006;
    const minAngle = minutes * 6 + seconds * 0.1;
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    
    // Apply rotations
    secHand.style.transform = `rotate(${secAngle}deg)`;
    minHand.style.transform = `rotate(${minAngle}deg)`;
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    
    // Update digital clock
    digitalClock.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update date display
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // Use browser's language for date display
    const userLanguage = navigator.language || navigator.userLanguage || 'en-US';
    dateDisplay.textContent = day.toLocaleDateString(userLanguage, options);
}

// Get localized button text based on language
function getLocalizedThemeText(theme) {
    const translations = {
        'pt': { light: 'Claro', dark: 'Escuro' },
        'pt-BR': { light: 'Claro', dark: 'Escuro' },
        'es': { light: 'Claro', dark: 'Oscuro' },
        'fr': { light: 'Clair', dark: 'Sombre' },
        'de': { light: 'Hell', dark: 'Dunkel' },
        'it': { light: 'Chiaro', dark: 'Scuro' },
        // Add more languages as needed
    };
    
    const userLanguage = navigator.language || navigator.userLanguage || 'en';
    const langCode = userLanguage.split('-')[0]; // Get base language code
    
    // Check if we have translations for the exact language code or base language
    if (translations[userLanguage] && translations[userLanguage][theme]) {
        return translations[userLanguage][theme];
    } else if (translations[langCode] && translations[langCode][theme]) {
        return translations[langCode][theme];
    }
    
    // Default to English
    return theme === 'light' ? 'Light' : 'Dark';
}

// Theme switching
function switchTheme() {
    if (body.getAttribute('data-theme') === 'light') {
        body.setAttribute('data-theme', 'dark');
        switchBtn.textContent = getLocalizedThemeText('light');
        // Save to localStorage if available
        try {
            localStorage.setItem('theme', 'dark');
        } catch (e) {
            console.log('LocalStorage not available');
        }
    } else {
        body.setAttribute('data-theme', 'light');
        switchBtn.textContent = getLocalizedThemeText('dark');
        // Save to localStorage if available
        try {
            localStorage.setItem('theme', 'light');
        } catch (e) {
            console.log('LocalStorage not available');
        }
    }
}

// Get localized title text
function getLocalizedTitle() {
    const translations = {
        'pt': 'Relógio',
        'pt-BR': 'Relógio',
        'es': 'Reloj',
        'fr': 'Horloge',
        'de': 'Uhr',
        'it': 'Orologio',
        // Add more languages as needed
    };
    
    const userLanguage = navigator.language || navigator.userLanguage || 'en';
    const langCode = userLanguage.split('-')[0]; // Get base language code
    
    // Check if we have translations for the exact language code or base language
    if (translations[userLanguage]) {
        return translations[userLanguage];
    } else if (translations[langCode]) {
        return translations[langCode];
    }
    
    // Default to English
    return 'Clock';
}

// Initialize
function init() {
    createMarkers();
    
    // Set browser language to HTML lang attribute
    const userLanguage = navigator.language || navigator.userLanguage || 'en';
    document.documentElement.lang = userLanguage;
    
    // Set localized title
    document.getElementById('clock-title').textContent = getLocalizedTitle();
    
    // Set initial clock state
    setClock();
    
    // Update clock every 50ms for smooth movement
    setInterval(setClock, 50);
    
    // Set up event listener for theme switch
    switchBtn.addEventListener('click', switchTheme);
    
    // Check for saved theme preference
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.setAttribute('data-theme', savedTheme);
            switchBtn.textContent = getLocalizedThemeText(savedTheme === 'dark' ? 'light' : 'dark');
        } else {
            // Set initial button text based on default theme
            switchBtn.textContent = getLocalizedThemeText('dark');
        }
    } catch (e) {
        console.log('LocalStorage not available');
        // Set initial button text based on default theme
        switchBtn.textContent = getLocalizedThemeText('dark');
    }
}

// Start the clock when page loads
window.addEventListener('load', init);
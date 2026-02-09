function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getLuminance(hex) {
    const rgb = hexToRgb(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(component => {
        component /= 255;
        return component <= 0.03928
            ? component / 12.92
            : Math.pow((component + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1, color2) {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function updateColorDisplay(colorId) {
    const color = document.getElementById(colorId).value;
    const rgb = hexToRgb(color);

    // Get both colors and calculate ratio once
    const foregroundColor = document.getElementById('color1').value;
    const backgroundColor = document.getElementById('color2').value;
    const ratio = getContrastRatio(foregroundColor, backgroundColor);

    // Calculate heights based on contrast ratio
    const minHeight = 180; // Erhöht für iOS
    const maxHeight = Math.floor(window.innerHeight - 120); // Mehr Padding für Mobile
    const heightRange = maxHeight - minHeight;
    const normalizedRatio = Math.min((ratio - 1) / 20, 1);

    // Calculate heights using a more dramatic curve
    const tallHeight = maxHeight;
    const shortHeight = Math.max(
        Math.floor(minHeight + (heightRange * (1 - normalizedRatio))),
        180 // Garantierte Mindesthöhe angepasst
    );

    // Determine heights based on luminance
    const foreL = getLuminance(foregroundColor);
    const backL = getLuminance(backgroundColor);
    const foregroundHeight = foreL > backL ? tallHeight : shortHeight;
    const backgroundHeight = backL > foreL ? tallHeight : shortHeight;

    // Update sections
    const foregroundSection = document.querySelector('.color-section.foreground');
    const backgroundSection = document.querySelector('.color-section.background');
    const foregroundInfo = document.querySelector('.foreground .color-info');
    const backgroundInfo = document.querySelector('.background .color-info');

    // Determine position based on luminance
    const isReversed = backL > foreL;  // true when background is lighter than foreground

    // Update positions
    foregroundInfo.classList.add('bottom');  // Always keep bottom class
    backgroundInfo.classList.add('top');     // Always keep top class
    backgroundInfo.classList.toggle('switched', isReversed);  // Only background moves

    // Update heights with explicit pixel values and force repaint for Safari
    foregroundSection.style.height = `${Math.floor(foregroundHeight)}px`;
    backgroundSection.style.height = `${Math.floor(backgroundHeight)}px`;
    foregroundSection.style.transform = 'translateZ(0)';
    backgroundSection.style.transform = 'translateZ(0)';

    // Update colors and text colors
    foregroundSection.style.backgroundColor = foregroundColor;
    backgroundSection.style.backgroundColor = backgroundColor;
    foregroundInfo.style.color = backgroundColor;
    backgroundInfo.style.color = foregroundColor;

    // Update contrast ratio color and position
    const contrastRatio = document.querySelector('.contrast-ratio');
    contrastRatio.style.color = isReversed ? foregroundColor : backgroundColor;
    contrastRatio.classList.toggle('switched', isReversed);

    // Update all child elements with the same color
    foregroundInfo.querySelectorAll('.label, .hex-value, .rgb-value').forEach(element => {
        element.style.color = backgroundColor;
    });

    backgroundInfo.querySelectorAll('.label, .hex-value, .rgb-value').forEach(element => {
        element.style.color = foregroundColor;
    });

    // Update hex and RGB values
    document.getElementById(`${colorId}-hex`).textContent = color.toUpperCase();
    document.getElementById(`${colorId}-r`).textContent = rgb.r;
    document.getElementById(`${colorId}-g`).textContent = rgb.g;
    document.getElementById(`${colorId}-b`).textContent = rgb.b;

    updateContrastRatio();
}

function updateContrastRatio() {
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;
    const foregroundColor = color1;
    const backgroundColor = color2;
    const ratio = getContrastRatio(color1, color2);
    
    document.getElementById('result').textContent = `${ratio.toFixed(2)}:1`;
    
    // Get sections
    const foregroundSection = document.querySelector('.color-section.foreground');
    const backgroundSection = document.querySelector('.color-section.background');
    
    // Calculate heights
    const minHeight = 180;
    const maxHeight = Math.floor(window.innerHeight - 120);
    const heightRange = maxHeight - minHeight;
    const normalizedRatio = Math.min((ratio - 1) / 20, 1);
    
    // Set section heights
    const foregroundHeight = Math.max(
        Math.floor(minHeight + (heightRange * normalizedRatio)),
        180
    );
    foregroundSection.style.height = `${foregroundHeight}px`;
    backgroundSection.style.height = `${maxHeight - foregroundHeight}px`;

    // Update rating boxes
    const ratingDisplay = document.querySelector('.rating-display');
    
    // Define rating levels
    const levels = [
        { ratio: 7.0, label: 'AAA', desc: 'Normal Text' },
        { ratio: 4.5, label: 'AAA', desc: 'Large Text' },
        { ratio: 4.5, label: 'AA', desc: 'Normal Text' },
        { ratio: 3.0, label: 'AA', desc: 'Large Text' }
    ];
    
    // Find the highest achieved level
    let currentLevel = null;
    for (let level of levels) {
        if (ratio >= level.ratio && !currentLevel) {
            currentLevel = level;
            break;
        }
    }
    
    // If no level achieved, show minimum
    if (!currentLevel) {
        currentLevel = { ratio: 3.0, label: 'AA', desc: 'Large Text' };
    }
    
    // Update display
    document.getElementById('current-rating-label').textContent = currentLevel.label;
    document.getElementById('current-rating-desc').textContent = currentLevel.desc;
    
    // Get luminance values
    const foreL = getLuminance(foregroundColor);
    const backL = getLuminance(backgroundColor);
    const isReversed = backL > foreL;
    
    // Set color and position based on which section it appears in (same as contrast ratio)
    if (ratingDisplay) {
        ratingDisplay.style.color = isReversed ? foregroundColor : backgroundColor;
        ratingDisplay.classList.toggle('switched', isReversed);
    }

    updateTextColors();
}

function updateTextColors() {
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;

    const foregroundInfo = document.querySelector('.foreground .color-info');
    const backgroundInfo = document.querySelector('.background .color-info');

    foregroundInfo.style.color = getLuminance(color1) > 0.5 ? '#000000' : '#FFFFFF';
    backgroundInfo.style.color = getLuminance(color2) > 0.5 ? '#000000' : '#FFFFFF';
}

// Add event listeners
document.getElementById('color1').addEventListener('input', () => updateColorDisplay('color1'));
document.getElementById('color2').addEventListener('input', () => updateColorDisplay('color2'));

// Event Listeners für die Sections
document.querySelectorAll('.color-section').forEach(section => {
    const colorInput = section.querySelector('input[type="color"]');
    
    // Click-Event für die Section
    section.addEventListener('click', (e) => {
        // Verhindert Mehrfach-Trigger auf iOS
        if (e.target === colorInput) return;
        colorInput.click();
    });

    // Touch-Event für iOS
    section.addEventListener('touchend', (e) => {
        // Verhindert Mehrfach-Trigger auf iOS
        if (e.target === colorInput) return;
        colorInput.click();
    });
});

// Initialize display
updateColorDisplay('color1');
updateColorDisplay('color2');
updateContrastRatio(); // Ensure rating display is properly initialized

// Handle browser resize
window.addEventListener('resize', () => {
    updateColorDisplay('color1');
    updateColorDisplay('color2');
});
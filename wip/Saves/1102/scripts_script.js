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
    const minHeight = 80; // minimum height for text visibility
    const maxHeight = window.innerHeight - 120; // viewport height minus padding
    const heightRange = maxHeight - minHeight;

    // Enhanced ratio normalization for more dramatic difference
    // Convert ratio range (1:1 to 21:1) to percentage (0 to 1)
    const normalizedRatio = Math.min((ratio - 1) / 20, 1);
    
    // Calculate heights using a more dramatic curve
    const tallHeight = maxHeight;
    const shortHeight = minHeight + (heightRange * (1 - normalizedRatio));

    // Determine which color gets which height based on luminance
    const foreL = getLuminance(foregroundColor);
    const backL = getLuminance(backgroundColor);
    
    // Higher luminance gets taller height
    const foregroundHeight = foreL > backL ? tallHeight : shortHeight;
    const backgroundHeight = backL > foreL ? tallHeight : shortHeight;

    // Update sections
    const foregroundSection = document.querySelector('.color-section.foreground');
    const backgroundSection = document.querySelector('.color-section.background');

    foregroundSection.style.height = `${foregroundHeight}px`;
    backgroundSection.style.height = `${backgroundHeight}px`;

    // Update colors
    foregroundSection.style.backgroundColor = foregroundColor;
    backgroundSection.style.backgroundColor = backgroundColor;

    // Update text colors - using contrast color for better visibility
    const foregroundInfo = document.querySelector('.foreground .color-info');
    const backgroundInfo = document.querySelector('.background .color-info');
    foregroundInfo.style.color = backgroundColor;
    backgroundInfo.style.color = foregroundColor;

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
    const ratio = getContrastRatio(color1, color2);

    // Update ratio display
    document.getElementById('result').textContent = `${ratio.toFixed(2)}:1`;

    // Update star ratings
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach(star => {
        const level = star.dataset.level;
        const size = star.dataset.size;

        let isActive = false;
        if (size === 'large') {
            isActive = (level === 'AA' && ratio >= 3.0) || (level === 'AAA' && ratio >= 4.5);
        } else {
            isActive = (level === 'AA' && ratio >= 4.5) || (level === 'AAA' && ratio >= 7.0);
        }

        star.classList.toggle('active', isActive);
    });

    // Update text colors based on contrast
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

// Initialize display
updateColorDisplay('color1');
updateColorDisplay('color2');

// Handle browser resize
window.addEventListener('resize', () => {
    updateColorDisplay('color1');
    updateColorDisplay('color2');
});
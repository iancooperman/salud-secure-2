// Word lists for generating passwords in AdjectiveNoun[digit][symbol] format
const adjectives = [
    'happy', 'quick', 'bright', 'calm', 'bold', 'clever', 'brave', 'gentle',
    'jolly', 'kind', 'lively', 'merry', 'noble', 'proud', 'quiet', 'rapid',
    'smart', 'swift', 'warm', 'wise', 'young', 'eager', 'fair', 'grand',
    'keen', 'light', 'mild', 'neat', 'plain', 'rich', 'safe', 'tiny',
    'vast', 'wild', 'zesty', 'cool', 'crisp', 'dark', 'deep', 'dry',
    'dull', 'faint', 'fast', 'firm', 'fresh', 'fuzzy', 'giant', 'green',
    'grey', 'harsh', 'heavy', 'icy', 'loud', 'low', 'odd', 'old',
    'pale', 'pink', 'pure', 'red', 'ripe', 'rough', 'sharp', 'shiny',
    'short', 'sleek', 'slim', 'slow', 'small', 'soft', 'solid', 'sour',
    'steep', 'stiff', 'sweet', 'tall', 'tame', 'thick', 'thin', 'tight',
    'wee', 'wet', 'wide', 'yellow'
];

const nouns = [
    'apple', 'beach', 'bird', 'book', 'bridge', 'cake', 'chair', 'cloud',
    'coin', 'creek', 'crown', 'desk', 'door', 'dream', 'eagle', 'field',
    'flame', 'flower', 'forest', 'garden', 'grape', 'guitar', 'hammer', 'heart',
    'house', 'island', 'juice', 'kite', 'lake', 'lamp', 'lemon', 'light',
    'moon', 'mountain', 'ocean', 'paint', 'paper', 'peach', 'pearl', 'piano',
    'planet', 'plant', 'pond', 'prize', 'queen', 'rain', 'river', 'road',
    'rock', 'rose', 'shell', 'ship', 'silver', 'snow', 'spoon', 'star',
    'stone', 'storm', 'stream', 'sun', 'sword', 'table', 'tower', 'tree',
    'valley', 'violin', 'water', 'wave', 'wheel', 'wind', 'window', 'wing',
    'winter', 'wood', 'zebra'
];

const symbols = ['!', '@', '#', '$', '%', '&', '*', '+', '=', '?'];

// Minimum acceptable zxcvbn score (3 = safely unguessable)
const MIN_SCORE = 3;

// Debug flag
let DEBUG = false;

// Generate a password in the specified format
function generateSimplePassword(format = 'full') {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const digit = Math.floor(Math.random() * 10);

    if (format === 'simple') {
        // adjectivenoun[digit] format (all lowercase)
        return adjective + noun + digit;
    } else {
        // AdjectiveNoun[digit][symbol] format (capitalized)
        const capitalizedAdjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
        const capitalizedNoun = noun.charAt(0).toUpperCase() + noun.slice(1);
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        return capitalizedAdjective + capitalizedNoun + digit + symbol;
    }
}

// Find a password that passes zxcvbn strength checks
function findSimplePassword(format = 'full') {
    const maxAttempts = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const password = generateSimplePassword(format);
        const result = zxcvbn(password);

        if (result.score >= MIN_SCORE) {
            if (DEBUG) {
                console.info(`Password generated after ${attempt + 1} attempts`);
            }
            return { password, result };
        }
    }

    // If we couldn't find one after 1000 attempts, something is wrong
    // Return the last attempt anyway with a warning
    const fallbackPassword = generateSimplePassword(format);
    const fallbackResult = zxcvbn(fallbackPassword);
    if (DEBUG) {
        console.warn('Could not generate password meeting minimum score after 1000 attempts');
    }
    
    return { password: fallbackPassword, result: fallbackResult };
}

// Display the result
function displayResult(password, result) {
    const resultDiv = document.getElementById('result');
    const passwordOutput = document.getElementById('passwordOutput');

    passwordOutput.value = password;

    resultDiv.classList.remove('hidden');
}

// Event listeners
document.getElementById('generateBtn').addEventListener('click', () => {
    const format = document.querySelector('input[name="format"]:checked').value;
    const { password, result } = findSimplePassword(format);
    displayResult(password, result);
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyBtn');

    passwordOutput.select();
    document.execCommand('copy');

    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');

    setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
    }, 2000);
});

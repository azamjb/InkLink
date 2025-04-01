
document.addEventListener("DOMContentLoaded", () => { // waits for page to load (DOM ready)

    document.body.classList.add('fade-in');
    checkPage();

    document.querySelector('.login_form')?.addEventListener('submit', login);

    let logoutButton = document.querySelector('.logout');

    if (logoutButton) {
        logoutButton.addEventListener('click', logout); 
    }

    let addButton = document.querySelector('.add_file');
    if (addButton) {
        addButton.addEventListener('click', addFile);
    }

    const navLinks = document.querySelectorAll('.navbar a:not(.logout)'); // transition effect
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const destination = this.getAttribute('href');

            document.body.classList.add('fade-out');

            setTimeout(() => {
                window.location.href = destination;
            }, 0);
        });
    });


    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');

    inputs.forEach(input => {
        const defaultPlaceholder = input.placeholder;

        input.addEventListener('focus', function () {
            this.placeholder = '';
        });

        input.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                this.placeholder = defaultPlaceholder;
            }
        });
    });
    // clearing placeholders ^


    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const baseFontSize = localStorage.getItem('baseFontSize'); // retrieve font size

    if (baseFontSize) {
        document.body.style.fontSize = baseFontSize + 'px';
    }  

    document.querySelector('.login_form')?.addEventListener('submit', login);



    const readAloudButton = document.getElementById('readAloudButton');
    readAloudButton.addEventListener('click', function () {
        readPageAloud();
    });

    const readTranslationButton = document.getElementById('readTranslationButton');
    readTranslationButton.addEventListener('click', function() {
        readTranslationAloud();
    });

    const startSpeechToTextBtn = document.getElementById('startSpeechToText');
    startSpeechToTextBtn.addEventListener('click', function() {
        handleLiveSpeechToTextAndTranslation();
    });

    const readNoteContentBtn =document.getElementById('readNoteContentButton');
    readNoteContentBtn.addEventListener('click', function() {
        readNoteContent();
    });

    // button functionality ^

    const images = document.querySelectorAll('.navbar .navbar-icons');
    const imagesShown = localStorage.getItem('navbarImagesShown') === 'true';

    images.forEach(function(img) { //    // toggle image visibility functionality
        img.style.display = imagesShown ? 'inline' : 'none';
    });

    const noteInput = document.getElementById('noteInput');
    const languageSelect = document.getElementById('languageSelect');

    if (noteInput && languageSelect) {
        noteInput.addEventListener('input', () => { // live translation functionlaity

            const noteText = noteInput.value;
            const targetLanguage = languageSelect.value;

            translateNoteLive(noteText, targetLanguage);
        });
    } else {

        console.error('Make sure the elements exist in the DOM before attaching event listeners.');
    }

    if (window.SpeechRecognition) {

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Set to continuous listening
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Adjust as necessary
    
        recognition.onstart = () => { // when speech has started
    
            recognizing = true;
        };
    
        recognition.onerror = (event) => {
    
            // Handle errors, possibly restart recognition
            console.error('Speech Recognition Error:', event.error);
            
            if (event.error === "no-speech") {
                recognition.start(); // Restart if no speech detected
            }
        };
    
        recognition.onend = () => {
    
            if (recognizing) {
                recognition.start(); // Restart recognition if still in recognizing state
            } 
        };
    
        recognition.onresult = (event) => {
        let interimTranscript = '';
    
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                    // Call the live translation function for each new final transcript
                    translateNoteLive(finalTranscript, document.getElementById('languageSelect').value);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
    
            // Update the input field with both final and interim transcripts
            noteInput.value = finalTranscript + interimTranscript;
        };
    
        startSpeechToTextBtn.addEventListener('click', () => {
    
            if (recognizing) {
                recognition.stop();
                recognizing = false; // Set recognizing to false to stop restarting
            } else {
                recognition.start();
                recognizing = true;
            }
        });
    
    } else {
        startSpeechToTextBtn.style.display = 'none';
        console.log("Speech Recognition Not Available");
    }

});

var navbar = document.querySelector('.navbar');
let lastScrollTop = 0;
let isReading = false;
let speech;
let recognizing = false; // whether app is currently listening for speech
let recognition;

let finalTranscript = ''; // Store all recognized text

window.addEventListener("scroll", function () { // navbar display based on scroll
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll <= 0) {
        document.querySelector('.navbar').classList.remove('scroll-down');
        document.querySelector('.navbar').classList.add('scroll-up');
    } else if (currentScroll > lastScrollTop) {
        document.querySelector('.navbar').classList.add('scroll-down');
        document.querySelector('.navbar').classList.remove('scroll-up');
    } else {
        document.querySelector('.navbar').classList.add('scroll-up');
        document.querySelector('.navbar').classList.remove('scroll-down');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);


document.addEventListener('mousemove', function (event) { // navbar interaction
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll <= 0) return;

    if (event.clientY <= 100) {
        navbar.classList.add('scroll-up');
        navbar.classList.remove('scroll-down');
    } else {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    }
});


function addFile() { // function for adding a new note

    let filebar = document.querySelector('.files');
    let newFileButton = document.createElement('button');
    newFileButton.textContent = 'My New File';
    newFileButton.addEventListener('click', () => console.log("Go to new note"));
    filebar.appendChild(newFileButton);
}


function checkPage() { // function for redirecting user based on if they are logged in

    let username = localStorage.getItem('username');
    if (window.location.href.includes('login.html') && username)
        window.location = 'notes.html';
    if (window.location.href.includes('notes.html') && !username)
        window.location = 'login.html';
}


function changeFontSize(change) { // function for increasing and decreasig font size

    let baseFontSize = localStorage.getItem('baseFontSize');
    if (!baseFontSize) {
        let style = window.getComputedStyle(document.body, null).getPropertyValue('font-size');
        baseFontSize = parseFloat(style);
        localStorage.setItem('baseFontSize', baseFontSize);
    }

    let newFontSize = parseFloat(baseFontSize) + change;

    document.body.style.fontSize = newFontSize + 'px';

    localStorage.setItem('baseFontSize', newFontSize);
}


function resetFontSize() { // function for resetting font size to default

    localStorage.removeItem('baseFontSize');
    
    document.body.style.fontSize = ''; 

    let elements = document.querySelectorAll('body, body *');
    elements.forEach(el => {
        el.style.fontSize = ''; 
    });
}


function readPageAloud() { // function for reading web page text out loud

    if (isReading) { // toggle start/stop
        window.speechSynthesis.cancel();
        isReading = false;
        return;
    }

    let textToRead = window.getSelection().toString().trim() !== "" ? // highlighted text (ore entire page)
        window.getSelection().toString() :
        document.body.innerText;

    speech = new SpeechSynthesisUtterance(textToRead); // create speech request object
    window.speechSynthesis.speak(speech); // built in web speech API
    isReading = true;

    speech.onend = function () {
        isReading = false;
    };
}


function readTranslationAloud() {

    const translationResult = document.getElementById('translationResult');
    const selectedLanguage = document.getElementById('languageSelect').value;
    
    // get translated text and language code ^

    const voiceMap = {
        'zh-CN': 'zh-CN', // Chinese (Simplified)
        'zh-TW': 'zh-TW', // Chinese (Traditional)
        'nl': 'nl-NL', // Dutch - Netherlands
        'en': 'en-US', // English - United States
        'fr': 'fr-FR', // French - France
        'de': 'de-DE', // German - Germany
        'el': 'el-GR', // Greek - Greece
        'he': 'he-IL', // Hebrew - Israel
        'hi': 'hi-IN', // Hindi - India
        'ga': 'ga-IE', // Irish - Ireland
        'it': 'it-IT', // Italian - Italy
        'ja': 'ja-JP', // Japanese - Japan
        'ko': 'ko-KR', // Korean - Korea
        'la': 'la', // Latin (not commonly supported)
        'ms': 'ms-MY', // Malay - Malaysia
        'fa': 'fa-IR', // Persian - Iran
        'pl': 'pl-PL', // Polish - Poland
        'pt': 'pt-PT', // Portuguese - Portugal
        'ru': 'ru-RU', // Russian - Russia
        'es': 'es-ES', // Spanish - Spain
        'sw': 'sw', // Swahili (not commonly supported)
        'sv': 'sv-SE', // Swedish - Sweden
        'tl': 'tl', // Tagalog (not commonly supported)
        'ta': 'ta-IN', // Tamil - India
        'th': 'th-TH', // Thai - Thailand
        'tr': 'tr-TR', // Turkish - Turkey
        'uk': 'uk-UA', // Ukrainian - Ukraine
        'ur': 'ur-PK', // Urdu - Pakistan
        'vi': 'vi-VN', // Vietnamese - Vietnam
    };
    // language codes for web speech api ^

    const selectedVoiceLang = voiceMap[selectedLanguage] || 'en-US'; // default to English if language not found

    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.lang === selectedVoiceLang); // find corresponding voice

    // If the voice for the selected language is not found, default to the first available voice
    if (!selectedVoice) {
        selectedVoice = voices[0];
    }

    const textToRead = translationResult.innerText.trim();

    const speech = new SpeechSynthesisUtterance(textToRead); // create speech request
    speech.voice = selectedVoice;
    speech.lang = selectedVoiceLang; // Set the language of the speech to the selected language

    speechSynthesis.speak(speech); // read aloud text with language and voice
}


function toggleNavbarImages() { // function to toggle whether icon labels are shown or not

    var images = document.querySelectorAll('.navbar .navbar-icons');

    // Check if the images are currently shown or not
    var imagesShown = localStorage.getItem('navbarImagesShown') === 'true';

    images.forEach(function(img) {
        if (imagesShown) {
            img.style.display = 'none';
        } else {
            img.style.display = 'inline';
        }
    });

    // Save the new state
    localStorage.setItem('navbarImagesShown', !imagesShown);
}


function translateNoteLive(text, targetLanguage) { // function for live text translation (Google Translate API)

    const apiKey = 'AIzaSyAIa-jO0pHLKyLnneaCOiMM5EOv9aNYCHA';  // should not be exposed

    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    fetch(url, { // make post request w/ text and language
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            target: targetLanguage
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.translations.length > 0) {
            const translation = data.data.translations[0].translatedText;
            document.getElementById('translationResult').innerText = translation; // store translated text
        } else {
            throw new Error('Translation failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function login(event) { // function to login a user

    event.preventDefault();

    const usernameInput = document.querySelector('.login_form input[type="text"]');
    const passwordInput = document.querySelector('.login_form input[type="password"]');

    const username = usernameInput.value;
    const password = passwordInput.value;

    // get form inputs ^

    const url = 'http://localhost:3000/login';

    fetch(url, {
        method: 'POST', // make post request to sign in user
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (response.ok) {
                return response.text();

            } else {

                passwordInput.classList.add('shake'); // shake animation for incorrect credentials
                passwordInput.value = '';
                setTimeout(() => passwordInput.classList.remove('shake'), 500);
                throw new Error('Login failed. Please check your username and password.');
            }
        })
        .then(data => {
            console.log(data);
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);

            window.location.href = 'notes.html'; // redirect to notes page
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function logout(event) { // function to log a user out of the app
    event.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = 'index.html'; // return to homepage
}


function handleLiveSpeechToTextAndTranslation() { // function for live speech to text recognition

    if (recognizing) { // toggle
        recognition.stop();
    } else {
        selectedLanguage = document.getElementById('languageSelect').value;
        recognition.lang = convertLanguageCode(selectedLanguage); // Convert to a compatible language code for speech recognition

        recognition.start(); // starts speech recognition (web speech api)
    }
}
 

function readNoteContent() { // function for reading out loud text in the note

    let textToRead = document.getElementById('noteInput').value;
    if (textToRead.trim() === "") {
        alert("No content in the note to read."); 
        return;
    }

    let speech = new SpeechSynthesisUtterance(textToRead);
    window.speechSynthesis.speak(speech); // web speech appi
}
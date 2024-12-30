const sentence = "The quick brown fox jumps over a lazy dog.";
const words = sentence.split(" ");
let currentWordIndex = 0;
let typedSoFar = "";
let startTime = null;
let totalTypedCharacters = 0;
let totalCorrectCharacters = 0;

const typingArea = document.getElementById("typingArea");
const startButton = document.getElementById("startButton");
const resultsElement = document.getElementById("results");

function renderWords() {
    typingArea.innerHTML = words
        .map((word, index) => {
            if (index < currentWordIndex) {
                return `<span class='word completed-word'>${word}</span>`;
            } else if (index === currentWordIndex) {
                const typedPart = typedSoFar;
                const remainingPart = word.slice(typedPart.length);
                return `<span class='word current-word'><span class='typed-part'>${typedPart}</span><span class='remaining-part'>${remainingPart}</span></span>`;
            } else {
                return `<span class='word'>${word}</span>`;
            }
        })
        .join(" ");
}

function startTest() {
    currentWordIndex = 0;
    typedSoFar = "";
    startTime = new Date().getTime();
    totalTypedCharacters = 0;
    totalCorrectCharacters = 0;
    renderWords();
    document.addEventListener("keydown", handleTyping);
}

function endTest() {
    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000; // in seconds
    const wordsPerMinute = (totalTypedCharacters / 5 / timeTaken) * 60; // 5 characters per word

    // Calculate accuracy as a percentage
    const accuracy = totalTypedCharacters === 0 ? 100 : ((totalCorrectCharacters / totalTypedCharacters) * 100).toFixed(2);

    // Display results in the results section
    resultsElement.innerHTML = `
                <p><strong>Time Taken:</strong> ${timeTaken.toFixed(2)} seconds</p>
                <p><strong>Words Per Minute (WPM):</strong> ${wordsPerMinute.toFixed(2)}</p>
                <p><strong>Accuracy:</strong> ${accuracy}%</p>
            `;
    document.removeEventListener("keydown", handleTyping);
}

function handleTyping(event) {
    // If Tab is pressed, restart the test
    if (event.key === "Tab") {
        event.preventDefault(); // Prevent the default behavior of Tab (focus change)
        resultsElement.innerHTML = "";
        startTest();
        return;
    }

    const currentWord = words[currentWordIndex];

    // Check for Ctrl + Backspace to delete the entire typed word
    if (event.ctrlKey && event.key === "Backspace") {
        typedSoFar = ""; // Reset typed so far
        renderWords();
        return;
    }

    if (event.key === " " && typedSoFar === currentWord) {
        // Increment typed characters and correct characters only if the word is typed correctly
        totalTypedCharacters += typedSoFar.length;
        totalCorrectCharacters += typedSoFar.length;

        currentWordIndex++;
        typedSoFar = "";

        // Check if the last word "dog" was typed correctly
        if (currentWordIndex === words.length) {
            endTest();
            return;
        }
    } else if (event.key === "Backspace") {
        typedSoFar = typedSoFar.slice(0, -1);
        totalTypedCharacters--;
    } else if (event.key.length === 1) {
        typedSoFar += event.key;
        totalTypedCharacters++;

        // Check if the typed character is correct
        if (typedSoFar === currentWord.slice(0, typedSoFar.length)) {
            totalCorrectCharacters++;
        }
    }

    renderWords();
}

startButton.addEventListener("click", () => {
    resultsElement.innerHTML = "";
    startTest();
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
        event.preventDefault(); // Prevents the tab from moving focus
        // Trigger the button click
        document.getElementById("startButton").click();
    }
});

// Initialize the test
startTest();

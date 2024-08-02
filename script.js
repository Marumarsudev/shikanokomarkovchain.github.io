
const states = {
    "start": {name: "start", time: 0.2, duration: 0.8, next: [{name: 'shi', chance: 1}]},

    "shi": {name: "shi", time: 0.9, duration: 0.2, next: [{name: 'ka', chance: 0.5}, {name: 'ta', chance: 0.5}]},

    "ka": {name: "ka", time: 1.1, duration: 0.15, next: [{name: 'no', chance: 1}]},

    "no": {name: "no", time: 1.55, duration: 0.2, next: [{name: 'ko', chance: 1}]},

    "ko": {name: "ko", time: 1.7, duration: 0.225, next: [{name: 'shi', chance: 0.25}, {name: 'ko', chance: 0.25}, {name: 'no', chance: 0.5}]},

    "ta": {name: "ta", time: 2.6, duration: 0.35, next: [{name: 'n', chance: 1}]},

    "n": {name: "n", time: 2.7, duration: 0.25, next: [{name: 'e', chance: 0.5}, {name: 'ta', chance: 0.5}]},

    "e": {name: "e", time: 3.2, duration: 0.35, next: [{name: 'shi', chance: 0.5}, {name: 'e', chance: 0.5}]},
}

const stateGraphics = {
    "shi": {x: 0, y: 0, radius: 50},
    "ka": {x: 200, y: -100, radius: 50},
    "no": {x: 400, y: 0, radius: 50},
    "ko": {x: 200, y: 100, radius: 50},
    "ta": {x: -200, y: 100, radius: 50},
    "n": {x: -400, y: 0, radius: 50},
    "e": {x: -200, y: -100, radius: 50},
}

const stateToText = {
    "shi": "し",
    "ka": "か",
    "no": "の",
    "ko": "こ",
    "ta": "た",
    "n": "ん",
    "e": "",
}

let currentState = states.start;

// Setup video and audio elements
const video = document.getElementById('videoElement');

// Setup canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.keys(stateGraphics).forEach((state) => {
        const {x, y, radius} = stateGraphics[state];
        ctx.beginPath();
        ctx.arc(x + window.innerWidth / 2, y + window.innerHeight - window.innerHeight / 4, radius, 0, Math.PI * 2);
        ctx.fillStyle = state === currentState.name ? 'yellow' : 'lightgray';
        ctx.fill();
        ctx.closePath();

        if (state !== "e") {
            ctx.font = '40px Arial'; // Font size and family
            ctx.fillStyle = 'black';  // Text color
            ctx.textAlign = 'center'; // Horizontal alignment
            ctx.fillText(stateToText[state], x + window.innerWidth / 2, 15 + y + window.innerHeight - window.innerHeight / 4);
        }
    });

    requestAnimationFrame(draw);
}

function playFrom(time, timeToPlay) {
    // Ensure the video is ready to play

    video.currentTime = time;
    video.play();

    const startTime = performance.now(); // Get the start time
    const endTime = startTime + (timeToPlay * 1000); // Calculate the end time

    function checkTime(timestamp) {
        if (timestamp >= endTime) {

            // Select the next state based on the chance
            const rand = Math.random();
            let sum = 0;
            let nextStateFound = false;

            for (let i = 0; i < currentState.next.length; i++) {
                sum += currentState.next[i].chance;
                if (rand < sum) {
                    currentState = states[currentState.next[i].name];
                    nextStateFound = true;
                    break;
                }
            }

            // Check if a valid next state was found
            if (nextStateFound) {
                // Schedule the next playback from the new state
                playFrom(currentState.time, currentState.duration);
            } else {
                console.error('No valid next state found.');
            }
        } else {
            requestAnimationFrame(checkTime); // Continue checking
        }
    }

    requestAnimationFrame(checkTime); // Start the checking process

}

playFrom(currentState.time, currentState.duration);

// Start drawing
draw();

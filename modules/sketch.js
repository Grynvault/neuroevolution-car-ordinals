/** @format */

//Constant
const canvWidth = 750;
const canvHeight = 750;
const checkpointsFreq = 1; //higher, lesser checkpoints (skip more checkpoints)

var score = 0;
var gen = 0;
let highscore = 0;
let highscore2 = 0;

let slider;
let sliderX, sliderY; // Position of slider
let sliderWidth = 150,
	sliderHeight = 10; // Slider bar size
let knobX,
	knobSize = 15; // Knob properties
let minValue = 1,
	maxValue = 10,
	sliderValue = 1; // Value range
let dragging = false;

const positionX = canvWidth - 250;

let ray;
let population = [];
let savedParticles = [];
let ystart, yend, xstart, xend;

let pathLines;
let walls;
let start, end;

/* To check progrees */
let gen2;
let done = false;

/* For images */
let car2;
let light;
let tree1;
let location2;

//Font
let fontType;

let rayOn = false;
let speedSlider;

//To display/not-display Rays (aka inputs)
function raySwitchFunc() {
	if (rayOn) {
		rayOn = false;
	} else {
		rayOn = true;
	}
}

// --- p5.js callback to handle window resizing ---
function windowResized() {
	// Calculate the scale factor to fit the canvas within the window.
	// Note: We use canvWidth and canvHeight because they represent the original canvas size.
	const scaleFactor = Math.min(window.innerWidth / canvWidth, window.innerHeight / canvHeight);

	// Apply the CSS transform to the #sketch-id div.
	const sketchDiv = document.getElementById('sketch-id');
	if (sketchDiv && window.innerWidth < 720) {
		sketchDiv.style.transform = `scale(${scaleFactor})`;
		sketchDiv.style.transformOrigin = 'top left';
	}
}

function setup() {
	tf.setBackend('cpu');
	let canv = createCanvas(canvWidth, canvHeight);

	// Create slider
	sliderX = positionX;
	sliderY = 200;
	knobX = map(sliderValue, minValue, maxValue, sliderX, sliderX + sliderWidth);

	// Add font family
	textFont(fontType);

	// Add class
	canv.addClass('canvasClass');
	canv.parent('sketch-id');

	windowResized();

	buildTrack_v3();
	updatePopulation();
}

function draw() {
	let cycles = sliderValue.toFixed(2);

	background(20, 20, 20);

	textSize(19);
	fill(200, 100, 100);
	stroke(255, 200, 100);
	strokeWeight(1.5);
	text(`L E V E L   ${map(pathWidth, 30, 11, 1, 19).toFixed(0)}`, positionX, 40);

	textSize(15);
	fill(255, 200, 200);
	strokeWeight(0.1);
	text(`Population : ${TOTAL}`, positionX, 80);
	text(`Mutation Rate : ${MUTATION_RATE}`, positionX, 110);

	textSize(16);
	fill(255, 100, 100);
	text(`Generation : ${this.gen}`, positionX, 140);

	textSize(15);
	fill(255, 200, 200);
	text(`Speed: x${cycles}`, positionX, 180);

	// Draw slider track
	fill(150);
	rect(sliderX, sliderY, sliderWidth, sliderHeight, 5);

	// Draw knob
	fill(255);
	ellipse(knobX, sliderY + sliderHeight / 2, knobSize);

	// Draw race track
	for (let wall of walls) {
		wall.show();
	}
	addStreetItems();
	addEndpoint();

	let nextLevel = false;

	// Update knob position while dragging
	if (dragging) {
		knobX = constrain(mouseX, sliderX, sliderX + sliderWidth);
		sliderValue = map(knobX, sliderX, sliderX + sliderWidth, minValue, maxValue);
	}

	for (let n = 0; n < cycles; n++) {
		for (let particle of population) {
			particle.look(walls);
			particle.check(checkpoints);
			particle.bounds();
			particle.update();
			particle.show();
		}

		for (let i = population.length - 1; i >= 0; i--) {
			const particle = population[i];

			if (particle.dead || particle.finished) {
				if (particle.finished) {
					nextLevel = true;
				}
				savedParticles.push(population.splice(i, 1)[0]);
			}
		}

		if (population.length == 0) {
			if (nextLevel) {
				if (pathWidth > 11) pathWidth--;
				nextLevel = false;
				// alert('Next Level!');
			}

			nextGeneration();
			buildTrack_v3();
		}
	}

	//Displaying the racing cars
	for (let particle of population) {
		particle.show();
	}
}

// Detect if the mouse is pressed on the knob
function mousePressed() {
	let d = dist(mouseX, mouseY, knobX, sliderY + sliderHeight / 2);
	if (d < knobSize / 2) {
		dragging = true;
	}
}

// Stop dragging when mouse is released
function mouseReleased() {
	dragging = false;
}

function pldistance(p1, p2, x, y) {
	const num = abs((p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x);
	const den = p5.Vector.dist(p1, p2);
	return num / den;
}

function updatePopulation() {
	population = []; // Clear old population
	for (let i = 0; i < TOTAL; i++) {
		population.push(new Particle());
	}
	console.log('Updated TOTAL:', TOTAL, 'New Population Size:', population.length);
}

document.getElementById('totalInput').addEventListener('input', function () {
	TOTAL = parseInt(this.value);
	updatePopulation();
});

function increaseTotal() {
	let input = document.getElementById('totalInput');
	if (TOTAL < 200) {
		TOTAL++;
		input.value = TOTAL;
		updatePopulation();
	}
}

function decreaseTotal() {
	let input = document.getElementById('totalInput');
	if (TOTAL > 1) {
		TOTAL--;
		input.value = TOTAL;
		updatePopulation();
	}
}

document.getElementById('mutationRate').addEventListener('input', function () {
	MUTATION_RATE = parseInt(this.value);
	updatePopulation();
});

function increaseMutation() {
	let input = document.getElementById('mutationRate');
	let value = parseFloat(input.value);
	let step = 0.01;
	let maxValue = 1;

	if (value + step <= maxValue) {
		value += step;
		input.value = value.toFixed(2); // Keeps three decimal places
	} else {
		input.value = maxValue.toFixed(2);
	}

	MUTATION_RATE = value.toFixed(2);
}

function decreaseMutation() {
	let input = document.getElementById('mutationRate');
	let value = parseFloat(input.value);
	let step = 0.01;
	let minValue = 0.001;

	if (value - step >= minValue) {
		value -= step;
		input.value = value.toFixed(2); // Keeps three decimal places
	} else {
		input.value = minValue.toFixed(2);
	}

	MUTATION_RATE = value.toFixed(2);
}

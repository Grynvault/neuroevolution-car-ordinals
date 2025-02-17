/** @format */

function saveArrayToFile(array, filename = 'array.json') {
	const json = JSON.stringify(array); // Convert array to JSON string
	const blob = new Blob([json], { type: 'application/json' }); // Create a Blob
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob); // Create a URL for the Blob
	a.download = filename; // Set the file name
	a.click(); // Trigger the download
}

async function nextGeneration() {
	highscore = 0;
	for (let particle of savedParticles) {
		particle.calculateFitness(end);
		if (particle.newfitness > highscore) {
			highscore = particle.newfitness;
			// console.log('particle.model.getWeights() =>', particle.brain.model.getWeights())

			// if(particle.newfitness > 100000000000000000){
			//     const weights = particle.brain.model.getWeights();
			//     saveArrayToFile(weights, 'weights.json');

			//     await particle.brain.model.save('downloads://my-model');
			// }
		}
	}
	if (highscore > highscore2) {
		highscore2 = highscore;
	}
	this.gen++;
	calculateFitness(end);
	for (let i = 0; i < TOTAL; i++) {
		population[i] = pickOne();
	}
	for (let i = 0; i < TOTAL; i++) {
		savedParticles[i].dispose();
	}
	savedParticles = [];

	if (highscore2 > 7000 && !done && dist <= 22) {
		gen2 = this.gen;
		done = true;
	}
}

function sigmoidFunc(x) {
	return 1 / (1 + exp(-x));
}

function calculateFitness(target) {
	//calculate fitness for each particle
	for (let particle of savedParticles) {
		particle.calculateFitness(target);
	}

	//normalize all values
	let sum = 0;
	for (let particle of savedParticles) {
		sum += particle.newfitness;
	}
	for (let particle of savedParticles) {
		particle.newfitness = particle.newfitness / sum;
	}
}

function pickOne() {
	var index = 0;
	var r = random(1);

	while (r > 0) {
		r = r - savedParticles[index].newfitness;
		index++;
	}
	index--;

	let particle = savedParticles[index];
	let child = new Particle(particle.brain);
	child.mutate();

	return child;
}

/**
 * Initializers
 *
 * @format
 */

let xStart = 70;
let yStart = 0;
let xEnd3 = canvWidth - 200;
let yEnd3 = canvHeight;
let lineStart = { x1: xStart, y1: yStart, x2: xStart, y2: yStart + pathWidth, s: 1 }; //starting point

let probHorz;
let probVert = 0;
let fin;
let fin2;
let count;
let count2;
let vertPermission;

let rightWalls;
let leftWalls;

function buildTrack_v3() {
	checkpoints = [];
	pathLines = [];
	walls = [];

	rightWalls = [];
	leftWalls = [];

	count = 0;
	vertPermission = 0;
	fin = false;
	fin2 = false;

	pathLines.push(lineStart);

	start = createVector(xStart, yStart);

	//Creating path
	for (let i = 0; fin == false; i++) {
		let x1 = pathLines[i].x1;
		let y1 = pathLines[i].y1;
		let x2 = pathLines[i].x2;
		let y2 = pathLines[i].y2;
		let s = pathLines[i].s;

		count = i;

		if (y2 < canvHeight * 0.86) {
			//if previous is vertical
			if (s == 1) {
				if (vertPermission < 1.1) {
					vertD(x2, y2);
					vertPermission++;
				} else if (x2 < canvWidth * 0.6 && x2 > 120) {
					let prob1 = Math.floor(random(10 + probVert));
					vertPermission = 0;

					if (prob1 <= probVert) {
						vertD(x2, y2);
					} else if (prob1 <= 5 && prob1 > probVert) {
						horzL(x2, y2);
					} else {
						horzR(x2, y2);
					}
				} else if (x2 > canvWidth * 0.6 - 30) {
					vertPermission = 0;
					horzL(x2, y2);
				} else {
					vertPermission = 0;
					horzR(x2, y2);
				}
			}

			//if previous is horizontal right
			if (s == 3) {
				if (x2 < canvWidth * 0.72) {
					let prob2 = Math.floor(random(15));

					if (prob2 <= 12) {
						horzR(x2, y2);
					} else {
						vertD(x2, y2);
					}
				} else {
					vertD(x2, y2);
				}
			}

			//if previous is horizontal left
			if (s == 4) {
				if (x2 > 100) {
					let prob2 = Math.floor(random(10));

					if (prob2 <= 7) {
						horzL(x2, y2);
					} else {
						vertD(x2, y2);
					}
				} else {
					vertD(x2, y2);
				}
			}
		} else {
			fin = true;
		}
	}

	//End of the path
	for (let i = count; fin2 == false; i++) {
		let x1 = pathLines[i].x1;
		let y1 = pathLines[i].y1;
		let x2 = pathLines[i].x2;
		let y2 = pathLines[i].y2;
		let s = pathLines[i].s;

		count2 = i;

		if (y2 <= 690) {
			if (s == 1) {
				vertD(x2, y2);
			} else if (s == 3) {
				horzR(x2, y2);
			} else {
				horzL(x2, y2);
			}
		} else {
			fin2 = true;
		}
	}

	vertD(pathLines[count2].x2, pathLines[count2].y2);
	endPath(pathLines[count2 + 1].x2, pathLines[count2 + 1].y2);

	//Categories vertical and horizontal paths for building 'walls'
	for (let i = 0; i < pathLines.length - 1; i++) {
		if (pathLines[i].s == 1 || pathLines[i].s == 2) {
			saveVert(i);
		} else if (pathLines[i].s == 3 || pathLines[i].s == 4) {
			saveHorz(i);
		}
	}

	saveEnd(pathLines.length - 1);

	for (let i = 0; i < leftWalls.length - 1; i++) {
		if (i < rightWalls.length - 1) {
			let x1a = rightWalls[i].x;
			let y1a = rightWalls[i].y;
			let x2a = rightWalls[i + 1].x;
			let y2a = rightWalls[i + 1].y;

			walls.push(new BuildingWalls(x1a, y1a, x2a, y2a));
		}

		let x1b = leftWalls[i].x;
		let y1b = leftWalls[i].y;
		let x2b = leftWalls[i + 1].x;
		let y2b = leftWalls[i + 1].y;

		walls.push(new BuildingWalls(x1b, y1b, x2b, y2b));
	}

	//Creating checkpoints
	for (let i = 0; i < rightWalls.length; i += checkpointsFreq) {
		let x1 = rightWalls[i].x;
		let y1 = rightWalls[i].y;
		let x2 = leftWalls[i + 1].x;
		let y2 = leftWalls[i + 1].y;

		checkpoints.push(new BuildingWalls(x1, y1, x2, y2));
	}

	let bL = rightWalls.length - 1;
	checkpoints.push(new BuildingWalls(rightWalls[bL].x, rightWalls[bL].y, leftWalls[bL + 1].x, leftWalls[bL + 1].y));
}

/********** Vertical walls **************/
function vertD(x1, y1) {
	let x2 = x1;
	let y2 = y1 + pathWidth;

	let p = { x1: x1, y1: y1, x2: x2, y2: y2, s: 1 };
	pathLines.push(p);
}

function saveVert(i) {
	let x1 = pathLines[i].x1;
	let y1 = pathLines[i].y1;
	let nextS = pathLines[i + 1].s;
	let prevS = 1;
	if (i > 0) {
		prevS = pathLines[i - 1].s;
	} else {
		prevS = 1;
	}

	if (nextS != 3 && prevS != 4) {
		rightWalls.push({ x: x1 + pathWidth, y: y1 });
	}

	if (prevS != 3 && nextS != 4) {
		leftWalls.push({ x: x1 - pathWidth, y: y1 });
	}
}

/********** Horizontal walls **************/
function horzR(x1, y1) {
	let x2 = x1 + pathWidth;
	let y2 = y1;

	let p = { x1: x1, y1: y1, x2: x2, y2: y2, s: 3 };
	pathLines.push(p);
}

function horzL(x1, y1) {
	let x2 = x1 - pathWidth;
	let y2 = y1;

	let p = { x1: x1, y1: y1, x2: x2, y2: y2, s: 4 };
	pathLines.push(p);
}

function saveHorz(i) {
	let x1 = pathLines[i].x1;
	let x2 = pathLines[i].x2;
	let y1 = pathLines[i].y1;
	let y2 = pathLines[i].y2;
	let s = pathLines[i].s;
	let nextS = pathLines[i + 1].s;
	let prevS = 1;
	if (i > 0) {
		prevS = pathLines[i - 1].s;
	} else {
		prevS = 1;
	}

	//for right wall
	if (prevS != 1 && s == 3) {
		rightWalls.push({ x: x1, y: y1 - pathWidth });
	}

	if (nextS != 1 && s == 4) {
		rightWalls.push({ x: x1, y: y1 + pathWidth });
	}

	//for lower wall
	if (nextS != 1 && s == 3) {
		leftWalls.push({ x: x1, y: y1 + pathWidth });
	}

	if (prevS != 1 && s == 4) {
		leftWalls.push({ x: x1, y: y1 - pathWidth });
	}
}

/*********** END path **************/
function endPath(x1, y1) {
	let p = { x1: x1, y1: y1, x2: x1, y2: yEnd3, s: 3 };
	pathLines.push(p);

	end = createVector(x1, yEnd3);
}

function saveEnd(i) {
	let x1 = pathLines[i].x1;
	let x2 = pathLines[i].x2;
	let y1 = pathLines[i].y1;
	let y2 = pathLines[i].y2;
	let prevS = 1;
	if (i > 0) {
		prevS = pathLines[i - 1].s;
	} else {
		prevS = 1;
	}

	rightWalls.push({ x: x1 + pathWidth, y: y1 });
	rightWalls.push({ x: x2 + pathWidth, y: y2 });

	leftWalls.push({ x: x1 - pathWidth, y: y1 });
	leftWalls.push({ x: x2 - pathWidth, y: y2 });
}

function createStreetLine() {
	//Algorithm for Street Line:
	for (let i = 1; i < rightWalls.length - 2; i++) {
		let x0 = rightWalls[i - 1].x;
		let y0 = rightWalls[i - 1].y;
		let x1 = rightWalls[i].x;
		let y1 = rightWalls[i].y;
		let x2 = rightWalls[i + 1].x;
		let y2 = rightWalls[i + 1].y;

		let lineColor = 'yellow';
		let strokeW = 0.6;
		let shortenLine = 6;

		//Vertical Line
		if (x1 == x2) {
			stroke(lineColor);
			strokeWeight(strokeW);
			line(x1 - pathWidth, y1 + shortenLine, x2 - pathWidth, y2 - shortenLine);
		}

		if (x0 == x1) {
			stroke(lineColor);
			strokeWeight(strokeW);
			line(x0 - pathWidth, y0 + shortenLine, x1 - pathWidth, y1 - shortenLine);
		}

		//Horizontal Line
		if (y1 == y2) {
			if (x1 < x2) {
				stroke(lineColor);
				strokeWeight(strokeW);
				line(x1 + shortenLine, y1 + pathWidth, x2 - shortenLine, y2 + pathWidth);
			} else {
				stroke(lineColor);
				strokeWeight(strokeW);
				line(x1 - shortenLine, y1 - pathWidth, x2 + shortenLine, y2 - pathWidth);
			}
		}

		//RIGHT side Angled Line (Temporary "hard-coded"):
		//1. More angle
		if (y2 > y1 && x2 != x1 && y2 - y1 < 30) {
			if (x2 > x1) {
				stroke(lineColor);
				strokeWeight(strokeW);
				line(x1 + 8, y1 + 21, x2 - 27, y2 + 3);
			} else {
				stroke(lineColor);
				strokeWeight(strokeW);
				line(x1 - 20, y1 + 5, x2 - 2, y2 - 30);
			}
		}

		//2. Less Angle
		if (y2 > y1 && x2 != x1 && y2 - y1 >= 30) {
			if (x2 > x1) {
				stroke(lineColor);
				strokeWeight(strokeW);
				line(x1 - 10, y1 + 20, x2 - 27, y2 - 12);
			} else {
				stroke(lineColor);
				strokeWeight(strokeW);
				line(x1 - 20, y1 + 5, x2 - 2, y2 - 30);
			}
		}

		let x1b = leftWalls[i + 1].x;
		let y1b = leftWalls[i + 1].y;
		let x2b = leftWalls[i + 2].x;
		let y2b = leftWalls[i + 2].y;

		//LEFT side Angled Line:
		//1. More Angle

		if (y2b > y1b && x2b != x1b && y2b - y1b < 30) {
			if (x2b > x1b) {
				stroke(lineColor);
				strokeWeight(strokeW);
				// line(x1b+23, y1b+5, x2b+6, y2b-29);

				let diffx = (x2b - x1b) / 2;
				let midx = x1b + diffx;
				let diffy = (y2b - y1b) / 2;
				let midy = y1b + diffy;

				let newX = midx + 2 * (midx - x1b);
				let newY = midy - (midy - y1b) / 4;

				let newX1 = newX - diffx / 6;
				let newY1 = newY - diffy / 6;
				let newX2 = newX + diffx / 6;
				let newY2 = newY + diffy / 6;

				let leng = pldistance(newX1, newY1, newX2, newY2);

				stroke(lineColor);
				strokeWeight(strokeW);
				line(newX1, newY1, newX2, newY2);
			} else {
				//find midpoint
				let diffx = (x1b - x2b) / 2;
				let midx = x1b - diffx;
				let diffy = (y2b - y1b) / 2;
				let midy = y1b + diffy;

				let newX = midx + (x1b - midx);
				let newY = midy + (y2b - midy);

				let newX1 = newX - diffx / 4;
				let newY1 = newY + diffy / 4;
				let newX2 = newX1 - diffx / 3;
				let newY2 = newY1 + diffy / 3;

				stroke(lineColor);
				strokeWeight(strokeW);
				line(newX1, newY1, newX2, newY2);
			}
		}
	}
}

function addStreetItems() {
	let lampX = 25;
	let lampY = 40;

	//Algorithm for Street Lamps + Shrubs:
	for (let i = 1; i < rightWalls.length - 2; i += 3) {
		///////RIGHT//////
		let x0a = rightWalls[i - 1].x;
		let y0a = rightWalls[i - 1].y;
		let x1a = rightWalls[i].x;
		let y1a = rightWalls[i].y;

		//For StreetLights
		let midx0 = x1a - (x1a - x0a) / 2;
		let midy0 = y0a + (y1a - y0a) / 2;

		image(light, midx0, midy0 - lampY, lampX, lampY);

		///////LEFT/////
		let x0b = leftWalls[i - 1].x;
		let y0b = leftWalls[i - 1].y;
		let x1b = leftWalls[i].x;
		let y1b = leftWalls[i].y;

		let midx2 = x1b - (x1b - x0b) / 2;
		let midy2 = y1b + (y1b - y0b) / 2;

		image(light, midx2 - 23, midy2 - (lampY + 1), lampX, lampY);
	}
}

function addEndpoint() {
	let x1 = rightWalls[rightWalls.length - 2].x;
	let y1 = rightWalls[rightWalls.length - 2].y;

	image(location2, x1, y1 - 100, 35, 50);
}

/******************************** END V3  **************************************/

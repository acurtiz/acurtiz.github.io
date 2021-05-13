// CS559 Assignment #2: Heirarchical Models
// Alexander Curtis
// 9-18-2016

var canvas, ctx;
var turnRate = 0.002;
var circ1 = [200, 200, "orange", 100];
var circ2 = [500, 500, "purple", 50];
var largerCircR = circ1[3] > circ2[3] ? circ1[3] : circ2[3];
var lenCirc2RotateLine = 100;

function setup() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext('2d');
	main();
}

// apply transformations at the beginning that will effect everything.
function overallTransform() {
	ctx.rotate(0.4);
}

function drawBackground() {
		
	// create a bar at the top
	var x = circ1[0] > circ2[0] ? circ1[0] : circ2[0];
	x += largerCircR;
	var barWidth = 1;
	
	ctx.beginPath();
	ctx.strokeStyle = "blue";
	ctx.lineWidth = barWidth;
	ctx.moveTo(0, 0);
	ctx.lineTo(x, 0);
	ctx.stroke();
	
	// connect that bar to first circle
	ctx.beginPath();
	ctx.strokeStyle = circ1[2];
	ctx.lineWidth = 5;
	ctx.moveTo(circ1[0], barWidth);
	ctx.lineTo(circ1[0], circ1[1]);
	ctx.stroke();
	
	// connect bar to second circle (partially)
	ctx.beginPath();
	ctx.strokeStyle = circ2[2];
	ctx.moveTo(circ2[0], 0);
	ctx.lineTo(circ2[0], circ2[1] - lenCirc2RotateLine);
	ctx.stroke();
}

// draw a circle centered at x, y with radius r that will rotate by theta
// if it's circle 2, we want to rotate the rotating wheel (hence we need the boolean)
// (note: this isn't great software practice...)
function drawCircle(x, y, r, theta, color, isCirc2 = false) {
	ctx.save();
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.lineWidth=10;

	// we want to rotate circle 2 around the last lenCirc2RotateLine pixels of the purple line
	if (isCirc2) {
		
		// translate to the desired point of rotation, and apply the rotation
		ctx.translate(x, y - lenCirc2RotateLine);
		ctx.rotate(theta);
		
		// draw the part of that purple line that should be rotated along with the circle
		ctx.beginPath()
		ctx.strokeStyle = circ2[2];
		ctx.lineWidth = 5;
		ctx.moveTo(0, 0);
		ctx.lineTo(0, lenCirc2RotateLine);
		ctx.stroke();
		
		// in using closePath(), we get a more interesting effect
		// ctx.closePath(); 

		// now we want the circle to rotate at its center, so apply another translation before we draw that circle
		ctx.translate(0, lenCirc2RotateLine);
	} else {
		ctx.translate(x, y);
	}
	
	ctx.rotate(theta);

	// wheel
	ctx.arc(0, 0, r, 0, 2 * Math.PI);

	// draw spokes
	ctx.moveTo(0, 0);
	ctx.lineTo(r, 0);
	ctx.moveTo(0, 0);
	ctx.lineTo(0, r);
	ctx.moveTo(0, 0);
	ctx.lineTo(-r, 0);
	ctx.moveTo(0, 0);
	ctx.lineTo(0, -r);

	ctx.stroke(); 
	ctx.closePath();
	ctx.restore();
}


function main() {
	canvas.width = canvas.width;
	var now = Date.now();
	
	overallTransform();
	drawBackground();
	drawCircle(circ1[0], circ1[1], circ1[3], turnRate * now % (2 * Math.PI), circ1[2]);
	drawCircle(circ2[0], circ2[1], circ2[3], turnRate * 2 * now % (2 * Math.PI), circ2[2], true);
	
	// from https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
	requestAnimationFrame(main);
};

window.onload = setup;

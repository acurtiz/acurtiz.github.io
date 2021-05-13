// CS559 Assignment #3: Heirarchical models in 3D with TWGL
// Alexander Curtis
// 9-30-2016

// References:
// (1) http://graphics.cs.wisc.edu/WP/cs559-fall2016/2016/09/23/programming-assignment-3-hierarchical-modeling-and-transforms-via-twgl-in-3d/
// (2) for alpha transparency: http://stackoverflow.com/questions/2359537/how-to-change-the-opacity-alpha-transparency-of-an-element-in-a-canvas-elemen

function setup() {
	"use strict";
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var m4 = twgl.m4;
  
	var angle = 0;
	var outerScaleFactor = 0;
	var scalePos = true;
	
	var alphaFactor = 0;
	var alphaEn = false;
	function enableAlpha() {
		alphaEn = true;
	}
	setTimeout(enableAlpha, 5000);
	
	// origin location
	var yOffset = 350;
	var xOffset = 350;
	
	function moveToTx(x,y,z,Tx) {
		var loc = [x,y,z];
		var locTx = m4.transformPoint(Tx,loc);
		context.moveTo(locTx[0]+xOffset,-locTx[1]+yOffset);
	}

	function lineToTx(x,y,z,Tx) {
		var loc = [x,y,z];
		var locTx = m4.transformPoint(Tx,loc);
		context.lineTo(locTx[0]+xOffset,-locTx[1]+yOffset);
	}
	
	// alpha is transparency
	function drawBox(l, w, h, color, alpha, Tx) {
		context.save();
		context.globalAlpha = alpha; 
		context.strokeStyle = color;
		context.beginPath();

		// one face
		moveToTx(0,0,0,Tx);
		lineToTx(0,h,0,Tx);
		lineToTx(l,h,0,Tx);
		lineToTx(l,0,0,Tx);
		lineToTx(0,0,0,Tx);
		context.stroke();
		
		// other face
		moveToTx(0,0,w,Tx);
		lineToTx(0,h,w,Tx);
		lineToTx(l,h,w,Tx);
		lineToTx(l,0,w,Tx);
		lineToTx(0,0,w,Tx);
		context.stroke();
		
		// connect the two
		moveToTx(0,0,0,Tx);
		lineToTx(0,0,w,Tx);
		context.stroke();
		
		moveToTx(0,h,0,Tx);
		lineToTx(0,h,w,Tx);
		context.stroke();
		
		moveToTx(l,h,0,Tx);
		lineToTx(l,h,w,Tx);
		context.stroke();
		
		moveToTx(l,0,0,Tx);
		lineToTx(l,0,w,Tx);
		context.stroke();
		context.closePath();
		context.restore();
	}
	
	function drawCube(s, color, Tx) {
		drawBox(s, s, s, color, 1, Tx);
	}
  
  	var mainBoxLength = 200;
	var mainBoxWidth = 100;
	var mainBoxHeight = 100;
	var smallCubeSide = 50 / Math.sqrt(2);
	var outsideBoxLength = (mainBoxLength - smallCubeSide) / 50;
	
	function draw() {
		canvas.width = canvas.width;
   
		// for the large box
		var trans = m4.translation([50,50,0]);
		var rotateStaticX = m4.rotationX(angle / 20);
		var rotateStaticZ = m4.rotationZ(angle / 40);
		var rotateStaticY = m4.rotationY(angle / 10);
		var transMain = m4.multiply(
						  m4.multiply(
						    m4.multiply(rotateStaticX,rotateStaticZ), 
							  rotateStaticY), 
						  trans);
    
		// for the small 4 cubes
		var trans1 = m4.translation([mainBoxLength - smallCubeSide,100,0]);
		var xRotate1 = m4.rotationX(Math.PI / 2 + angle / 4);
		var transformCube1 = m4.multiply(xRotate1, m4.multiply(trans1, transMain));
						
		var trans2 = m4.translation([mainBoxLength - smallCubeSide,100,100]);
		var xRotate2 = m4.rotationX(Math.PI + -angle / 4);
		var transformCube2 = m4.multiply(xRotate2, m4.multiply(trans2, transMain));
		
		var trans3 = m4.translation([mainBoxLength - smallCubeSide,0,100]);
		var xRotate3 = m4.rotationX(3 * Math.PI / 2 + angle / 4);
		var transformCube3 = m4.multiply(xRotate3, m4.multiply(trans3, transMain));
		
		var trans4 = m4.translation([mainBoxLength - smallCubeSide,0,0]);
		var xRotate4 = m4.rotationX(-angle / 4);
		var transformCube4 = m4.multiply(xRotate4, m4.multiply(trans4, transMain));
		
		// for the blue stretching box
		var transOuterBox = m4.translation([0,0,0]);
		var scaleOuter = m4.scaling([outerScaleFactor,1,1]);
		var transformOuter = m4.multiply(scaleOuter, m4.multiply(transOuterBox, transMain));
				
		// draw everything
		drawBox(mainBoxLength, mainBoxWidth, mainBoxHeight, "black", alphaFactor, transMain);
		drawCube(smallCubeSide, "orange", transformCube1);
		drawCube(smallCubeSide, "purple", transformCube2);
		drawCube(smallCubeSide, "red", transformCube3);
		drawCube(smallCubeSide, "green", transformCube4);
		drawBox(outsideBoxLength, mainBoxWidth, mainBoxHeight, "blue", 1, transformOuter);
		
		// update rotation factor, scaling factor, and transparency of main box
		angle += (Math.PI / 20);
		
		if (outerScaleFactor >= 50) scalePos = false;
		if (outerScaleFactor <= 0) scalePos = true;
		if (scalePos) outerScaleFactor += 0.3;
		else outerScaleFactor -= 0.3;
		
		if (alphaEn) {
			if (alphaFactor > 0.95) alphaEn = false;
			alphaFactor += 0.01;
		}
				
		window.requestAnimationFrame(draw);
	}
	draw();
}
window.onload = setup;

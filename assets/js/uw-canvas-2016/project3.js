// CS559 Assignment #4: Heirarchical models in 3D with TWGL, using projection + painter's algorithm
// Alexander Curtis
// 10-05-2016

// References:

function setup() {
    "use strict";
    var canvas = document.getElementById('myCanvas');
	var displaySides = document.getElementById('displaySides');
	var displayTop = document.getElementById('displayTop');
	var displayBottom = document.getElementById('displayBottom');
	var displayWireFrame = document.getElementById('wireFrame');
	
    var context = canvas.getContext('2d');
    var m4 = twgl.m4;
  
    var usePerspectiveProj = true;

    var angle = 0;
    var outerScaleFactor = 0;
    var scalePos = true;
    
    var alphaFactor = 0;
    var alphaEn = false;
    function enableAlpha() {
		alphaEn = true;
    }
    setTimeout(enableAlpha, 5000);

    // Adds otherArr to end of arr in-place - could use concat(), but it creates a new array
    function addToArr(arr, otherArr) {
		Array.prototype.push.apply(arr, otherArr);
    }

    var xOffset = 350;
    var yOffset = 350;    

    // Return array of coordinates after applying transform Tx to (x,y,z) 
    function pointToCoords(x, y, z, Tx) {
		return m4.transformPoint(Tx, [x, y, z]);
    }

    // Return array representing a triangle (this is a trivial function but good for enforcing one format)
    // Really this should be a class...
    function getTriangle(point1, point2, point3, strokeColor, fillColor, alpha) {
		return [point1, point2, point3, strokeColor, fillColor, alpha];
    }

    // Compare two triangle's Z depth, used for painter's algorithm (sorting)
    function compareTriangles(a, b) {
		var aSumZ = a[0][2] + a[1][2] + a[2][2];
		var bSumZ = b[0][2] + b[1][2] + b[2][2];
		if (aSumZ > bSumZ) return -1;
		else return 1;
    }

    // Returns an array of arrays, each representing a triangle, which cumulatively represent a box
    // strokeColor or fillColor being null mean we don't want to stroke or fill that object, respectively
	// sidesToOmit is itself an array containing "sides", "top", and/or "bottom"
    function getBoxInfo(l, w, h, strokeColor, fillColor, alpha, sidesToOmit, Tx) {
		var triangles = [];

		// 4 sides
		if(!sidesToOmit.includes("sides")) {
			triangles.push(getTriangle(pointToCoords(0,0,0,Tx), pointToCoords(0,h,0,Tx), pointToCoords(l,h,0,Tx), 
						   strokeColor, fillColor, alpha));
			triangles.push(getTriangle(pointToCoords(0,0,0,Tx), pointToCoords(l,0,0,Tx), pointToCoords(l,h,0,Tx), 
						   strokeColor, fillColor, alpha));

			triangles.push(getTriangle(pointToCoords(l,0,0,Tx), pointToCoords(l,h,0,Tx), pointToCoords(l,h,w,Tx), 
						   strokeColor, fillColor, alpha));
			triangles.push(getTriangle(pointToCoords(l,0,0,Tx), pointToCoords(l,0,w,Tx), pointToCoords(l,h,w,Tx), 
						   strokeColor, fillColor, alpha));

			triangles.push(getTriangle(pointToCoords(l,0,w,Tx), pointToCoords(l,h,w,Tx), pointToCoords(0,h,w,Tx), 
						   strokeColor, fillColor, alpha));
			triangles.push(getTriangle(pointToCoords(l,0,w,Tx), pointToCoords(0,0,w,Tx), pointToCoords(0,h,w,Tx), 
						   strokeColor, fillColor, alpha));

			triangles.push(getTriangle(pointToCoords(0,0,w,Tx), pointToCoords(0,h,w,Tx), pointToCoords(0,h,0,Tx), 
						   strokeColor, fillColor, alpha));
			triangles.push(getTriangle(pointToCoords(0,0,w,Tx), pointToCoords(0,0,0,Tx), pointToCoords(0,h,0,Tx), 
						   strokeColor, fillColor, alpha));
		}

		// bottom
		if (!sidesToOmit.includes("bottom")) {
			triangles.push(getTriangle(pointToCoords(0,0,0,Tx), pointToCoords(l,0,0,Tx), pointToCoords(l,0,w,Tx), 
						   strokeColor, fillColor, alpha));
			triangles.push(getTriangle(pointToCoords(0,0,0,Tx), pointToCoords(0,0,w,Tx), pointToCoords(l,0,w,Tx), 
						   strokeColor, fillColor, alpha));
		}

		// top
		if (!sidesToOmit.includes("top")) {
			triangles.push(getTriangle(pointToCoords(0,h,0,Tx), pointToCoords(l,h,0,Tx), pointToCoords(l,h,w,Tx),
						   strokeColor, fillColor, alpha));
			triangles.push(getTriangle(pointToCoords(0,h,0,Tx), pointToCoords(0,h,w,Tx), pointToCoords(l,h,w,Tx),
						   strokeColor, fillColor, alpha));
		}

		return triangles;
    }

    // Wrapper for cubes, see getBoxInfo()
    function getCubeInfo(s, strokeColor, fillColor, sidesToOmit, Tx) {
		return getBoxInfo(s, s, s, strokeColor, fillColor, 1, sidesToOmit, Tx);
    }

    // Takes an array representing a single triangle and draws it
    function drawTriangle(triangle) {
		var strokeColor = triangle[3];
		var fillColor = triangle[4];
		var alpha = triangle[5];

		var setAlpha = alpha < 1;
		if (setAlpha) {
			context.save();
			context.globalAlpha = alpha;
		}

		if (fillColor != null) context.fillStyle = fillColor;
		if (strokeColor != null) context.strokeStyle = strokeColor;

		context.beginPath();
		context.moveTo(triangle[0][0], triangle[0][1]);
		context.lineTo(triangle[1][0], triangle[1][1]);
		context.lineTo(triangle[2][0], triangle[2][1]);
		context.closePath();

		if (fillColor != null) context.fill();
		if (strokeColor != null) context.stroke();
		if (setAlpha) context.restore();
	}
	  
	var mainBoxLength = 200;
	var mainBoxWidth = 100;
	var mainBoxHeight = 100;
	var smallCubeSide = 50 / Math.sqrt(2);
	var outsideBoxLength = (mainBoxLength - smallCubeSide) / 50;

	function draw() {
		canvas.width = canvas.width;
		var triangles = []; // everything we will draw eventually

		// transformations for the large box
		var trans = m4.translation([0,0,0]);
		var rotateStaticX = m4.rotationX(angle / 30); 
		var rotateStaticZ = m4.rotationZ(angle / 40); 
		var rotateStaticY = m4.rotationY(angle / 20); 
		var transMain = m4.multiply(m4.multiply(m4.multiply(rotateStaticX,rotateStaticZ), rotateStaticY), trans);
		
		var transLarger = m4.multiply(m4.translation([-100,-150,-150]), transMain);
		
		// transformations for the small 4 cubes
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
		
		// transformations for the blue stretching box
		var transOuterBox = m4.translation([0,0,0]);
		var scaleOuter = m4.scaling([outerScaleFactor,1,1]);
		var transformOuter = m4.multiply(scaleOuter, m4.multiply(transOuterBox, transMain));

		// camera, projection, viewport transformations
		// http://www.codinglabs.net/article_world_view_projection_matrix.aspx
		// http://www.3dgep.com/understanding-the-view-matrix/#Transformations

		// camera: position relative to the eye
		// the lookAt matrix positions the camera, and we take the inverse to move things in front of that camera
		var camera = m4.inverse(m4.lookAt([xOffset,yOffset,100], [0,0,0], [0,1,0]));

		// projection: figure out where the object goes on the screen. two types:
		//  1) orthographic - scale X and Y to fit on screen, objects look same size regardless of distance
		//  2) perspective - objects that are far away look smaller
		// see: https://www.cse.unr.edu/~bebis/CS791E/Notes/PerspectiveProjection.pdf
		var orthoProj = m4.ortho(-300, 300, -300, 300, -5, 5);
		var perspectiveProj = m4.perspective(Math.PI / 2, 1, 5, 10);

		var projToUse = usePerspectiveProj ? perspectiveProj : orthoProj;

		// viewport: map normalized device coordinates into window coordinates
		var viewport = m4.multiply(m4.scaling([200, -200, 200]), m4.translation([xOffset, yOffset, 0]));

		var cpv = m4.multiply(m4.multiply(camera, projToUse), viewport);

		// divide the boxes we want to draw into triangles and place those coordinates into triangles array
		var sidesToOmitLarge = [];
		if (!displaySides.checked) sidesToOmitLarge += "sides";
		if (!displayTop.checked) sidesToOmitLarge += "top";
		if (!displayBottom.checked) sidesToOmitLarge += "bottom";
		
		
		addToArr(triangles, getBoxInfo(450, 400, 400, displayWireFrame.checked ? "black" : "white", displayWireFrame.checked ? null : "black", 1, sidesToOmitLarge, m4.multiply(transLarger, cpv)));
		
		addToArr(triangles, getBoxInfo(mainBoxLength, mainBoxWidth, mainBoxHeight, null, null, alphaFactor, [],
						   m4.multiply(transMain, cpv)));
		
		addToArr(triangles, getBoxInfo(outsideBoxLength, mainBoxWidth, mainBoxHeight, "black", displayWireFrame.checked ? null : "blue", 1, [], m4.multiply(transformOuter, cpv)));
		
		addToArr(triangles, getCubeInfo(smallCubeSide, "black", displayWireFrame.checked ? null : "orange", [], m4.multiply(transformCube1, cpv)));
		addToArr(triangles, getCubeInfo(smallCubeSide, "black", displayWireFrame.checked ? null : "purple", [], m4.multiply(transformCube2, cpv)));
		addToArr(triangles, getCubeInfo(smallCubeSide, "black", displayWireFrame.checked ? null : "red", [], m4.multiply(transformCube3, cpv)));
		addToArr(triangles, getCubeInfo(smallCubeSide, "black", displayWireFrame.checked ? null : "green", [], m4.multiply(transformCube4, cpv)));

		// sort & draw all of those triangles
		triangles.sort(compareTriangles);
		for (var i = 0; i < triangles.length; i++) {
			drawTriangle(triangles[i]);
		}

		// update rotation factor, alpha, scaling
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

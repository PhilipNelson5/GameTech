/* global Demo, Random, QuadTree */
// ------------------------------------------------------------------
//
// This namespace holds the quad-tree demo model.
//
// ------------------------------------------------------------------
Demo.model = (function(components) {
	'use strict';

	var circles = [],
		quadTree = null,
		showQuadTree = true,
		quadTreeCriteria = 6,
		textObjects = {
			text : '',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			pos : { x : 1.05, y : 0.08 }
		},
		textCriteria = {
			text : '',
			font : '16px Arial, sans-serif',
			fill : 'rgba(255, 255, 255, 1)',
			pos : { x : 1.05, y : 0.11 }
		},
		that = {
			get quadTreeCriteria() { return quadTreeCriteria; },
			set quadTreeCriteria(value) {
				if (value >= 3) {
					quadTreeCriteria = value;
					//
					// When changing the criteria, have to rebuild the quad-tree
					buildQuadTree();
				}
			}
		};

	// ------------------------------------------------------------------
	//
	// Takes the current set of circles and builds the quad-tree from them.
	//
	// ------------------------------------------------------------------
	function buildQuadTree() {
		var circle = 0;

		quadTree = QuadTree(quadTreeCriteria);
		for (circle = 0; circle < circles.length; circle += 1) {
			quadTree.insert(circles[circle]);
		}
	}

	// ------------------------------------------------------------------
	//
	// Internal function used to add more circles to the model.
	//
	// ------------------------------------------------------------------
	function addMoreCircles(howManyCircles) {
		var circle = 0,
			addCircle = {},
			intersectsAny = false,
			addedCircles = 0;
		//
		// Randomly generate a bunch of randomly sized circles.
		while (addedCircles < howManyCircles) {
			addCircle = components.Circle( {
				center: { x: Random.nextDouble(), y: Random.nextDouble() },
				direction: Random.nextCircleVector(0.2),
				radius: Math.max(0.0025, Math.abs(Random.nextGaussian(0.01, 0.005)))
			} );
			//
			// Don't allow the circle to start overlapped with the edges of the world
			addCircle.center.x = Math.max(addCircle.radius, addCircle.center.x);
			addCircle.center.x = Math.min(1.0 - addCircle.radius, addCircle.center.x);
			addCircle.center.y = Math.max(addCircle.radius, addCircle.center.y);
			addCircle.center.y = Math.min(1.0 - addCircle.radius, addCircle.center.y);
			//
			// Make sure this circle doesn't intersect/overlap with any of our existing
			// circles.
			intersectsAny = false;
			for (circle = 0; circle < circles.length; circle += 1) {
				if (circles[circle].intersects(addCircle)) {
					intersectsAny = true;
				}
			}
			if (intersectsAny === false) {
				circles.push(addCircle);
				addedCircles += 1;
			}
		}
	}

	// ------------------------------------------------------------------
	//
	// This function initializes the quad-tree demo model.  Only thing it
	// does right now is to add the circles to the model.
	//
	// ------------------------------------------------------------------
	that.initialize = function(howManyCircles) {
		addMoreCircles(howManyCircles);

		//
		// With the circles created, build the quad-tree.
		buildQuadTree();
	};

	// ------------------------------------------------------------------
	//
	// Public member that allows a number circles to be added to the model.
	//
	// ------------------------------------------------------------------
	that.addCircles = function(howManyCircles) {
		addMoreCircles(howManyCircles);

		//
		// Have to rebuild the quad-tree when adding circles.
		buildQuadTree();
	};

	// ------------------------------------------------------------------
	//
	// Public member that allows a number of circles to be removed.
	//
	// ------------------------------------------------------------------
	that.removeCircles = function(howManyCircles) {
		//
		// Just change the length of the circles array to remove the
		// requested circles...easiest way to do this.
		circles.length = Math.max(0, circles.length - howManyCircles);

		//
		// Have to rebuild the quad-tree when removing circles.
		buildQuadTree();
	};

	// ------------------------------------------------------------------
	//
	// Toggles the rendering of the QuadTree.
	//
	// ------------------------------------------------------------------
	that.toggleQuadTreeRendering = function() {
		showQuadTree = !showQuadTree;
	};

	// ------------------------------------------------------------------
	//
	// Overlays a rendering of the QuadTree on top of the world.  This is
	// written as a recursive function that performs a pre-order traversal
	// and rendering.
	//
	// ------------------------------------------------------------------
	function renderQuadTree(renderer, node) {
		var child = 0;
		//
		// Recursively (post-order) work through the nodes and draw their bounds on
		// the way down.
		for (child = 0; child < node.children.length; child += 1) {
			renderQuadTree(renderer, node.children[child]);
		}

		//
		// Only necessary to render the leaf nodes, this provides a small rendering
		// optimization.
		if (!node.hasChildren) {
			renderer.drawRectangle(
				'rgba(100, 100, 100, 1)',
				node.left,
				node.top,
				node.size,
				node.size);
		}
	}

	// ------------------------------------------------------------------
	//
	// This function is used to update the state of the demo model.
	//
	// ------------------------------------------------------------------
	that.update = function(elapsedTime) {

	};

	// ------------------------------------------------------------------
	//
	// This function renders the demo model.
	//
	// ------------------------------------------------------------------
	that.render = function(renderer) {
		var circle = 0;

		for (circle = 0; circle < circles.length; circle += 1) {
			renderer.drawCircle('rgba(150, 0, 255, 1)', circles[circle].center, circles[circle].radius);
		}

		if (showQuadTree) {
			renderQuadTree(renderer, quadTree.root);
		}

		//
		// Draw a border around the unit world.  Draw this after rendering
		// the QuadTree so that it will draw over the border that happens
		// automatically by the QuadTree...we want this color to show.
		renderer.drawRectangle('rgba(255, 255, 255, 1)', 0, 0, 1, 1);

		//
		// Show some stats about the demo
		textObjects.text = 'objects: ' + circles.length;
		renderer.drawText(textObjects);
		textCriteria.text = 'criteria: ' + quadTreeCriteria;
		renderer.drawText(textCriteria);
	};

	return that;

}(Demo.components));
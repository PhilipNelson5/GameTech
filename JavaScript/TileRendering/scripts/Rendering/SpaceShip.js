/* global Demo */

// ------------------------------------------------------------------
//
// Rendering function for a /Components/SpaceShip object.
//
// ------------------------------------------------------------------
Demo.renderer.SpaceShip = (function(core) {
	'use strict';
	var that = {};

	// ------------------------------------------------------------------
	//
	// Renders a Spaceship model.  Because the model can be rotated, that needs
	// to be done here, because the underlying sprite doesn't know
	// anything about rotation.
	//
	// ------------------------------------------------------------------
	that.render = function(sprite) {
		//
		// Do any necessary rotation.
		core.saveContext();
		core.rotateCanvas(sprite.center, sprite.rotation);

		Demo.renderer.Sprite.render(sprite.sprite);

		//
		// This undoes the rotation very quickly
		core.restoreContext();
	};

	return that;
}(Demo.renderer.core));

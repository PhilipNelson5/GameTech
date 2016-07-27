/* global Demo */

// ------------------------------------------------------------------
//
// Rendering function for an /Components/Sprite object.
//
// ------------------------------------------------------------------
Demo.renderer.Sprite = (function(core) {
	'use strict';
	var that = {};

	that.render = function(sprite) {
		//
		// Pick the selected sprite from the sprite sheet to render
		core.drawImage(
			sprite.image,
			sprite.center.x - sprite.width / 2,		// Where to draw the sprite
			sprite.center.y - sprite.height / 2,
			sprite.width, sprite.height, true);
	};

	return that;
}(Demo.renderer.core));

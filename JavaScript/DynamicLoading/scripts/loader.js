/* globals Demo, console, require */

Demo = {
	input: {},
	components: {},
	renderer: {}
};


Demo.loader = (function() {
	'use strict';

	function loadScripts(sources, onComplete, message) {
		require(sources, function() {
			onComplete(message);
		});
	}

	function inputsComplete() {
		loadScripts(['Components/Text'], componentsComplete, 'Components loaded');
	}

	function componentsComplete() {
		loadScripts(['Rendering/core', 'Rendering/Text'], renderingComplete, 'Rendering loaded');
	}

	function renderingComplete() {
		loadScripts(['model'], modelComplete, 'Model loaded');
	}

	function modelComplete() {
		loadScripts(['main'], mainComplete, 'Main loaded');
	}

	function mainComplete() {
		console.log('it is all loaded up');
		Demo.main.initialize();
	}

	//
	// Start with the input scripts, the cascade from there
	console.log('Starting to dynamically load project scripts');
	loadScripts(['Input/Mouse', 'Input/Keyboard'], inputsComplete, 'Inputs loaded');
}());

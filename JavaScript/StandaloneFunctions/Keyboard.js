// Ing. Tomáš Jarůšek, 1/2022

//analogicky jak mys - eventy ale prirazujeme dokumentu, ne canvasu

//hash tabulka paru (jmeno klavesy - je stisknuta)
let keyIsPressed = {};

function ActivateKeyDown()
{
	document.addEventListener
	(
		'keydown', 
		function(event) 
		{
			keyIsPressed[event.key] = true;
		}
	);
}

function ActivateKeyUp()
{
	document.addEventListener
	(
		'keyup', 
		function(event) 
		{	
			keyIsPressed[event.key] = false;
		}
	);
}

//celkova aktivace klavesnice
function ActivateKeyboard()
{
	ActivateKeyUp();
	ActivateKeyDown();
}

//pomocna funkce pro navrat stavu klavesy
function IsKeyPressed(keyCode)
{
	return keyIsPressed[keyCode] === undefined ? false : keyIsPressed[keyCode];
}
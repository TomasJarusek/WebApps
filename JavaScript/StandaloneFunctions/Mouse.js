// Ing. Tomáš Jarůšek, 31.10.2021

// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers

let mouseX = 0;
let mouseY = 0;

let leftMouseButtonIsHeld = false;
let middleMouseButtonIsHeld = false;
let rightMouseButtonIsHeld = false;

let wheelForwardCount = 0;
let wheelBackwardCount = 0;

//podivat se na lepsi konstrukci mozna???
//https://www.w3schools.com/jsref/event_onmousedown.asp
//muzeme pouzit jakoukoliv funkci asi

// https://stackoverflow.com/questions/49907085/accessing-canvas-element-without-getelementbyid
// ke canvasu se da pristoupi i bez get element by id - je vytvoren automaticky

function ActivateOnMouseMove()
{
	canvas.addEventListener
	(
		'mousemove', 
		function(event) 
		{	
			let canvasRelativePosition = canvas.getBoundingClientRect();
			mouseX = event.clientX - canvasRelativePosition.x;
			mouseY = event.clientY - canvasRelativePosition.y;
		}
	);
}

function ActivateOnMouseDown()
{
	canvas.addEventListener
	(
		'mousedown', 
		function(event) 
		{	
			switch(event.which) 
			{
				case 1:
					leftMouseButtonIsHeld = true;
					break;
				case 2:
					middleMouseButtonIsHeld = true;
					break;
				case 3:
					rightMouseButtonIsHeld = true;
					break;
			}
		}
	);
}

function ActivateOnMouseUp()
{
	canvas.addEventListener
	(
		'mouseup', 
		function(event) 
		{	
			switch(event.which) 
			{
				case 1:
					leftMouseButtonIsHeld = false;
					break;
				case 2:
					middleMouseButtonIsHeld = false;
					break;
				case 3:
					rightMouseButtonIsHeld = false;
					break;
			}
		}
	);
}

function ActivateOnWheel()
{
	canvas.addEventListener
	(
		'wheel', 
		function(event) 
		{	
			//deltaX, deltaZ - existuji mysi co maji kolecko do vice smeru - nebereme v uvahu
			if (event.deltaY <= 0)
			{
				wheelForwardCount++;
			}
			else
			{
				wheelBackwardCount++;
			}
		}
	);
}

function ActivateOnWheel()
{
	canvas.addEventListener
	(
		'wheel', 
		function(event) 
		{	
			//deltaX, deltaZ - existuji mysi co maji kolecko do vice smeru - nebereme v uvahu
			if (event.deltaY <= 0)
			{
				wheelForwardCount++;
			}
			else
			{
				wheelBackwardCount++;
			}
		}
	);
}

function ActivateOnMouseover()
{
	canvas.addEventListener
	(
		'mouseover', 
		function(event) 
		{	
			//pokud mys vyjede z canvasu - reset vseho
			leftMouseButtonIsHeld = false;
			middleMouseButtonIsHeld = false;
			rightMouseButtonIsHeld = false;
		}
	);
}

//celkova aktivace mysi
function ActivateMouse()
{
	ActivateOnMouseMove();
	ActivateOnMouseDown();
	ActivateOnMouseUp();
	ActivateOnWheel();
	ActivateOnMouseover();
}
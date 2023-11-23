//Ing. Tomáš Jarůšek, 1.10.2023

//global canvas variables
let startCanvasWidth;
let startCanvasHeight;
let currentCanvasWidth;
let currentCanvasHeight;

let canvasScale = 1;

//canvas scale based on page dimensions
function ScaleCanvas()
{
	canvasContext = canvas.getContext('2d');

    //maximum possible amount of space in pixels for canvas in each direction
	let availableSpaceX;
	let availableSpaceY;

    //calculations are based on the HTML/CSS layout of the page

    //horizontal space calculation

    //menu width is equal to 20% of page width (without scrollbars) with mininimum being 250px /*and maximum being 750px*/
    let menuWidth;
    if ( 0.2*window.innerWidth < 250 )
	{
		menuWidth = 250;
	}
	/*else if ( 0.2*window.innerWidth > 750 )
	{
		menuWidth = 750;
	}*/
	else
	{
		menuWidth = 0.2*window.innerWidth;
	}

	//IMPORTANT - there is a slight issue when the initial state of a page immediately after a load contains a scrollbar (when canvas is by default too big to fit)
	//the calculation takes it into account and sizes accordingly, but because of the resize, it won't be present on the updated screen anymore,
	//so the canvas is going to be smaller then it could be
	//instead of predicting when the scrollbar appears/dissappears, it is going to be kept like this, because the effect is small (only a few pixels difference)

    //window width (without scrollbars) - 3*0.5% margins - menu width - minus scrollbar width - small buffer to make sure that the canvas is going to fit
    availableSpaceX = window.innerWidth - (0.005 + 0.005 + 0.005)*window.innerWidth - menuWidth - (window.innerWidth - document.documentElement.clientWidth) - 0.001*window.innerWidth;

    //vertical space calculation 

    //window height (without scrollbars) - 2*0.5% margins - minus scrollbar width - small buffer to make sure that the canvas is going to fit
	availableSpaceY = window.innerHeight - (0.005 + 0.005)*window.innerHeight - (window.innerHeight - document.documentElement.clientHeight) - 0.001*window.innerHeight;

    //then we calculate the required multiplier in regards to base canvas dimensions
	let horizontalScale = availableSpaceX/startCanvasWidth;
	let verticalScale = availableSpaceY/startCanvasHeight;

    //final canvas scale is always the smaller of the two, because canvas must maintain its aspect ratio and also fit both horizontally and vertically
	if (horizontalScale < verticalScale)
	{
		canvasScale = horizontalScale;
	}
	else
	{
		canvasScale = verticalScale;
	}

	//recalculate current dimensions
	currentCanvasWidth = startCanvasWidth*canvasScale;
	currentCanvasHeight = startCanvasHeight*canvasScale;

	//resize canvas element itself
	canvas.width = currentCanvasWidth;
	canvas.height = currentCanvasHeight;

	//apply transform
	canvasContext.transform(canvasScale, 0, 0, canvasScale, 0, 0);

	//legacy method of scaling canvas manualy using kayboard keys
	/*if (IsKeyPressed("Shift") === true && (IsKeyPressed("ArrowUp") === true || IsKeyPressed("ArrowDown") === true || IsKeyPressed("ArrowLeft") === true || IsKeyPressed("ArrowRight") === true))
	{
		if (IsKeyPressed("ArrowUp") === true)
		{
			canvasScale += 0.001;
		}
		else if (IsKeyPressed("ArrowDown") === true)
		{
			canvasScale -= 0.001;
		}
		else if (IsKeyPressed("ArrowLeft") === true)
		{
			canvasScale -= 0.02;
		}
		else
		{
			canvasScale += 0.02;
		}

		//calculate current dimensions
		currentCanvasWidth = startCanvasWidth*canvasScale;
		currentCanvasHeight = startCanvasHeight*canvasScale;

		//resize canvas element
		canvas.width = currentCanvasWidth;
		canvas.height = currentCanvasHeight;

		//transform drawing
		canvasContext.transform(canvasScale, 0, 0, canvasScale, 0, 0);
	}*/
}

//function that applies current canvas scale to external inputs in order to get coordinates relative to base canvas dimensions
//most likely usage is for the position of mouse cursor
function ApplyCanvasScale(input)
{
	return input/canvasScale;
}

//---------------------------------------------------------------------------------------------------------------------
//version for older projects without html menu

let canvasScale_NoMenu = 1;

function ScaleCanvas_NoMenu()
{
	canvasContext = canvas.getContext('2d');

    let availableSpaceX = window.innerWidth - (0.005 + 0.005)*window.innerWidth - (window.innerWidth - document.documentElement.clientWidth) - 0.001*window.innerWidth;
	let availableSpaceY = window.innerHeight - (0.005 + 0.005)*window.innerHeight - (window.innerHeight - document.documentElement.clientHeight) - 0.001*window.innerHeight;

	let horizontalScale = availableSpaceX/startCanvasWidth;
	let verticalScale = availableSpaceY/startCanvasHeight;

	if (horizontalScale < verticalScale)
	{
		canvasScale_NoMenu = horizontalScale;
	}
	else
	{
		canvasScale_NoMenu = verticalScale;
	}

	currentCanvasWidth = startCanvasWidth*canvasScale_NoMenu;
	currentCanvasHeight = startCanvasHeight*canvasScale_NoMenu;

	canvas.width = currentCanvasWidth;
	canvas.height = currentCanvasHeight;

	canvasContext.transform(canvasScale_NoMenu, 0, 0, canvasScale_NoMenu, 0, 0);
}

function ApplyCanvasScale_NoMenu(input)
{
	return input/canvasScale_NoMenu;
}

//---------------------------------------------------------------------------------------------------------------------
//version for old Number Visualizer project

let canvasScale_Visualizer = 1;

function ScaleCanvas_Visualizer()
{
	canvasContext = canvas.getContext('2d');

    let availableSpaceX = window.innerWidth - (0.005 + 0.005 + 0.005 + 0.005)*window.innerWidth - 0.3*window.innerWidth - (window.innerWidth - document.documentElement.clientWidth) - 0.001*window.innerWidth;
	let availableSpaceY = window.innerHeight - (0.005 + 0.005)*window.innerHeight - (window.innerHeight - document.documentElement.clientHeight) - 0.001*window.innerHeight;

	let horizontalScale = availableSpaceX/startCanvasWidth;
	let verticalScale = availableSpaceY/startCanvasHeight;

	if (horizontalScale < verticalScale)
	{
		canvasScale_NoMenu = horizontalScale;
	}
	else
	{
		canvasScale_NoMenu = verticalScale;
	}

	currentCanvasWidth = startCanvasWidth*canvasScale_NoMenu;
	currentCanvasHeight = startCanvasHeight*canvasScale_NoMenu;

	canvas.width = currentCanvasWidth;
	canvas.height = currentCanvasHeight;

	canvasContext.transform(canvasScale_NoMenu, 0, 0, canvasScale_NoMenu, 0, 0);
}

function ApplyCanvasScale_Visualizer(input)
{
	return input/canvasScale_Visualizer;
}

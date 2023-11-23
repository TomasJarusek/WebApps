//Differential equations
//Ing. Tomas Jarusek, 11/2021

window.onload = function()  
{
	Init();
	ScaleCanvas();
};
window.onresize = ScaleCanvas;

let textBoxTextMode1;
let button1;
let slider1;
let slider2;
let checkbox1;
let checkbox2;

let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

let previousWheelForwardCount = 0;
let previousWheelBackwardCount = 0;
let currentWheelValue = 0;

//inserts HTML elements
function InsertHTMLElements()
{
	textBoxTextMode1 = new CompleteTextBoxTextMode("textBoxTextMode1", "(y/4)*sin(x)" , "Differential equation in a form of dy/dx=[.......]:");
	button1	= new Button("button1", "Button1Function()","Open in WolframAlpha");
	slider1 = new CompleteInputBox("slider1", 10, 200, 0.1, 20, " px", "Slope line step:");
	slider2 = new CompleteInputBox("slider2", 15, 400, 0.1, 20, " px", "Grid step:");
	checkbox1 = new CompleteCheckbox("checkbox1", false, "Show Euler method [red]: ");
	checkbox2 = new CompleteCheckbox("checkbox2", false, "Show Runge-Kutta(RK4) method [green]: ");
}

//synchronization of HTML elements
function SychnronizeHTMLElements()
{
	slider1.SynchronizeInputs();
	slider2.SynchronizeInputs();
}

//inicialization
function Init()
{
	//canvas is declared globally
	context = canvas.getContext('2d');
	
	startCanvasWidth = canvas.width;
	startCanvasHeight = canvas.height;
	currentCanvasWidth = startCanvasWidth;
	currentCanvasHeight = startCanvasHeight;

	//inserts all html elements
	InsertHTMLElements();

	//mouse activation
	ActivateMouse();
	//keyboard activation
	ActivateKeyboard();
	
	//60fps
    window.requestAnimationFrame(processLoop);
}


//aplication loop
function processLoop(timeStamp)
{
	//delta time calculation
	currentFrameTime = performance.now();
	deltaTime = currentFrameTime-previousFrameTime;
	previousFrameTime = currentFrameTime;
	
	//HTML elements synchronization
	SychnronizeHTMLElements();

	//update mouse wheel varibles
	HandleMouseWheelInput();

	//------------ APP LOGIC ------------

	//processes user input equation
	UpdateUserInputFunction();

	//20 wheel turns equals one order of magnitude
	numericalMethodStep = 10**(-currentWheelValue/20);
	
	//these values must be within specified slider range (0 step leads to never ending cycle and who know what negatives will do :D)
	slopeLineStep = slider1.GetValue();
	slopeLineStep = slopeLineStep >= 10 && slopeLineStep <= 200 ? slopeLineStep : 20;
	axisStep = slider2.GetValue();
	axisStep = axisStep >= 12 && axisStep <= 400 ? axisStep : 20;

	//clear canvas
    context.fillStyle = "rgb(250, 250, 250)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);	

	DrawSlopeField(context);

	if (checkbox1.GetValue() === true)
	{
		DrawEulerMethod(context);
	}

	if (checkbox2.GetValue() === true)
	{
		DrawRungeKuttaMethod(context);
	}

	DrawInformation(context, deltaTime, checkbox1.GetValue(), checkbox2.GetValue());
	
    window.requestAnimationFrame(processLoop);
}

//counts the number of wheel turns
function HandleMouseWheelInput()
{
	let forwardWheelChange = wheelForwardCount - previousWheelForwardCount; 
	let backwardWheelChange = wheelBackwardCount - previousWheelBackwardCount;
	
	let totalWheelChange = forwardWheelChange - backwardWheelChange;

	//current state of wheel turns
	currentWheelValue += totalWheelChange;

	previousWheelForwardCount = wheelForwardCount; 
	previousWheelBackwardCount = wheelBackwardCount
}

function Button1Function()
{
	//window.location.replace("http://stackoverflow.com");
	//window.location.href = "http://stackoverflow.com";
	//window.open("http://stackoverflow.com", '_blank').focus();
	
	//open link in new tab (plus sign is no escaped by encodeURI -> manual replace)
	window.open("https://www.wolframalpha.com/input/?i=dy%2Fdx%3D" + encodeURI(previousUserInput).replaceAll("+", "%2B"), '_blank').focus();
}









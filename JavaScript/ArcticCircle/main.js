//Ing. Tomas Jarusek, 1/2021

window.onload = function()  
{
	Init();
	ScaleCanvas();
};
window.onresize = ScaleCanvas;

let aztecDiamondBoard;

let slider1;
let slider2;
let checkbox1;
let checkbox2;
let checkbox3;
let button1;
let button2;

let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

//vlozeni html prvku
function InsertHTMLElements()
{
	slider1 = new CompleteInputBox("slider1", 0, 10, 0.01, 1, "x", "Animation speed multiplier:");
	slider2 = new CompleteInputBox("slider2", 0, 100, 0.01, 50, "%", "Vertical domino spawn probability:");
	checkbox1 = new CompleteCheckbox("checkbox1", false, "Use simplified animation (after reset): ");
	checkbox2 = new CompleteCheckbox("checkbox2", true, "Display arrows: ");
	checkbox3 = new CompleteCheckbox("checkbox3", false, "Display single color: ");
	button1 = new Button("button1", "Button1Function()","Start");
	button2 = new Button("button2", "Button2Function()","Reset");
}


//synchronizace ruznych prvku
function SychnronizeHTMLElements()
{
	slider1.SynchronizeInputs();
	slider2.SynchronizeInputs();
}

//inicializace po spusteni
function Init()
{
	//deklarovat canvas neni potreba, je deklarovany defaultne globalne
	context = canvas.getContext('2d');
	
	startCanvasWidth = canvas.width;
	startCanvasHeight = canvas.height;
	currentCanvasWidth = startCanvasWidth;
	currentCanvasHeight = startCanvasHeight;
	
	//vlozeni html prvku
	InsertHTMLElements();

	//keyboard activation
	ActivateKeyboard();
	
	//vytvoreni grafove strutury
	aztecDiamondBoard = new AztecDiamondBoard(startCanvasWidth/2, startCanvasHeight/2, [0, 0, 1000, 0, 0]);
	
	aplicationTime = 0;
	
	//zacneme cyklit na 60fps
    window.requestAnimationFrame(processLoop);
}

//aplikacni smycka
function processLoop(timeStamp)
{
	//vypocet delta time
	currentFrameTime = performance.now();
	deltaTime = currentFrameTime-previousFrameTime;
	previousFrameTime = currentFrameTime;
	
	//synchronizace html prvku
	SychnronizeHTMLElements();

	//reset canvasu
    context.fillStyle = "rgb(245, 245, 245)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);
	
	aztecDiamondBoard.ManageAnimation(context, deltaTime);
	
    window.requestAnimationFrame(processLoop);
}

//start animating
function Button1Function() 
{	
	aztecDiamondBoard.StartAnimation();
}

//reset animation
function Button2Function() 
{	
	aztecDiamondBoard = new AztecDiamondBoard(startCanvasWidth/2, startCanvasHeight/2, [0,0,1000,0,0]);
}


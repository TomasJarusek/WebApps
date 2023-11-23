//Simple Pendulum
//Ing. Tomas Jarusek, 12/2021

window.onload = function()  
{
	Init();
	ScaleCanvas();
};
window.onresize = ScaleCanvas;

//menu elements
let slider1;
let slider2;
let slider3;
let slider4;
let slider5;
let slider6;
let checkbox1;
let checkbox2;
let button1;
let button2;

//elements of scene
let pendulum;
let angleVelocityPhaseSpace;
let angleGraph;
let velocityGraph;

//ordinary first order differential equations that describe the pendulum
//θ'(t) = θ'(t)
let angleChangeFunction = function(theta, theta_dot){ return theta_dot; };
//θ''(t) = -u*θ'(t) - (g/L)*sin(θ)
let velocityChangeFunction = function(theta, theta_dot){ return -dampingConstant*theta_dot - (forceOfGravity/pendulumLength)*Math.sin(theta); };

//variables describing the pendulum system
let currentAngle;
let currentVelocity;
let dampingConstant;
let forceOfGravity;
let pendulumLength;

//simulation time step
let step = 0.001;

//new state based on current variables
let newAngle;
let newVelocity;

//simulation state
let simulationRunning = false;
//start time
let simulationStartTime = 0;
//current simulation time
let simulationTime = 0;
//time since the start of the program
let programTime = 0;

//lines that are going to be shown in graph
let angleVelocityLineSegments = [];
let timeAngleLineSegments = [];
let timeVelocityLineSegments = [];

//lines that are going to be shown in graph, but have smooth start and end
let angleVelocityLineSegmentsSmooth = [];
let timeAngleLineSegmentsSmooth = [];
let timeVelocityLineSegmentsSmooth = [];

//time of first line shown
let firstPointPlacementTime;
//duration of line duration on screen
let linePersistenceDuration;
//points samples taken per second
let linesPerSecond = 45;

//frame time calculation
let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

//inserts HTML elements
function InsertHTMLElements()
{
	slider1 = new CompleteInputBox("slider1", -3.14, 3.14, 0.01, 0.79, " rad", "Initial angle θ (after reset):");
	slider2 = new CompleteInputBox("slider2", -10, 10, 0.01, 0, " rad/s", "Initial velocity θ' (after reset):");
	slider3 = new CompleteInputBox("slider3", 0, 20, 0.01, 9.82, " m/s²", "Gravitational acceleration:");
	slider4 = new CompleteInputBox("slider4", 0.3, 10, 0.01, 1, " m", "Pendulum length:");
	slider5 = new CompleteInputBox("slider5", 0, 5, 0.01, 0.1, "", "Damping constant:");
	slider6 = new CompleteInputBox("slider6", 0.1, 30, 0.1, 15, " s", "Graph lines persistence:");
	checkbox1 = new CompleteCheckbox("checkbox1", true, "Show simulation information: ");
	checkbox2 = new CompleteCheckbox("checkbox2", false, "Show pendulum information: ");
	button1	= new Button("button1", "Button1Function()", "Start");
	button2	= new Button("button2", "Button2Function()", "Reset");
}

//synchronization of HTML elements
function SychnronizeHTMLElements()
{
	slider1.SynchronizeInputs();
	slider2.SynchronizeInputs();
	slider3.SynchronizeInputs();
	slider4.SynchronizeInputs();
	slider5.SynchronizeInputs();
	slider6.SynchronizeInputs();
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

	//keyboard activation
	ActivateKeyboard();
	
	//create and set up pendulum
	pendulum = new Pendulum();

	//create and set up angle velocity phase space
	angleVelocityPhaseSpace = new Graph2D_Dynamic_VectorField();

	angleVelocityPhaseSpace.SetPositionParameters(25, 25, 687, 625);
    angleVelocityPhaseSpace.SetFollowBorder(100);
    angleVelocityPhaseSpace.SetAxesDrawProperties(1.5, 1.5, 10);
    angleVelocityPhaseSpace.SetAxesScale(50, 50, 75, 25);
    angleVelocityPhaseSpace.SetAxesFontParameters(10, 20, 1, 1, 11);
	angleVelocityPhaseSpace.SetAxesDescription("θ", "θ'", 10, 10, 20);
	angleVelocityPhaseSpace.SetDisplayAxesBackgroundMarkings(false);

	angleVelocityPhaseSpace.SetVectorFunctions(angleChangeFunction, velocityChangeFunction);
	angleVelocityPhaseSpace.SetVectorDrawParameters(30, 1.5, 17.5);

	angleVelocityPhaseSpace.SetDisplayDebug(false);

	//create and set up angle graph
	angleGraph = new Graph2D_Dynamic();

	angleGraph.SetPositionParameters(25, 700, 687, 225);
    angleGraph.SetFollowBorder(20);
    angleGraph.SetAxesDrawProperties(1.5, 1.5, 10);
    angleGraph.SetAxesScale(50, 50, 50, 25);
    angleGraph.SetAxesFontParameters(10, 20, 1, 1, 11);
	angleGraph.SetAxesDescription("t", "θ", 10, 10, 20);
	angleGraph.SetDisplayAxesBackgroundMarkings(true);
	angleGraph.SetAxesBackgroundMarkings(1.5, "rgb(220, 220, 220)");
	//starts a bit moved to the left
	angleGraph.SetViewportOffset(6, 0);

	angleGraph.SetDisplayDebug(false);

	//create and set up velocity graph
	velocityGraph = new Graph2D_Dynamic();

	velocityGraph.SetPositionParameters(738, 700, 687, 225);
    velocityGraph.SetFollowBorder(20);
    velocityGraph.SetAxesDrawProperties(1.5, 1.5, 10);
    velocityGraph.SetAxesScale(50, 50, 50, 10);
    velocityGraph.SetAxesFontParameters(10, 20, 1, 1, 11);
	velocityGraph.SetAxesDescription("t", "θ'", 10, 10, 20);
	velocityGraph.SetDisplayAxesBackgroundMarkings(true);
	velocityGraph.SetAxesBackgroundMarkings(1.5, "rgb(220, 220, 220)");
	//starts a bit moved to the left
	velocityGraph.SetViewportOffset(6, 0);

	velocityGraph.SetDisplayDebug(false);
	
	//disable reset button - technically not necessary - it doesn't do anything
	button2.Disable();

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

	//------------ APP LOGIC ------------

	//clear canvas
    context.fillStyle = "rgb(250, 250, 250)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);

	//refresh simulation parameters

	forceOfGravity = slider3.GetValue();
	pendulumLength = slider4.GetValue();
	//0.3 is min for current visualisation, because otherwise things would overlap
	pendulumLength = pendulumLength > 0.3 ? pendulumLength : 0.3;
	dampingConstant = slider5.GetValue();

	linePersistenceDuration = slider6.GetValue();
	//arbitrary choice really, technicaly it could be as small as 1/linesPerSecond, but there is no point in the line being even shorter
	linePersistenceDuration = linePersistenceDuration > 0.1 ? linePersistenceDuration : 0.1;

	programTime += deltaTime/1000;	

	if (simulationRunning === true)
	{
		//simulation running, update state	

		AdvanceSimulation();			
	}
	else
	{
		//simulation not running, just update angle and velocity from user's input

		currentAngle = slider1.GetValue();
		currentVelocity = slider2.GetValue();
	}

	//draw current state of simulation
	DrawSimulation(context);

    window.requestAnimationFrame(processLoop);
}

//start button
function Button1Function()
{
	//toggle buttons
	button1.Disable();
	button2.Enable();

	//set current simulation time and simulation start time to program time
	simulationStartTime = programTime;
	simulationTime = programTime;

	//push first point into arrays - so it is possible to draw first line segment in the first frame
	angleVelocityLineSegments.push([currentAngle, currentVelocity]);
	timeAngleLineSegments.push([0, currentAngle]);
	timeVelocityLineSegments.push([0, currentVelocity]);
	//first point placement time - based in this the sampling is going to be triggered
	firstPointPlacementTime = programTime;

	//simulation is now running
	simulationRunning = true;
}

//reset buttton
function Button2Function()
{
	//toggle buttons
	button1.Enable();
	button2.Disable();

	//default state for simulatiion times
	simulationStartTime = 0;
	simulationTime = 0;

	//reset lines
	angleVelocityLineSegments = [];
	timeAngleLineSegments = [];
	timeVelocityLineSegments = [];

	//reset smooth line
	angleVelocityLineSegmentsSmooth = [];
	timeAngleLineSegmentsSmooth = [];
	timeVelocityLineSegmentsSmooth = [];

	//reset viewport offsets
	//phase space starts in the center
	angleVelocityPhaseSpace.SetViewportOffset(0, 0);
	//graphs start a bit moved to the left
	angleGraph.SetViewportOffset(6, 0);
	velocityGraph.SetViewportOffset(6, 0);

	//simulation is now stopped
	simulationRunning = false;
}








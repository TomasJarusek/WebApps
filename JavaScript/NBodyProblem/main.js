//Ing. Tomas Jarusek, 01/2022


window.onload = function()  
{
	Init();
	ScaleCanvas();
};
window.onresize = ScaleCanvas;

//canvas
let context;

//mouse wheel state
let previousWheelForwardCount = 0;
let previousWheelBackwardCount = 0;
let currentWheelValue = 0;

//GUI inputs
let dropDownMenu1;
let completeInputBox1;
let checkbox1;
let checkbox2;
let completeInputBox2;
let button1;
let button2;

//simulation parameters
let simulationWindowStartX = 25;
let simulationWindowStartY = 25;
let simulationWindowWidth = 1400;
let simulationWindowHeight = 900;
let simulationWindowCenterX = simulationWindowStartX + simulationWindowWidth/2;
let simulationWindowCenterY = simulationWindowStartY + simulationWindowHeight/2;

//mouse states for placing new body
let mouseState = 0;
let newUserBodyMass;
let newUserBodyPositionX;
let newUserBodyPositionY;
let newUserBodyVelocityX;
let newUserBodyVelocityY;

//simulation state paramters
let currentConfiguration = "Orbiting planets";
let bodiesCount = 0;
let showVelocityVectors = false;

//traces options
let showTraces = true;
let traceLinePersistence = 10;
let linesPerSecond = 30;
//traces paramters for each body
let bodiesFirstPointPlacementTime = [];
let bodiesTrace = [];
let bodiesTraceSmooth = [];

//-----CALCULATIONS PARAMETERS-----

//real world value of gravitational constant
let gravitationalConstant = 0.00000000006674;

//simulations objects paramters are stored in arrays - one body has specific index

//mass of bodies
let bodiesMass = [];

//positions of bodies
let bodiesPositionX = [];
let bodiesPositionY = [];
//velocities of bodies
let bodiesVelocityX = [];
let bodiesVelocityY = [];

//temporary storages for intermmediate results that are going to be passed into Runge-Kutta method calculations
let rungeKuttaIntermediatePositionX = [];
let rungeKuttaIntermediatePositionY = [];
let rungeKuttaIntermediateVelocityX = [];
let rungeKuttaIntermediateVelocityY = [];

//Runge-Kutta calculation parameters
let rungeKuttaK1Parameters = [];
let rungeKuttaK2Parameters = [];
let rungeKuttaK3Parameters = [];
let rungeKuttaK4Parameters = [];

//DIFFERENTIAL EQUATIONS
//standard N-body problem is calculated for three dimensions, however
//this is a simulation of N-body problem only in two dimensions
//this means that for each body, there are going to be four differential equations instead of six
//and the equations have the following form (taken from https://en.wikipedia.org/wiki/Three-body_problem, https://en.wikipedia.org/wiki/N-body_problem):
//GENERAL FORM:
//total acceleration when there are only two bodies looks like this:
//ACCELERATIONab = gravitationConstant*MASSb*((POSa - POSb)/((magnitude(POSa - POSb))^3)) 
//- we only multiply by second mass, because this equation was derived from force equation and force is F = ma, so the whole equation is divided by the first body mass
//- denominator is cubed because: from gravity equation, there is magnitude squared and the other magnitude divison is for vector normalization (shown on N-body problem wiki)
//- this equation is using vectors!!!! - so in reality this differential equation encompases n differential equations, where n is number of dimensions - so two in this simulation
//- equation split is done in following way: when there is just the vector by itself, we just split it into separate dimensions,
//but when there is a vector magninute calculation, it has to be calculated for the whole vector, not just single dimension
//so the final differential equations for single body look like this:
//VELX'a(ACCXa) = G*MASSb*(POSXa - POSXb)/(MAG(POSXa - POSXb)^3) + G*MASSc*(POSXa - POSXc)/(MAG(POSa - POSc)^3) + ...
//VELY'a(ACCYa) = G*MASSb*(POSYa - POSYb)/(MAG(POSYa - POSYb)^3) + G*MASSc*(POSYa - POSYc)/(MAG(POSa - POSc)^3) + ...
//but these are second order differential equations, so the for the calculations we split them into two first order ones each
//POSX'a(VELXa) = VELXa
//POSY'a(VELYa) = VELYa
//these equations can now be numericaly integrated

//equations implementation
//these function can take these arguments:
//- time
//- positions of all bodies in all dimensions
//- velocities of all bodies in all dimensions

//calculations could be performed more efficiently by doing all dimensions of the vector at the same time, but for the sake of clarity and simplicity
//they are completely separated - for example the vector magnitude (in acceleration calculation) is recalculated for every dimension in current state

//POSX'a(VELXa) = VELXa
let bodyPositionXChangeFunction = function (currentBodyIndex, time, bodiesPositionX, bodiesPositionY, bodiesVelocityX,  bodiesVelocityY)
{
	return bodiesVelocityX[currentBodyIndex];
}

//POSY'a(VELYa) = VELYa
let bodyPositionYChangeFunction = function (currentBodyIndex, time, bodiesPositionX, bodiesPositionY, bodiesVelocityX,  bodiesVelocityY)
{
	return bodiesVelocityY[currentBodyIndex];
}

//VELX'a(ACCXa) = G*MASSb*(POSXa - POSXb)/(MAG(POSXa - POSXb)^3) + G*MASSc*(POSXa - POSXc)/(MAG(POSa - POSc)^3) + ...
let bodyVelocityXChangeFunction = function (currentBodyIndex, time, bodiesPositionX, bodiesPositionY, bodiesVelocityX,  bodiesVelocityY)
{
	//total starts at 0
	let velocityChangeX = 0;

	//position of current body
	let currentBodyPositionX = bodiesPositionX[currentBodyIndex];
	let currentBodyPositionY = bodiesPositionY[currentBodyIndex];

	//calculate acceleration
	for (let i = 0; i < bodiesCount; i++)
	{
		//with every other body
		if (i !== currentBodyIndex)
		{
			//magnitude calculation
			let vectorMagnitude = Math.sqrt((currentBodyPositionX - bodiesPositionX[i])**2 + (currentBodyPositionY - bodiesPositionY[i])**2);

			//acceleration between two bodies
			velocityChangeX += bodiesMass[i]*((currentBodyPositionX - bodiesPositionX[i])/(vectorMagnitude**3));
		}
	}

	//final acceleration (gravitational constant can be applied only once at the end to the final result)
	return -gravitationalConstant*velocityChangeX;
}

//VELY'a(ACCYa) = G*MASSb*(POSYa - POSYb)/(MAG(POSYa - POSYb)^3) + G*MASSc*(POSYa - POSYc)/(MAG(POSa - POSc)^3) + ...
let bodyVelocityYChangeFunction = function (currentBodyIndex, time, bodiesPositionX, bodiesPositionY, bodiesVelocityX,  bodiesVelocityY)
{
	let velocityChangeY = 0;

	let currentBodyPositionX = bodiesPositionX[currentBodyIndex];
	let currentBodyPositionY = bodiesPositionY[currentBodyIndex];

	for (let i = 0; i < bodiesCount; i++)
	{
		if (i !== currentBodyIndex)
		{
			let vectorMagnitude = Math.sqrt((currentBodyPositionX - bodiesPositionX[i])**2 + (currentBodyPositionY - bodiesPositionY[i])**2);

			velocityChangeY += bodiesMass[i]*((currentBodyPositionY - bodiesPositionY[i])/(vectorMagnitude**3));
		}
	}

	return -gravitationalConstant*velocityChangeY;
}

//simulation time step
let step = 0.001;

//simulation state
let simulationRunning = false;
//start time
let simulationStartTime = 0;
//current simulation time
let simulationTime = 0;
//time since the start of the program
let programTime = 0;

let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

//inserts HTML elements
function InsertHTMLElements()
{
	completeDropDownMenu1 = new CompleteDropdownMenu("completeDropDownMenu1", ["Orbiting planets", "Single body", "Binary star system", "Three bodies", "Comets", "Random asteroids", "Empty space"], "Starting configuration:");
	completeInputBox1 = new CompleteInputBox("completeInputBox1", 0.1, 60, 0.1, 15, " s", "Traces persistence:");
	checkbox1 = new CompleteCheckbox("checkbox1", true, "Show traces:");
	checkbox2 = new CompleteCheckbox("checkbox2", false, "Show velocity vectors:");
	button1	= new Button("button1", "Button1Function()", "Start");
	button2	= new Button("button2", "Button2Function()", "Reset");
}

//synchronization of HTML elements
function SychnronizeHTMLElements()
{
	completeInputBox1.SynchronizeInputs();
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

	//by default start button is enabled and reset button is disabled 
	button1.Enable();
	button2.Disable();

	//set inital configuration
	SetConfiguration("Orbiting planets");
	
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

	//clear canvas
    context.fillStyle = "rgb(250, 250, 250)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);	

	//this simulation can be computationally expensive with many bodies and because the simulation time is independent from program time,
	//when user would click away and then came back, it could take a long time to catch up with program time and the application would
	//essentially freeze up - so the maximum amount of deltaTime is set to one second
	if (deltaTime < 1000)
	{
		programTime += deltaTime/1000;
	}

	//get current user selected configuuration
	let newConfiguration = completeDropDownMenu1.GetValue();
	if (newConfiguration !== currentConfiguration)
	{
		currentConfiguration = newConfiguration;

		//simulate reset button press
		Button2Function();
	}

	//get user traces persistence
	traceLinePersistence = completeInputBox1.GetValue();
	traceLinePersistence = traceLinePersistence > 0.1 ? traceLinePersistence : 0.1;

	//get user show traces state
	let newShowTraces = checkbox1.GetValue();
	//traces need to be reset, when user enables them (they are running in the background, they are only not shown)
	if (newShowTraces !== showTraces && newShowTraces === true)
	{	
		for (let i = 0; i < bodiesCount; i++)
		{
			bodiesTrace[i] = [];
			bodiesTraceSmooth[i] = [];
		}
	}
	showTraces = newShowTraces;

	//get user show velocity vectors state
	showVelocityVectors = checkbox2.GetValue();

	//update new body mass according to wheel position
	//10 wheel turns equals one order of magnitude
	newUserBodyMass = 100000000000000 * 10**(currentWheelValue/10);
	if (newUserBodyMass < 50000000000000)
	{
		//user chose less than min value - set wheel and weight to min value

		currentWheelValue = -3;
		newUserBodyMass = 50000000000000;
	}

	//mouse inputs processing
	HandleMouseInput();

	if (simulationRunning === true)
	{
		//simulation running, update state	

		AdvanceSimulation();			
	}
	
	DrawSimulation(context);

    window.requestAnimationFrame(processLoop);
}

//start button
function Button1Function()
{
	//toggle buttons
	button1.Disable();
	button2.Enable();

	//set trace first point placement time for all bodies
	for (let i = 0; i < bodiesCount; i++)
	{
		bodiesFirstPointPlacementTime[i] = programTime;
	}

	//set current simulation time and simulation start time to program time
	simulationStartTime = programTime;
	simulationTime = programTime;

	//simulation is now running
	simulationRunning = true;
}

//reset buttton
function Button2Function()
{
	//toggle buttons
	button1.Enable();
	button2.Disable();

	//default state for simulation times
	simulationStartTime = 0;
	simulationTime = 0;

	//reset all variables to default values

	bodiesCount = 0;

	bodiesFirstPointPlacementTime = [];
	bodiesTrace = [];
	bodiesTraceSmooth = [];

	bodiesMass = [];

	bodiesPositionX = [];
	bodiesPositionY = [];
	bodiesVelocityX = [];
	bodiesVelocityY = [];

	rungeKuttaIntermediatePositionX = [];
	rungeKuttaIntermediatePositionY = [];
	rungeKuttaIntermediateVelocityX = [];
	rungeKuttaIntermediateVelocityY = [];

	rungeKuttaK1Parameters = [];
	rungeKuttaK2Parameters = [];
	rungeKuttaK3Parameters = [];
	rungeKuttaK4Parameters = [];

	//place current configuration into the simulation
	SetConfiguration(currentConfiguration);

	//simulation is now stopped
	simulationRunning = false;
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

//places predetermined bodies into simulation
function SetConfiguration(configuration)
{
	if (configuration === "Orbiting planets")
	{
		AddBody(100000000000000000, 0, 0, 0, 0);
		
		AddBody(100000000000000, -100, 0, 0, -258);
		AddBody(100000000000000, 0, -200, 182, 0);
		AddBody(100000000000000, 300, 0, 0, 149);
		AddBody(100000000000000, 0, 400, -129, 0);
	}
	else if (configuration === "Single body")
	{
		AddBody(100000000000000000, 0, 0, 0, 0);
	}
	else if (configuration === "Binary star system")
	{
		AddBody(10000000000000000, -40, 40, 15, 15);
		AddBody(5000000000000000, 40, -40, -31, -32);
	}
	else if (configuration === "Three bodies")
	{
		AddBody(10000000000000000, -400, 250, -10, 40);
		AddBody(10000000000000000, -300, 400, 50, -10);
		AddBody(10000000000000000, -150, 350, -10, -70);
	}
	else if (configuration === "Comets")
	{
		AddBody(100000000000000000, 0, 0, 0, 0);

		AddBody(100000000000000, -400, -400, -30, 30);
		AddBody(100000000000000, 200, -350, -20, -80);
		AddBody(100000000000000, -40, 0, 0, 560);
		AddBody(100000000000000, 130, 200, -20, 150);
		AddBody(100000000000000, -600, 400, -40, -10);
	}
	else if (configuration === "Random asteroids")
	{
		AddBody(10000000000000000, 0, 0, 0, 0);

		for (let i = 0; i < 25; i++)
		{
			AddBody(50000000000000, Math.floor(Math.random() * 1000) - 500, Math.floor(Math.random() * 600) - 300, Math.floor(Math.random() * 100) - 50, Math.floor(Math.random() * 100) - 50);
		}
	}
	else if (configuration === "Empty space")
	{

	}
}

//add new body to simulation
function AddBody(mass, positionX, positionY, velocityX, velocityY)
{
	//increment counter
	bodiesCount++;

	//push mass into array
	bodiesMass.push(mass);

	//push start tracepoint to array
	bodiesTrace.push([[positionX, positionY]]);
	//push empty space for smooth to array
	bodiesTraceSmooth.push([]);

	if (simulationRunning === true)
	{
		//this only happens when simulation is already running, otherwise it is performed after pressing button
		bodiesFirstPointPlacementTime.push(programTime);
	}

	//push position tracepoint to array
	bodiesPositionX.push(positionX);
	bodiesPositionY.push(positionY);

	//push velocity tracepoint to array
	bodiesVelocityX.push(velocityX);
	bodiesVelocityY.push(velocityY);

	//push Runge-Kutta intermmediate variables into arrays (4 + 4 per body)
	rungeKuttaK1Parameters = rungeKuttaK1Parameters.concat([0,0,0,0]);
	rungeKuttaK2Parameters = rungeKuttaK2Parameters.concat([0,0,0,0]);
	rungeKuttaK3Parameters = rungeKuttaK3Parameters.concat([0,0,0,0]);
	rungeKuttaK4Parameters = rungeKuttaK4Parameters.concat([0,0,0,0]);

	rungeKuttaIntermediatePositionX.push(0);
	rungeKuttaIntermediatePositionY.push(0);
	rungeKuttaIntermediateVelocityX.push(0);
	rungeKuttaIntermediateVelocityY.push(0);

}

//remove existing body from simulation
function RemoveBody(index)
{
	//inverse of adding, elements are deleted from arrays

	bodiesCount--;

	bodiesMass.splice(index, 1);

	bodiesTrace.splice(index, 1);
	bodiesTraceSmooth.splice(index, 1);
	bodiesFirstPointPlacementTime.splice(index, 1);

	bodiesPositionX.splice(index, 1);
	bodiesPositionY.splice(index, 1);

	bodiesVelocityX.splice(index, 1);
	bodiesVelocityY.splice(index, 1);

	rungeKuttaK1Parameters.splice(index*4, 4);
	rungeKuttaK2Parameters.splice(index*4, 4);
	rungeKuttaK3Parameters.splice(index*4, 4);
	rungeKuttaK4Parameters.splice(index*4, 4);

	rungeKuttaIntermediatePositionX.splice(index, 1);
	rungeKuttaIntermediatePositionY.splice(index, 1);
	rungeKuttaIntermediateVelocityX.splice(index, 1);
	rungeKuttaIntermediateVelocityY.splice(index, 1);
}


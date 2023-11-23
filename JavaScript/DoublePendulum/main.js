//Double Pendulum
//Ing. Tomas Jarusek, 12/2021

window.onload = function()  
{
	Init();
	ScaleCanvas();
};
window.onresize = ScaleCanvas;

//menu elements
let completeInputBox1;
let completeInputBox2;
let completeInputBox3;
let completeInputBox4;
let completeInputBox5;
let completeInputBox6;
let completeInputBox7;
let completeInputBox8;
let completeInputBox9;
let completeInputBox10;
let completeInputBox11;
let completeInputBox12;
let checkbox1;
let checkbox2;
let checkbox3;
let checkbox4;
let button1;
let button2;

//elements of scene
let doublePendulum;

let firstPendulumCurrentAngle = 3.1415;
let secondPendulumCurrentAngle = 3.1415;
let firstPendulumCurrentVelocity = 0;
let secondPendulumCurrentVelocity = 0;
let firstPendulumLength = 1;
let secondPendulumLength = 1;
let firstPendulumMass = 5;
let secondPendulumMass = 0.1;
let firstPendulumDampingConstant = 0.01;
let secondPendulumDampingConstant = 0.01;
let forceOfGravity = 9.82;

let firstPendulumTraceLinePersistence = 10;
let secondPendulumTraceLinePersistence = 10;
let samplesPerSecond = 60;
let firstPendulumTracepointPlacementTime = 0;
let secondPendulumTracepointPlacementTime = 0;
let showFirstPendulumTrace = false;
let showSecondPendulumTrace = true;

let showPendulumInformation = false;
let showSimulationInformation = true;

//equations with damping term (I have no idea why it has the form it has :D) was taken from
//https://ir.canterbury.ac.nz/bitstream/handle/10092/12659/chen_2008_report.pdf (this document is also downloaded in this project's folder)
//same as https://www.myphysicslab.com/pendulum/double-pendulum-en.html, but without damping and written differently
//EDIT: I think that the principle is explained here https://www.myphysicslab.com/pendulum/chaotic-pendulum-en.html
//(on simple pendulum - damping + external force), but I did not study it further 
//all θ functions are functions of time

//θ₁' = θ₁'
let firstPendulumAngleChangeFunction = 
function(time, firP_theta, secP_theta, firP_theta_prime, secP_theta_prime)
{ 
	return firP_theta_prime; 
};

//θ₂' = θ₂'
let secondPendulumAngleChangeFunction = 
function(time, firP_theta, secP_theta, firP_theta_prime, secP_theta_prime)
{ 
	return secP_theta_prime; 
};

//θ₁'' = -(m₂l₁(θ₁'²)sin(2θ₁ - 2θ₂) + 2m₂l₂(θ₂'²)sin(θ₁ - θ₂) + 2gm₂cos(θ₂)sin(θ₁ - θ₂) +  2gm₁sin(θ₁) + γ₁)/(2l₁(m₁ + m₂(sin(θ₁ - θ₂))²)))
//where γ₁ = 2(k₁θ₁') - 2(k₂θ₂')cos(θ₁ - θ₂)
let firstPendulumVelocityChangeFunction = 
function(time, firP_theta, secP_theta, firP_theta_prime, secP_theta_prime)
{ 
	let deltaAngleSin = Math.sin(firP_theta - secP_theta);

	let firstTerm = secondPendulumMass*firstPendulumLength*firP_theta_prime*firP_theta_prime*Math.sin(2*(firP_theta - secP_theta));
	let secondTerm = 2*secondPendulumMass*secondPendulumLength*secP_theta_prime*secP_theta_prime*deltaAngleSin;
	let thirdTerm = 2*forceOfGravity*secondPendulumMass*Math.cos(secP_theta)*deltaAngleSin;
	let fourthTerm = 2*forceOfGravity*firstPendulumMass*Math.sin(firP_theta);
	let dampingTerm = 2*(firstPendulumDampingConstant*firP_theta_prime) - 2*(secondPendulumDampingConstant*secP_theta_prime)*Math.cos(firP_theta - secP_theta);
	let fifthTerm = 2*firstPendulumLength*(firstPendulumMass + secondPendulumMass*deltaAngleSin*deltaAngleSin);

	return -(firstTerm + secondTerm + thirdTerm + fourthTerm + dampingTerm)/fifthTerm;
};

//θ₂'' = (m₂l₂(θ₂'²)sin(2θ₁ - 2θ₂) + 2(m₁ + m₂)l₁(θ₁'²)sin(θ₁ - θ₂) + 2g(m₁ + m₂)cos(θ₁)sin(θ₁ - θ₂) + γ₂)/(2l₂(m₁ + m₂(sin(θ₁ - θ₂))²)))
//where γ₂ = 2(k₁θ₁')cos(θ₁ - θ₂) - (2(m₁ + m₂)(k₂θ₂'))/m₂
let secondPendulumVelocityChangeFunction = 
function(time, firP_theta, secP_theta, firP_theta_prime, secP_theta_prime)
{ 
	let deltaAngleSin = Math.sin(firP_theta - secP_theta);

	let firstTerm = secondPendulumMass*secondPendulumLength*secP_theta_prime*secP_theta_prime*Math.sin(2*(firP_theta - secP_theta));
	let secondTerm = 2*(firstPendulumMass + secondPendulumMass)*firstPendulumLength*firP_theta_prime*firP_theta_prime*deltaAngleSin;
	let thirdTerm = 2*forceOfGravity*(firstPendulumMass + secondPendulumMass)*Math.cos(firP_theta)*deltaAngleSin;
	let dampingTerm = 2*(firstPendulumDampingConstant*firP_theta_prime)*Math.cos(firP_theta - secP_theta) - (2*(firstPendulumMass + secondPendulumMass)*(secondPendulumDampingConstant*secP_theta_prime))/secondPendulumMass;
	let fourthTerm = 2*secondPendulumLength*(firstPendulumMass + secondPendulumMass*deltaAngleSin*deltaAngleSin);

	return (firstTerm + secondTerm + thirdTerm + dampingTerm)/fourthTerm;
};

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
	completeInputBox1 = new CompleteInputBox("completeInputBox1", -3.14, 3.14, 0.01, 2, " rad", "Angle θ₁ (after reset):");
	completeInputBox2 = new CompleteInputBox("completeInputBox2", -3.14, 3.14, 0.01, 2, " rad", "Angle θ₂ (after reset):");
	completeInputBox3 = new CompleteInputBox("completeInputBox3", -10, 10, 0.01, 0, " rad/s", "Velocity θ₁' (after reset):");
	completeInputBox4 = new CompleteInputBox("completeInputBox4", -10, 10, 0.01, 0, " rad/s", "Velocity θ₂' (after reset):");
	completeInputBox5 = new CompleteInputBox("completeInputBox5", 0.1, 10, 0.01, 1, " m", "Inner rod length l₁:");
	completeInputBox6 = new CompleteInputBox("completeInputBox6", 0.1, 10, 0.01, 1, " m", "Outer rod length l₂:");
	completeInputBox7 = new CompleteInputBox("completeInputBox7", 0.1, 10, 0.01, 1, " kg", "Inner bob mass m₁:");
	completeInputBox8 = new CompleteInputBox("completeInputBox8", 0.1, 10, 0.01, 1, " kg", "Outer bob mass m₂:");
	completeInputBox9 = new CompleteInputBox("completeInputBox9", 0, 5, 0.01, 0, "", "Damping constant:");
	completeInputBox10 = new CompleteInputBox("completeInputBox10", 0, 20, 0.01, 9.82, " m/s²", "Gravitational acceleration:");
	completeInputBox11 = new CompleteInputBox("completeInputBox11", 0.1, 10, 0.1, 1, " s", "First pendulum trace line persistence:");
	completeInputBox12 = new CompleteInputBox("completeInputBox12", 0.1, 100, 0.1, 50, " s", "Second pendulum trace line persistence:");
	checkbox1 = new CompleteCheckbox("checkbox1", false, "Show first pendulum trace:");
	checkbox2 = new CompleteCheckbox("checkbox2", true, "Show second pendulum trace:");
	checkbox3 = new CompleteCheckbox("checkbox3", true, "Show simulation information:");
	checkbox4 = new CompleteCheckbox("checkbox4", false, "Show pendulum information:");
	button1	= new Button("button1", "Button1Function()", "Start");
	button2	= new Button("button2", "Button2Function()", "Reset");
}

//synchronization of HTML elements
function SychnronizeHTMLElements()
{
	completeInputBox1.SynchronizeInputs();
	completeInputBox2.SynchronizeInputs();
	completeInputBox3.SynchronizeInputs();
	completeInputBox4.SynchronizeInputs();
	completeInputBox5.SynchronizeInputs();
	completeInputBox6.SynchronizeInputs();
	completeInputBox7.SynchronizeInputs();
	completeInputBox8.SynchronizeInputs();
	completeInputBox9.SynchronizeInputs();
	completeInputBox10.SynchronizeInputs();
	completeInputBox11.SynchronizeInputs();
	completeInputBox12.SynchronizeInputs();
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
	
	//60fps
    window.requestAnimationFrame(processLoop);

	doublePendulum = new DoublePendulum();
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

	programTime += deltaTime/1000;	

	//get user inputs
	firstPendulumLength = completeInputBox5.GetValue();
	firstPendulumLength = firstPendulumLength > 0.1 ? firstPendulumLength : 0.1;
	secondPendulumLength = completeInputBox6.GetValue();
	secondPendulumLength = secondPendulumLength > 0.1 ? secondPendulumLength : 0.1;
	firstPendulumMass = completeInputBox7.GetValue();
	firstPendulumMass = firstPendulumMass > 0.1 ? firstPendulumMass : 0.1;
	secondPendulumMass = completeInputBox8.GetValue();
	secondPendulumMass = secondPendulumMass > 0.1 ? secondPendulumMass : 0.1;
	firstPendulumDampingConstant = completeInputBox9.GetValue();
	secondPendulumDampingConstant = firstPendulumDampingConstant;
	forceOfGravity = completeInputBox10.GetValue();
	firstPendulumTraceLinePersistence = completeInputBox11.GetValue();
	firstPendulumTraceLinePersistence = firstPendulumTraceLinePersistence > 0.1 ? firstPendulumTraceLinePersistence : 0.1;
	secondPendulumTraceLinePersistence = completeInputBox12.GetValue();
	secondPendulumTraceLinePersistence = secondPendulumTraceLinePersistence > 0.1 ? secondPendulumTraceLinePersistence : 0.1;

	//after disabling traces, arrays are going to be reset
	let newCheckboxValue = checkbox1.GetValue();
	if (newCheckboxValue !== showFirstPendulumTrace && newCheckboxValue === true)
	{
		doublePendulum.ResetFirstPendulumTrace();
	}
	showFirstPendulumTrace = newCheckboxValue;

	newCheckboxValue = checkbox2.GetValue();
	if (newCheckboxValue !== showSecondPendulumTrace && newCheckboxValue === true)
	{
		doublePendulum.ResetSecondPendulumTrace();
	}
	showSecondPendulumTrace = newCheckboxValue;

	showSimulationInformation = checkbox3.GetValue();
	showPendulumInformation = checkbox4.GetValue();

	if (simulationRunning === true)
	{
		//simulation running, update state	

		AdvanceSimulation();			
	}
	else
	{
		//simulation not running, just update angle and velocity from user's input

		firstPendulumCurrentAngle = completeInputBox1.GetValue();
		secondPendulumCurrentAngle = completeInputBox2.GetValue();
		firstPendulumCurrentVelocity = completeInputBox3.GetValue();
		secondPendulumCurrentVelocity = completeInputBox4.GetValue();
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

	//add first tracepoint
	doublePendulum.AddFirstPendulumTracepoint(firstPendulumCurrentAngle, secondPendulumCurrentAngle);
	doublePendulum.AddSecondPendulumTracepoint(firstPendulumCurrentAngle, secondPendulumCurrentAngle);
	//store its placement time
	firstPendulumTracepointPlacementTime = programTime;
	secondPendulumTracepointPlacementTime = programTime;

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

	//reset traces
	doublePendulum.ResetFirstPendulumTrace();
	doublePendulum.ResetSecondPendulumTrace();

	//simulation is now stopped
	simulationRunning = false;
}






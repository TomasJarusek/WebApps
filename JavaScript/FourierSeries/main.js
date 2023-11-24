//Ing. Tomas Jarusek, 11/2023

"use strict";

window.onload = function()  
{
	Init();
	ScaleCanvas();
};
window.onresize = ScaleCanvas;

//canvas
let context;

//animation handler
let animation;
let animationStarted = false;
let animationPaused = false;

//user inputs
let modeDropdownMenu;
let functionToAnalyzeDropdownMenu;
let startResetButtons;
let amplitudeSlider;
let periodSlider;
let horOffsetSlider;
let verOffsetSlider;
let termsSlider;
let animationSpeedSlider;
let pauseContinueButtons;
let functionToAnalyzeCheckbox;

//shown graphs
let startingFunctionGraph;
let sineGraph;
let cosineGraph;
let finalSumGraph;
let absSpectrum;
let argSpectrum;
//result only mode
let startingFunctionGraphResultMode;
let finalSumGraphResultMode;
let absSpectrumResultMode;
let argSpectrumResultMode;

//time variables
let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

//last frame values of user inputs
let modeLastFrame;
let functionLastFrame;
let amplitudeLastFrame;
let periodLastFrame;
let horOffsetLastFrame;
let verOffsetLastFrame;
let termsLastFrame;

//function generation parameters
let dataPointsPerFunction = 5000;
//based on the size of graph starting width and x axis step
//so the function is always within the graph boundaries
let stepX = (590/160)/dataPointsPerFunction;
let startX = -(590/160)/2;
let endX = (590/160)/2;
//result mode
//adjusted to fill whole starting graph window
let dataPointsPerFunctionResultModeDisplay = 2000;
let stepXResultModeDisplay = (1410/160)/dataPointsPerFunctionResultModeDisplay;
let startXResultModeDisplay = -(1410/160)/2;
let endXResultModeDisplay = (1410/160)/2;
//result window is shorter than starting window, so start and end will be different
let resultGraphXMultiplier = 160/325.5;
//just one period for faster calculations
let dataPointsPerFunctionResultModeCalculation = 1000;
let stepXResultModeCalculation = 1/dataPointsPerFunctionResultModeCalculation;
let startXResultModeCalculation = -1/2;
let endXResultModeCalculation = 1/2;

//graph draw parameters
//starting offset for cosine addition to sum
let verticalOffset = 3;
//size of multiplying bars (based on functionToAnalyze parameters)
let multiplyBarFunctionToAnalyzeMiddleY = 0;
let multiplyBarFunctionToAnalyzeLineLength = 2;
let multiplyBarSineCosineMiddleY = 0;
let multiplyBarSineCosineLineLength = 2;

//inserts HTML elements
function InsertHTMLElements()
{
	modeDropdownMenu = new CompleteDropdownMenu("completeDropDownMenu1", ["Show steps", "Show result"], "Application mode:");
	functionToAnalyzeDropdownMenu = new CompleteDropdownMenu("completeDropDownMenu2",
	[
		"Square wave", "Triangle wave", "Sawtooth wave", "Floor function",
		"Sine", "Tangent", "Secant", "Arccosine", "Arctangent", "Arcsecant",
		"Half circle", "Hyperbola",
		"Quadratic", "Cubic", "Quartic", "Square root", "Cube root",
		"Normal distribution",
		"Sinc function", "Sin(x²)"
	], "Function to analyze (x(t)):");
	startResetButtons = new DoubleButton("doubleButton1", "StartButton()", "ResetButton()", "Start", "Reset");
    amplitudeSlider = new CompleteInputBox("slider1", 0.01, 5, 0.001, 1, "", "Amplitude:");
	periodSlider = new CompleteInputBox("slider2", 0.01, 5, 0.001, 1, "", "Period (P₁):");
	horOffsetSlider = new CompleteInputBox("slider3", -0.5, 0.5, 0.001, 0, "", "Horizontal shift:");
	verOffsetSlider = new CompleteInputBox("slider4", -5, 5, 0.001, 0, "", "Vertical shift:");
	termsSlider = new CompleteInputBox("slider5", 0, 20, 1, 10, "", "Maximum term (±k):");
	animationSpeedSlider = new CompleteInputBox("slider6", 0, 10, 0.01, 1, "x", "Animation speed multiplier:");
	pauseContinueButtons = new DoubleButton("doubleButton2", "PauseButton()", "ContinueButton()", "Pause", "Continue");
	functionToAnalyzeCheckbox = new CompleteCheckbox("checkbox1", false, "Show function x(t) under sum s(t):");
}

//synchronization of HTML elements
function SychnronizeHTMLElements()
{
	amplitudeSlider.SynchronizeInputs();
	periodSlider.SynchronizeInputs();
	horOffsetSlider.SynchronizeInputs();
	verOffsetSlider.SynchronizeInputs();
	termsSlider.SynchronizeInputs();
	animationSpeedSlider.SynchronizeInputs();
}

//returns corresponding generating function reference for given user input
function MapMenuInputToFunction(menuInput)
{
	if (menuInput === "Square wave") {return SquareWave;}
	else if (menuInput === "Triangle wave") {return TriangleWave;} 
	else if (menuInput === "Sawtooth wave") {return SawtoothWave;} 
	else if (menuInput === "Sine") {return Sine_period;}
	else if (menuInput === "Quadratic") {return Quadratic;}
	else if (menuInput === "Cubic") {return Cubic;}
	else if (menuInput === "Quartic") {return Quartic;}
	else if (menuInput === "Inverted parabola") {return InvertedParabola;}
	else if (menuInput === "Square root") {return SquareRoot;}
	else if (menuInput === "Cube root") {return CubeRoot;}
	else if (menuInput === "Tangent") {return Tangent;}
	else if (menuInput === "Half circle") {return HalfCircle;}
	else if (menuInput === "Hyperbola") {return Hyperbola;}
	else if (menuInput === "Normal distribution") {return NormalDistribution;}
	else if (menuInput === "Floor function") {return FloorFunction;}
	else if (menuInput === "Sin(x²)") {return SineXSquared;}
	else if (menuInput === "Sinc function") {return SincFunction;}
	else if (menuInput === "Secant") {return Secant;}
	else if (menuInput === "Arctangent") {return Arctangent;}
	else if (menuInput === "Arccosine") {return Arccosine;}
	else if (menuInput === "Arcsecant") {return Arcsecant;}
	else {return SquareWave;}
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

	modeLastFrame = modeDropdownMenu.GetValue();
	functionLastFrame = functionToAnalyzeDropdownMenu.GetValue();
	amplitudeLastFrame = amplitudeSlider.GetValue();
	periodLastFrame = periodSlider.GetValue();
	horOffsetLastFrame = horOffsetSlider.GetValue();
	verOffsetLastFrame = verOffsetSlider.GetValue();
	termsLastFrame = termsSlider.GetValue();

	//init period
	functionToAnalyzePeriod = periodLastFrame;

	//init function selected by user
	functionToAnalyze = GenerateFunctionToAnalyze(MapMenuInputToFunction(functionLastFrame), amplitudeLastFrame, periodLastFrame, horOffsetLastFrame, verOffsetLastFrame, stepX, startX, endX);
	//result mode
	functionToAnalyzeResultModeDisplay = GenerateFunctionToAnalyze(MapMenuInputToFunction(functionLastFrame), amplitudeLastFrame, periodLastFrame, horOffsetLastFrame, verOffsetLastFrame, stepXResultModeDisplay, startXResultModeDisplay, endXResultModeDisplay);
	functionToAnalyzeResultModeCalculation = GenerateFunctionToAnalyze(MapMenuInputToFunction(functionLastFrame), amplitudeLastFrame, periodLastFrame, horOffsetLastFrame, verOffsetLastFrame, stepXResultModeCalculation, startXResultModeCalculation, endXResultModeCalculation);

	//init buttons
	startResetButtons.DisableSecond();
	pauseContinueButtons.DisableFirst();
	pauseContinueButtons.DisableSecond();

	//init animation
	animation = new Animation();

	//init graphs
	startingFunctionGraph = new Graph2D();
	startingFunctionGraph.SetPositionParameters(20, 20, 590, 204);
	startingFunctionGraph.SetAxesDescription("t", "x(t)", 8, 9, 16);
	startingFunctionGraph.SetAxesScale(80, 80, 160, 80);
	startingFunctionGraph.SetDisplayDebug(false);

	cosineGraph = new Graph2D();
	cosineGraph.SetPositionParameters(20, 244, 590, 203);
	cosineGraph.SetAxesDescription("t", "cos(kω₁t)", 8, 9, 16);
	cosineGraph.SetAxesScale(80, 80, 160, 80);
	cosineGraph.SetDisplayDebug(false);

	sineGraph = new Graph2D();
	sineGraph.SetPositionParameters(20, 467, 590, 203);
	sineGraph.SetAxesDescription("t", "sin(kω₁t)", 8, 9, 16);
	sineGraph.SetAxesScale(80, 80, 160, 80);
	sineGraph.SetDisplayDebug(false);

	finalSumGraph = new Graph2D();
	finalSumGraph.SetPositionParameters(630, 20, 800, 650);
	finalSumGraph.SetAxesDescription("t", "s(t)", 8, 9, 16);
	finalSumGraph.SetAxesScale(108.5, 108.5, 217, 108.5);
	finalSumGraph.SetViewportOffset(0, -1.5);
	finalSumGraph.SetDisplayDebug(false);

	absSpectrum = new Graph2D();
	absSpectrum.SetPositionParameters(630, 690, 390, 190);
	absSpectrum.SetAxesDescription("ω", "|cₖ|", 8, 9, 16);
	absSpectrum.SetAxesUnit("π", "");
	//0.6358797408584865 is a result from CalculateMaxValueForArgSpectrum() for default parameters
	absSpectrum.SetAxesScale(36, 40, 9, 160/0.6358797408584865);
	absSpectrum.SetViewportOffset(0, -0.5*0.6358797408584865);
	absSpectrum.SetDisplayDebug(false);

	argSpectrum = new Graph2D();
	argSpectrum.SetPositionParameters(1040, 690, 390, 190);
	argSpectrum.SetAxesDescription("ω", "arg(cₖ)", 8, 9, 16);
	argSpectrum.SetAxesUnit("π", "π");
	argSpectrum.SetAxesScale(36, 40, 9, 80);
	argSpectrum.SetDisplayDebug(false);

	//result only mode
	startingFunctionGraphResultMode = new Graph2D();
	startingFunctionGraphResultMode.SetPositionParameters(20, 20, 1410, 204);
	startingFunctionGraphResultMode.SetAxesDescription("t", "x(t)", 8, 9, 16);
	startingFunctionGraphResultMode.SetAxesScale(80, 80, 160, 80);
	startingFunctionGraphResultMode.SetDisplayDebug(false);

	finalSumGraphResultMode = new Graph2D();
	finalSumGraphResultMode.SetPositionParameters(20, 244, 1410, 426);
	finalSumGraphResultMode.SetAxesDescription("t", "s(t)", 8, 9, 16);
	finalSumGraphResultMode.SetAxesScale(162.75, 162.75, 325.5, 162.75);
	finalSumGraphResultMode.SetDisplayDebug(false);

	absSpectrumResultMode = new Graph2D();
	absSpectrumResultMode.SetPositionParameters(20, 690, 695, 190);
	absSpectrumResultMode.SetAxesDescription("ω", "|cₖ|", 8, 9, 16);
	absSpectrumResultMode.SetAxesUnit("π", "");
	//0.6358797408584865 is a result from CalculateMaxValueForArgSpectrum() for default parameters
	absSpectrumResultMode.SetAxesScale(32, 40, 16, 160/0.6358797408584865);
	absSpectrumResultMode.SetViewportOffset(0, -0.5*0.6358797408584865);
	absSpectrumResultMode.SetDisplayDebug(false);

	argSpectrumResultMode = new Graph2D();
	argSpectrumResultMode.SetPositionParameters(735, 690, 695, 190);
	argSpectrumResultMode.SetAxesDescription("ω", "arg(cₖ)", 8, 9, 16);
	argSpectrumResultMode.SetAxesUnit("π", "π");
	argSpectrumResultMode.SetAxesScale(32, 40, 16, 80);
	argSpectrumResultMode.SetDisplayDebug(false);

	//60fps
    window.requestAnimationFrame(processLoop);
}

//aplication loop
function processLoop()
{
	//delta time calculation
	currentFrameTime = performance.now();
	deltaTime = currentFrameTime-previousFrameTime;
	previousFrameTime = currentFrameTime;
	
	//HTML elements synchronization
	SychnronizeHTMLElements();

	//------------ APP LOGIC ------------

	if (deltaTime > 20)
	{
		console.log(deltaTime);
	}

	//clear canvas
    context.fillStyle = "rgb(250, 250, 250)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);

	//update settings based on user inputs if necessary
	CheckIfUserInputsChanged();

	if (modeDropdownMenu.GetValue() === "Show steps")
	{
		//animation pause is achieved by setting delta time to 0
		deltaTime = animationPaused == false ? deltaTime*animationSpeedSlider.GetValue() : 0;

		//draw everything, that is not part of animation
		DrawStaticElements(context, functionToAnalyzeCheckbox.GetValue());
		//draw current state of animation
		animation.DrawFiniteAnimation(deltaTime);
	}
	else
	{
		//calculate fourier series coefficients at once
		CalculateFourierSeriesResultMode();
		//draw everything
		DrawResultModeElements(context, functionToAnalyzeCheckbox.GetValue());
	}

    window.requestAnimationFrame(processLoop);
}

//checks if settings need updating based on user input
function CheckIfUserInputsChanged()
{
	//get current frame values
	let modeCurrentFrame = modeDropdownMenu.GetValue();
	let functionCurrentFrame = functionToAnalyzeDropdownMenu.GetValue();
	let amplitudeCurrentFrame = amplitudeSlider.GetValue();
	let periodCurrentFrame = periodSlider.GetValue();
	let horOffsetCurrentFrame = horOffsetSlider.GetValue();
	let verOffsetCurrentFrame = verOffsetSlider.GetValue();
	//only whole numbers
	let termsCurrentFrame = Math.floor(termsSlider.GetValue());

	//amplitudeCurrentFrame <= 0 would break graph scaling and most likely the calculation as well
	if (amplitudeCurrentFrame <= 0)
	{
		amplitudeCurrentFrame = 1;
	}

	//same for period
	if (periodCurrentFrame <= 0)
	{
		periodCurrentFrame = 1;
	}

	//0th term uses scaling for 1st term
	//new variable is required, because it is only problem for scaling, other value 0 is valid
	let checkedTermsCurrentFrame = termsCurrentFrame !== 0 ? termsCurrentFrame : 1;

	let modeChanged = false;

	//reset and setup things when mode changes
	if (modeCurrentFrame !== modeLastFrame)
	{
		modeChanged = true;

		if (modeCurrentFrame === "Show steps")
		{
			//simulate reset button press
			ResetButton();

			//show buttons and sider
			startResetButtons.Show();
			pauseContinueButtons.Show();
			animationSpeedSlider.Show();
		}
		else
		{
			//set global final term number
			finalTermNumber = termsSlider.GetValue();

			//other stuff like coefficients if going to be reset during calculation itself

			//hide buttons slider
			startResetButtons.Hide();
			pauseContinueButtons.Hide();
			animationSpeedSlider.Hide();
		}
	}

	if (modeCurrentFrame === "Show steps")
	{
		//setting can't be changed when animation is in progress
		if (animationStarted === true)
		{
			return;
		}

		//comparison of current frame values with last frame values
		//if user inputs are different, most likely in addition to regenerating function to analyze,
		//it is going to be required to change graph scaling as well

		let regenerateFunction = false;

		if (functionLastFrame !== functionCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;
		}

		if (amplitudeLastFrame !== amplitudeCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;

			startingFunctionGraph.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/amplitudeCurrentFrame);

			//for sine and cosine, there has to be space for multiplying, so both amplitude and offset are taken into account
			cosineGraph.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/(amplitudeCurrentFrame + Math.abs(verOffsetCurrentFrame)));
			sineGraph.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/(amplitudeCurrentFrame + Math.abs(verOffsetCurrentFrame)));

			finalSumGraph.SetAxesScale(108.5, 108.5, 217/periodCurrentFrame, 108.5/amplitudeCurrentFrame);
			finalSumGraph.SetViewportOffset(0, -1.5*amplitudeCurrentFrame - verOffsetCurrentFrame);

			//vertical offset needs to change as well depending on the size of current cosines and sum,
			//so there is enough space - both amplitude and offset must be taken into account
			verticalOffset = 3*amplitudeCurrentFrame + verOffsetCurrentFrame;

			multiplyBarFunctionToAnalyzeMiddleY = verOffsetCurrentFrame;
			multiplyBarFunctionToAnalyzeLineLength = 2*amplitudeCurrentFrame;
			multiplyBarSineCosineMiddleY = 0;
			multiplyBarSineCosineLineLength = 2*(amplitudeCurrentFrame + Math.abs(verOffsetCurrentFrame));
		}

		if (periodLastFrame !== periodCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;

			startingFunctionGraph.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/amplitudeCurrentFrame);

			cosineGraph.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/(amplitudeCurrentFrame + Math.abs(verOffsetCurrentFrame)));
			sineGraph.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/(amplitudeCurrentFrame + Math.abs(verOffsetCurrentFrame)));

			finalSumGraph.SetAxesScale(108.5, 108.5, 217/periodCurrentFrame, 108.5/amplitudeCurrentFrame);

			multiplyBarFunctionToAnalyzeMiddleY = verOffsetCurrentFrame;
			multiplyBarFunctionToAnalyzeLineLength = 2*amplitudeCurrentFrame;
			multiplyBarSineCosineMiddleY = 0;
			multiplyBarSineCosineLineLength = 2*(amplitudeCurrentFrame + Math.abs(verOffsetCurrentFrame));
		}

		if (horOffsetLastFrame !== horOffsetCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;
		}

		if (verOffsetLastFrame !== verOffsetCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;
		
			startingFunctionGraph.SetViewportOffset(0, -verOffsetCurrentFrame);

			cosineGraph.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/(amplitudeCurrentFrame + Math.abs(verOffsetCurrentFrame)));
			sineGraph.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/(amplitudeCurrentFrame + Math.abs(verOffsetCurrentFrame)));

			finalSumGraph.SetAxesScale(108.5, 108.5, 217/periodCurrentFrame, 108.5/amplitudeCurrentFrame);
			finalSumGraph.SetViewportOffset(0, -1.5*amplitudeCurrentFrame - verOffsetCurrentFrame);

			verticalOffset = 3*amplitudeCurrentFrame + verOffsetCurrentFrame;

			multiplyBarFunctionToAnalyzeMiddleY = verOffsetCurrentFrame;
			multiplyBarFunctionToAnalyzeLineLength = 2*amplitudeCurrentFrame;
			multiplyBarSineCosineMiddleY = 0;
			multiplyBarSineCosineLineLength = 2*(amplitudeCurrentFrame + Math.abs(verOffsetCurrentFrame));
		}

		if (termsLastFrame != termsCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;
		}

		//function regeneration
		if (regenerateFunction === true || modeChanged === true)
		{
			//update period
			functionToAnalyzePeriod = periodCurrentFrame;

			//recalculate step and endpoints based on graph sizes
			stepX = (590/(160/periodCurrentFrame))/dataPointsPerFunction;
			startX = -(590/(160/periodCurrentFrame))/2;
			endX = (590/(160/periodCurrentFrame))/2;

			//regenerate function itself
			functionToAnalyze = GenerateFunctionToAnalyze(MapMenuInputToFunction(functionCurrentFrame), amplitudeCurrentFrame, periodCurrentFrame, horOffsetCurrentFrame, verOffsetCurrentFrame, stepX, startX, endX);

			//IMPORTANT - to accurately calculate scaling for abs spectrum, we need to calculate 0th and 1st terms
			//this must be done every time the function is regenerated (more info in the function comment)
			let argSpectrumYAxisMultiplier = CalculateMaxValueForAbsSpectrum(MapMenuInputToFunction(functionCurrentFrame), amplitudeCurrentFrame, periodCurrentFrame, horOffsetCurrentFrame, verOffsetCurrentFrame);
			//10 is start value for termsSlider
			absSpectrum.SetAxesScale(36, 40, (9*(10/checkedTermsCurrentFrame))*periodCurrentFrame, 160/argSpectrumYAxisMultiplier);
			absSpectrum.SetViewportOffset(0, -0.5*argSpectrumYAxisMultiplier);
			//arg spectrum is here for consistency
			argSpectrum.SetAxesScale(36, 40, (9*(10/checkedTermsCurrentFrame))*periodCurrentFrame, 80);
		}
	}
	else
	{
		//equivalent to show steps mode

		let regenerateFunction = false;

		if (functionLastFrame !== functionCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;
		}

		if (amplitudeLastFrame !== amplitudeCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;

			startingFunctionGraphResultMode.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/amplitudeCurrentFrame);

			finalSumGraphResultMode.SetAxesScale(162.75, 162.75, 325.5/periodCurrentFrame, 162.75/amplitudeCurrentFrame);
		}

		if (periodLastFrame !== periodCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;

			startingFunctionGraphResultMode.SetAxesScale(80, 80, 160/periodCurrentFrame, 80/amplitudeCurrentFrame);
			
			finalSumGraphResultMode.SetAxesScale(162.75, 162.75, 325.5/periodCurrentFrame, 162.75/amplitudeCurrentFrame);
		}

		if (horOffsetLastFrame !== horOffsetCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;
		}

		if (verOffsetLastFrame !== verOffsetCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;
		
			startingFunctionGraphResultMode.SetViewportOffset(0, -verOffsetCurrentFrame);

			finalSumGraphResultMode.SetViewportOffset(0, -verOffsetCurrentFrame);
		}

		if (termsLastFrame != termsCurrentFrame || modeChanged === true)
		{
			regenerateFunction = true;
		}

		//function regeneration
		if (regenerateFunction === true)
		{
			//number of terms
			finalTermNumber = termsSlider.GetValue();

			//update period
			functionToAnalyzePeriod = periodCurrentFrame;

    		stepXResultModeDisplay = (1410/(160/periodCurrentFrame))/dataPointsPerFunctionResultModeDisplay;
    		startXResultModeDisplay = -(1410/(160/periodCurrentFrame))/2;
    		endXResultModeDisplay = (1410/(160/periodCurrentFrame))/2;

			stepXResultModeCalculation = (1*periodCurrentFrame)/dataPointsPerFunctionResultModeCalculation;
			startXResultModeCalculation = -(1*periodCurrentFrame)/2;
			endXResultModeCalculation = (1*periodCurrentFrame)/2;

			functionToAnalyzeResultModeDisplay = GenerateFunctionToAnalyze(MapMenuInputToFunction(functionCurrentFrame), amplitudeCurrentFrame, periodCurrentFrame, horOffsetCurrentFrame, verOffsetCurrentFrame, stepXResultModeDisplay, startXResultModeDisplay, endXResultModeDisplay);
			functionToAnalyzeResultModeCalculation = GenerateFunctionToAnalyze(MapMenuInputToFunction(functionCurrentFrame), amplitudeCurrentFrame, periodCurrentFrame, horOffsetCurrentFrame, verOffsetCurrentFrame, stepXResultModeCalculation, startXResultModeCalculation, endXResultModeCalculation);

			//in the result mode, we are actually calculating all the coefficients at once, but currently
			//this function is called before that - so to keep it simple, the first two coefficients are going to be recalculated here
			let argSpectrumYAxisMultiplier = CalculateMaxValueForAbsSpectrum(MapMenuInputToFunction(functionCurrentFrame), amplitudeCurrentFrame, periodCurrentFrame, horOffsetCurrentFrame, verOffsetCurrentFrame);
			absSpectrumResultMode.SetAxesScale(32, 40, (16*(10/checkedTermsCurrentFrame))*periodCurrentFrame, 160/argSpectrumYAxisMultiplier);
			absSpectrumResultMode.SetViewportOffset(0, -0.5*argSpectrumYAxisMultiplier);
			argSpectrumResultMode.SetAxesScale(32, 40, (16*(10/checkedTermsCurrentFrame))*periodCurrentFrame, 80);
		}
	}

	//current values become last frame values
	modeLastFrame = modeCurrentFrame;
	functionLastFrame = functionCurrentFrame;
	amplitudeLastFrame = amplitudeCurrentFrame;
	periodLastFrame = periodCurrentFrame;
	horOffsetLastFrame = horOffsetCurrentFrame;
	verOffsetLastFrame = verOffsetCurrentFrame;
	termsLastFrame = termsCurrentFrame;
}

//button handlers

function StartButton()
{
	finalTermNumber = termsSlider.GetValue();
	fourierTermsSum = GenerateFunctionEmptySumFunction(stepX, startX, endX);

	InitEventCalendar(animation);
	InitAnimationCalendar(context, animation);

	animation.SetAnimationStarted();
	animationStarted = true;

	startResetButtons.DisableFirst();
	startResetButtons.EnableSecond();
	pauseContinueButtons.EnableFirst();
}

function ResetButton()
{
	termNumber = 0;
	fourierTermsSum = [];
	
	fourierNegativeCoefficients = [];
	fourierPositiveCoefficients = [];

	animation.ResetAnimation();
	animationStarted = false;
	animationPaused = false;

	sineGraph.SetAxesDescription("t", "sin(kωt)", 8, 9, 16);
	cosineGraph.SetAxesDescription("t", "cos(kωt)", 8, 9, 16);

	startResetButtons.EnableFirst();
	startResetButtons.DisableSecond();
	pauseContinueButtons.DisableFirst();
	pauseContinueButtons.DisableSecond();
}

function PauseButton()
{
	animationPaused = true;

	pauseContinueButtons.DisableFirst();
	pauseContinueButtons.EnableSecond();
}

function ContinueButton()
{
	animationPaused = false;

	pauseContinueButtons.EnableFirst();
	pauseContinueButtons.DisableSecond();
}


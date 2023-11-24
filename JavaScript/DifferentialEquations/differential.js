//Ing. Tomas Jarusek, 11/2021

//slope field position and size
let startX = 25;
let startY = 25;
let size = 900;

//axes variables
let axisThickness = 2;
let axisMarkThickness = 4;
let axisStep = 20;
let axisFontSize = 10;

//slope field variables
let slopeLineStep = 20;
let slopeLineLengthMultiplier = 0.6;
let slopeLineThickness = 2;

//differential equation entered by the user
let previousUserInput = "";
let userEvalFunction;
let userEvalFunctionIsValid;

//functions that contain other function name in themselves
let containingFunctions = ["atan", "atanh", "atan2", "asin", "asinh", "acosh", "acos", "cosh", "expm1", "fround", "log1p", "log10", "log2", "sinh", "tanh"];
let containingFunctionsCodes = containingFunctions.map((element, index) => "#" + index.toString() + "@");
let containingFunctionsRegexes = containingFunctions.map(element => new RegExp(element, "g"));
let containingFunctionsCodesRegexes = containingFunctionsCodes.map(element => new RegExp(element, "g"));
//functions that don't contain another function name in themselves
let nonContainingFunctions = ["abs", "cbrt", "ceil", "clz32", "cos", "exp", "floor", "hypot", "imul", "log", "max", "min", "pow", "random", "round", "sign", "sin", "sqrt", "tan", "trunc"];
let nonContainingFunctionsCodes = nonContainingFunctions.map((element, index) => "&" + index.toString() + "%");
let nonContainingFunctionsRegexes = nonContainingFunctions.map(element => new RegExp(element, "g"));
let nonContainingFunctionsCodesRegexes = nonContainingFunctionsCodes.map(element => new RegExp(element, "g"));

//information variables
let informationFontSize = 30;
let informationStartX = 950;
let informationStartY = 50;

//euler numeric method
let numericalMethodStep = 0.1;
let numericalMethodThickness = 3;
let numericalMethodStepCountMax = 100;

//drawing info for numerical methods (not used in the end)
let eulerMethodStepsPerformed = 0;
let rungeKuttaMethodStepsPerformed = 0;

//parse user entered function
function UpdateUserInputFunction()
{
    //get text value of input box
    let currentUserInputEquation = textBoxTextMode1.GetValue();
    //currentUserInputEquation === pi*asin(x)*sin(y)^e

    //update eval function only if input has changed
    if (currentUserInputEquation === previousUserInput)
    {
        return;
    }
    else
    {
        previousUserInput = currentUserInputEquation;
    }

    //1) transform containing function inside user input into codestring in form #number@
    for (let i = 0; i < containingFunctionsRegexes.length; i++)
    {
        currentUserInputEquation = currentUserInputEquation.replace(containingFunctionsRegexes[i], containingFunctionsCodes[i]);
    }
    //currentUserInputEquation === pi*#3@(x)*sin(y)^e

    //2) transform non containing function inside user input into codestring in form &number%
    for (let i = 0; i < nonContainingFunctionsRegexes.length; i++)
    {
        currentUserInputEquation = currentUserInputEquation.replace(nonContainingFunctionsRegexes[i], nonContainingFunctionsCodes[i]);
    }
    //ln is represented by log in JavaScript, but both versions should be possible
    currentUserInputEquation = currentUserInputEquation.replace(/ln/g, "&-1%");
    //currentUserInputEquation === pi*#3@(x)*&16%(y)^e

    //3) transform constants e and pi
    //now every valid funtion has been turned into code and only remaining letters can be x, y, e or pi
    currentUserInputEquation = currentUserInputEquation.replace(/e/g, "Math.E");
    currentUserInputEquation = currentUserInputEquation.replace(/pi/g, "Math.PI");
    //currentUserInputEquation === Math.PI*#3@(x)*&16%(y)^Math.E

    //4) transform ^ into **
    currentUserInputEquation = currentUserInputEquation.replace(/\^/g, "**");
    //currentUserInputEquation === Math.PI*#3@(x)*&16%(y)**Math.E
    
    //5) reverse non containing functions
    for (let i = 0; i < nonContainingFunctionsCodes.length; i++)
    {
        currentUserInputEquation = currentUserInputEquation.replace(nonContainingFunctionsCodesRegexes[i], "Math." + nonContainingFunctions[i]);
    }
    //ln is represented by log in JavaScript, but both versions should be possible
    currentUserInputEquation = currentUserInputEquation.replace(/&-1%/g, "Math.log");
    //currentUserInputEquation === Math.PI*#3@(x)*Math.sin(y)**Math.E
    
    //6) reverse containing functions
    for (let i = 0; i < containingFunctionsCodes.length; i++)
    {
        currentUserInputEquation = currentUserInputEquation.replace(containingFunctionsCodesRegexes[i], "Math." + containingFunctions[i]);
    }
    //currentUserInputEquation === Math.PI*Math.asin(x)*Math.sin(y)**Math.E

    //console.log(currentUserInputEquation);

    //DONE transforming

    //try if user input works
    try 
    {
        //eval tranformed user input as assigment to local variable
        userEvalFunction = eval("evalFunction = function(x,y){ return " + currentUserInputEquation + "; };");

        //also, try to run the new function with input, so we know its valid for calculations
        //for example (xy would be valid code (read as new variable), but it will fail the evaluation test)
        let testResult = userEvalFunction(0,0);

        //set valid flag to true
        userEvalFunctionIsValid = true;

    } catch (e) 
    {
        //if function is not valid, set flag to false

        userEvalFunctionIsValid = false;
    }
}

//draw whole slope field
function DrawSlopeField(localContext)
{
    DrawAxes(localContext);

    DrawSlopes(localContext); 
}

//draw axis lines, markings and text
function DrawAxes(localContext)
{
    //line parameters
    localContext.strokeStyle = "rgb(0, 0, 0)";
    localContext.lineWidth = axisThickness;
    
    //text parameters
    localContext.fillStyle = "rgb(0,0,0)";
    localContext.font = axisFontSize.toString() + "px Arial";
    localContext.textAlign = "center";
    localContext.textBaseline = "middle";

    //axis text counter
    let counter;

    //---------------------------------- X AXIS ----------------------------------

    //x axis line
    localContext.beginPath();
	localContext.moveTo(startX, startY + size/2);
	localContext.lineTo(startX + size, startY + size/2);
	localContext.stroke();

    //x axis text negative inf --> -1 and axis markings
    counter = -1;
    for (let x = startX + size/2 - axisStep; x >= startX; x -= axisStep)
    {
        //markings
        localContext.beginPath();
	    localContext.moveTo(x, startY + size/2 + axisMarkThickness);
	    localContext.lineTo(x, startY + size/2 - axisMarkThickness);
	    localContext.stroke();

        //text
        localContext.fillText(counter.toString(), x, startY + size/2 + axisMarkThickness*3);
        counter--;
    }

    //x axis text 1 --> positive inf and axis markings
    counter = 1;
    for (let x = startX + size/2 + axisStep; x <= startX + size; x += axisStep)
    {
        //markings
        localContext.beginPath();
	    localContext.moveTo(x, startY + size/2 + axisMarkThickness);
	    localContext.lineTo(x, startY + size/2 - axisMarkThickness);
	    localContext.stroke();

        //text
        localContext.fillText(counter.toString(), x, startY + size/2 + axisMarkThickness*3);
        counter++;
    }

    //---------------------------------- Y AXIS ----------------------------------

    //y axis line
    localContext.beginPath();
	localContext.moveTo(startX + size/2, startY);
	localContext.lineTo(startX + size/2, startY + size);
	localContext.stroke();

    //y axis text negative inf --> -1 and axis markings
    counter = -1;
    for (let y = startY + size/2 + axisStep; y <= startY + size; y += axisStep)
    {
        //markings
        localContext.beginPath();
	    localContext.moveTo(startX + size/2 + axisMarkThickness, y);
	    localContext.lineTo(startX + size/2 - axisMarkThickness, y);
	    localContext.stroke();

        //text
        localContext.fillText(counter.toString(), startX + size/2 + axisMarkThickness*3, y);
        counter--;
    }

    //x axis text 1 --> positive inf and axis markings
    counter = 1;
    for (let y = startY + size/2 - axisStep; y >= startY; y -= axisStep)
    {
        //markings
        localContext.beginPath();
	    localContext.moveTo(startX + size/2 + axisMarkThickness, y);
	    localContext.lineTo(startX + size/2 - axisMarkThickness, y);
	    localContext.stroke();

        //text
        localContext.fillText(counter.toString(), startX + size/2 + axisMarkThickness*3, y);
        counter++;
    }

    //labels
    localContext.font = (axisFontSize*1.5).toString() + "px Arial";

    localContext.fillText("x", startX + size + axisMarkThickness*2, startY + size/2);
    localContext.fillText("y(x)", startX + size/2 + 3, startY - axisMarkThickness*2);
}

//draw all slopes
function DrawSlopes(localContext)
{
    //color and thickness
    localContext.strokeStyle = "rgb(0, 0, 255)";
    localContext.lineWidth = slopeLineThickness;

    //user function cannot be used for calculations - draw nothing
    if (userEvalFunctionIsValid === false)
    {
        return;
    }

    //min max values of SLOPE LINE indexes
    //for example [-22, 22, -22, 22] means that there is going to be 22 slope lines 
    //on the left and on the right of axes regardles of what the grid says
    let lowestXIndex = -1*Math.floor((size/2)/slopeLineStep); //number of slope lines that fit into half of the slope field rounded down
    let highestXIndex = lowestXIndex*-1;
    let lowestYIndex = lowestXIndex;
    let highestYIndex = highestXIndex;

    //scaling factor for translating INDEX OF SLOPE LINE into ACTUAL NUMBER USED FOR SLOPE CALCULATION
    let scalingFactor = slopeLineStep/axisStep;

    //actual number used for slope calculation
    let scaledX;
    let scaledY;

    //real pixel values on the screen of the slope line
    let realX;
    let realY;

    //angle of slope line
    let slopeLineAngle;

    //interate through all slope line indexes
    for (let x = lowestXIndex; x <= highestXIndex; x++)
    {
        for (let y = lowestYIndex; y <= highestYIndex; y++)
        {
            //calculate real pixel position on screen
            realX = startX + size/2 + x*slopeLineStep;
            realY = startY + size/2 - y*slopeLineStep;
        
            //calculate actual number on what slope line lies
            scaledX = x*scalingFactor;
            scaledY = y*scalingFactor;

            //calculate angle of slope line
            slopeLineAngle = CalculateSlopeAngleForPoint(scaledX, scaledY);

            //slope angle has to be defined
            if (slopeLineAngle !== undefined)
            {
                //draw single slope
                DrawSlope(localContext, realX, realY, slopeLineAngle);
            }
        }
    }
}

//calculate slope angle for specific point using user defined function
function CalculateSlopeAngleForPoint(x, y)
{
    //get slope from equation that user has entered
    let slope = userEvalFunction(x,y);

    //function returned infinity - likely division by zero - line should be vertical
    if (slope === Infinity)
    {
        //vertical up
        return Math.PI/2;
    }
    else if (slope === -Infinity)
    {
        //vertical down
        return -Math.PI/2;
    }

    //function returned NaN - result not defined - for example asin(10) or log(-1)
    if (isNaN(slope) === true)
    {
        return undefined;
    }

    //slope is defined - calculate angle from slope - just take atan lol :D
    return Math.atan(slope);
}

//draw single slope
function DrawSlope(localContext, x, y, angle)
{
    //save transform matrix
    localContext.save();

    //setup tranform matrix
    //move to center - rotate - move back into previous position (operations are written in opposite order)
    localContext.transform(1, 0, 0, 1, x, y);
	localContext.transform(Math.cos(-angle), Math.sin(-angle), -Math.sin(-angle), Math.cos(-angle), 0, 0);
    localContext.transform(1, 0, 0, 1, -x, -y);	
    
    //draw line with its center placed on coordinates
    localContext.beginPath();
	localContext.moveTo(x - (slopeLineStep*slopeLineLengthMultiplier)/2, y);
	localContext.lineTo(x + (slopeLineStep*slopeLineLengthMultiplier)/2, y);
	localContext.stroke();

    //restore transform matrix
    localContext.restore();
}

//draw solution using euler method
function DrawEulerMethod(localContext)
{
    //calculation can only be done if eval function is valid
    if (userEvalFunctionIsValid === false)
    {
        return;
    }

    //line parameters
    localContext.strokeStyle = "rgb(255, 0, 0)";
    localContext.lineWidth = numericalMethodThickness;

    //actual coordinates used for slope calculation
    let x = (ApplyCanvasScale(mouseX) - size/2 - startX)/axisStep;
    let y = -(ApplyCanvasScale(mouseY) - size/2 - startY)/axisStep;

    //set step
    let step = numericalMethodStep;

    //slope calculated from current coordinates
    let slope;

    //new coordiantes obtained adding calculated values to  existing coordinates
    let newX;
    let newY;

    //pixel values for drawing result
    let realX;
    let realY;
    let newRealX;
    let newRealY;

    //number of steps done by method
    let eulerMethodStepsPerformed = 0;
    
    while (true)
    {
        //calculate slope based on coordinates current
        slope = userEvalFunction(x, y);

        //add step to x coordinate
        newX = x + step;
        //add slope*step to y coordinate
        newY = y + step*slope;
  
        if (newY === Infinity || newY === -Infinity || isNaN(newY) === true)
        {
            //user function did not return numeric value for given input
            break;
        }

        //calculation of real pixel values for both current and new coordinates
        realX = startX + size/2 + x*axisStep;
        realY = startY + size/2 - y*axisStep;
        newRealX = startX + size/2 + newX*axisStep;
        newRealY = startY + size/2 - newY*axisStep;

        //stop calculation if current coordinate is outside drawing area
        if (realX < startX || realX > startX + size || realY < startY || realY > startY + size)
        {
            break;
        }

        //stop calculation is new coordinate is outside drawing area
        if (newRealX < startX || newRealX > startX + size || newRealY < startY || newRealY > startY + size)
        {
            break;
        }

        //draw one step line based on calculated pixel coordinates
        localContext.beginPath();
	    localContext.moveTo(realX, realY);
	    localContext.lineTo(newRealX, newRealY);
	    localContext.stroke();

        //new is now old
        x = newX;
        y = newY;

        //increment step count
        eulerMethodStepsPerformed++;

        //limit number of steps - not necessary in current implementation
        /*if (eulerMethodStepsPerformed > numericalMethodStepCountMax)
        {
            break;
        }*/
    }
}

//draw solution using euler method (RK4)
function DrawRungeKuttaMethod(localContext)
{
    //calculation can only be done if eval function is valid
    if (userEvalFunctionIsValid === false)
    {
        return;
    }

    //line parameters
    localContext.strokeStyle = "rgb(1, 50, 32)";
    localContext.lineWidth = numericalMethodThickness;

    //actual coordinates used for slope calculation
    let x = (ApplyCanvasScale(mouseX) - size/2 - startX)/axisStep;
    let y = -(ApplyCanvasScale(mouseY) - size/2 - startY)/axisStep;

    //set step
    let step = numericalMethodStep;

    //slope multiplied by step
    let slopeStep;

    //new coordiantes obtained adding calculated values to  existing coordinates
    let newX;
    let newY;

    //pixel values for drawing result
    let realX;
    let realY;
    let newRealX;
    let newRealY;

    //intermediate values for Runge-Kutta method
    let k1;
    let k2;
    let k3;
    let k4;

    //number of steps done by method
    let rungeKuttaMethodStepsPerformed = 0;
    
    while (true)
    {
        //MORE INFORMATION ON RUNGE-KUTTA - pendulum.js (simple pendulum simulation)

        //intermediate values used for calculating value that is going to be added to y coordinate (equivalent to step*slope in euler method)
        k1 = step*userEvalFunction(x, y);
        k2 = step*userEvalFunction(x + step/2, y + k1/2);
        k3 = step*userEvalFunction(x + step/2, y + k2/2);
        k4 = step*userEvalFunction(x + step, y + k3);

        slopeStep = 1/6*(k1 + 2*k2 + 2*k3 + k4);

        //add step to x coordinate
        newX = x + step;
        //add sloepStep to y coordinate
        newY = y + slopeStep;

        if (newY === Infinity || newY === -Infinity || isNaN(newY) === true)
        {
            //user function did not return numeric value for given input
            break;
        }

        //calculation of real pixel values for both current and new coordinates
        realX = startX + size/2 + x*axisStep;
        realY = startY + size/2 - y*axisStep;
        newRealX = startX + size/2 + newX*axisStep;
        newRealY = startY + size/2 - newY*axisStep;
  
        //stop calculation if current coordinate is outside drawing area
        if (realX < startX || realX > startX + size || realY < startY || realY > startY + size)
        {
            break;
        }
  
        //stop calculation is new coordinate is outside drawing area
        if (newRealX < startX || newRealX > startX + size || newRealY < startY || newRealY > startY + size)
        {
            break;
        }
  
        //draw one step line based on calculated pixel coordinates
        localContext.beginPath();
        localContext.moveTo(realX, realY);
        localContext.lineTo(newRealX, newRealY);
        localContext.stroke();
  
        //new is now old
        x = newX;
        y = newY;
  
        //increment step count
        rungeKuttaMethodStepsPerformed++;
  
        //limit number of steps - not necessary in current implementation
        /*if (rungeKuttaMethodStepsPerformed > numericalMethodStepCountMax)
        {
            break;
        }*/
    }
}

function DrawInformation(localContext, deltaTime, showEuler, showRungeKutta)
{
    //text parameters
    localContext.fillStyle = "rgb(0,0,0)";
    localContext.font = informationFontSize.toString() + "px Arial";
    localContext.textAlign = "left";
    localContext.textBaseline = "middle";

    let offset = 0;
    localContext.fillText("Mouse coordinates: [" + ((ApplyCanvasScale(mouseX) - size/2 - startX)/axisStep).toFixed(2).toString() + ", " + ( -(ApplyCanvasScale(mouseY) - size/2 - startY)/axisStep).toFixed(2).toString() + "]", informationStartX , informationStartY + offset);

    if (showEuler === true || showRungeKutta === true)
    {
        offset += 100;
        localContext.fillText("Numerical method step: " + numericalMethodStep.toFixed(5).toString(), informationStartX , informationStartY + offset);

        offset += 50;
        localContext.fillText("[Wheel up]: Decrease step size", informationStartX , informationStartY + offset);

        offset += 50;
        localContext.fillText("[Wheel down]: Increase step size", informationStartX , informationStartY + offset);
    }

    localContext.fillText("Framerate: " + (1000/deltaTime).toFixed(2).toString() + "fps", informationStartX , informationStartY + 850);
}









































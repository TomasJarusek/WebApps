//N-body problem
//Ing. Tomas Jarusek, 01/2022

//helper function that returns new copy of input array and adds value to each element
function AddValueToArrayElements(array, value)
{
    let returnArray = [];

    for (let i = 0; i < array.length; i++)
    {
        returnArray.push(array[i] + value);
    }

    return returnArray;
}


function AdvanceSimulation()
{
    //simulate until simulation time catches up with program time
    while (simulationTime <= programTime)
    {
        //runge kutta method (RK4)

        //each body has 4 differential equations associated with it

        //first step

        //for each body and for each of its equations, Runge-Kutta parameters are calcualted
        //this is done by passing positions and velocitites of all bodies into change functions
        for (let i = 0; i < bodiesCount; i++)
        {
            rungeKuttaK1Parameters[i*4 + 0] = step*bodyPositionXChangeFunction(i, undefined, undefined, undefined, bodiesVelocityX, undefined);
            rungeKuttaK1Parameters[i*4 + 1] = step*bodyPositionYChangeFunction(i, undefined, undefined, undefined, undefined, bodiesVelocityY);
            rungeKuttaK1Parameters[i*4 + 2] = step*bodyVelocityXChangeFunction(i, undefined, bodiesPositionX, bodiesPositionY, undefined, undefined);
            rungeKuttaK1Parameters[i*4 + 3] = step*bodyVelocityYChangeFunction(i, undefined, bodiesPositionX, bodiesPositionY, undefined, undefined);
        }

        //after the first parameters are calculated, it is neccessary to update values for next step
        //so the intermediate arrays are filled with positions and velocities off all bodies
        //they contain just the original values with corresponding Runge-Kutta parameters added to them
        //these new values are then passed to change functions in next step
        for (let i = 0; i < bodiesCount; i++)
        {
            rungeKuttaIntermediatePositionX[i] = bodiesPositionX[i] + 0.5*rungeKuttaK1Parameters[i*4 + 0];
            rungeKuttaIntermediatePositionY[i] = bodiesPositionY[i] + 0.5*rungeKuttaK1Parameters[i*4 + 1];
            rungeKuttaIntermediateVelocityX[i] = bodiesVelocityX[i] + 0.5*rungeKuttaK1Parameters[i*4 + 2];
            rungeKuttaIntermediateVelocityY[i] = bodiesVelocityY[i] + 0.5*rungeKuttaK1Parameters[i*4 + 3];
        }

        //second step
        for (let i = 0; i < bodiesCount; i++)
        {
            rungeKuttaK2Parameters[i*4 + 0] = step*bodyPositionXChangeFunction(i, undefined, undefined, undefined, rungeKuttaIntermediateVelocityX, undefined);
            rungeKuttaK2Parameters[i*4 + 1] = step*bodyPositionYChangeFunction(i, undefined, undefined, undefined, undefined, rungeKuttaIntermediateVelocityY);
            rungeKuttaK2Parameters[i*4 + 2] = step*bodyVelocityXChangeFunction(i, undefined, rungeKuttaIntermediatePositionX, rungeKuttaIntermediatePositionY, undefined, undefined);
            rungeKuttaK2Parameters[i*4 + 3] = step*bodyVelocityYChangeFunction(i, undefined, rungeKuttaIntermediatePositionX, rungeKuttaIntermediatePositionY, undefined, undefined);
        }

        for (let i = 0; i < bodiesCount; i++)
        {
            rungeKuttaIntermediatePositionX[i] = bodiesPositionX[i] + 0.5*rungeKuttaK2Parameters[i*4 + 0];
            rungeKuttaIntermediatePositionY[i] = bodiesPositionY[i] + 0.5*rungeKuttaK2Parameters[i*4 + 1];
            rungeKuttaIntermediateVelocityX[i] = bodiesVelocityX[i] + 0.5*rungeKuttaK2Parameters[i*4 + 2];
            rungeKuttaIntermediateVelocityY[i] = bodiesVelocityY[i] + 0.5*rungeKuttaK2Parameters[i*4 + 3];
        }

        //third step
        for (let i = 0; i < bodiesCount; i++)
        {
            rungeKuttaK3Parameters[i*4 + 0] = step*bodyPositionXChangeFunction(i, undefined, undefined, undefined, rungeKuttaIntermediateVelocityX, undefined);
            rungeKuttaK3Parameters[i*4 + 1] = step*bodyPositionYChangeFunction(i, undefined, undefined, undefined, undefined, rungeKuttaIntermediateVelocityY);
            rungeKuttaK3Parameters[i*4 + 2] = step*bodyVelocityXChangeFunction(i, undefined, rungeKuttaIntermediatePositionX, rungeKuttaIntermediatePositionY, undefined, undefined);
            rungeKuttaK3Parameters[i*4 + 3] = step*bodyVelocityYChangeFunction(i, undefined, rungeKuttaIntermediatePositionX, rungeKuttaIntermediatePositionY, undefined, undefined);
        }

        for (let i = 0; i < bodiesCount; i++)
        {
            rungeKuttaIntermediatePositionX[i] = bodiesPositionX[i] + rungeKuttaK3Parameters[i*4 + 0];
            rungeKuttaIntermediatePositionY[i] = bodiesPositionY[i] + rungeKuttaK3Parameters[i*4 + 1];
            rungeKuttaIntermediateVelocityX[i] = bodiesVelocityX[i] + rungeKuttaK3Parameters[i*4 + 2];
            rungeKuttaIntermediateVelocityY[i] = bodiesVelocityY[i] + rungeKuttaK3Parameters[i*4 + 3];
        }

        //fourth step
        for (let i = 0; i < bodiesCount; i++)
        {
            rungeKuttaK4Parameters[i*4 + 0] = step*bodyPositionXChangeFunction(i, undefined, undefined, undefined, rungeKuttaIntermediateVelocityX, undefined);
            rungeKuttaK4Parameters[i*4 + 1] = step*bodyPositionYChangeFunction(i, undefined, undefined, undefined, undefined, rungeKuttaIntermediateVelocityY);
            rungeKuttaK4Parameters[i*4 + 2] = step*bodyVelocityXChangeFunction(i, undefined, rungeKuttaIntermediatePositionX, rungeKuttaIntermediatePositionY, undefined, undefined);
            rungeKuttaK4Parameters[i*4 + 3] = step*bodyVelocityYChangeFunction(i, undefined, rungeKuttaIntermediatePositionX, rungeKuttaIntermediatePositionY, undefined, undefined);
        }

        //final calculation of new value for every equation
        for (let i = 0; i < bodiesCount; i++)
        {
            bodiesPositionX[i] += 1/6*(rungeKuttaK1Parameters[i*4 + 0] + 2*rungeKuttaK2Parameters[i*4 + 0] + 2*rungeKuttaK3Parameters[i*4 + 0] + rungeKuttaK4Parameters[i*4 + 0]);
            bodiesPositionY[i] += 1/6*(rungeKuttaK1Parameters[i*4 + 1] + 2*rungeKuttaK2Parameters[i*4 + 1] + 2*rungeKuttaK3Parameters[i*4 + 1] + rungeKuttaK4Parameters[i*4 + 1]);
            bodiesVelocityX[i] += 1/6*(rungeKuttaK1Parameters[i*4 + 2] + 2*rungeKuttaK2Parameters[i*4 + 2] + 2*rungeKuttaK3Parameters[i*4 + 2] + rungeKuttaK4Parameters[i*4 + 2]);
            bodiesVelocityY[i] += 1/6*(rungeKuttaK1Parameters[i*4 + 3] + 2*rungeKuttaK2Parameters[i*4 + 3] + 2*rungeKuttaK3Parameters[i*4 + 3] + rungeKuttaK4Parameters[i*4 + 3]);
        }

        //new position values are calculated, so the collisions are checked
        HandleCollisions();

        //adding tracepoints - analogical code from pendulum apllication
        //only difference is that the values are stored for each body
        for (let i = 0; i < bodiesCount; i++)
        {
            if (simulationTime > bodiesFirstPointPlacementTime[i] + 1/linesPerSecond)
            {
                bodiesTrace[i].push([bodiesPositionX[i], bodiesPositionY[i]]);

                bodiesFirstPointPlacementTime[i] += 1/linesPerSecond;

                if (bodiesTrace[i].length > linesPerSecond*traceLinePersistence + 1)
                {
                    bodiesTrace[i].splice(0, Math.ceil(bodiesTrace[i].length - (linesPerSecond*traceLinePersistence + 1)));
                }
            }
        }

        //advance time
        simulationTime += step;
    }

    //smoothing trace line - analogical code from pendulum apllication
    //only difference is that the values are stored for each body
    for (let i = 0; i < bodiesCount; i++)
    {
        if (bodiesTrace[i].length >= 2 && bodiesTrace[i].length >= linesPerSecond*traceLinePersistence + 1)
        {
            bodiesTraceSmooth[i] = bodiesTrace[i].slice();

            bodiesTraceSmooth[i][0] = InterpolateLineStartPoint(bodiesTrace[i][0][0], bodiesTrace[i][0][1], bodiesTrace[i][1][0], bodiesTrace[i][1][1], (simulationTime - bodiesFirstPointPlacementTime[i])/(1/linesPerSecond));

            bodiesTraceSmooth[i].push([bodiesPositionX[i], bodiesPositionY[i]]);
        }
        else
        {
            bodiesTraceSmooth[i] = bodiesTrace[i].slice();
            bodiesTraceSmooth[i].push([bodiesPositionX[i], bodiesPositionY[i]]);
        }
    }
}


//linearly interpolates start point of line based on given percentage
function InterpolateLineStartPoint(startX, startY, endX, endY, percentage)
{
    return [startX + (endX - startX)*percentage, startY + (endY - startY)*percentage];
}

//helper function for HandleCollisions()
//checks collisions of all bodies
function CheckForCollisions()
{
    let combinedRadii;
    let distanceNoSqrt;

    //for each unique pair of bodies
    for (let i = 0; i < bodiesCount; i++)
    {
        for (let j = i + 1; j < bodiesCount; j++)
        {
            //check if they are colliding

            //combined radii of both bodies
             //radius calculation described in draw function
            combinedRadii = Math.log10(bodiesMass[i]/10000000000000)*5 + Math.log10(bodiesMass[j]/10000000000000)*5;
            //distance between centers (no square root)
            distanceNoSqrt = (bodiesPositionX[i] - bodiesPositionX[j])**2 + (bodiesPositionY[i] - bodiesPositionY[j])**2;

            //if the radii are bigger than distance
            if (combinedRadii**2 >= distanceNoSqrt)
            {
                //return their indexes
                return [i,j]; 
            }
        }
    }

    //no collision found - return false
    return false;
}

//resolution of body collisions
function HandleCollisions()
{
    let collisionFound;

    let firstBodyIndex;
    let secondBodyIndex;
    
    let firstBodyMass;
    let secondBodyMass;

    let newBodyPositionX;
    let newBodyPositionY;
    let newBodyVelocityX;
    let newBodyVelocityY;
    let newBodyMass;

    while (true)
    {
        //check for collisions
        collisionFound = CheckForCollisions();

        if (collisionFound === false)
        {
            //no collisions are found

            break;
        }

        //indexes of colliding bodies
        firstBodyIndex = collisionFound[0];
        secondBodyIndex = collisionFound[1];

        //their masses
        firstBodyMass = bodiesMass[firstBodyIndex];
        secondBodyMass = bodiesMass[secondBodyIndex];

        //new body is going to have their combined mass
        newBodyMass = firstBodyMass + secondBodyMass;

        //now we have to figure out new body position
        //we are going to place it on the line connecting original body centers
        //final position on the line is determined vie their mass ratio
        ///process is following:
        //determine which body is heavier
        //then calculate mass ratio of lighter/heavier
        //then divide it by two, so when the ratio is 1:1 the new point is going to be in the center of the line (0.5 of length of the line)

        let massRatio;

        if (firstBodyMass > secondBodyMass)
        {
            massRatio = (secondBodyMass/firstBodyMass)/2;

            newBodyPositionX = bodiesPositionX[firstBodyIndex] + (bodiesPositionX[secondBodyIndex] - bodiesPositionX[firstBodyIndex])*massRatio;
            newBodyPositionY = bodiesPositionY[firstBodyIndex] + (bodiesPositionY[secondBodyIndex] - bodiesPositionY[firstBodyIndex])*massRatio;
        }
        else
        {
            massRatio = (firstBodyMass/secondBodyMass)/2;

            newBodyPositionX = bodiesPositionX[secondBodyIndex] + (bodiesPositionX[firstBodyIndex] - bodiesPositionX[secondBodyIndex])*massRatio;
            newBodyPositionY = bodiesPositionY[secondBodyIndex] + (bodiesPositionY[firstBodyIndex] - bodiesPositionY[secondBodyIndex])*massRatio;
        }

        //velocity is calculated from conservation of momentum 
        //https://en.wikipedia.org/wiki/Momentum
        //VELnew*(MASSa + MASSb) = MASSa*VELa + MASSb*VELb
        //VELnew = (MASSa*VELa + MASSb*VELb)/(MASSa + MASSb)
        //it is a vector so one calculation for each dimension
        newBodyVelocityX = (firstBodyMass*bodiesVelocityX[firstBodyIndex] + secondBodyMass*bodiesVelocityX[secondBodyIndex])/(firstBodyMass + secondBodyMass);
        newBodyVelocityY = (firstBodyMass*bodiesVelocityY[firstBodyIndex] + secondBodyMass*bodiesVelocityY[secondBodyIndex])/(firstBodyMass + secondBodyMass);

        //removal of original bodies
        //it is important to remove first the body with higher index,
        //otherwise after the deletion of the lower index, the higher index would change
        if (firstBodyIndex > secondBodyIndex)
        {
            RemoveBody(firstBodyIndex);
            RemoveBody(secondBodyIndex);
        }
        else
        {
            RemoveBody(secondBodyIndex);
            RemoveBody(firstBodyIndex);      
        };

        //create new body
        AddBody(newBodyMass, newBodyPositionX, newBodyPositionY, newBodyVelocityX, newBodyVelocityY);
    }
}

//processing of user mouse inputs
function HandleMouseInput()
{
    if (mouseState === 0)
    {
        //user was not holding down the mouse button

        //is he now?
        if (leftMouseButtonIsHeld === true)
        {
            //save mouse position, current velocity is 0
            newUserBodyPositionX = ApplyCanvasScale(mouseX) - simulationWindowCenterX;
            newUserBodyPositionY = ApplyCanvasScale(mouseY) - simulationWindowCenterY;
            newUserBodyVelocityX = 0;
            newUserBodyVelocityY = 0;

            //state has changed
            mouseState = 1;
        }
    }
    else if (mouseState === 1)
    {
        //user was holding down the mouse button

        //recalculate velocity based on current mouse position
        newUserBodyVelocityX = newUserBodyPositionX - (ApplyCanvasScale(mouseX) - simulationWindowCenterX);
        newUserBodyVelocityY = newUserBodyPositionY - (ApplyCanvasScale(mouseY) - simulationWindowCenterY);

        //is he not holding anymore?
        if (leftMouseButtonIsHeld !== true)
        {
            //user released the button - place body

            //is it colliding with other body?
            let collisionFound = false;

            let combinedRadii;
            let distanceNoSqrt;

            //check collison with all other bodies
            for (let i = 0; i < bodiesCount; i++)
            {
                //combined radii of both bodies
                //radius calculation described in draw function
                combinedRadii = Math.log10(bodiesMass[i]/10000000000000)*5 + Math.log10(newUserBodyMass/10000000000000)*5;
                //distance between centers (no square root)
                distanceNoSqrt = (bodiesPositionX[i] - newUserBodyPositionX)**2 + (bodiesPositionY[i] - newUserBodyPositionY)**2;

                //if the radii are bigger than distance
                if (combinedRadii**2 >= distanceNoSqrt)
                {
                    collisionFound = true;
                    break;
                }
            }

            if (collisionFound === false)
            {
                //no collision - add body

                AddBody(newUserBodyMass, newUserBodyPositionX, newUserBodyPositionY, newUserBodyVelocityX, newUserBodyVelocityY);
            }
           
            //mouse state is back to no button hold
            mouseState = 0;
        }
    }
}

function DrawTraces(localContext)
{
    //line coordinates
    let lineStartPixelX;
    let lineStartPixelY;
    let lineEndPixelX;
    let lineEndPixelY;

    localContext.lineWidth = 1;
    localContext.strokeStyle = "rgb(0, 0, 0)";

    if (true)
    {
        for (let i = 0; i < bodiesCount; i++)
        {
            for (let j = 1; j < bodiesTraceSmooth[i].length; j++)
            {
                lineStartPixelX = bodiesTraceSmooth[i][j - 1][0];
                lineStartPixelY = bodiesTraceSmooth[i][j - 1][1];
                lineEndPixelX = bodiesTraceSmooth[i][j][0];
                lineEndPixelY = bodiesTraceSmooth[i][j][1];

                localContext.beginPath();
                localContext.moveTo(simulationWindowCenterX + lineStartPixelX, simulationWindowCenterY + lineStartPixelY);
                localContext.lineTo(simulationWindowCenterX + lineEndPixelX, simulationWindowCenterY + lineEndPixelY);
                localContext.stroke();
            }
        }
    }
}

function DrawBodies(localContext)
{
    localContext.fillStyle = "rgb(255, 0, 0)";

    //bodies are drawn first
    for (let i = 0; i < bodiesCount; i++)
    {
        localContext.beginPath();

        //body with mass 10000000000000 has radius zero
        //and then every order of magnitude means constant increase in radius
        //so mass of body is divided by 10000000000000 and then log10 is used, that gives us the difference in terms of orders of magnitudes
        //this is then multiplied by magic number - the radius per order of magnitude conversion ratio
        localContext.arc(simulationWindowCenterX + bodiesPositionX[i], simulationWindowCenterY + bodiesPositionY[i], Math.log10(bodiesMass[i]/10000000000000)*5, 0, 2*Math.PI);
        localContext.fill();
    }

    if (showVelocityVectors === true)
    {
        //velocity vectors are drawn on top of the bodies

        localContext.strokeStyle = "rgb(0, 0, 200)";
        localContext.fillStyle = "rgb(0, 0, 200)";
        localContext.lineWidth = 1.5;

        let arrowScale = 0.25;

        for (let i = 0; i < bodiesCount; i++)
        {
            let vectorMagnitude = Math.sqrt(bodiesVelocityX[i]**2 + bodiesVelocityY[i]**2);

            //normal vectors to velocity vector
            let firstNormalX = -bodiesVelocityY[i]/vectorMagnitude;
            let firstNormalY = bodiesVelocityX[i]/vectorMagnitude;
            let secondNormalX = bodiesVelocityY[i]/vectorMagnitude;
            let secondNormalY = -bodiesVelocityX[i]/vectorMagnitude;
            
            //barrow body
            localContext.beginPath();
            localContext.moveTo(simulationWindowCenterX + bodiesPositionX[i], simulationWindowCenterY + bodiesPositionY[i]);
            localContext.lineTo(simulationWindowCenterX + bodiesPositionX[i] + bodiesVelocityX[i]*arrowScale*7/10, simulationWindowCenterY + bodiesPositionY[i] + bodiesVelocityY[i]*arrowScale*7/10);
            localContext.stroke();
        
            //arrow head
            localContext.beginPath();
            localContext.moveTo(simulationWindowCenterX + bodiesPositionX[i] + bodiesVelocityX[i]*arrowScale*7/10 + firstNormalX*4, simulationWindowCenterY + bodiesPositionY[i] + bodiesVelocityY[i]*arrowScale*7/10 + firstNormalY*4);
            localContext.lineTo(simulationWindowCenterX + bodiesPositionX[i] + bodiesVelocityX[i]*arrowScale*7/10 + secondNormalX*4, simulationWindowCenterY + bodiesPositionY[i] + bodiesVelocityY[i]*arrowScale*7/10 + secondNormalY*4);
            localContext.lineTo(simulationWindowCenterX + bodiesPositionX[i] + bodiesVelocityX[i]*arrowScale, simulationWindowCenterY + bodiesPositionY[i] + bodiesVelocityY[i]*arrowScale);
            localContext.fill();
        }
    }
        
}

//draws new user body while it the user hold the mouse button
function DrawUserBody(localContext)
{
    if (mouseState === 1)
    {
        //user hold button - body is supposed to be shown

        localContext.fillStyle = "rgb(255, 0, 0)";

        //draw body
        localContext.beginPath();
        localContext.arc(simulationWindowCenterX + newUserBodyPositionX, simulationWindowCenterY + newUserBodyPositionY, Math.log10(newUserBodyMass/10000000000000)*5, 0, 2*Math.PI);
        localContext.fill();

        localContext.strokeStyle = "rgb(0, 0, 200)";
        localContext.fillStyle = "rgb(0, 0, 200)";
        localContext.lineWidth = 2.5;

        //arrow is thicker when user is creating the body
        let arrowScale = 1;

        //arrow draw process is identical to standard velocity vectors drawing
        let vectorMagnitude = Math.sqrt(newUserBodyVelocityX**2 + newUserBodyVelocityY**2);

        let firstNormalX = -newUserBodyVelocityY/vectorMagnitude;
        let firstNormalY = newUserBodyVelocityX/vectorMagnitude;
        let secondNormalX = newUserBodyVelocityY/vectorMagnitude;
        let secondNormalY = -newUserBodyVelocityX/vectorMagnitude;
    
        localContext.beginPath();
        localContext.moveTo(simulationWindowCenterX + newUserBodyPositionX, simulationWindowCenterY + newUserBodyPositionY);
        localContext.lineTo(simulationWindowCenterX + newUserBodyPositionX + newUserBodyVelocityX*arrowScale*8/10, simulationWindowCenterY + newUserBodyPositionY + newUserBodyVelocityY*arrowScale*8/10);
        localContext.stroke();

        localContext.beginPath();
        localContext.moveTo(simulationWindowCenterX + newUserBodyPositionX + newUserBodyVelocityX*arrowScale*8/10 + firstNormalX*5, simulationWindowCenterY + newUserBodyPositionY + newUserBodyVelocityY*arrowScale*8/10 + firstNormalY*5);
        localContext.lineTo(simulationWindowCenterX + newUserBodyPositionX + newUserBodyVelocityX*arrowScale*8/10 + secondNormalX*5, simulationWindowCenterY + newUserBodyPositionY + newUserBodyVelocityY*arrowScale*8/10 + secondNormalY*5);
        localContext.lineTo(simulationWindowCenterX + newUserBodyPositionX + newUserBodyVelocityX*arrowScale, simulationWindowCenterY + newUserBodyPositionY + newUserBodyVelocityY*arrowScale);
        localContext.fill();
    }    
}

//text information drawing
function DrawProgramInformation(localContext)
{
    localContext.textAlign = "left";
    localContext.textBaseline = "middle";
    localContext.fillStyle = "rgb(0,0,0)";
    localContext.font = "bold 15px Arial";

    //draw controls    
    localContext.fillText("LEFT MOUSE BUTTON (hold and drag) - place new body, MOUSE WHEEL - change weight of new body (Current multiplier: " + (newUserBodyMass/100000000000000).toFixed(2).toString() + ")", 7, 939);

    //simulation information
    localContext.fillText("Simulation time: " + (simulationTime - simulationStartTime).toFixed(1).toString() + " s", 7 , 15);
    localContext.fillText("Number of bodies: " + bodiesCount, 200 , 15);
    localContext.fillText("Numerical method: Runge-Kutta (RK4), step: 0.001 s", 385 , 15);

    //draw framerate
    localContext.fillText("Framerate: " + (1000/deltaTime).toFixed(2).toString() + " fps", 1300 , 939);
}

function DrawSimulation(localContext)
{
    //traces in the backgroung
    if (showTraces === true)
    {
        DrawTraces(localContext);
    }
    
    //then bodies
    DrawBodies(localContext);

    //then user body
    DrawUserBody(localContext);

    //info on top
    DrawProgramInformation(localContext);

}

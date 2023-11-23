//Simple Pendulum
//Ing. Tomas Jarusek, 12/2021

//Pendulum draw class
class Pendulum
{
	constructor() 
	{
        //top left coordinate
        this.startX = 738;
        this.startY = 25;

        //sizes
        this.sizeX = 687;
        this.sizeY = 625;

        //pivot coordinate is always in the center
        this.pivotX = this.startX + this.sizeX/2;
        this.pivotY = this.startY + this.sizeY/2;

        //current total angle
        this.angle = 0;
        //always between -pi and pi
        this.drawAngle = 0;

        //current velocity
        this.velocity = 0;

        //current length
        this.pendulumLength = 1;
        //pixel length that is bounded by maximum length
        this.pixelPendulumDrawLength = 250;

        //pixel length of one meter
        this.pixelsPerMeter = 250;
        //pendulum max pixel length - then it is going to be scaled down
        this.pixelsPerMeterMax = 250;

        //pixel length of arrow, thet represents 1 rad/s
        this.pixelsPerRadPerS = 15;

        //show description text
        this.showSimulationInformation = false;
        //show pendulum angle and velocity
        this.showPendulumInformation = false;
    }

    SetAngle(angle)
    {
        this.angle = angle;

        //also calculate draw angle at the same time
        this.drawAngle = this.angle%(2*Math.PI);

        if (this.drawAngle >= 0)
        {
            if (this.drawAngle > Math.PI)
            {
                this.drawAngle = -(2*Math.PI - this.drawAngle);
            }
        }
        else
        {
            if (this.drawAngle < -Math.PI)
            {
                this.drawAngle = -(-2*Math.PI - this.drawAngle);
            }
        }
    }

    SetVelocity(velocity)
    {
        this.velocity = velocity;
    }

    SetPendulumLength(pendulumLength)
    {
        this.pendulumLength = pendulumLength;

        //also calculate pixel draw length
        if (this.pixelsPerMeter*this.pendulumLength > this.pixelsPerMeterMax)
        {
            this.pixelPendulumDrawLength = this.pixelsPerMeterMax;
        }
        else
        {
            this.pixelPendulumDrawLength = this.pixelsPerMeter*this.pendulumLength;
        }

    }

    SetShowSimulationInformation(showSimulationInformation)
    {
        this.showSimulationInformation = showSimulationInformation;
    }

    SetShowPendulumInformation(showPendulumInformation)
    {
        this.showPendulumInformation = showPendulumInformation;
    }

    DrawPendulum(localContext)
    {
        //save transform matrix
        localContext.save();

        if (this.showPendulumInformation === true)
        {
            //dotted 0 degree line is drawn first in the background

            localContext.strokeStyle = "rgb(0, 0, 0)";
            localContext.lineWidth = 1;
            localContext.setLineDash([5, 10]); 

            //draw starts from bottom - dashes look nicer near the pivot
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY + this.pixelPendulumDrawLength);
            localContext.lineTo(this.pivotX, this.pivotY);
            localContext.stroke();
            localContext.setLineDash([]);
        }
        
        //bop is going to be green to increase contrast with red text when show information is enabled
        localContext.fillStyle = this.showPendulumInformation === true ? "rgb(0, 255, 0)" : "rgb(0, 0, 255)";
        localContext.lineWidth = 2;
        localContext.font = "20px Arial";

        //scaling factor when pendulum length is greater than max length
        let scalingFactor;

        //first, rotation around pivot

        //move pivot to coordinate center
        localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
        //rotate, here it is possible to use the normal angle and not draw angle
        localContext.transform(Math.cos(-this.angle), Math.sin(-this.angle), -Math.sin(-this.angle), Math.cos(-this.angle), 0, 0);
        //if pendulum is longer than max - scale accordingly so it appears as max
        if (this.pixelsPerMeter*this.pendulumLength > this.pixelsPerMeterMax)
        {
            scalingFactor = this.pixelsPerMeterMax/(this.pixelsPerMeter*this.pendulumLength);
            localContext.transform(scalingFactor, 0, 0, scalingFactor, 0, 0);
        }
        //move the pivot back
        localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);
  
        //draw pendulum line
        localContext.strokeStyle = "rgb(0, 0, 0)";
        localContext.beginPath();
        localContext.moveTo(this.pivotX, this.pivotY);
        localContext.lineTo(this.pivotX, this.pivotY + this.pixelsPerMeter*this.pendulumLength);
        localContext.stroke();
        
        //draw bob
        localContext.beginPath();
        localContext.arc(this.pivotX, this.pivotY + this.pixelsPerMeter*this.pendulumLength, 20, 0, 2*Math.PI);
        localContext.fill();

        //restore transform matrix
        localContext.restore();

        //draw pivot
        localContext.fillStyle = "rgb(0, 0, 0)";;
        localContext.beginPath();
        localContext.arc(this.pivotX, this.pivotY, 5, 0, 2*Math.PI);
        localContext.fill();

        //save transform matrix
        //localContext.save();

        if (this.showPendulumInformation === true)
        {
            //save transform matrix
            localContext.save();

            //the velocity arrow isn't going to be scaled
            //so we do the same transformations as before, but without scaling
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
            localContext.transform(Math.cos(-this.angle), Math.sin(-this.angle), -Math.sin(-this.angle), Math.cos(-this.angle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);
            
            localContext.strokeStyle = "rgb(255, 0, 0)";
            localContext.fillStyle = "rgb(255, 0, 0)";
            localContext.lineWidth = 3;

            //draw arrow line
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY + this.pixelPendulumDrawLength);
            localContext.lineTo(this.pivotX + this.velocity*this.pixelsPerRadPerS*3/4, this.pivotY + this.pixelPendulumDrawLength);
            localContext.stroke();

            //draw arrow point
            localContext.beginPath();
            localContext.moveTo(this.pivotX + this.velocity*this.pixelsPerRadPerS*3/4, this.pivotY + this.pixelPendulumDrawLength - 4);
            localContext.lineTo(this.pivotX + this.velocity*this.pixelsPerRadPerS, this.pivotY + this.pixelPendulumDrawLength);
            localContext.lineTo(this.pivotX + this.velocity*this.pixelsPerRadPerS*3/4, this.pivotY + this.pixelPendulumDrawLength + 4);
            localContext.fill();

            //draw the θ' velocity description - it has to be rotated backwards however, so it is always vertical, no matter the pendulum angle
            localContext.transform(1, 0, 0, 1, this.pivotX + this.velocity*this.pixelsPerRadPerS/2,  this.pivotY + this.pixelPendulumDrawLength + 20);
            localContext.transform(Math.cos(this.angle), Math.sin(this.angle), -Math.sin(this.angle), Math.cos(this.angle), 0, 0);
            localContext.transform(1, 0, 0, 1, -(this.pivotX + this.velocity*this.pixelsPerRadPerS/2), -(this.pivotY + this.pixelPendulumDrawLength + 20));

            //draw the text
            localContext.fillText("θ'", this.pivotX + this.velocity*this.pixelsPerRadPerS/2, this.pivotY + this.pixelPendulumDrawLength + 20);

            //transformations no longer needed
            localContext.restore();

            localContext.strokeStyle = "rgb(255, 0, 0)";
            localContext.fillStyle = "rgb(255, 0, 0)";  

            //angle indicator arc line has to be drawn differently depending on if the angle is positive or negative 
            if (this.drawAngle < 0)
            {
                localContext.beginPath();
                localContext.arc(this.pivotX, this.pivotY, 50, Math.PI/2, Math.PI/2 - this.drawAngle);
                localContext.stroke();
            }
            else
            {
                localContext.beginPath();
                localContext.arc(this.pivotX, this.pivotY, 50, Math.PI/2 - this.drawAngle, Math.PI/2);
                localContext.stroke();
            }

            //draw angle text - this is just simple rotation, so transformations are not used, just sin and cos - we don't have to worry about counter rotating the text itself
            //the whole thing could probably be done more elegantly with tranformations, but it is good enough for now - maybe next project :)
            localContext.fillText("θ", this.pivotX + 35*Math.sin(this.drawAngle/2) , this.pivotY + 35*Math.cos(this.drawAngle/2));
        }

        //reset all transformations - both for pendulum and informations
        //localContext.restore();
    }

    //draw simulation information
    DrawSimulationInformation(localContext)
    {
        localContext.textAlign = "left";
        localContext.fillStyle = "rgb(0,0,0)";
        localContext.font = "15px Arial";

        localContext.fillText("Numerical method: Runge-Kutta (RK4), step: " + step.toString() + " s", this.startX + 10 , this.startY + 15);
        localContext.fillText("Simulation time t: " + (simulationTime - simulationStartTime).toFixed(1).toString() + " s", this.startX + 10 , this.startY + 35);
        localContext.fillText("Angle θ: " + this.drawAngle.toFixed(2).toString() + " (" + this.angle.toFixed(2).toString() + ")" + " rad", this.startX + 10 , this.startY + 55);
        localContext.fillText("Velocity θ': " + this.velocity.toFixed(2).toString() + " rad/s", this.startX + 10 , this.startY + 75);
    }

    Draw(localContext)
    {
        localContext.fillStyle = "rgb(255, 255, 255)";
	    localContext.fillRect(this.startX, this.startY, this.sizeX, this.sizeY);

        this.DrawPendulum(localContext);

        if (this.showSimulationInformation === true)
        {
            this.DrawSimulationInformation(localContext);
        }   
    }
}

//linearly interpolates start point of line based on given percentage
function InterpolateLineStartPoint(startX, startY, endX, endY, percentage)
{
    return [startX + (endX - startX)*percentage, startY + (endY - startY)*percentage];
}

//calculates new state of pendulum and stores past states into arrays for drawing
function AdvanceSimulation()
{
    //runge-kutta variables
    let k1_angle;
    let k2_angle;
    let k3_angle;
    let k4_angle;

    let k1_velocity;
    let k2_velocity;
    let k3_velocity;
    let k4_velocity;

    //run simulation until simulation time is at the same time as program time
    while (simulationTime <= programTime)
    {
        //STANDARD RUNGE-KUTTA looks like this:
        //y' = f(t, y) where y = y(t) - first order differential equation
        //y(t_0) = 0
        //then there are TWO WAYS to express the equations
        //either:
        //k1 = step*f(t_n, y_n)
        //k2 = step*f(t_n + (1/2)*step, y_n + (1/2)*k1)
        //k3 = step*f(t_n + (1/2)*step, y_n + (1/2)*k2)
        //k4 = step*f(t_n + step, y_n + k2)
        //y_n+1 = y_n + (1/6)(k1 + 2*k2 + 2*k3 + k4)
        //t_n+1 = t_n + step
        //or:
        //k1 = f(t_n, y_n)
        //k2 = f(t_n + (1/2)*step, y_n + (1/2)*step*k1)
        //k3 = f(t_n + (1/2)*step, y_n + (1/2)*step*k2)
        //k4 = f(t_n + step, y_n + step*k2)
        //y_n+1 = y_n + (1/6)*step*(k1 + 2*k2 + 2*k3 + k4)
        //t_n+1 = t_n + step
        //(the second one is more common from what I saw, but I think the first one is faster computationally (for higher orders especially))

        //if we need to solve second order differential equation (and higher), it is more complicated
        //first, functions are going to be dependent on more parameters
        //second, they need to be split into multiple equations,
        //because if the vector has more dimensions, we need more values to specify it and one runge kutta returns one value for single dimension
        //and third, the calculations have to be done at the same time
        //Example: the pendulum (y represents theta in this example, to make it shorter)
        //system motion is defined by y'' = -u*y' - (g/L)sin(y) where y = y(t) and y' = y'(t)
        //the vector in phase space now has three dimensions [t, y, y'], so we need to create multiple equations, that define the changes for each component
        //t: doesn't need an equation, this value is going to be manualy changed through stepping
        //y: change in y is simply y' and we know that value, so the equation is [y' = y']
        //y': change in y' is y'', and that is defined by the original equation, so the result is [y'' = -u*y' - (g/L)sin(y)]
        //now we can use Runge-Kutta - (there is also a pdf file showing the equations in this webpage's folder)
        //the equations now have these forms (one more parameter y'):
        //f(t_n, y_n, y'_n) <==> [y]
        //g(t_n, y_n, y'_n) <==> [-u*y' - (g/L)sin(y)]
        //IMPORTANT - pendulum equation does not use all the available parameters, but it could use all, if it was required
        //now, we will be calculating the steps simultaneously
        //the form however, is analogical to the first order case
        //k1_f = step*f(t_n, y_n, y'_n)
        //k1_g = step*g(t_n, y_n, y'_n)

        //k2_f = step*f(t_n + (1/2)*step, y_n + (1/2)*k1_f, y'_n + (1/2)*k1_g)
        //k2_g = step*g(t_n + (1/2)*step, y_n + (1/2)*k1_f, y'_n + (1/2)*k1_g)

        //k3_f = step*f(t_n + (1/2)*step, y_n + (1/2)*k2_f, y'_n + (1/2)*k2_g)
        //k3_g = step*g(t_n + (1/2)*step, y_n + (1/2)*k2_f, y'_n + (1/2)*k2_g)

        //k4_f = step*f(t_n + step, y_n + k3_f,  y'_n + k3_g)
        //k4_g = step*g(t_n + step, y_n + k3_f,  y'_n + k3_g)

        //t_n+1 = t_n + step
        //y_n+1 = y_n + (1/6)*(k1_f + 2*k2_f + 2*k3_f + k4_f)
        //y'_n+1 = y'_n + (1/6)*(k1_g + 2*k2_g + 2*k3_g + k4_g)

        //actual pendulum calculation:
        k1_angle = step*angleChangeFunction(currentAngle, currentVelocity);
        k1_velocity = step*velocityChangeFunction(currentAngle, currentVelocity);

        k2_angle = step*angleChangeFunction(currentAngle + 0.5*k1_angle, currentVelocity + 0.5*k1_velocity);
        k2_velocity = step*velocityChangeFunction(currentAngle + 0.5*k1_angle, currentVelocity + 0.5*k1_velocity);

        k3_angle = step*angleChangeFunction(currentAngle + 0.5*k2_angle, currentVelocity + 0.5*k2_velocity);
        k3_velocity = step*velocityChangeFunction(currentAngle + 0.5*k2_angle, currentVelocity + 0.5*k2_velocity);

        k4_angle = step*angleChangeFunction(currentAngle + k3_angle, currentVelocity + k3_velocity);
        k4_velocity = step*velocityChangeFunction(currentAngle + k3_angle, currentVelocity + k3_velocity);

        newAngle = currentAngle +  1/6*(k1_angle + 2*k2_angle + 2*k3_angle + k4_angle);
        newVelocity = currentVelocity + 1/6*(k1_velocity + 2*k2_velocity + 2*k3_velocity + k4_velocity);

        //new is now current
        currentAngle = newAngle;
        currentVelocity = newVelocity;
        
        //add time step to simulation time
        simulationTime += step;

        //STORING PAST STATES

        //once every 1/linesPerSecond since simulation start
        //(first element is inserted right after pressing the button so initially, firstPointPlacementTime === simulationTime ), 
        //a current state is going to be stored into arrays
        //(technically, this shoud be a while cycle because if the simulation time would have big steps, 
        //then storage points would be skipped, but that is not going to happen - the simulation step is always going to be much lower than the time of storing states for drawing )
        if (simulationTime > firstPointPlacementTime + 1/linesPerSecond)
        {
            //simulation time just passed the scheduled point for storing state

            //push state into arrays
            angleVelocityLineSegments.push([newAngle, newVelocity]);
            timeAngleLineSegments.push([simulationTime - simulationStartTime, newAngle]);
            timeVelocityLineSegments.push([simulationTime - simulationStartTime, newVelocity]);

            //calculate next checkpoint for storing state
            firstPointPlacementTime += 1/linesPerSecond;

            //array lengths are the same
            //if the arrays contain more than required number of segments, then the oldest ones are removed - could be more than one
            //also +1, because for example two line sper second => three stored points
            if (angleVelocityLineSegments.length > linesPerSecond*linePersistenceDuration + 1)
            {
                angleVelocityLineSegments.splice(0, Math.ceil(angleVelocityLineSegments.length - (linesPerSecond*linePersistenceDuration + 1)));
                timeAngleLineSegments.splice(0, Math.ceil(timeAngleLineSegments.length - (linesPerSecond*linePersistenceDuration + 1)));
                timeVelocityLineSegments.splice(0, Math.ceil(timeVelocityLineSegments.length - (linesPerSecond*linePersistenceDuration + 1)));
            }
        }
    }

    //because the points can be sampled at lower rate then framerate (the reason is to improve performance), the line appears to lag and be discontinuous from current state
    //this is going to be solved with two approaches:
    //first, the newest point in the array is going to be manually connected to current value 
    //(if the value was just sampled, then the last value in the array is going to be the same as current value, but that's fine, the line is just going te drawn as point)
    //second, the last line is going to be interpolated based on the current percentage of time before next sampling
    if (angleVelocityLineSegments.length >= 2 && angleVelocityLineSegments.length >= linesPerSecond*linePersistenceDuration + 1)
    {  
        //if the array contains at least two points (this is neccesary for the interpolation (this also implies that we cannot smooth out line
        //with persistence less than 1/linesPerSecond seconds, so user cannot choose that value)) and also it is necessary to check
        //if the user did not extended the duration (in that case, interpolation is not necessary - we just wait until the line extends to desired duration)
        //BUT - in order to keep it simple, when the user jumps from to different duration, the oldest line is going to stop beeing interpolated immediately
        //and it is visible, but because the sample rate is still quite small - it is not very noticable - it is not easy to implement continuously

        //create new copy
        angleVelocityLineSegmentsSmooth = angleVelocityLineSegments.slice();
        //interpolate oldest line
        angleVelocityLineSegmentsSmooth[0] = InterpolateLineStartPoint(angleVelocityLineSegments[0][0], angleVelocityLineSegments[0][1], angleVelocityLineSegments[1][0], angleVelocityLineSegments[1][1], (simulationTime - firstPointPlacementTime)/(1/linesPerSecond));
        //connect newest line with current values
        angleVelocityLineSegmentsSmooth.push([newAngle, newVelocity]);

        //analogical

        timeAngleLineSegmentsSmooth = timeAngleLineSegments.slice();
        timeAngleLineSegmentsSmooth[0] = InterpolateLineStartPoint(timeAngleLineSegments[0][0], timeAngleLineSegments[0][1], timeAngleLineSegments[1][0], timeAngleLineSegments[1][1], (simulationTime - firstPointPlacementTime)/(1/linesPerSecond));
        timeAngleLineSegmentsSmooth.push([simulationTime - simulationStartTime, newAngle]);

        timeVelocityLineSegmentsSmooth = timeVelocityLineSegments.slice();
        timeVelocityLineSegmentsSmooth[0] = InterpolateLineStartPoint(timeVelocityLineSegments[0][0], timeVelocityLineSegments[0][1], timeVelocityLineSegments[1][0], timeVelocityLineSegments[1][1], (simulationTime - firstPointPlacementTime)/(1/linesPerSecond));
        timeVelocityLineSegmentsSmooth.push([simulationTime - simulationStartTime, newVelocity]);
    }
    else
    {
        //otherwise draw line without last segment interpolation

        angleVelocityLineSegmentsSmooth = angleVelocityLineSegments.slice();
        angleVelocityLineSegmentsSmooth.push([newAngle, newVelocity]);

        timeAngleLineSegmentsSmooth = timeAngleLineSegments.slice();
        timeAngleLineSegmentsSmooth.push([simulationTime - simulationStartTime, newAngle]);

        timeVelocityLineSegmentsSmooth = timeVelocityLineSegments.slice();
        timeVelocityLineSegmentsSmooth.push([simulationTime - simulationStartTime, newVelocity]);
    }
}

function DrawSimulation(localContext)
{
    //set text position properties
	context.textAlign = "center";
	context.textBaseline = "middle";

    //give current state to pendulum and draw it
    pendulum.SetAngle(currentAngle);
    pendulum.SetVelocity(currentVelocity);
    pendulum.SetPendulumLength(pendulumLength);
	pendulum.SetShowSimulationInformation(checkbox1.GetValue());
    pendulum.SetShowPendulumInformation(checkbox2.GetValue());

    pendulum.Draw(localContext);

    //give current state to angle velocity phase space and draw it
    angleVelocityPhaseSpace.SetViewpointPosition(currentAngle, currentVelocity);
    angleVelocityPhaseSpace.DrawBase(localContext); 
    angleVelocityPhaseSpace.DrawLine(localContext, angleVelocityLineSegmentsSmooth, "rgb(0, 0, 155)", 2, true);
    angleVelocityPhaseSpace.DrawPoint(localContext, currentAngle, currentVelocity, 4, "rgb(0, 0, 155)");

    //give current state to angle and velocity graphs and draw them
    if (simulationRunning === true)
    {
        //simulation is running, and because these graphs use time - we have to calculate it -> simulationTime - simulationStartTime

        angleGraph.SetViewpointPosition(simulationTime - simulationStartTime, currentAngle);
        angleGraph.DrawBase(localContext);
        angleGraph.DrawLine(localContext, timeAngleLineSegmentsSmooth, "rgb(0, 0, 155)", 2, true);
        angleGraph.DrawPoint(localContext, simulationTime - simulationStartTime, currentAngle, 4, "rgb(0, 0, 155)");

        velocityGraph.SetViewpointPosition(simulationTime - simulationStartTime, currentVelocity);
        velocityGraph.DrawBase(localContext);
        velocityGraph.DrawLine(localContext, timeVelocityLineSegmentsSmooth, "rgb(0, 0, 155)", 2, true);
        velocityGraph.DrawPoint(localContext, simulationTime - simulationStartTime, currentVelocity, 4, "rgb(0, 0, 155)");
    }
    else
    {
        //simulation is not running, and because these graphs use time and simulationStartTime is not yet set - we have to manually assign 0

        angleGraph.SetViewpointPosition(0, currentAngle);
        angleGraph.DrawBase(localContext);
        angleGraph.DrawLine(localContext, timeAngleLineSegmentsSmooth, "rgb(0, 0, 155)", 2, true);
        angleGraph.DrawPoint(localContext, 0, currentAngle, 4, "rgb(0, 0, 155)");

        velocityGraph.SetViewpointPosition(0, currentVelocity);
        velocityGraph.DrawBase(localContext);
        velocityGraph.DrawLine(localContext, timeVelocityLineSegmentsSmooth, "rgb(0, 0, 155)", 2, true);
        velocityGraph.DrawPoint(localContext, 0, currentVelocity, 4, "rgb(0, 0, 155)");
    }

    //draw framerate
    localContext.fillStyle = "rgb(0,0,0)";
    localContext.font = "15px Arial";
    localContext.fillText("Framerate: " + (1000/deltaTime).toFixed(2).toString() + " fps", 1354 , 14);
}













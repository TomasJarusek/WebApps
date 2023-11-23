//Doublew Pendulum
//Ing. Tomas Jarusek, 12/2021

//double pendulum draw class
class DoublePendulum
{
	constructor() 
	{
        //top left coordinate
        this.startX = 25;
        this.startY = 25;

        //sizes
        this.sizeX = 1400;
        this.sizeY = 900;

        //pivot coordinate is always in the center
        this.pivotX = this.startX + this.sizeX/2;
        this.pivotY = this.startY + this.sizeY/2;

        //angles
        this.firstPendulumAngle = 1;
        this.secondPendulumAngle = 1;
        //draw angles - always between -pi and pi
        this.firstPendulumDrawAngle = 1;
        this.secondPendulumDrawAngle = 1;
        
        //velocities
        this.firstPendulumVelocity = 0;
        this.secondPendulumVelocity = 0;
        //pixel length of arrow that represents 1 rad/s
        this.pixelsPerRadPerS = 15;

        //lengths
        this.firstPendulumLength = 1;
        this.secondPendulumLength = 1;
        //pixels per meter
        this.pixelsPerMeter = 200;
        //maximum pixel draw length
        this.pendulumDrawLengthMax = 400;
        //if pendulum should be longer than maximum, then scaling factor is calculated to scale it down back to max
        this.currentScalingFactor = 1;
        //final pixel draw length after scaling
        this.firstPendulumDrawLength = this.pixelsPerMeter;
        this.secondPendulumDrawLength = this.pixelsPerMeter;

        //masses of the pendulum's bobs
        this.firstPendulumMass = 1;
        this.secondPendulumMass = 1;

        this.showFirstPendulumTrace = false;
        this.showSecondPendulumTrace = true;
        this.showSimulationInformation = true;
        this.showPendulumInformation = false;

        //traces for pendulums
        this.firstPendulumTrace = [];
        this.secondPendulumTrace = [];
    }

    //------------------------PENDULUM PARAMETERS------------------------

    //set angle of first pendulum
    SetFirstPendulumAngle(firstPendulumAngle)
    {
        //set standard angle
        this.firstPendulumAngle = firstPendulumAngle;

        //also calculate draw angle - so we don't have to recalculate it while drawing 

        //put it into range of -2pi to 2pi
        this.firstPendulumDrawAngle = firstPendulumAngle % (2*Math.PI);
        
        //if positive angle overlaps into the negative quadrants or vice versa, the angle has to be corrected
        if (this.firstPendulumDrawAngle >= 0)
        {
            if (this.firstPendulumDrawAngle > Math.PI)
            {
                this.firstPendulumDrawAngle = -(2*Math.PI - this.firstPendulumDrawAngle);
            }
        }
        else
        {
            if (this.firstPendulumDrawAngle < -Math.PI)
            {
                this.firstPendulumDrawAngle = -(-2*Math.PI - this.firstPendulumDrawAngle);
            }
        }
    }

    //analogical to first pendulum
    SetSecondPendulumAngle(secondPendulumAngle)
    {
        this.secondPendulumAngle = secondPendulumAngle;

        this.secondPendulumDrawAngle = secondPendulumAngle % (2*Math.PI);

        if (this.secondPendulumDrawAngle >= 0)
        {
            if (this.secondPendulumDrawAngle > Math.PI)
            {
                this.secondPendulumDrawAngle = -(2*Math.PI - this.secondPendulumDrawAngle);
            }
        }
        else
        {
            if (this.secondPendulumDrawAngle < -Math.PI)
            {
                this.secondPendulumDrawAngle = -(-2*Math.PI - this.secondPendulumDrawAngle);
            }
        }
    }

    //set first pendulum's velocity
    SetFirstPendulumVelocity(firstPendulumVelocity)
    {
        this.firstPendulumVelocity = firstPendulumVelocity;
    }

    //set second pendulum's velocity
    SetSecondPendulumVelocity(secondPendulumVelocity)
    {
        this.secondPendulumVelocity = secondPendulumVelocity;
    }

    //set first pendulum's length
    SetFirstPendulumLength(firstPendulumLength)
    {
        //set standard length
        this.firstPendulumLength = firstPendulumLength;

        //set draw length - just apply the multiplier
        this.firstPendulumDrawLength = firstPendulumLength*this.pixelsPerMeter;
        
        //we are also going to recalculate the scaling factor, if the draw length is bigger than the max
        if (this.firstPendulumDrawLength + this.secondPendulumDrawLength > this.pendulumDrawLengthMax)
        {
            this.currentScalingFactor = this.pendulumDrawLengthMax/(this.firstPendulumDrawLength + this.secondPendulumDrawLength);
        }
        else
        {
            this.currentScalingFactor = 1;
        }
    }

    //analogical to first pendulum
    SetSecondPendulumLength(secondPendulumLength)
    {
        this.secondPendulumLength = secondPendulumLength;

        this.secondPendulumDrawLength = secondPendulumLength*this.pixelsPerMeter;

        if (this.firstPendulumDrawLength + this.secondPendulumDrawLength > this.pendulumDrawLengthMax)
        {
            this.currentScalingFactor = this.pendulumDrawLengthMax/(this.firstPendulumDrawLength + this.secondPendulumDrawLength);
        }    
        else
        {
            this.currentScalingFactor = 1;
        }
    }

    //set first pendulum's bob mass
    SetFirstPendulumMass(firstPendulumMass)
    {
        this.firstPendulumMass = firstPendulumMass;
    }

    //set second pendulum's bob mass
    SetSecondPendulumMass(secondPendulumMass)
    {
        this.secondPendulumMass = secondPendulumMass;
    }

    //set show first pendulum's trace
    SetShowFirstPendulumTrace(showFirstPendulumTrace)
    {
        this.showFirstPendulumTrace = showFirstPendulumTrace;
    }
    
    //set show second pendulum's trace
    SetShowSecondPendulumTrace(showSecondPendulumTrace)
    {
        this.showSecondPendulumTrace = showSecondPendulumTrace;
    }

    //set show simulation information
    SetShowSimulationInformation(showSimulationInformation)
    {
        this.showSimulationInformation = showSimulationInformation;
    }

    //set show pendulum information
    SetShowPendulumInformation(showPendulumInformation)
    {
        this.showPendulumInformation = showPendulumInformation;
    }
    
    //------------------------TRACES------------------------

    //add a single tracepoint to the first pendulum's array
    AddFirstPendulumTracepoint(firstPendulumAngle, secondPendulumAngle)
    {
        //current position of first pendulum's bob
        //we have to calculate it manually because the draw process is based on transformations and it only uses angles
        let firstPendulumBobX = this.pivotX + Math.sin(firstPendulumAngle)*this.firstPendulumDrawLength*this.currentScalingFactor;   
        let firstPendulumBobY = this.pivotY + Math.cos(firstPendulumAngle)*this.firstPendulumDrawLength*this.currentScalingFactor;

        //push it into array
        this.firstPendulumTrace.push([firstPendulumBobX, firstPendulumBobY]);
    }

    //add a single tracepoint to the seconds pendulum's array
    AddSecondPendulumTracepoint(firstPendulumAngle, secondPendulumAngle)
    {
        let firstPendulumBobX = this.pivotX + Math.sin(firstPendulumAngle)*this.firstPendulumDrawLength*this.currentScalingFactor;   
        let firstPendulumBobY = this.pivotY + Math.cos(firstPendulumAngle)*this.firstPendulumDrawLength*this.currentScalingFactor;
        //current position of second pendulum's bob
        //we have to calculate it manually because the draw process is based on transformations and it only uses angles
        let secondPendulumBobX = firstPendulumBobX + Math.sin(secondPendulumAngle)*this.secondPendulumDrawLength*this.currentScalingFactor;   
        let secondPendulumBobY = firstPendulumBobY + Math.cos(secondPendulumAngle)*this.secondPendulumDrawLength*this.currentScalingFactor;
       
        //push it into array
        this.secondPendulumTrace.push([secondPendulumBobX, secondPendulumBobY]);
    }

    //returns number of first pendulum's tracepoints
    GetNumberOfFirstPendulumTracepoints()
    {
        return this.firstPendulumTrace.length;
    }

    //returns number of second pendulum's tracepoints
    GetNumberOfSecondPendulumTracepoints()
    {
        return this.secondPendulumTrace.length;
    }

    //returns number of first pendulum's tracepoints
    RemoveMultipleOldestTracepointsOfFirstPendulum(numberOfPointsToRemove)
    {
        this.firstPendulumTrace.splice(0, numberOfPointsToRemove);
    }

    //returns number of second pendulum's tracepoints
    RemoveMultipleOldestTracepointsOfSecondPendulum(numberOfPointsToRemove)
    {
        this.secondPendulumTrace.splice(0, numberOfPointsToRemove);
    }

    //reset first pendulum's trace
    ResetFirstPendulumTrace()
    {
        this.firstPendulumTrace = [];
    }

    //reset second pendulum's trace
    ResetSecondPendulumTrace()
    {
        this.secondPendulumTrace = [];
    }

    //------------------------DRAWING------------------------
 
	//draw the whole pendulum
    DrawDoublePendulum(localContext)
    {	
		//align the text
        localContext.textAlign = "center";
        localContext.textBaseline = "middle";
 
        if (this.showPendulumInformation === true)
        {
            localContext.save();

            //1) dashlines are drawn

			//set dash and line parameters
            localContext.strokeStyle = "rgb(0, 0, 0)";
            localContext.lineWidth = 1;
            localContext.setLineDash([5, 10]); 
            
            //draw starts from bottom - dashes look nicer near the pivot
			
			//draw zero degree dash line of the first pendulum
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor);
            localContext.lineTo(this.pivotX, this.pivotY);
            localContext.stroke();

			//rotate around the pivot
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
            localContext.transform(Math.cos(-this.firstPendulumAngle), Math.sin(-this.firstPendulumAngle), -Math.sin(-this.firstPendulumAngle), Math.cos(-this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);

			//counteract the rotation but now from the first pendulum's bob so the second pendulum's zero degree line is vertical
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor);
            localContext.transform(Math.cos(this.firstPendulumAngle), Math.sin(this.firstPendulumAngle), -Math.sin(this.firstPendulumAngle), Math.cos(this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor));
			
			//draw zero degree dash line of the second pendulum
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength)*this.currentScalingFactor);
            localContext.lineTo(this.pivotX, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor);
            localContext.stroke();
            
            localContext.restore();

            localContext.save();

            //2) angle indicators are drawn

            localContext.strokeStyle = "rgb(255, 0, 0)";
            localContext.lineWidth = 3;

			//draw the first angle indicator - arc drawing is different depending on if the angle is positive or negative
            if (this.firstPendulumDrawAngle < 0)
            {
                localContext.beginPath();
                localContext.arc(this.pivotX, this.pivotY, this.firstPendulumDrawLength*this.currentScalingFactor*0.3, Math.PI/2, Math.PI/2 - this.firstPendulumDrawAngle);
                localContext.stroke();
            }
            else
            {
                localContext.beginPath();
                localContext.arc(this.pivotX, this.pivotY, this.firstPendulumDrawLength*this.currentScalingFactor*0.3, Math.PI/2 - this.firstPendulumDrawAngle, Math.PI/2);
                localContext.stroke();
            }
            
            //rotate around pivot point
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
            localContext.transform(Math.cos(-this.firstPendulumAngle), Math.sin(-this.firstPendulumAngle), -Math.sin(-this.firstPendulumAngle), Math.cos(-this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);

            //rotate around first pendulum's bob
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor);
            localContext.transform(Math.cos(this.firstPendulumAngle), Math.sin(this.firstPendulumAngle), -Math.sin(this.firstPendulumAngle), Math.cos(this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor));

            //draw the second angle indicator
            if (this.secondPendulumDrawAngle < 0)
            {
                localContext.beginPath();
                localContext.arc(this.pivotX, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor, this.secondPendulumDrawLength*this.currentScalingFactor*0.3, Math.PI/2, Math.PI/2 - this.secondPendulumDrawAngle);
                localContext.stroke();
            }
            else
            {
                localContext.beginPath();
                localContext.arc(this.pivotX, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor, this.secondPendulumDrawLength*this.currentScalingFactor*0.3, Math.PI/2 - this.secondPendulumDrawAngle, Math.PI/2);
                localContext.stroke();
            }

            localContext.restore();

            localContext.save();

            //3) pendulum arms are drawn

            localContext.strokeStyle = "rgb(0, 0, 0)";
            localContext.lineWidth = 2;

            //scale and rotate around pivot
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
            localContext.transform(this.currentScalingFactor, 0, 0, this.currentScalingFactor, 0, 0);
            localContext.transform(Math.cos(-this.firstPendulumAngle), Math.sin(-this.firstPendulumAngle), -Math.sin(-this.firstPendulumAngle), Math.cos(-this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);
    
            //draw first pendulum's arm
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY);
            localContext.lineTo(this.pivotX, this.pivotY + this.firstPendulumDrawLength);
            localContext.stroke();

            //rotate around first pendulum's bob
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + this.firstPendulumDrawLength);
            localContext.transform(Math.cos(-(this.secondPendulumAngle-this.firstPendulumAngle)), Math.sin(-(this.secondPendulumAngle-this.firstPendulumAngle)), -Math.sin(-(this.secondPendulumAngle-this.firstPendulumAngle)), Math.cos(-(this.secondPendulumAngle-this.firstPendulumAngle)), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + this.firstPendulumDrawLength));

            //draw second pendulum's arm
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY + this.firstPendulumDrawLength);
            localContext.lineTo(this.pivotX, this.pivotY + this.firstPendulumDrawLength + this.secondPendulumDrawLength);
            localContext.stroke();

            localContext.restore();

            localContext.save();

            //4) angle texts are drawn

			//start drawing the text that describes the first pendulum's angle

            localContext.fillStyle = "rgb(255, 0, 0)";
			
			//the text is placed in the center of the angle, so we rotate only by the angle divided by two
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
            localContext.transform(Math.cos(-this.firstPendulumDrawAngle/2), Math.sin(-this.firstPendulumDrawAngle/2), -Math.sin(-this.firstPendulumDrawAngle/2), Math.cos(-this.firstPendulumDrawAngle/2), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);

			//then we counteract the rotation from the perspective of the text, so it appears vertical
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + (this.firstPendulumDrawLength*this.currentScalingFactor*0.2));
            localContext.transform(Math.cos(this.firstPendulumDrawAngle/2), Math.sin(this.firstPendulumDrawAngle/2), Math.sin(-this.firstPendulumDrawAngle/2), Math.cos(this.firstPendulumDrawAngle/2), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + (this.firstPendulumDrawLength*this.currentScalingFactor*0.2)));

			//draw the text
            localContext.font = (this.firstPendulumDrawLength*this.currentScalingFactor*0.3)*0.4.toString() + "px Arial";
            localContext.fillText("θ₁", this.pivotX , this.pivotY + (this.firstPendulumDrawLength*this.currentScalingFactor*0.2));

            localContext.restore();

            localContext.save();

            //start drawing the same stuff again for second pendulum (we can't reuse previous transformations)

            localContext.fillStyle = "rgb(255, 0, 0)";

            //rotate around pivot point
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
            localContext.transform(Math.cos(-this.firstPendulumAngle), Math.sin(-this.firstPendulumAngle), -Math.sin(-this.firstPendulumAngle), Math.cos(-this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);
 
            //rotate around first pendulum's bob
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor);
            localContext.transform(Math.cos(this.firstPendulumAngle), Math.sin(this.firstPendulumAngle), -Math.sin(this.firstPendulumAngle), Math.cos(this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor));

            //rotate around first pendulum's bob (half the angle)
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + (this.firstPendulumDrawLength*this.currentScalingFactor));
            localContext.transform(Math.cos(-this.secondPendulumDrawAngle/2), Math.sin(-this.secondPendulumDrawAngle/2), Math.sin(this.secondPendulumDrawAngle/2), Math.cos(-this.secondPendulumDrawAngle/2), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + (this.firstPendulumDrawLength*this.currentScalingFactor)));

            //rotate around the text
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength*0.2)*this.currentScalingFactor);
            localContext.transform(Math.cos(this.secondPendulumDrawAngle/2), Math.sin(this.secondPendulumDrawAngle/2), Math.sin(-this.secondPendulumDrawAngle/2), Math.cos(this.secondPendulumDrawAngle/2), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength*0.2)*this.currentScalingFactor));

            //draw the text
            localContext.font = (this.secondPendulumDrawLength*this.currentScalingFactor*0.3)*0.4.toString() + "px Arial";
            localContext.fillText("θ₂", this.pivotX , this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength*0.2)*this.currentScalingFactor);

            localContext.restore();
        }
        else
        {
            localContext.save();

            //1-4) pendulum arms are drawn

            localContext.strokeStyle = "rgb(0, 0, 0)";
            localContext.lineWidth = 2;

            //scale and rotate around pivot
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
            localContext.transform(this.currentScalingFactor, 0, 0, this.currentScalingFactor, 0, 0);
            localContext.transform(Math.cos(-this.firstPendulumAngle), Math.sin(-this.firstPendulumAngle), -Math.sin(-this.firstPendulumAngle), Math.cos(-this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);
    
            //draw first pendulum's arm
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY);
            localContext.lineTo(this.pivotX, this.pivotY + this.firstPendulumDrawLength);
            localContext.stroke();

            //rotate around first pendulum's bob
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + this.firstPendulumDrawLength);
            localContext.transform(Math.cos(-(this.secondPendulumAngle-this.firstPendulumAngle)), Math.sin(-(this.secondPendulumAngle-this.firstPendulumAngle)), -Math.sin(-(this.secondPendulumAngle-this.firstPendulumAngle)), Math.cos(-(this.secondPendulumAngle-this.firstPendulumAngle)), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + this.firstPendulumDrawLength));

            //draw second pendulum's arm
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY + this.firstPendulumDrawLength);
            localContext.lineTo(this.pivotX, this.pivotY + this.firstPendulumDrawLength + this.secondPendulumDrawLength);
            localContext.stroke();

            localContext.restore();
        }

        //5) pivot and bobs are drawn

        localContext.fillStyle = "rgb(0, 0, 0)";

        //draw pivot
        localContext.beginPath();
        localContext.arc(this.pivotX, this.pivotY, 5, 0, 2*Math.PI);
        localContext.fill();

        localContext.save();

        //scale and rotate around pivot
        localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
        localContext.transform(this.currentScalingFactor, 0, 0, this.currentScalingFactor, 0, 0);
        localContext.transform(Math.cos(-this.firstPendulumAngle), Math.sin(-this.firstPendulumAngle), -Math.sin(-this.firstPendulumAngle), Math.cos(-this.firstPendulumAngle), 0, 0);
        localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);

        localContext.strokeStyle = "rgb(0, 0, 0)";
        localContext.fillStyle = this.showPendulumInformation === true ? "rgb(0, 255, 0)": "rgb(0, 0, 255)";
        localContext.lineWidth = 2;

        //draw first bob
        localContext.beginPath();
        localContext.arc(this.pivotX, this.pivotY + this.firstPendulumDrawLength, 15*Math.sqrt(this.firstPendulumMass), 0, 2*Math.PI);
        localContext.fill();

        //rotate around first pendulum's bob
        localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + this.firstPendulumDrawLength);
        localContext.transform(Math.cos(-(this.secondPendulumAngle-this.firstPendulumAngle)), Math.sin(-(this.secondPendulumAngle-this.firstPendulumAngle)), -Math.sin(-(this.secondPendulumAngle-this.firstPendulumAngle)), Math.cos(-(this.secondPendulumAngle-this.firstPendulumAngle)), 0, 0);
        localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + this.firstPendulumDrawLength));

        //draw second bob
        localContext.beginPath();
        localContext.arc(this.pivotX, this.pivotY + this.firstPendulumDrawLength + this.secondPendulumDrawLength, 15*Math.sqrt(this.secondPendulumMass), 0, 2*Math.PI);
        localContext.fill();

        localContext.restore();

        if (this.showPendulumInformation === true)
        {
            localContext.save();

            //6) velocity arrows and their texts are drawn

            localContext.strokeStyle = "rgb(255, 0, 0)";
            localContext.fillStyle = "rgb(255, 0, 0)";
            localContext.lineWidth = 3;

            //rotate around pivot
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY);
            localContext.transform(Math.cos(-this.firstPendulumAngle), Math.sin(-this.firstPendulumAngle), -Math.sin(-this.firstPendulumAngle), Math.cos(-this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -this.pivotY);
          
            //draw first pendulum's arrow line
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor);
            localContext.lineTo(this.pivotX + this.firstPendulumVelocity*this.pixelsPerRadPerS*3/4, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor);
            localContext.stroke();
            
            //draw first pendulum's arrow point
            localContext.beginPath();
            localContext.moveTo(this.pivotX + this.firstPendulumVelocity*this.pixelsPerRadPerS*3/4, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor - 4);
            localContext.lineTo(this.pivotX + this.firstPendulumVelocity*this.pixelsPerRadPerS, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor);
            localContext.lineTo(this.pivotX + this.firstPendulumVelocity*this.pixelsPerRadPerS*3/4, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor + 4);
            localContext.fill();

            localContext.save();

            //draw the first pendulum's arrow description text

            localContext.font = "20px Arial";

            //transform in such a way that the text is vertical and always in the halfway point of the arrow length
            localContext.transform(1, 0, 0, 1, this.pivotX + this.firstPendulumVelocity*this.pixelsPerRadPerS/2,  this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor - 15);
            localContext.transform(Math.cos(this.firstPendulumAngle), Math.sin(this.firstPendulumAngle), -Math.sin(this.firstPendulumAngle), Math.cos(this.firstPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -(this.pivotX + this.firstPendulumVelocity*this.pixelsPerRadPerS/2), -(this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor - 15));

            //draw the text 
            localContext.fillText("θ₁'", this.pivotX + this.firstPendulumVelocity*this.pixelsPerRadPerS/2, this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor - 15);

            localContext.restore();

            //rotate around first pendulum's bob
            localContext.transform(1, 0, 0, 1, this.pivotX,  this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor);
            localContext.transform(Math.cos(-(this.secondPendulumAngle-this.firstPendulumAngle)), Math.sin(-(this.secondPendulumAngle-this.firstPendulumAngle)), -Math.sin(-(this.secondPendulumAngle-this.firstPendulumAngle)), Math.cos(-(this.secondPendulumAngle-this.firstPendulumAngle)), 0, 0);
            localContext.transform(1, 0, 0, 1, -this.pivotX, -(this.pivotY + this.firstPendulumDrawLength*this.currentScalingFactor));
            
            //draw second pendulum's arrow line
            localContext.beginPath();
            localContext.moveTo(this.pivotX, this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength)*this.currentScalingFactor);
            localContext.lineTo(this.pivotX + this.secondPendulumVelocity*this.pixelsPerRadPerS*3/4, this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength)*this.currentScalingFactor);
            localContext.stroke();

            //draw arrow point
            localContext.beginPath();
            localContext.moveTo(this.pivotX + this.secondPendulumVelocity*this.pixelsPerRadPerS*3/4, this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength)*this.currentScalingFactor - 4);
            localContext.lineTo(this.pivotX + this.secondPendulumVelocity*this.pixelsPerRadPerS, this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength)*this.currentScalingFactor);
            localContext.lineTo(this.pivotX + this.secondPendulumVelocity*this.pixelsPerRadPerS*3/4, this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength)*this.currentScalingFactor + 4);
            localContext.fill();

            localContext.save();

            //draw the second pendulum's arrow description text

            //transform in such a way that the text is vertical and always in the halfway point of the arrow length
            localContext.transform(1, 0, 0, 1, this.pivotX + this.secondPendulumVelocity*this.pixelsPerRadPerS/2,  this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength)*this.currentScalingFactor - 15);
            localContext.transform(Math.cos(this.secondPendulumAngle), Math.sin(this.secondPendulumAngle), -Math.sin(this.secondPendulumAngle), Math.cos(this.secondPendulumAngle), 0, 0);
            localContext.transform(1, 0, 0, 1, -(this.pivotX + this.secondPendulumVelocity*this.pixelsPerRadPerS/2), -(this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength)*this.currentScalingFactor - 15));

            //draw the text 
            localContext.font = "20px Arial";
            localContext.fillText("θ₂'", this.pivotX + this.secondPendulumVelocity*this.pixelsPerRadPerS/2, this.pivotY + (this.firstPendulumDrawLength + this.secondPendulumDrawLength)*this.currentScalingFactor - 15);
            
            localContext.restore();

            localContext.restore();
        }
    }

    DrawSimulationInformation(localContext)
    {
        localContext.textAlign = "left";
        localContext.fillStyle = "rgb(0,0,0)";
        localContext.font = "15px Arial";

        localContext.fillText("Numerical method: Runge-Kutta (RK4), step: " + step.toString() + " s", this.startX + 10 , this.startY + 15);
        localContext.fillText("Simulation time t: " + (simulationTime - simulationStartTime).toFixed(1).toString() + " s", this.startX + 10 , this.startY + 35);
        localContext.fillText("Angle θ₁: " + this.firstPendulumDrawAngle.toFixed(2).toString() + " (" + this.firstPendulumAngle.toFixed(2).toString() + ")" + " rad", this.startX + 10 , this.startY + 55);
        localContext.fillText("Velocity θ₁': " + this.firstPendulumVelocity.toFixed(2).toString() + " rad/s", this.startX + 10 , this.startY + 75);
        localContext.fillText("Angle θ₂: " + this.secondPendulumDrawAngle.toFixed(2).toString() + " (" + this.secondPendulumAngle.toFixed(2).toString() + ")" + " rad", this.startX + 10 , this.startY + 95);
        localContext.fillText("Velocity θ₂': " + this.secondPendulumVelocity.toFixed(2).toString() + " rad/s", this.startX + 10 , this.startY + 115);
    }

    DrawTraces(localContext)
    {
        //line coordinates
        let lineStartPixelX;
        let lineStartPixelY;
        let lineEndPixelX;
        let lineEndPixelY;
   
        localContext.lineWidth = 1;

        if (this.showFirstPendulumTrace === true)
        {
            localContext.strokeStyle = "rgb(0, 0, 0)";

            if (this.firstPendulumTrace.length >= 1)
            {
                //connect the newest tracepoint to the current bob's location - so it does not appear discontinuous

                //calculate the coordinate of the first pendulum's bob
                let firstPendulumBobX = this.pivotX + Math.sin(this.firstPendulumAngle)*this.firstPendulumDrawLength*this.currentScalingFactor;   
                let firstPendulumBobY = this.pivotY + Math.cos(this.firstPendulumAngle)*this.firstPendulumDrawLength*this.currentScalingFactor;

                //draw the line
                localContext.beginPath();
                localContext.moveTo(this.firstPendulumTrace[this.firstPendulumTrace.length - 1][0], this.firstPendulumTrace[this.firstPendulumTrace.length - 1][1]);
                localContext.lineTo(firstPendulumBobX, firstPendulumBobY);
                localContext.stroke();
            }

            //draw the rest of the trace
            for (let i = 1; i < this.firstPendulumTrace.length; i++)
            {
                lineStartPixelX = this.firstPendulumTrace[i - 1][0];
                lineStartPixelY = this.firstPendulumTrace[i - 1][1];
                lineEndPixelX = this.firstPendulumTrace[i][0];
                lineEndPixelY = this.firstPendulumTrace[i][1];

                localContext.beginPath();
                localContext.moveTo(lineStartPixelX, lineStartPixelY);
                localContext.lineTo(lineEndPixelX, lineEndPixelY);
                localContext.stroke();
            }
        }

        if (this.showSecondPendulumTrace === true)
        {
            localContext.strokeStyle = "rgb(255, 0, 0)";

            if (this.secondPendulumTrace.length >= 1)
            {
                //connect the newest tracepoint to the current bob's location - so it does not appear discontinuous

                //calculate the coordinate of the second pendulum's bob
                let firstPendulumBobX = this.pivotX + Math.sin(this.firstPendulumAngle)*this.firstPendulumDrawLength*this.currentScalingFactor;   
                let firstPendulumBobY = this.pivotY + Math.cos(this.firstPendulumAngle)*this.firstPendulumDrawLength*this.currentScalingFactor;
                let secondPendulumBobX = firstPendulumBobX + Math.sin(this.secondPendulumAngle)*this.secondPendulumDrawLength*this.currentScalingFactor;   
                let secondPendulumBobY = firstPendulumBobY + Math.cos(this.secondPendulumAngle)*this.secondPendulumDrawLength*this.currentScalingFactor;

                //draw the line
                localContext.beginPath();
                localContext.moveTo(this.secondPendulumTrace[this.secondPendulumTrace.length - 1][0], this.secondPendulumTrace[this.secondPendulumTrace.length - 1][1]);
                localContext.lineTo(secondPendulumBobX, secondPendulumBobY);
                localContext.stroke();
            }

            //draw the rest of the trace
            for (let i = 1; i < this.secondPendulumTrace.length; i++)
            {
                lineStartPixelX = this.secondPendulumTrace[i - 1][0];
                lineStartPixelY = this.secondPendulumTrace[i - 1][1];
                lineEndPixelX = this.secondPendulumTrace[i][0];
                lineEndPixelY = this.secondPendulumTrace[i][1];

                localContext.beginPath();
                localContext.moveTo(lineStartPixelX, lineStartPixelY);
                localContext.lineTo(lineEndPixelX, lineEndPixelY);
                localContext.stroke();
            }
        }
    }

    Draw(localContext)
    {
        //reset draw space
        localContext.fillStyle = "rgb(255, 255, 255)";
	    localContext.fillRect(this.startX, this.startY, this.sizeX, this.sizeY);

        this.DrawTraces(localContext);

        this.DrawDoublePendulum(localContext);

        if (this.showSimulationInformation === true)
        {
            this.DrawSimulationInformation(localContext);
        }
    }
}

function AdvanceSimulation()
{
    //simulate until simulation time catches up with program time
    while (simulationTime <= programTime)
    {
        //runge kutta method (RK4)

        //first step
        let k1_firP_angle = step*firstPendulumAngleChangeFunction(undefined, firstPendulumCurrentAngle, secondPendulumCurrentAngle, firstPendulumCurrentVelocity, secondPendulumCurrentVelocity);
        let k1_secP_angle = step*secondPendulumAngleChangeFunction(undefined, firstPendulumCurrentAngle, secondPendulumCurrentAngle, firstPendulumCurrentVelocity, secondPendulumCurrentVelocity);
        let k1_firP_velocity = step*firstPendulumVelocityChangeFunction(undefined, firstPendulumCurrentAngle, secondPendulumCurrentAngle, firstPendulumCurrentVelocity, secondPendulumCurrentVelocity);
        let k1_secP_velocity = step*secondPendulumVelocityChangeFunction(undefined, firstPendulumCurrentAngle, secondPendulumCurrentAngle, firstPendulumCurrentVelocity, secondPendulumCurrentVelocity);

        //second step
        let k2_firP_angle = step*firstPendulumAngleChangeFunction(undefined, firstPendulumCurrentAngle + 0.5*k1_firP_angle, secondPendulumCurrentAngle + 0.5*k1_secP_angle, firstPendulumCurrentVelocity + 0.5*k1_firP_velocity, secondPendulumCurrentVelocity + 0.5*k1_secP_velocity);
        let k2_secP_angle = step*secondPendulumAngleChangeFunction(undefined, firstPendulumCurrentAngle + 0.5*k1_firP_angle, secondPendulumCurrentAngle + 0.5*k1_secP_angle, firstPendulumCurrentVelocity + 0.5*k1_firP_velocity, secondPendulumCurrentVelocity + 0.5*k1_secP_velocity);
        let k2_firP_velocity = step*firstPendulumVelocityChangeFunction(undefined, firstPendulumCurrentAngle + 0.5*k1_firP_angle, secondPendulumCurrentAngle + 0.5*k1_secP_angle, firstPendulumCurrentVelocity + 0.5*k1_firP_velocity, secondPendulumCurrentVelocity + 0.5*k1_secP_velocity);
        let k2_secP_velocity = step*secondPendulumVelocityChangeFunction(undefined, firstPendulumCurrentAngle + 0.5*k1_firP_angle, secondPendulumCurrentAngle + 0.5*k1_secP_angle, firstPendulumCurrentVelocity + 0.5*k1_firP_velocity, secondPendulumCurrentVelocity + 0.5*k1_secP_velocity);

        //third step
        let k3_firP_angle = step*firstPendulumAngleChangeFunction(undefined, firstPendulumCurrentAngle + 0.5*k2_firP_angle, secondPendulumCurrentAngle + 0.5*k2_secP_angle, firstPendulumCurrentVelocity + 0.5*k2_firP_velocity, secondPendulumCurrentVelocity + 0.5*k2_secP_velocity);
        let k3_secP_angle = step*secondPendulumAngleChangeFunction(undefined, firstPendulumCurrentAngle + 0.5*k2_firP_angle, secondPendulumCurrentAngle + 0.5*k2_secP_angle, firstPendulumCurrentVelocity + 0.5*k2_firP_velocity, secondPendulumCurrentVelocity + 0.5*k2_secP_velocity);
        let k3_firP_velocity = step*firstPendulumVelocityChangeFunction(undefined, firstPendulumCurrentAngle + 0.5*k2_firP_angle, secondPendulumCurrentAngle + 0.5*k2_secP_angle, firstPendulumCurrentVelocity + 0.5*k2_firP_velocity, secondPendulumCurrentVelocity + 0.5*k2_secP_velocity);
        let k3_secP_velocity = step*secondPendulumVelocityChangeFunction(undefined, firstPendulumCurrentAngle + 0.5*k2_firP_angle, secondPendulumCurrentAngle + 0.5*k2_secP_angle, firstPendulumCurrentVelocity + 0.5*k2_firP_velocity, secondPendulumCurrentVelocity + 0.5*k2_secP_velocity);

        //fourth step
        let k4_firP_angle = step*firstPendulumAngleChangeFunction(undefined, firstPendulumCurrentAngle + k3_firP_angle, secondPendulumCurrentAngle + k3_secP_angle, firstPendulumCurrentVelocity + k3_firP_velocity, secondPendulumCurrentVelocity + k3_secP_velocity);
        let k4_secP_angle = step*secondPendulumAngleChangeFunction(undefined, firstPendulumCurrentAngle + k3_firP_angle, secondPendulumCurrentAngle + k3_secP_angle, firstPendulumCurrentVelocity + k3_firP_velocity, secondPendulumCurrentVelocity + k3_secP_velocity);
        let k4_firP_velocity = step*firstPendulumVelocityChangeFunction(undefined, firstPendulumCurrentAngle + k3_firP_angle, secondPendulumCurrentAngle + k3_secP_angle, firstPendulumCurrentVelocity + k3_firP_velocity, secondPendulumCurrentVelocity + k3_secP_velocity);
        let k4_secP_velocity = step*secondPendulumVelocityChangeFunction(undefined, firstPendulumCurrentAngle + k3_firP_angle, secondPendulumCurrentAngle + k3_secP_angle, firstPendulumCurrentVelocity + k3_firP_velocity, secondPendulumCurrentVelocity + k3_secP_velocity);

        //final calculation of new values
        firstPendulumCurrentAngle = firstPendulumCurrentAngle + 1/6*(k1_firP_angle + 2*k2_firP_angle + 2*k3_firP_angle + k4_firP_angle);
        secondPendulumCurrentAngle = secondPendulumCurrentAngle + 1/6*(k1_secP_angle + 2*k2_secP_angle + 2*k3_secP_angle + k4_secP_angle);
        firstPendulumCurrentVelocity = firstPendulumCurrentVelocity + 1/6*(k1_firP_velocity + 2*k2_firP_velocity + 2*k3_firP_velocity + k4_firP_velocity);
        secondPendulumCurrentVelocity = secondPendulumCurrentVelocity + 1/6*(k1_secP_velocity + 2*k2_secP_velocity + 2*k3_secP_velocity + k4_secP_velocity);
   
        //advance time
        simulationTime += step;

        //storage of first pendulum's trace
        if (simulationTime > firstPendulumTracepointPlacementTime + 1/samplesPerSecond)
        {       
            //simulation time just passed the scheduled point for storing state

            //push tracepoint into array
            doublePendulum.AddFirstPendulumTracepoint(firstPendulumCurrentAngle, secondPendulumCurrentAngle);

            //calculate next checkpoint for storing state
            firstPendulumTracepointPlacementTime += 1/samplesPerSecond;

            //based on number of points in the array and the trace persistence, remove the required amount of oldest trace points
            if (doublePendulum.GetNumberOfFirstPendulumTracepoints() > samplesPerSecond*firstPendulumTraceLinePersistence + 1)
            {
                doublePendulum.RemoveMultipleOldestTracepointsOfFirstPendulum(Math.ceil(doublePendulum.GetNumberOfFirstPendulumTracepoints() - (samplesPerSecond*firstPendulumTraceLinePersistence + 1)));
            }
        }

        //storage of second pendulum's trace 
        if (simulationTime > secondPendulumTracepointPlacementTime + 1/samplesPerSecond)
        { 
            //simulation time just passed the scheduled point for storing state

             //push tracepoint into array
            doublePendulum.AddSecondPendulumTracepoint(firstPendulumCurrentAngle, secondPendulumCurrentAngle);

            //calculate next checkpoint for storing state
            secondPendulumTracepointPlacementTime += 1/samplesPerSecond;

            //based on number of points in the array and the trace persistence, remove the required amount of oldest trace points
            if (doublePendulum.GetNumberOfSecondPendulumTracepoints() > samplesPerSecond*secondPendulumTraceLinePersistence + 1)
            {
                doublePendulum.RemoveMultipleOldestTracepointsOfSecondPendulum(Math.ceil(doublePendulum.GetNumberOfSecondPendulumTracepoints() - (samplesPerSecond*secondPendulumTraceLinePersistence + 1)));
            }
        }
    }
}

function DrawSimulation(localContext)
{
    //fill the pendulum class with current simulation parameters
    doublePendulum.SetFirstPendulumAngle(firstPendulumCurrentAngle);
    doublePendulum.SetSecondPendulumAngle(secondPendulumCurrentAngle);
    doublePendulum.SetFirstPendulumVelocity(firstPendulumCurrentVelocity);
    doublePendulum.SetSecondPendulumVelocity(secondPendulumCurrentVelocity);
    doublePendulum.SetFirstPendulumLength(firstPendulumLength);
    doublePendulum.SetSecondPendulumLength(secondPendulumLength);
    doublePendulum.SetFirstPendulumMass(firstPendulumMass);
    doublePendulum.SetSecondPendulumMass(secondPendulumMass);
    doublePendulum.SetShowFirstPendulumTrace(showFirstPendulumTrace);
    doublePendulum.SetShowSecondPendulumTrace(showSecondPendulumTrace);
    doublePendulum.SetShowPendulumInformation(showPendulumInformation);
    doublePendulum.SetShowSimulationInformation(showSimulationInformation);

    //draw simulation
    doublePendulum.Draw(localContext);

    //draw framerate
    localContext.textAlign = "left";
    localContext.fillStyle = "rgb(0,0,0)";
    localContext.font = "15px Arial";
    localContext.fillText("Framerate: " + (1000/deltaTime).toFixed(2).toString() + " fps", 1283 , 939);
}







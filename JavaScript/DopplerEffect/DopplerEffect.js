//Doppler effect
//Bc. Tomas Jarusek, 4/2018

window.onload = function()  
{
	Init();
	ScaleCanvas_NoMenu();
};
window.onresize = ScaleCanvas_NoMenu;

var frequencySlidebar = new Slidebar();
var receiverSlidebar = new Slidebar();

var dopplerDiagram = new DopplerDiagram();

var outputGraph = new OutputGraph();

var receiverSpeed = new TextBox();

var generatorFrequency = new TextBox();
var receiverSpeed = new TextBox();
var title = new TextBox();

var dopplerEquation = new DopplerEquation();

var simFramerate = 60; /*dulezite - 60 cyklu  = 1s*/
var frameLength = 1/simFramerate;

var theoretialRadius = 10; //10m

var waveVelocity = 2; //10m/s - tim padem by se vlna mela obtocit jednou za sekundu okolo kruhu

var receiverVelocityRange = 2;// -10m/s - 10m/s

/*posun sinu*/
var sinePhase;
var receiverAngle;


function Slidebar() 
{
	this.posX;
	this.posY;
	this.width;
	this.height;
	
	this.lineX;
	this.lineY;
	this.lineWidth;
	this.lineHeight;
	
	this.sliderX;
	this.sliderY;
	this.sliderWidth;
	this.sliderHeight;
	
	this.sliderPos = 0; //stred //
	this.sliderIsMoving = false;
	
	this.sliderMinValue;
	this.sliderMaxValue;
	
	this.returnValue;
	
	/*vse se pocita na procenta delek, magicka cisla pro jednoduchost ---- idelane 10 ku 1 treba sirka 400 a vyska 40 symetrie asponm myslim :D*/
	this.setVariables = function(posX, posY, width, height, sliderMinValue, sliderMaxValue, sliderStartValue) 
	{
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
		
		this.lineX = posX+width/20;
		this.lineY = posY+height/11*5;
		this.lineWidth = width/20*18;
		this.lineHeight = height/11;
		
		this.sliderX = width/2+posX-height/5*3/2;
		this.sliderY = height/2+posY-height/5*3/2;
		this.sliderWidth = height/5*3;
		this.sliderHeight = height/5*3;
		
		this.sliderMinValue = sliderMinValue;
		this.sliderMaxValue = sliderMaxValue;
		this.sliderPos = (sliderStartValue*this.lineWidth-((sliderMinValue+sliderMaxValue)*this.lineWidth/2))/(sliderMaxValue-sliderMinValue)
		
		this.returnValue = this.calculateReturnValue();
	}
	
	this.calculateReturnValue = function()
	{
		return (this.sliderMinValue+this.sliderMaxValue)/2+(this.sliderPos/this.lineWidth)*(this.sliderMaxValue-this.sliderMinValue)
	}
	
	this.getValue = function ()
	{	
		return this.returnValue;
	}
	
	this.isMouseOverSlider = function()
	{		
		if (ApplyCanvasScale_NoMenu(mouseX) > this.sliderX+this.sliderPos && ApplyCanvasScale_NoMenu(mouseX) < this.sliderX+this.sliderWidth+this.sliderPos && ApplyCanvasScale_NoMenu(mouseY) > this.sliderY && ApplyCanvasScale_NoMenu(mouseY) < this.sliderY+this.sliderHeight)
		{
			return true;
		}
		else
		{
			return false;
		}		
	}
		
	this.update = function()
	{
		if (leftMouseButtonIsHeld === true)
		{	
			/*prvni klik musi byt na box pak uz muze byt mys kde chce*/
			if (this.sliderIsMoving === false)
			{
				if (this.isMouseOverSlider())
				{
					this.sliderIsMoving = true;	
					
					if (ApplyCanvasScale_NoMenu(mouseX) < this.lineX)
					{
						this.sliderPos = this.lineX-(this.width/2+this.posX);
					}
					else if (ApplyCanvasScale_NoMenu(mouseX) > this.lineX+this.lineWidth)
					{
						this.sliderPos = (this.lineX+this.lineWidth)-(this.width/2+this.posX);
					}
					else
					{
						this.sliderPos = ApplyCanvasScale_NoMenu(mouseX)-(this.width/2+this.posX);
					}
						
					/*update vystupni hodnoty pri posunu*/
					this.returnValue = this.calculateReturnValue();				
				}
				else
				{
					this.sliderIsMoving = false;	
				}
			}
			else
			{
				if (ApplyCanvasScale_NoMenu(mouseX) < this.lineX)
					{
						this.sliderPos = this.lineX-(this.width/2+this.posX);
					}
					else if (ApplyCanvasScale_NoMenu(mouseX) > this.lineX+this.lineWidth)
					{
						this.sliderPos = (this.lineX+this.lineWidth)-(this.width/2+this.posX);
					}
					else
					{
						this.sliderPos = ApplyCanvasScale_NoMenu(mouseX)-(this.width/2+this.posX);
					}
						
					/*update vystupni hodnoty pri posunu*/
					this.returnValue = this.calculateReturnValue();
			}
		}
		else
		{
			this.sliderIsMoving = false;	
		}
		
	}
	
	this.draw = function(localContext) 
	{
		localContext.fillStyle = "rgb(255,0,0)";

		localContext.fillRect(this.posX, this.posY, this.width, this.height);
		
		localContext.fillStyle = "rgb(0,0,255)";
		
		localContext.fillRect(this.lineX, this.lineY, this.lineWidth, this.lineHeight);
		
		localContext.fillStyle = "rgb(255,255,255)";
		localContext.strokeStyle = "rgb(0,0,0)";
		localContext.lineWidth = 1;

		localContext.strokeRect(this.sliderX+this.sliderPos, this.sliderY, this.sliderWidth, this.sliderHeight);
		localContext.fillRect(this.sliderX+this.sliderPos, this.sliderY, this.sliderWidth, this.sliderHeight);	
	}
}

function DopplerDiagram() 
{
	this.centerX;
	this.centerY;
	
	/*amplituda sinu na kruhu*/
	this.sineAmplitude = 50;
	/*skutecny polomer kruhu v pixelech*/
	this.radius = 200;
	
	this.setVariables = function(centerX, centerY) 
	{
		this.centerX = centerX;
		this.centerY = centerY;
	}
	
	this.calculateRadiusWithSine = function(sineFrequency) 
	{
		return this.radius+Math.sin(sineFrequency+sinePhase)*(this.sineAmplitude);
	}
	
	this.draw = function(localContext) 
	{
		/*velky kruh*/
		localContext.beginPath();
		localContext.arc(this.centerX, this.centerY, this.radius, 0, 2*Math.PI);
		localContext.fill();
		localContext.stroke();

		/*funkce sinu*/
		var circleX, circleY;
		
		var circleAngle = 2*Math.PI;
		var circleStep = 2*Math.PI/400;	
			
		var radiusWithSine;

		/*kreslim unidentified :D a funguje to*/
		var prevX = circleX;
		var prevY = circleY;
		
		for (i = 0; i < circleAngle; i = i + circleStep)
		{	
			radiusWithSine = this.calculateRadiusWithSine(i*Math.round(frequencySlidebar.getValue()));
	
			/*trosku hokusy pokusy aby byl start nahore*/
			circleX = this.centerX + radiusWithSine*Math.sin(i);
			circleY = this.centerY - radiusWithSine*Math.cos(i);
			
			localContext.beginPath();
			localContext.moveTo(prevX,  prevY);
			localContext.lineTo( circleX,  circleY);
			localContext.stroke();
			
			prevX = circleX;
			prevY = circleY;
		}
		
		/*generator*/
		localContext.lineWidth = 6;
		localContext.strokeStyle = "rgb(0,0,0)";
		localContext.fillStyle = "rgb(0,0,0)";

		localContext.beginPath();
		localContext.moveTo(this.centerX,  this.centerY - this.radius - 70);
		localContext.lineTo( this.centerX,  this.centerY - this.radius + 70);
		localContext.stroke();

		localContext.beginPath();
		localContext.arc(this.centerX,  this.centerY, 3, 0, 2*Math.PI);
		localContext.fill();
		
		i = 0;
		
		radiusWithSine = this.calculateRadiusWithSine(i*Math.round(frequencySlidebar.getValue()))
		
		outputGraph.addGeneratorPointToDraw(radiusWithSine-this.radius);
	
		circleX = this.centerX + radiusWithSine*Math.sin(i);
		circleY = this.centerY - radiusWithSine*Math.cos(i);
		
		localContext.lineWidth = 12;
		localContext.strokeStyle = "rgb(255,0,0)";
		localContext.fillStyle = "rgb(255,0,0)";
		
		localContext.beginPath();
		localContext.arc(circleX,  circleY, 6, 0, 2*Math.PI);
		localContext.fill();

		localContext.lineWidth = 2;

		localContext.beginPath();
		localContext.moveTo(circleX,  circleY);
		localContext.lineTo(circleX+20,  circleY);
		localContext.stroke();

		localContext.beginPath();
		localContext.moveTo(circleX+10,  circleY-5);
		localContext.lineTo(circleX+20,  circleY);
		localContext.stroke();

		localContext.beginPath();
		localContext.moveTo(circleX+10,  circleY+5);
		localContext.lineTo(circleX+20,  circleY);
		localContext.stroke();
		
		/*prijmac*/
		localContext.strokeStyle = "rgb(0,0,0)";
		localContext.lineWidth = 6;
		radiusWithSine = this.calculateRadiusWithSine(receiverAngle)
		
		localContext.beginPath();
		localContext.moveTo(this.centerX + (this.radius-70)*Math.sin(receiverAngle),this.centerY - (this.radius-70)*Math.cos(receiverAngle));
		localContext.lineTo(this.centerX + (this.radius+70)*Math.sin(receiverAngle), this.centerY - (this.radius+70)*Math.cos(receiverAngle));
		localContext.stroke();
		
		i = receiverAngle;
		
		radiusWithSine = this.calculateRadiusWithSine(i*Math.round(frequencySlidebar.getValue()))
		
		outputGraph.addReceiverPointToDraw(radiusWithSine-this.radius);
	
		circleX = this.centerX + radiusWithSine*Math.sin(i);
		circleY = this.centerY - radiusWithSine*Math.cos(i);
		
		localContext.lineWidth = 12;
		localContext.fillStyle = "rgb(0,0,255)"
		
		localContext.beginPath();
		localContext.arc(circleX,  circleY, 6, 0, 2*Math.PI);
		localContext.fill();
		
		receiverAngle = receiverAngle - 2*Math.PI/(simFramerate*(theoretialRadius/receiverSlidebar.getValue()));
		
		/*simulujeme propagaci vlny prepocitanim faze - lehci nez transformovat vystupni body*/
		sinePhase = sinePhase - 2*Math.PI/(simFramerate*(theoretialRadius/waveVelocity))*Math.round(frequencySlidebar.getValue());
	}
}

function OutputGraph() 
{
	this.posX;
	this.posY;
	this.width;
	this.height;
	
	this.XAxisWidth;
	
	this.XAxisX1;
	this.XAxisY1;
	this.XAxisX2;
	this.XAxisY2;
	
	this.YAxisX1;
	this.YAxisY1;
	this.YAxisX2;
	this.YAxisY2;
	
	this.graphEnd;
	
	this.generatorPointsToDraw = [];
	this.receiverPointsToDraw = [];
	
	this.setVariables = function(posX, posY) 
	{
		this.posX = posX;
		this.posY = posY;
		// magicky cislo obvod/2 z dopler digramu	
		this.width = 1050;
		// magicky cislo amplituda z dopler digramu
		this.height = 150;
		
		this.XAxisX1 = this.posX+this.width/24;
		this.XAxisY1 = this.posY+this.height/2;
		this.XAxisX2 = this.posX+this.width*23/24;
		this.XAxisY2 = this.posY+this.height/2;
				
		this.YAxisX1 = this.posX+this.width/12;
		this.YAxisY1 = this.posY+this.height/20;
		this.YAxisX2 = this.posX+this.width/12;
		this.YAxisY2 = this.posY+this.height*19/20;
		
		this.graphEnd = this.posX+this.width*11/12;		
	}
	
	this.addReceiverPointToDraw = function(receiverPoint) 
	{
		this.receiverPointsToDraw.unshift(receiverPoint);
	}
	
	this.addGeneratorPointToDraw = function(generatorPoint) 
	{
		this.generatorPointsToDraw.unshift(generatorPoint);
	}
	
	this.draw = function(localContext) 
	{
		localContext.fillStyle = "rgb(255,255,255)";

		localContext.fillRect(this.posX, this.posY, this.width, this.height);

		localContext.strokeStyle = "rgb(0,0,0)";
		localContext.lineWidth = 1;

		localContext.beginPath();
		localContext.moveTo(this.XAxisX1, this.XAxisY1);
		localContext.lineTo(this.XAxisX2, this.XAxisY2);
		localContext.stroke();
		
		localContext.lineWidth = 6;

		localContext.beginPath();
		localContext.moveTo(this.YAxisX1, this.YAxisY1);
		localContext.lineTo(this.YAxisX2, this.YAxisY2);
		localContext.stroke();
		
		var i;
		
		var generatorPrevX, generatorPrevY; 
		var receiverPrevX, receiverPrevY; 
		
		for (i = 0; i < this.generatorPointsToDraw.length; i++)
		{	
			if (this.YAxisX1+i*4.19 > this.graphEnd)
			{
				this.generatorPointsToDraw.pop();
				this.receiverPointsToDraw.pop();
			}
			else
			{
				if (i === 0)
				{
					localContext.fillStyle = "rgb(255,0,0)"

					localContext.beginPath();
					localContext.arc(this.YAxisX1+i,  this.posY+this.height/2-this.generatorPointsToDraw[i], 6, 0, 2*Math.PI);
					localContext.fill();

					localContext.fillStyle = "rgb(0,0,255)"

					localContext.beginPath();
					localContext.arc(this.YAxisX1+i,  this.posY+this.height/2-this.receiverPointsToDraw[i], 6, 0, 2*Math.PI);
					localContext.fill();
				}
				else
				{
					localContext.lineWidth = 2;
					localContext.strokeStyle = "rgb(255,0,0)";

					localContext.beginPath();
					localContext.moveTo(generatorPrevX,  generatorPrevY);
					localContext.lineTo(this.YAxisX1+i*4.19,  this.posY+this.height/2-this.generatorPointsToDraw[i]);
					localContext.stroke();
					
					localContext.strokeStyle = "rgb(0,0,255)";

					localContext.beginPath();
					localContext.moveTo(receiverPrevX,  receiverPrevY);
					localContext.lineTo(this.YAxisX1+i*4.19,  this.posY+this.height/2-this.receiverPointsToDraw[i]);
					localContext.stroke();
				}
				
				generatorPrevX = this.YAxisX1+i*4.19;
				generatorPrevY = this.posY+this.height/2-this.generatorPointsToDraw[i];
				
				receiverPrevX = this.YAxisX1+i*4.19;
				receiverPrevY = this.posY+this.height/2-this.receiverPointsToDraw[i];	
			}
		}
	}
}

function TextBox() 
{
	this.posX;
	this.posY;
	this.textSize;
	this.textPosX;
	this.textPosY;
	this.textString;
	this.beforeString;
	this.afterString;
	this.color;
	
	this.setVariables = function(posX, posY, width, height, textPosX, textSize, color, beforeString, afterString) 
	{
		this.posX = posX;
		this.posY = posY;
		this.textSize = textSize;
		this.beforeString = beforeString;
		this.afterString = afterString;
		this.textPosX = posX + textPosX;
		this.textPosY = posY + height - (height-textSize)/2;	
		this.color = color;
		this.textString = beforeString + " " + "" + " " + this.afterString;
	}
	
	this.updateText = function(textString) 
	{
		this.textString = this.beforeString + " " + textString + " " + this.afterString;	
	}
	
	this.draw = function(localContext) 
	{	
		localContext.fillStyle = "rgb(" + this.color[0].toString() + "," + this.color[1].toString() + "," + this.color[2].toString() + ")";
		localContext.font = this.textSize.toString() + "px Arial";

		localContext.fillText(this.textString, this.textPosX, this.textPosY);	
	}
}

function DopplerEquation() 
{
	this.posX;
	this.posY;
	this.height;
	this.width;	
	
	this.setVariables = function(posX, posY, width, height) 
	{
		this.posX = posX;
		this.posY = posY;
		this.height = height;
		this.width = width;
	}
	
	this.draw = function(localContext) 
	{		
		localContext.fillStyle = "rgb(0,0,0)";
		localContext.font = "28px Arial";

		localContext.fillText("Observed frequency: f = f0 * (1 + vr/v)",  this.posX+10,  this.posY + this.height/2-20);
		localContext.fillText("f = "+ Math.round(frequencySlidebar.getValue())/(5).toString() +" * (1 + ("+ receiverSlidebar.getValue().toFixed(2).toString()+")/("+waveVelocity.toString()+")) = " +(Math.round(frequencySlidebar.getValue())/(5)*(1+(receiverSlidebar.getValue().toFixed(2))/(waveVelocity))).toFixed(2).toString() + " Hz",  this.posX+10,  this.posY + this.height/2+30);
	}
}


let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

//synchronization of HTML elements
function SychnronizeHTMLElements()
{
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

	//mouse activation
	ActivateMouse();
	//keyboard activation
	ActivateKeyboard();

	//cary budou zaoblene
	context.lineCap = 'round';

	receiverAngle = Math.PI;
	sinePhase = 0;
	
	dopplerDiagram.setVariables(300,400);
	
	outputGraph.setVariables(50,700);

	frequencySlidebar.setVariables(600,225,500,50,1,20,5);
	
	receiverSlidebar.setVariables(600,400,500,50,-receiverVelocityRange,receiverVelocityRange,0);
	
	receiverSpeed.setVariables(20,20,25,"ms");
	
	generatorFrequency.setVariables(600,150,500,50,15,35,[0,0,0],"Emitted frequency:","Hz");
	receiverSpeed.setVariables(600,325,500,50,15,35,[0,0,0],"Speed of the receiver:","m/s");
	title.setVariables(356,50,600,50,150,50,[0,0,0],"Doppler effect visualization","");
	
	dopplerEquation.setVariables(600,500,500,150);

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

	//clear canvas
    context.fillStyle = "rgb(196, 196, 196)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);

	frequencySlidebar.update();
	frequencySlidebar.draw(context);
	
	receiverSlidebar.update();
	receiverSlidebar.draw(context);

	dopplerDiagram.draw(context);

	outputGraph.draw(context);

	generatorFrequency.updateText((Math.round(frequencySlidebar.getValue())/(5)).toString());
	generatorFrequency.draw(context);
	
	receiverSpeed.updateText(receiverSlidebar.getValue().toFixed(2).toString());
	receiverSpeed.draw(context);
	
	title.draw(context);
	dopplerEquation.draw(context);	

    window.requestAnimationFrame(processLoop);
}






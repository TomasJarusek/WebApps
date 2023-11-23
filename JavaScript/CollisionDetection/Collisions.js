//Collision detection
//Bc. Tomas Jarusek

window.onload = function()  
{
	Init();
	ScaleCanvas_NoMenu();
};
window.onresize = ScaleCanvas_NoMenu;

//hlavni klec
let cage;

function UpdateInputs() 
{
	//nastavime hodnotu pozice mysi
	cage.mousePosition = [ApplyCanvasScale(mouseX),ApplyCanvasScale(mouseY)];

	//registrace jednoho kliku pri stisku
	if (IsKeyPressed("r"))
	{
		if (r === false)
		{
			StartNewSimulation();
			r = true;
			return;
		}
	}
	else
	{
		r = false;
	}
	
	if (IsKeyPressed("e"))
	{
		if (e === false)
		{
			cage.ToggleSplitBarsVisibility();
			e = true;
			return;
		}
	}
	else
	{
		e = false;
	}
	
	if (IsKeyPressed("d"))
	{
		if (d === false)
		{
			cage.TogglequeryDebugMode();
			d = true;
			return;
		}
	}
	else
	{
		d = false;
	}

	//registrace v kazdem framu
	if (IsKeyPressed("w"))
	{
		for (let i = 0; i < (deltaTime/1000)*5*Math.sqrt(cage.circleList.length+1); i++)
		{
			cage.AddCircle();
		}
		return;
	}
	
	if (IsKeyPressed("s"))
	{
		for (let i = 0; i < (deltaTime/1000)*5*Math.sqrt(cage.circleList.length+1); i++)
		{
			cage.RemoveCircle();
		}
		return;
	}
	
	if (IsKeyPressed("i"))
	{
		cage.debugHeight = cage.debugHeight + (deltaTime/1000)*200;
		
		if (cage.debugHeight > 1000)
		{
			cage.debugHeight = 1000;
		}
		return;
	}
	
	if (IsKeyPressed("k"))
	{
		cage.debugHeight = cage.debugHeight - (deltaTime/1000)*200;
		
		if (cage.debugHeight < 1)
		{
			cage.debugHeight = 1;
		}
		return;
	}
	
	if (IsKeyPressed("l"))
	{
		cage.debugWidth = cage.debugWidth + (deltaTime/1000)*200;
		
		if (cage.debugWidth > 1000)
		{
			cage.debugWidth = 1000;
		}
		return;
	}
	
	if (IsKeyPressed("j"))
	{
		cage.debugWidth = cage.debugWidth - (deltaTime/1000)*200;
		
		if (cage.debugWidth < 1)
		{
			cage.debugWidth = 1;
		}
		return;
	}
}

//kruhy v kleci
function Circle(radius, position, velocityVector)
{
	this.radius = radius;
	this.position = position;
	this.velocityVector = velocityVector;
	
	this.highlight = false;
	
	//vykresleni kruhu podle toho jestli ma byt zvyraznen nebo ne
	this.DrawCircle = function(localContext)
	{
		if (this.highlight)
		{
			localContext.fillStyle = "rgb(255,0,0)";

			localContext.beginPath();
			localContext.arc(this.position[0], this.position[1], this.radius, 0, 2*Math.PI);
			localContext.fill();
		}
		else
		{
			localContext.lineWidth = 1;
			localContext.strokeStyle = "rgb(0,0,0)";

			localContext.beginPath();
			localContext.arc(this.position[0], this.position[1], this.radius, 0, 2*Math.PI);
			localContext.stroke();
		}
	}
}

//hlavni trida klec, obsahuje kruhy, pocita jejich kolize a vykresluje stranku
function Cage (width, height, radius, startPoint, velocityVectorLimit)
{
	this.width = width;
	this.height = height;
	this.startPoint = startPoint;
	this.radius = radius;
	this.velocityVectorLimit = velocityVectorLimit;
	
	this.leftBoundary = this.startPoint[0];
	this.rightBoundary = this.startPoint[0]+width;
	this.topBoundary = this.startPoint[1];
	this.bottomBoundary = this.startPoint[1]+height;
	
	this.circleList = [];
	
	this.quadTree;
	
	this.slowdown = 0;
	this.collisionCalculationCount = 0;
	this.collisionDetectionMode = 1;
	this.splitBarsVisible = false;
	this.queryDebugOn = false;
	this.mousePosition = [0,0];
	this.debugWidth = 200;
	this.debugHeight = 200;
	
	//zmena modu vypoctu kolizi
	this.ChangeCollisionDetectionMode = function()
	{
		this.collisionDetectionMode = (this.collisionDetectionMode + 1)%2;
	}
	
	//zapina a vypina rodelovace
	this.ToggleSplitBarsVisibility = function()
	{
		this.splitBarsVisible = !this.splitBarsVisible;
	}
	
	//zapina vypina debug
	this.TogglequeryDebugMode = function()
	{
		this.queryDebugOn = !this.queryDebugOn;
	}
	
	//--------------------------------------kruhy-------------------------------------------
	
	//prida jeden kruh
	this.AddCircle = function()
	{
		// let randomRadius = Math.random()*this.radiusLimit+1;
		let randomPosition = [Math.random()*(this.rightBoundary-this.leftBoundary-2*this.radius)+(this.leftBoundary+this.radius),Math.random()*(this.bottomBoundary-this.topBoundary-2*this.radius)+(this.topBoundary+this.radius)];
		let randomVelocityVector = [Math.random()*this.velocityVectorLimit*2-this.velocityVectorLimit,Math.random()*this.velocityVectorLimit*2-this.velocityVectorLimit];

		this.circleList.push(new Circle(this.radius,randomPosition,randomVelocityVector));	
	}
	
	//odebere jeden kruh
	this.RemoveCircle = function()
	{
		this.circleList.pop();
	}
	
	//posune kruhy
	this.MoveCircles = function()
	{		
		let tmp;
		
		//pro kazdy kruh
		for (let i = 0; i < this.circleList.length; i++)
		{
			originalX = this.circleList[i].position[0];
			originalY = this.circleList[i].position[1];
			
			//vypocitame novou pozici
			this.circleList[i].position[0] = this.circleList[i].position[0]+this.circleList[i].velocityVector[0]*(deltaTime/1000);
			this.circleList[i].position[1] = this.circleList[i].position[1]+this.circleList[i].velocityVector[1]*(deltaTime/1000);
					
			//pokud jednou ze ctyr hranic, provedeme odraz pro dannou hranici
			//musime spravne nastavit odraz, podle toho jak daleko je kruh za hranici
			//technicky je tu chyba, kdyby kruh byl hodne rychlej a narazil by hodne blizko do rohu, mohla by ho ta kolize vyhodit ven - kontroluje se jen jedna kolize ve framu
			tmp = (this.rightBoundary-this.circleList[i].radius);
			if (this.circleList[i].position[0] > tmp)
			{
				this.circleList[i].position[0] = tmp-(this.circleList[i].position[0]-tmp);
				this.circleList[i].velocityVector[0] = this.circleList[i].velocityVector[0]*-1;
			}
			
			tmp = (this.leftBoundary+this.circleList[i].radius);
			if (this.circleList[i].position[0] < tmp)
			{
				this.circleList[i].position[0] = tmp+(tmp-this.circleList[i].position[0]);
				this.circleList[i].velocityVector[0] = this.circleList[i].velocityVector[0]*-1;
			}
			
			tmp = (this.bottomBoundary-this.circleList[i].radius);
			if (this.circleList[i].position[1] > tmp)
			{
				this.circleList[i].position[1] = tmp-(this.circleList[i].position[1]-tmp);
				this.circleList[i].velocityVector[1] = this.circleList[i].velocityVector[1]*-1;
			}
			
			tmp = (this.topBoundary+this.circleList[i].radius);
			if (this.circleList[i].position[1] < tmp)
			{
				this.circleList[i].position[1] = tmp+(tmp-this.circleList[i].position[1]);
				this.circleList[i].velocityVector[1] = this.circleList[i].velocityVector[1]*-1;
			}		
		}
	}
	
	//vzdalenost mezi kruhy
	this.DistanceBetweenTwoCircles = function(circle1, circle2)
	{
		this.collisionCalculationCount = this.collisionCalculationCount + 1;
		
		let position1 = circle1.position;
		let position2 = circle2.position;
		let positionDiffX = position1[0]-position2[0];
		let positionDiffY = position1[1]-position2[1];
		
		//zpomalovaci cyklus
		for (let i = 0; i < this.slowdown*20; i++)
		{
			let x = Math.sqrt(i);
		}
		
		return Math.sqrt(positionDiffX*positionDiffX+positionDiffY*positionDiffY);
	}
	
	//---------------------------kolize--------------------------------------------------------
	
	//vynuluje zvyrazneni vsech kruhu
	this.ClearHighlights = function()
	{
		for (let i = 0; i < this.circleList.length; i++)
		{
			this.circleList[i].highlight = false;
		}
	}
	
	//vypocita kolize podle daneho modu
	this.CalculateCollisions = function()
	{
		this.collisionCalculationCount = 0;
		this.ClearHighlights();
		
		if (this.queryDebugOn && this.collisionDetectionMode === 1)
		{
			this.ShowQueryDebug();
		}
		else
		{
			this.CalculateCollisionsQuadTree();
		}
	}
	
	//kolize pomoci QuadTree
	this.CalculateCollisionsQuadTree = function()
	{
		let queryResult; 
		let actCircle;
		let selectorHalfWidthHeight = this.radius*2;
		
		//vystavime strom
		this.BuildQuadTree(1);
		
		//pro kazdy kruh
		for (let i = 0; i < this.circleList.length; i++)
		{
			actCircle = this.circleList[i];
			
			if (actCircle.highlight === false)
			{
				//si enchame vratit vsechny kruhy v okoli, 2*polomer - ty jedine mohou kolidovat
				queryResult = this.quadTree.Query(actCircle.position[0]-selectorHalfWidthHeight,actCircle.position[0]+selectorHalfWidthHeight,actCircle.position[1]-selectorHalfWidthHeight,actCircle.position[1]+selectorHalfWidthHeight);
			
				//pak vypocitame kolize aktualniho kruhu s vracenym query seznamem
				for (let j = 0; j < queryResult.length; j++)
				{
					if (actCircle !== queryResult[j] && this.DistanceBetweenTwoCircles(actCircle,queryResult[j]) <= (this.radius*2))
					{
						actCircle.highlight = true;
						queryResult[j].highlight = true;
					}
				}
			}	
		}
	}
	
	//vystaveni QuadTree
	this.BuildQuadTree = function(maximumCapacity)
	{		
		//vytvorime strom
		this.quadTree = new QuadTree(this.startPoint, this.width, this.height, 1);
		
		//vlozime do nej vsechny kruhy
		for (let i = 0; i < this.circleList.length; i++)
		{
			actCircle = this.circleList[i];
			this.quadTree.InsertPoint(actCircle.position[0], actCircle.position[1], actCircle);
		}
	}
	
	//vypocet debug pro debug mode
	this.ShowQueryDebug = function()
	{
		//vystavime strom
		this.BuildQuadTree(1);
		
		//posleme query na vsechny kruhy v selektoru
		let queryResult = this.quadTree.Query(this.mousePosition[0]-this.debugWidth/2,this.mousePosition[0]+this.debugWidth/2,this.mousePosition[1]-this.debugHeight/2,this.mousePosition[1]+this.debugHeight/2);
		
		//tem pak nastavime zvyrazneni
		for (let i = 0; i < queryResult.length; i++)
		{
			queryResult[i].highlight = true;
		}
	}
	
	//-------------------------------------Vykresleni-----------------------------------------------
	
	//vykresleni cele stranky
	this.DrawCageAndLabels = function(localContext)
	{
		if (this.queryDebugOn)
		{
			this.DrawQueryDebug(localContext);
			this.DisplayDesriptionDebug(localContext);
		}
		else
		{
			this.DisplayDesriptionQuadTree(localContext);
		}
		
		this.DrawBoundaries(localContext);
		this.DrawCircles(localContext);
					
		if (this.splitBarsVisible)
		{
			this.DrawSplitBars(localContext);	
		}
	}
	
	//okraje
	this.DrawBoundaries = function(localContext)
	{
		localContext.lineWidth = 3;
		localContext.strokeStyle = "rgb(0,0,0)";
		localContext.strokeRect(this.startPoint[0],this.startPoint[1],this.width,this.height);
	}
	
	//kruhy
	this.DrawCircles = function(localContext)
	{
		for (let i = 0; i < this.circleList.length; i++)
		{
			this.circleList[i].DrawCircle(localContext);
		}
	}
	
	//debug mod QuadtTree
	this.DrawQueryDebug = function(localContext)
	{
		let querryHighlightList = this.quadTree.ReturnQueryHighlightPositions();
		
		localContext.fillStyle = "rgb(255,255,0)";
		
		let actItem;
		for (let i = 0; i < querryHighlightList.length; i++)
		{
			actItem = querryHighlightList[i];
			localContext.fillRect(actItem[0],actItem[1],actItem[2],actItem[3]);
		}
		
		localContext.lineWidth = 1;
		localContext.strokeStyle = "rgb(255,0,0)";
		localContext.strokeRect(this.mousePosition[0]-this.debugWidth/2,this.mousePosition[1]-this.debugHeight/2,this.debugWidth,this.debugHeight);
	}
	
	//rozdelovace v quadtree
	this.DrawSplitBars = function(localContext)
	{
		let splitBarsList = this.quadTree.ReturnSplitBarsPositions();
		
		localContext.lineWidth = 1;
		localContext.strokeStyle = "rgb(0,0,255)";

		let actItem;
		for (let i = 0; i < splitBarsList.length; i++)
		{
			actItem = splitBarsList[i];

			localContext.beginPath();
			localContext.moveTo(actItem[0], actItem[1]);
			localContext.lineTo(actItem[2], actItem[3]);
			localContext.stroke();
		}		
	}

	//popisky pri quadtree
	this.DisplayDesriptionQuadTree = function(localContext)
	{
		localContext.font = "30px Arial";

		localContext.fillStyle = "rgb(255,0,0)";
		localContext.fillText( "Quadtree Collision Detection", 950, 50);

		localContext.fillStyle = "rgb(0,0,0)";
		localContext.fillText( "Framerate = "+  (1000/deltaTime).toFixed(1) + " " +  "fps", 950, 110);
		localContext.fillText( "Number of circles = "+  cage.circleList.length, 950, 150);

		localContext.fillText( "• Quadtree is built each frame", 950, 210);
		localContext.fillText( "• Query is performed for every circle", 950, 250);
		localContext.fillText( "• Query center is the circle center", 950, 290);
		localContext.fillText( "• Query width equals twice the diameter of a circle", 950, 330);
		
		localContext.fillText( "Number of potential collisions = "+  cage.collisionCalculationCount.toFixed(0), 950, 390);
		
		localContext.fillStyle = "rgb(0,0,255)";
		localContext.fillText( "Increase number of circles - W", 950, 450);
		localContext.fillText( "Decrease number of circles - S", 950, 490);
		
		localContext.fillText( "Toggle quadtree split bars - E", 950, 550);
		localContext.fillText( "Toggle quadtree manual query window - D", 950, 590);

		localContext.fillText( "Reset - R", 950, 870);
	}

	//popisky debug modu
	this.DisplayDesriptionDebug = function(localContext)
	{
		localContext.font = "30px Arial";

		localContext.fillStyle = "rgb(255,0,0)";
		localContext.fillText( "Quadtree Collision Detection", 950, 50);

		localContext.fillStyle = "rgb(0,0,0)";
		localContext.fillText( "Framerate = "+  (1000/deltaTime).toFixed(1) + " " +  "fps", 950, 110);
		localContext.fillText( "Number of circles = "+  cage.circleList.length, 950, 150);

		localContext.fillText( "• Quadtree is built each frame", 950, 210);
		localContext.fillText( "• Query is performed for every circle", 950, 250);
		localContext.fillText( "• Query center is the circle center", 950, 290);
		localContext.fillText( "• Query window has size of circle diameter", 950, 330);
		
		localContext.fillText( "Number of potential collisions = "+  cage.collisionCalculationCount.toFixed(0), 950, 390);
		
		localContext.fillStyle = "rgb(0,0,255)";
		localContext.fillText( "Increase number of circles - W", 950, 450);
		localContext.fillText( "Decrease number of circles - S", 950, 490);
		
		localContext.fillText( "Toggle quadtree split bars - E", 950, 550);
		localContext.fillText( "Toggle quadtree manual query window - D", 950, 590);
	
		localContext.fillText( "Increase query window height - I", 950, 650);
		localContext.fillText( "Decrease query window height - K", 950, 690);
		
		localContext.fillText( "Increase query window width - J", 950, 750);
		localContext.fillText( "Decrease query window width - L", 950, 790);

		localContext.fillText( "Reset - R", 950, 870);
	}
}

//vytvori novou klec a nainicializuje kruhy
function StartNewSimulation()
{
	cage = new Cage(850,850,5,[50,50],100);

	for (let i = 0; i < 100; i++)
	{
		cage.AddCircle();
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

	//vytvorime simulaci
	StartNewSimulation();

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

	//kolize kruhu se stenami jsou nedokonale - dame limit na deltaTime (1s)
	if(deltaTime > 1000)
	{
		deltaTime = 1000;
	}

	//pozice textu
    context.textBaseline = "top";

	//clear canvas
    context.fillStyle = "rgb(230, 230, 230)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);

	//precteme vstupy
	UpdateInputs();
	
	//posuneme kruhy v kleci
	cage.MoveCircles();
	
	//vypocitame kolize
	cage.CalculateCollisions();
	
	//vse vykreslime
	cage.DrawCageAndLabels(context);

    window.requestAnimationFrame(processLoop);
}










	
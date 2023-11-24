//Bc. Tomas Jarusek, 6/2019

window.onload = function()  
{
	Init();
	ScaleCanvas();
};
window.onresize = ScaleCanvas;

let descriptionHeader = 50;
let descriptionFooter = 25;
let borderThickness = 30;

let nodePlacementBorderGap = 6;

let graph;

let baseColor = [255,0,0];
let highlightColor = [0,0,255];

//akce pri stisku mysi
function mousePressed(event) 
{
	//vkladani bodu
	if (graph.currentState === "Placing")
	{
		//levy klik prida bod
		if (event.which === 1)
		{
			if (ApplyCanvasScale(mouseX) > (borderThickness+nodePlacementBorderGap) && ApplyCanvasScale(mouseX) < (startCanvasWidth-borderThickness-nodePlacementBorderGap) && ApplyCanvasScale(mouseY) > (borderThickness+descriptionHeader+nodePlacementBorderGap) && ApplyCanvasScale(mouseY) < (startCanvasHeight-borderThickness-descriptionFooter-nodePlacementBorderGap)) 
			{
				graph.PlaceNodeManualy();
			}
		}	
	}	
	
	//tvoreni cesty
	if (graph.currentState === "PathCreation")
	{
		//levy udela connection
		if (event.which === 1) 
		{
			graph.PathCreationNewConnection();
		}
		
		//pravy oddela connection
		if (event.which === 3) 
		{
			graph.PathCreationRemoveConnection();
		}
	}
}


//zacatek manualniho vkladani bodu
function ManualPlacingStart()
{
	graph.currentState = "Placing";
	
	graph.ResetCurrentPoints();
	graph.ResetCurrentPath();
	graph.ResetSavedPath();
	graph.ResetPathCreation();
	graph.ResetSwapMethod();
	graph.ResetBruteForceMethod();
	graph.ResetGreedyMethod();
	graph.ResetRandomPathMethod();
	
	startPlacingButton.Disable();
	placingDoneButton.Enable();
	generateRandomButton.Disable();
	startButton.Disable();
	drawYourPathButton.Disable();
	drawYourPathDoneButton.Disable();
	saveCurrentPathButton.Disable();
	currentPathResetButton.Disable();
	savedPathResetButton.Disable();
}

//konec manualniho vkladani bodu
function ManualPlacingDone()
{
	graph.RemoveDuplicateNodes();
	
	if (graph.nodeCount >= 3)
	{
		graph.currentState = "Default";	
		graph.placeErrorMessageActive = false;

		startPlacingButton.Enable();
		placingDoneButton.Disable();
		generateRandomButton.Enable();
		startButton.Enable();
		drawYourPathButton.Enable();
		drawYourPathDoneButton.Disable();
		saveCurrentPathButton.Disable();
		currentPathResetButton.Disable();
		savedPathResetButton.Disable();
	}
	else
	{
		graph.placeErrorMessageActive = true;
	}	
}

//vygenerovani bodu nahodne
function GenerateRandomNodes()
{
	graph.currentState = "Default";
	
	graph.ResetCurrentPoints();
	graph.ResetCurrentPath();
	graph.ResetSavedPath();
	graph.ResetPathCreation();
	graph.ResetSwapMethod();
	graph.ResetBruteForceMethod();
	graph.ResetGreedyMethod();
	
	graph.nodeCount = numberOfNodesInputBox.GetValue();
	if (graph.nodeCount < 3)
	{
		graph.nodeCount = 3;
		numberOfNodesInputBox.SetValue(3);
	}
	
	graph.PlaceNodesAtRandom();
	
	startPlacingButton.Enable();
	placingDoneButton.Disable();
	generateRandomButton.Enable();
	startButton.Enable();
	drawYourPathButton.Enable();
	drawYourPathDoneButton.Disable();
	saveCurrentPathButton.Disable();
	currentPathResetButton.Disable();
	savedPathResetButton.Disable();
}

//start metody
function StartPathfinding()
{
	graph.currentState = methodDropdownMenu.GetValue();
	graph.stepsPerFrame = stepsPerFrameInputBox.GetValue();
	graph.methodActive = true;
	
	graph.ResetCurrentPath();
	graph.ResetPathCreation();
	graph.ResetSwapMethod();
	graph.ResetBruteForceMethod();
	graph.ResetGreedyMethod();
	graph.ResetRandomPathMethod();
	
	//inicializujeme vsechny metody, at se to zbytecne nekomplikuje :D
	graph.InitIndexList();
	graph.BruteForceInicialization();
	graph.GreedyMethodInicialization();
	
	startPlacingButton.Enable();
	placingDoneButton.Disable();
	generateRandomButton.Enable();
	startButton.Disable();
	drawYourPathButton.Disable();
	drawYourPathDoneButton.Disable();
	saveCurrentPathButton.Disable();
	currentPathResetButton.Disable();
	savedPathResetButton.Disable();
}

//zacatek kresleni vlastni cesty
function DrawYourPath()
{
	graph.currentState = "PathCreation";
	
	graph.ResetCurrentPath();
	
	graph.PathCreationInitialization();
	
	startPlacingButton.Enable();
	placingDoneButton.Disable();
	generateRandomButton.Enable();
	startButton.Disable();
	drawYourPathButton.Disable();
	drawYourPathDoneButton.Enable();
	saveCurrentPathButton.Disable();
	currentPathResetButton.Disable();
	savedPathResetButton.Disable();
}

//konec kresleni vlastni cesty
function DrawYourPathDone()
{
	if (graph.actConnectionCount === graph.connectionCount)
	{
		graph.currentState = "Default";
		
		startPlacingButton.Enable();
		placingDoneButton.Disable();
		generateRandomButton.Enable();
		startButton.Enable();
		drawYourPathButton.Enable();
		drawYourPathDoneButton.Disable();
		saveCurrentPathButton.Enable();
		currentPathResetButton.Enable();
		
		graph.pathErrorMessageActive = false;
	}
	else
	{
		graph.pathErrorMessageActive = true;
	}
	
}

//ulozeni aktualni cesty
function SaveCurrentPath()
{
	graph.currentState = "Default";
	
	graph.ResetSavedPath();
	
	graph.SaveCurrentPath();
	
	startPlacingButton.Enable();
	placingDoneButton.Disable();
	generateRandomButton.Enable();
	startButton.Enable();
	drawYourPathButton.Enable();
	drawYourPathDoneButton.Disable();
	saveCurrentPathButton.Disable();
	currentPathResetButton.Enable();
	savedPathResetButton.Enable();
}

//reset ulozene cesty
function SavedPathReset()
{
	graph.currentState = "Default";

	graph.ResetSavedPath();
	
	savedPathResetButton.Disable();
	
	if (graph.currentPathLength !== 0)
	{
		saveCurrentPathButton.Enable();
	}
	else
	{
		saveCurrentPathButton.Disable();
	}
}

//smazani aktualni cesty
function CurrentPathReset()
{
	graph.currentState = "Default";

	graph.ResetCurrentPath();
	
	startPlacingButton.Enable();
	placingDoneButton.Disable();
	generateRandomButton.Enable();
	startButton.Enable();
	drawYourPathButton.Enable();
	drawYourPathDoneButton.Disable();
	saveCurrentPathButton.Disable();
	currentPathResetButton.Disable();
}



//vypocet vzdalenosti mezi dvema uzly
function CalculateDistanceBetweenTwoNodes(firstNode, secondNode)
{
	let tmpX = (firstNode.x-secondNode.x);
	let tmpY = (firstNode.y-secondNode.y);
	return Math.sqrt(tmpX*tmpX+tmpY*tmpY);
}

//generovani nahodneho celeho cisla v danem rozmezi vcetne hranicnich hodnot
function GenerateRandomWholeNumber(lowerBound, upperBound)
{
	return Math.floor(Math.random()*(upperBound-lowerBound+1)+lowerBound);
}


//strunktura uzlu
function Node2D (x, y)
{
	this.x = x;
	this.y = y;
}

//struktura propojeni
function Connection ()
{
	this.startNode;
	this.endNode;
	
	this.color;
	
	this.CreateDuplicate = function()
	{
		let actConnection =  new Connection();
		
		actConnection.startNode = this.startNode;
		actConnection.endNode = this.endNode;
		actConnection.color = this.color;
		
		return actConnection;
	}
	
}


//struktura grafu
function Graph ()
{
	//originalni uzly
	this.nodes = [];
	this.nodeCount = 0;
	
	//originalni cesta
	this.connections = [];
	this.currentPathLength = 0;
	
	//vkladani uzlu
	this.placeErrorMessageActive = false;
	
	//ulozeni cesty
	this.pathIsSaved = false;
	this.lastPathLength;
	this.lastConnections = [];
	
	//vytvareni cesty
	this.lastClickedNode;
	this.remainingNodes;
	this.usedNodes;
	this.firstNode;
	this.connectionCount;
	this.actConnectionCount;
	this.pathErrorMessageActive = false;
	
	//metoda nahodneho spojeni bodu
	this.remainingIndexes;
	this.lastNodeIndex = 0;	
	this.randomPathDone = false;
	
	//swap metoda
	this.successfulSwaps = 0;
	this.successfulSwapsTotal = 0;
	this.roundNumber = 1;
	this.actRoundSteps = 0;
	this.indexOne = 0;
	this.indexTwo = 0;
	this.connectionOne;
	this.connectionTwo;
	this.swapMethodDone = false;
	
	//brute-force metoda
	this.bestLength = Number.POSITIVE_INFINITY;
	this.bestPath = [];
	this.permutation;
	this.numberOfPaths;
	this.numberOfPathsSearched = 0;
	this.arrayIndex;
	this.bruteForceDone = false;
	
	//greedy metoda
	this.remainingNodesGreedy;
	this.firstNode;
	this.lastNode;
	this.greedyPathDone = false;
	
	//rizeni stavu
	this.currentState = "Default";
	this.methodActive = false;
	this.stepsPerFrame;
	
	
	//resety na default hodnoty
	this.ResetCurrentPoints = function()
	{
		this.nodes = [];
		this.nodeCount = 0;
	}
	
	this.ResetCurrentPath = function()
	{
		this.connections = [];
		this.currentPathLength = 0;
	}
	
	this.ResetSavedPath = function()
	{
		this.lastConnections = [];
		this.pathIsSaved = false;
	}
	
	this.ResetPathCreation = function()
	{
		this.pathErrorMessageActive = false;
	}
	
	this.ResetBruteForceMethod = function()
	{
		this.bestLength = Number.POSITIVE_INFINITY;
		this.bestPath = [];
		this.numberOfPathsSearched = 0;
		this.bruteForceDone = false;
	}
	
	this.ResetGreedyMethod = function()
	{
		this.greedyPathDone = false;
	}
	
	this.ResetSwapMethod = function()
	{
		this.successfulSwaps = 0;
		this.successfulSwapsTotal = 0;
		this.roundNumber = 1;
		this.actRoundSteps = 0;
		this.indexOne = 0;
		this.indexTwo = 0;
		this.swapMethodDone = false;
	}
	
	this.ResetRandomPathMethod = function()
	{
		this.remainingIndexes;
		this.lastNodeIndex = 0;	
		this.randomPathDone = false;
	}
	
	
	//vlozeni bodu nahodne	
	this.PlaceNodesAtRandom = function()
	{
		let x,y;
		
		for (let i = 0; i < this.nodeCount; i++)
		{
			x = Math.random()*(startCanvasWidth-2*borderThickness-2*nodePlacementBorderGap)+borderThickness+nodePlacementBorderGap;
			y = Math.random()*(startCanvasHeight-2*borderThickness-descriptionHeader-descriptionFooter-2*nodePlacementBorderGap)+borderThickness+descriptionHeader+nodePlacementBorderGap;
			
			this.nodes.push(new Node2D(x,y));
		}
	}

	//vlozeni bodu manualne
	this.PlaceNodeManualy = function ()
	{
		this.nodes.push(new Node2D(ApplyCanvasScale(mouseX), ApplyCanvasScale(mouseY)));
		this.nodeCount++;
	}
	
	//porovna zda maji body stejnou pozici
	this.AreNodesIdenticalByValue = function(firstNode, secondNode)
	{
		if (firstNode.x === secondNode.x && firstNode.y === secondNode.y)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	//odstrani takove uzly, ktere jsou na uplne stejnym miste
	this.RemoveDuplicateNodes = function()
	{
		for (let i = 0; i < this.nodes.length; i++)
		{
			for (let j = 0; j < this.nodes.length; j++)
			{
				if (this.nodes[i] !== this.nodes[j])
				{
					if (this.AreNodesIdenticalByValue(this.nodes[i], this.nodes[j]) === true)
					{
						this.nodes.splice(j, 1);
						console.log("rem");
					}
				}
			}
		}
		
		this.nodeCount = this.nodes.length;
	}
	
	
	//inicializace vytvareni vlatni cesty
	this.PathCreationInitialization = function()
	{
		this.remainingNodes = [];
		this.usedNodes = [];
		this.connectionCount = graph.nodes.length;
		this.actConnectionCount = -1;
		this.lastClickedNode = undefined;
		
		this.currentPathLength = 0;
		
		//nakopirovani uzlu do pomocneho pole
		for (let i = 0; i < this.nodes.length; i++)
		{
			this.remainingNodes.push(this.nodes[i]);
		}
	}
	
	//pomocna funkce, najde a odstrani nejblizsi uzel od kliku
	this.FindAndRemoveRemainingNodeClosestToPoint = function(x, y)
	{
		//vzdalesnost nebude nikdy vetsi nez soucet vysky a sirky okna
		let closestNodeDistance = startCanvasHeight+startCanvasWidth;
		let closestNodeIndex;
		let closestNode;
		
		let tmpX;
		let tmpY;
		let distance;
		
		let i;
		
		//projdeme vsechny uzly a zjistime, ktery je nejblizsi
		for (i = 0; i < this.remainingNodes.length; i++)
		{
			tmpX = (this.remainingNodes[i].x-x);
			tmpY = (this.remainingNodes[i].y-y);
			distance = Math.sqrt(tmpX*tmpX+tmpY*tmpY);
			
			if (distance < closestNodeDistance)
			{
				closestNodeDistance = distance;
				closestNodeIndex = i;
				closestNode = this.remainingNodes[i];
			}
		}
		
		//pushneme do pouzitych
		this.usedNodes.push(this.remainingNodes[closestNodeIndex]);
		//oddelame ze zbyvajicich
		this.remainingNodes.splice(closestNodeIndex, 1);
		
		//vratime nejblizsi
		return closestNode;
	}
		
	//pridani cesty
	this.PathCreationNewConnection = function()
	{
		//prvni klik, je zvyraznen jen jeden bod
		if (this.actConnectionCount === -1)
		{		
			//last clicked a first jsou stejne
			this.lastClickedNode = this.FindAndRemoveRemainingNodeClosestToPoint(ApplyCanvasScale(mouseX), ApplyCanvasScale(mouseY));
			this.firstNode = this.lastClickedNode;
			
			//zadne spojeni se nepridalo, ale timto se dostaneme na spravnou inicializaci, tedy 0
			this.actConnectionCount++;
		}
		//vytvoreni posledni cesty
		else if (this.actConnectionCount === this.connectionCount-1)
		{
			let actConnection = new Connection();	
			
			actConnection.startNode = this.lastClickedNode;
			actConnection.endNode = this.firstNode;
			actConnection.color = baseColor;
			
			this.connections.push(actConnection);
			this.currentPathLength = this.currentPathLength+CalculateDistanceBetweenTwoNodes(actConnection.startNode, actConnection.endNode);
			this.actConnectionCount++;
			
			this.lastClickedNode = this.firstNode;
		}
		//vsechny uzly spojeny
		else if (this.actConnectionCount === this.connectionCount)
		{
			//nic se nedela
		}
		//pridani bezne cesty
		else
		{
			let closestNode = this.FindAndRemoveRemainingNodeClosestToPoint(ApplyCanvasScale(mouseX), ApplyCanvasScale(mouseY));
		
			let actConnection = new Connection();
			
			actConnection.startNode = this.lastClickedNode;
			actConnection.endNode = closestNode;
			actConnection.color = baseColor;
			
			this.connections.push(actConnection);
			this.currentPathLength = this.currentPathLength+CalculateDistanceBetweenTwoNodes(actConnection.startNode, actConnection.endNode);
			this.actConnectionCount++;
			
			this.lastClickedNode = closestNode;	
		}		
	}
	
	//odebrani cesty
	this.PathCreationRemoveConnection = function()
	{
		//odebrani, kdyz jsou vsechny uzly propojeny
		if (this.actConnectionCount === this.connectionCount)
		{
			let removedConnection = this.connections.pop();
			this.currentPathLength = this.currentPathLength-CalculateDistanceBetweenTwoNodes(removedConnection.startNode, removedConnection.endNode);
			this.actConnectionCount--;
			
			this.lastClickedNode = removedConnection.startNode;
		}
		//odstranime zvyrazneny pocatecni bod
		else if (this.actConnectionCount === 0)
		{
			this.lastClickedNode = undefined;
			
			this.remainingNodes.push(this.usedNodes.pop());
			this.actConnectionCount--;
		}
		//vse odstraneno
		else if (this.actConnectionCount === -1)
		{
			//nic se nedela
		}
		//bezne odebrani cesty
		else
		{
			let removedConnection = this.connections.pop();
			this.currentPathLength = this.currentPathLength-CalculateDistanceBetweenTwoNodes(removedConnection.startNode, removedConnection.endNode);
			this.actConnectionCount--;
			
			this.remainingNodes.push(this.usedNodes.pop());
			
			this.lastClickedNode = removedConnection.startNode;
		}
	}
	
	
	//ulozeni aktualni cesty
	this.SaveCurrentPath = function()
	{
		this.lastConnections = [];
		
		for (let i = 0; i < this.connections.length; i++)
		{
			this.lastConnections.push(this.connections[i].CreateDuplicate());
		} 
		
		this.lastPathLength = this.currentPathLength;
		
		this.pathIsSaved = true;
	}
	

	//metoda nahodneho spojeni bodu - inicializace
	this.InitIndexList = function()
	{
		this.remainingIndexes = [];
		
		for (let i = 1; i < this.nodeCount; i++)
		{
			this.remainingIndexes.push(i);
		}
	}
	
	//metoda nahodneho spojeni bodu - je zavedno pole indexu na uzly, ktere jeste zbyvaji a znich se vybere jeden pro dalsi spojeni
	this.GenerateRandomPathStep = function()
	{
		let actConnection;
		
		if (this.remainingIndexes.length !== 0)
		{
			let randomIndex = GenerateRandomWholeNumber(0, this.remainingIndexes.length-1);

			actConnection = new Connection();
			
			actConnection.startNode = this.nodes[this.lastNodeIndex];
			actConnection.endNode = this.nodes[this.remainingIndexes[randomIndex]];
			
			actConnection.color = baseColor;
			
			this.connections.push(actConnection);
			
			this.currentPathLength = this.currentPathLength + CalculateDistanceBetweenTwoNodes(actConnection.startNode, actConnection.endNode);
			
			this.lastNodeIndex = this.remainingIndexes[randomIndex];	
			this.remainingIndexes.splice(randomIndex, 1);
		}
		else
		{
			actConnection = new Connection();
			
			actConnection.startNode = this.nodes[this.lastNodeIndex];
			actConnection.endNode = this.nodes[0];

			actConnection.color = baseColor;
			
			this.connections.push(actConnection);
			
			this.currentPathLength = this.currentPathLength + CalculateDistanceBetweenTwoNodes(actConnection.startNode, actConnection.endNode);
			
			this.randomPathDone = true;
		}
	}
	
	
	//spocita cenu vertikalniho prohozeni spojeni na 4 bodech
	this.CalculateCostOfVerticalSwap = function(firstConnection, secondConnection)
	{
		let currentDistance = CalculateDistanceBetweenTwoNodes(firstConnection.startNode, firstConnection.endNode) + CalculateDistanceBetweenTwoNodes(secondConnection.startNode, secondConnection.endNode);
		let afterSwapDistance = CalculateDistanceBetweenTwoNodes(firstConnection.startNode, secondConnection.startNode) + CalculateDistanceBetweenTwoNodes(firstConnection.endNode, secondConnection.endNode);
		
		return afterSwapDistance-currentDistance;
	}
	
	//spocita cenu diagonalniho prohozeni spojeni na 4 bodech
	this.CalculateCostOfDiagonalSwap = function(firstConnection, secondConnection)
	{
		let currentDistance = CalculateDistanceBetweenTwoNodes(firstConnection.startNode, firstConnection.endNode) + CalculateDistanceBetweenTwoNodes(secondConnection.startNode, secondConnection.endNode);
		let afterSwapDistance = CalculateDistanceBetweenTwoNodes(firstConnection.startNode, secondConnection.endNode) + CalculateDistanceBetweenTwoNodes(secondConnection.startNode, firstConnection.endNode);
		
		return afterSwapDistance-currentDistance;
	}
	
	//funkce vrati true, pokud dve spojeni sdili alespon jeden bod
	this.DoTwoConnectionsShareNode = function(firstConnection, secondConnection)
	{
		if (firstConnection.startNode === secondConnection.startNode || firstConnection.startNode === secondConnection.endNode || firstConnection.endNode === secondConnection.startNode || firstConnection.endNode === secondConnection.endNode)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	//funkce prohodi dve spojeni diagonalne
	this.DiagonalSwap = function(firstConnection, secondConnection)
	{
		let tmpNode = firstConnection.endNode;
		firstConnection.endNode = secondConnection.endNode;
		secondConnection.endNode = tmpNode;	
	}
	
	//funkce prohodi dve spojeni vertikalne
	this.VerticalSwap = function(firstConnection, secondConnection)
	{
		let tmpNode = firstConnection.startNode;
		firstConnection.startNode = secondConnection.endNode;
		secondConnection.endNode = tmpNode;	
	}
	
	//funkce najde dve sousedni spojeni zadaneho spojeni (ulozeni spojeni neni nijak linkovany kvuli prohazovani spojeni ve swap metode (mozna by to slo pomoci double linked list, ale bylo to zbytecny asi pro tuto aplikaci), nalezeni ma slozitos O(n))
	this.FindBothNeighboursOfConnection = function(connection)
	{
		let resultList = [];
		let actConnection;
		
		//projdem vsechny a nalezneme ty spojeni co sdili jeden uzel se zadanym spojenim
		for (let i = 0; i < this.connections.length; i++)
		{
			actConnection = this.connections[i];
			
			if (actConnection !== connection)
			{
				if (actConnection.startNode === connection.startNode || actConnection.endNode === connection.startNode)
				{
					resultList.push(actConnection);
				}
				
				if (actConnection.startNode === connection.endNode || actConnection.endNode === connection.endNode)
				{
					resultList.push(actConnection);
				}
			}
		}
		
		return resultList;
	}
	
	//funkce zjisti zda je aktualni cesta spojita, tedy vsechny spojeni jsou uzavreny do kruhu	
	this.IsPathGoingThroughAllNodes = function()
	{		
		let originalConnection = this.connections[0];
	
		let neighbours = this.FindBothNeighboursOfConnection(this.connections[0]);
		
		let actConnection = this.connections[0];
		let actConnectionForward = neighbours[0];
		
		let count = 0;
		
		//hleda me sousedy,  dokud nenarazime na startovaci spojeni, pak skoncime
		while (true)
		{
			count++;
			
			if (actConnectionForward === originalConnection)
			{
				break;
			}
			else
			{
				neighbours = this.FindBothNeighboursOfConnection(actConnectionForward);
				
				let tmp = actConnectionForward;
				
				if (neighbours[0] === actConnection)
				{
					actConnectionForward = neighbours[1];
				}
				else
				{
					actConnectionForward = neighbours[0];
				}
				
				actConnection = tmp;
			}
		}
		
		//pokud je pocet reven poctu uzlu, cesta je spojita
		if (count === this.nodeCount)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	//samotny krok swap metody
	this.SwapMethodStep = function()
	{	
		//metoda pracuje tak, ze da do dvojice kazdy s kazdym spojenim a pak spocita, jestli se vyplati vymena
		//pokud jsme zkusily vsechny kombinace a nic se neda zlepsit - metoda skonci, jinak jdeme dalsi kolo odznova
		
		//indexOne a indexTwo vlastne nahrazuji 2 for cykly, metoda je naimplementovana do krokove formy
		
		//pokud se nejedna o prvni krok, tak vratime barvy zvyraznenych do puvodniho stavu
		if (!(this.indexOne === 0 && this.indexTwo === 0))
		{
			this.connectionOne.color = baseColor;
			this.connectionTwo.color = baseColor;
		}
		
		//pokud druhe spojeni jiz proslo vsemi moznostmi, nastavime je na nulu a inkrementujeme prvni o jedna, tim postupne zajistime prubeh kazdy s kazdym
		if (this.indexTwo === this.connections.length)
		{	
			this.indexOne++;
			this.indexTwo = 0;	
		}

		//zkusili jsme vsechny kombinace
		if (this.indexOne === this.connections.length)
		{	
			//nebyly zadne uspesne prehozy - koncime
			if (this.successfulSwaps === 0)
			{
				this.swapMethodDone = true;
				return;
			}
			else
			{
				//jinak vyresetujeme promenne a zkusime znovu kazdy s kazdym
				this.indexTwo = 0;
				this.indexOne = 0;
				
				this.successfulSwaps = 0;		
				this.roundNumber++;	
				this.actRoundSteps = 0;
			}
		}		
		
		//vezmeme aktualni dovijici spojeni
		this.connectionOne = this.connections[this.indexOne];
		this.connectionTwo = this.connections[this.indexTwo];
		
		//a zvyraznime ji
		this.connectionOne.color = highlightColor;
		this.connectionTwo.color = highlightColor;
		
		//chceme jen ty dvojice spojeni, ktere nesdili uzly, tedy nejsou propojeny
		if (this.DoTwoConnectionsShareNode(this.connectionOne, this.connectionTwo) === false)
		{
			let swapSuccess = false;
			
			//spocitame zmenu delky cesty, pri provedeni vertikalniho prohozeni na aktualni dvojici
			let actCost = this.CalculateCostOfVerticalSwap(this.connectionOne, this.connectionTwo);
			
			//pokud je zaporna - vyplati se 
			if (actCost < 0)
			{				
				//prohodime spojeni
				this.VerticalSwap(this.connectionOne, this.connectionTwo);	
				swapSuccess = true;
				
				//POZOR - ted musime zkontrolovat, jestli je po prepojeni cesta stale spojita, tedy tvori kruh
				if (this.IsPathGoingThroughAllNodes() === false)
				{
					//netvori - vratime cestu do puvodniho stavu
					this.VerticalSwap(this.connectionOne, this.connectionTwo);
					swapSuccess = false;
				}
				else
				{
					//jinak je prehozeni uspesne a upravime citace
					this.successfulSwaps++;
					this.successfulSwapsTotal++; 
					this.currentPathLength = this.currentPathLength + actCost;
				}
			}
			
			//analogicky pro diagonalni prohozeni
			actCost = this.CalculateCostOfDiagonalSwap(this.connectionOne, this.connectionTwo);
			
			//POZOR - pokud jsme jiz udelali vertikalni prohozeni, tak diagonalni uz nedelame - pokud by bylo lepsi diagonalni nez vertikalni,
			//tak se provede v dalsim kole algoritmu
			if (actCost < 0 && swapSuccess === false)
			{
				this.DiagonalSwap(this.connectionOne, this.connectionTwo);

				if (this.IsPathGoingThroughAllNodes() === false)
				{
					this.DiagonalSwap(this.connectionOne, this.connectionTwo);
				}
				else
				{
					this.successfulSwaps++;
					this.successfulSwapsTotal++; 
					this.currentPathLength = this.currentPathLength + actCost;				
				}
			}
		}
		
		this.indexTwo++;
		this.actRoundSteps++;	
	}
	
	
	//brute force inicializace
	this.BruteForceInicialization = function()
	{
		let tmp = this.nodes.slice(0);
		tmp.shift();
	
		this.permutation = new Permutation(tmp);
		this.numberOfPaths = Factorial(this.nodeCount-1);
	}
	
	//brute force step metoda
	//dela to dvojnasobek cest zbytecne vlastne, ale bylo by dost obtizny z toho ty obraceny kopie vyfiltrovat ve step forme
	this.BruteForceStep = function ()
	{
		let actConnection;
		let i = 0;
		let actShuffle = this.permutation.ReturnNextPermutation();
		
		//pokud uz nezbyvaji permutace, tak koncime a nastavime nejlepsi na aktualni cestu
		if (actShuffle === null)
		{
			this.currentPathLength = this.bestLength;
			this.connections = this.bestPath;
			
			this.bruteForceDone = true;
			
			return;
		}
		
		// vyresetujeme aktualni cestu
		this.ResetCurrentPath();
		
		//prvni uzel je vzdy stejny
		let lastNode = this.nodes[0];
		
		//tvorime spojeni mezi uzly, dokud nespojime vsechny body
		while (i !== actShuffle.length)
		{
			actConnection = new Connection();
			
			actConnection.startNode = lastNode;
			actConnection.endNode = actShuffle[i];
			
			actConnection.color = baseColor;
			
			this.connections.push(actConnection);
			
			this.currentPathLength = this.currentPathLength + CalculateDistanceBetweenTwoNodes(actConnection.startNode, actConnection.endNode);
			lastNode = actConnection.endNode;
			i++;
		}
		
		//spojime posledni a prvni uzel
		actConnection = new Connection();
		
		actConnection.startNode = lastNode;
		actConnection.endNode = this.nodes[0];

		actConnection.color = baseColor;
		
		this.connections.push(actConnection);
		
		this.currentPathLength = this.currentPathLength + CalculateDistanceBetweenTwoNodes(actConnection.startNode, actConnection.endNode);
		
		//pokud je tahle lepsi nez zatim nejlepsi, tak zmenime trasu a jeji delku na aktualni
		if (this.currentPathLength < this.bestLength)
		{
			this.bestLength = this.currentPathLength;
			this.bestPath = [];
			
			let copyNode;
			
			for (let i = 0; i < this.connections.length; i++)
			{				
				this.bestPath.push(this.connections[i].CreateDuplicate());
			}
		}
		
		//pocet jiz vyzkousenych cest
		this.numberOfPathsSearched++;
	}
	
	
	//inicilizace greedy metody
	this.GreedyMethodInicialization = function()
	{
		this.remainingNodesGreedy = this.nodes.slice(0);
		this.firstNode = this.remainingNodesGreedy.shift();
		this.lastNode = this.firstNode;
		this.greedyPathDone = false;
	}
	
	//najde nejblizsi uzel k danemu uzlu a odebere ho z pole
	this.FindClosestNodeForNodeAndRemove = function (actNode)
	{
		let shortestDistance = Number.POSITIVE_INFINITY;
		let closestNode;
		let closestNodeIndex;
		let actDistance;
		
		for (let i = 0; i < this.remainingNodesGreedy.length; i++)
		{
			actDistance = CalculateDistanceBetweenTwoNodes(actNode, this.remainingNodesGreedy[i]);
			
			if (actDistance < shortestDistance)
			{
				shortestDistance = actDistance;
				closestNode = this.remainingNodesGreedy[i];
				closestNodeIndex = i;
			}
		}
		
		this.remainingNodesGreedy.splice(closestNodeIndex, 1);
		return closestNode;
	}
	
	//greedy metoda
	this.GreedyMethodStep = function()
	{
		let actConnection;
		
		//vzdy najdeme nejblizssi uzel k poslednimu a spojime je
		if (this.remainingNodesGreedy.length !== 0)
		{
			actConnection = new Connection();
			
			actConnection.startNode = this.lastNode;
			this.lastNode = this.FindClosestNodeForNodeAndRemove(this.lastNode);
			actConnection.endNode = this.lastNode;
			
			actConnection.color = baseColor;
			
			this.connections.push(actConnection);
			
			this.currentPathLength = this.currentPathLength + CalculateDistanceBetweenTwoNodes(actConnection.startNode, actConnection.endNode);
			
		}
		//posledni spojime manualne se stredem
		else
		{
			actConnection = new Connection();
			
			actConnection.startNode = this.lastNode;
			actConnection.endNode = this.firstNode;

			actConnection.color = baseColor;
			
			this.connections.push(actConnection);
			
			this.currentPathLength = this.currentPathLength + CalculateDistanceBetweenTwoNodes(actConnection.startNode, actConnection.endNode);
			
			this.greedyPathDone = true;
		}
	}

	//hlavni ridici cyklus algoritmu
	this.CurrentMethodStep = function()
	{
		//minimum je jeden step za frame, jinak by to cyklilo do nekonecna asi :D	
		if (this.stepsPerFrame < 1)
		{
			stepsPerFrameInputBox.SetValue(1);
			this.stepsPerFrame = 1;
		}
		
		for (let i = 0; i < this.stepsPerFrame; i++)
		{
			if (this.currentState === "Random")
			{
				if (this.randomPathDone === false)
				{
					this.GenerateRandomPathStep();
				}
				
				if (this.randomPathDone === true)
				{
					this.methodActive = false;
					break;
				}
			}
			else if (this.currentState === "Greedy")
			{
				if (this.greedyPathDone === false)
				{
					this.GreedyMethodStep();
				}
				
				if (this.greedyPathDone === true)
				{
					this.methodActive = false;
					break;
				}
			}
			else if (this.currentState === "Brute-force")
			{
				if (this.bruteForceDone === false)
				{
					this.BruteForceStep();
				}
				
				if (this.bruteForceDone === true)
				{
					this.methodActive = false;
					break;
				}
			}
			else if (this.currentState === "Random + 2-Opt Swap")
			{
				if (this.randomPathDone === false)
				{
					this.GenerateRandomPathStep();
				}
				
				if (this.randomPathDone === true && this.swapMethodDone === false)
				{
					this.SwapMethodStep();
				}
				
				if (this.randomPathDone === true && this.swapMethodDone === true)
				{
					this.methodActive = false;
					break;
				}
			}
			else if (this.currentState === "Greedy + 2-Opt Swap")
			{
				if (this.greedyPathDone === false)
				{
					this.GreedyMethodStep();
				}
				
				if (this.greedyPathDone === true && this.swapMethodDone === false)
				{
					this.SwapMethodStep();
				}
				
				if (this.greedyPathDone === true && this.swapMethodDone === true)
				{
					this.methodActive = false;
					break;
				}
			}
		}
		
		if (this.methodActive === false)
		{
			currentPathResetButton.Enable();
			saveCurrentPathButton.Enable();
			startButton.Enable();
			drawYourPathButton.Enable();
			savedPathResetButton.Enable();
		}
	}
	
	
	//vyreslovaci smycka
	this.DrawGraph = function(localContext)
	{
		let actConnection;
		
		//vykreslime zobrazovaci plochu
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(borderThickness, borderThickness+descriptionHeader, startCanvasWidth-2*borderThickness, startCanvasHeight-2*borderThickness-descriptionHeader-descriptionFooter);
		
		//vykreslime minulou cestu, pokud nejaka existuje
		for (let i = 0; i < this.lastConnections.length; i++)
		{
			actConnection = this.lastConnections[i];
			
			localContext.lineWidth = 8;
			localContext.strokeStyle = "rgb(255,255,255)";
			
			localContext.beginPath();
			localContext.moveTo(actConnection.startNode.x,  actConnection.startNode.y);
			localContext.lineTo( actConnection.endNode.x,  actConnection.endNode.y);
			localContext.stroke();
		}

		//vykresleni uzlu
		localContext.fillStyle = "rgb(0,0,0)";
		
		for (let i = 0; i < this.nodes.length; i++)
		{
			localContext.beginPath();
			localContext.arc(this.nodes[i].x,  this.nodes[i].y, 5, 0, 2*Math.PI);
			localContext.fill();
		}
		
		//vykresleni aktualne nejlepsi cesty u brute force algoritmu
		if (this.currentState === "Brute-force" && this.bruteForceDone === false)
		{			
			for (let i = 0; i < this.bestPath.length; i++)
			{
				actConnection = this.bestPath[i];

				localContext.lineWidth = 8;
				localContext.strokeStyle = "rgb(" + highlightColor[0].toString() + "," + highlightColor[1].toString() + "," + highlightColor[2].toString() + ")";
			
				localContext.beginPath();
				localContext.moveTo(actConnection.startNode.x,  actConnection.startNode.y);
				localContext.lineTo( actConnection.endNode.x,  actConnection.endNode.y);
				localContext.stroke();
			}
		}
			
		//vykresleni aktualni cesty
		localContext.lineWidth = 2;
		
		for (let i = 0; i < this.connections.length; i++)
		{
			actConnection = this.connections[i];
			
			localContext.strokeStyle = "rgb(" + actConnection.color[0] + "," + actConnection.color[1] + "," + actConnection.color[2] +")";
			
			if (actConnection.color === highlightColor)
			{
				localContext.lineWidth = 8;
			}
			else
			{
				localContext.lineWidth = 2;
			}
			
			localContext.beginPath();
			localContext.moveTo(actConnection.startNode.x,  actConnection.startNode.y);
			localContext.lineTo( actConnection.endNode.x,  actConnection.endNode.y);
			localContext.stroke();
		}
		
		//pokud se cesta vytvari rucne, musime navic vykreslit aktivni bod
		if (this.lastClickedNode !== undefined && this.currentState == "PathCreation")
		{
			localContext.fillStyle = "rgb(255,0,0)";
			localContext.beginPath();
			localContext.arc(this.lastClickedNode.x,  this.lastClickedNode.y, 7.5, 0, 2*Math.PI);
			localContext.fill();
		}

		//zobrazime highling pri stisku klavesy S
		if (this.currentState === "PathCreation" && IsKeyPressed("s") === true)
		{
			localContext.fillStyle = "rgb(0,0,255)";
			
			for (let i = 0; i < this.remainingNodes.length; i++)
			{
				localContext.beginPath();
				localContext.arc(this.remainingNodes[i].x,  this.remainingNodes[i].y, 15, 0, 2*Math.PI);
				localContext.fill();
			}
			
			this.higlightRemaining = false;
		}

		//----------------------------------------------------------------------
		//--------------------------------Popisy--------------------------------
		//----------------------------------------------------------------------
		
		
		localContext.fillStyle = "rgb(0,0,0)";
		localContext.font = "30px Arial";

		localContext.fillText("Framerate" + " = " +  (1000/deltaTime).toFixed(1) +  "fps", 940, 12);

		localContext.fillText("Node count" + " = " + this.nodeCount.toFixed(0), 30, 12);
		
		if (this.currentState === "Random")
		{
			localContext.fillText("Current path length" + " = " + this.currentPathLength.toFixed(0), 940, 42);
		}
		
		if (this.currentState === "Greedy")
		{
			localContext.fillText("Current path length" + " = " +  this.currentPathLength.toFixed(0), 940, 42);
		}
		
		if (this.currentState === "Random + 2-Opt Swap" || this.currentState === "Greedy + 2-Opt Swap")
		{
			localContext.fillText("Round completion" + " = " + (this.actRoundSteps/(this.nodeCount*this.nodeCount)*100).toFixed(1) + "%", 30, 42);

			localContext.fillText("Swaps in current round" + " = " + this.successfulSwaps.toFixed(0), 470, 12);

			localContext.fillText("Total swaps" + " = " + this.successfulSwapsTotal.toFixed(0), 470, 42);
				
			localContext.fillText("Current path length" + " = " + this.currentPathLength.toFixed(0), 940, 42);
		}
		
		if (this.currentState === "Brute-force")
		{
			localContext.fillText( "Completion" + " = " +  (this.numberOfPathsSearched/this.numberOfPaths*100).toFixed(1) + "%", 30, 42);

			localContext.fillText( "Best path length" + " = " + this.bestLength.toFixed(0), 470, 42);
			
			localContext.fillText( "Current path length" + " = " + this.currentPathLength.toFixed(0), 940, 42);
		}
		
		if (this.currentState === "Placing")
		{
			if (this.placeErrorMessageActive === true)
			{
				localContext.fillStyle = "rgb(255,0,0)";
				localContext.fillText("At least 3 nodes are required!", 30, (startCanvasHeight-borderThickness-descriptionFooter)+12);
			}
			
			localContext.fillStyle = "rgb(0,0,255)";
			localContext.fillText("LMB - Place Node", 1120, (startCanvasHeight-borderThickness-descriptionFooter)+12);
		}

		if (this.currentState === "PathCreation")
		{
			localContext.fillText("Current path length" + " = " +  this.currentPathLength.toFixed(0), 940, 42);
			
			if (this.pathErrorMessageActive === true)
			{
				localContext.fillStyle = "rgb(255,0,0)";
				localContext.fillText("All nodes must be connected!", 30, (startCanvasHeight-borderThickness-descriptionFooter)+12);
			}
			else
			{
				localContext.fillStyle = "rgb(0,0,255)";
				localContext.fillText("S - Highlight remaining, LMB - Place connection,  RMB - Remove connection", 350, (startCanvasHeight-borderThickness-descriptionFooter)+12);
			}		
		}

		localContext.fillStyle = "rgb(0,0,0)";
		
		if (this.currentState === "Default" && this.currentPathLength !== 0)
		{
			localContext.fillText( "Current path length" + " = " + this.currentPathLength.toFixed(0), 940, 42);
		}
		
		if (this.pathIsSaved === true && this.currentState !== "PathCreation")
		{
			localContext.fillText( "Saved path length" + " = " + this.lastPathLength.toFixed(0), 360, (startCanvasHeight-borderThickness-descriptionFooter)+12);
			localContext.fillText( "Saved/Current path length ratio" + " = " + (this.currentPathLength/this.lastPathLength*100).toFixed(2) + " %", 775, (startCanvasHeight-borderThickness-descriptionFooter)+12);
		}
	}
}


let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

//synchronization of HTML elements
function SychnronizeHTMLElements()
{
	numberOfNodesInputBox.SynchronizeInputs();
	stepsPerFrameInputBox.SynchronizeInputs();
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

	//pridani dalsiho listeneru protoze takova byla struktura z p5.js
	//ted to ma dva - druhy z Mouse.js
	canvas.addEventListener
	(
		'mousedown', 
		function(event) 
		{	
			mousePressed(event);
		}
	);

	//cary budou zaoblene
	context.lineCap = 'round';

	graph = new Graph();

	//inicializace tlacitek
	startPlacingButton = new Button("startPlacing","ManualPlacingStart()","Place nodes manualy");
	placingDoneButton = new Button("placingDone","ManualPlacingDone()","Node placing done");
	placingDoneButton.Disable();

	numberOfNodesInputBox = new CompleteInputBox("numberOfNodes", 3, 1000, 1,10, " nodes", "Number of nodes:");
	generateRandomButton = new Button("generateRandom","GenerateRandomNodes()","Generate random nodes");

	methodDropdownMenu = new CompleteDropdownMenu("method", ["Random + 2-Opt Swap", "Greedy + 2-Opt Swap", "Brute-force", "Greedy", "Random"], "Method:");
	stepsPerFrameInputBox = new CompleteInputBox("stepsPerFrame", 1, 1000, 1,10, " steps", "Steps per frame:");
	startButton = new Button("start","StartPathfinding()","Start");
	startButton.Disable();

	drawYourPathButton = new Button("drawYourPath","DrawYourPath()","Draw your path");
	drawYourPathButton.Disable();
	drawYourPathDoneButton = new Button("drawYourPathDone","DrawYourPathDone()","Done");
	drawYourPathDoneButton.Disable();
	
	currentPathResetButton = new Button("currentPathReset","CurrentPathReset()","Reset current path");
	currentPathResetButton.Disable();
	
	saveCurrentPathButton = new Button("saveCurrentPath","SaveCurrentPath()","Save current path");
	saveCurrentPathButton.Disable();
	savedPathResetButton = new Button("savedPathReset","SavedPathReset()","Reset saved path");
	savedPathResetButton.Disable();

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

	//clear canvas
    context.fillStyle = "rgb(240, 240, 240)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);

	//text bude vlevo nahore
	context.textAlign = "left";
    context.textBaseline = "top";
	
	//volani metody, pokud je aktivni
	if (graph.methodActive === true)
	{
		graph.CurrentMethodStep();
	}

	//vykresleni
	graph.DrawGraph(context);

    window.requestAnimationFrame(processLoop);
}

function Factorial(number)
{
    let result = 1;
	
    for (let i = 2; i <= number; i++)
	{
		result = result*i;
	}
	
    return result;
}

// https://en.wikipedia.org/wiki/Heap%27s_algorithm
function Permutation(inputArray)
{
	//funguje slice?
	this.inputArray = inputArray.slice(0);
	this.permutationsArray = [];
	
	this.stackArray = [];
	this.size = inputArray.length;
	this.i = 0;
	this.state = 0;
	
	this.ReturnAllPermutationsAtOnceRecursive = function()
	{
		this.HeapPermutationRecursive(this.inputArray, this.inputArray.length);
		
		return this.permutationsArray;
	}
	
	this.ReturnAllPermutationsAtOnceIterative = function()
	{
		this.HeapPermutationIterative(this.inputArray.length, this.inputArray);
		
		return this.permutationsArray;
	}
	
	this.ReturnNextPermutation = function()
	{
		return this.HeapPermutationIterativeStep();
	}
	
	//modifikace iterativni verze, aby vracela vysledky po krocich, analogie k tomu, jak jsem to udelal v radicich algoritmech
	this.HeapPermutationIterativeStep = function()
	{
		if (this.state === 0)
		{
			this.stackArray = [];
		
			for (let i = 0; i < this.size; i++) 
			{
				this.stackArray[i] = 0;
			}

			this.state = 1;
			return this.inputArray.slice(0);
			
			while (this.i < this.size)
			{
				if (this.stackArray[i] < this.i)
				{
					if (this.i % 2 === 0) 
					{ 
						let tmp = this.inputArray[0]; 
						this.inputArray[0] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					} 
					else
					{
						let tmp = this.inputArray[this.stackArray[this.i]]; 
						this.inputArray[this.stackArray[this.i]] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					}

					return this.inputArray.slice(0);

					this.stackArray[this.i]++;
					this.i = 0;
				}
				else
				{
					this.stackArray[this.i] = 0;
					this.i++;
				}
			}
			
			return null;
		}
		else if (this.state === 1)
		{
			while (this.i < this.size)
			{
				if (this.stackArray[this.i] < this.i)
				{
					if (this.i % 2 === 0) 
					{ 
						let tmp = this.inputArray[0]; 
						this.inputArray[0] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					} 
					else
					{
						let tmp = this.inputArray[this.stackArray[this.i]]; 
						this.inputArray[this.stackArray[this.i]] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					}

					this.state = 2;
					return this.inputArray.slice(0);

					this.stackArray[this.i]++;
					this.i = 0;
				}
				else
				{
					this.stackArray[this.i] = 0;
					this.i++;
				}
			}
			
			return null;
		}
		else
		{
			this.stackArray[this.i]++;
			this.i = 0;

			while (this.i < this.size)
			{
				if (this.stackArray[this.i] < this.i)
				{
					if (this.i % 2 === 0) 
					{ 
						let tmp = this.inputArray[0]; 
						this.inputArray[0] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					} 
					else
					{
						let tmp = this.inputArray[this.stackArray[this.i]]; 
						this.inputArray[this.stackArray[this.i]] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					}

					this.state = 2;
					return this.inputArray.slice(0);

					this.stackArray[this.i]++;
					this.i = 0;
				}
				else
				{
					this.stackArray[this.i] = 0;
					this.i++;
				}
			}
			
			return null;
		}
	}
	
	//iterativni verze
	this.HeapPermutationIterative = function(size, array)
	{
		stack = [];

		for (let i = 0; i < size; i++) 
		{
			stack[i] = 0;
		}

		this.permutationsArray.push(array.slice(0));

		let i = 0;
		while (i < size)
		{
			if (stack[i] < i)
			{
				if (i % 2 === 0) 
				{ 
					let tmp = array[0]; 
					array[0] = array[i]; 
					array[i] = tmp; 
				} 
				else
				{
					let tmp = array[stack[i]]; 
					array[stack[i]] = array[i]; 
					array[i] = tmp; 
				}

				this.permutationsArray.push(array.slice(0));

				stack[i]++;
				i = 0;
			}
			else
			{
				stack[i] = 0;
				i++;
			}
		}
	}
	
	// Heap's algorithm 
	this.HeapPermutationRecursive = function(array, size)
	{
		if (size === 1) 
		{
			this.permutationsArray.push(array.slice(0));
			return;
		}
		
		this.HeapPermutationRecursive(array, size-1);
		
		for (let i = 0; i < size-1; i++) 
		{ 
			// if size is odd, swap first and last element 
			if (size % 2 === 1) 
			{ 
				let tmp = array[0]; 
				array[0] = array[size-1]; 
				array[size-1] = tmp; 
			} 
			// If size is even, swap ith and last element 
			else
			{
				let tmp = array[i]; 
				array[i] = array[size-1]; 
				array[size-1] = tmp; 
			}
			
			this.HeapPermutationRecursive(array, size-1); 
		}
	}
}




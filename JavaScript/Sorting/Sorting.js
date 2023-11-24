//Bc. Tomas Jarusek, 3/2019

window.onload = function()  
{
	Init();
	ScaleCanvas();
};
window.onresize = ScaleCanvas;

//promenna pro hlavni tridu pole
let elementArray;

//globalni promenne pro stav trideni a generovani pole
let sortInProgress = false;
let arrayIsGenerated = false;

//promenne pro html prvky
let distributionDropdownMenu;
let visualizationModeDropdownMenu;
let numberOfElementsInputBox;
let generateButton;
let stepsPerCycleInputBox;
let sortMethodDropdownMenu;
let startButton;


//hlavni trida, obsahuje pole prvku, funkce pro jeho vykresleni a vola radici algoritmy, ktere nasledne s polem manipuluji
function ElementArray()
{
	//aktualni radici metoda a vizualizacni mod
	this.currentSortMethod;
	this.currentVisualizationMode;
	
	//hlavni pole a jeho nejvyssi prvek
	//pole je ma formu [[hodnota, barva],[[hodnota, [255,0,0]],...]]
	this.elementArray;
	this.largestElementInArray;
	
	//poset ubehlych framu a aktuali pocet cyklu, ktery se ma provest za frame
	this.frameCounter = 0;
	this.stepsPerCycle;
	
	//barvy normalnich a zvyraznenych sloupcu
	this.baseColor = [255,0,0];
	this.higlightColor = [0,0,255];
	
	//odsazeni od kraje platna a kraje vnitrniho obdelnika
	this.outerBorder = 20;
	this.innerBorder = 5;
	
	//steps per cycle setter
	this.SetStepsPerCycle = function(stepsPerCall)
	{
		this.stepsPerCycle = stepsPerCall;
	}
	
	//nalezeni nejvyssi prvku v poli, podle nej pak normalizujeme vysku tak, aby napr. nejvyssi sloupec presne vyplnil plochu na vysku
	this.FindLargestElement = function(elementArray)
	{
		let largestElement = 0;
		
		for (let i = 0; i < elementArray.length; i++)
		{
			if (elementArray[i][0] > largestElement)
			{
				largestElement = elementArray[i][0];
			}				
		}

		return largestElement;
	}
	
	//podle z voleneho modu generujeme do pole hodnoty
	this.GenerateElements = function(numberOfElements, mode)
	{
		if (mode === "Random")
		{
			this.GenerateElementsRandomMode(numberOfElements);
		}
		else if (mode === "Reversed")
		{
			this.GenerateElementsReversedMode(numberOfElements);
		}
		else if (mode === "Three values only")
		{
			this.GenerateElementsThreeValuesOnlyMode(numberOfElements);
		}
		else if (mode === "95% sorted")
		{
			this.GenerateElementsAlmostSortedMode(numberOfElements);
		}
		else if (mode === "Sine")
		{
			this.GenerateElementsSineMode(numberOfElements);
		}
		else if (mode === "Tangent")
		{
			this.GenerateElementsTangentMode(numberOfElements);
		}
		else if (mode === "Secant")
		{
			this.GenerateElementsSecantMode(numberOfElements);
		}
		else if (mode === "x*sin(x)")
		{
			this.GenerateElementsXSineXMode(numberOfElements);
		}
		else if (mode === "Cubic")
		{
			this.GenerateElementsCubicMode(numberOfElements);
		}
		else if (mode === "Triangle")
		{
			this.GenerateElementsTriangleMode(numberOfElements);
		}
		else if (mode === "Random (shuffled)")
		{
			this.GenerateElementsRandomShuffledMode(numberOfElements);
		}
		else if (mode === "Gaussian")
		{
			this.GenerateElementsGaussianMode(numberOfElements);
		}
		else if (mode === "Interlaced")
		{
			this.GenerateElementsInterlacedMode(numberOfElements);
		}
		else if (mode === "Quadratic")
		{
			this.GenerateElementsQuadraticMode(numberOfElements);
		}
		else if (mode === "Quartic")
		{
			this.GenerateElementsQuarticMode(numberOfElements);
		}
		
		this.largestElementInArray = this.FindLargestElement(this.elementArray);
	}
	
	this.GenerateElementsRandomMode = function(numberOfElements)
	{		
		this.elementArray = [];
		
		for (let i = 0; i < numberOfElements; i++)
		{
			this.elementArray.push([Math.random(),this.baseColor]);
		}	
	}
		
	this.GenerateElementsAlmostSortedMode = function(numberOfElements)
	{		
		this.elementArray = [];
		
		for (let i = 0; i < numberOfElements; i++)
		{
			if (Math.random() < 0.05)
			{
				this.elementArray.push([Math.random()*(numberOfElements-1),this.baseColor]);
			}
			else
			{
				this.elementArray.push([i,this.baseColor]);
			}	
		}	
	}
		
	this.GenerateElementsThreeValuesOnlyMode = function(numberOfElements)
	{		
		this.elementArray = [];
		
		for (let i = 0; i < numberOfElements; i++)
		{
			this.elementArray.push([Math.floor(Math.random()*3+1),this.baseColor]);
		}	
	}
	
	this.GenerateElementsTriangleMode = function(numberOfElements)
	{		
		this.elementArray = [];
		
		let value;
		
		for (let i = 0; i < numberOfElements; i++)
		{	
			value = Math.abs(Math.abs(Math.abs(Math.abs(((i/numberOfElements)*10)-7)-4)-2)-1);				

			this.elementArray.push([value,this.baseColor]);
		}	
	}
	
	this.GenerateElementsCubicMode = function(numberOfElements)
	{		
		this.elementArray = [];
		
		let value;
		
		for (let i = 0; i < numberOfElements; i++)
		{
			value = Math.abs(Math.abs((((i/numberOfElements)*4.2)-2)*(((i/numberOfElements)*4.2)-2)*(((i/numberOfElements)*4.2)-2)-2)-3);	

			if (value > 5)
			{
				value = 5;
			}
			this.elementArray.push([value,this.baseColor]);
		}	
	}
	
	this.GenerateElementsXSineXMode = function(numberOfElements)
	{		
		this.elementArray = [];

		for (let i = 0; i < numberOfElements; i++)
		{	
			this.elementArray.push([Math.abs((numberOfElements-i-1)*(Math.sin(Math.PI*((numberOfElements-i-1)/numberOfElements)*5))),this.baseColor]);
		}	
	}
	
	this.GenerateElementsSecantMode = function(numberOfElements)
	{		
		this.elementArray = [];
		
		let value;
		
		for (let i = 0; i < numberOfElements; i++)
		{		
			value = Math.abs(1/(Math.cos(Math.PI*(i/numberOfElements)*5)));	
			if (value > 5)
			{
				value = 5;
			}
			this.elementArray.push([value,this.baseColor]);
		}	
	}
	
	this.GenerateElementsTangentMode = function(numberOfElements)
	{		
		this.elementArray = [];
		
		let value;
		
		for (let i = 0; i < numberOfElements; i++)
		{
			value = Math.abs(Math.tan(Math.PI*(i/numberOfElements)*5));	
			if (value > 50)
			{
				value = 50;
			}
			this.elementArray.push([value,this.baseColor]);
		}	
	}
		
	this.GenerateElementsReversedMode = function(numberOfElements)
	{		
		this.elementArray = [];
		
		for (let i = 0; i < numberOfElements; i++)
		{
			this.elementArray.push([numberOfElements-i,this.baseColor]);
		}	
	}
	
	this.GenerateElementsSineMode = function(numberOfElements)
	{		
		this.elementArray = [];
		
		for (let i = 0; i < numberOfElements; i++)
		{
			this.elementArray.push([Math.abs(Math.sin(Math.PI*(i/numberOfElements)*5)),this.baseColor]);
		}	
	}

	this.GenerateElementsRandomShuffledMode = function(numberOfElements)
	{		
		this.elementArray = [];

		let tmpArray = [];

		for (let i = 0; i < numberOfElements; i++)
		{
			tmpArray.push(i);
		}

		let randomIndex;

		for (let i = 0; i < numberOfElements; i++)
		{
			randomIndex = Math.floor(Math.random()*tmpArray.length);
			
			this.elementArray.push([tmpArray[randomIndex], this.baseColor]);

			tmpArray.splice(randomIndex, 1);
		}	
	}

	this.GenerateElementsGaussianMode = function(numberOfElements)
	{
		this.elementArray = [];

		let startX = -3;
		let endX = 3;
		let currentX;

		let value;

		for (let i = 0; i < numberOfElements; i++)
		{
			currentX = startX + (endX - startX)/(numberOfElements - 1)*i;
			value = Math.E**(-currentX*currentX/2) - Math.E**(-(-3.01)*(-3.01)/2); //chceme aby to byla nula na okrajich
			this.elementArray.push([value,this.baseColor]);
		}
	}

	this.GenerateElementsInterlacedMode = function(numberOfElements)
	{
		this.elementArray = [];

		for (let i = 0; i < numberOfElements; i++)
		{
			if (i % 2 === 0)
			{
				this.elementArray.push([i,this.baseColor]);
			}
			else
			{
				if (numberOfElements % 2 === 0)
				{
					this.elementArray.push([Math.abs(numberOfElements - i),this.baseColor]);
				}
				else
				{
					this.elementArray.push([Math.abs(numberOfElements - 1 - i),this.baseColor]);
				}				
			}
		}
	}

	this.GenerateElementsQuadraticMode = function(numberOfElements)
	{
		this.elementArray = [];

		let startX = -2;
		let endX = 2;
		let currentX;

		let value;

		for (let i = 0; i < numberOfElements; i++)
		{
			currentX = startX + (endX - startX)/(numberOfElements - 1)*i;
			value = currentX*currentX

			this.elementArray.push([value,this.baseColor]);
		}
	}

	this.GenerateElementsQuarticMode = function(numberOfElements)
	{
		this.elementArray = [];

		let startX = 0;
		let endX = 10;
		let currentX;

		let value;

		for (let i = 0; i < numberOfElements; i++)
		{
			currentX = startX + (endX - startX)/(numberOfElements - 1)*i;
			value = -1/50*(currentX - 0)*(currentX - 4)*(currentX - 4)*(currentX - 10)

			this.elementArray.push([value,this.baseColor]);
		}
	}
	
	//podle vyberu nastavime vytvorime objekt tridici metody
	this.SetSortMethod = function(sortMethod)
	{
		if (sortMethod === "Bubble sort")
		{
			this.currentSortMethod = new BubbleSort(this.elementArray);
		}
		else if (sortMethod === "Merge sort")
		{
			this.currentSortMethod = new MergeSort(this.elementArray);
		}
		else if (sortMethod === "Selection sort")
		{
			this.currentSortMethod = new SelectionSort(this.elementArray);
		}
		else if (sortMethod === "Quicksort")
		{
			this.currentSortMethod = new QuickSort(this.elementArray);
		}
		else if (sortMethod === "Insertion sort")
		{
			this.currentSortMethod = new InsertionSort(this.elementArray);
		}
		else if (sortMethod === "Cycle sort")
		{
			this.currentSortMethod = new CycleSort(this.elementArray);
		}
		else if (sortMethod === "Odd-even sort")
		{
			this.currentSortMethod = new OddEvenSort(this.elementArray);
		}
		else if (sortMethod === "Heapsort")
		{
			this.currentSortMethod = new HeapSort(this.elementArray);
		}
		else if (sortMethod === "Radix sort (LSD, Base 10)")
		{
			this.currentSortMethod = new RadixSort(this.elementArray, 10);
			this.largestElementInArray = this.currentSortMethod.ConvertArrayToFiveDigitIntegers(this.largestElementInArray);
		}
		else if (sortMethod === "Radix sort (LSD, Base 2)")
		{
			this.currentSortMethod = new RadixSort(this.elementArray, 2);
			this.largestElementInArray = this.currentSortMethod.ConvertArrayToFiveDigitIntegers(this.largestElementInArray);
		}
	}
	
	//pak v dannem objektu volame metodu SortInSteps()
	//pokud je pocet kroku za frame vyssi nez jedna, pak normalne tuto hodnotu predame objektu tridici metody
	//pokud je mensi nez jedna, tak zpomalime razeni tak, ze zavolame metodu razeni napriklad jen v jednom ze dvou framu
	//pod bude hodnota napr. 0.25, zavolame metodu SortInSteps(1), s parametrem 1, jednou po 4 framech  
	this.SortInSteps = function()
	{
		this.frameCounter++;
		
		if (this.stepsPerCycle < 1)
		{
			if (1/this.frameCounter <= this.stepsPerCycle)
			{
				this.frameCounter = 0;
				return this.currentSortMethod.SortInSteps(1);
			}
		}
		else
		{
			return this.currentSortMethod.SortInSteps(this.stepsPerCycle);
		}
	}
	
	//vykresleni pole dle zadaneho modu
	this.Draw = function(localContext)
	{
		if (this.currentVisualizationMode === "Columns")
		{
			this.DrawAsColumns(localContext);
		}
		else if (this.currentVisualizationMode === "Points")
		{
			this.DrawAsPoints(localContext);
		}
		else if (this.currentVisualizationMode === "Color band")
		{
			this.DrawAsColorBand(localContext);
		}
		else if (this.currentVisualizationMode === "Color wheel")
		{
			this.DrawAsColorWheel(localContext);
		}
		else if (this.currentVisualizationMode === "Spiral")
		{
			this.DrawAsSpiral(localContext);
		}
		else if (this.currentVisualizationMode === "Concentric circles")
		{
			this.DrawAsConcentricCircles(localContext);
		}
		else if (this.currentVisualizationMode === "Vector line")
		{
			this.DrawAsVectorLine(localContext);
		}
		else if (this.currentVisualizationMode === "Vector circle")
		{
			this.DrawAsVectorCircle(localContext);
		}
		else if (this.currentVisualizationMode === "Bézier curves")
		{
			this.DrawAsBezierCurves(localContext);
		}
	}
	
	this.DrawAsColumns = function(localContext)
	{
		let bordersCombined = this.outerBorder+this.innerBorder;
		let columnWidth = (startCanvasWidth-2*this.outerBorder-2*this.innerBorder)/this.elementArray.length;
		let normalizationConstant = (startCanvasHeight-2*this.outerBorder-2*this.innerBorder)/this.largestElementInArray;
		
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(this.outerBorder,this.outerBorder,startCanvasWidth-2*this.outerBorder,startCanvasHeight-2*this.outerBorder);
		
		for (let i = 0; i < this.elementArray.length; i++)
		{		
			localContext.fillStyle = "rgb(" + this.elementArray[i][1][0].toString() + "," + this.elementArray[i][1][1].toString() + "," + this.elementArray[i][1][2].toString() + ")";
			localContext.fillRect(bordersCombined+i*columnWidth,startCanvasHeight-bordersCombined-this.elementArray[i][0]*normalizationConstant,columnWidth,this.elementArray[i][0]*normalizationConstant);
		}	
	}
	
	this.DrawAsPoints = function(localContext)
	{
		let bordersCombined = this.outerBorder+this.innerBorder;
		let columnWidth = (startCanvasWidth-2*this.outerBorder-2*this.innerBorder)/this.elementArray.length;
		let normalizationConstant = (startCanvasHeight-2*this.outerBorder-2*this.innerBorder)/this.largestElementInArray;
		
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(this.outerBorder,this.outerBorder,startCanvasWidth-2*this.outerBorder,startCanvasHeight-2*this.outerBorder);
		
		for (let i = 0; i < this.elementArray.length; i++)
		{		
			localContext.strokeStyle = "rgb(" + this.elementArray[i][1][0].toString() + "," + this.elementArray[i][1][1].toString() + "," + this.elementArray[i][1][2].toString() + ")";
			localContext.fillStyle = "rgb(" + this.elementArray[i][1][0].toString() + "," + this.elementArray[i][1][1].toString() + "," + this.elementArray[i][1][2].toString() + ")";
			
			if (this.CompareColor(this.higlightColor, this.elementArray[i][1]) === true)
			{
				localContext.lineWidth = 15;		

				localContext.beginPath();
				localContext.arc(bordersCombined+i*columnWidth+columnWidth/2, startCanvasHeight-bordersCombined-this.elementArray[i][0]*normalizationConstant, 7.5, 0, 2*Math.PI);
				localContext.fill();
			}
			else
			{
				localContext.lineWidth = 5;	

				localContext.beginPath();
				localContext.arc(bordersCombined+i*columnWidth+columnWidth/2, startCanvasHeight-bordersCombined-this.elementArray[i][0]*normalizationConstant, 2.5, 0, 2*Math.PI);
				localContext.fill();
			}	
		}
	}
	
	this.DrawAsColorBand = function(localContext)
	{		
		let bordersCombined = this.outerBorder+this.innerBorder;
		let columnWidth = (startCanvasWidth-2*this.outerBorder-2*this.innerBorder)/this.elementArray.length;
		let normalizationConstant = 255/this.largestElementInArray;
		
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(this.outerBorder,this.outerBorder,startCanvasWidth-2*this.outerBorder,startCanvasHeight-2*this.outerBorder);
		
		for (let i = 0; i < this.elementArray.length; i++)
		{	
			if (this.CompareColor(this.higlightColor, this.elementArray[i][1]) === true)
			{
				localContext.fillStyle = "rgb(0,0,0)";
			}
			else
			{
				localContext.fillStyle = "rgb(" + (this.elementArray[i][0]*normalizationConstant).toString() + ",0," + (255-this.elementArray[i][0]*normalizationConstant).toString() + ")";
			}
			
			localContext.fillRect(bordersCombined+i*columnWidth,bordersCombined,columnWidth,startCanvasHeight-2*bordersCombined);
		}		
	}

	this.DrawAsColorWheel = function(localContext)
	{
		let bordersCombined = this.outerBorder+this.innerBorder;
		let radius = (startCanvasHeight-2*this.outerBorder-2*this.innerBorder)/2;
		let centerX = startCanvasWidth/2;
		let centerY = startCanvasHeight/2;
		
		let normalizationConstant = 255/this.largestElementInArray;
		
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(this.outerBorder,this.outerBorder,startCanvasWidth-2*this.outerBorder,startCanvasHeight-2*this.outerBorder);
		
		let x1,y1,x2,y2,x3,y3;
		
		for (let i = 0; i < this.elementArray.length; i++)
		{	
			if (this.CompareColor(this.higlightColor, this.elementArray[i][1]) === true)
			{
				localContext.fillStyle = "rgb(0,0,0)";
			}
			else
			{	//interpolace modra->cervena->zelena->modra
				if (this.elementArray[i][0] < this.largestElementInArray/3)
				{
					localContext.fillStyle = "rgb(" + ((this.elementArray[i][0]*normalizationConstant-0)/85*255).toString() + ",0," + (255-(this.elementArray[i][0]*normalizationConstant-0)/85*255).toString() + ")";
				}
				else if (this.elementArray[i][0] < this.largestElementInArray/3*2)
				{
					localContext.fillStyle = "rgb(" + (255-(this.elementArray[i][0]*normalizationConstant-85)/85*255).toString() + "," + ((this.elementArray[i][0]*normalizationConstant-85)/85*255).toString() + ",0)";
				}
				else
				{
					localContext.fillStyle = "rgb(0," + (255-(this.elementArray[i][0]*normalizationConstant-170)/85*255).toString() + "," + ((this.elementArray[i][0]*normalizationConstant-170)/85*255).toString() + ")";
				}
				
			}
					
			x1 = centerX+radius*Math.cos(Math.PI*2/this.elementArray.length*i);
			y1 = centerY-radius*Math.sin(Math.PI*2/this.elementArray.length*i);
			x2 = centerX+radius*Math.cos(Math.PI*2/this.elementArray.length*((i+1)%this.elementArray.length));
			y2 = centerY-radius*Math.sin(Math.PI*2/this.elementArray.length*((i+1)%this.elementArray.length));
			x3 = centerX;
			y3 = centerY;
			
			localContext.beginPath();
            localContext.moveTo(x1, y1);
            localContext.lineTo(x2, y2);
            localContext.lineTo(x3, y3);
            localContext.fill();
		}		
	}
	
	this.DrawAsSpiral = function(localContext)
	{
		let bordersCombined = this.outerBorder+this.innerBorder;
		let radius = (startCanvasHeight-2*this.outerBorder-2*this.innerBorder)/2;
		let centerX = startCanvasWidth/2;
		let centerY = startCanvasHeight/2;
		
		let normalizationConstant = radius/this.largestElementInArray;
		
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(this.outerBorder,this.outerBorder,startCanvasWidth-2*this.outerBorder,startCanvasHeight-2*this.outerBorder);
		
		let r1,r2,x1,y1,x2,y2;

		let x2_previous;
		let y2_previous;
		
		for (let i = 0; i < this.elementArray.length-1; i++)
		{
			localContext.strokeStyle = "rgb(" + this.elementArray[i][1][0].toString() + "," + this.elementArray[i][1][1].toString() + "," + this.elementArray[i][1][2].toString() + ")";
				
			if (this.CompareColor(this.higlightColor, this.elementArray[i][1]) === true)
			{
				localContext.lineWidth = 10;		
			}
			else
			{
				localContext.lineWidth = 5;	
			}

			if (i === 0)
			{
				r1 = this.elementArray[i][0]*normalizationConstant;
				r2 = this.elementArray[i+1][0]*normalizationConstant;
				x1 = centerX+r1*Math.cos(4*Math.PI*2/this.elementArray.length*i);
				y1 = centerY-r1*Math.sin(4*Math.PI*2/this.elementArray.length*i);
				x2 = centerX+r2*Math.cos(4*Math.PI*2/this.elementArray.length*(i+1));
				y2 = centerY-r2*Math.sin(4*Math.PI*2/this.elementArray.length*(i+1));

				x2_previous = x2;
				y2_previous = y2;
			}
			else
			{
				r2 = this.elementArray[i+1][0]*normalizationConstant;
				x1 = x2_previous;
				y1 = y2_previous;
				x2 = centerX+r2*Math.cos(4*Math.PI*2/this.elementArray.length*(i+1));
				y2 = centerY-r2*Math.sin(4*Math.PI*2/this.elementArray.length*(i+1));

				x2_previous = x2;
				y2_previous = y2;
			}
								
			localContext.beginPath();
			localContext.moveTo(x1, y1);
			localContext.lineTo(x2, y2);
			localContext.stroke();
		}
	}
	
	this.DrawAsConcentricCircles = function(localContext)
	{
		let bordersCombined = this.outerBorder+this.innerBorder;
		let diameter = startCanvasHeight-2*this.outerBorder-2*this.innerBorder;
		let centerX = startCanvasWidth/2;
		let centerY = startCanvasHeight/2;
		
		let normalizationConstant = 255/this.largestElementInArray;
		
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(this.outerBorder,this.outerBorder,startCanvasWidth-2*this.outerBorder,startCanvasHeight-2*this.outerBorder);

		//pro lepsi performance budeme volat stroke s variabilni lineWidth misto fill

		//prvni pruh u stredu bude vypadat jako kruh s prumerem rovnym dvojnasobku sirky jednoho pruhu
		//to ale vypada moc tluste - mel by mit prumer rovny sirce pruhu
		//rozdelime tedy polomer celeho kruhu na dilky - bude jich dvojnasobek poctu prvku minus jedna
		//tim padem jeden dilek pripadne na stred a dva dilky an ostatni pruhy
		let haflArcThickness = (diameter/2)/(2*this.elementArray.length - 1);
		//tloustka celeho kruhoveho pruhu
		let arcThickness = haflArcThickness*2;

		//protoze chceme aby mezi pruhy neprosvitalo pozadi, tak budeme pruhy prekryvat - jejich dvojnasobnou sirkou
		localContext.lineWidth = arcThickness*2;

		//zacneme od vnejsku - stred se tu resit nebude, ten se vyresi zvlast
		for (let i = this.elementArray.length - 1; i >= 1; i--)
		{
			if (this.CompareColor(this.higlightColor, this.elementArray[i][1]) === true)
			{
				localContext.strokeStyle = "rgb(0,0,0)";
			}
			else
			{
				localContext.strokeStyle = "rgb(" + (this.elementArray[i][0]*normalizationConstant).toString() + ",0," + (255-this.elementArray[i][0]*normalizationConstant).toString() + ")";
			}

			//budeme vykreslovat pruhy s dvojnasobnou sirkou tak, aby jejich vnejsi okraj souhlasil s jejich realnym vnejsim okrajem
			//smerem dovnitr budou zasahovat do prostoru dalsiho pruhu, to ale nevadi - to prekryje dalsi pruh o jednu pozici blize stredu - pozadi nebude prosvitat
			localContext.beginPath();
			localContext.arc(centerX, centerY, haflArcThickness*(2*i-1) , 0, 2*Math.PI);
			localContext.stroke();
		}

		if (this.CompareColor(this.higlightColor, this.elementArray[0][1]) === true)
		{
			localContext.fillStyle = "rgb(0,0,0)";
		}
		else
		{
			localContext.fillStyle = "rgb(" + (this.elementArray[0][0]*normalizationConstant).toString() + ",0," + (255-this.elementArray[0][0]*normalizationConstant).toString() + ")";
		}

		//nakonec vykreslime stred jako normalni kruh
		localContext.beginPath();
		localContext.arc(centerX, centerY, haflArcThickness , 0, 2*Math.PI);
		localContext.fill();
	}
	
	this.DrawAsVectorLine = function(localContext)
	{
		let bordersCombined = this.outerBorder+this.innerBorder;
		
		let vectorStart = bordersCombined+1/4*(startCanvasWidth-2*bordersCombined);
		let vectorGap = ((bordersCombined+3/4*(startCanvasWidth-2*bordersCombined)) - vectorStart)/(this.elementArray.length-1);
		
		let radius = (startCanvasHeight-2*bordersCombined)*3/4;
		let angleStart = Math.PI*21/32;
		let angleEnd = Math.PI*10/32;
		
		let normalizationConstant = angleEnd/this.largestElementInArray;
		
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(this.outerBorder,this.outerBorder,startCanvasWidth-2*this.outerBorder,startCanvasHeight-2*this.outerBorder);
	
		let x1,y1,x2,y2;

		for (let i = 0; i < this.elementArray.length; i++)
		{		
			if (this.elementArray.length < 100)
			{
				localContext.lineWidth = 5;
			}
			else
			{
				localContext.lineWidth = 500/this.elementArray.length;
			}

			if (this.CompareColor(this.higlightColor, this.elementArray[i][1]) === true)
			{
				localContext.strokeStyle = "rgb(0,0,0)";
			}
			else
			{
				localContext.strokeStyle = "rgb(" + this.elementArray[i][1][0].toString() + "," + this.elementArray[i][1][1].toString() + "," + this.elementArray[i][1][2].toString() + ")";
			}
				
			x1 = vectorStart+i*vectorGap;
			y1 = startCanvasHeight-bordersCombined;
			x2 = x1+radius*Math.cos(angleStart-(this.elementArray[i][0]*normalizationConstant));
			y2 = y1-radius*Math.sin(angleStart-(this.elementArray[i][0]*normalizationConstant));

			localContext.beginPath();
			localContext.moveTo(x1, y1);
			localContext.lineTo(x2, y2);
			localContext.stroke();
		}	
	}
	
	this.DrawAsVectorCircle = function(localContext)
	{
		let bordersCombined = this.outerBorder+this.innerBorder;
		let centerX = startCanvasWidth/2;
		let centerY = startCanvasHeight/2;
		
		let InnerRadius = (startCanvasHeight-2*bordersCombined)*1/4;
		let OuterRadius = (startCanvasHeight-2*bordersCombined)*1/4;
		
		let normalizationConstant = Math.PI*2/this.largestElementInArray;
		
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(this.outerBorder,this.outerBorder,startCanvasWidth-2*this.outerBorder,startCanvasHeight-2*this.outerBorder);
	
		let x1,y1,x2,y2;

		for (let i = 0; i < this.elementArray.length; i++)
		{		
			if (this.elementArray.length < 100)
			{
				localContext.lineWidth = 5;
			}
			else
			{
				localContext.lineWidth = 500/this.elementArray.length;
			}

			if (this.CompareColor(this.higlightColor, this.elementArray[i][1]) === true)
			{
				localContext.strokeStyle = "rgb(0,0,0)";
			}
			else
			{
				localContext.strokeStyle = "rgb(" + this.elementArray[i][1][0].toString() + "," + this.elementArray[i][1][1].toString() + "," + this.elementArray[i][1][2].toString() + ")";
			}

			x1 = centerX+InnerRadius*Math.cos(Math.PI*2/this.elementArray.length*i);
			y1 = centerY-InnerRadius*Math.sin(Math.PI*2/this.elementArray.length*i);
			x2 = x1+OuterRadius*Math.cos(this.elementArray[i][0]*normalizationConstant);
			y2 = y1-OuterRadius*Math.sin(this.elementArray[i][0]*normalizationConstant);

			localContext.beginPath();
			localContext.moveTo(x1, y1);
			localContext.lineTo(x2, y2);
			localContext.stroke();
		}	
	}

	this.DrawAsBezierCurves = function(localContext)
	{
		let bordersCombined = this.outerBorder+this.innerBorder;

		//starty spodni a horni cary
		let originStartX = bordersCombined + (startCanvasWidth - 2*bordersCombined)*(2/10);
		let originStartY = bordersCombined + (startCanvasHeight - 2*bordersCombined)*(1/20);
		let originEndX = bordersCombined + (startCanvasWidth - 2*bordersCombined)*(2/10);
		let originEndY = bordersCombined + (startCanvasHeight - 2*bordersCombined)*(19/20);

		let startX;
		let startY;
		let endX;
		let endY;
		let startBezierX;
		let startBezierY;
		let endBezierX;
		let endBezierY;
		
		localContext.fillStyle = "rgb(200,200,200)";
		localContext.fillRect(this.outerBorder,this.outerBorder,startCanvasWidth-2*this.outerBorder,startCanvasHeight-2*this.outerBorder);

		localContext.lineWidth = this.elementArray.length < 100 ? 8.4/1.6 : ((bordersCombined + (startCanvasWidth - 2*bordersCombined)*(8/10)) - originStartX)/this.elementArray.length/1.6;

		for (let i = 0; i < this.elementArray.length; i++)
		{
			if (this.CompareColor(this.higlightColor, this.elementArray[i][1]) === true)
			{
				localContext.strokeStyle = "rgb(0,0,0)";
			}
			else
			{
				localContext.strokeStyle = "rgb(" + this.elementArray[i][1][0].toString() + "," + this.elementArray[i][1][1].toString() + "," + this.elementArray[i][1][2].toString() + ")";
			}

			//posouvame se na obou carach doprava
			startX = originStartX + ((bordersCombined + (startCanvasWidth - 2*bordersCombined)*(8/10)) - originStartX)/(this.elementArray.length - 1)*i;
			startY = originStartY;
			endX = originEndX + ((bordersCombined + (startCanvasWidth - 2*bordersCombined)*(8/10)) - originEndX)/(this.elementArray.length - 1)*i;
			endY = originEndY;

			//horni cara ma prednastavene uhly bezierovych krivek, spodni je ma nastavene podle hodnoty cisla
			startBezierX = startX + 500*Math.cos(6*Math.PI/8 - (4*Math.PI/8)/(this.elementArray.length - 1)*i);
			startBezierY = startY + 500*Math.sin(6*Math.PI/8 - (4*Math.PI/8)/(this.elementArray.length - 1)*i);
			endBezierX = endX + 500*Math.cos(10*Math.PI/8 + (4*Math.PI/8)/this.largestElementInArray*this.elementArray[i][0]);
			endBezierY = endY + 500*Math.sin(10*Math.PI/8 + (4*Math.PI/8)/this.largestElementInArray*this.elementArray[i][0]);

			localContext.beginPath();
			localContext.moveTo(startX, startY);
			localContext.bezierCurveTo(startBezierX, startBezierY, endBezierX, endBezierY, endX, endY);
			localContext.stroke();
		}
	}
	
	//tohle porovna dve barvy, tedy vlastne pole o trech prvcich
	this.CompareColor = function(colorOne, colorTwo)
	{
		if (colorOne[0] === colorTwo[0] && colorOne[1] === colorTwo[1] && colorOne[2] === colorTwo[2])
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}


let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

//synchronization of HTML elements
function SychnronizeHTMLElements()
{
	numberOfElementsInputBox.SynchronizeInputs();
	stepsPerCycleInputBox.SynchronizeInputs();
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

	//keyboard activation
	ActivateKeyboard();
	
	//vytvorime a inicializujeme HTML prvky
	distributionDropdownMenu = new CompleteDropdownMenu("distribution", ["Random","Random (shuffled)","Reversed","Three values only","95% sorted","Sine","Tangent","Secant","x*sin(x)","Triangle","Gaussian","Interlaced","Quadratic","Cubic","Quartic"], "Values distribution:");
	visualizationModeDropdownMenu = new CompleteDropdownMenu("visualizationMode", ["Columns","Points","Spiral","Color band","Color wheel","Concentric circles","Vector line","Vector circle","Bézier curves"], "Visualization mode:");
	numberOfElementsInputBox = new CompleteInputBox("numberOfElements", 3, 2000, 1,1000, " elements", "Number of elements:");
	generateButton = new Button("generate","GenerateArrayToSort()","Generate array");
	stepsPerCycleInputBox = new CompleteInputBox("stepsPerCycle", 0.05, 2500, 0.01, 500, " steps", "Steps per frame:");
	sortMethodDropdownMenu = new CompleteDropdownMenu("sortMethod", ["Bubble sort","Selection sort","Insertion sort","Cycle sort","Odd-even sort","Merge sort","Quicksort","Heapsort","Radix sort (LSD, Base 10)", "Radix sort (LSD, Base 2)"], "Sorting Method:");
	startButton = new Button("start","StartSorting()","Start sorting");
	
	//cary budou zaoblene
	context.lineCap = 'round';
	
	//vytvorime pole
	elementArray = new ElementArray();

	//vygenerujeme do nej hodnoty
	GenerateArrayToSort();
	
	//testovaci kod, provede se hned po startu
	// elementArray.GenerateElements(numberOfElementsInputBox.GetValue(),"Random");
	// elementArray.elementArray = [[8,[255,0,0]],[2,[255,0,0]],[3,[255,0,0]],[7,[255,0,0]],[4,[255,0,0]],[5,[255,0,0]],[6,[255,0,0]],[1,[255,0,0]]];
	// elementArray.elementArray = [[8,[255,0,0]],[6,[255,0,0]],[5,[255,0,0]],[3,[255,0,0]],[1,[255,0,0]]];
	// elementArray.largestElementInArray = 8;
	// elementArray.SetSortMethod("Merge Sort");
	// elementArray.currentSortMethod.SortImmediately();

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

	//pokud ma probihat trideni, tak volame tridici metodu
	if (sortInProgress === true)
	{
		sortInProgress = !elementArray.SortInSteps();
	}
	
	//vykreslime pole
	elementArray.Draw(context);

    window.requestAnimationFrame(processLoop);
}

//funkce pro vygenerovani hodnot do pole, provede se pri startu a spri stisku tlacitka
function GenerateArrayToSort()
{
	sortInProgress = false;
	elementArray.GenerateElements(numberOfElementsInputBox.GetValue(),distributionDropdownMenu.GetValue());
	arrayIsGenerated = true;
	elementArray.currentVisualizationMode = visualizationModeDropdownMenu.GetValue();
	startButton.Enable();
}

//zacne se radit, po stisku tlacitka
function StartSorting()
{
	if (sortInProgress === false && arrayIsGenerated === true)
	{
		elementArray.SetSortMethod(sortMethodDropdownMenu.GetValue());
		elementArray.SetStepsPerCycle(stepsPerCycleInputBox.GetValue());
		sortInProgress = true;
		arrayIsGenerated = false;
		startButton.Disable();
	}
}







	
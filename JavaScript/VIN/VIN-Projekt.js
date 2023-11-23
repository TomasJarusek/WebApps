//Number visualizer - VIN project
//Bc. Tomas Jarusek, 12/2018 (21.12.2018)

let pageLoaded = false;

let inputs = [[500,500,500],[500,500,500],[0,0,0],[90,90,90],[0,0,0],[90,90,90],[1,1,1],[1.5,1.5,1.5],[100,100,100],[true],["BLEND"],[1,1,1],[true],[true],[30,30,30],["Zelená"],["Červená"],[false],[false],[31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679]];

let colorOptions = ["Červená","Zelená","Modrá","Žlutá","Azurová","Purpurová","Oranžová","Hnědá","Stříbrná","Černá"];

let saveInProgress = false;

let currentNumber;

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
/*promichani pole*/
function shuffle(a) 
{
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

window.onload = function()  
{
	UpdateInputs();
	colorOptions = shuffle(colorOptions);
	pageLoaded = true;

	Init();
	ScaleCanvas_Visualizer();
}
window.onresize = ScaleCanvas_Visualizer;

/*ulozeni obrazku*/
function SaveImg() 
{
	//chceme v nasledujicim framu ulozit canvas
	saveInProgress = true;
}

/*nahodne promicha pole*/
function Randomize()
{
	colorOptions = shuffle(colorOptions);
}

/*updatne input posuvniku*/
function UpdateSliderInput(inputIndex, name, min, max, append)
{
	let sliderValue;
	let textboxValue;
	let tmp;
	
	sliderValue = parseFloat(document.getElementById(name).value);

	tmp = /(([0-9]+.[0-9]+)|([0-9]+))/i.exec(document.getElementById(name+"Textbox").value);
	if (tmp !== null)
		textboxValue = parseFloat(tmp[0]);
	else
		textboxValue = null;
	
	if (sliderValue !== inputs[inputIndex][1])
	{
		/*slider se meni*/
		inputs[inputIndex][0] = sliderValue;
		inputs[inputIndex][1] = sliderValue;
		inputs[inputIndex][2] = sliderValue;
		document.getElementById(name+"Textbox").value = sliderValue.toString()+append;
		
	}
	else
	{
		if (textboxValue !== null && textboxValue >= min)
		{
			if (textboxValue !== inputs[inputIndex][2])		
			{
				if (textboxValue > max)
				{
					inputs[inputIndex][0] = textboxValue;
					inputs[inputIndex][1] = max;
					inputs[inputIndex][2] = textboxValue;					
					document.getElementById(name).value = max.toString();
				}
				else
				{
					inputs[inputIndex][0] = textboxValue;
					inputs[inputIndex][1] = textboxValue;
					inputs[inputIndex][2] = textboxValue;
					document.getElementById(name).value = textboxValue.toString();
				}
			}
		}
	}
}

/*v kazdem framu updatne inputy*/
function UpdateInputs()
{
	let sliderValue;
	let textboxValue;
	let tmp;
	
	/*sirka elipsy*/
	UpdateSliderInput(0, "ellipseWidth", 1, 1200, "px");
	
	/*vyska elipsy*/
	UpdateSliderInput(1, "ellipseHeight", 1, 800, "px");
	
	/*uhel pocatku*/
	UpdateSliderInput(2, "bezierAngle1", 0, 360, "°");
	
	/*mohutnost pocatku*/
	UpdateSliderInput(3, "bezierLenght1", 1, 1000, "px");
	
	/*uhel konce*/
	UpdateSliderInput(4, "bezierAngle2", 0, 360, "°");
	
	/*mohutnost konce*/
	UpdateSliderInput(5, "bezierLenght2", 1, 1000, "px");
	
	/*rozchod cislic*/
	UpdateSliderInput(6, "digitSpacing", 0, 4, "°");
	
	/*tloustka cary*/
	UpdateSliderInput(7, "lineThickness", 0, 10, "px");
	
	/*pocet cislic*/
	/*pouze cela cisla*/
	sliderValue = Math.round(document.getElementById("digitCount").value);

	tmp = /[0-9]+/i.exec(document.getElementById("digitCountTextbox").value);
	if (tmp !== null)
		textboxValue = Math.round(tmp[0]);
	else
		textboxValue = null;
	
	if (sliderValue !== inputs[8][1])
	{
		/*slider se meni*/
		inputs[8][0] = sliderValue;
		inputs[8][1] = sliderValue;
		inputs[8][2] = sliderValue;
		document.getElementById("digitCountTextbox").value = sliderValue.toString();	
	}
	else
	{
		if (textboxValue !== null && textboxValue >= 1)
		{
			if (textboxValue !== inputs[8][2])		
			{
				if (textboxValue > 1000)
				{
					inputs[8][0] = textboxValue;
					inputs[8][1] = 1000;
					inputs[8][2] = textboxValue;					
					document.getElementById("digitCount").value = (1000).toString();
				}
				else
				{
					inputs[8][0] = textboxValue;
					inputs[8][1] = textboxValue;
					inputs[8][2] = textboxValue;
					document.getElementById("digitCount").value = textboxValue.toString();
				}
			}
		}
	}
	
	/*checkbox vodici cara*/
	inputs[9][0] = document.getElementById("lineCheck").checked;
	
	/*dropdown michani*/
	inputs[10][0] = document.getElementById("blendingMode").options[document.getElementById("blendingMode").selectedIndex].text;
	
	/*velikost ukladaneho souboru*/
	UpdateSliderInput(11, "saveSize", 0.1, 5, "x");
	
	/*checkbox popis viditelny*/
	inputs[12][0] = document.getElementById("fontCheck").checked;
	
	/*checkbox popis naspod*/
	inputs[13][0] = document.getElementById("bottomCheck").checked;
	
	/*velikost pisma*/
	UpdateSliderInput(14, "fontSize", 0, 80, "px");
	
	/*dropdown prvni barva*/
	inputs[15][0] = document.getElementById("firstColor").options[document.getElementById("firstColor").selectedIndex].text;
	
	/*dropdown druha barva*/
	inputs[16][0] = document.getElementById("secondColor").options[document.getElementById("secondColor").selectedIndex].text;
	
	/*checkbox unikatni barvy cislic*/
	inputs[17][0] = document.getElementById("digitColorCheck").checked;
	/*tlacitko nahodnosti je vypnuto pokud neni zapla ahodna barva*/
	if (inputs[17][0] === false)
		document.getElementById("randomButton").disabled = true;
	else
		document.getElementById("randomButton").disabled = false;
	
	/*checkbox popis barva jako cislice*/
	inputs[18][0] = document.getElementById("fontColorCheck").checked;
	
	/*aktualni cislo*/
	tmp = /[0-9]+/i.exec(document.getElementById("inputNumberTextarea").value);
	if (tmp !== null)
		currentNumber = tmp[0];
	else
		curentNumber = [];	
}

/*pristupova funkce k jednotlivim inputum*/
function GetValue (id)
{
	if (id === "E-W")
	{
		return inputs[0][0];
	}
	else if (id === "E-H")
	{
		return inputs[1][0];
	}
	else if (id === "B-A1")
	{
		return inputs[2][0];
	}
	else if (id === "B-L1")
	{
		return inputs[3][0];
	}
	else if (id === "B-A2")
	{
		return inputs[4][0];
	}
	else if (id === "B-L2")
	{
		return inputs[5][0];
	}
	else if (id === "D-S")
	{
		return inputs[6][0];
	}
	else if (id === "L-T")
	{
		return inputs[7][0];
	}
	else if (id === "D-C")
	{
		return inputs[8][0];
	}
	else if (id === "L-C")
	{
		return inputs[9][0];
	}
	else if (id === "B-M")
	{
		return inputs[10][0];
	}
	else if (id === "S-S")
	{
		return inputs[11][0];
	}
	else if (id === "F-C")
	{
		return inputs[12][0];
	}
	else if (id === "B-C")
	{
		return inputs[13][0];
	}
	else if (id === "F-S")
	{
		return inputs[14][0];
	}
	else if (id === "F-Co")
	{
		return inputs[15][0];
	}
	else if (id === "S-Co")
	{
		return inputs[16][0];
	}
	else if (id === "DC-C")
	{
		return inputs[17][0];
	}
	else if (id === "FC-C")
	{
		return inputs[18][0];
	}
}

/*zadame uhel vuci stredu ve stupnich, funkce vrati souradnice bodu na elipse, ktery svira tento uhel*/
function CalculatePointOnEllipseFromAngle(angle, ellipseCenterX, ellipseCenterY)
{
	/*tangens v techto uhlech neni definovan*/
	if (angle%360 === 0)
	{		
		return [0+ellipseCenterX,-GetValue("E-H")/2+ellipseCenterY];
	}
	
	if (angle%360 === 180)
	{		
		return [0+ellipseCenterX,GetValue("E-H")/2+ellipseCenterY];
	}
	
	let a = GetValue("E-W")/2;
	let b = GetValue("E-H")/2;
	let slope = 1/Math.tan(angle*Math.PI/180);
	
	let x = Math.sqrt((a*a*b*b)/(a*a*slope*slope+b*b));
	let y = slope*x;
	
	/*pokud je uhel vetsi nez 180 - vracime invertovane souradnice*/
	if (angle%360 > 180)
	{		
		return [-x+ellipseCenterX,y+ellipseCenterY];
	}
	else
	{
		return [x+ellipseCenterX,-y+ellipseCenterY];
	}
}

/*funkce prevede (bod, uhel a mocnost) na (dva body) pro oba body bezierovy krivky - to potrebuje vykreslovaci funkce*/
function CalculateBezierCurvePointsFromLenghtAndAngle (x1, y1, angle1, length1, x2, y2, angle2, length2)
{	
	return [x1,y1,length1*Math.sin(angle1*Math.PI/180)+x1,-length1*Math.cos(angle1*Math.PI/180)+y1,length2*Math.sin(angle2*Math.PI/180)+x2,-length2*Math.cos(angle2*Math.PI/180)+y2,x2,y2];
}

/*vykresleni bezierovy krivky*/
function DrawBezierCurve(localContext, bezierPoints)
{	
	localContext.beginPath();
	localContext.moveTo(bezierPoints[0],bezierPoints[1]);
	localContext.bezierCurveTo(bezierPoints[2],bezierPoints[3],bezierPoints[4],bezierPoints[5],bezierPoints[6],bezierPoints[7]);
	localContext.stroke();
}

/*dekoduje barvu z nazvu*/
function DecodeColor(colorName)
{	
	if (colorName === "Červená")
	{
		return [255,0,0];
	}
	if (colorName === "Zelená")
	{
		return [0,255,0];
	}
	if (colorName === "Modrá")
	{
		return [0,0,255];
	}
	if (colorName === "Žlutá")
	{
		return [255,255,0];
	}if (colorName === "Azurová")
	{
		return [0,255,255];
	}
	if (colorName === "Purpurová")
	{
		return [255,0,255];
	}
	if (colorName === "Oranžová")
	{
		return [255,165,0];
	}
	if (colorName === "Hnědá")
	{
		return [160,82,45];
	}
	if (colorName === "Stříbrná")
	{
		return [192,192,192];
	}
	if (colorName === "Černá")
	{
		return [0,0,0];
	}
}

/*spocita barvu pokud je nastaven postupny gradient*/
function CalculateBlend(localContext, digitCount, i)
{
	let firstColor = DecodeColor(GetValue("F-Co"));
	let secondColor = DecodeColor(GetValue("S-Co"));
	
	localContext.strokeStyle = "rgb(" + (firstColor[0]+(secondColor[0]-firstColor[0])/digitCount*i).toString() + "," + (firstColor[1]+(secondColor[1]-firstColor[1])/digitCount*i).toString() + "," + (firstColor[2]+(secondColor[2]-firstColor[2])/digitCount*i).toString() + ")";
}

/*nastavi blending mode*/
function SetBlendMode(localContext)
{
	let blendModeSetting = GetValue("B-M");
	
	if (blendModeSetting === "BLEND")
	{
		localContext.globalCompositeOperation = "normal";		
	}
	else if (blendModeSetting === "DARKEST")
	{
		localContext.globalCompositeOperation = "darken";
	}
	else if (blendModeSetting === "LIGHTEST")
	{
		localContext.globalCompositeOperation = "lighten";
	}
	else if (blendModeSetting === "DIFFERENCE")
	{
		localContext.globalCompositeOperation = "difference";
	}
	else if (blendModeSetting === "EXCLUSION")
	{
		localContext.globalCompositeOperation = "exclusion";
	}
	else if (blendModeSetting === "SCREEN")
	{
		localContext.globalCompositeOperation = "screen";
	}
	else if (blendModeSetting === "OVERLAY")
	{
		localContext.globalCompositeOperation = "overlay";
	}
	else if (blendModeSetting === "HARD LIGHT")
	{
		localContext.globalCompositeOperation = "hard-light";
	}
	else if (blendModeSetting === "SOFT LIGHT")
	{
		localContext.globalCompositeOperation = "soft-light";
	}
	else if (blendModeSetting === "DODGE")
	{
		localContext.globalCompositeOperation = "color-dodge";
	}
	else if (blendModeSetting === "BURN")
	{
		localContext.globalCompositeOperation = "color-burn";
	}
	else if (blendModeSetting === "MULTIPLY")
	{
		localContext.globalCompositeOperation = "multiply";
	}	
}

/*zjisti barvu z nahodneho pole barev*/
function GenerateStrokeFromRandomArray(localContext, i)
{
	localContext.strokeStyle = "rgb(" + DecodeColor(colorOptions[Math.round(currentNumber[i])])[0].toString() + "," + DecodeColor(colorOptions[Math.round(currentNumber[i])])[1].toString() + "," + DecodeColor(colorOptions[Math.round(currentNumber[i])])[2].toString() + ")";
}

/*vykresleni vsech bezierovych krivek*/
function DrawBezierCurves(localContext)
{	
	//nastavime blend mode
	SetBlendMode(localContext);

	/*pokud uzivatel zadal vice cislic nez je k dispozici, vezmeme co nejvice*/
	let digitCount;
	
	if (GetValue("D-C") > currentNumber.length)
		digitCount = currentNumber.length;
	else
		digitCount = GetValue("D-C");
	
	/*pole pro ulozeni posunu na elipse pro vykresleni dalsi krivky*/
	let offsets = [0,0,0,0,0,0,0,0,0,0];
	
	/*vykreslujeme jednotlive krivky*/
	for (let i = 0; i < digitCount; i++)
	{
		/*zjistime na jakem uhlu ma byt umistena dalsi souradnice*/
		let startAngle = Math.round(currentNumber[i])*36+offsets[Math.round(currentNumber[i])];
		
		/*offset posouvame jen po startovni souradnici, tim padem krivky navazuji na sebe*/
		offsets[Math.round(currentNumber[i])] += GetValue("D-S");
		
		/*souradnice pocatecniho bodu krivky na elipse*/
		let start = CalculatePointOnEllipseFromAngle(startAngle, (startCanvasWidth/2), (startCanvasHeight/2));
		
		/*analogicky vypocitame souradnice koncoveho bodu*/
		let endAngle = Math.round(currentNumber[i+1])*36+offsets[Math.round(currentNumber[i+1])];
		let end = CalculatePointOnEllipseFromAngle(endAngle, (startCanvasWidth/2), (startCanvasHeight/2));

		/*z techto udaju dopocitame 4 souradnice, ktere definuji bezierovu krivku*/
		let bezierPoints = CalculateBezierCurvePointsFromLenghtAndAngle (start[0], start[1], GetValue("B-A1")+startAngle+180, GetValue("B-L1"), end[0], end[1], GetValue("B-A2")+endAngle+180,  GetValue("B-L2"));

		localContext.lineWidth = GetValue("L-T");
		
		if (GetValue("DC-C") === true)
		{
			GenerateStrokeFromRandomArray(localContext, i);
		}
		else
		{
			CalculateBlend(localContext, digitCount, i);
		}

		/*vykresleni krivky z ctyrech bodu*/
		DrawBezierCurve(localContext, bezierPoints);
	}
}

/*vykresli popisky*/
function DrawLabels(localContext)
{
	/*pro cislice 0 - 9*/
	for (let i = 0; i < 10; i++)
	{
		localContext.textAlign = "center";
		localContext.textBaseline = "middle";
		localContext.font = GetValue("F-S").toString() + "px Arial";
		
		if (GetValue("FC-C") === true && GetValue("DC-C") === true)
		{
			localContext.fillStyle = "rgb(" + DecodeColor(colorOptions[i])[0].toString() + "," + DecodeColor(colorOptions[i])[1].toString() + "," + DecodeColor(colorOptions[i])[2].toString() + ")";
		}
		else
		{
			localContext.fillStyle = "rgb(0,0,0)";
		}
		
		localContext.strokeStyle = "rgb(255,255,255)"
		localContext.lineWidth = 5;

		let ellipsePoint = CalculatePointOnEllipseFromAngle(36*i, (startCanvasWidth/2), (startCanvasHeight/2));
		localContext.strokeText(i.toString(), ellipsePoint[0]+(ellipsePoint[0]-(startCanvasWidth/2))*0.2 , ellipsePoint[1]+(ellipsePoint[1]-(startCanvasHeight/2))*0.2);
		localContext.fillText(i.toString(), ellipsePoint[0]+(ellipsePoint[0]-(startCanvasWidth/2))*0.2 , ellipsePoint[1]+(ellipsePoint[1]-(startCanvasHeight/2))*0.2);
	}	
}

/*vykresli scenu*/
function DrawScene(localContext)
{	
	localContext.strokeStyle = "rgb(0,0,0)";
	localContext.lineWidth = 1;

	/*vodici cara*/
	if (GetValue("L-C"))
	{
		localContext.beginPath();
		localContext.ellipse((startCanvasWidth/2), (startCanvasHeight/2), GetValue("E-W")/2, GetValue("E-H")/2, 0, 0, 2 * Math.PI);
		localContext.stroke();
	}

	/*popisky*/
	if (GetValue("F-C") === true && GetValue("B-C") === true)
		DrawLabels(localContext);
	
	/*krivky*/
	DrawBezierCurves(localContext);
	
	/*popisky*/
	if (GetValue("F-C") === true && GetValue("B-C") === false)
		DrawLabels(localContext);
}

let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

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

	//cary budou zaoblene
	context.lineCap = 'round';

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

	if (saveInProgress === true)
	{
		//zvetsime cely canvas na jediny frame

		//nastavime uzivatelovo zvetseni na aktualni
		canvasScale_Visualizer = canvasScale_Visualizer*GetValue("S-S");

		//aplikace transformace na canvas element i vykresleni
		canvas.width = startCanvasWidth*canvasScale_Visualizer;
		canvas.height = startCanvasHeight*canvasScale_Visualizer;
		canvasContext.transform(canvasScale_Visualizer, 0, 0, canvasScale_Visualizer, 0, 0);
	}

	//clear canvas
	//toto by se melo asi pozit vsude :D, ale tady to je kvuli tomu, aby se vyresetoval blending pro kazdy frame
	context.clearRect(0, 0, startCanvasWidth, startCanvasHeight);
    context.fillStyle = "rgb(255, 255, 255)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);

	/*stranka musi byt plne nactena*/
	if (pageLoaded === true)
	{
		UpdateInputs();
		DrawScene(context);		
	}

	if (saveInProgress === true)
	{
		//scena je vykreslena do zvetseneho canvasu

		//pridame dokumentu dummy link
		let link = document.createElement('a');
		//nastavime jmeno
		link.download = 'image.png';
		//odkaz na canvas data
		link.href = canvas.toDataURL().replace("image/png", "image/octet-stream");
		//simulace kliku
		link.click();

		//zruseni transformace pouzitim resize funkce
		ScaleCanvas_Visualizer();

		//v dalsim framu uz se ukladat nebude
		saveInProgress = false;
	}

    window.requestAnimationFrame(processLoop);
}




















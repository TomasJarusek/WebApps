//Ing. Tomas Jarusek, 11/2023

//vytvori slider a vlozi do divu, ktery je specifikovan pres ID, poskytuje funkci pro nastaveni a ziskani hodnoty slideru
//pokud prijde hodnota, ktera neni v rozmezi, nastavi hodnotu na minimum nebo maximum
function Slider(containerId, min, max, step, defaultValue)
{
	this.containerId = containerId;
	this.min = min;
	this.max = max;
	this.step = step;
	this.defaultValue = defaultValue;
	
	this.DOMReference;
	
	this.InsertIntoHtml = function()
	{
		let inputElement = document.createElement("input");
		
		inputElement.setAttribute("type", "range");
		inputElement.setAttribute("min", this.min);
		inputElement.setAttribute("max", this.max);
		inputElement.setAttribute("step", this.step);
		inputElement.setAttribute("value", this.defaultValue);
		inputElement.setAttribute("class", "slider");
		
		let sliderId = this.containerId+"Slider";
		inputElement.setAttribute("id", sliderId);
		
		document.getElementById(this.containerId).appendChild(inputElement);
		
		this.DOMReference = document.getElementById(sliderId);
	}
	
	this.InsertIntoHtml();
	
	this.GetValue = function()
	{
		return parseFloat(this.DOMReference.value);
	}
	
	this.SetValue = function(value)
	{
		if (value < this.min)
		{
			this.DOMReference.value = this.min;
		}
		else if (value > this.max)
		{
			this.DOMReference.value = this.max;
		}
		else
		{
			this.DOMReference.value = value;
		}		
	}
}

//analogicky
//vytvori texbox, nema omezeni pro vlozeni hodnoty
//pri dotazu an hodnotu vraci, prvni sekvenci znaku, co vypada jako float nebo int
//pokud neobsahuje cislo, vraci default value
function TextBox(containerId, defaultValue, valueSuffix)
{
	this.containerId = containerId;
	this.defaultValue = defaultValue.toString();
	this.valueSuffix = valueSuffix;
	
	this.DOMReference;
	
	this.InsertIntoHtml = function()
	{
		let inputElement = document.createElement("input");
		
		inputElement.setAttribute("type", "text");
		inputElement.setAttribute("value", this.defaultValue+this.valueSuffix);
		inputElement.setAttribute("class", "textBox");
		
		let textBoxId = this.containerId+"TextBox";
		inputElement.setAttribute("id", textBoxId);
		
		document.getElementById(this.containerId).appendChild(inputElement);
		
		this.DOMReference = document.getElementById(textBoxId);
	}
	
	this.InsertIntoHtml();
	
	this.GetValue = function()
	{	
		let value = /-?(([0-9]+.[0-9]+)|([0-9]+))/i.exec(this.DOMReference.value);
		
		if (value !== null)
		{
			return parseFloat(value);
		}
		else
		{
			return parseFloat(this.defaultValue);
		}
	}
	
	this.SetValue = function(value)
	{
		this.DOMReference.value = value.toString() + this.valueSuffix;	
	}
}

//analogicky
//vytvori texbox, ktery pracuje normalne se stringy, tento by asi mel byt defaultni :D
//pri dotazu an hodnotu vraci string ktery obsahuje
function TextBoxTextMode(containerId, defaultValue)
{
	this.containerId = containerId;
	this.defaultValue = defaultValue;
	
	this.DOMReference;
	
	this.InsertIntoHtml = function()
	{
		let inputElement = document.createElement("input");
		
		inputElement.setAttribute("type", "text");
		inputElement.setAttribute("value", this.defaultValue);
		inputElement.setAttribute("class", "textBoxTextMode");
		
		let textBoxId = this.containerId+"TextBoxTextMode";
		inputElement.setAttribute("id", textBoxId);
		
		document.getElementById(this.containerId).appendChild(inputElement);
		
		this.DOMReference = document.getElementById(textBoxId);
	}
	
	this.InsertIntoHtml();
	
	this.GetValue = function()
	{	
		return this.DOMReference.value;
	}
	
	this.SetValue = function(value)
	{
		this.DOMReference.value = value;	
	}
}

//anologicky
//vlozi nemenitelny text do html
function Description(containerId, descriptionString)
{
	this.containerId = containerId;
	this.descriptionString = descriptionString;
	
	this.DOMReference;
	
	this.InsertIntoHtml = function()
	{
		let inputElement = document.createElement("p");
		
		let descriptionId = this.containerId+"Description";
		inputElement.setAttribute("id", descriptionId);
		inputElement.setAttribute("class", "description");
		
		inputElement.textContent = descriptionString;
		document.getElementById(this.containerId).appendChild(inputElement);
		
		this.DOMReference = document.getElementById(descriptionId);
	}
	
	this.InsertIntoHtml();
}

//analogicky
//vytvori dropdown menu s danymy hodnotami
//dotaz na hodnotu vrati aktualni vyber
//nastaveni hodnoty zmeni aktualne vybranou polozku
function DropdownMenu(containerId, optionsList)
{
	this.containerId = containerId;
	this.optionsList = optionsList;
	
	this.DOMReference;
	
	this.InsertIntoHtml = function()
	{		
		let inputElement = document.createElement("select");
		
		let dropdownMenuId = this.containerId+"DropdownMenu";
		inputElement.setAttribute("id", dropdownMenuId);
		inputElement.setAttribute("class", "dropdownMenu");
		
		document.getElementById(this.containerId).appendChild(inputElement);
		
		this.DOMReference = document.getElementById(dropdownMenuId);
		
		let optionElement = document.createElement("option");
		optionElement.textContent = optionsList[0];
		optionElement.setAttribute("selected","");
		this.DOMReference.appendChild(optionElement);
		
		for (let i = 1; i < this.optionsList.length; i++)
		{
			optionElement = document.createElement("option");
			optionElement.textContent = optionsList[i];	
			this.DOMReference.appendChild(optionElement);
		}
	}
	
	this.InsertIntoHtml();
	
	this.GetValue = function()
	{
		return this.optionsList[this.DOMReference.selectedIndex];
	}
	
	this.SetValue = function(value)
	{
		for (let i = 1; i < this.optionsList.length; i++)
		{
			if (this.optionsList[i] === value)
			{
				this.DOMReference.options[this.DOMReference.selectedIndex].removeAttribute("selected");
				this.DOMReference.options[i].setAttribute("selected","");
				return;
			}
		}
	}
}

//analogicky
//vytvori tlacitko
//musime nastavit jmeno funkce, ktera se provede pri stisku
//obsahuje funkce na enable a disable tlacitka
function Button(containerId, functionName, insideText)
{
	this.containerId = containerId;
	this.functionName = functionName;
	this.insideText = insideText;
	
	this.DOMReference;
	
	this.InsertIntoHtml = function()
	{
		let inputElement = document.createElement("button");
		
		inputElement.setAttribute("onclick", this.functionName);
		inputElement.setAttribute("class", "button");
		inputElement.disabled = false;
		
		inputElement.textContent = this.insideText;
		
		let buttonId = this.containerId+"Button";
		inputElement.setAttribute("id", buttonId);
		
		document.getElementById(this.containerId).appendChild(inputElement);
		
		this.DOMReference = document.getElementById(buttonId);
	}
	
	this.InsertIntoHtml();
	
	this.Enable = function()
	{
		this.DOMReference.disabled = false;
	}
	
	this.Disable = function()
	{
		this.DOMReference.disabled = true;
	}
}

//analogicky jak normalni tlacitko
//vytvori dvoj tlacitko (dve vedle sebe)
//obsahuje funkce na enable a disable obou tlacitek
function DoubleButton(containerId, firstFunctionName, secondFunctionName, firstInsideText, secondInsideText)
{
	this.containerId = containerId;
	this.firstFunctionName = firstFunctionName;
	this.firstInsideText = firstInsideText;
	this.secondFunctionName = secondFunctionName;
	this.secondInsideText = secondInsideText;
	
	this.firstDOMReference;
	this.secondDOMReference;

	this.InsertIntoHtml = function()
	{
		let inputElement;
		let buttonId;
		

		inputElement = document.createElement("button");
		
		inputElement.setAttribute("onclick", this.firstFunctionName);
		inputElement.setAttribute("class", "button doubleButtonLeft");
		inputElement.disabled = false;
		
		inputElement.textContent = this.firstInsideText;
		
		buttonId = this.containerId+"DoubleButton1";
		inputElement.setAttribute("id", buttonId);
		
		document.getElementById(this.containerId).appendChild(inputElement);
		
		this.firstDOMReference = document.getElementById(buttonId);
		
		
		inputElement = document.createElement("button");
		
		inputElement.setAttribute("onclick", this.secondFunctionName);
		inputElement.setAttribute("class", "button doubleButtonRight");
		inputElement.disabled = false;
		
		inputElement.textContent = this.secondInsideText;
		
		buttonId = this.containerId+"DoubleButton2";
		inputElement.setAttribute("id", buttonId);
		
		document.getElementById(this.containerId).appendChild(inputElement);
		
		this.secondDOMReference = document.getElementById(buttonId);
	}
	
	this.InsertIntoHtml();
	
	this.EnableFirst = function()
	{
		this.firstDOMReference.disabled = false;
	}
	
	this.DisableFirst = function()
	{
		this.firstDOMReference.disabled = true;
	}
	
	this.EnableSecond = function()
	{
		this.secondDOMReference.disabled = false;
	}
	
	this.DisableSecond = function()
	{
		this.secondDOMReference.disabled = true;
	}

	this.Hide = function()
	{
		this.firstDOMReference.parentNode.setAttribute("style", "display: none");
	}

	this.Show = function()
	{
		this.firstDOMReference.parentNode.setAttribute("style", "");
	}
}

//tato trida spojuje description, slider a textBox
//vytvori je pod sebe
//hodnoty textboxu a slideru jsou sdileny
//pokud je hodnota textboxu mimo interval slideru, slider se nastavi na max nebo min
//jakmile se pohne se sliderem, hodnota textboxu se okamzite aktualizuje
//je nutno volat this.SynchronizeInputs() na zacatku kazdeho framu, coz udrzuje hodnoty synchronizovane
function CompleteInputBox (containerId, min, max, step, defaultValue, valueSuffix, descriptionString)
{
	this.containerId = containerId;
	this.DOMReference = document.getElementById(this.containerId);
	this.min = min;
	this.max = max;
	this.step = step;
	this.defaultValue = defaultValue;
	this.valueSuffix = valueSuffix;
	this.descriptionString = descriptionString;
	
	this.description;
	this.slider;
	this.textBox;
	
	this.sliderLastFrameValue = defaultValue;
	this.texboxLastFrameValue = defaultValue;
	this.value = defaultValue;
	
	this.InsertIntoHtml = function()
	{
		this.description = new Description(this.containerId, this.descriptionString);
		this.slider = new Slider(this.containerId, this.min, this.max, this.step, this.defaultValue);
		this.textBox = new TextBox(this.containerId, this.defaultValue, this.valueSuffix);
	}
	
	this.InsertIntoHtml();
	
	this.SynchronizeInputs = function()
	{
		let sliderValue = this.slider.GetValue();
		let textBoxValue = this.textBox.GetValue();

		if (textBoxValue !== this.texboxLastFrameValue)
		{
			this.texboxLastFrameValue = textBoxValue;
			this.slider.SetValue(textBoxValue);
			this.sliderLastFrameValue = this.slider.GetValue();
			this.value = textBoxValue;
		}
		else if (sliderValue !== this.sliderLastFrameValue)
		{
			this.sliderLastFrameValue = sliderValue;
			this.textBox.SetValue(sliderValue);
			this.value = sliderValue;
		}	
	}
	
	this.GetValue = function()
	{	
		return this.value;
	}
	
	this.SetValue = function(value)
	{
		this.textBox.SetValue(value);
		this.texboxLastFrameValue = value;
			
		this.slider.SetValue(value);
		this.sliderLastFrameValue = this.slider.GetValue();	
	}

	this.Hide = function()
	{
		this.DOMReference.setAttribute("style", "display: none");
	}

	this.Show = function()
	{
		this.DOMReference.setAttribute("style", "");
	}
}

//tato trida spojuje description a dropdown menu
//funkcionalita identicka s dropdown menu
function CompleteDropdownMenu(containerId, optionsList, descriptionString)
{
	this.containerId = containerId;
	this.optionsList = optionsList;
	this.descriptionString = descriptionString;
	
	this.InsertIntoHtml = function()
	{
		this.description = new Description(this.containerId, this.descriptionString);
		this.dropdownMenu = new DropdownMenu(this.containerId, this.optionsList);
	}
	
	this.InsertIntoHtml();
	
	this.GetValue = function()
	{	
		return this.dropdownMenu.GetValue();
	}
	
	this.SetValue = function(value)
	{
		this.dropdownMenu.SetValue(value);
	}	
}

//tato trida spojuje description a TextBoxTextMode
//funkcionalita identicka s TextBoxTextMode
function CompleteTextBoxTextMode(containerId, defaultValue, descriptionString)
{
	this.containerId = containerId;
	this.defaultValue = defaultValue;
	this.descriptionString = descriptionString;
	
	this.InsertIntoHtml = function()
	{
		this.description = new Description(this.containerId, this.descriptionString);
		this.textBoxTextMode = new TextBoxTextMode(this.containerId, this.defaultValue);
	}
	
	this.InsertIntoHtml();
	
	this.GetValue = function()
	{	
		return this.textBoxTextMode.GetValue();
	}
	
	this.SetValue = function(value)
	{
		this.textBoxTextMode.SetValue(value);
	}	
}

//vytvoreni jednoducheho on/off checkboxu
function Checkbox(containerId, startsChecked)
{
	this.containerId = containerId;
	this.startsChecked = startsChecked;
	
	this.DOMReference;
	
	this.InsertIntoHtml = function()
	{
		let inputElement = document.createElement("input");
		
		inputElement.setAttribute("type", "checkbox");
		
		if (this.startsChecked === true)
		{
			inputElement.setAttribute("checked", "");
		}
		
		inputElement.setAttribute("class", "checkbox");
		
		let checkboxId = this.containerId+"Checkbox";
		inputElement.setAttribute("id", checkboxId);
		
		document.getElementById(this.containerId).appendChild(inputElement);
		
		this.DOMReference = document.getElementById(checkboxId);
	}
	
	this.InsertIntoHtml();
	
	this.GetValue = function()
	{
		return this.DOMReference.checked;
	}
	
	this.SetValue = function(value)
	{
		if (value === true && this.DOMReference.checked !== true)
		{
			this.DOMReference.setAttribute("checked", "");
			return;
		}
		
		if (value === false && this.DOMReference.checked !== false)
		{
			this.DOMReference.removeAttribute("checked");	
			return;
		}	
	}
}

//dulezite - id html prvku prvku musi zacinat slovem checkbox - podle toho odlisujeme description u chceckboxu a normalni description
function CompleteCheckbox(containerId, startsChecked, descriptionString)
{
	this.containerId = containerId;
	this.startsChecked = startsChecked;
	this.descriptionString = descriptionString;
	
	this.DOMReference;
	
	this.InsertIntoHtml = function()
	{
		this.description = new Description(this.containerId, this.descriptionString);
		this.checkbox = new Checkbox(this.containerId, this.startsChecked);
	}
	
	this.InsertIntoHtml();
	
	this.GetValue = function()
	{
		return this.checkbox.GetValue();
	}
	
	this.SetValue = function(value)
	{
		return this.checkbox.SetValue(value);
	}
}

//vlozeni interaktivniho vstupniho sudoku do menu
//idea prevzata z https://codepen.io/sdobson/pen/aEWBQw
//jedna se o seznam (ul, li) ve forme mrize a NE tabulku (tr, td)
//kazda polozka seznamu pak obsahuje normalni input text box
function SudokuInput(containerId)
{
	this.containerId = containerId;
	
	this.DOMReferences = [[],[],[],[],[],[],[],[],[]];
	
	this.InsertIntoHtml = function()
	{
		let ulElement = document.createElement("ul");
		let liElement;
		
		for (let i = 0; i < 9; i++)
		{
			for (let j = 0; j < 9; j++)
			{
				liElement = document.createElement("li");
				
				let inputElement = document.createElement("input");
				
				inputElement.setAttribute("type", "text");
				//defaultni hodnota je prazdne pole
				inputElement.setAttribute("value", "");
				//v bunce muze byt jen jeden znak
				inputElement.setAttribute("maxlength", "1");
				inputElement.setAttribute("class", "sudokuCell");
				
				let textBoxId = this.containerId + "SudokuInput" + j.toString() + i.toString();
				inputElement.setAttribute("id", textBoxId);
				
				this.DOMReferences[j].push(inputElement);
							
				liElement.appendChild(inputElement);
				ulElement.appendChild(liElement);

			}	
		}
		
		document.getElementById(this.containerId).appendChild(ulElement);
	}
	
	this.InsertIntoHtml();
	
	this.GetValue = function()
	{	
		let value = [[],[],[],[],[],[],[],[],[]];
	
		let cellValue;
	
		for (let i = 0; i < 9; i++)
		{
			for (let j = 0; j < 9; j++)
			{
				cellValue = this.DOMReferences[j][i].value;
				 
				//berou se jen cisla, jinak prazdno
				if (cellValue === "1" || cellValue === "2" || cellValue === "3" ||
				    cellValue === "4" || cellValue === "5" || cellValue === "6" ||
				    cellValue === "7" || cellValue === "8" || cellValue === "9")
				{
					value[i].push(parseInt(cellValue));
				}
				else
				{
					value[i].push(0);
				}
			}
		}
	
		return value;
	}
	
	this.SetValue = function(value)
	{
		for (let i = 0; i < 9; i++)
		{
			for (let j = 0; j < 9; j++)
			{
				if (value[i][j] === 0)
				{
					this.DOMReferences[j][i].value = "";
				}
				else
				{
					this.DOMReferences[j][i].value = value[i][j].toString();
				}
			}
		}
	}
}






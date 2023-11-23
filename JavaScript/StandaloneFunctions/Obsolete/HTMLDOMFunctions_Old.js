//HTMLDOMFunctions
//Bc. Tomas Jarusek

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
		let value = /(([0-9]+.[0-9]+)|([0-9]+))/i.exec(this.DOMReference.value);
		
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
		this.DOMReference.value = value.toString()+this.valueSuffix;	
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

//tato trida spojuje description, slider a textBox
//vytvori je pod sebe
//hodnoty textboxu a slideru jsou sdileny
//pokud je hodnota textboxu mimo interval slideru, slider se nastavi na max nebo min
//jakmile se pohne se sliderem, hodnota textboxu se okamzite aktualizuje
//je nutno volat this.SynchronizeInputs() na zacatku kazdeho framu, coz udrzuje hodnoty synchronizovane
function CompleteInputBox (containerId, min, max, step, defaultValue, valueSuffix, descriptionString)
{
	this.containerId = containerId;
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
}

//tato trida spojuje decsription a dropdown menu
//funkciaonali identicka s dropdown menu
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



















































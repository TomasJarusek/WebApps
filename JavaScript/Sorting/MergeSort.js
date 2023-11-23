//Sorting algorithms
//Bc. Tomas Jarusek, 3/2019

//analogicky jak bubble sort
function MergeSort(elementArray)
{
	this.elementArray = elementArray;
	
	this.baseColor = [255,0,0];
	this.higlightColor = [0,0,255];
	
	this.sortFinished = false;
	
	this.leftStart = 0;
	this.mid;
	this.rightEnd;
	this.i = 0;
	this.j = 0;
	this.mergeArray = [];
	this.leftIndex;
	this.rightIndex;
	this.mergeSequenceLength = 1;
	
	this.sortState = 1;
		
	this.SortImmediately = function()
	{
		//trochu blbe jsem to pojmenoval.. :D mergeSequenceLength neni aktualni delka sekvence ke spojeni, je to delka jedne serazene poloviny
		for (this.mergeSequenceLength = this.mergeSequenceLength; this.mergeSequenceLength <= this.elementArray.length-1; this.mergeSequenceLength = this.mergeSequenceLength*2)
		{	
			console.log([this.mergeSequenceLength,this.leftStart]);
			for (this.leftStart = this.leftStart; this.leftStart <= this.elementArray.length-1; this.leftStart = this.leftStart + this.mergeSequenceLength*2)
			{	
				this.mid = this.leftStart+this.mergeSequenceLength-1;
				
				if (this.leftStart + this.mergeSequenceLength*2-1 <= this.elementArray.length-1)
				{
					this.rightEnd = this.leftStart + this.mergeSequenceLength*2-1;
					console.log(this.rightEnd, "B");
				}
				else
				{
					this.rightEnd = this.elementArray.length-1;
					console.log(this.rightEnd,"A");
				}

				//tohle cele implementuje merge funkci, musime ji vsak rozepsat, protoze chceme ve vnitr vizualizovat
				this.leftIndex = this.leftStart;
				this.rightIndex = this.mid+1;
				
				for (this.i = this.i; this.i < this.rightEnd-this.leftStart+1; this.i++)
				{								
					if (this.leftIndex > this.mid)
					{
						this.mergeArray.push(this.elementArray[this.rightIndex]);
						this.rightIndex++;
					}
					else if (this.rightIndex > this.rightEnd)
					{
						this.mergeArray.push(this.elementArray[this.leftIndex]);
						this.leftIndex++;
					}
					else
					{				
						if (this.elementArray[this.leftIndex][0] <= this.elementArray[this.rightIndex][0])
						{
							this.mergeArray.push(this.elementArray[this.leftIndex]);
							this.leftIndex++;
						}
						else
						{
							this.mergeArray.push(this.elementArray[this.rightIndex]);
							this.rightIndex++;
						}
					}
				}
				
				for (this.j = this.j; this.j < this.rightEnd-this.leftStart+1; this.j++)
				{
					this.elementArray[this.j+this.leftStart] = this.mergeArray[this.j];
				}
				//konec merge funkce
				
				this.i = 0;
				this.j = 0;
				this.mergeArray = [];
				//reset promennym merge funkce
			}
			
			this.leftStart = 0;
		}
		
		this.sortFinished = true;
	}

	//postup rozepsan v bubble sortu
	this.SortInSteps = function(stepsPerCall)
	{
		let i = 0;
		
		do
		{
			if (this.sortFinished)
			{
				return true;
			}
			else
			{
				if (this.sortState === 1)
				{
					this.sortState = this.SortStepOne();
				}
				else if (this.sortState === 2)
				{
					this.sortState = this.SortStepTwo();
				}
				else if (this.sortState === 3)
				{
					this.sortState = this.SortStepThree();
				}
			}
			
			i++;
		}
		while (i < stepsPerCall)
		
		return this.sortFinished;
	}
	
	this.SortStepOne = function()
	{	
		for (this.mergeSequenceLength = this.mergeSequenceLength; this.mergeSequenceLength <= this.elementArray.length-1; this.mergeSequenceLength = this.mergeSequenceLength*2)
		{
			for (this.leftStart = this.leftStart; this.leftStart <= this.elementArray.length-1; this.leftStart = this.leftStart + this.mergeSequenceLength*2)
			{
				this.mid = this.leftStart+this.mergeSequenceLength-1;
				
				if (this.leftStart + this.mergeSequenceLength*2-1 <= this.elementArray.length-1)
				{
					this.rightEnd = this.leftStart + this.mergeSequenceLength*2-1;
				}
				else
				{
					this.rightEnd = this.elementArray.length-1;
				}

				this.leftIndex = this.leftStart;
				this.rightIndex = this.mid+1;
				
				for (this.i = this.i; this.i < this.rightEnd-this.leftStart+1; this.i++)
				{
					//nastavujeme vizualizaci, je to komplikovany kvuli tomu, ze muzeme mergovat pole o nestejne delce, 
					//v takovem pripade nehybeme s obema indexi a to zohlednuje vizualizace
					if (this.leftIndex > this.mid)
						this.elementArray[this.mid][1] = this.higlightColor; 
					else
						this.elementArray[this.leftIndex][1] = this.higlightColor;
						
					if (this.rightIndex > this.rightEnd)
						this.elementArray[this.rightEnd][1] = this.higlightColor; 
					else
						this.elementArray[this.rightIndex][1] = this.higlightColor;
						
					return 2;
					
					//vraceni do puvodniho stavu
					if (this.leftIndex > this.mid)
						this.elementArray[this.mid][1] = this.baseColor; 
					else
						this.elementArray[this.leftIndex][1] = this.baseColor; 

					if (this.rightIndex > this.rightEnd)
						this.elementArray[this.rightEnd][1] = this.baseColor; 
					else
						this.elementArray[this.rightIndex][1] = this.baseColor;
						
					
					if (this.leftIndex > this.mid)
					{
						this.mergeArray.push(this.elementArray[this.rightIndex]);
						this.rightIndex++;
					}
					else if (this.rightIndex > this.rightEnd)
					{
						this.mergeArray.push(this.elementArray[this.leftIndex]);
						this.leftIndex++;
					}
					else
					{				
						if (this.elementArray[this.leftIndex][0] <= this.elementArray[this.rightIndex][0])
						{
							this.mergeArray.push(this.elementArray[this.leftIndex]);
							this.leftIndex++;
						}
						else
						{
							this.mergeArray.push(this.elementArray[this.rightIndex]);
							this.rightIndex++;
						}
					}
				}
				
				for (this.j = this.j; this.j < this.rightEnd-this.leftStart+1; this.j++)
				{
					//zde nic nezvyraznujeme, jen zobrazujeme stav
					this.elementArray[this.j+this.leftStart] = this.mergeArray[this.j];
					return 3;
				}
				
				this.i = 0;
				this.j = 0;
				this.mergeArray = [];
			}
			
			this.leftStart = 0;
		}	
		sortFinished = true;
	}
	
	this.SortStepTwo = function()
	{
		//rozvinuti 1
		if (this.leftIndex > this.mid)
			this.elementArray[this.mid][1] = this.baseColor; 
		else
			this.elementArray[this.leftIndex][1] = this.baseColor; 

		if (this.rightIndex > this.rightEnd)
			this.elementArray[this.rightEnd][1] = this.baseColor; 
		else
			this.elementArray[this.rightIndex][1] = this.baseColor;
										
		if (this.leftIndex > this.mid)
		{
			this.mergeArray.push(this.elementArray[this.rightIndex]);
			this.rightIndex++;
		}
		else if (this.rightIndex > this.rightEnd)
		{
			this.mergeArray.push(this.elementArray[this.leftIndex]);
			this.leftIndex++;
		}
		else
		{				
			if (this.elementArray[this.leftIndex][0] <= this.elementArray[this.rightIndex][0])
			{
				this.mergeArray.push(this.elementArray[this.leftIndex]);
				this.leftIndex++;
			}
			else
			{
				this.mergeArray.push(this.elementArray[this.rightIndex]);
				this.rightIndex++;
			}
		}
		this.i++
				
		//rozvinuti 2
		for (this.i = this.i; this.i < this.rightEnd-this.leftStart+1; this.i++)
		{
			if (this.leftIndex > this.mid)
				this.elementArray[this.mid][1] = this.higlightColor; 
			else
				this.elementArray[this.leftIndex][1] = this.higlightColor;
				
			if (this.rightIndex > this.rightEnd)
				this.elementArray[this.rightEnd][1] = this.higlightColor; 
			else
				this.elementArray[this.rightIndex][1] = this.higlightColor;
			
			return 2;
					
			if (this.leftIndex > this.mid)
				this.elementArray[this.mid][1] = this.baseColor; 
			else
				this.elementArray[this.leftIndex][1] = this.baseColor; 

			if (this.rightIndex > this.rightEnd)
				this.elementArray[this.rightEnd][1] = this.baseColor; 
			else
				this.elementArray[this.rightIndex][1] = this.baseColor;
										
			if (this.leftIndex > this.mid)
			{
				this.mergeArray.push(this.elementArray[this.rightIndex]);
				this.rightIndex++;
			}
			else if (this.rightIndex > this.rightEnd)
			{
				this.mergeArray.push(this.elementArray[this.leftIndex]);
				this.leftIndex++;
			}
			else
			{				
				if (this.elementArray[this.leftIndex][0] <= this.elementArray[this.rightIndex][0])
				{
					this.mergeArray.push(this.elementArray[this.leftIndex]);
					this.leftIndex++;
				}
				else
				{
					this.mergeArray.push(this.elementArray[this.rightIndex]);
					this.rightIndex++;
				}
			}
		}

		for (this.j = this.j; this.j < this.rightEnd-this.leftStart+1; this.j++)
		{
			this.elementArray[this.j+this.leftStart] = this.mergeArray[this.j];
			return 3;
		}			
	}
	
	this.SortStepThree = function()
	{
		//dokonceni 1
		this.j++;
	
		//rozvinuti 1
		for (this.j = this.j; this.j < this.rightEnd-this.leftStart+1; this.j++)
		{
			this.elementArray[this.j+this.leftStart] = this.mergeArray[this.j];
			return 3;
		}
		
		this.i = 0;
		this.j = 0;
		this.mergeArray = [];
	
		//inkrement 1
		this.leftStart = this.leftStart + this.mergeSequenceLength*2;
	
		//rozvinuti 2
		for (this.leftStart = this.leftStart; this.leftStart <= this.elementArray.length-1; this.leftStart = this.leftStart + this.mergeSequenceLength*2)
		{
			this.mid = this.leftStart+this.mergeSequenceLength-1;
				
			if (this.leftStart + this.mergeSequenceLength*2-1 <= this.elementArray.length-1)
			{
				this.rightEnd = this.leftStart + this.mergeSequenceLength*2-1;
			}
			else
			{
				this.rightEnd = this.elementArray.length-1;
			}

			this.leftIndex = this.leftStart;
			this.rightIndex = this.mid+1;
				
			for (this.i = this.i; this.i < this.rightEnd-this.leftStart+1; this.i++)
			{
					//vykresleni
				if (this.leftIndex > this.mid)
					this.elementArray[this.mid][1] = this.higlightColor; 
				else
					this.elementArray[this.leftIndex][1] = this.higlightColor;
						
				if (this.rightIndex > this.rightEnd)
					this.elementArray[this.rightEnd][1] = this.higlightColor; 
				else
					this.elementArray[this.rightIndex][1] = this.higlightColor;
					
				return 2;
				
				if (this.leftIndex > this.mid)
					this.elementArray[this.mid][1] = this.baseColor; 
				else
					this.elementArray[this.leftIndex][1] = this.baseColor; 

				if (this.rightIndex > this.rightEnd)
					this.elementArray[this.rightEnd][1] = this.baseColor; 
				else
					this.elementArray[this.rightIndex][1] = this.baseColor;
										
				if (this.leftIndex > this.mid)
				{
					this.mergeArray.push(this.elementArray[this.rightIndex]);
					this.rightIndex++;
				}
				else if (this.rightIndex > this.rightEnd)
				{
					this.mergeArray.push(this.elementArray[this.leftIndex]);
					this.leftIndex++;
				}
				else
				{				
					if (this.elementArray[this.leftIndex][0] <= this.elementArray[this.rightIndex][0])
					{
						this.mergeArray.push(this.elementArray[this.leftIndex]);
						this.leftIndex++;
					}
					else
					{
						this.mergeArray.push(this.elementArray[this.rightIndex]);
						this.rightIndex++;
					}
				}
			}
				
			for (this.j = this.j; this.j < this.rightEnd-this.leftStart+1; this.j++)
			{
				this.elementArray[this.j+this.leftStart] = this.mergeArray[this.j];
				return 3;
			}
				
			this.i = 0;
			this.j = 0;
			this.mergeArray = [];
		}
			
		this.leftStart = 0;
		
		
		//inrement 2
		this.mergeSequenceLength = this.mergeSequenceLength*2;
			
			
		//zpet do hlavniho algoritmu	
		for (this.mergeSequenceLength = this.mergeSequenceLength; this.mergeSequenceLength <= this.elementArray.length-1; this.mergeSequenceLength = this.mergeSequenceLength*2)
		{
			for (this.leftStart = this.leftStart; this.leftStart <= this.elementArray.length-1; this.leftStart = this.leftStart + this.mergeSequenceLength*2)
			{
				this.mid = this.leftStart+this.mergeSequenceLength-1;
				
				if (this.leftStart + this.mergeSequenceLength*2-1 <= this.elementArray.length-1)
				{
					this.rightEnd = this.leftStart + this.mergeSequenceLength*2-1;
				}
				else
				{
					this.rightEnd = this.elementArray.length-1;
				}

				this.leftIndex = this.leftStart;
				this.rightIndex = this.mid+1;
				
				for (this.i = this.i; this.i < this.rightEnd-this.leftStart+1; this.i++)
				{
					
					if (this.leftIndex > this.mid)
						this.elementArray[this.mid][1] = this.higlightColor; 
					else
						this.elementArray[this.leftIndex][1] = this.higlightColor;
						
					if (this.rightIndex > this.rightEnd)
						this.elementArray[this.rightEnd][1] = this.higlightColor; 
					else
						this.elementArray[this.rightIndex][1] = this.higlightColor;
					
					return 2;
					
					if (this.leftIndex > this.mid)
						this.elementArray[this.mid][1] = this.baseColor; 
					else
						this.elementArray[this.leftIndex][1] = this.baseColor; 

					if (this.rightIndex > this.rightEnd)
						this.elementArray[this.rightEnd][1] = this.baseColor; 
					else
						this.elementArray[this.rightIndex][1] = this.baseColor;
										
					if (this.leftIndex > this.mid)
					{
						this.mergeArray.push(this.elementArray[this.rightIndex]);
						this.rightIndex++;
					}
					else if (this.rightIndex > this.rightEnd)
					{
						this.mergeArray.push(this.elementArray[this.leftIndex]);
						this.leftIndex++;
					}
					else
					{				
						if (this.elementArray[this.leftIndex][0] <= this.elementArray[this.rightIndex][0])
						{
							this.mergeArray.push(this.elementArray[this.leftIndex]);
							this.leftIndex++;
						}
						else
						{
							this.mergeArray.push(this.elementArray[this.rightIndex]);
							this.rightIndex++;
						}
					}
				}
				
				for (this.j = this.j; this.j < this.rightEnd-this.leftStart+1; this.j++)
				{
					this.elementArray[this.j+this.leftStart] = this.mergeArray[this.j];
					return 3;
				}
				
				this.i = 0;
				this.j = 0;
				this.mergeArray = [];
			}
			
			this.leftStart = 0;
		}
		
		this.sortFinished = true;
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

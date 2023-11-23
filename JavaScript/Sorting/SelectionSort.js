//Sorting algorithms
//Bc. Tomas Jarusek, 3/2019

//analogicky jak bubble sort
function SelectionSort(elementArray)
{
	this.elementArray = elementArray;
	
	this.baseColor = [255,0,0];
	this.highlightColor = [0,0,255];
	
	this.sortFinished = false;
	
	this.i = 0;
	this.j = 0;
	this.currentMin;
	
	this.sortState = 1;
	
	this.Swap = function(firstIndex, secondIndex)
	{
		let tmp = this.elementArray[firstIndex];
		this.elementArray[firstIndex] = this.elementArray[secondIndex];
		this.elementArray[secondIndex] = tmp;
	}
	
	this.SortImmediately = function()
	{
		for (this.i = this.i; this.i < this.elementArray.length-1; this.i++)
		{
			this.currentMin = this.i;
			
			this.j = this.i+1;
			for (this.j = this.j; this.j < this.elementArray.length; this.j++)
			{
				if (this.elementArray[this.j][0] < this.elementArray[this.currentMin][0])
				{
					this.currentMin = this.j;
				}
			}
			
			this.Swap(this.currentMin,this.i);
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
			}
			
			i++;
		}
		while (i < stepsPerCall)
		
		return this.sortFinished;
	}
	
	this.SortStepOne = function()
	{	
		for (this.i = this.i; this.i < this.elementArray.length-1; this.i++)
		{
			this.currentMin = this.i;
			
			this.elementArray[this.currentMin][1] = this.highlightColor;
			
			this.j = this.i+1;
			
			for (this.j = this.j; this.j < this.elementArray.length; this.j++)
			{	
				this.elementArray[this.j][1] = this.highlightColor;
				return 2;
				this.elementArray[this.j][1] = this.baseColor;
								
				if (this.elementArray[this.j][0] < this.elementArray[this.currentMin][0])
				{
					this.elementArray[this.currentMin][1] = this.baseColor;
					this.currentMin = this.j;
					this.elementArray[this.currentMin][1] = this.highlightColor;
				}	
			}
			
			this.elementArray[this.currentMin][1] = this.baseColor;
			
			this.Swap(this.currentMin,this.i);
		}
		
		this.sortFinished = true;
	}
	
	this.SortStepTwo = function()
	{
		this.elementArray[this.j][1] = this.baseColor;
								
		if (this.elementArray[this.j][0] < this.elementArray[this.currentMin][0])
		{
			this.elementArray[this.currentMin][1] = this.baseColor;
			this.currentMin = this.j;
			this.elementArray[this.currentMin][1] = this.highlightColor;
		}

		this.j++;


		for (this.j = this.j; this.j < this.elementArray.length; this.j++)
		{
			this.elementArray[this.j][1] = this.highlightColor;
			return 2;
			this.elementArray[this.j][1] = this.baseColor;
								
			if (this.elementArray[this.j][0] < this.elementArray[this.currentMin][0])
			{
				this.elementArray[this.currentMin][1] = this.baseColor;
				this.currentMin = this.j;
				this.elementArray[this.currentMin][1] = this.highlightColor;
			}		
		}
			
		this.elementArray[this.currentMin][1] = this.baseColor;
			
		this.Swap(this.currentMin,this.i);
		
		this.i++;
	
	
		for (this.i = this.i; this.i < this.elementArray.length-1; this.i++)
		{
			this.currentMin = this.i;
			
			this.elementArray[this.currentMin][1] = this.highlightColor;
			
			this.j = this.i+1;
			
			for (this.j = this.j; this.j < this.elementArray.length; this.j++)
			{
				this.elementArray[this.j][1] = this.highlightColor;
				return 2;
				this.elementArray[this.j][1] = this.baseColor;
								
				if (this.elementArray[this.j][0] < this.elementArray[this.currentMin][0])
				{
					this.elementArray[this.currentMin][1] = this.baseColor;
					this.currentMin = this.j;
					this.elementArray[this.currentMin][1] = this.highlightColor;
				}		
			}
			
			this.elementArray[this.currentMin][1] = this.baseColor;
			
			this.Swap(this.currentMin,this.i);
		}
		
		this.sortFinished = true;
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

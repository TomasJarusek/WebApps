//Bc. Tomas Jarusek, 3/2019

//analogicky jak bubble sort
function InsertionSort(elementArray)
{
	this.elementArray = elementArray;
	
	this.baseColor = [255,0,0];
	this.highlightColor = [0,0,255];
	
	this.sortFinished = false;
	
	this.i = 1;
	this.j;
	this.key;
	
	this.sortState = 1;
	
	this.Swap = function(firstIndex, secondIndex)
	{
		let tmp = this.elementArray[firstIndex];
		this.elementArray[firstIndex] = this.elementArray[secondIndex];
		this.elementArray[secondIndex] = tmp;
	}
	
	this.SortImmediately = function()
	{
		for (this.i = this.i; this.i < this.elementArray.length; this.i++)
		{
			this.key = this.elementArray[this.i][0];
			
			this.j = this.i-1;
			
			while (this.j >= 0 && this.key < this.elementArray[this.j][0])
			{
				this.elementArray[this.j+1][0] = this.elementArray[this.j][0];
				this.j--;
			}
			
			this.elementArray[this.j+1][0] = this.key;		
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
		for (this.i = this.i; this.i < this.elementArray.length; this.i++)
		{
			this.key = this.elementArray[this.i][0];
			
			this.j = this.i-1;
			
			while (this.j >= 0 && this.key < this.elementArray[this.j][0])
			{
				this.elementArray[this.j][1] = this.highlightColor;
				return 2;
				this.elementArray[this.j][1] = this.baseColor;
				
				this.elementArray[this.j+1][0] = this.elementArray[this.j][0];
				this.j--;
			}
			
			this.elementArray[this.j+1][0] = this.key;
		}
		
		this.sortFinished = true;
	}
	
	this.SortStepTwo = function()
	{		
		this.elementArray[this.j][1] = this.baseColor;
				
		this.elementArray[this.j+1][0] = this.elementArray[this.j][0];
		this.j--;
		
		
		while (this.j >= 0 && this.key < this.elementArray[this.j][0])
		{
			this.elementArray[this.j][1] = this.highlightColor;
			return 2;
			this.elementArray[this.j][1] = this.baseColor;
				
			this.elementArray[this.j+1][0] = this.elementArray[this.j][0];
			this.j--;
		}
			
		this.elementArray[this.j+1][0] = this.key;
		
		this.i++;
		
		for (this.i = this.i; this.i < this.elementArray.length; this.i++)
		{
			this.key = this.elementArray[this.i][0];
			
			this.j = this.i-1;
			
			while (this.j >= 0 && this.key < this.elementArray[this.j][0])
			{
				this.elementArray[this.j][1] = this.highlightColor;
				return 2;
				this.elementArray[this.j][1] = this.baseColor;
				
				this.elementArray[this.j+1][0] = this.elementArray[this.j][0];
				this.j--;
			}
			
			this.elementArray[this.j+1][0] = this.key;
		}
		
		this.sortFinished = true;
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

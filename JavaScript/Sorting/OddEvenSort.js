//Sorting algorithms
//Bc. Tomas Jarusek, 3/2019

//analogicky jak bubble sort
function OddEvenSort(elementArray)
{
	this.elementArray = elementArray;
	
	this.baseColor = [255,0,0];
	this.highlightColor = [0,0,255];
	
	this.sortFinished = false;
	
	this.sorted = false;
	this.i;
	
	this.sortState = 1;
	
	this.Swap = function(firstIndex, secondIndex)
	{
		let tmp = this.elementArray[firstIndex][0];
		this.elementArray[firstIndex][0] = this.elementArray[secondIndex][0];
		this.elementArray[secondIndex][0] = tmp;
	}
	
	this.SortImmediately = function()
	{
		// https://en.wikipedia.org/wiki/Odd–even_sort

		while(!this.sorted)
		{
			this.sorted = true;
			this.i = 1;
			for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
			{
				if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i, this.i+1);
					this.sorted = false;
				}
			}
			
			this.i = 0;
			for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
			{
				if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i, this.i+1);
					this.sorted = false;
				}
			}
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
		while(!this.sorted)
		{
			this.sorted = true;
			this.i = 1;
			for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
			{
				this.elementArray[this.i][1] = this.highlightColor; 
				this.elementArray[this.i+1][1] = this.highlightColor; 
				return 2;
				this.elementArray[this.i][1] = this.baseColor; 
				this.elementArray[this.i+1][1] = this.baseColor;
				
				if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i, this.i+1);
					this.sorted = false;
				}
			}
			
			this.i = 0;
			for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
			{
				this.elementArray[this.i][1] = this.highlightColor; 
				this.elementArray[this.i+1][1] = this.highlightColor; 
				return 3;
				this.elementArray[this.i][1] = this.baseColor; 
				this.elementArray[this.i+1][1] = this.baseColor;
				
				if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i, this.i+1);
					this.sorted = false;
				}
			}
		}
		
		this.sortFinished = true;
	}
	
	this.SortStepTwo = function()
	{
		this.elementArray[this.i][1] = this.baseColor; 
		this.elementArray[this.i+1][1] = this.baseColor;
				
		if(this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
		{
			this.Swap(this.i, this.i+1);
			this.sorted = false;
		}
		
		this.i += 2;
		
		
		for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
		{
			this.elementArray[this.i][1] = this.highlightColor; 
			this.elementArray[this.i+1][1] = this.highlightColor; 
			return 2;
			this.elementArray[this.i][1] = this.baseColor; 
			this.elementArray[this.i+1][1] = this.baseColor;
				
			if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
			{
				this.Swap(this.i, this.i+1);
				this.sorted = false;
			}
		}
			
		this.i = 0;
		for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
		{
			this.elementArray[this.i][1] = this.highlightColor; 
			this.elementArray[this.i+1][1] = this.highlightColor; 
			return 3;
			this.elementArray[this.i][1] = this.baseColor; 
			this.elementArray[this.i+1][1] = this.baseColor;
			
			if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
			{
				this.Swap(this.i, this.i+1);
				this.sorted = false;
			}
		}
		
		
		while(!this.sorted)
		{
			this.sorted = true;
			this.i = 1;
			for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
			{
				this.elementArray[this.i][1] = this.highlightColor; 
				this.elementArray[this.i+1][1] = this.highlightColor; 
				return 2;
				this.elementArray[this.i][1] = this.baseColor; 
				this.elementArray[this.i+1][1] = this.baseColor;
				
				if(this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i, this.i+1);
					this.sorted = false;
				}
			}
			
			this.i = 0;
			for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
			{
				this.elementArray[this.i][1] = this.highlightColor; 
				this.elementArray[this.i+1][1] = this.highlightColor; 
				return 3;
				this.elementArray[this.i][1] = this.baseColor; 
				this.elementArray[this.i+1][1] = this.baseColor;
				
				if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i, this.i+1);
					this.sorted = false;
				}
			}
		}
		
		this.sortFinished = true;
	}
	
	this.SortStepThree = function()
	{
		this.elementArray[this.i][1] = this.baseColor; 
		this.elementArray[this.i+1][1] = this.baseColor;
				
		if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
		{
			this.Swap(this.i, this.i+1);
			this.sorted = false;
		}
		
		this.i += 2;
				
		for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
		{
			this.elementArray[this.i][1] = this.highlightColor; 
			this.elementArray[this.i+1][1] = this.highlightColor; 
			return 3;
			this.elementArray[this.i][1] = this.baseColor; 
			this.elementArray[this.i+1][1] = this.baseColor;
			
			if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
			{
				this.Swap(this.i, this.i+1);
				this.sorted = false;
			}
		}
		
		
		while(!this.sorted)
		{
			this.sorted = true;
			this.i = 1;
			for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
			{
				this.elementArray[this.i][1] = this.highlightColor; 
				this.elementArray[this.i+1][1] = this.highlightColor; 
				return 2;
				this.elementArray[this.i][1] = this.baseColor; 
				this.elementArray[this.i+1][1] = this.baseColor;
				
				if(this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i, this.i+1);
					this.sorted = false;
				}
			}
			
			this.i = 0;
			for(this.i = this.i; this.i < this.elementArray.length-1; this.i += 2)
			{
				this.elementArray[this.i][1] = this.highlightColor; 
				this.elementArray[this.i+1][1] = this.highlightColor; 
				return 3;
				this.elementArray[this.i][1] = this.baseColor; 
				this.elementArray[this.i+1][1] = this.baseColor;
					
				if(this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{				
					this.Swap(this.i, this.i+1);
					this.sorted = false;
				}
			}
		}
		
		this.sortFinished = true;
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

//Sorting algorithms
//Bc. Tomas Jarusek, 3/2019

//analogicky jak bubble sort
function QuickSort(elementArray)
{
	this.elementArray = elementArray;
	
	this.baseColor = [255,0,0];
	this.highlightColor = [0,0,255];
	
	this.sortFinished = false;
	
	this.stack = [];
	this.startingIndex = 0;
	this.endingIndex = this.elementArray.length-1;
	this.currentStartingIndex;
	this.currentEndingIndex;
	this.pivotPosition;
	this.i;
	this.x;
	this.j;
	
	this.sortState = 1;
	
	this.Swap = function(firstIndex, secondIndex)
	{
		let tmp = this.elementArray[firstIndex];
		this.elementArray[firstIndex] = this.elementArray[secondIndex];
		this.elementArray[secondIndex] = tmp;
	}
	
	this.SortImmediately = function()
	{
		this.stack.push(this.startingIndex);
		this.stack.push(this.endingIndex);
		
		while (this.stack.length !== 0)
		{
			this.currentEndingIndex = this.stack.pop();
			this.currentStartingIndex = this.stack.pop();
			
			
			//partition
			this.i = this.currentStartingIndex-1;
			this.x = this.elementArray[this.currentEndingIndex][0];
			
			this.j = this.currentStartingIndex;
			for (this.j = this.j; this.j < this.currentEndingIndex; this.j++)
			{	
				if (this.elementArray[this.j][0] <= this.x)
				{
					this.i++;
					
					this.Swap(this.j,this.i);
				}
			}
			
			this.Swap(this.i+1,this.currentEndingIndex);
			this.pivotPosition = this.i+1;
			//partition end
			
			
			if (this.pivotPosition-1 > this.currentStartingIndex)
			{
				this.stack.push(this.currentStartingIndex);
				this.stack.push(this.pivotPosition-1);
			}
			
			if (this.pivotPosition+1 < this.currentEndingIndex)
			{
				this.stack.push(this.pivotPosition+1);
				this.stack.push(this.currentEndingIndex);
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
			}
			
			i++;
		}
		while (i < stepsPerCall)
		
		return this.sortFinished;
	}
	
	this.SortStepOne = function()
	{	
		this.stack.push(this.startingIndex);
		this.stack.push(this.endingIndex);
		
		while (this.stack.length !== 0)
		{
			this.currentEndingIndex = this.stack.pop();
			this.currentStartingIndex = this.stack.pop();
			
			
			//partition
			this.i = this.currentStartingIndex-1;
			this.x = this.elementArray[this.currentEndingIndex][0];
			
			this.j = this.currentStartingIndex;
			for (this.j = this.j; this.j < this.currentEndingIndex; this.j++)
			{		
				this.elementArray[this.currentEndingIndex][1] = this.highlightColor;
				this.elementArray[this.j][1] = this.highlightColor;
				return 2;
				this.elementArray[this.currentEndingIndex][1] = this.baseColor;
				this.elementArray[this.j][1] = this.baseColor;
				
				if (this.elementArray[this.j][0] <= this.x)
				{
					this.i++;
					
					this.Swap(this.j,this.i);
				}
			}
			
			this.Swap(this.i+1,this.currentEndingIndex);
			this.pivotPosition = this.i+1;
			//partition end
			
			
			if (this.pivotPosition-1 > this.currentStartingIndex)
			{
				this.stack.push(this.currentStartingIndex);
				this.stack.push(this.pivotPosition-1);
			}
			
			if (this.pivotPosition+1 < this.currentEndingIndex)
			{
				this.stack.push(this.pivotPosition+1);
				this.stack.push(this.currentEndingIndex);
			}
		}
		
		this.sortFinished = true;
	}
	
	this.SortStepTwo = function()
	{		
		this.elementArray[this.currentEndingIndex][1] = this.baseColor;
		this.elementArray[this.j][1] = this.baseColor;
				
		if (this.elementArray[this.j][0] <= this.x)
		{
			this.i++;
			
			this.Swap(this.j,this.i);
		}
		
		this.j++;
		
		for (this.j = this.j; this.j < this.currentEndingIndex; this.j++)
		{
				
			this.elementArray[this.currentEndingIndex][1] = this.highlightColor;
			this.elementArray[this.j][1] = this.highlightColor;
			return 2;
			this.elementArray[this.currentEndingIndex][1] = this.baseColor;
			this.elementArray[this.j][1] = this.baseColor;
				
			if (this.elementArray[this.j][0] <= this.x)
			{
				this.i++;
					
				this.Swap(this.j,this.i);
			}
		}
			
		this.Swap(this.i+1,this.currentEndingIndex);
		this.pivotPosition = this.i+1;
		//partition end
			
			
		if (this.pivotPosition-1 > this.currentStartingIndex)
		{
			this.stack.push(this.currentStartingIndex);
			this.stack.push(this.pivotPosition-1);
		}
			
		if (this.pivotPosition+1 < this.currentEndingIndex)
		{
			this.stack.push(this.pivotPosition+1);
			this.stack.push(this.currentEndingIndex);
		}
		
		
		while (this.stack.length !== 0)
		{
			this.currentEndingIndex = this.stack.pop();
			this.currentStartingIndex = this.stack.pop();
			
			
			//partition
			this.i = this.currentStartingIndex-1;
			this.x = this.elementArray[this.currentEndingIndex][0];
			
			this.j = this.currentStartingIndex;
			for (this.j = this.j; this.j < this.currentEndingIndex; this.j++)
			{
				
				this.elementArray[this.currentEndingIndex][1] = this.highlightColor;
				this.elementArray[this.j][1] = this.highlightColor;
				return 2;
				this.elementArray[this.currentEndingIndex][1] = this.baseColor;
				this.elementArray[this.j][1] = this.baseColor;
				
				if (this.elementArray[this.j][0] <= this.x)
				{
					this.i++;
					
					this.Swap(this.j,this.i);
				}
			}
			
			this.Swap(this.i+1,this.currentEndingIndex);
			this.pivotPosition = this.i+1;
			//partition end
			
			
			if (this.pivotPosition-1 > this.currentStartingIndex)
			{
				this.stack.push(this.currentStartingIndex);
				this.stack.push(this.pivotPosition-1);
			}
			
			if (this.pivotPosition+1 < this.currentEndingIndex)
			{
				this.stack.push(this.pivotPosition+1);
				this.stack.push(this.currentEndingIndex);
			}
		}
		
		this.sortFinished = true;
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

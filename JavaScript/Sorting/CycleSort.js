//Bc. Tomas Jarusek, 3/2019

//analogicky jak bubble sort
function CycleSort(elementArray)
{
	this.elementArray = elementArray;
	
	this.baseColor = [255,0,0];
	this.highlightColor = [0,0,255];
	
	this.sortFinished = false;
	
	this.writes = 0;
	this.cycleStart = 0;
	this.item;
	this.pos;
	this.i;
	this.tmp;
	
	this.sortState = 1;
	
	this.SortImmediately = function()
	{
		// https://en.wikipedia.org/wiki/Cycle_sort
		
		// Loop through the array to find cycles to rotate.
		for (this.cycleStart = this.cycleStart; this.cycleStart < this.elementArray.length-1; this.cycleStart++)
		{	
			this.item = this.elementArray[this.cycleStart][0];
		
			// Find where to put the item.
			this.pos = this.cycleStart;
			this.i = this.cycleStart +1;
			for (this.i = this.i; this.i < this.elementArray.length; this.i++)
			{
				
				if (this.elementArray[this.i][0] < this.item)
				{
					this.pos++;
				}
			}
			
			// If the item is already there, this is not a cycle.
			if (this.pos == this.cycleStart)
			{
				continue; 
			}
				
			// Otherwise, put the item there or right after any duplicates.
			while (this.item === this.elementArray[this.pos][0])
			{
				this.pos++;
			}
			
			//swap
			this.tmp = this.elementArray[this.pos][0];
			this.elementArray[this.pos][0] = this.item;
			this.item = this.tmp;
			
			this.writes++;
			
			// Rotate the rest of the cycle.
			while (this.pos !== this.cycleStart)
			{
				// Find where to put the item.
				this.pos = this.cycleStart;
				this.i = this.cycleStart + 1;
				for (this.i = this.i; this.i < this.elementArray.length; this.i++)
				{
					if (this.elementArray[this.i][0] < this.item)
					{
						this.pos++;
					}
				}
				
				// Put the item there or right after any duplicates.
				while (this.item === this.elementArray[this.pos][0])
				{
					this.pos++;
				}
				
				//swap
				this.tmp = this.elementArray[this.pos][0];
				this.elementArray[this.pos][0] = this.item;
				this.item = this.tmp;
			
				this.writes++;	
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
		// Loop through the array to find cycles to rotate.
		for (this.cycleStart = this.cycleStart; this.cycleStart < this.elementArray.length-1; this.cycleStart++)
		{	
			this.item = this.elementArray[this.cycleStart][0];
		
			// Find where to put the item.
			this.pos = this.cycleStart;
			this.i = this.cycleStart +1;
			for (this.i = this.i; this.i < this.elementArray.length; this.i++)
			{		
				if (this.elementArray[this.i][0] < this.item)
				{
					this.pos++;
				}
			}
			
			// If the item is already there, this is not a cycle.
			if (this.pos == this.cycleStart)
			{
				continue; 
			}
				
			// Otherwise, put the item there or right after any duplicates.
			while (this.item === this.elementArray[this.pos][0])
			{
				this.pos++;
			}
			
			//swap
			this.tmp = this.elementArray[this.pos][0];
			this.elementArray[this.pos][0] = this.item;
			this.item = this.tmp;
			
			this.writes++;
			
			// Rotate the rest of the cycle.
			while (this.pos !== this.cycleStart)
			{
				// Find where to put the item.
				this.pos = this.cycleStart;
				this.i = this.cycleStart + 1;
				for (this.i = this.i; this.i < this.elementArray.length; this.i++)
				{
					this.elementArray[this.i][1] = this.highlightColor;
					return 2;
					this.elementArray[this.i][1] = this.baseColor;
					
					if (this.elementArray[this.i][0] < this.item)
					{
						this.pos++;
					}
				}
				
				// Put the item there or right after any duplicates.
				while (this.item === this.elementArray[this.pos][0])
				{
					this.pos++;
				}
				
				//swap
				this.tmp = this.elementArray[this.pos][0];
				this.elementArray[this.pos][0] = this.item;
				this.item = this.tmp;
			
				this.writes++;
			}
		}
		
		this.sortFinished = true;
	}
	
	this.SortStepTwo = function()
	{
		this.elementArray[this.i][1] = this.baseColor;
					
		if (this.elementArray[this.i][0] < this.item)
		{
			this.pos++;
		}
		
		this.i++;
		
		
		for (this.i = this.i; this.i < this.elementArray.length; this.i++)
		{
			this.elementArray[this.i][1] = this.highlightColor;
			return 2;
			this.elementArray[this.i][1] = this.baseColor;
					
			if (this.elementArray[this.i][0] < this.item)
			{
				this.pos++;
			}
		}
				
		// Put the item there or right after any duplicates.
		while (this.item === this.elementArray[this.pos][0])
		{
			this.pos++;
		}
				
		//swap
		this.tmp = this.elementArray[this.pos][0];
		this.elementArray[this.pos][0] = this.item;
		this.item = this.tmp;
			
		this.writes++;
		
		
		while (this.pos !== this.cycleStart)
		{
			// Find where to put the item.
			this.pos = this.cycleStart;
			this.i = this.cycleStart + 1;
			for (this.i = this.i; this.i < this.elementArray.length; this.i++)
			{
				this.elementArray[this.i][1] = this.highlightColor;
				return 2;
				this.elementArray[this.i][1] = this.baseColor;
					
				if (this.elementArray[this.i][0] < this.item)
				{
					this.pos++;
				}
			}
				
			// Put the item there or right after any duplicates.
			while (this.item === this.elementArray[this.pos][0])
			{
				this.pos++;
			}
				
			//swap
			this.tmp = this.elementArray[this.pos][0];
			this.elementArray[this.pos][0] = this.item;
			this.item = this.tmp;
			
			this.writes++;
		}
		
		
		this.cycleStart++;
		
		
		// Loop through the array to find cycles to rotate.
		for (this.cycleStart = this.cycleStart; this.cycleStart < this.elementArray.length-1; this.cycleStart++)
		{			
			this.item = this.elementArray[this.cycleStart][0];
		
			// Find where to put the item.
			this.pos = this.cycleStart;
			this.i = this.cycleStart +1;
			for (this.i = this.i; this.i < this.elementArray.length; this.i++)
			{		
				if (this.elementArray[this.i][0] < this.item)
				{
					this.pos++;
				}
			}
			
			// If the item is already there, this is not a cycle.
			if (this.pos == this.cycleStart)
			{
				continue; 
			}
				
			// Otherwise, put the item there or right after any duplicates.
			while (this.item === this.elementArray[this.pos][0])
			{
				this.pos++;
			}
			
			//swap
			this.tmp = this.elementArray[this.pos][0];
			this.elementArray[this.pos][0] = this.item;
			this.item = this.tmp;
			
			this.writes++;
			
			// Rotate the rest of the cycle.
			while (this.pos !== this.cycleStart)
			{
				// Find where to put the item.
				this.pos = this.cycleStart;
				this.i = this.cycleStart + 1;
				for (this.i = this.i; this.i < this.elementArray.length; this.i++)
				{
					this.elementArray[this.i][1] = this.highlightColor;
					return 2;
					this.elementArray[this.i][1] = this.baseColor;
					
					if (this.elementArray[this.i][0] < this.item)
					{
						this.pos++;
					}
				}
				
				// Put the item there or right after any duplicates.
				while (this.item === this.elementArray[this.pos][0])
				{
					this.pos++;
				}
				
				//swap
				this.tmp = this.elementArray[this.pos][0];
				this.elementArray[this.pos][0] = this.item;
				this.item = this.tmp;
			
				this.writes++;
			}
		}
		
		this.sortFinished = true;
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

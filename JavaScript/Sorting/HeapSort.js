//Sorting algorithms
//Bc. Tomas Jarusek, 3/2019

//analogicky jak bubble sort
function HeapSort(elementArray)
{
	this.elementArray = elementArray;
	
	this.baseColor = [255,0,0];
	this.highlightColor = [0,0,255];
	
	this.sortFinished = false;
	
	this.i = 1;
	this.j;
	this.index;
	
	this.sortState = 1;
	
	this.Swap = function(firstIndex, secondIndex)
	{
		let tmp = this.elementArray[firstIndex][0];
		this.elementArray[firstIndex][0] = this.elementArray[secondIndex][0];
		this.elementArray[secondIndex][0] = tmp;
	}
	
	this.SortImmediately = function()
	{
		// https://www.geeksforgeeks.org/iterative-heap-sort/
		
		// build Max Heap where value  
		// of each child is always smaller 
		// than value of their parent
		for (this.i = this.i; this.i < this.elementArray.length; this.i++)  
		{ 
			// if child is bigger than parent
			if (this.elementArray[this.i][0] > this.elementArray[Math.floor(Math.abs(((this.i - 1) / 2)))][0])  
			{ 
				this.j = this.i;
			  
				// swap child and parent until 
				// parent is smaller 
				while (this.elementArray[this.j][0] > this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][0])  
				{
					this.Swap(this.j,Math.floor(Math.abs((this.j - 1) / 2)));	
					this.j = Math.floor(Math.abs((this.j - 1) / 2)); 					
				} 
			} 
		}

		//sorting
		this.i = this.elementArray.length-1;
		for (this.i = this.i; this.i > 0; this.i--)  
		{
			// swap value of first indexed  
			// with last indexed  
			this.Swap(0,this.i);
			
			// maintaining heap property 
			// after each swapping 
			this.j = 0;
			  
			do
			{ 
				this.index = (2 * this.j + 1); 
				  
				// if left child is smaller than  
				// right child point index variable  
				// to right child 
				// console.log([this.index,this.index + 1]);
				if (this.index < (this.i - 1) && this.elementArray[this.index][0] < this.elementArray[this.index + 1][0] )
				{
					this.index++;
				}					
				
				// if parent is smaller than child  
				// then swapping parent with child  
				// having higher value 
				if (this.index < this.i && this.elementArray[this.j][0] < this.elementArray[this.index][0])
				{
					this.Swap(this.j,this.index); 
				}
				
				this.j = this.index;
			} 	
			while (this.index < this.i);
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
		while (i < stepsPerCall);
		
		return this.sortFinished;
	}
	
	this.SortStepOne = function()
	{	
		// build Max Heap where value  
		// of each child is always smaller 
		// than value of their parent
		for (this.i = this.i; this.i < this.elementArray.length; this.i++)  
		{ 
			// if child is bigger than parent
			if (this.elementArray[this.i][0] > this.elementArray[Math.floor(Math.abs(((this.i - 1) / 2)))][0])  
			{ 
				this.j = this.i;
			  
				// swap child and parent until 
				// parent is smaller 
				while (this.elementArray[this.j][0] > this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][0])  
				{
					this.elementArray[this.j][1] = this.highlightColor; 
					this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][1] = this.highlightColor; 
					return 2;
					this.elementArray[this.j][1] = this.baseColor; 
					this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][1] = this.baseColor;
					
					this.Swap(this.j,Math.floor(Math.abs((this.j - 1) / 2)));	
					this.j = Math.floor(Math.abs((this.j - 1) / 2)); 					
				} 
			} 
		}

		//sorting
		this.i = this.elementArray.length-1;
		for (this.i = this.i; this.i > 0; this.i--)  
		{
			// swap value of first indexed  
			// with last indexed  
			this.Swap(0,this.i);
			
			// maintaining heap property 
			// after each swapping 
			this.j = 0;
			  
			do
			{ 
				this.index = (2 * this.j + 1); 
				  
				// if left child is smaller than  
				// right child point index variable  
				// to right child 
				// console.log([this.index,this.index + 1]);
				if (this.index < (this.i - 1) && this.elementArray[this.index][0] < this.elementArray[this.index + 1][0] )
				{
					this.index++;
				}					
				
				// if parent is smaller than child  
				// then swapping parent with child  
				// having higher value 
				if (this.index < this.i && this.elementArray[this.j][0] < this.elementArray[this.index][0])
				{
					this.elementArray[this.j][1] = this.highlightColor; 
					this.elementArray[this.index][1] = this.highlightColor; 
					return 3;
					this.elementArray[this.j][1] = this.baseColor; 
					this.elementArray[this.index][1] = this.baseColor;
					
					this.Swap(this.j,this.index); 
				}
				
				this.j = this.index;
			} 	
			while (this.index < this.i);
		}
		
		this.sortFinished = true;
	}
	
	this.SortStepTwo = function()
	{
		this.elementArray[this.j][1] = this.baseColor; 
		this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][1] = this.baseColor;
					
		this.Swap(this.j,Math.floor(Math.abs((this.j - 1) / 2)));	
		this.j = Math.floor(Math.abs((this.j - 1) / 2));
		
		
		while (this.elementArray[this.j][0] > this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][0])  
		{
			this.elementArray[this.j][1] = this.highlightColor; 
			this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][1] = this.highlightColor; 
			return 2;
			this.elementArray[this.j][1] = this.baseColor; 
			this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][1] = this.baseColor;
					
			this.Swap(this.j,Math.floor(Math.abs((this.j - 1) / 2)));	
			this.j = Math.floor(Math.abs((this.j - 1) / 2)); 					
		}
		
		
		this.i++;
		
		
		// build Max Heap where value  
		// of each child is always smaller 
		// than value of their parent
		for (this.i = this.i; this.i < this.elementArray.length; this.i++)  
		{ 
			// if child is bigger than parent
			if (this.elementArray[this.i][0] > this.elementArray[Math.floor(Math.abs(((this.i - 1) / 2)))][0])  
			{ 
				this.j = this.i;
			  
				// swap child and parent until 
				// parent is smaller
				while (this.elementArray[this.j][0] > this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][0])  
				{
					this.elementArray[this.j][1] = this.highlightColor; 
					this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][1] = this.highlightColor; 
					return 2;
					this.elementArray[this.j][1] = this.baseColor; 
					this.elementArray[Math.floor(Math.abs((this.j - 1) / 2))][1] = this.baseColor;
					
					this.Swap(this.j,Math.floor(Math.abs((this.j - 1) / 2)));	
					this.j = Math.floor(Math.abs((this.j - 1) / 2)); 					
				} 
			} 
		}
		
		//sorting
		this.i = this.elementArray.length-1;
		for (this.i = this.i; this.i > 0; this.i--)  
		{
			// swap value of first indexed  
			// with last indexed  
			this.Swap(0,this.i);
			
			// maintaining heap property 
			// after each swapping 
			this.j = 0;
			  
			do
			{ 
				this.index = (2 * this.j + 1); 
				  
				// if left child is smaller than  
				// right child point index variable  
				// to right child 
				// console.log([this.index,this.index + 1]);
				if (this.index < (this.i - 1) && this.elementArray[this.index][0] < this.elementArray[this.index + 1][0] )
				{
					this.index++;
				}					
				
				// if parent is smaller than child  
				// then swapping parent with child  
				// having higher value 
				if (this.index < this.i && this.elementArray[this.j][0] < this.elementArray[this.index][0])
				{
					this.elementArray[this.j][1] = this.highlightColor; 
					this.elementArray[this.index][1] = this.highlightColor; 
					return 3;
					this.elementArray[this.j][1] = this.baseColor; 
					this.elementArray[this.index][1] = this.baseColor;
					
					this.Swap(this.j,this.index); 
				}
				
				this.j = this.index;
			} 	
			while (this.index < this.i);
		}
		
		this.sortFinished = true;
	}
	
	this.SortStepThree = function()
	{
		this.elementArray[this.j][1] = this.baseColor; 
		this.elementArray[this.index][1] = this.baseColor;
					
		this.Swap(this.j,this.index);
		
		this.j = this.index;
		
		if (this.index < this.i)
		{
			do
			{ 
				this.index = (2 * this.j + 1); 
				  
				// if left child is smaller than  
				// right child point index variable  
				// to right child 
				// console.log([this.index,this.index + 1]);
				if (this.index < (this.i - 1) && this.elementArray[this.index][0] < this.elementArray[this.index + 1][0] )
				{
					this.index++;
				}					
				
				// if parent is smaller than child  
				// then swapping parent with child  
				// having higher value 
				if (this.index < this.i && this.elementArray[this.j][0] < this.elementArray[this.index][0])
				{
					this.elementArray[this.j][1] = this.highlightColor; 
					this.elementArray[this.index][1] = this.highlightColor; 
					return 3;
					this.elementArray[this.j][1] = this.baseColor; 
					this.elementArray[this.index][1] = this.baseColor;
					
					this.Swap(this.j,this.index); 
				}
				
				this.j = this.index;
			} 	
			while (this.index < this.i);
		}
		
		
		this.i--;
		
		
		for (this.i = this.i; this.i > 0; this.i--)  
		{
			// swap value of first indexed  
			// with last indexed  
			this.Swap(0,this.i);
			
			// maintaining heap property 
			// after each swapping 
			this.j = 0;
			  
			do
			{ 
				this.index = (2 * this.j + 1); 
				  
				// if left child is smaller than  
				// right child point index variable  
				// to right child 
				// console.log([this.index,this.index + 1]);
				if (this.index < (this.i - 1) && this.elementArray[this.index][0] < this.elementArray[this.index + 1][0] )
				{
					this.index++;
				}					
				
				// if parent is smaller than child  
				// then swapping parent with child  
				// having higher value 
				if (this.index < this.i && this.elementArray[this.j][0] < this.elementArray[this.index][0])
				{
					this.elementArray[this.j][1] = this.highlightColor; 
					this.elementArray[this.index][1] = this.highlightColor; 
					return 3;
					this.elementArray[this.j][1] = this.baseColor; 
					this.elementArray[this.index][1] = this.baseColor;
					
					this.Swap(this.j,this.index); 
				}
				
				this.j = this.index;
			} 	
			while (this.index < this.i);
		}
		
		this.sortFinished = true;
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

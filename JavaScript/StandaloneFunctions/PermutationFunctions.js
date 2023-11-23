//PermutationFunctions
//Bc. Tomas Jarusek

function Factorial(number)
{
    let result = 1;
	
    for (let i = 2; i <= number; i++)
	{
		result = result*i;
	}
	
    return result;
}

// https://en.wikipedia.org/wiki/Heap%27s_algorithm
function Permutation(inputArray)
{
	//funguje slice?
	this.inputArray = inputArray.slice(0);
	this.permutationsArray = [];
	
	this.stackArray = [];
	this.size = inputArray.length;
	this.i = 0;
	this.state = 0;
	
	this.ReturnAllPermutationsAtOnceRecursive = function()
	{
		this.HeapPermutationRecursive(this.inputArray, this.inputArray.length);
		
		return this.permutationsArray;
	}
	
	this.ReturnAllPermutationsAtOnceIterative = function()
	{
		this.HeapPermutationIterative(this.inputArray.length, this.inputArray);
		
		return this.permutationsArray;
	}
	
	this.ReturnNextPermutation = function()
	{
		return this.HeapPermutationIterativeStep();
	}
	
	//modifikace iterativni verze, aby vracela vysledky po krocich, analogie k tomu, jak jsem to udelal v radicich algoritmech
	this.HeapPermutationIterativeStep = function()
	{
		if (this.state === 0)
		{
			this.stackArray = [];
		
			for (let i = 0; i < this.size; i++) 
			{
				this.stackArray[i] = 0;
			}

			this.state = 1;
			return this.inputArray.slice(0);
			
			while (this.i < this.size)
			{
				if (this.stackArray[i] < this.i)
				{
					if (this.i % 2 === 0) 
					{ 
						let tmp = this.inputArray[0]; 
						this.inputArray[0] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					} 
					else
					{
						let tmp = this.inputArray[this.stackArray[this.i]]; 
						this.inputArray[this.stackArray[this.i]] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					}

					return this.inputArray.slice(0);

					this.stackArray[this.i]++;
					this.i = 0;
				}
				else
				{
					this.stackArray[this.i] = 0;
					this.i++;
				}
			}
			
			return null;
		}
		else if (this.state === 1)
		{
			while (this.i < this.size)
			{
				if (this.stackArray[this.i] < this.i)
				{
					if (this.i % 2 === 0) 
					{ 
						let tmp = this.inputArray[0]; 
						this.inputArray[0] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					} 
					else
					{
						let tmp = this.inputArray[this.stackArray[this.i]]; 
						this.inputArray[this.stackArray[this.i]] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					}

					this.state = 2;
					return this.inputArray.slice(0);

					this.stackArray[this.i]++;
					this.i = 0;
				}
				else
				{
					this.stackArray[this.i] = 0;
					this.i++;
				}
			}
			
			return null;
		}
		else
		{
			this.stackArray[this.i]++;
			this.i = 0;

			while (this.i < this.size)
			{
				if (this.stackArray[this.i] < this.i)
				{
					if (this.i % 2 === 0) 
					{ 
						let tmp = this.inputArray[0]; 
						this.inputArray[0] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					} 
					else
					{
						let tmp = this.inputArray[this.stackArray[this.i]]; 
						this.inputArray[this.stackArray[this.i]] = this.inputArray[this.i]; 
						this.inputArray[this.i] = tmp; 
					}

					this.state = 2;
					return this.inputArray.slice(0);

					this.stackArray[this.i]++;
					this.i = 0;
				}
				else
				{
					this.stackArray[this.i] = 0;
					this.i++;
				}
			}
			
			return null;
		}
	}
	
	//iterativni verze
	this.HeapPermutationIterative = function(size, array)
	{
		stack = [];

		for (let i = 0; i < size; i++) 
		{
			stack[i] = 0;
		}

		this.permutationsArray.push(array.slice(0));

		let i = 0;
		while (i < size)
		{
			if (stack[i] < i)
			{
				if (i % 2 === 0) 
				{ 
					let tmp = array[0]; 
					array[0] = array[i]; 
					array[i] = tmp; 
				} 
				else
				{
					let tmp = array[stack[i]]; 
					array[stack[i]] = array[i]; 
					array[i] = tmp; 
				}

				this.permutationsArray.push(array.slice(0));

				stack[i]++;
				i = 0;
			}
			else
			{
				stack[i] = 0;
				i++;
			}
		}
	}
	
	// Heap's algorithm 
	this.HeapPermutationRecursive = function(array, size)
	{
		if (size === 1) 
		{
			this.permutationsArray.push(array.slice(0));
			return;
		}
		
		this.HeapPermutationRecursive(array, size-1);
		
		for (let i = 0; i < size-1; i++) 
		{ 
			// if size is odd, swap first and last element 
			if (size % 2 === 1) 
			{ 
				let tmp = array[0]; 
				array[0] = array[size-1]; 
				array[size-1] = tmp; 
			} 
			// If size is even, swap ith and last element 
			else
			{
				let tmp = array[i]; 
				array[i] = array[size-1]; 
				array[size-1] = tmp; 
			}
			
			this.HeapPermutationRecursive(array, size-1); 
		}
	}
}





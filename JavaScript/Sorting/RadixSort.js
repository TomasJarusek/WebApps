//Sorting algorithms
//Bc. Tomas Jarusek, 3/2019

//analogicky jak bubble sort
//muzeme menit zaklad
function RadixSort(elementArray, radix)
{
	this.elementArray = elementArray;
	
	this.baseColor = [255,0,0];
	this.highlightColor = [0,0,255];
	
	this.sortFinished = false;

	this.minValue = this.elementArray[0];
	this.maxValue = this.elementArray[0];
	this.i = 1;
	this.exponent = 1;
	this.radix = radix;
	this.bucketIndex;
	this.buckets = new Array(this.radix);
	this.output = new Array(this.elementArray.length);
	
	this.sortState = 1;
	
	this.ConvertArrayToFiveDigitIntegers = function(largestElementInArray)
	{
		let precision;
		
		//spocitame, kolik cislic ma nejvyssi prvek v poli
		//podle toho vypocitame precision konstantu, pomoci ktere nasledne vynasobime pole
		//to nam nastavi vsechny hodnoty na peticislicove
		if (Math.ceil(Math.log(largestElementInArray)/Math.log(10)) < 5)
		{
			precision = Math.pow(10,(5-Math.ceil(Math.log(largestElementInArray)/Math.log(10))));
		}
		else
		{
			precision = Math.pow(10,(-1*(Math.ceil(Math.log(largestElementInArray)/Math.log(10))-5)));
		}

		//pronasobime cele pole precision konstatntou a zaokrouhlime -> cela peticisliove cisla
		for (let i = 0; i < this.elementArray.length; i++)
		{
			this.elementArray[i][0] = Math.round(this.elementArray[i][0]*precision);
		}
		
		//nesmime zapomenout upravit hodnotu nejvyssiho prvku v poli
		return Math.round(largestElementInArray*precision);
	}
	
	this.SortImmediately = function()
	{
		// https://www.growingwiththeweb.com/sorting/radix-sort-lsd/
		
		if (this.elementArray.length === 0) 
		{
			this.sortFinished = true
			return;
		}
		
		// Determine minimum and maximum values
        for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
		{
            if (this.elementArray[this.i][0] < this.minValue[0]) 
			{
                this.minValue = this.elementArray[this.i];
            } 
			else if (this.elementArray[this.i][0] > this.maxValue[0]) 
			{
                this.maxValue = this.elementArray[this.i];
            }
        }

        // Perform counting sort on each exponent/digit, starting at the least
        // significant digit
        while ((this.maxValue[0] - this.minValue[0]) / this.exponent >= 1) 
		{
			//Tohle by mohla byt funkce, je to zde ale rozvinuto kvuli vykresleni
			
			// Initialize bucket
			this.i = 0;
			for (this.i = this.i; this.i < this.radix; this.i++) 
			{
				this.buckets[this.i] = 0;
			}

			// Count frequencies
			this.i = 0; 
			for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
			{
				this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
				this.buckets[this.bucketIndex]++;
			}

			// Compute cumulates
			this.i = 1; 
			for (this.i = this.i; this.i < this.radix; this.i++) 
			{
				this.buckets[this.i] += this.buckets[this.i - 1];
			}

			// Move records
			this.i = this.elementArray.length - 1;
			for (this.i = this.i; this.i >= 0; this.i--) 
			{
				this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
				this.output[--this.buckets[this.bucketIndex]] = this.elementArray[this.i];
			}

			// Copy back
			this.i = 0;
			for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
			{
				this.elementArray[this.i] = this.output[this.i];
			}
			
            this.exponent *= this.radix;
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
		if (this.elementArray.length === 0) 
		{
			this.sortFinished = true
			return;
		}
		
		// Determine minimum and maximum values
        for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
		{
            if (this.elementArray[this.i][0] < this.minValue[0]) 
			{
                this.minValue = this.elementArray[this.i];
            } 
			else if (this.elementArray[this.i][0] > this.maxValue[0]) 
			{
                this.maxValue = this.elementArray[this.i];
            }
        }

        // Perform counting sort on each exponent/digit, starting at the least
        // significant digit
        while ((this.maxValue[0] - this.minValue[0]) / this.exponent >= 1) 
		{
			// Initialize bucket
			this.i = 0;
			for (this.i = this.i; this.i < this.radix; this.i++) 
			{
				this.buckets[this.i] = 0;
			}

			// Count frequencies
			this.i = 0; 
			for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
			{
				this.elementArray[this.i][1] = this.highlightColor;
				return 2;
				this.elementArray[this.i][1] = this.baseColor;
				
				this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
				this.buckets[this.bucketIndex]++;
			}

			// Compute cumulates
			this.i = 1; 
			for (this.i = this.i; this.i < this.radix; this.i++) 
			{
				this.buckets[this.i] += this.buckets[this.i - 1];
			}

			// Move records
			this.i = this.elementArray.length - 1;
			for (this.i = this.i; this.i >= 0; this.i--) 
			{
				this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
				this.output[--this.buckets[this.bucketIndex]] = this.elementArray[this.i];
			}

			// Copy back
			this.i = 0;
			for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
			{
				return 3;
				this.elementArray[this.i] = this.output[this.i];
			}
			
            this.exponent *= this.radix;
        }
		
		this.sortFinished = true;
	}
	
	this.SortStepTwo = function()
	{
		this.elementArray[this.i][1] = this.baseColor;
				
		this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
		this.buckets[this.bucketIndex]++;
				
		this.i++		
				
				
		for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
		{
			this.elementArray[this.i][1] = this.highlightColor;
			return 2;
			this.elementArray[this.i][1] = this.baseColor;
				
			this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
			this.buckets[this.bucketIndex]++;
		}

		// Compute cumulates
		this.i = 1; 
		for (this.i = this.i; this.i < this.radix; this.i++) 
		{
			this.buckets[this.i] += this.buckets[this.i - 1];
		}

		// Move records
		this.i = this.elementArray.length - 1;
		for (this.i = this.i; this.i >= 0; this.i--) 
		{
			this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
			this.output[--this.buckets[this.bucketIndex]] = this.elementArray[this.i];
		}

		// Copy back
		this.i = 0;
		for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
		{
			return 3;
			this.elementArray[this.i] = this.output[this.i];
		}
		
		
		this.exponent *= this.radix;
		
		
		while ((this.maxValue[0] - this.minValue[0]) / this.exponent >= 1) 
		{
			// Initialize bucket
			this.i = 0;
			for (this.i = this.i; this.i < this.radix; this.i++) 
			{
				this.buckets[this.i] = 0;
			}

			// Count frequencies
			this.i = 0; 
			for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
			{
				this.elementArray[this.i][1] = this.highlightColor;
				return 2;
				this.elementArray[this.i][1] = this.baseColor;
				
				this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
				this.buckets[this.bucketIndex]++;
			}

			// Compute cumulates
			this.i = 1; 
			for (this.i = this.i; this.i < this.radix; this.i++) 
			{
				this.buckets[this.i] += this.buckets[this.i - 1];
			}

			// Move records
			this.i = this.elementArray.length - 1;
			for (this.i = this.i; this.i >= 0; this.i--) 
			{
				this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
				this.output[--this.buckets[this.bucketIndex]] = this.elementArray[this.i];
			}

			// Copy back
			this.i = 0;
			for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
			{
				return 3;
				this.elementArray[this.i] = this.output[this.i];
			}
			
            this.exponent *= this.radix;
        }
		
		this.sortFinished = true;
	}
	
	this.SortStepThree = function()
	{
		this.elementArray[this.i] = this.output[this.i];
		
		
		this.i++;
		
		
		for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
		{
			return 3;
			this.elementArray[this.i] = this.output[this.i];
		}
		
		
		this.exponent *= this.radix;
		
		
		while ((this.maxValue[0] - this.minValue[0]) / this.exponent >= 1) 
		{
			// Initialize bucket
			this.i = 0;
			for (this.i = this.i; this.i < this.radix; this.i++) 
			{
				this.buckets[this.i] = 0;
			}

			// Count frequencies
			this.i = 0; 
			for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
			{
				this.elementArray[this.i][1] = this.highlightColor;
				return 2;
				this.elementArray[this.i][1] = this.baseColor;
				
				this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
				this.buckets[this.bucketIndex]++;
			}

			// Compute cumulates
			this.i = 1; 
			for (this.i = this.i; this.i < this.radix; this.i++) 
			{
				this.buckets[this.i] += this.buckets[this.i - 1];
			}

			// Move records
			this.i = this.elementArray.length - 1;
			for (this.i = this.i; this.i >= 0; this.i--) 
			{
				this.bucketIndex = Math.floor(((this.elementArray[this.i][0] - this.minValue[0]) / this.exponent) % this.radix);
				this.output[--this.buckets[this.bucketIndex]] = this.elementArray[this.i];
			}

			// Copy back
			this.i = 0;
			for (this.i = this.i; this.i < this.elementArray.length; this.i++) 
			{
				return 3;
				this.elementArray[this.i] = this.output[this.i];
			}
			
            this.exponent *= this.radix;
        }
		
		this.sortFinished = true;
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

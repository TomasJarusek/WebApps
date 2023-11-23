//Sorting algorithms
//Bc. Tomas Jarusek, 3/2019

//razeni bubble sort
function BubbleSort(elementArray)
{
	//odkaz na pole, ktere se bude tridit
	this.elementArray = elementArray;
	
	//barvy pro pozdejsi vykresleni
	this.baseColor = [255,0,0];
	this.higlightColor = [0,0,255];
	
	//je razeni dokonceno?
	this.sortFinished = false;
	
	//promenne pro aloritmus, uchovavaji se zde, aby se neresetovali pri kazdem volani
	this.sorted = false;
	this.n = this.elementArray.length;
	this.i = 0;
	
	//pocatecni stav pro SortInSteps()
	this.sortState = 1;
	
	//prohodi dva prvky
	this.Swap = function(firstIndex, secondIndex)
	{
		let tmp = this.elementArray[firstIndex][0];
		this.elementArray[firstIndex][0] = this.elementArray[secondIndex][0];
		this.elementArray[secondIndex][0] = tmp;
	}
	
	//tahle funkce seradi okamzite, v aktualnim programu slouzi pouze jako template pro tvorbu krokove verze
	this.SortImmediately = function()
	{
		do
		{
			this.sorted = true;
			this.n = this.n - 1;
			
			for (this.i = this.i; this.i < this.n; this.i++)
			{			
				if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i,this.i+1);
					
					this.sorted = false;
				}
			}
			
			this.i = 0;
		}
		while(this.sorted === false || this.n === 1)
			
		this.sortFinished = true;
	}
	
	//tahle funkce vola jednotlive kroky algoritmu tolikrat, kolikrat je specifikovano prommennou
	this.SortInSteps = function(stepsPerCall)
	{
		let i = 0;
		
		do
		{
			//pokud je razeni hotove, koncime predcasne
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
		
		//prosli jsme zadany pocet a cyklu a vracime, zda je sort hotov nebo ne
		return this.sortFinished;
	}
	
	//JAK TVORIME STEP ALGORITMUS?
	//1.zadna rekurze ani funkce, vsechny promene globalni
	//2.vlozime kod okamziteho razeni a na mista, kde se ma krok ukoncit vlozime return 1(1-oznacuje bod kde jsme skoncili a kam se mame vratit)(a taky vlozime nejakou vizualizaci)
	//3.pri vraceni zpet na misto, kdyz se return nachazi v cyklech, musime vsechny rucne rozvinout, RUCNE INREMENTOVAT ITERATOR CYKLU, nez se muzeme vratit do normaliho radiciho algoritmu
	//nemusime vzdy opisovat vse, zde je to vsak vsechno prepsano pro jasnost
	
	//prvni krok se provede jen jednou pri startu
	this.SortStepOne = function()
	{
		do
		{
			this.sorted = true;
			this.n = this.n - 1;
			
			for (this.i = this.i; this.i < this.n; this.i++)
			{	
				//nastaveni vizualizace
				this.elementArray[this.i][1] = this.higlightColor; 
				this.elementArray[this.i+1][1] = this.higlightColor; 
				return 2;
				//vraceni do puodniho stavu
				this.elementArray[this.i][1] = this.baseColor; 
				this.elementArray[this.i+1][1] = this.baseColor;
				
				if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i,this.i+1);
					
					this.sorted = false;
				}
			}
			
			this.i = 0;
		}
		while(this.sorted === false || this.n === 1)
			
		sortFinished = true;
	}
	
	//druhy krok
	this.SortStepTwo = function()
	{
		//rozvinuti vnitrniho cyklu
		this.elementArray[this.i][1] = this.baseColor; 
		this.elementArray[this.i+1][1] = this.baseColor;
				
		if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
		{
			this.Swap(this.i,this.i+1);
			
			this.sorted = false;
		}
		//inkrementace iteratoru
		this.i++;
	
		//ted jsme zpet na zacatku vnitrniho cyklu
		for (this.i = this.i; this.i < this.n; this.i++)
		{	
			this.elementArray[this.i][1] = this.higlightColor; 
			this.elementArray[this.i+1][1] = this.higlightColor; 
			return 2;
			this.elementArray[this.i][1] = this.baseColor; 
			this.elementArray[this.i+1][1] = this.baseColor;
				
			if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
			{
				this.Swap(this.i,this.i+1);
					
				this.sorted = false;
			}
		}
		this.i = 0;
		//zde nic neinkrementujeme, protoze je zde do while a to se vzdy provede alespon jednou
	
		//ted jsme se vratily zpet do normalniho algoritmu
		do
		{
			this.sorted = true;
			this.n = this.n - 1;
			
			for (this.i = this.i; this.i < this.n; this.i++)
			{	
				this.elementArray[this.i][1] = this.higlightColor; 
				this.elementArray[this.i+1][1] = this.higlightColor; 
				return 2;
				this.elementArray[this.i][1] = this.baseColor; 
				this.elementArray[this.i+1][1] = this.baseColor;
				
				if (this.elementArray[this.i][0] > this.elementArray[this.i+1][0])
				{
					this.Swap(this.i,this.i+1);
					
					this.sorted = false;
				}
			}
			
			this.i = 0;
		}
		while(this.sorted === false || this.n === 1)
			
		this.sortFinished = true;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
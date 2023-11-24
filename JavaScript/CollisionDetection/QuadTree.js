//Bc. Tomas Jarusek

//vystaveni a vyhledani v QuadTree
function QuadTree(startPoint, width, height, maximumCapacity)
{
	//souradnice prostoru
	this.startPoint = startPoint;
	this.width = width;
	this.height = height;
	this.maximumCapacity = maximumCapacity;
	
	//hotnota hranic pro rozdeleni
	this.verticalSplit = this.width/2;
	this.horizontalSplit = this.height/2;
	
	//hranice prostoru ohranicujici tento quadtree
	this.leftBoundary = this.startPoint[0];
	this.rightBoundary = this.startPoint[0] + this.width;
	this.topBoundary = this.startPoint[1];
	this.bottomBoundary = this.startPoint[1] + this.height;
	
	//je strom rozdelen?
	this.divided = false;
	//seznam dat v tomhle stromu
	this.itemList = [];
	
	//odkazy na pod quadtree
	this.topLeftTree = false;
	this.topRightTree = false;
	this.bottomLeftTree = false;
	this.bottomRightTree = false;
	
	//debug promenna - muze se vymazat, nebude pak fungovat ReturnQueryHighlightPositions();
	//funguje jen u prvni querry, jinak by se v celem strome musela promenna vyresetovat
	this.debugQueryHighlight = false;
	
	//vlozeni bodu do stromu - pozice bodu v prostoru a data ktere jsou v tom bodu obsazena
	this.InsertPoint = function(x,y,data)
	{
		//je strom rozdelen na podstormy?
		if (this.divided)
		{
			//pokud ano, tak porovname v jakem kvadrantu se bod vyskytuje a podle toho ho vlozime do spravneho podstromu
			verticalCondition = x <= this.startPoint[0]+this.verticalSplit;
			horizontalCondition = y <= this.startPoint[1]+this.horizontalSplit;
			
			if (verticalCondition)
			{
				if (horizontalCondition)
				{
					this.topLeftTree.InsertPoint(x,y,data);
				}
				else
				{
					this.bottomLeftTree.InsertPoint(x,y,data);
				}
			}
			else
			{
				if (horizontalCondition)
				{
					this.topRightTree.InsertPoint(x,y,data);
				}
				else
				{
					this.bottomRightTree.InsertPoint(x,y,data);
				}
			}
		}
		else
		{		
			//pokud ne, tak vlozime bod do seznamu bodu, ktery obsahuje tento podstom
			this.itemList.push([x,y,data]);	
			
			//pokud seznam bodu prekrocil limit, musime strom rozstepit
			if (this.itemList.length > this.maximumCapacity)
			{
				//vytvorime podstromy
				this.topLeftTree = new QuadTree([this.startPoint[0],this.startPoint[1]], this.verticalSplit, this.horizontalSplit, this.maximumCapacity);
				this.topRightTree = new QuadTree([this.startPoint[0]+this.verticalSplit,this.startPoint[1]], this.verticalSplit, this.horizontalSplit, this.maximumCapacity);	
				this.bottomLeftTree = new QuadTree([this.startPoint[0],this.startPoint[1]+this.horizontalSplit], this.verticalSplit, this.horizontalSplit, this.maximumCapacity);
				this.bottomRightTree = new QuadTree([this.startPoint[0]+this.verticalSplit,this.startPoint[1]+this.horizontalSplit], this.verticalSplit, this.horizontalSplit, this.maximumCapacity);
				
				//pro kazdy prvek ze seznamu tohoto stromu zjistime, do ktereho patri kvadrantu a podle toho ho vlozime do korektniho stromu
				let actItem;
				
				for (let i = 0; i < this.itemList.length; i++)
				{
					actItem = this.itemList[i];
					
					verticalCondition = actItem[0] <= this.startPoint[0]+this.verticalSplit;
					horizontalCondition = actItem[1] <= this.startPoint[1]+this.horizontalSplit;
					
					if (verticalCondition)
					{
						if (horizontalCondition)
						{
							this.topLeftTree.InsertPoint(actItem[0],actItem[1],actItem[2]);
						}
						else
						{
							this.bottomLeftTree.InsertPoint(actItem[0],actItem[1],actItem[2]);
						}
					}
					else
					{
						if (horizontalCondition)
						{
							this.topRightTree.InsertPoint(actItem[0],actItem[1],actItem[2]);
						}
						else
						{
							this.bottomRightTree.InsertPoint(actItem[0],actItem[1],actItem[2]);
						}
					}
				}
				
				//zrusime seznam prvku tohoto stromu a nastavime ze je rozstepen
				this.itemList = [];
				this.divided = true;
			}
		}
	}
	
	//vrati vsechny body v oblasti ohranicene obdelnikem
	this.Query = function(selectorLeftBoundary, selectorRightBoundary, selectorTopBoundary, selectorBottomBoundary)
	{
		//pripravime si vystupni pole, do ktereho budeme pridavat body
		let result = [];
	
		//protina se obdelnik ohranicujici prostor stromu a obdelnik selectoru?
		if (selectorLeftBoundary <= this.rightBoundary && selectorRightBoundary >= this.leftBoundary && selectorTopBoundary <= this.bottomBoundary && selectorBottomBoundary >= this.topBoundary)
		{
			//pokud ano, tak se zeptame, zda je strom dale rozdelen na podstromy
			if (this.divided)
			{	
				//kdyz ano, preposleme pozadavek do dalsich ctyrech podstromu a spojime jejich vystupy
				result = result.concat(this.topLeftTree.Query(selectorLeftBoundary, selectorRightBoundary, selectorTopBoundary, selectorBottomBoundary));
				result = result.concat(this.topRightTree.Query(selectorLeftBoundary, selectorRightBoundary, selectorTopBoundary, selectorBottomBoundary));
				result = result.concat(this.bottomLeftTree.Query(selectorLeftBoundary, selectorRightBoundary, selectorTopBoundary, selectorBottomBoundary));
				result = result.concat(this.bottomRightTree.Query(selectorLeftBoundary, selectorRightBoundary, selectorTopBoundary, selectorBottomBoundary));
			}
			else
			{
				//pokud ne, tak se jedna o nejmensi podstrom
				
				//debug promenna
				this.debugQueryHighlight = true;
				
				//podivame se na vsechny body v tomto strome
				let tmpY;
				let tmpX;
				
				for (let i = 0; i < this.itemList.length; i++)
				{
					tmpX = this.itemList[i][0];
					tmpY = this.itemList[i][1];
					
					// zjistime, zda patri do obdelniku selectoru
					if (tmpX >= selectorLeftBoundary && tmpX <= selectorRightBoundary && tmpY >= selectorTopBoundary && tmpY <= selectorBottomBoundary)
					{
						//pokud ano vlozime je do pole vysledku
						result.push(this.itemList[i][2]);
					}			
				}
			}
			//vratime vysledek
			return result;
		}
		else
		{
			//pokud ne - dal nas tyto podstromy nezajimaji
			return [];
		}	
	}
	
	//debug fukce pro vykresleni rozdeleni stromu, vrati seznam souradnic vsech delicich linii [x1,y1,x2,y2],[],...
	this.ReturnSplitBarsPositions = function()
	{
		let result = [];
		
		if (this.divided)
		{	
			result.push([this.startPoint[0]+this.verticalSplit,this.startPoint[1],this.startPoint[0]+this.verticalSplit,this.startPoint[1]+this.height]);
			result.push([this.startPoint[0],this.startPoint[1]+this.horizontalSplit,this.startPoint[0]+this.width,this.startPoint[1]+this.horizontalSplit]);	
					
			result = result.concat(this.topLeftTree.ReturnSplitBarsPositions());
			result = result.concat(this.topRightTree.ReturnSplitBarsPositions());
			result = result.concat(this.bottomLeftTree.ReturnSplitBarsPositions());
			result = result.concat(this.bottomRightTree.ReturnSplitBarsPositions());
		}
		
		return result;
	}

	//debug funkce pro vykresleni takovych stromu, ze kterych se pri query brali body k porovnani 
	//funkce vraci vsechny obdelniky, ktere se maji vykreslit jako seznam - [startovniBodX, startovniBodY, sirka, vyska],[],...
	//funguje jen pri prvnim query - jinak by se museli debug prommenne vynulovat
	this.ReturnQueryHighlightPositions = function()
	{
		let result = [];
		
		if (this.debugQueryHighlight === true)
		{
			result.push([this.startPoint[0],this.startPoint[1], this.width, this.height]);
		}
		
		if (this.divided)
		{
			result = result.concat(this.topLeftTree.ReturnQueryHighlightPositions());
			result = result.concat(this.topRightTree.ReturnQueryHighlightPositions());
			result = result.concat(this.bottomLeftTree.ReturnQueryHighlightPositions());
			result = result.concat(this.bottomRightTree.ReturnQueryHighlightPositions());
		}
		
		return result;
	}
}





















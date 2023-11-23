//MinMaxBinaryHeap
//Bc. Tomas Jarusek

//POZOR - je mnohem efektivnejsi ulozit klic a data jako pole ([key,data]) nez delat treba novou classu node (new Node(key, data))!!!
//insert milionu prvku pres pole - 146ms
//insert milionu prvku pres Node - 712ms
//podle mych testu se heapa vyplati nad normalnim linearnim vyhledavanim od okolo 100 prvku
class MinHeap
{
	constructor()
	{
		//indexuje se od 1, tedy prvni prvek na indexu 0 je [null, null]
		this.heap = [[null,null]];
	}
	
	//vlozeni prvku
	Insert(key, data) 
	{
		//prekopirujeme class heapu do lokalni promenne - lepsi performance
		let heap = this.heap;
		
		//zaciname od posledniho indexu a propagujeme se stromem nahoru
		//muzeme jako index vlozeneho prvku dat ted rovnou heap.length pred vlozenim prvku, 
		//protoze po vlozeni to bude +1, ale protoze .length je o 1 vyssi nez posledni index, museli by jsme nasledne dekrementovat
		//timto si usetrime trochu casu
		let insertNodeIndex = heap.length;
		
		//index rodice iR uzlu o indexu iU pri indexaci od 1 je dan vzorcem Math.floor(iU/2)
		// tohle se da udelat bitovim posunem - mnohem rychlejsi
		let insertNodeParentIndex = insertNodeIndex >> 1;
		
		//vytvorime novy uzel v heape a pusheneme ho do pole
		let insertNode = [key,data];	
		heap.push(insertNode);
				
		let swapTmp;

		//ted budeme propagovat uzel nahoru
		//koncime, pokud jsme v koreni nebo
		//uzel - rodic nesplnuji danou podminku
		//toto je minHeap - tedy rodic je mensi nez aktualni uzel
		while (insertNodeParentIndex !== 0 && insertNode[0] < heap[insertNodeParentIndex][0])
		{
			//uzel neni na spravnem miste
			
			//prohodime uzel a jeho rodice
			swapTmp = heap[insertNodeParentIndex];
			heap[insertNodeParentIndex] = heap[insertNodeIndex];
			heap[insertNodeIndex] = swapTmp;
			
			//upravime index uzlu a vypocitame noveho rodice
			insertNodeIndex = insertNodeParentIndex;
			insertNodeParentIndex = insertNodeIndex >> 1;
		}
	}
	
	//odstraneni prvku
	Remove()
	{
		//prekopirujeme class heapu do lokalni promenne - lepsi performance
		let heap = this.heap;
		//stejne tak velikost heapu
		let heapLength = heap.length;
		
		//v heapu je posledni prvek nebo zadny prvek
		if (heapLength <= 2)
		{
			//zadny prvek - null
			if (heapLength === 1)
			{
				return null;
			}
			//jeden prvek - rovnou ho vratime
			else
			{
				return heap.pop();
			}		
		}
		
		//ulozime si koren, ktery pozdeji vratime
		let removeNode = heap[1];
		//a nahradime ho poslednim prvkem v heape,
		//to ale znamena, ze heapa nema spravnou strukturu,
		//takze ji musime prerovnat
		heap[1] = heap.pop();
		//dekrementujeme lokalni velikost heapu
		heapLength = heapLength - 1;
		
		//tentokrat jdeme od korene k listum, problem je tady ale v tom,
		//ze mame na vyber ze dvou uzlu a my chceme ten, co nam lip vyhovuje dle typu heapu,
		//tedy v minHeapu ten mensi z nich
		
		//koren ma index roven 1
		let currentNodeIndex = 1;
		//vypocitame indexy obou synu
		//normalni vzorec pro indexaci od 1 je 2*iR a 2*iR+1
		//zde opet urychleno pomoci bitove operace
		let firstChildIndex = currentNodeIndex << 1;
		let secondChildIndex = firstChildIndex + 1;
		//tady bude ulozen ten vybrany uzel, se kterym se bude swapovat
		let chosenChildIndex;
		
		let swapTmp;
		
		//ted budeme prohazovat, dokud nedojdeme do listu
		while (true)
		{
			//levy syn existuje
			if (firstChildIndex < heapLength)
			{
				//pravy syn existuje
				if (secondChildIndex < heapLength)
				{
					//vybereme ten lepsi znich - v nasem pripade ten mensi
					if (heap[firstChildIndex][0] < heap[secondChildIndex][0])
					{
						chosenChildIndex = firstChildIndex;
					}
					else
					{
						chosenChildIndex = secondChildIndex;
					}

					//porovname zda je zvoleny syn mensi nez aktualni uzel - pokud ano prohodime
					if (heap[chosenChildIndex][0] < heap[currentNodeIndex][0])
					{
						//prohodime syna a uzel
						swapTmp = heap[currentNodeIndex];
						heap[currentNodeIndex] = heap[chosenChildIndex];
						heap[chosenChildIndex] = swapTmp;
						
						//aktualizujeme indexy
						currentNodeIndex = chosenChildIndex;
						firstChildIndex = currentNodeIndex << 1;
						secondChildIndex = firstChildIndex + 1;
					}
					else
					{
						//syn je vetsi - konec
						break;
					}
				}
				//pravy syn neexistuje
				else
				{
					//bereme leveho
					chosenChildIndex = firstChildIndex;
					
					//analogicky
					if (heap[chosenChildIndex][0] < heap[currentNodeIndex][0])
					{
						swapTmp = heap[currentNodeIndex];
						heap[currentNodeIndex] = heap[chosenChildIndex];
						heap[chosenChildIndex] = swapTmp;
						
						currentNodeIndex = chosenChildIndex;
						firstChildIndex = currentNodeIndex << 1;
						secondChildIndex = firstChildIndex + 1;
					}
					else
					{
						break;
					}
				}
			}
			//levy syn neexistuje
			else
			{
				//pravy syn existuje
				if (secondChildIndex < heapLength)
				{
					//bereme praveho
					chosenChildIndex = secondChildIndex;
					
					//analogicky
					if (heap[chosenChildIndex][0] < heap[currentNodeIndex][0])
					{
						swapTmp = heap[currentNodeIndex];
						heap[currentNodeIndex] = heap[chosenChildIndex];
						heap[chosenChildIndex] = swapTmp;
						
						currentNodeIndex = chosenChildIndex;
						firstChildIndex = currentNodeIndex << 1;
						secondChildIndex = firstChildIndex + 1;
					}
					else
					{
						break;
					}
				}
				//pravy syn neexistuje
				else
				{
					//zadny syn neexistuje - konec
					break;
				}
			}
		}
		
		//struktura heapu je obnovena - vratime puvodni koren
		return removeNode;
	}
}





//analogicky jak MinHeap, jen prohozeny porovnani
class MaxHeap
{
	constructor()
	{
		this.heap = [[null,null]];
	}
	
	Insert(key, data) 
	{
		let heap = this.heap;
		
		let insertNodeIndex = heap.length;
		
		let insertNodeParentIndex = insertNodeIndex >> 1;
		
		let insertNode = [key,data];	
		heap.push(insertNode);
				
		let swapTmp;

		while (insertNodeParentIndex !== 0 && insertNode[0] > heap[insertNodeParentIndex][0])
		{
			swapTmp = heap[insertNodeParentIndex];
			heap[insertNodeParentIndex] = heap[insertNodeIndex];
			heap[insertNodeIndex] = swapTmp;

			insertNodeIndex = insertNodeParentIndex;
			insertNodeParentIndex = insertNodeIndex >> 1;
		}
	}

	Remove()
	{
		let heap = this.heap;
		let heapLength = heap.length;
		
		if (heapLength <= 2)
		{
			if (heapLength === 1)
			{
				return null;
			}
			else
			{
				return heap.pop();
			}		
		}
		
		let removeNode = heap[1];
		heap[1] = heap.pop();
		heapLength = heapLength - 1;
		
		let currentNodeIndex = 1;

		let firstChildIndex = currentNodeIndex << 1;
		let secondChildIndex = firstChildIndex + 1;
		let chosenChildIndex;
		
		let swapTmp;
		
		while (true)
		{
			if (firstChildIndex < heapLength)
			{
				if (secondChildIndex < heapLength)
				{
					if (heap[firstChildIndex][0] > heap[secondChildIndex][0])
					{
						chosenChildIndex = firstChildIndex;
					}
					else
					{
						chosenChildIndex = secondChildIndex;
					}

					if (heap[chosenChildIndex][0] > heap[currentNodeIndex][0])
					{
						swapTmp = heap[currentNodeIndex];
						heap[currentNodeIndex] = heap[chosenChildIndex];
						heap[chosenChildIndex] = swapTmp;
						
						currentNodeIndex = chosenChildIndex;
						firstChildIndex = currentNodeIndex << 1;
						secondChildIndex = firstChildIndex + 1;
					}
					else
					{
						break;
					}
				}
				else
				{
					chosenChildIndex = firstChildIndex;
					
					if (heap[chosenChildIndex][0] > heap[currentNodeIndex][0])
					{
						swapTmp = heap[currentNodeIndex];
						heap[currentNodeIndex] = heap[chosenChildIndex];
						heap[chosenChildIndex] = swapTmp;
						
						currentNodeIndex = chosenChildIndex;
						firstChildIndex = currentNodeIndex << 1;
						secondChildIndex = firstChildIndex + 1;
					}
					else
					{
						break;
					}
				}
			}
			else
			{
				if (secondChildIndex < heapLength)
				{
					chosenChildIndex = secondChildIndex;
					
					if (heap[chosenChildIndex][0] > heap[currentNodeIndex][0])
					{
						swapTmp = heap[currentNodeIndex];
						heap[currentNodeIndex] = heap[chosenChildIndex];
						heap[chosenChildIndex] = swapTmp;
						
						currentNodeIndex = chosenChildIndex;
						firstChildIndex = currentNodeIndex << 1;
						secondChildIndex = firstChildIndex + 1;
					}
					else
					{
						break;
					}
				}
				else
				{
					break;
				}
			}
		}
		
		return removeNode;
	}
}









//otestovat indexOf oproti ulozeni indexu
class MinHeapAstar
{
	constructor()
	{
		//indexuje se od 1, tedy prvni prvek na indexu 0 je null
		this.heap = [null];
	}
	
	//vlozeni prvku
	Insert(data) 
	{
		//prekopirujeme class heapu do lokalni promenne - lepsi performance
		let heap = this.heap;
		
		//zaciname od posledniho indexu a propagujeme se stromem nahoru
		//muzeme jako index vlozeneho prvku dat ted rovnou heap.length pred vlozenim prvku, 
		//protoze po vlozeni to bude +1, ale protoze .length je o 1 vyssi nez posledni index, museli by jsme nasledne dekrementovat
		//timto si usetrime trochu casu
		let insertNodeIndex = heap.length;
		
		//index rodice iR uzlu o indexu iU pri indexaci od 1 je dan vzorcem Math.floor(iU/2)
		// tohle se da udelat bitovim posunem - mnohem rychlejsi
		let insertNodeParentIndex = insertNodeIndex >> 1;
		
		data[6] = insertNodeParentIndex;
		heap.push(data);
				
		let swapTmp;

		//ted budeme propagovat uzel nahoru
		//koncime, pokud jsme v koreni nebo
		//uzel - rodic nesplnuji danou podminku
		//toto je minHeap - tedy rodic je mensi nez aktualni uzel
		while (insertNodeParentIndex !== 0 && data[3] < heap[insertNodeParentIndex][3])
		{
			//uzel neni na spravnem miste
			
			//prohodime uzel a jeho rodice
			swapTmp = heap[insertNodeParentIndex];
			heap[insertNodeParentIndex] = heap[insertNodeIndex];
			heap[insertNodeIndex] = swapTmp;
			
			heap[insertNodeParentIndex][6] = insertNodeParentIndex;
			heap[insertNodeIndex][6] = insertNodeIndex;
			
			//upravime index uzlu a vypocitame noveho rodice
			insertNodeIndex = insertNodeParentIndex;
			insertNodeParentIndex = insertNodeIndex >> 1;
		}
	}
	
	//odstraneni prvku
	Remove()
	{
		//prekopirujeme class heapu do lokalni promenne - lepsi performance
		let heap = this.heap;
		//stejne tak velikost heapu
		let heapLength = heap.length;
		
		//v heapu je posledni prvek nebo zadny prvek
		if (heapLength <= 2)
		{
			//zadny prvek - null
			if (heapLength === 1)
			{
				return null;
			}
			//jeden prvek - rovnou ho vratime
			else
			{
				return heap.pop();
			}		
		}
		
		//ulozime si koren, ktery pozdeji vratime
		let removeNode = heap[1];
		//a nahradime ho poslednim prvkem v heape,
		//to ale znamena, ze heapa nema spravnou strukturu,
		//takze ji musime prerovnat
		heap[1] = heap.pop();
		//dekrementujeme lokalni velikost heapu
		heapLength = heapLength - 1;
		
		//tentokrat jdeme od korene k listum, problem je tady ale v tom,
		//ze mame na vyber ze dvou uzlu a my chceme ten, co nam lip vyhovuje dle typu heapu,
		//tedy v minHeapu ten mensi z nich
		
		//koren ma index roven 1
		let currentNodeIndex = 1;
		//vypocitame indexy obou synu
		//normalni vzorec pro indexaci od 1 je 2*iR a 2*iR+1
		//zde opet urychleno pomoci bitove operace
		let firstChildIndex = currentNodeIndex << 1;
		let secondChildIndex = firstChildIndex + 1;
		//tady bude ulozen ten vybrany uzel, se kterym se bude swapovat
		let chosenChildIndex;
		
		let swapTmp;
		
		//ted budeme prohazovat, dokud nedojdeme do listu
		while (true)
		{
			
			//mozna to vyplnit nullem ten konec a tim padem by tu nemusela but ta podminka????
			
			//levy syn existuje
			if (firstChildIndex < heapLength)
			{
				//pravy syn existuje
				if (secondChildIndex < heapLength)
				{
					//vybereme ten lepsi znich - v nasem pripade ten mensi
					if (heap[firstChildIndex][3] < heap[secondChildIndex][3])
					{
						chosenChildIndex = firstChildIndex;
					}
					else
					{
						chosenChildIndex = secondChildIndex;
					}

					//porovname zda je zvoleny syn mensi nez aktualni uzel - pokud ano prohodime
					if (heap[chosenChildIndex][3] < heap[currentNodeIndex][3])
					{
						//prohodime syna a uzel
						swapTmp = heap[currentNodeIndex];
						heap[currentNodeIndex] = heap[chosenChildIndex];
						heap[chosenChildIndex] = swapTmp;
						
						heap[currentNodeIndex][6] = currentNodeIndex;
						heap[chosenChildIndex][6] = chosenChildIndex;
						
						//aktualizujeme indexy
						currentNodeIndex = chosenChildIndex;
						firstChildIndex = currentNodeIndex << 1;
						secondChildIndex = firstChildIndex + 1;
					}
					else
					{
						//syn je vetsi - konec
						break;
					}
				}
				//pravy syn neexistuje
				else
				{
					//bereme leveho
					chosenChildIndex = firstChildIndex;
					
					//analogicky
					if (heap[chosenChildIndex][3] < heap[currentNodeIndex][3])
					{
						swapTmp = heap[currentNodeIndex];
						heap[currentNodeIndex] = heap[chosenChildIndex];
						heap[chosenChildIndex] = swapTmp;
						
						heap[currentNodeIndex][6] = currentNodeIndex;
						heap[chosenChildIndex][6] = chosenChildIndex;
						
						currentNodeIndex = chosenChildIndex;
						firstChildIndex = currentNodeIndex << 1;
						secondChildIndex = firstChildIndex + 1;
					}
					else
					{
						break;
					}
				}
			}
			//levy syn neexistuje
			else
			{
				//pravy syn existuje
				if (secondChildIndex < heapLength)
				{
					//bereme praveho
					chosenChildIndex = secondChildIndex;
					
					//analogicky
					if (heap[chosenChildIndex][3] < heap[currentNodeIndex][3])
					{
						swapTmp = heap[currentNodeIndex];
						heap[currentNodeIndex] = heap[chosenChildIndex];
						heap[chosenChildIndex] = swapTmp;
						
						heap[currentNodeIndex][6] = currentNodeIndex;
						heap[chosenChildIndex][6] = chosenChildIndex;
						
						currentNodeIndex = chosenChildIndex;
						firstChildIndex = currentNodeIndex << 1;
						secondChildIndex = firstChildIndex + 1;
					}
					else
					{
						break;
					}
				}
				//pravy syn neexistuje
				else
				{
					//zadny syn neexistuje - konec
					break;
				}
			}
		}
		
		//struktura heapu je obnovena - vratime puvodni koren
		return removeNode;
	}
	
	
	//mozna by to pak chtelo predelat en astar abych mohl proste brat height mapu
	//a nejak to cely dokoncit nez se pujde na ten hierarchickej
	
	//pak si dot e struktury uzlu ulozit  nejak tu pozici v heapu, abych to mohl updatnout.. vlastne to id
	Update(data)
	{
		let heap = this.heap;
		
		//zaciname od posledniho indexu a propagujeme se stromem nahoru
		//muzeme jako index vlozeneho prvku dat ted rovnou heap.length pred vlozenim prvku, 
		//protoze po vlozeni to bude +1, ale protoze .length je o 1 vyssi nez posledni index, museli by jsme nasledne dekrementovat
		//timto si usetrime trochu casu
		let insertNodeIndex = heap.length;
		
		//index rodice iR uzlu o indexu iU pri indexaci od 1 je dan vzorcem Math.floor(iU/2)
		// tohle se da udelat bitovim posunem - mnohem rychlejsi
		let insertNodeParentIndex = insertNodeIndex >> 1;
		
		data[6] = insertNodeParentIndex;
		heap.push(data);
				
		let swapTmp;

		//ted budeme propagovat uzel nahoru
		//koncime, pokud jsme v koreni nebo
		//uzel - rodic nesplnuji danou podminku
		//toto je minHeap - tedy rodic je mensi nez aktualni uzel
		while (insertNodeParentIndex !== 0 && data[3] < heap[insertNodeParentIndex][3])
		{
			//uzel neni na spravnem miste
			
			//prohodime uzel a jeho rodice
			swapTmp = heap[insertNodeParentIndex];
			heap[insertNodeParentIndex] = heap[insertNodeIndex];
			heap[insertNodeIndex] = swapTmp;
			
			heap[insertNodeParentIndex][6] = insertNodeParentIndex;
			heap[insertNodeIndex][6] = insertNodeIndex;
			
			//upravime index uzlu a vypocitame noveho rodice
			insertNodeIndex = insertNodeParentIndex;
			insertNodeParentIndex = insertNodeIndex >> 1;
		}
	}
}

















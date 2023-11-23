//Sudoku solver
//Ing. Tomas Jarusek, 9/2021

//solver engine
class SudokuSolver
{
	constructor(sudoku) 
	{
		this.sudoku = sudoku;	
		
		//backtracking
		this.backtrackingInitialized = false;
		this.backtrackingStack = [];
	
		//deterministic
		this.cellChangesStack = [];
		this.currentCellChanges = [];
		
		this.deterministicMethod_Fill = true;
		this.deterministicMethod_Remove = false;
		
		//solving parameters
		this.state = "initialized";
		
		this.stepIsVisible = true;
		this.solvingState = "NOT_DONE";
		
		//deterministic options
		this.remainingNumbersLimit = slider3.GetValue();
		
		if (this.remainingNumbersLimit < 1)
		{
			this.remainingNumbersLimit = 1;
		}
		else if (this.remainingNumbersLimit > 9)
		{
			this.remainingNumbersLimit = 9;
		}
		
		this.useDeterministic = checkbox1.GetValue();
		
		//other parameters
		this.framesSinceLastStep = 0;
		
		this.backtrackingStep = false;
		
		this.backtrackingStepsCount = 0;
		this.deterministicStepsCount = 0;
		
		this.solutionsFound = 0;
	}
	
	//general solver controls, called every frame
	ManageSolving()
	{
		//simulation speed from user input
		let currentMultiplier = slider2.GetValue();
		
		if (currentMultiplier >= 1)
		{
			//simulation is faster then normal
			//perform more then one step according to the multiplier
			
			let stepsToPerform = Math.floor(currentMultiplier);
			
			for (let i = 0; i < stepsToPerform; i++)
			{
				//state has to be solving
				if (this.state === "solving")
				{
					this.SolveSudoku_VisibleStep();
					
					//after step either nothing changed or 
					//solution was found or all solutions were found
					if (this.solvingState === "SOLUTION_FOUND")
					{
						this.solutionsFound++;
						
						this.state = "solution_found";
					}
					else if (this.solvingState === "NO_SOLUTION")
					{
						this.state = "no_more_solutions";
						
						button3.Disable();
					}
				}
			}	
		}
		else
		{
			//simulation is slower then normal
			//calculate how many frames are needed before the step should be done
			let numberOfFramesNeededUntilStep = Math.floor(1/currentMultiplier);
			
			if (this.framesSinceLastStep >= numberOfFramesNeededUntilStep)
			{
				//number is reached, perform single step
				
				//analogous as in currentMultiplier >= 1 code block
				if (this.state === "solving")
				{
					this.SolveSudoku_VisibleStep();
					
					if (this.solvingState === "SOLUTION_FOUND")
					{
						this.solutionsFound++;
						
						this.state = "solution_found";
					}
					else if (this.solvingState === "NO_SOLUTION")
					{
						this.state = "no_more_solutions";
						
						button3.Disable();
					}
				}
				
				this.framesSinceLastStep = 0;
			}
			else
			{
				this.framesSinceLastStep++;
			}
		}
		
	}

	//sets up solver for finding solutions
	FindSolution()
	{
		//this can only happen at the start of after solution was found
		
		if (this.state === "initialized")
		{
			//start - check for validity of sudoku
			if (this.sudoku.IsSudokuValid() === true)
			{
				this.useDeterministic = checkbox1.GetValue();
				
				this.state = "solving";
			}
			else
			{
				this.state = "not_valid"
			}
			
		}
		else if (this.state === "solution_found")
		{
			//if solution is already found, then we have to set both general state and solver state coresponding values
			this.state = "solving";		
			this.solvingState = "NOT_DONE";
		
			//IMPORTANT - if deterministic mode is enabled, then first step of finding 
			//new solution has to be erasing latest deterministic changes
			if (this.useDeterministic === true)
			{
				this.deterministicMethod_Fill = false;
				this.deterministicMethod_Remove = true;
			}
		}
	}

	//performs one step visible step (changes graphic output)
	SolveSudoku_VisibleStep()
	{
		while (true)
		{
			if (this.solvingState === "NOT_DONE")
			{
				this.solvingState = this.SolveSudoku_Step();
			}
			
			//check the flag from SolveSudoku_Step()
			if (this.stepIsVisible === true)
			{
				//step was visible - done
				
				if (this.backtrackingStep === true)
				{
					this.backtrackingStepsCount++;
				}
				else
				{
					this.deterministicStepsCount++;
				}
	
				break;
			}
			else
			{
				//step wasn't visible - one more step
				
				this.stepIsVisible = true;
			}				
		}
	}
	
	//performs one solve step
	SolveSudoku_Step()
	{
		if (this.useDeterministic === true && (this.deterministicMethod_Fill === true || this.deterministicMethod_Remove  === true))
		{		
			//deterministic mode is enabled and deterministic fill or remove should be performed
			this.backtrackingStep = false;
		
			if (this.deterministicMethod_Fill === true)
			{
				//adding one number at a time using deterministic rules
				
				//store information about current change
				let currentCellChange = this.DeterministicallyFillAsMuchEmptyCellsASPossible_Step(this.remainingNumbersLimit);
				
				if (currentCellChange.length === 0)
				{
					//if empty list is returned, no other deterministic option was found - done with deterministic fill
					
					//push list of current changes to the stack
					this.cellChangesStack.push(this.currentCellChanges);
					//reset list for next pass
					this.currentCellChanges = [];
					//fill is done -> set to false
					this.deterministicMethod_Fill = false;
					
					
					//BACKTRACKING
					
					//after deterministic changes new backtracking state has to be added 
					//to the backtrackin stack that points to next free cell that should be tried
					let nextEmptyCellCoordinates = this.sudoku.GetCoordinatesOfNextEmptyCell();
					
					if (nextEmptyCellCoordinates.length === 0)
					{
						//coordinate array was empty -> no empty cells -> solution is found
							
						return "SOLUTION_FOUND";
					}
						
					//store state of next cell
					let nextEmptyCellState = this.sudoku.cells[nextEmptyCellCoordinates[0]][nextEmptyCellCoordinates[1]].GetCellState();
					
					//push it into the backtracking stack along with coordinates
					this.backtrackingStack.push([0, nextEmptyCellCoordinates, nextEmptyCellState]);
					
					//nothing visible changed during this step
					this.stepIsVisible = false;
				}
				else
				{
					//not done yet
					
					//push current cell change into the list of current cell changes
					this.currentCellChanges.push(currentCellChange);
				}
			} 
			else if (this.deterministicMethod_Remove === true)
			{
				//removing one deterministic number at a time
				
				//we take from the stack the most recent list of cell changes
				let mostRecentCellChanges = this.cellChangesStack[this.cellChangesStack.length-1];
				
				if (mostRecentCellChanges.length === 0)
				{
					//no changes remain in a list -> all changes were reverted
					
					//remove now empty list from the stack
					this.cellChangesStack.pop();
					//removing is done -> set to false
					this.deterministicMethod_Remove = false;
					
					//nothing visible changed during this step
					this.stepIsVisible = false;
				}
				else
				{
					//get most recent cell change
					let mostRecentCellChange = mostRecentCellChanges.pop();

					//first, find the cell class from stored coordinates and then restore the state
					this.sudoku.cells[mostRecentCellChange[0]][mostRecentCellChange[1]].RestoreCellState(mostRecentCellChange[2]);
				}
			}
			
			//step finished
			return "NOT_DONE";
		}
		else
		{
			//standard backtracking step
			this.backtrackingStep = true;
			
			return this.SolveUsingBacktracking_Step();
		}

	}
	
	//does one backtracking step
	SolveUsingBacktracking_Step()
	{
		if (this.useDeterministic === false && this.backtrackingInitialized == false)
		{
			//if this is the first backtracking call - intitialize
			//(but only if deterministic mode is not enabled, otherwise it is initialized 
			//in the deterministic phase (solving always begins with deterministic phase))
			
			//get coordinates of next empty cell
			let emptyCellCoordinates = this.sudoku.GetCoordinatesOfNextEmptyCell();
			
			if (emptyCellCoordinates.length === 0)
			{
				//coordinate array was empty -> no empty cells -> solution is found
					
				//initializing done
				this.backtrackingInitialized = true;
					
				return "SOLUTION_FOUND";
			}
			
			//first, find the cell class from stored coordinates get current state
			let originalCellState = this.sudoku.cells[emptyCellCoordinates[0]][emptyCellCoordinates[1]].GetCellState();
		
			//push initial state into the stack
			this.backtrackingStack.push([0, emptyCellCoordinates, originalCellState]);
			
			//initializing done
			this.backtrackingInitialized = true;
		}
		
		if (this.backtrackingStack.length === 0)
		{
			//if stack is empty, then every state has been tried and there are no more solutions
			return "NO_SOLUTION";
		}
		
		//get current state from the stack
		let currentState = this.backtrackingStack[this.backtrackingStack.length-1];
			
		//number stored was just tried, so we start from the next one
		let possibleNumber = currentState[0] + 1;
		//retrieve coordinates of current cell
		let currentCoordinates = currentState[1];
		
		//first, original state is restored, so from the point of sudoku class, current cell is empty just like it was on the start 
		let currentCell = this.sudoku.cells[currentCoordinates[0]][currentCoordinates[1]];
		currentCell.RestoreCellState(currentState[2]);
		
		//we start trying new possible numbers
		while (possibleNumber <= 9)
		{
			//is it possible to put number on current coordinates?
			if (this.sudoku.IsNumberValidInCell(currentCoordinates[0], currentCoordinates[1], possibleNumber) === true)
			{
				//if yes, then we stop searching - good enough for now
				
				break;
			}
			
			possibleNumber++;
		}
		//if it is not possible to put any number on current coordinates, the value of possibleNumber is going to be 10
		
		if (possibleNumber <= 9)
		{
			//valid move (so far), continue
			
			//update current state with new number
			currentState[0] = possibleNumber;
			
			//update/restore current cell (was reset at the beginning) 
			currentCell.empty = false;
			currentCell.number = possibleNumber;
			currentCell.type = "backtracking";
			currentCell.orderNumber = this.GetCurrentNumberOfFilledCells();
			
			if (this.useDeterministic === true)
			{
				//deterministic mode enabled
				
				//we indicate that next phase is going to be deterministic filling 
				this.deterministicMethod_Fill = true;
				this.deterministicMethod_Remove = false;
			}
			else
			{
				//if deterministic mode is enabled, this code is going to be done after it, so it doesn't have to be done here
				
				//new backtracking state is added to the stack that points to next free cell that should be tried
				let nextEmptyCellCoordinates = this.sudoku.GetCoordinatesOfNextEmptyCell();
				
				if (nextEmptyCellCoordinates.length === 0)
				{
					//coordinate array was empty -> no empty cells -> solution is found
						
					return "SOLUTION_FOUND";
				}
					
				//store state of next cell
				let nextEmptyCellState = this.sudoku.cells[nextEmptyCellCoordinates[0]][nextEmptyCellCoordinates[1]].GetCellState();
				
				//push it into the backtracking stack along with coordinates
				this.backtrackingStack.push([0, nextEmptyCellCoordinates, nextEmptyCellState]);
			}
			
			//step finished
			return "NOT_DONE";
		}
		else
		{
			//no number can be put in current cell - remove state from stack
			this.backtrackingStack.pop();

			if (currentState[0] === 0)
			{
				//no number could be put into new empty cell (started at 0 and ended at 10)
				//but that means that no visible change happened because the cell 
				//was empty at the beginning and also at the end of the step
				this.stepIsVisible = false;
			}			

			if (this.useDeterministic === true)
			{
				//deterministic mode enabled
				
				//we indicate that next phase is going to be deterministic removing
				this.deterministicMethod_Fill = false;
				this.deterministicMethod_Remove = true;		
			}
			
			//step finished
			return "NOT_DONE";
		}
		
		
	}
	
	//fills one (or zero) empty cells with correct number using deterministic rules
	//also returns original cell state or empty list, if no number is found
	DeterministicallyFillAsMuchEmptyCellsASPossible_Step(remainingNumbersLimit)
	{
		let originalCellState = [];
		
		for (let currentNumberLimit = 1; currentNumberLimit <= remainingNumbersLimit; currentNumberLimit++)
		{
			//rows
			for (let i = 0; i < 9; i++)
			{
				originalCellState = this.DeterministicallyFillRow(i, currentNumberLimit);

				if (originalCellState.length !== 0)
				{
					return originalCellState;
				}
			}
			
			//columns
			for (let i = 0; i < 9; i++)
			{
				originalCellState = this.DeterministicallyFillColumn(i, currentNumberLimit);

				if (originalCellState.length !== 0)
				{
					return originalCellState;
				}
			}
			
			//3x3s
			for (let i = 0; i < 9; i += 3)
			{		
				for (let j = 0; j < 9; j += 3)
				{
					originalCellState = this.DeterministicallyFill3x3(j, i, currentNumberLimit);
				
					if (originalCellState.length !== 0)
					{
						return originalCellState;
					}
				}
			}	
		}
		
		return originalCellState;
	}
	
	//fills one (or zero) empty cells in a row with correct number using deterministic rules
	DeterministicallyFillRow(y, remainingNumbersLimit)
	{
		//list of remaining numbers
		let remainingNumbers = this.sudoku.GetRemainingNumbersForRow(y);

		//we only try to solve row if the number of remaining numbers is lower or equal to the limit
		if (remainingNumbers.length <= remainingNumbersLimit)
		{
			//list of coordinates of cells NOT cells themselves
			let emptyCells = this.sudoku.GetEmptyCellsCoordinatesForRow(y);
		
			//try to deterministically place remaining numbers into empty cells
			return this.TryToDeterministicallyPlaceRemainingNumbersIntoEmptyCells(remainingNumbers, emptyCells, "row");
		}
		
		return [];
	}
	
	//fills one (or zero) empty cells in a column with correct number using deterministic rules
	DeterministicallyFillColumn(x, remainingNumbersLimit)
	{
		//list of remaining numbers
		let remainingNumbers = this.sudoku.GetRemainingNumbersForColumn(x);

		//we only try to solve row if the number of remaining numbers is lower or equal to the limit
		if (remainingNumbers.length <= remainingNumbersLimit)
		{
			//list of coordinates of cells NOT cells themselves
			let emptyCells = this.sudoku.GetEmptyCellsCoordinatesForColumn(x);
		
			//try to deterministically place remaining numbers into empty cells
			return this.TryToDeterministicallyPlaceRemainingNumbersIntoEmptyCells(remainingNumbers, emptyCells, "column");
		}
		
		return [];
	}

	//fills one (or zero) empty cells in a 3x3s with correct number using deterministic rules
	DeterministicallyFill3x3(startX, startY, remainingNumbersLimit)
	{
		//list of remaining numbers
		let remainingNumbers = this.sudoku.GetRemainingNumbersFor3x3(startX, startY);

		//we only try to solve row if the number of remaining numbers is lower or equal to the limit
		if (remainingNumbers.length <= remainingNumbersLimit)
		{
			//list of coordinates of cells NOT cells themselves
			let emptyCells = this.sudoku.GetEmptyCellsCoordinatesFor3x3(startX, startY);
		
			//try to deterministically place remaining numbers into empty cells
			return this.TryToDeterministicallyPlaceRemainingNumbersIntoEmptyCells(remainingNumbers, emptyCells, "3x3");
		}
		
		return [];
	}
	
	//tries to place possible remaining numbers into empty cells
	//basically it immititates the human strategy of trying to place a number (for example to a row)
	//that has multiple empty cells, but the options are constrained from (for example columns and 3x3s)
	//let's look at this situation:
	//0,0,0,0,4,0,0,0,0
	//1,2,3,0,0,0,7,8,0
	//0,0,0,0,0,0,0,0,0
	//the middle row has four empty cells (coordinates stored in second parameter)
	//and missing numbers are 4,5,6 and 9 (stored in first parameter)
	//however, number 4 cannot be in the middle 3x3 because it's already there in the top row
	//so 4 has to be on the far right
	//this function does it like this: for each possible number it asks whether it is valid
	//in PRECISELY ONE cell, if yes, then it puts it there
	//so in the previous example 4 is not valid in any of the middle cells, because of the other number 4
	//but it is valid on the far right, so it is put there (just one valid spot of four possible)
	//numbers 5,6 and 9 are valid in all of the empty cells, so they cannot be placed
	//this is a generalized version - the empty cells don't have to neccesarily be in a row, column or 3x3,
	//but it is natural to use it in this way
	TryToDeterministicallyPlaceRemainingNumbersIntoEmptyCells(remainingNumbers, emptyCells, type)
	{
		let currentCell;
		let originalCellState;
		
		let i;
		
		//for each remaining number
		for (i = 0; i < remainingNumbers.length; i++)
		{
			//get cells where it can be put
			let validCellsForNumber = [];
			//get cells where it cannot be put
			let invalidCellsForNumber = [];
			
			//for each empty cell
			for (let j = 0; j < emptyCells.length; j++)
			{
				//find if current number can be placed there and push it into appropriate buffer
				if (this.sudoku.IsNumberValidInCell(emptyCells[j][0], emptyCells[j][1], remainingNumbers[i]) === true)
				{
					validCellsForNumber.push(emptyCells[j]);
				}
				else
				{
					invalidCellsForNumber.push(emptyCells[j]);
				}
			}
			
			//if there is exactly one cell, where the current number can be placed - place it there
			if (validCellsForNumber.length === 1)
			{
				//get current cell from coordinate
				currentCell = this.sudoku.cells[validCellsForNumber[0][0]][validCellsForNumber[0][1]];
				
				//save current state of cell
				originalCellState = currentCell.GetCellState();
		
				//update state
				currentCell.empty = false;
				currentCell.number = remainingNumbers[i];
				currentCell.type = "deterministic";
				currentCell.orderNumber = this.GetCurrentNumberOfFilledCells();
				currentCell.ruleNumber = remainingNumbers.length;
				currentCell.ruleUsed = type;
		
				return [validCellsForNumber[0][0], validCellsForNumber[0][1], originalCellState];
			}
		}
		
		return [];
	}

	//calculates placement order number for new cell
	GetCurrentNumberOfFilledCells()
	{
		//backtracking
		//number of states in backtracking stack without not yet tried new state if exists 
		let placedCellsCount_Backtracking = this.backtrackingStack.length;
		
		if (placedCellsCount_Backtracking !== 0 && this.backtrackingStack[this.backtrackingStack.length-1][0] === 0)
		{
			placedCellsCount_Backtracking--;
		}
		
		//deterministic
		//sum of lengths of all changes + the length of current changes beeing worked on
		let placedCellsCount_Deterministic = this.currentCellChanges.length;
		
		for (let i = 0; i < this.cellChangesStack.length; i++)
		{
			placedCellsCount_Deterministic += this.cellChangesStack[i].length;
		}
		
		//sum of both
		return placedCellsCount_Backtracking + placedCellsCount_Deterministic;
	}

	//draws info from the solver
	DrawSolvingInfo(localContext, deltaTime)
	{
		let startX = 960;
		let startY = 65;
		let offset = 0;
		let spacing = 60;
		
		localContext.font = " 30px Arial";
		localContext.textAlign = 'left';
		
		let displayString;
		
		//state	
		if (this.state === "initialized")
		{
			localContext.fillStyle = "rgb(0,0,0)";
			
			displayString = "State: Initialized";
		}
		else if (this.state === "solving")
		{
			localContext.fillStyle = "rgb(0,0,0)";
			
			displayString = "State: Solving";
		}
		else if (this.state === "solution_found")
		{
			localContext.fillStyle = "rgb(0,180,0)";
			
			displayString = "State: Solution found";
		}
		else if (this.state === "no_more_solutions")
		{
			localContext.fillStyle = "rgb(255,0,0)";
			
			displayString = "State: No more solutions";
		}
		else if (this.state === "not_valid")
		{
			localContext.fillStyle = "rgb(255,0,0)";
			
			displayString = "State: Sudoku is not valid";
		}
		
		localContext.fillText(displayString, startX, startY + offset);
		offset += spacing;
		
		//choosing method
		localContext.fillStyle = "rgb(0,0,0)";
		displayString = "Next cell rule: " + this.sudoku.chosenOption;
		localContext.fillText(displayString, startX, startY + offset);
		offset += spacing;
		
		//solutions
		localContext.fillStyle = "rgb(0,0,0)";
		displayString = "Found solutions: " + this.solutionsFound.toString();
		localContext.fillText(displayString, startX, startY + offset);
		offset += spacing*1.5;
		
		//counters
		displayString = "Backtracking steps: " + this.backtrackingStepsCount.toString();
		localContext.fillText(displayString, startX, startY + offset);
		offset += spacing;
		
		if (this.useDeterministic === true)
		{
			displayString = "Deterministic steps: " + this.deterministicStepsCount.toString();
			localContext.fillText(displayString, startX, startY + offset);
			offset += spacing*1.5;
			
			//deterministic stats
			let displayDeterministicInfo = checkbox2.GetValue();
			
			if (displayDeterministicInfo === true)
			{
				let sudokuCells = this.sudoku.cells;
				let ruleNumberCounters = [-1];
				
				for (let i = 0; i < this.remainingNumbersLimit; i++)
				{
					ruleNumberCounters.push(0);
				}
				
				//calculate number of ruleNumbers
				let cellRuleNumber;
				
				for (let i = 0; i < 9; i++)
				{		
					for (let j = 0; j < 9; j++)
					{
						cellRuleNumber = sudokuCells[j][i].ruleNumber
						
						if (cellRuleNumber !== -1)
						{
							ruleNumberCounters[cellRuleNumber]++;
						}
					}
				}
				
				displayString = "Number of gap sizes filled:";
				localContext.fillText(displayString, startX, startY + offset);
				offset += 3*spacing/4;
				
				for (let i = 1; i <= this.remainingNumbersLimit; i++)
				{
					displayString = i.toString() + ": " + ruleNumberCounters[i].toString();
					localContext.fillText(displayString, startX, startY + offset);
					offset += 3*spacing/4;
				}
			}
		}
		
		//fps
		localContext.fillStyle = "rgb(0,0,0)";
		displayString = "Framerate: " + (1000/deltaTime).toFixed(2).toString() + " fps";
		localContext.fillText(displayString, startX, startY + 840);
	}
}

//single sudoku cell
class SudokuCell
{
	constructor(empty, number) 
	{
		this.empty = empty;
		this.number = number;
		
		this.type = ""
		this.orderNumber = -1;
		
		this.ruleNumber = -1;
		this.ruleUsed = "";
	}
	
	//returns array containing state of cell
	GetCellState()
	{
		return [this.empty, this.number, this.type, this.orderNumber, this.ruleNumber, this.ruleUsed];
	}
	
	//restors state of cell from array
	RestoreCellState(state)
	{
		this.empty = state[0];
		this.number = state[1];
		
		this.type = state[2];
		this.orderNumber = state[3];
		
		this.ruleNumber = state[4];
		this.ruleUsed = state[5];
	}
	
	//draws cell
	DrawCell(localContext, startX, startY, width, displayDeterministicInfo, displayGradient, numberOfSudokuClues)
	{
		//background
		if (displayGradient === true)
		{
			//gradient
			//interpolates from almost white to green
			//based on number of placed number by the solver and empty cells of fresh sudoku
			
			let notPrimaryColorIntensity = (240-Math.floor(this.orderNumber/(81-numberOfSudokuClues)*200)).toString();
			
			if (this.type === "backtracking")
			{
				localContext.fillStyle = "rgb(" + notPrimaryColorIntensity + ",255," + notPrimaryColorIntensity + ")";
				
			}
			else if (this.type === "deterministic")
			{
				localContext.fillStyle = "rgb(255," + notPrimaryColorIntensity + "," + notPrimaryColorIntensity + ")";
			}
			else
			{
				localContext.fillStyle = "rgb(255,255,255)";
			}
		}
		else
		{
			//plain colors
			
			if (this.type === "backtracking")
			{
				localContext.fillStyle = "rgb(200,255,200)";
			}
			else if (this.type === "deterministic")
			{
				localContext.fillStyle = "rgb(255,200,200)";
			}
			else
			{
				localContext.fillStyle = "rgb(255,255,255)";
			}
		}
		
		localContext.fillRect(startX, startY, width, width);
		
		//number in cell
		if (this.empty === false)
		{
			localContext.fillStyle = "rgb(0,0,0)";
			
			let numberString = this.number.toString();
			
			localContext.font = (width/1.2).toString() + "px Arial";
			
			//vertical align
			//doesn't really work 
			//localContext.textBaseline = 'middle';
			//instead manual calculation is performed
			let numberStringMeasure = localContext.measureText(numberString);
			let correction = (numberStringMeasure.actualBoundingBoxAscent + numberStringMeasure.actualBoundingBoxDescent)/2;
			
			//horizontal align
			localContext.textAlign = 'center';
			
			localContext.fillText(numberString, startX + width/2, startY + width/2 + correction);
		}
		
		//deterministic infos
		if (displayDeterministicInfo === true && this.ruleNumber !== -1)
		{
			localContext.fillStyle = "rgb(0,0,0)";
			localContext.font = (width/4).toString() + "px Arial";
			
			//rule number
			let ruleNumberString = this.ruleNumber.toString();
			
			//vertical align
			//doesn't really work 
			//localContext.textBaseline = 'middle';
			//instead manual calculation is performed
			let ruleNumberStringMeasure = localContext.measureText(ruleNumberString);
			let correction = (ruleNumberStringMeasure.actualBoundingBoxAscent + ruleNumberStringMeasure.actualBoundingBoxDescent)/2;
			
			//horizontal align
			localContext.textAlign = 'center';
			
			localContext.fillText(ruleNumberString, startX + width*0.85, startY + width*0.15 + correction);
			
			//rule type
			let subcellWidth = width*0.020;
			
			if (this.ruleUsed === "row")
			{
				localContext.fillRect(startX + subcellWidth*4, startY + subcellWidth*8, subcellWidth*9, subcellWidth);
			}
			else if (this.ruleUsed === "column")
			{
				localContext.fillRect(startX + subcellWidth*8, startY + subcellWidth*4, subcellWidth, subcellWidth*9);
			}
			else if (this.ruleUsed === "3x3")
			{
				localContext.fillRect(startX + subcellWidth*7, startY + subcellWidth*7, subcellWidth*3, subcellWidth*3);
			}
		}
	}
}

//stores state of sudoku board and answers questions about it
//does NOT contain any solve logic
class Sudoku
{
	constructor(startX, startY, width) 
	{
		this.cells;
		
		this.startX = startX;
		this.startY = startY;
		this.width = width;
		
		this.lineWidth = width/250;		
		this.cellWidth = width/9;

		this.numberOfClues = 0;
		
		this.orderedListOfEmptyCoordinates = [];
	}
	
	//sudoku intialization
	InitializeSudoku(numbers)
	{
		this.cells = [];
		
		//for each coordinate, create new SudokuCell class
		for (let i = 0; i < 9; i++)
		{
			let row = [];
			
			for (let j = 0; j < 9; j++)
			{
				if (numbers[j][i] < 1 || numbers[j][i] > 9)
				{
					row.push(new SudokuCell(true, -1));	
				}
				else
				{
					row.push(new SudokuCell(false, numbers[j][i]));
					
					this.numberOfClues++;
				}
			}
			
			this.cells.push(row);
		}
		
		//ordered list of empty coordinates of fresh sudoku
		//in this order they are going to be processed by backtracker
		this.chosenOption = dropDownMenu1.GetValue();
		this.orderedListOfEmptyCoordinates = this.CreateOrderedListOfEmptyCoordinates(this.chosenOption);
	}
	
	//validates CURRENT state of sudoku - but that DOESN'T mean that it's solvable
	IsSudokuValid()
	{	
		let cells = this.cells;
	
		let numberCounter;
	
		//for each row, column and 3x3 a simple look up table is set up
		//then we iterate through every row, column and 3x3 and increment 
		//counter in a look up table for corresponding number
		//after each increment it is checked whether counter is bigger than one
		//in that case row, column or 3x3 is invalid bucause it contains number more than once
	
		//rows
		for (let i = 0; i < 9; i++)
		{		
			let numberCounter = [-1,0,0,0,0,0,0,0,0,0];
		
			for (let j = 0; j < 9; j++)
			{
				if (cells[j][i].empty === false)
				{
					numberCounter[cells[j][i].number]++;
					
					if (numberCounter[cells[j][i].number] > 1)
					{
						return false;
					}
				}
			}
		}
		
		//columns
		for (let i = 0; i < 9; i++)
		{		
			let numberCounter = [-1,0,0,0,0,0,0,0,0,0];
		
			for (let j = 0; j < 9; j++)
			{
				if (cells[i][j].empty === false)
				{
					numberCounter[cells[i][j].number]++;
					
					if (numberCounter[cells[i][j].number] > 1)
					{
						return false;
					}
				}
			}
		}
		
		//3x3 cells
		
		//first two cycles return top left coordinates of 3x3 cells		
		for (let i = 0; i < 9; i += 3)
		{		
			for (let j = 0; j < 9; j += 3)
			{	
				let numberCounter = [-1,0,0,0,0,0,0,0,0,0];
				
				//last two cycles iterate through single 3x3 cell
				for (let k = i; k < (i+3); k++)
				{		
					for (let l = j; l < (j+3); l++)
					{						
						if (cells[l][k].empty === false)
						{
							numberCounter[cells[l][k].number]++;
							
							if (numberCounter[cells[l][k].number] > 1)
							{
								return false;
							}
						}
					}
				}
						
			}
		}
		
		return true;
	}
	
	//analogous to IsSudokuValid() but checks row, column and 3x3 for single cell only
	IsNumberValidInCell(x, y, number)
	{
		let cells = this.cells;
		
		if (cells[x][y].empty !== true)
		{
			return false;
		}			
		
		//row
		for (let i = 0; i < 9; i++)
		{
			if (cells[i][y].empty !== true && cells[i][y].number === number)
			{
				return false;
			}
		}
		
		//column
		for (let i = 0; i < 9; i++)
		{
			if (cells[x][i].empty !== true && cells[x][i].number === number)
			{
				return false;
			}
		}
		
		//3x3 cell
		//lookup - from index sudoku to 3x3 start index
		let cellStartLookUp = [0,0,0,3,3,3,6,6,6];
		let cellStartX = cellStartLookUp[x];
		let cellStartY = cellStartLookUp[y];
		
		for (let i = cellStartY; i < cellStartY + 3; i++)
		{
			for (let j = cellStartX; j < cellStartX + 3; j++)
			{
				if (cells[j][i].empty !== true && cells[j][i].number === number)
				{
					return false;
				}
			}
		}
		
		return true;
	}
	
	//returns remaining numbers that are not yet placed in a specific row
	GetRemainingNumbersForRow(y)
	{
		let cells = this.cells;
		
		let numberCounter = [-1,0,0,0,0,0,0,0,0,0];
		
		for (let i = 0; i < 9; i++)
		{
			if (cells[i][y].empty === false)
			{
				numberCounter[cells[i][y].number]++;
			}
		}
		
		let remainingNumbers = [];
		
		for (let i = 1; i < 10; i++)
		{
			if (numberCounter[i] === 0)
			{
				remainingNumbers.push(i);
			}
		}
		
		return remainingNumbers;
	}
	
	//returns remaining numbers that are not yet placed in a specific column
	GetRemainingNumbersForColumn(x)
	{
		let cells = this.cells;
		
		let numberCounter = [-1,0,0,0,0,0,0,0,0,0];
		
		for (let i = 0; i < 9; i++)
		{
			if (cells[x][i].empty === false)
			{
				numberCounter[cells[x][i].number]++;
			}
		}
		
		let remainingNumbers = [];
		
		for (let i = 1; i < 10; i++)
		{
			if (numberCounter[i] === 0)
			{
				remainingNumbers.push(i);
			}
		}
		
		return remainingNumbers;
	}
	
	//returns remaining numbers that are not yet placed in a specific 3x3
	GetRemainingNumbersFor3x3(startX, startY)
	{
		let cells = this.cells;
		
		let numberCounter = [-1,0,0,0,0,0,0,0,0,0];
		
		for (let i = startY; i < startY + 3; i++)
		{
			for (let j = startX; j < startX + 3; j++)
			{
				if (cells[j][i].empty === false)
				{
					numberCounter[cells[j][i].number]++;
				}
			}
		}
		
		let remainingNumbers = [];
		
		for (let i = 1; i < 10; i++)
		{
			if (numberCounter[i] === 0)
			{
				remainingNumbers.push(i);
			}
		}
		
		return remainingNumbers;
	}
	
	//returns list of coordinates of empty cells in specific row
	GetEmptyCellsCoordinatesForRow(y)
	{
		let cells = this.cells;
		let emptyCells = [];
		
		for (let i = 0; i < 9; i++)
		{
			if (cells[i][y].empty === true)
			{
				emptyCells.push([i,y]);
			}
		}
		
		return emptyCells;
	}
	
	//returns list of coordinates of empty cells in specific column
	GetEmptyCellsCoordinatesForColumn(x)
	{
		let cells = this.cells;
		let emptyCells = [];
		
		for (let i = 0; i < 9; i++)
		{
			if (cells[x][i].empty === true)
			{
				emptyCells.push([x,i]);
			}
		}
		
		return emptyCells;
	}
	
	//returns list of coordinates of empty cells in specific 3x3
	GetEmptyCellsCoordinatesFor3x3(startX, startY)
	{
		let cells = this.cells;
		let emptyCells = [];
		
		for (let i = startY; i < startY + 3; i++)
		{
			for (let j = startX; j < startX + 3; j++)
			{
				if (cells[j][i].empty === true)
				{
					emptyCells.push([j, i]);
				}
			}
		}
		
		return emptyCells;
	}
	
	//gets first found empty cell from prepared list
	GetCoordinatesOfNextEmptyCell()
	{
		let cells = this.cells;
		let localCoordinates = this.orderedListOfEmptyCoordinates;
		let localCoordinatesLength = localCoordinates.length;
		
		for (let i = 0; i < localCoordinatesLength; i ++)
		{
			if (cells[localCoordinates[i][0]][localCoordinates[i][1]].empty === true)
			{
				return localCoordinates[i];
			}
		}

		return [];
	}
	
	//chooses and generates ordered list of empty coordinates
	//this is the order that they are going to be processed by backtracker
	CreateOrderedListOfEmptyCoordinates(nextEmptyCellChoosingMethod)
	{
		if (nextEmptyCellChoosingMethod === "Row by row")
		{
			return this.CreateOrderedListOfEmptyCoordinates_RowByRow();
		}
		else if (nextEmptyCellChoosingMethod === "Column by column")
		{
			return this.CreateOrderedListOfEmptyCoordinates_ColumnByColumn();
		}
		else if (nextEmptyCellChoosingMethod === "3x3 by 3x3")
		{
			return this.CreateOrderedListOfEmptyCoordinates_3x3By3x3();
		}
		else if (nextEmptyCellChoosingMethod === "Random")
		{
			return this.CreateOrderedListOfEmptyCoordinates_Random();
		}
		else if (nextEmptyCellChoosingMethod === "Diagonal")
		{
			return this.CreateOrderedListOfEmptyCoordinates_Diagonal();
		}
		else if (nextEmptyCellChoosingMethod ===  "Inwards")
		{
			return this.CreateOrderedListOfEmptyCoordinates_Inwards();
		}
		else if (nextEmptyCellChoosingMethod === "Outwards")
		{
			return this.CreateOrderedListOfEmptyCoordinates_Outwards();
		}
		else if (nextEmptyCellChoosingMethod === "Checkerboard")
		{
			return this.CreateOrderedListOfEmptyCoordinates_Checkerboard();
		}
	}
	
	//row by row order generator
	CreateOrderedListOfEmptyCoordinates_RowByRow()
	{
		let cells = this.cells;
		let coordinates = [];
		
		for (let i = 0; i < 9; i++)
		{		
			for (let j = 0; j < 9; j++)
			{
				if (cells[j][i].empty === true)
				{
					coordinates.push([j, i]);
				}
			}
		}
		
		return coordinates;
	}
	
	//column by column order generator
	CreateOrderedListOfEmptyCoordinates_ColumnByColumn()
	{
		let cells = this.cells;
		let coordinates = [];
		
		for (let i = 0; i < 9; i++)
		{		
			for (let j = 0; j < 9; j++)
			{
				if (cells[i][j].empty === true)
				{
					coordinates.push([i, j]);
				}
			}
		}
		
		return coordinates;
	}
	
	//3x3 by 3x3 order generator
	CreateOrderedListOfEmptyCoordinates_3x3By3x3()
	{
		let cells = this.cells;
		let coordinates = [];
		
		for (let i = 0; i < 9; i += 3)
		{		
			for (let j = 0; j < 9; j += 3)
			{	
				let numberCounter = [-1,0,0,0,0,0,0,0,0,0];
				
				//last two cycles iterate through single 3x3 cell
				for (let k = i; k < (i+3); k++)
				{		
					for (let l = j; l < (j+3); l++)
					{						
						if (cells[l][k].empty === true)
						{
							coordinates.push([l, k]);
						}
					}
				}
						
			}
		}
		
		return coordinates;
	}
	
	//random order generator
	CreateOrderedListOfEmptyCoordinates_Random()
	{
		let cells = this.cells;
		let coordinates = [];
		
		let emptyCellsCoordinates = [];
		
		for (let i = 0; i < 9; i++)
		{		
			for (let j = 0; j < 9; j++)
			{
				if (cells[j][i].empty === true)
				{
					emptyCellsCoordinates.push([j, i]);
				}
			}
		}
		
		while (emptyCellsCoordinates.length !== 0)
		{
			coordinates.push(emptyCellsCoordinates.splice(Math.floor(Math.random()*emptyCellsCoordinates.length), 1)[0]);
		}
		
		return coordinates;
	}
	
	//diagonal order generator
	CreateOrderedListOfEmptyCoordinates_Diagonal()
	{
		let cells = this.cells;
		let coordinates = [];
		
		//top left  to (including) diagonal
		for (let i = 0; i < 10; i++)
		{		
			for (let j = 0; j < i; j++)
			{
				if (cells[j][i-j-1].empty === true)
				{
					coordinates.push([j, i-j-1]);
				}
			}
		}
		
		//(not including) diagonal to bottom right
		for (let i = 8; i > 0; i--)
		{		
			for (let j = 8-i+1 ; j <= 8; j++)
			{
				if (cells[j][(8-i+1+8)-j].empty === true)
				{
					coordinates.push([j, (8-i+1+8)-j]);
				}
			}
		}
		
		return coordinates;
	}
	
	//checkerboard order generator
	CreateOrderedListOfEmptyCoordinates_Checkerboard()
	{
		let cells = this.cells;
		let coordinates = [];
		
		for (let i = 0; i < 9; i++)
		{		
			for (let j = 0; j < 9; j++)
			{
				if (((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) && cells[j][i].empty === true)
				{
					coordinates.push([j, i]);
				}
			}
		}
		
		for (let i = 0; i < 9; i++)
		{		
			for (let j = 0; j < 9; j++)
			{
				if (((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)) && cells[j][i].empty === true)
				{
					coordinates.push([j, i]);
				}
			}
		}
		
		return coordinates;
	}
	
	//inwards order generator
	CreateOrderedListOfEmptyCoordinates_Inwards()
	{
		let cells = this.cells;
		let coordinates = [];
		
		let potencionalCoordinates = [];
		potencionalCoordinates = potencionalCoordinates.concat([[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]);
		potencionalCoordinates = potencionalCoordinates.concat([[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]]);
		potencionalCoordinates = potencionalCoordinates.concat([[8,8],[7,8],[6,8],[5,8],[4,8],[3,8],[2,8],[1,8]]);
		potencionalCoordinates = potencionalCoordinates.concat([[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1]]);
		potencionalCoordinates = potencionalCoordinates.concat([[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]]);
		potencionalCoordinates = potencionalCoordinates.concat([[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]]);
		potencionalCoordinates = potencionalCoordinates.concat([[7,7],[6,7],[5,7],[4,7],[3,7],[2,7]]);
		potencionalCoordinates = potencionalCoordinates.concat([[1,7],[1,6],[1,5],[1,4],[1,3],[1,2]]);
		potencionalCoordinates = potencionalCoordinates.concat([[2,2],[3,2],[4,2],[5,2]]);
		potencionalCoordinates = potencionalCoordinates.concat([[6,2],[6,3],[6,4],[6,5]]);
		potencionalCoordinates = potencionalCoordinates.concat([[6,6],[5,6],[4,6],[3,6]]);
		potencionalCoordinates = potencionalCoordinates.concat([[2,6],[2,5],[2,4],[2,3]]);
		potencionalCoordinates = potencionalCoordinates.concat([[3,3],[4,3]]);
		potencionalCoordinates = potencionalCoordinates.concat([[5,3],[5,4]]);
		potencionalCoordinates = potencionalCoordinates.concat([[5,5],[4,5]]);
		potencionalCoordinates = potencionalCoordinates.concat([[3,5],[3,4]]);
		potencionalCoordinates = potencionalCoordinates.concat([[4,4]]);
				
		for (let i = 0; i < potencionalCoordinates.length; i++)
		{
			if (cells[potencionalCoordinates[i][0]][potencionalCoordinates[i][1]].empty === true)
			{
				coordinates.push(potencionalCoordinates[i]);
			}
		}
		
		return coordinates;
	}
	
	//outwards order generator
	CreateOrderedListOfEmptyCoordinates_Outwards()
	{
		let cells = this.cells;
		let coordinates = [];
		
		let potencionalCoordinates = [];
		potencionalCoordinates = potencionalCoordinates.concat([[4,4]])
		
		potencionalCoordinates = potencionalCoordinates.concat([[5,4],[5,5]]);
		potencionalCoordinates = potencionalCoordinates.concat([[4,5],[3,5]]);
		potencionalCoordinates = potencionalCoordinates.concat([[3,4],[3,3]]);
		potencionalCoordinates = potencionalCoordinates.concat([[4,3],[5,3]]);
		potencionalCoordinates = potencionalCoordinates.concat([[6,3],[6,4],[6,5],[6,6]]);
		potencionalCoordinates = potencionalCoordinates.concat([[5,6],[4,6],[3,6],[2,6]]);
		potencionalCoordinates = potencionalCoordinates.concat([[2,5],[2,4],[2,3],[2,2]]);
		potencionalCoordinates = potencionalCoordinates.concat([[3,2],[4,2],[5,2],[6,2]]);
		potencionalCoordinates = potencionalCoordinates.concat([[7,2],[7,3],[7,4],[7,5],[7,6],[7,7]]);
		potencionalCoordinates = potencionalCoordinates.concat([[6,7],[5,7],[4,7],[3,7],[2,7],[1,7]]);
		potencionalCoordinates = potencionalCoordinates.concat([[1,6],[1,5],[1,4],[1,3],[1,2],[1,1]]);
		potencionalCoordinates = potencionalCoordinates.concat([[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]]);
		potencionalCoordinates = potencionalCoordinates.concat([[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]]);
		potencionalCoordinates = potencionalCoordinates.concat([[7,8],[6,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]]);
		potencionalCoordinates = potencionalCoordinates.concat([[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0]]);
		potencionalCoordinates = potencionalCoordinates.concat([[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]]);
				
		for (let i = 0; i < potencionalCoordinates.length; i++)
		{
			if (cells[potencionalCoordinates[i][0]][potencionalCoordinates[i][1]].empty === true)
			{
				coordinates.push(potencionalCoordinates[i]);
			}
		}
		
		return coordinates;
	}
	
	//draws sudoku grid - not info
	DrawSudoku(localContext)
	{
		this.DrawCells(localContext);
		this.DrawGrid(localContext);
	}
	
	//draws every cell
	DrawCells(localContext)
	{	
		let displayDeterministicInfo = checkbox2.GetValue();
		let displayGradient = checkbox3.GetValue();
	
		//iterate through all and call their respective draw function
		for (let i = 0; i < 9; i++)
		{		
			for (let j = 0; j < 9; j++)
			{
				this.cells[i][j].DrawCell(localContext, this.startX + i*this.cellWidth, this.startY + j*this.cellWidth, this.cellWidth, displayDeterministicInfo, displayGradient, this.numberOfClues);
			}
		}
	}
	
	//draws grid itself
	DrawGrid(localContext)
	{
		localContext.strokeStyle = "rgb(0, 0, 0)";

		//draw vertical and horizntal lines, 3x3 borders are twice as thick
		
		for (let i = 0; i < 10; i++)
		{
			if (i%3 === 0)
			{
				localContext.lineWidth = this.lineWidth*2;
			}
			else
			{
				localContext.lineWidth = this.lineWidth;
			}
				
			//this.lineWidth and not this.lineWidth/2 - border lines are twice as thick
			localContext.beginPath();
			localContext.moveTo(this.startX + i*this.cellWidth, this.startY - this.lineWidth);
			localContext.lineTo(this.startX + i*this.cellWidth, this.startY + this.width + this.lineWidth);
			localContext.stroke();
		}
		
		for (let i = 0; i < 10; i++)
		{
			if (i%3 === 0)
			{
				localContext.lineWidth = this.lineWidth*2;
			}
			else
			{
				localContext.lineWidth = this.lineWidth;
			}
			
			//this.lineWidth and not this.lineWidth/2 - border lines are twice as thick
			localContext.beginPath();
			localContext.moveTo(this.startX - this.lineWidth, this.startY + i*this.cellWidth);
			localContext.lineTo(this.startX + this.width + this.lineWidth, this.startY + i*this.cellWidth);
			localContext.stroke();
		}
	}
}
	







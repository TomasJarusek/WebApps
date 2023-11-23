//Arctic circle
//Ing. Tomas Jarusek, 1/2021

//single empty square
class EmptySquare
{
	constructor(startX, startY) 
	{
		this.startX = startX;
		this.startY = startY;
	}
	
	DrawEmptySquare(localContext, cellWidth, gridLineWidth, gridCenterX, gridCenterY, gridDimension, color, displayBlackBorder)
	{	
		let realStartX = Math.ceil(((gridDimension - 1)/2 - this.startX))*-1*cellWidth + gridCenterX + gridLineWidth/2;
		let realStartY = Math.ceil(((gridDimension - 1)/2 - this.startY))*-1*cellWidth + gridCenterY + gridLineWidth/2;
		
		let realWidth = cellWidth*2 - gridLineWidth;
		
		//squares have black borders made of another underlying square 
		//that overlaps half the thickness of the grid lines,
		//because if the black border is made only of visible underlying grid lines
		//it causes weird artifacts with scale down transformations
		
		//for animations, black border is disabled
		if (displayBlackBorder == true)
		{
			localContext.fillStyle = "rgb(0,0,0)";
			localContext.fillRect(realStartX-gridLineWidth/2, realStartY-gridLineWidth/2, realWidth+gridLineWidth, realWidth+gridLineWidth);
		}
	
		localContext.fillStyle = color;
		localContext.fillRect(realStartX, realStartY, realWidth, realWidth);
	}
}

//single domino piece
class DominoPiece
{
	constructor(startX, startY, orientation, direction) 
	{
		this.startX = startX;
		this.startY = startY;
		
		this.oldStartX = startX;
		this.oldStartY = startY;
		
		this.orientation = orientation;
		this.direction = direction;
		
		this.newPiece = true;
		this.valid = true;
	}
	
	ShiftStartPositionToCounteractGridSizeIncrease()
	{
		this.startX++;
		this.startY++;
		
		this.oldStartX++;
		this.oldStartY++;
	}
	
	InvalidatePiece()
	{
		this.valid = false;
	}
	
	//move piece one position in its direction (only internal variable)
	MoveDominoPiece()
	{
		this.oldStartX = this.startX;
		this.oldStartY = this.startY;
		
		if (this.orientation == "vertical")
		{
			if (this.direction == "left")
			{
				this.startX--;
			}
			else
			{
				this.startX++
			}
		}
		else
		{
			if (this.direction == "up")
			{
				this.startY--;
			}
			else
			{
				this.startY++;
			}
		}
	}
	
	DrawDominoPiece(localContext, cellWidth, gridLineWidth, gridCenterX, gridCenterY, gridDimension, color, displayArrow, displaySingleDominoColor, displayBlackBorder)
	{
		let realStartX = Math.ceil(((gridDimension - 1)/2 - this.startX))*-1*cellWidth + gridCenterX + gridLineWidth/2;
		let realStartY = Math.ceil(((gridDimension - 1)/2 - this.startY))*-1*cellWidth + gridCenterY + gridLineWidth/2;
		
		let realWidth;
		let realHeight;
		
		if (this.orientation == "vertical")
		{
			realWidth = cellWidth - gridLineWidth;
			realHeight = cellWidth*2 - gridLineWidth;
		}
		else
		{
			realWidth = cellWidth*2 - gridLineWidth;
			realHeight = cellWidth - gridLineWidth;
		}
		
		//domino pieces have black borders made of another underlying rectangle 
		//that overlaps half the thickness of the grid lines,
		//because if the black border is made only of visible underlying grid lines
		//it causes weird artifacts with scale down transformations	
		
		//for animations, black border is disabled
		if (displayBlackBorder == true)
		{
			localContext.fillStyle = "rgb(0,0,0)";	
			localContext.fillRect(realStartX-gridLineWidth/2, realStartY-gridLineWidth/2, realWidth+gridLineWidth, realHeight+gridLineWidth);
		}
		
		//draw the actual colored rectangle
		localContext.fillStyle = color;
		localContext.fillRect(realStartX, realStartY, realWidth, realHeight);
		
		if (displayArrow == true)
		{
			this.DrawArrow(localContext, realStartX, realStartY, realWidth, realHeight, cellWidth);
		}
	}
	
	DrawDominoPieceMoveAnimation(localContext, cellWidth, gridLineWidth, gridCenterX, gridCenterY, gridDimension, color, displayArrow, displaySingleDominoColor, progressPercentage)
	{
		let realOldStartX = Math.ceil(((gridDimension - 1)/2 - this.oldStartX))*-1*cellWidth + gridCenterX + gridLineWidth/2;
		let realOldStartY = Math.ceil(((gridDimension - 1)/2 - this.oldStartY))*-1*cellWidth + gridCenterY + gridLineWidth/2;
		
		let realNewStartX = Math.ceil(((gridDimension - 1)/2 - this.startX))*-1*cellWidth + gridCenterX + gridLineWidth/2;
		let realNewStartY = Math.ceil(((gridDimension - 1)/2 - this.startY))*-1*cellWidth + gridCenterY + gridLineWidth/2;
		
		let realCurrentStartX = realOldStartX + (realNewStartX - realOldStartX)*progressPercentage;
		let realCurrentStartY = realOldStartY + (realNewStartY - realOldStartY)*progressPercentage;
		
		let realWidth;
		let realHeight;
		
		if (this.orientation == "vertical")
		{
			realWidth = cellWidth - gridLineWidth;
			realHeight = cellWidth*2 - gridLineWidth;
		}
		else
		{
			realWidth = cellWidth*2 - gridLineWidth;
			realHeight = cellWidth - gridLineWidth;
		}
		
		if (this.orientation == "vertical")
		{
			realWidth = cellWidth - gridLineWidth;
			realHeight = cellWidth*2 - gridLineWidth;
		}
		else
		{
			realWidth = cellWidth*2 - gridLineWidth;
			realHeight = cellWidth - gridLineWidth;
		}
		
		//domino pieces have black borders made of another underlying rectangle 
		//that overlaps half the thickness of the grid lines,
		//because if the black border is made only of visible underlying grid lines
		//it causes weird artifacts with scale down transformations
		localContext.fillStyle = "rgb(0,0,0)";	
		localContext.fillRect(realCurrentStartX-gridLineWidth/2, realCurrentStartY-gridLineWidth/2, realWidth+gridLineWidth, realHeight+gridLineWidth);
		
		//draw the actual colored rectangle
		localContext.fillStyle = color;
		localContext.fillRect(realCurrentStartX, realCurrentStartY, realWidth, realHeight);
		
		if (displayArrow == true)
		{
			this.DrawArrow(localContext, realCurrentStartX, realCurrentStartY, realWidth, realHeight, cellWidth);
		}
	}
	
	DrawArrow(localContext, realStartX, realStartY, realWidth, realHeight, cellWidth)
	{
		localContext.fillStyle = "rgb(255,255,255)";

		let quarterCellWidth = cellWidth/4;
		let centerX = realStartX + realWidth/2;
		let centerY = realStartY + realHeight/2;
		
		if (this.orientation == "vertical")
		{
			if (this.direction == "left")
			{
				localContext.beginPath(centerX - quarterCellWidth, centerY);
				localContext.moveTo(centerX + quarterCellWidth, centerY - quarterCellWidth);
				localContext.lineTo(centerX + quarterCellWidth, centerY + quarterCellWidth);
				localContext.lineTo(centerX - quarterCellWidth, centerY);
				localContext.fill();
			}
			else
			{
				localContext.beginPath(centerX + quarterCellWidth, centerY);
				localContext.moveTo(centerX - quarterCellWidth, centerY - quarterCellWidth);
				localContext.lineTo(centerX - quarterCellWidth, centerY + quarterCellWidth);
				localContext.lineTo(centerX + quarterCellWidth, centerY);
				localContext.fill();
			}
		}
		else
		{
			if (this.direction == "up")
			{
				localContext.beginPath(centerX, centerY - quarterCellWidth);
				localContext.moveTo(centerX - quarterCellWidth, centerY + quarterCellWidth);
				localContext.lineTo(centerX + quarterCellWidth, centerY + quarterCellWidth);
				localContext.lineTo(centerX, centerY - quarterCellWidth);
				localContext.fill();
			}
			else
			{
				localContext.beginPath(centerX, centerY + quarterCellWidth);
				localContext.moveTo(centerX - quarterCellWidth, centerY - quarterCellWidth);
				localContext.lineTo(centerX + quarterCellWidth, centerY - quarterCellWidth);
				localContext.lineTo(centerX, centerY + quarterCellWidth);
				localContext.fill();
			}
		}
	}
}

class AztecDiamondBoard
{
	constructor(centerX, centerY, stepAnimationDurations) 
	{
		//time
		this.justStarted = true;
		
		this.animationTime = 0;
		this.programTime = 0;
		
		//these are processed in order
		this.animationCalendar = [];
		this.eventCalendar = [];
	
		//fill calendars with events and animations
		if (checkbox1.GetValue() == false)
		{
			this.CreateAnimationsAndEvents_SlowMode();
			this.newGridLayerAppearTime = 8000;
		}
		else
		{
			this.CreateAnimationsAndEvents_FastMode();
			this.newGridLayerAppearTime = 3000;
		}
	
		//grid logic variables
		
		//grid
		//-1 - position not ocupied by diamond
		//null - empty diamond position
		//others are references to domino pieces/empty squares
		this.grid = [[null, null],[null, null]];
		this.oldGridDimension = 0;
		this.gridDimension = 2;
		
		this.emptySquares = [];
		this.dominoPieces = [];
		
		//display variables
		
		//center of grid
		this.centerX = centerX;
		this.centerY = centerY;
		
		//distance from canvas border to diamond
		this.border = 20;
		
		this.gridCellWidth = 100;
		this.gridLineWidth = 5;
		
		//backorund color value
		this.backgroundGreyscale = 245;
		
		//user options
		this.displayArrow;
		this.displaySingleDominoColor;
		this.verticalDominoProbability;
		this.animationStarted = false;
	}
	
	StartAnimation()
	{
		this.animationStarted = true;
	}
	
	//animation engine
	ManageAnimation(localContext, deltaTime)
	{
		//if there was no change from the previous frame - do nothing
		if (deltaTime == 0)
		{
			return;
		}
		
		//transfering user inputs to internal variables
		this.displayArrow = checkbox2.GetValue();
		this.displaySingleDominoColor = checkbox3.GetValue();
		this.verticalDominoProbability = slider2.GetValue();
		
		if (this.animationStarted == true)
		{	
			//adjusting delta time will result in slower/faster animation
			deltaTime = deltaTime*slider1.GetValue();
			
			//is this first frame?
			if (this.justStarted == true)
			{
				//if yes, animation time and program time are going to be zero
				
				this.justStarted = false;
			}
			else
			{
				//if not - add delta time to animation and program time
				
				this.animationTime += deltaTime;
				this.programTime += deltaTime;
			}
			
			//we are going to be executing events until we catch up to the present time
			while (true)
			{
				//is animation time bigger than total running time of one animation block?
				if (this.animationTime >= this.totalAnimationTime)
				{
					//if yes, we complete all events from current animation block
					
					this.ExecuteAllEventsUpToCurrentAnimationTime(this.totalAnimationTime);
					
					//then reset - substract animation block time from current time and set completions of all events to false
					this.animationTime -= this.totalAnimationTime;	
					this.ResetEventCompletions();
				}
				else
				{	
					//if not - just execute all events up to present time 
					
					this.ExecuteAllEventsUpToCurrentAnimationTime(this.animationTime);
					
					break;
				}
			}
		}
		
		//we are done with events, now we have to draw current state of the board

		//ulozeni transformacni matice
		localContext.save();
		
		this.DrawPreparation(localContext, this.programTime);
		
		//find all animations that should be playing at present time
		let animationsPlayingRightNow = this.FindAllAnimationsThatArePlayingRightNow(this.animationTime);
		
		//draw them
		this.DrawAllAnimationsThatArePlayingRightNow(localContext, animationsPlayingRightNow, this.animationTime)
		
		//reset transformacni matice
		localContext.restore();
	}
	
	//slow mode events
	CreateAnimationsAndEvents_SlowMode()
	{
		this.animationCalendar.push([0, 8000, "displayGrid"]);
		this.animationCalendar.push([0, 1000, "emptySquaresAppear"]);
		this.animationCalendar.push([1000, 2000, "displayEmptySquares"]);
		this.animationCalendar.push([2000, 3000, "emptySquaresDisappear"]);
		this.animationCalendar.push([2000, 3000, "newValidDominoPiecesAppear"]);
		this.animationCalendar.push([4000, 5000, "discolorNotValidDominoPieces"]);
		this.animationCalendar.push([5000, 6000, "displayNotValidDominoPieces"]);
		this.animationCalendar.push([6000, 7000, "notValidDominoPiecesDisappear"]);
		this.animationCalendar.push([8000, 9000, "gridLayerAppear"]);
		this.animationCalendar.push([9000, 12000, "displayGrid"]);
		this.animationCalendar.push([0, 10000, "displayValidNotNewDominoPieces"]);
		this.animationCalendar.push([10000, 11000, "dominoPiecesMovement"]);
		this.animationCalendar.push([11000, 12000, "displayValidNotNewDominoPieces"]);
		
		this.eventCalendar.push([0, "findAllEmptySquares", false]);
		this.eventCalendar.push([2000, "replaceEmptySquaresWithDominoPiecesOnBoard", false]);
		this.eventCalendar.push([3000, "eraseEmptySquares", false]);
		this.eventCalendar.push([3000, "setNewDominoPiecesToNotNew", false]);
		this.eventCalendar.push([4000, "findNotValidDominoPiecesAndInvalidateThem", false]);		
		this.eventCalendar.push([7000, "eraseNotValidDominoPieces", false]);
		this.eventCalendar.push([8000, "increaseGridSize", false]);
		this.eventCalendar.push([10000, "moveDominoPiecesToNewPositions", false]);
		
		this.totalAnimationTime = 12000;	
	}
	
	//fast mode events
	CreateAnimationsAndEvents_FastMode()
	{
		this.animationCalendar.push([0, 3000, "displayGrid"]);
		this.animationCalendar.push([0, 1000, "newValidDominoPiecesAppear"]);
		this.animationCalendar.push([2000, 3000, "notValidDominoPiecesDisappear_TrueColor"]);
		this.animationCalendar.push([3000, 4000, "gridLayerAppear"]);
		this.animationCalendar.push([4000, 6000, "displayGrid"]);
		this.animationCalendar.push([0, 4000, "displayValidNotNewDominoPieces"]);
		this.animationCalendar.push([4000, 5000, "dominoPiecesMovement"]);
		this.animationCalendar.push([5000, 6000, "displayValidNotNewDominoPieces"]);
		
		this.eventCalendar.push([0, "findAllEmptySquares", false]);
		this.eventCalendar.push([0, "replaceEmptySquaresWithDominoPiecesOnBoard", false]);
		this.eventCalendar.push([0, "eraseEmptySquares", false]);
		this.eventCalendar.push([1000, "setNewDominoPiecesToNotNew", false]);
		this.eventCalendar.push([2000, "findNotValidDominoPiecesAndInvalidateThem", false]);			
		this.eventCalendar.push([3000, "increaseGridSize", false]);
		this.eventCalendar.push([3100, "eraseNotValidDominoPieces", false]);
		this.eventCalendar.push([4000, "moveDominoPiecesToNewPositions", false]);
		
		this.totalAnimationTime = 6000;	
	}
	
	//APLICATION - LOGIC--------------------------------------------------------------------------------------------------------
	
	IncreaseGridSize()
	{
		//we are going to increase the grid size by adding new cells to outer edges
		//that way, all existing things in grid are going to stay at te same position relative to the center
		
		let currentGrid = this.grid;
		
		//we are going to add new left and right row
		let newEmptyLeftRow = [];
		let newEmptyRightRow = [];
		
		for (let i = 0; i < this.gridDimension; i++)
		{
			newEmptyLeftRow.push(-1);
			newEmptyRightRow.push(-1);
		}
		
		currentGrid.unshift(newEmptyLeftRow);
		currentGrid.push(newEmptyRightRow);
		
		//then, we are going to insert new cells on the bottom and top of the old diamond
		//we start from the bottom because if we started from the top, the indexes of
		//of the bottom rows would be changed
		
		//bottom left
		for (let i = 0; i < (this.gridDimension + 2)/2; i++)
		{
			//console.log(i + this.gridDimension/2);
			currentGrid[i].splice(i + this.gridDimension/2, 0, null);	
		}
		
		//bottom right
		for (let i = (this.gridDimension + 2)/2; i < (this.gridDimension + 2); i++)
		{
			//console.log(((this.gridDimension + 1) - i) + this.gridDimension/2);
			currentGrid[i].splice(((this.gridDimension + 1) - i) + this.gridDimension/2, 0, null);	
		}
		
		//top left
		for (let i = 0; i < (this.gridDimension + 2)/2; i++)
		{
			//console.log(this.gridDimension/2 - i);
			currentGrid[i].splice(this.gridDimension/2 - i, 0, null);	
		}
		
		//top right
		for (let i = (this.gridDimension + 2)/2; i < (this.gridDimension + 2); i++)
		{
			//console.log(i - (this.gridDimension + 2)/2);
			currentGrid[i].splice(i - (this.gridDimension + 2)/2, 0, null);	
		}
		
		//increase grid dimension
		this.oldGridDimension = this.gridDimension;
		this.gridDimension += 2;
		
		//it is necessary to shift the domino pieces, because even though
		//their relative positions to the center did not change, their real indexes did
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			this.dominoPieces[i].ShiftStartPositionToCounteractGridSizeIncrease();
		}
	}
	
	FindAllEmptySquares()
	{
		let newEmptySquare;
		
		//we are going to step through the grid row by row
		//because squares are 2x2, we don't have to check last row and column
		for (let i = 0; i < this.gridDimension - 1; i++)
		{
			for (let j = 0; j < this.gridDimension - 1; j++)
			{
				//does empty square start from this position? (start to right, start to bottom)
				if (this.DoesEmptySquareStartFromThisCoordinate(j, i) == true)
				{
					//create new square
					newEmptySquare = new EmptySquare(j, i);
					
					//place it into the board
					this.PlaceEmptySquareIntoBoard(j, i, newEmptySquare);
					
					//add it to global list
					this.emptySquares.push(newEmptySquare);
				}
			}	
		}
	}
	
	DoesEmptySquareStartFromThisCoordinate(x, y)
	{
		//start to right, start to bottom
		
		if (this.grid[x][y] == null && this.grid[x + 1][y] == null && this.grid[x][y + 1] == null && this.grid[x + 1][y + 1] == null)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	PlaceEmptySquareIntoBoard(x, y, emptySquare)
	{
		//start to right, start to bottom
		
		this.grid[x][y] = emptySquare;
		this.grid[x + 1][y] = emptySquare;
		this.grid[x][y + 1] = emptySquare;
		this.grid[x + 1][y + 1] = emptySquare;
	}
	
	ReplaceEmptySquaresWithDominoPiecesOnBoard()
	{
		//for every square, two dominos are going to be created in its place
		for (let i = 0; i < this.emptySquares.length; i++)
		{
			this.GenerateTwoDominoPiecesWithRandomOrientation(this.emptySquares[i]);
		}
	}
	
	GenerateTwoDominoPiecesWithRandomOrientation(emptySquare)
	{
		//first, new domino pieces are generated with random oriention
		//in the position of empty square
		
		let orientation = Math.random()*100;
		
		let firstDominoPiece;
		let secondDominoPiece;
		
		if (orientation < this.verticalDominoProbability)
		{
			firstDominoPiece = new DominoPiece(emptySquare.startX, emptySquare.startY, "vertical", "left");
			secondDominoPiece = new DominoPiece(emptySquare.startX + 1, emptySquare.startY, "vertical", "right");
		}
		else
		{
			firstDominoPiece = new DominoPiece(emptySquare.startX, emptySquare.startY, "horizontal", "up");
			secondDominoPiece = new DominoPiece(emptySquare.startX, emptySquare.startY + 1, "horizontal", "down");
		}
		
		//then the domino pieces replace empty square in the grid
		this.PlaceDominoPieceIntoBoard(firstDominoPiece);
		this.PlaceDominoPieceIntoBoard(secondDominoPiece);
		
		//new domino pices are added to global list
		this.dominoPieces.push(firstDominoPiece);
		this.dominoPieces.push(secondDominoPiece);
	}
	
	PlaceDominoPieceIntoBoard(dominoPiece)
	{
		if (dominoPiece.orientation == "vertical")
		{
			this.grid[dominoPiece.startX][dominoPiece.startY] = dominoPiece;
			this.grid[dominoPiece.startX][dominoPiece.startY + 1] = dominoPiece;
		}
		else
		{
			this.grid[dominoPiece.startX][dominoPiece.startY] = dominoPiece;
			this.grid[dominoPiece.startX + 1][dominoPiece.startY] = dominoPiece;
		}
	}
	
	SetNewDominoPiecesToNotNew()
	{
		//all pieces that were created in current cycle are no longer considered new
		
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			if (this.dominoPieces[i].newPiece == true)
			{
				this.dominoPieces[i].newPiece = false;
			}
		}
	}
	
	FindNotValidDominoPiecesAndInvalidateThem()
	{
		//cycle through all grid positions and check whether the square from this position contains opposite domino pieces  
		//because squares are 2x2, we don't have to check last row and column
		for (let i = 0; i < this.gridDimension - 1; i++)
		{
			for (let j = 0; j < this.gridDimension - 1; j++)
			{
				this.CheckIfPositionContainsOppositeDominoPieceAndInvalidate(j, i);
			}
		}
	}
	
	CheckIfPositionContainsOppositeDominoPieceAndInvalidate(x, y)
	{
		let topLeft = this.grid[x][y];
		let topRight = this.grid[x + 1][y];
		let bottomLeft = this.grid[x][y + 1];
		let bottomRight = this.grid[x + 1][y + 1];
		
		//domino pieces have to be on all positions
		if (topLeft instanceof DominoPiece && topRight instanceof DominoPiece && bottomLeft instanceof DominoPiece && bottomRight instanceof DominoPiece)
		{
			if (topLeft.orientation == "vertical")
			{
				//square has to consist of two pieces
				if (topLeft == bottomLeft && topRight == bottomRight)
				{
					//direction is opposite
					if (topLeft.direction == "right" && topRight.direction == "left")
					{
						topLeft.valid = false;
						topRight.valid = false;
						
						this.grid[x][y] = null;
						this.grid[x + 1][y] = null;
						this.grid[x][y + 1] = null;
						this.grid[x + 1][y + 1] = null;
					}
				}
			}
			else
			{
				//square has to consist of two pieces
				if (topLeft == topRight && bottomLeft == bottomRight)
				{
					//direction is opposite
					if (topLeft.direction == "down" && bottomLeft.direction == "up")
					{
						topLeft.valid = false;
						bottomLeft.valid = false;
						
						this.grid[x][y] = null;
						this.grid[x + 1][y] = null;
						this.grid[x][y + 1] = null;
						this.grid[x + 1][y + 1] = null;
					}
				}
			}

		}
	}
	
	EraseNotValidDominoPieces()
	{
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			if (this.dominoPieces[i].valid == false)
			{
				this.dominoPieces.splice(i, 1);
				
				//index of deleted element now contains new not checked element
				i--;
			}
		}
	}
	
	MoveDominoPiecesToNewPositions()
	{
		//move all domino piece classes to new coordinates
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			this.dominoPieces[i].MoveDominoPiece();
		}
		
		//set their old positions to null in the grid
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			this.RemoveDominoPieceFromOldPositionOnTheBoard(this.dominoPieces[i]);
		}
		
		//set their new positions to their reference in the grid
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			this.PutDominoPiecetoNewPositionOnTheBoard(this.dominoPieces[i]);
		}
	}
	
	RemoveDominoPieceFromOldPositionOnTheBoard(dominoPiece)
	{
		if (dominoPiece.orientation == "vertical")
		{
			this.grid[dominoPiece.oldStartX][dominoPiece.oldStartY] = null;
			this.grid[dominoPiece.oldStartX][dominoPiece.oldStartY + 1] = null;
		}
		else
		{
			this.grid[dominoPiece.oldStartX][dominoPiece.oldStartY] = null;
			this.grid[dominoPiece.oldStartX + 1][dominoPiece.oldStartY] = null;
		}
	}
	
	PutDominoPiecetoNewPositionOnTheBoard(dominoPiece)
	{	
		if (dominoPiece.orientation == "vertical")
		{
			this.grid[dominoPiece.startX][dominoPiece.startY] = dominoPiece;
			this.grid[dominoPiece.startX][dominoPiece.startY + 1] = dominoPiece;
		}
		else
		{
			this.grid[dominoPiece.startX][dominoPiece.startY] = dominoPiece;
			this.grid[dominoPiece.startX + 1][dominoPiece.startY] = dominoPiece;
		}
	}
	
	//ANIMATION - EVENTS--------------------------------------------------------------------------------------------------------
	
	ExecuteAllEventsUpToCurrentAnimationTime(animationTime)
	{
		//execute all events in order up to current time
		//already done events are excluded
		for (let i = 0; i < this.eventCalendar.length; i++)
		{
			if (this.eventCalendar[i][0] <= animationTime && this.eventCalendar[i][2] == false)
			{
				this.ExecuteEvent(this.eventCalendar[i][1]);
				
				//after event is executed, set its completion parameter to true
				this.eventCalendar[i][2] = true;
			}						
		}
	}
	
	ResetEventCompletions()
	{
		//every events completion is set to false
		for (let i = 0; i < this.eventCalendar.length; i++)
		{
			this.eventCalendar[i][2] = false;
		}
	}
	
	ExecuteEvent(eventId)
	{
		if (eventId == "increaseGridSize")
		{
			this.ExecuteIncreaseGridSize();
		}
		else if (eventId == "replaceEmptySquaresWithDominoPiecesOnBoard")
		{
			this.ExecuteReplaceEmptySquaresWithDominoPiecesOnBoard();
		}
		else if (eventId == "findAllEmptySquares")
		{
			this.ExecuteFindAllEmptySquares();
		}
		else if (eventId == "eraseEmptySquares")
		{
			this.ExecuteEraseEmptySquares();
		}
		else if (eventId == "findNotValidDominoPiecesAndInvalidateThem")
		{
			this.ExecuteFindNotValidDominoPiecesAndInvalidateThem();
		}
		else if (eventId == "setNewDominoPiecesToNotNew")
		{
			this.ExecuteSetNewDominoPiecesToNotNew();
		}
		else if (eventId == "eraseNotValidDominoPieces")
		{
			this.ExecuteEraseNotValidDominoPieces();
		}
		else if (eventId == "moveDominoPiecesToNewPositions")
		{
			this.ExecuteMoveDominoPiecesToNewPositions();
		}	
	}
	
	ExecuteEraseEmptySquares()
	{
		this.emptySquares = [];
	}
	
	ExecuteFindAllEmptySquares()
	{
		this.FindAllEmptySquares();
	}
	
	ExecuteReplaceEmptySquaresWithDominoPiecesOnBoard()
	{
		this.ReplaceEmptySquaresWithDominoPiecesOnBoard();
	}
	
	ExecuteIncreaseGridSize()
	{	
		this.IncreaseGridSize();
	}
	
	ExecuteFindNotValidDominoPiecesAndInvalidateThem()
	{
		this.FindNotValidDominoPiecesAndInvalidateThem();
	}
	
	ExecuteSetNewDominoPiecesToNotNew()
	{
		this.SetNewDominoPiecesToNotNew();
	}
	
	ExecuteEraseNotValidDominoPieces()
	{
		this.EraseNotValidDominoPieces();
	}
	
	ExecuteMoveDominoPiecesToNewPositions()
	{
		this.MoveDominoPiecesToNewPositions();
	}
	
	//ANIMATION - DRAW----------------------------------------------------------------------------------------------------------
	
	FindAllAnimationsThatArePlayingRightNow(animationTime)
	{
		let animationsPlayingRightNow = [];
		
		//cycle through all animations and check, whether current time is inside the animation duration
		
		for (let i = 0; i < this.animationCalendar.length; i++)
		{
			if (animationTime >= this.animationCalendar[i][0] && animationTime < this.animationCalendar[i][1])
			{			
				animationsPlayingRightNow.push(this.animationCalendar[i]);
			}
		}
		
		return animationsPlayingRightNow;
	}
	
	DrawAllAnimationsThatArePlayingRightNow(localContext, animationsPlayingRightNow, animationTime)
	{
		for (let i = 0; i < animationsPlayingRightNow.length; i++)
		{
			this.DrawAnimation(localContext, animationsPlayingRightNow[i][2], animationTime);
		}
	}
	
	//draws animation specified by id
	DrawAnimation(localContext, animationId, animationTime)
	{
		let currentAnimation;
		
		//find relevant animation in the list
		for (let i = 0; i < this.animationCalendar.length; i++)
		{
			if (this.animationCalendar[i][2] == animationId)
			{
				currentAnimation = this.animationCalendar[i];
				
				break;
			}
		}
		
		//calculate percentage of completion of current animation(0-1)
		let progressPercentage = (animationTime - currentAnimation[0])/(currentAnimation[1] - currentAnimation[0]);
		
		//choose appropriate animation
		if (animationId == "gridLayerAppear")
		{
			this.DrawGridLayerAppearAnimation(localContext, progressPercentage);
		}
		else if (animationId == "displayGrid")
		{
			this.DrawGrid(localContext, this.gridDimension);
		}
		else if (animationId == "emptySquaresAppear")
		{
			this.DrawEmptySquaresAppearAnimation(localContext, progressPercentage);
		}
		else if (animationId == "displayEmptySquares")
		{
			this.DrawEmptySquares(localContext);		
		}
		else if (animationId == "emptySquaresDisappear")
		{
			this.DrawEmptySquaresDisappearAnimation(localContext, progressPercentage);	
		}
		else if (animationId == "newValidDominoPiecesAppear")
		{
			this.DrawNewValidDominoPiecesAppearAnimation(localContext, progressPercentage);	
		}
		else if (animationId == "discolorNotValidDominoPieces")
		{
			this.DrawDiscolorNotValidDominoPiecesAnimation(localContext, progressPercentage);	
		}
		else if (animationId == "displayNotValidDominoPieces")
		{
			this.DrawNotValidDominoPieces(localContext);	
		}
		else if (animationId == "notValidDominoPiecesDisappear")
		{
			this.DrawNotValidDominoPiecesDisappearAnimation(localContext, progressPercentage);	
		}
		else if (animationId == "displayValidNotNewDominoPieces")
		{
			this.DrawValidNotNewDominoPieces(localContext);
		}
		else if (animationId == "dominoPiecesMovement")
		{
			this.DrawDominoPiecesMovementAnimation(localContext, progressPercentage);	
		}
		else if (animationId == "notValidDominoPiecesDisappear_TrueColor")
		{
			this.DrawNotValidDominoPiecesDisappear_TrueColorAnimation(localContext, progressPercentage);	
		}	
	}
	
	//draws grid of current dimension
	DrawGrid(localContext, dimension)
	{
		localContext.lineWidth = this.gridLineWidth;
		
		let halfDimension = dimension/2;
		let halfLineWidth = this.gridLineWidth/2;
		
		//middle lines
		localContext.beginPath();
		localContext.moveTo(this.centerX, this.centerY + halfDimension*this.gridCellWidth + halfLineWidth);
		localContext.lineTo(this.centerX, this.centerY - halfDimension*this.gridCellWidth - halfLineWidth);
		localContext.stroke();
		
		localContext.beginPath();
		localContext.moveTo(this.centerX + halfDimension*this.gridCellWidth + halfLineWidth, this.centerY);
		localContext.lineTo(this.centerX - halfDimension*this.gridCellWidth - halfLineWidth, this.centerY);
		localContext.stroke();
		
		//vertical lines
		for (let i = 0; i < halfDimension; i++)
		{
			localContext.beginPath();
			localContext.moveTo(this.centerX + (i+1)*this.gridCellWidth, this.centerY + (halfDimension-i)*this.gridCellWidth + halfLineWidth);
			localContext.lineTo(this.centerX + (i+1)*this.gridCellWidth, this.centerY - (halfDimension-i)*this.gridCellWidth - halfLineWidth);
			localContext.stroke();
			
			localContext.beginPath();
			localContext.moveTo(this.centerX - (i+1)*this.gridCellWidth, this.centerY + (halfDimension-i)*this.gridCellWidth + halfLineWidth);
			localContext.lineTo(this.centerX - (i+1)*this.gridCellWidth, this.centerY - (halfDimension-i)*this.gridCellWidth - halfLineWidth);
			localContext.stroke();
		}
		
		//horizontal lines
		for (let i = 0; i < halfDimension; i++)
		{
			localContext.beginPath();
			localContext.moveTo(this.centerX + (halfDimension-i)*this.gridCellWidth + halfLineWidth, this.centerY + (i+1)*this.gridCellWidth);
			localContext.lineTo(this.centerX - (halfDimension-i)*this.gridCellWidth - halfLineWidth, this.centerY + (i+1)*this.gridCellWidth);
			localContext.stroke();
			
			localContext.beginPath();
			localContext.moveTo(this.centerX + (halfDimension-i)*this.gridCellWidth + halfLineWidth, this.centerY - (i+1)*this.gridCellWidth);
			localContext.lineTo(this.centerX - (halfDimension-i)*this.gridCellWidth - halfLineWidth, this.centerY - (i+1)*this.gridCellWidth);
			localContext.stroke();
		}
	}
	
	//draws animation of new grid layer appearing
	DrawGridLayerAppearAnimation(localContext, progressPercentage)
	{
		//not using transparency here, because vertical and horizontal lines overlap,
		//which means that the overlaps are darker and they are visible
		//so we are going to interpolate grid color and backround color instead
		let interpolatedColor = this.InterpolateColor(this.backgroundGreyscale, this.backgroundGreyscale, this.backgroundGreyscale, 0, 0, 0, progressPercentage);
		
		//first, we are going to draw bigger grid with interpolated color
		localContext.strokeStyle = interpolatedColor;	
		this.DrawGrid(localContext, this.gridDimension);
		
		//next we overlap it with not interpolated grid of previous dimension
		//so only the outer layers are appearing
		localContext.strokeStyle = "rgb(0, 0, 0)";
		this.DrawGrid(localContext, this.oldGridDimension);
	}
	
	DrawEmptySquares(localContext)
	{
		for (let i = 0; i < this.emptySquares.length; i++)
		{
			this.emptySquares[i].DrawEmptySquare(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, "rgb(255,140,0)", true);
		}
	}
	
	DrawEmptySquaresAppearAnimation(localContext, progressPercentage)
	{
		//appear effect is done here by changing transparency for all squares at once
		
		localContext.globalAlpha = progressPercentage;
		
		for (let i = 0; i < this.emptySquares.length; i++)
		{
			//for animations, black border is disabled
			this.emptySquares[i].DrawEmptySquare(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, "rgb(255,140,0)", false);
		}
		
		localContext.globalAlpha = 1.0;
	}
	
	DrawEmptySquaresDisappearAnimation(localContext, progressPercentage)
	{
		//disappear effect is done here by changing transparency for all squares at once
		
		localContext.globalAlpha = 1 - progressPercentage;
		
		for (let i = 0; i < this.emptySquares.length; i++)
		{
			//for animations, black border is disabled
			this.emptySquares[i].DrawEmptySquare(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, "rgb(255,140,0)", false);
		}
		
		localContext.globalAlpha = 1.0;
	}
	
	DrawValidNotNewDominoPieces(localContext)
	{
		let dominoPieceColor;
		
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			if (this.dominoPieces[i].valid == true && this.dominoPieces[i].newPiece == false)
			{
				dominoPieceColor = this.ColorArrayToString(this.ChooseColorForDominoPiece(this.dominoPieces[i]));
				
				this.dominoPieces[i].DrawDominoPiece(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, dominoPieceColor, this.displayArrow, this.displaySingleDominoColor, true);
			}	
		}
	}
	
	DrawNewValidDominoPiecesAppearAnimation(localContext, progressPercentage)
	{	
		let dominoPieceColor;
	
		localContext.globalAlpha = progressPercentage;
		
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			if (this.dominoPieces[i].valid == true && this.dominoPieces[i].newPiece == true)
			{	
				dominoPieceColor =  this.ColorArrayToString(this.ChooseColorForDominoPiece(this.dominoPieces[i]));
			
				this.dominoPieces[i].DrawDominoPiece(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, dominoPieceColor, this.displayArrow, this.displaySingleDominoColor, false);
			}	
		}
		
		localContext.globalAlpha = 1.0;
	}
	
	DrawDiscolorNotValidDominoPiecesAnimation(localContext, progressPercentage)
	{
		let dominoPieceColor;
		let interpolatedColor;
		
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			if (this.dominoPieces[i].valid == false)
			{
				dominoPieceColor = this.ChooseColorForDominoPiece(this.dominoPieces[i]);
				interpolatedColor = this.InterpolateColor(dominoPieceColor[0], dominoPieceColor[1], dominoPieceColor[2], 0, 0, 0, progressPercentage);
				
				this.dominoPieces[i].DrawDominoPiece(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, interpolatedColor, this.displayArrow, this.displaySingleDominoColor, false);
			}	
		}

	}
	
	DrawNotValidDominoPieces(localContext)
	{
		let dominoPieceColor = "rgb(0,0,0)";
		
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			if (this.dominoPieces[i].valid == false && this.dominoPieces[i].newPiece == false)
			{			
				this.dominoPieces[i].DrawDominoPiece(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, dominoPieceColor, this.displayArrow, this.displaySingleDominoColor, true);
			}	
		}
	}
	
	DrawNotValidDominoPiecesDisappearAnimation(localContext, progressPercentage)
	{
		let dominoPieceColor = "rgb(0,0,0)";
		
		localContext.globalAlpha = 1 - progressPercentage;
		
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			if (this.dominoPieces[i].valid == false && this.dominoPieces[i].newPiece == false)
			{
				this.dominoPieces[i].DrawDominoPiece(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, dominoPieceColor, this.displayArrow, this.displaySingleDominoColor, false);
			}	
		}
		
		localContext.globalAlpha = 1.0;
	}
	
	DrawNotValidDominoPiecesDisappear_TrueColorAnimation(localContext, progressPercentage)
	{
		let dominoPieceColor;
		
		localContext.globalAlpha = 1 - progressPercentage;
		
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			if (this.dominoPieces[i].valid == false && this.dominoPieces[i].newPiece == false)
			{
				dominoPieceColor =  this.ColorArrayToString(this.ChooseColorForDominoPiece(this.dominoPieces[i]));
				
				this.dominoPieces[i].DrawDominoPiece(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, dominoPieceColor, this.displayArrow, this.displaySingleDominoColor, false);
			}	
		}
		
		localContext.globalAlpha = 1.0;
	}

	DrawDominoPiecesMovementAnimation(localContext, progressPercentage)
	{
		let dominoPieceColor;
		
		for (let i = 0; i < this.dominoPieces.length; i++)
		{
			dominoPieceColor =  this.ColorArrayToString(this.ChooseColorForDominoPiece(this.dominoPieces[i]));
			
			this.dominoPieces[i].DrawDominoPieceMoveAnimation(localContext, this.gridCellWidth, this.gridLineWidth, this.centerX, this.centerY, this.gridDimension, dominoPieceColor, this.displayArrow, this.displaySingleDominoColor, progressPercentage);
		}
	}
	
	ChooseColorForDominoPiece(dominoPiece)
	{
		if (this.displaySingleDominoColor == true)
		{
			return [200,200,200];
		}
		else
		{
			if (dominoPiece.direction == "left")
			{
				return [255,210,74];
			}
			else if (dominoPiece.direction == "right")
			{
				return [243,74,41];
			}
			else if (dominoPiece.direction == "up")
			{
				return [104,152,255];
			}
			else if (dominoPiece.direction == "down")
			{
				return [65,195,33];
			}	
		}
	}
	
	ColorArrayToString(colorArray)
	{
		return "rgb(" + colorArray[0].toString() + "," + colorArray[1].toString() + "," + colorArray[2].toString() + ")";
	}

	InterpolateColor(firstColorR, firstColorG, firstColorB, secondColorR, secondColorG, secondColorB, interpolationPercentage)
	{
		let finalColorR = firstColorR + (secondColorR - firstColorR)*interpolationPercentage;
		let finalColorG = firstColorG + (secondColorG - firstColorG)*interpolationPercentage; 
		let finalColorB = firstColorB + (secondColorB - firstColorB)*interpolationPercentage;
		
		return "rgb(" + finalColorR.toString() + "," + finalColorG.toString() + "," + finalColorB.toString() + ")";
	}
	
	DrawPreparation(localContext, programTime)
	{
		//precalculate current transform variables so that when new gird layer appears,
		//top and bottom of the diamond are going to be exactly at the border
		
		let diamondHalfLenght = startCanvasHeight/2 - this.border;
		let numberOfcellsAtTheStartOfAnimation = 2;

		let transformScale = diamondHalfLenght/(this.gridCellWidth*(numberOfcellsAtTheStartOfAnimation+(programTime-this.newGridLayerAppearTime)/this.totalAnimationTime));
		let transformMoveX = startCanvasWidth/2;
		let transformMoveY = startCanvasHeight/2;
		
		//transform
		context.transform(1, 0, 0, 1, transformMoveX, transformMoveY);	
		context.transform(transformScale, 0, 0, transformScale, 0, 0);
		context.transform(1, 0, 0, 1, -transformMoveX, -transformMoveY);
	}
}














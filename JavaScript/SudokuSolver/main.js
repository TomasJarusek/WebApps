//Sudoku solver
//Ing. Tomas Jarusek, 9/2021

window.onload = function()  
{
	Init();
	ScaleCanvas();
};
window.onresize = ScaleCanvas;

let sudoku;
let sudokuSolver;

let sudoku1;
let slider1;
let doubleButton1;
let button3;
let slider2;
let dropDownMenu1 ;
let checkbox1;
let slider3;
let checkbox2;
let checkbox3;

let previousFrameTime = 0;
let currentFrameTime = 0;
let deltaTime;

//inserts HTML elements
function InsertHTMLElements()
{
	sudoku1 = new SudokuInput("sudoku1");
	slider1 = new CompleteInputBox("slider1", 0, 81, 1, 30, " clues", "Number of clues:");
	doubleButton1 = new DoubleButton("doubleButton1", "Button1Function()", "Button2Function()", "Generate sudoku", "Initialize sudoku");
	button3	= new Button("button3", "Button3Function()","Find solution");
	slider2 = new CompleteInputBox("slider2", 0.01, 10, 0.01, 1, "", "Steps per frame:");
	dropDownMenu1 = new CompleteDropdownMenu("dropDownMenu1", ["Row by row", "Column by column", "3x3 by 3x3", "Diagonal", "Checkerboard", "Inwards", "Outwards", "Random"], "Next empty cell choosing method (after init):");
	checkbox1 = new CompleteCheckbox("checkbox1", false, "Use simple deterministic rules (after init): ");
	slider3 = new CompleteInputBox("slider3", 1, 9, 1, 3, "", "Maximum gap to fill deterministically (after init):");
	checkbox2 = new CompleteCheckbox("checkbox2", false, "Display deterministic info: ");
	checkbox3 = new CompleteCheckbox("checkbox3", false, "Display color gradient: ");
}

//synchronization of HTML elements
function SychnronizeHTMLElements()
{
	slider1.SynchronizeInputs();
	slider2.SynchronizeInputs();
	slider3.SynchronizeInputs();
}

//inicialization
function Init()
{
	//canvas is declared globally
	context = canvas.getContext('2d');
	
	startCanvasWidth = canvas.width;
	startCanvasHeight = canvas.height;
	currentCanvasWidth = startCanvasWidth;
	currentCanvasHeight = startCanvasHeight;

	//inserts all html elements
	InsertHTMLElements();

	//keyboard activation
	ActivateKeyboard();
	
	//init sudoku board
	sudoku = new Sudoku(20, 20, 910);
	
	//generate random sudoku with 30 clues
	let randomSudoku = GenerateRandomSudoku(30);
	
	//initialize sudoku board	
	sudoku.InitializeSudoku(randomSudoku);
	//and also sudoku input board
	sudoku1.SetValue(randomSudoku);
		
	//init solver
	sudokuSolver = new SudokuSolver(sudoku);

	//60fps
    window.requestAnimationFrame(processLoop);
}

//aplication loop
function processLoop(timeStamp)
{
	//delta time calculation
	currentFrameTime = performance.now();
	deltaTime = currentFrameTime-previousFrameTime;
	previousFrameTime = currentFrameTime;

	//clear canvas
    context.fillStyle = "rgb(230, 230, 230)";
	context.fillRect(0, 0, startCanvasWidth, startCanvasHeight);
	
	//HTML elements synchronization
	SychnronizeHTMLElements();
	
	sudokuSolver.ManageSolving();

	sudoku.DrawSudoku(context);
	sudokuSolver.DrawSolvingInfo(context, deltaTime);
	
    window.requestAnimationFrame(processLoop);
}

//generate new random sudoku
function Button1Function() 
{	
	sudoku1.SetValue(GenerateRandomSudoku(slider1.GetValue()));
}

//initialize sudoku
function Button2Function() 
{
	//simply generate new instance so everything is guaranteed to reset
	
	//new sudoku board
	sudoku = new Sudoku(20, 20, 910);
	sudoku.InitializeSudoku(sudoku1.GetValue());
	//new solver
	sudokuSolver = new SudokuSolver(sudoku);
	
	button3.Enable();
}

//find solution
function Button3Function() 
{
	sudokuSolver.FindSolution();
}










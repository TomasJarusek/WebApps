//VectorAndMatrixFunctions
//Bc. Tomas Jarusek

"use strict";

// mozna udelat demo for fun???
// web gl demo
// https://stackoverflow.com/questions/25179693/how-to-check-whether-the-point-is-in-the-tetrahedron-or-not/25180294
//napsat an papir inverzni a tak

//vec3 - [x,y,z]
//vec2 - [x,y]

// mat4
// [
	// m00,m01,m02,m03,
	// m10,m11,m12,m13,
	// m20,m21,m22,m23,
	// m30,m31,m32,m33
// ]

// https://solarianprogrammer.com/2013/05/22/opengl-101-matrices-projection-view-model/

function GetNumberOfDigits(number)
{
	if (number < 0)
	{
		number = -1*number;
	}
	
	if (number < 1)
	{
		return 1;
	}
	else
	{
		return Math.floor(Math.log10(number))+1;
	}
}

// console.log(GetNumberOfDigits(430000));

function PrintMat4(A)
{	
	//spocitame nejvetsi hodnotu pro kazdy sloupec, podle ni pak sloupce zarovname
	let columnMax = [A[0],A[1],A[2],A[3]];
	
	for (let i = 1; i < 4; i++)
	{
		for (let j = 0; j < 4; j++)
		{
			if (A[i*4+j] >= columnMax[j])
			{
				columnMax[j] = A[i*4+j];
			}
		}
	}
	
	//spocitame pocet mezer, ktere musi byt mezi sloupci, aby mezi nejvetsim cislem byla jedna mezera
	let columnMaxDigitCount = [];
	
	for (let i = 0; i < 4; i++)
	{
		columnMaxDigitCount[i] = GetNumberOfDigits(columnMax[i]);
	}
	
	// console.log(columnMaxDigitCount);
	
	let outputString = "";
	
	for (let i = 0; i < 4; i++)
	{
		outputString += "|";
		
		for (let j = 0; j < 4; j++)
		{
			let spacesNeeded;
			
			if (j === 0)
			{
				//prvni sloupec
				spacesNeeded = columnMaxDigitCount[j] - GetNumberOfDigits(A[i*4+j]);
			}
			else
			{
				spacesNeeded = columnMaxDigitCount[j] - GetNumberOfDigits(A[i*4+j]) + 1;
			}
			
			for (let k = 0; k < spacesNeeded; k++)
			{
				outputString += " ";
			}
			
			outputString += A[i*4+j].toString();
		}
		
		outputString += "|\n";
	}
	
	console.log(outputString);
}


function MultiplyMat4Mat4(A, B)
{
	// console.log(A);
	// console.log(B);
	
	let a00 = A[0];
    let a01 = A[1];
    let a02 = A[2];
    let a03 = A[3];
    let a10 = A[4];
    let a11 = A[5];
    let a12 = A[6];
    let a13 = A[7];
    let a20 = A[8];
    let a21 = A[9];
    let a22 = A[10];
    let a23 = A[11];
    let a30 = A[12];
    let a31 = A[13];
    let a32 = A[14];
    let a33 = A[15];
	
    let b00 = B[0];
    let b01 = B[1];
    let b02 = B[2];
    let b03 = B[3];
    let b10 = B[4];
    let b11 = B[5];
    let b12 = B[6];
    let b13 = B[7];
    let b20 = B[8];
    let b21 = B[9];
    let b22 = B[10];
    let b23 = B[11];
    let b30 = B[12];
    let b31 = B[13];
    let b32 = B[14];
    let b33 = B[15];
	
    return [
		//prvni radek
		a00*b00 + a01*b10 + a02*b20	+ a03*b30,
		a00*b01 + a01*b11 + a02*b21	+ a03*b31,
		a00*b02 + a01*b12 + a02*b22	+ a03*b32,
		a00*b03 + a01*b13 + a02*b23	+ a03*b33,
		//druhy radek
		a10*b00 + a11*b10 + a12*b20	+ a13*b30,
		a10*b01 + a11*b11 + a12*b21	+ a13*b31,
		a10*b02 + a11*b12 + a12*b22	+ a13*b32,
		a10*b03 + a11*b13 + a12*b23	+ a13*b33,
		//treti radek
		a20*b00 + a21*b10 + a22*b20	+ a23*b30,
		a20*b01 + a21*b11 + a22*b21	+ a23*b31,
		a20*b02 + a21*b12 + a22*b22	+ a23*b32,
		a20*b03 + a21*b13 + a22*b23	+ a23*b33,
		//ctvrty radek
		a30*b00 + a31*b10 + a32*b20	+ a33*b30,
		a30*b01 + a31*b11 + a32*b21	+ a33*b31,
		a30*b02 + a31*b12 + a32*b22	+ a33*b32,
		a30*b03 + a31*b13 + a32*b23	+ a33*b33];
}



// https://en.wikipedia.org/wiki/Linear_independence


function MultiplyMat4Vec4(A, v)
{
	let a00 = A[0];
    let a01 = A[1];
    let a02 = A[2];
    let a03 = A[3];
    let a10 = A[4];
    let a11 = A[5];
    let a12 = A[6];
    let a13 = A[7];
    let a20 = A[8];
    let a21 = A[9];
    let a22 = A[10];
    let a23 = A[11];
    let a30 = A[12];
    let a31 = A[13];
    let a32 = A[14];
    let a33 = A[15];
	
	let vx = v[0];
	let vy = v[1];
	let vz = v[2];
	let vw = v[3];
	
	return [
		a00*vx + a01*vy + a02*vz + a03*vw,
		a10*vx + a11*vy + a12*vz + a13*vw,
		a20*vx + a21*vy + a22*vz + a23*vw,
		a30*vx + a31*vy + a32*vz + a33*vw];
}

function TransposeMat4(A)
{	
	return [
		A[0],	A[4],	A[8],	A[12],
		A[1],	A[5],	A[9],	A[13],
		A[2],	A[6],	A[10],	A[14],
		A[3],	A[7],	A[11],	A[15]];
}






















//Math.js
//Ing. Tomas Jarusek, 11/2023

let EPSILON_math = 0.000000001;

//function numerically calculates definite integral
//expects list of points [x,y] together start and end x coordinate
//IMPORTANT - requires at least two samples and constant sample rate
function CalculateDefiniteIntegral(functionValues, startX, endX)
{
    //there has to be at least two points ->  one interval
    if (functionValues.length < 2)
    {
        return undefined;
    }

    let sampleStep = functionValues[1][0] - functionValues[0][0];

    //index of interval that contains startX
    let startIntervalIndex = Math.floor((startX - functionValues[0][0])/sampleStep);
    //index of interval that contains endX
    let endIntervalIndex = Math.floor((endX - functionValues[0][0])/sampleStep);

    //now we have to solve numerical edge cases

    //if for example the samples start at 0, but the startX is -0.000000001, then undefined would be returned
    //if this is the case, then we just move the startX to startSample and increment the startInterval
    if ((functionValues[0][0] - EPSILON_math) <= startX && startX <= (functionValues[0][0] + EPSILON_math))
    {
        startX = functionValues[0][0];

        if (startIntervalIndex < 0)
        {
            startIntervalIndex++;
        }
    }

    //the same problem can appear at the end of the sample set
    //also there is another thing - by default the sample point belongs to the interval on the right, but that
    //would mean that if the last sample would be equal to endX, then it would belong to nonexistent interval
    //so the endIntervalIndex has to be decremented in this case
    let lastIntervalIndex = functionValues.length - 1;

    if ((functionValues[lastIntervalIndex][0] - EPSILON_math) <= endX && endX <= (functionValues[lastIntervalIndex][0] + EPSILON_math))
    {
        endX = functionValues[lastIntervalIndex][0];

        if (endIntervalIndex >= lastIntervalIndex)
        {
            endIntervalIndex--;
        }
    }

    //start always has to be smaller then end
    if (endX < startX)
    {
        return undefined;
    }

    //startX and endX must be in a existing interval
    if (startIntervalIndex < 0 || endIntervalIndex >= lastIntervalIndex)
    {
        return undefined;
    }

    //now we can start integrating
    //we are going to  go from startIntervalIndex to endIntervalIndex and calculate midpoint for each one
    //then the midpoint height is going to be multiplied by the sample step to get the area
    //for the startIntervalIndex and endIntervalIndex themselves, the calculated areas are going to be 
    //scaled down based on the position of startX and endX relative to the interval
    let totalArea = 0;

    for (let i = startIntervalIndex; i <= endIntervalIndex; i++)
    {
        let rectangeArea = sampleStep*((functionValues[i][1] + functionValues[i + 1][1])/2);

        if (i === startIntervalIndex && i === endIntervalIndex)
        {
            totalArea += rectangeArea*((endX - startX)/sampleStep);
        }
        else if (i === startIntervalIndex)
        {
            totalArea += rectangeArea*((functionValues[i + 1][0] - startX)/sampleStep);
        }
        else if (i === endIntervalIndex)
        {
            totalArea += rectangeArea*((endX - functionValues[i][0])/sampleStep);
        }
        else
        {
            totalArea += rectangeArea;
        }
    }

    return totalArea;
}


//conversion from [x, y](z = x + iy) to [r, theta(0π->2π)](z = r*(sin(theta) + i*cos(theta)))
function ConvertComplexNumberFromGeneralFormToPolarFormZeroTwoPi(generalForm)
{
    let r = Math.sqrt(generalForm[0]**2 + generalForm[1]**2);

    if (-EPSILON_math <= r && r <= EPSILON_math)
    {
        return [0, 0];
    }

    let theta;

    if (generalForm[1] >= 0 - EPSILON_math)
    {
        theta = Math.acos(generalForm[0]/r);
    }
    else
    {
        theta = 2*Math.PI - Math.acos(generalForm[0]/r);
    }

    return [r, theta];
}

//conversion from [x, y](z = x + iy) to [r, theta(-π->π)](z = r*(sin(theta) + i*cos(theta)))
function ConvertComplexNumberFromGeneralFormToPolarFormNegPiPosPi(generalForm)
{
    let polarForm = ConvertComplexNumberFromGeneralFormToPolarFormZeroTwoPi(generalForm);

    if (polarForm[1] > Math.PI)
    {
        polarForm[1] = polarForm[1] - 2*Math.PI; 
    }

    return polarForm;
}

//linearly interpolates point on line segment based on percentage
function InterpolatePointOnLineSegment(startX, startY, endX, endY, percentage)
{
    return [startX + (endX - startX)*percentage, startY + (endY - startY)*percentage];
}

//function, that translates integer to a unicode subscript symbols
function TranslateWholeNumberIntoUnicodeSubscript(number)
{
    let sign = "";

    if (number < 0)
    {
        sign = "₋";
        number *= -1;
    }

    let numberString = number.toString();
    let numberSubscriptString = "";

    for (let i = 0; i < numberString.length; i++)
    {
        switch(numberString[i]) 
        {
            case "0":
                numberSubscriptString += "₀";
                break;
            case "1":
                numberSubscriptString += '₁';
                break;
            case "2":
                numberSubscriptString += "₂";
                break;
            case "3":
                numberSubscriptString += "₃";
                break; 
            case "4":
                numberSubscriptString += "₄";
                break;
            case "5":
                numberSubscriptString += "₅";
                break;
            case "6":
                numberSubscriptString += "₆";
                break;
            case "7":
                numberSubscriptString += "₇";
                break;
            case "8":
                numberSubscriptString += "₈";
                break;   
            case "9":
                numberSubscriptString += "₉";
                break;          
            default:
                numberSubscriptString += "₀";
        }
    }

    return sign + numberSubscriptString;
}

//function, that translates integer to a unicode superscript symbols
function TranslateWholeNumberIntoUnicodeSuperscript(number)
{
    let sign = "";

    if (number < 0)
    {
        sign = "⁻";
        number *= -1;
    }

    let numberString = number.toString();
    let numberSuperscriptString = "";

    for (let i = 0; i < numberString.length; i++)
    {
        switch(numberString[i]) 
        {
            case "0":
                numberSuperscriptString += "⁰";
                break;
            case "1":
                numberSuperscriptString += '¹';
                break;
            case "2":
                numberSuperscriptString += "²";
                break;
            case "3":
                numberSuperscriptString += "³";
                break; 
            case "4":
                numberSuperscriptString += "⁴";
                break;
            case "5":
                numberSuperscriptString += "⁵";
                break;
            case "6":
                numberSuperscriptString += "⁶";
                break;
            case "7":
                numberSuperscriptString += "⁷";
                break;
            case "8":
                numberSuperscriptString += "⁸";
                break;   
            case "9":
                numberSuperscriptString += "⁹";
                break;          
            default:
                numberSuperscriptString += "⁰";
        }
    }

    return sign + numberSuperscriptString;
}

//function returns number rounded to fixed number of places,
//but if possible, the notation is going to be shortened
//n = 2
//1.232 -> 1.23
//1.202 -> 1.2
//1.002 -> 1
function GetRoundedNumberToNPlacesAsShortString(number, n)
{
    //number is converted to string with max precision
    let baseNumber = number.toFixed(n);
    let truncatedNumber = "";

    //then then "0"s and "."s are removed from the back of the number string
    let endFound = false;
    for (let i = baseNumber.length - 1; i >= 0; i--)
    {
        if (endFound === false)
        {
            if (baseNumber[i] === "0")
            {
                //skip
            }
            else if (baseNumber[i] === ".")
            {
                //. is the last possible character that can be removed

                endFound = true;
            }
            else
            {
                truncatedNumber = baseNumber[i] + truncatedNumber;
                endFound = true;
            }
        }
        else
        {
            truncatedNumber = baseNumber[i] + truncatedNumber;
        }
    }

    return truncatedNumber;
}

//converts number to a form of a*10^b, where n is the number of decimal places for a
function GetNumberAsStringInExponentialForm(number, n)
{
    let sign = number < 0 ? -1 : 1;
    let adjustedNumber = Math.abs(number);
    let exponentValue = 0;

    //adjust input number by multiplying or dividing so it is
    //between 1 and 10 (0 must be handled separately and will be returned without exponent)

    if (number === 0)
    {
        return GetRoundedNumberToNPlacesAsShortString(number, n);
    }

    if (adjustedNumber >= 10)
    {
        while (adjustedNumber >= 10)
        {
            adjustedNumber /= 10;
            exponentValue++;
        }
    }
    else
    {
        while (adjustedNumber < 1)
        {
            adjustedNumber *= 10;
            exponentValue--;
        }
    }

    adjustedNumber *= sign;

    //final string consists of base with proper number of places, "·10" and exponent
    return GetRoundedNumberToNPlacesAsShortString(adjustedNumber, n) + "·10" + TranslateWholeNumberIntoUnicodeSuperscript(exponentValue);
}








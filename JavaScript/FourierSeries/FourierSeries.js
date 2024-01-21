//Ing. Tomas Jarusek, 11/2023

//helper functions

let EPSILON = 0.0000000001;

//generates datapoints with y = 0 - starting setup for term sum
function GenerateFunctionEmptySumFunction(stepX, startX, endX)
{
    let emptyFunction = [];

    for (let x = startX; x <= endX + EPSILON; x = x + stepX)
    {
        emptyFunction.push([x, 0]);
    }

    return emptyFunction;
}

//generates starting function, that is going to be decomposed
function GenerateFunctionToAnalyze(generatingFunction, amplitude, period, horOffset, verOffset, stepX, startX, endX)
{
    let functionToAnalyze = [];

    for (let x = startX; x <= endX + EPSILON; x = x + stepX)
    {
        functionToAnalyze.push([x, generatingFunction(amplitude, period, horOffset, verOffset, x)]);
    }

    return functionToAnalyze;
}

//addition of one function to another
//length must be same
function AddTwoFunctions(sumFunction, functionToAdd)
{
    for (let i = 0; i < sumFunction.length; i++)
    {
        sumFunction[i][1] += functionToAdd[i][1];
    }
}

//adding horizontal offset to existing function
//original function is not altered, new vector is created for a result
function TranslateFunctionVertically(functionToTranslate, verticalOffset)
{
    let translatedFunction = [];

    for (let i = 0; i < functionToTranslate.length; i++)
    {
        translatedFunction.push([functionToTranslate[i][0], functionToTranslate[i][1] + verticalOffset]);
    }

    return translatedFunction;
}

//---------------------------------------------------------------------------
//functions for fourier series calculations

//T = 2*pi/ω
function FrequencyToPeriod(omega)
{
    return 2*Math.PI/omega;
}

//ω = 2*pi/T
function PeriodToFrequency(T)
{
    return 2*Math.PI/T;
}

//y = A*sin(ωt + φ)
function Sine(A, omega, phi, t)
{
    return A*Math.sin(omega*t + phi);
}

//y = A*cos(ωt + φ)
function Cosine(A, omega, phi, t)
{
    return A*Math.cos(omega*t + phi);
}

//---------------------------------------------------------------------------
//fourier series calculation setup

//starting function
let functionToAnalyze = [];
let functionToAnalyzePeriod;
//result mode
let functionToAnalyzeResultModeDisplay = [];
let functionToAnalyzeResultModeCalculation = [];

//current term number
//(terms are coefficients 0, +-1, +-2, ....)
let termNumber = 0;
//final term number chosen by user
let finalTermNumber;

//storage for starting sine and cosine
let termSine = [];
let termCosine = [];

//storage for starting sine and cosine multiplied by starting function
let termSineMultiplied = [];
let termCosineMultiplied = [];

//0th coefficient integral
let termIntegral;
//sine and cosine integrals calculated for current term
let termIntegrals;

//0th or negative and positive coeficients for current term
let termNegativeCoefficient;
let termPositiveCoefficient;

//storage for all coefficients - used for drawing spectrum
let fourierZerothCoefficientRegularForm;
let fourierZerothCoefficient;
let fourierNegativeCoefficients = [];
let fourierPositiveCoefficients = [];

//final linear function for 0th coefficient
let zerothTermFinalLinearFunction = [];

//final cosine, that is going to be created from positive and negative coefficients
let termFinalCosine = [];

//sum of all currently calculated cosines
let fourierTermsSum = [];

//---------------------------------------------------------------------------
//fourier series calculation functions

//generates sine and cosine with appropriate frequency for use in fourier series calculation
function GenerateSineAndCosineForFourierCoefficientCalculation(frequency, stepX, startX, endX)
{
    let sine = [];
    let cosine = [];

    for (let x = startX; x <= endX + EPSILON; x = x + stepX)
    {
        sine.push([x, Sine(1, frequency, 0, x)]);
        cosine.push([x, Cosine(1, frequency, 0, x)]);
    }

    return [sine, cosine];
}

//multiplies function to analyze by sine and cosine, that were generated for fourier term
function MultiplyFunctionToAnalyzeBySineAndCosine(functionToAnalyze, sine, cosine)
{
    let functionToAnalyzeMultipliedBySine = [];
    let functionToAnalyzeMultipliedByCosine = [];

    for (let i = 0; i < functionToAnalyze.length; i++)
    {
        functionToAnalyzeMultipliedBySine[i] = [functionToAnalyze[i][0], functionToAnalyze[i][1]*sine[i][1]];
        functionToAnalyzeMultipliedByCosine[i] = [functionToAnalyze[i][0], functionToAnalyze[i][1]*cosine[i][1]];
    }

    return [functionToAnalyzeMultipliedBySine, functionToAnalyzeMultipliedByCosine];
}

//calculates definite integral over a period for multiplied sine and cosine
function CalculateTermIntegrals(functionToAnalyzeMultipliedBySine, functionToAnalyzeMultipliedByCosine, period)
{
    let sineMultipliedIntegral = CalculateDefiniteIntegral(functionToAnalyzeMultipliedBySine, -period/2, period/2);
    let cosineMultipliedIntegral = CalculateDefiniteIntegral(functionToAnalyzeMultipliedByCosine, -period/2, period/2);

    return [sineMultipliedIntegral, cosineMultipliedIntegral];
}

//positive coeficient calculation based on integral results and period
function CalculateFourierSeriesPositiveCoefficient(sineMultipliedIntegral, cosineMultipliedIntegral, period)
{
    //coefficient is a complex number and both the real and imaginary parts are constructed from the definite integrals results
    //this is based on the exponential form definition of fourier series (https://en.wikipedia.org/wiki/Fourier_series (chapter exponential form))
    //which is then decomposed into two real definite integral using euler's formula

    //coefficient as complex number in regular form
    let positiveCoefficientRegularForm = [(1/period)*cosineMultipliedIntegral, -(1/period)*sineMultipliedIntegral];

    //this is technically a valid form of a result, but there are two problems
    //first, in the next step, we want to construct a real cosine function from positive and negative coefficients
    //and that is based on a polar form of a complex number
    //also, when drawing a spectrum, polar form values are used

    //convert regular form complex number into a polar form
    let positiveCoefficientPolarForm = ConvertComplexNumberFromGeneralFormToPolarFormNegPiPosPi(positiveCoefficientRegularForm);

    //so now we have ck = r*(cos(θ) + i*sin(θ)) insted of a + b*i
    //however, because we are calculating fourier series using exponential from,
    //we actually want the complex number to be in a exponential form as well, but
    //this is only a cosmetic change that does not affect the actual values,
    //but it does affect the further naming convention

    //final form, that we are returning is r*e^jθ
    let posCkR = positiveCoefficientPolarForm[0];
    let posCkTheta = positiveCoefficientPolarForm[1];

    //+-π represents the same angle, but by convention, positive π is used for positive coefficients,
    //so if the result is negative π - flip sign
    if (posCkTheta >= (-Math.PI - 0.0001) && posCkTheta <= (-Math.PI + 0.0001))
    {
        posCkTheta = -1*posCkTheta;
    }

    //make sure that if complex number is 0 + 0i, the angle is 0π by convention
    //math function that converts complex number forms does not neccessarily has such a big EPSILON interval,
    //but here we need to account for errors in numerical fourier calculations
    //otherwise, 0 + 0i would be shown in spectrum as -π or +π
    if (posCkR >= -0.0001 && posCkR <= 0.0001)
    {
        posCkTheta = 0;
    }

    return [posCkR, posCkTheta];
}

//negative coeficient calculation based on integral results and period
function CalculateFourierSeriesNegativeCoefficient(sineMultipliedIntegral, cosineMultipliedIntegral, period)
{
    //analogous to positive coefficient

    let negativeCoefficientRegularForm = [(1/period)*cosineMultipliedIntegral, (1/period)*sineMultipliedIntegral];
    let negativeCoefficientPolarForm = ConvertComplexNumberFromGeneralFormToPolarFormNegPiPosPi(negativeCoefficientRegularForm);

    let negCkR = negativeCoefficientPolarForm[0];
    let negCkTheta = negativeCoefficientPolarForm[1];

    //+-π represents the same angle, but by convention, negative π is used for negative coefficients,
    //so if the result is positive π - flip sign
    if (negCkTheta >= (Math.PI - 0.0001) && negCkTheta <= (Math.PI + 0.0001))
    {
        negCkTheta = -1*negCkTheta;
    }

    //make sure that if complex number is 0 + 0i, the angle is 0π by convention
    //math function that converts complex number forms does not neccessarily have such a big EPSILON interval,
    //but here we need to account for errors in numerical fourier calculations
    //otherwise, 0 + 0i would be shown in spectrum as -π or +π
    if (negCkR >= -0.0001 && negCkR <= 0.0001)
    {
        negCkTheta = 0;
    }

    return [negCkR, negCkTheta];
}

//generating linear function based on 0th coefficent representing vertical shift
function GenerateLinearFunctionFromZerothCoefficient(c0, stepX, startX, endX)
{
    //general function for final cosine generation could technically be used,
    //because y = cos(0*ω*t) would generate y = 1, but the issue is that in general case,
    //both +k and -k terms are used so the shift(cosine amplitude) would be twice as high
    //there is only one 0th coefficient however -> instead of special condition for 0, this function is used instead

    //we simply generate function y = c0
    let termFinalLinearFunction = [];
    for (let x = startX; x <= endX + EPSILON; x = x + stepX)
    {
        termFinalLinearFunction.push([x, c0]);
    }

    return termFinalLinearFunction;
}

//generating final cosine function from ck, c-k and frequency
function GenerateCosineFromPositiveAndNegativeCoefficient(negativeCk, positiveCk, frequency, stepX, startX, endX)
{
    //cosine generation from coefficients is based on exponential formula for cosine
    //cos(θ) = (e^(jθ) + e^(-jθ))/2 - two complex exponentials annihilate into a real cosine

    //we need three values to uniquely define a cosine function - amplitude, phase and frequency
    //frequency is given based on a term number
    //amplitude and phase can be extracted from the coeffcients in a following way:
    //fourier coefficients define a starting point of complex exponential at t = 0
    //then, because we are decomposing a real function, it must consist EXCLUSIVELY of real functions(cosines)
    //and based on the exponential formula, that can only happen if ck and c-k are complex conjugates
    //so all fourier coefficients are going be complex conjugate pairs

    //-> the phase of the cosine is directly present inside the coefficients
    //one coefficient is going to be e^jθ, second one is going to be e^-jθ (values at t = 0)
    //and they will annihilate into the real value of 2*cos(θ) at t = 0 -> phase is θ

    //-> amplitude is based on the coeficient's distance from the origin
    //coefficients can be located at arbitrary distance r from the origin -> r*e^jθ, r*e^-jθ
    //so when we add them together and they annihilate into a real value, both rs are going to contribute to the sum
    //that means that amplitude of a real cosine is going to be 2*r - twice the amplitude of a single complex exponential

    //because coefficients are conjugate pairs, this also implies that we don't actually need the negative coefficient to get the cosine formula
    //the phase of resulting cosine is directly included inside positive coefficient (e^-jθ)!!!
    //and distance from origin is going to be the same for positive and negative coefficient, so we only need one of them multiplied by 2

    //2*|ck| = 2*r
    let amplitude = 2*positiveCk[0];
    //|ck| + |c-k| would also work 
    //let amplitude = positiveCk[0] + negativeCk[0];

    //Arg(ck) = θ
    let phase = positiveCk[1];

    //generation of appropriate cosine function
    let termFinalCosine = [];
    for (let x = startX; x <= endX + EPSILON; x = x + stepX)
    {
        termFinalCosine.push([x, Cosine(amplitude, frequency, phase, x)]);
    }
    return termFinalCosine;
}

//helper function to calculate maximum value for abs spectrum, so the graph window can be properly scaled
//highest value possible in abs spectrum is determined by the vertical offset and amplitude of the function to analyze
//and for most common functions, it is going to be 0th or 1st coefficient, that will have the highest value
//(some functions may overshoot, but that is not much of a problem, because it can be rescaled by changing vertical shift)
//because correct scaling is really difficult to predict, it is just easier to calculate zeroth and first coefficient with reduced step size
//every time user updates an input - that way the scaling is optimal
function CalculateMaxValueForAbsSpectrum(currentFunction, amplitudeCurrentFrame, periodCurrentFrame, horOffsetCurrentFrame, verOffsetCurrentFrame)
{
    //custom number of datapoints for this calculation
    let localStepX = (590/(160/periodCurrentFrame))/1000;
    let localStartX = -(590/(160/periodCurrentFrame))/2;
    let localEndX = (590/(160/periodCurrentFrame))/2;

    //function generation
    let localFunctionToAnalyze = GenerateFunctionToAnalyze(currentFunction, amplitudeCurrentFrame, periodCurrentFrame, horOffsetCurrentFrame, verOffsetCurrentFrame, localStepX, localStartX, localEndX);

    //zeroth coefficent
    let c0R = (1/periodCurrentFrame)*CalculateDefiniteIntegral(localFunctionToAnalyze, -periodCurrentFrame/2, periodCurrentFrame/2);

    //first coefficient
    let localTermSineAndCosine = GenerateSineAndCosineForFourierCoefficientCalculation(PeriodToFrequency(periodCurrentFrame)*1, localStepX, localStartX, localEndX);
    let localFunctionMultipliedByTermSineAndCosine = MultiplyFunctionToAnalyzeBySineAndCosine(localFunctionToAnalyze, localTermSineAndCosine[0], localTermSineAndCosine[1]);
    let localTermIntegrals = CalculateTermIntegrals(localFunctionMultipliedByTermSineAndCosine[0], localFunctionMultipliedByTermSineAndCosine[1], periodCurrentFrame);
    let localTermPositiveCoefficient = CalculateFourierSeriesPositiveCoefficient(localTermIntegrals[0], localTermIntegrals[1], periodCurrentFrame);
    let c1R = localTermPositiveCoefficient[0];

    //return higher of the two
    return c1R > Math.abs(c0R) ? c1R : Math.abs(c0R);
}

//function extends resulting sum period to boundaries of display graph window
//in this way, calculations can be done only on the period portion, which speeds up the computation
function ExtendPeriodPortionOfFunctionResultMode(functionPoints)
{
    //start and end X value for finalSumGraphResultMode graph window
    let localStartX = startXResultModeDisplay*resultGraphXMultiplier;
    let localEndX = endXResultModeDisplay*resultGraphXMultiplier;

    //positive and negative side extensions for period
    let negativeExtensionPoints = [];
    let positiveExtensionPoints = [];

    //negative extension
    let i = 1;
    //we start from the next value to the right
    let currentX = startXResultModeCalculation - stepXResultModeCalculation;

    //points are added, until the desired endpoint is reached
    //points are going to be in reverse order for negative extension
    while (startXResultModeCalculation - i*stepXResultModeCalculation >= localStartX)
    {
        negativeExtensionPoints.push([currentX, functionPoints[dataPointsPerFunctionResultModeCalculation - (i % dataPointsPerFunctionResultModeCalculation)][1]]);

        currentX -= stepXResultModeCalculation;
        i++;
    }

    //positive extension
    i = 1;
    //we start from the next value to the left
    currentX = endXResultModeCalculation + stepXResultModeCalculation;

    while (endXResultModeCalculation + i*stepXResultModeCalculation <= localEndX)
    {
        positiveExtensionPoints.push([currentX, functionPoints[((i - 1) % dataPointsPerFunctionResultModeCalculation) + 1][1]]);

        currentX += stepXResultModeCalculation;
        i++;
    }

    //final extended function points
    let resultFunctionPoints = [];

    //start sith negative extension (flip points)
    for (let i = negativeExtensionPoints.length - 1; i >= 0; i--)
    {
        resultFunctionPoints.push(negativeExtensionPoints[i]);
    }

    //base function
    for (let i = 0; i < functionPoints.length; i++)
    {
        resultFunctionPoints.push(functionPoints[i]);
    }

    //positive extension
    for (let i = 0; i < positiveExtensionPoints.length; i++)
    {
        resultFunctionPoints.push(positiveExtensionPoints[i]);
    }

    return resultFunctionPoints;
}

//fourier series calculation for result mode
//all required coefficients are calculated at once
//calculation is being done only on one period in order to improve performance
//resulting sum is then extended in such a way to fill graph window
//most of the furier variables from animation counterpart are going to be reused 
function CalculateFourierSeriesResultMode()
{
    //calculation process is the same as in animation mode

	fourierTermsSum = [];
	fourierNegativeCoefficients = [];
	fourierPositiveCoefficients = [];

    fourierTermsSum = GenerateFunctionEmptySumFunction(stepXResultModeCalculation, startXResultModeCalculation, endXResultModeCalculation);

    termIntegral = CalculateDefiniteIntegral(functionToAnalyzeResultModeCalculation, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2);

    fourierZerothCoefficientRegularForm = [(1/functionToAnalyzePeriod)*termIntegral, 0];
    fourierZerothCoefficient = ConvertComplexNumberFromGeneralFormToPolarFormNegPiPosPi(fourierZerothCoefficientRegularForm);
    fourierZerothCoefficient[1] = Math.abs(fourierZerothCoefficient[1]);

    zerothTermFinalLinearFunction = GenerateLinearFunctionFromZerothCoefficient(fourierZerothCoefficientRegularForm[0], stepXResultModeCalculation, startXResultModeCalculation, endXResultModeCalculation);
    AddTwoFunctions(fourierTermsSum, zerothTermFinalLinearFunction);

    for (termNumber = 1; termNumber <= finalTermNumber; termNumber++)
    {     
        let termSineAndCosine = GenerateSineAndCosineForFourierCoefficientCalculation(PeriodToFrequency(functionToAnalyzePeriod)*termNumber, stepXResultModeCalculation, startXResultModeCalculation, endXResultModeCalculation);
        termSine = termSineAndCosine[0];
        termCosine = termSineAndCosine[1];

        let functionMultipliedByTermSineAndCosine = MultiplyFunctionToAnalyzeBySineAndCosine(functionToAnalyzeResultModeCalculation, termSine, termCosine);
        termSineMultiplied = functionMultipliedByTermSineAndCosine[0];
        termCosineMultiplied = functionMultipliedByTermSineAndCosine[1];

        termIntegrals = CalculateTermIntegrals(termSineMultiplied, termCosineMultiplied, functionToAnalyzePeriod);

        termNegativeCoefficient = CalculateFourierSeriesNegativeCoefficient(termIntegrals[0], termIntegrals[1], functionToAnalyzePeriod);
        termPositiveCoefficient = CalculateFourierSeriesPositiveCoefficient(termIntegrals[0], termIntegrals[1], functionToAnalyzePeriod);
        fourierNegativeCoefficients.push([-PeriodToFrequency(functionToAnalyzePeriod)*termNumber, termNegativeCoefficient]);
        fourierPositiveCoefficients.push([PeriodToFrequency(functionToAnalyzePeriod)*termNumber, termPositiveCoefficient]);

        termFinalCosine = GenerateCosineFromPositiveAndNegativeCoefficient(termNegativeCoefficient, termPositiveCoefficient, PeriodToFrequency(functionToAnalyzePeriod)*termNumber, stepXResultModeCalculation, startXResultModeCalculation, endXResultModeCalculation);
        AddTwoFunctions(fourierTermsSum, termFinalCosine);      
    }

    //sum extension
    fourierTermsSum = ExtendPeriodPortionOfFunctionResultMode(fourierTermsSum);
}

//---------------------------------------------------------------------------
//fourier series draw

function DrawStaticElements(localContext, showFunctionToAnalyze)
{
	startingFunctionGraph.DrawBase(localContext);

    sineGraph.DrawBase(localContext);
    cosineGraph.DrawBase(localContext);

    finalSumGraph.DrawBase(localContext);
    if (showFunctionToAnalyze === true)
    {
        finalSumGraph.DrawLine(localContext, functionToAnalyze, "rgb(0, 0, 155)", 1);
    }

    absSpectrum.DrawBase(localContext);
    argSpectrum.DrawBase(localContext);

    //function to analyze is drawn inside animation if its running,
    //but it must be shown to user at all times
    if (animationStarted === false)
    {
        startingFunctionGraph.DrawLine(localContext, functionToAnalyze, "rgb(0, 0, 155)", 2);
    }
}

function DrawResultModeElements(localContext, showFunctionToAnalyze)
{
	startingFunctionGraphResultMode.DrawBase(localContext);
    startingFunctionGraphResultMode.DrawLine(localContext, functionToAnalyzeResultModeDisplay, "rgb(0, 0, 155)", 2);

    finalSumGraphResultMode.DrawBase(localContext);
    if (showFunctionToAnalyze === true)
    {
        finalSumGraphResultMode.DrawLine(localContext, functionToAnalyzeResultModeDisplay, "rgb(0, 0, 155)", 1);
    }
    finalSumGraphResultMode.DrawLine(localContext, fourierTermsSum, "rgb(255, 0, 0)", 2);

    absSpectrumResultMode.DrawBase(localContext);
    argSpectrumResultMode.DrawBase(localContext);

    absSpectrumResultMode.DrawPointAsVerticalLine(localContext, 0, fourierZerothCoefficient[0], "rgb(255, 0, 0)", 2);
    absSpectrumResultMode.DrawPoint(localContext, 0, fourierZerothCoefficient[0], 3.5, "rgb(255, 0, 0)");

    argSpectrumResultMode.DrawPointAsVerticalLine(localContext, 0, fourierZerothCoefficient[1]/Math.PI, "rgb(255, 0, 0)", 2);
    argSpectrumResultMode.DrawPoint(localContext, 0, fourierZerothCoefficient[1]/Math.PI, 3.5, "rgb(255, 0, 0)");

    for (let i = 0; i < termNumber - 1; i++)
    {
        absSpectrumResultMode.DrawPointAsVerticalLine(localContext, fourierPositiveCoefficients[i][0]/Math.PI, fourierPositiveCoefficients[i][1][0], "rgb(255, 0, 0)", 2);
        absSpectrumResultMode.DrawPoint(localContext, fourierPositiveCoefficients[i][0]/Math.PI, fourierPositiveCoefficients[i][1][0], 3.5, "rgb(255, 0, 0)");

        argSpectrumResultMode.DrawPointAsVerticalLine(localContext, fourierPositiveCoefficients[i][0]/Math.PI, fourierPositiveCoefficients[i][1][1]/Math.PI, "rgb(255, 0, 0)", 2);
        argSpectrumResultMode.DrawPoint(localContext, fourierPositiveCoefficients[i][0]/Math.PI, fourierPositiveCoefficients[i][1][1]/Math.PI, 3.5, "rgb(255, 0, 0)");
    }

    for (let i = 0; i < termNumber - 1; i++)
    {
        absSpectrumResultMode.DrawPointAsVerticalLine(localContext, fourierNegativeCoefficients[i][0]/Math.PI, fourierNegativeCoefficients[i][1][0], "rgb(255, 0, 0)", 2);
        absSpectrumResultMode.DrawPoint(localContext, fourierNegativeCoefficients[i][0]/Math.PI, fourierNegativeCoefficients[i][1][0], 3.5, "rgb(255, 0, 0)");

        argSpectrumResultMode.DrawPointAsVerticalLine(localContext, fourierNegativeCoefficients[i][0]/Math.PI, fourierNegativeCoefficients[i][1][1]/Math.PI, "rgb(255, 0, 0)", 2);
        argSpectrumResultMode.DrawPoint(localContext, fourierNegativeCoefficients[i][0]/Math.PI, fourierNegativeCoefficients[i][1][1]/Math.PI, 3.5, "rgb(255, 0, 0)");
    }
}


//---------------------------------------------------------------------------
//fourier series description definition

//helper function, that adds opacity to color
function AddOpacityToColor(color, opacity)
{
    //extract rgb values
    let regex = /\(([^)]+)\)/;
    let parenthesesContent = regex.exec(color)[1];

    //create new color value from given color and interpolated opacity
    return "rgba(" + parenthesesContent + ", " + opacity.toString() + ")";
}

//helper function to setup test parameters for description
function SetupTextParameters(localContext, color, font, fontSize)
{
    localContext.textAlign = "left"
    localContext.textBaseline = "alphabetic";
    localContext.fillStyle = color;
    localContext.font = fontSize.toString() + "px " + font;
}

//first term description

function DrawFourierDescription_1_Line_1(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText = "Calculating coefficient cₖ for k = 0.";


    SetupTextParameters(localContext, color, font, fontSize);
    localContext.font = "bold " + localContext.font;
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
}

function DrawFourierDescription_1_Line_2(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText;

    currentText = "Integrating function x(t) over a period to see how vertically shifted it is,";
    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
}

function DrawFourierDescription_1_Line_3(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText;

    currentText = "then adding the shift to the sum.";
    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
}

function DrawFourierDescription_1_Line_4(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText;

    currentText = "c₀ = " ;

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", "P₁");
    
    textCurrentStartX += DrawIntegralSymbol(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-P₁/2", "P₁/2");

    currentText = "x(t)e";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawExponent(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-j·0·ω₁t");

    currentText = " dt = ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", "P₁");
    
    textCurrentStartX += DrawIntegralSymbol(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-P₁/2", "P₁/2");

    currentText = "x(t)(cos(0·ω₁t) - jsin(0·ω₁t)) dt = ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", "P₁");
    
    textCurrentStartX += DrawIntegralSymbol(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-P₁/2", "P₁/2");

    currentText = "x(t) dt";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_1_Line_5(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, P, cosineIntegral)
{
    let currentText;

    currentText = "c₀ = ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", P.toFixed(1));

    currentText = "·" + cosineIntegral.toFixed(2).replace(/^-0.00$/, "0.00") + " = " + (1/P*cosineIntegral).toFixed(2).replace(/^-0.00$/, "0.00") + "  ➞  Add function y(t) = c₀ = " + (1/P*cosineIntegral).toFixed(2).replace(/^-0.00$/, "0.00") + " to sum s(t).";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

//nth term sine cosine generation

function DrawFourierDescription_2_Line_1(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, k)
{
    let currentText = "Calculating coefficient cₖ and c₋ₖ for k = " + k.toString() + ".";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.font = "bold " + localContext.font;
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
}

function DrawFourierDescription_2_Line_2(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText;

    currentText = "Generating sine and cosine with a frequency of k·ω₁.";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_2_Line_3(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, P)
{
    let currentText;

    currentText = "ω₁ = ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "2π", "P₁");

    currentText = " = ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "2π", GetRoundedNumberToNPlacesAsShortString(P, 2));

    currentText = "= " + GetRoundedNumberToNPlacesAsShortString(PeriodToFrequency(P)/Math.PI, 2) + "π rad/s.";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_2_Line_4(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, k, P)
{
    let currentText;

    currentText = "Cosine function: cos(kω₁t) = cos(" + k.toString() + "·" +  GetRoundedNumberToNPlacesAsShortString(PeriodToFrequency(P)/Math.PI, 2) + "π·t) = cos(" +  GetRoundedNumberToNPlacesAsShortString(k*PeriodToFrequency(P)/Math.PI, 2) + "πt)";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_2_Line_5(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, k, P)
{
    let currentText;

    currentText = "Sine function: sin(kω₁t) = sin(" + k.toString() + "·" +  GetRoundedNumberToNPlacesAsShortString(PeriodToFrequency(P)/Math.PI, 2) + "π·t) = sin(" +  GetRoundedNumberToNPlacesAsShortString(k*PeriodToFrequency(P)/Math.PI, 2) + "πt)";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

//nth term multiplying

function DrawFourierDescription_3_Line_1(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText;

    currentText = "Multiplying sine and cosine by function x(t).";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

//nth term coefficients

function DrawFourierDescription_4_Line_1(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText;

    currentText = "Taking an integral over a period P₁ to see how similar x(t) is with sine and cosine," ;

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_4_Line_2(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText;

    currentText = "then using these values to calculate coefficients." ;

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_4_Line_3(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText;

    currentText = "cₖ = " ;

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", "P₁");
    
    textCurrentStartX += DrawIntegralSymbol(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-P₁/2", "P₁/2");

    currentText = "x(t)e";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawExponent(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-jkω₁t");

    currentText = " dt = ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", "P₁");
    
    textCurrentStartX += DrawIntegralSymbol(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-P₁/2", "P₁/2");

    currentText = "x(t)(cos(kω₁t) - jsin(kω₁t)) dt = ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", "P₁");
    
    textCurrentStartX += DrawIntegralSymbol(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-P₁/2", "P₁/2");

    currentText = "x(t)cos(kω₁t) dt";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_4_Line_4(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, k, P, sineIntegral, cosineIntegral)
{
    let currentText;

    currentText = "- j ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", "P₁");
    
    textCurrentStartX += DrawIntegralSymbol(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-P₁/2", "P₁/2");

    currentText = "x(t)sin(kω₁t) dt  ➞  c" + TranslateWholeNumberIntoUnicodeSubscript(k) + ", c" + TranslateWholeNumberIntoUnicodeSubscript(-k) + " = ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", GetRoundedNumberToNPlacesAsShortString(P, 2));

    currentText = "·" + cosineIntegral.toFixed(2).replace(/^-0.00$/, "0.00") + " ± j ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawFraction(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "1", GetRoundedNumberToNPlacesAsShortString(P, 2));
    
    currentText = "·" + Math.abs(sineIntegral).toFixed(2).replace(/^-0.00$/, "0.00") + " = " + (1/P*cosineIntegral).toFixed(2).replace(/^-0.00$/, "0.00") + " ± " + Math.abs(1/P*sineIntegral).toFixed(2).replace(/^-0.00$/, "0.00") + "j";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

//nth term cosine generation and sum

function DrawFourierDescription_5_Line_1(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let text = "Generating cosine function based on coefficients, then adding it to the sum.";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.font = "bold " + localContext.font;
    localContext.fillText(text, textCurrentStartX, textBaselineY);
}

function DrawFourierDescription_5_Line_2(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, k, P)
{
    let currentText;
    
    currentText = "ω₁ = " + GetRoundedNumberToNPlacesAsShortString(PeriodToFrequency(P)/Math.PI, 2) + "π rad/s  ➞  ";
    currentText += "ω = k·ω₁ = " + k.toString() + "·" + GetRoundedNumberToNPlacesAsShortString(PeriodToFrequency(P)/Math.PI, 2) + "π = ";  
    currentText += GetRoundedNumberToNPlacesAsShortString((k*PeriodToFrequency(P)/Math.PI), 2) + "π rad/s";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_5_Line_3(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, k, P, sineIntegral, cosineIntegral, positiveCk)
{
    let currentText;

    currentText = "c" + TranslateWholeNumberIntoUnicodeSubscript(k) + " = " + (1/P*cosineIntegral).toFixed(2).replace(/^-0.00$/, "0.00") + " ";
    if (sineIntegral < 0)
    {
        currentText += "+ ";
    }
    else
    {
        currentText += "- "
    }
    currentText += Math.abs(1/P*sineIntegral).toFixed(2).replace(/^-0.00$/, "0.00") + "j = " + positiveCk[0].toFixed(2).replace(/^-0.00$/, "0.00") + "e";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    let exponentText = "";
    if (positiveCk[1] < 0)
    {
        exponentText += " -j" 
    }
    else
    {
        exponentText += " j" 
    }
    exponentText += GetRoundedNumberToNPlacesAsShortString(Math.abs(positiveCk[1])/Math.PI, 2) + "π";

    textCurrentStartX += DrawExponent(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, exponentText);

    currentText = "  ➞  |c" + TranslateWholeNumberIntoUnicodeSubscript(k) + "| = " + positiveCk[0].toFixed(2).replace(/^-0.00$/, "0.00") + ",  ";
    currentText += "arg(c" + TranslateWholeNumberIntoUnicodeSubscript(k) + ") = " + GetRoundedNumberToNPlacesAsShortString(positiveCk[1]/Math.PI, 2) + "π";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_5_Line_4(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, k, P, sineIntegral, cosineIntegral, negativeCk)
{
    let currentText;

    currentText = "c" + TranslateWholeNumberIntoUnicodeSubscript(-k) + " = " + (1/P*cosineIntegral).toFixed(2).replace(/^-0.00$/, "0.00") + " ";
    if (-sineIntegral < 0)
    {
        currentText += "+ ";
    }
    else
    {
        currentText += "- "
    }
    currentText += Math.abs(1/P*sineIntegral).toFixed(2).replace(/^-0.00$/, "0.00") + "j = " + negativeCk[0].toFixed(2).replace(/^-0.00$/, "0.00") + "e";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    let exponentText = "";
    if (negativeCk[1] < 0)
    {
        exponentText += " -j" 
    }
    else
    {
        exponentText += " j" 
    }
    exponentText += GetRoundedNumberToNPlacesAsShortString(Math.abs(negativeCk[1])/Math.PI, 2) + "π";

    textCurrentStartX += DrawExponent(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, exponentText);

    currentText = "  ➞  |c" + TranslateWholeNumberIntoUnicodeSubscript(-k) + "| = " + negativeCk[0].toFixed(2).replace(/^-0.00$/, "0.00") + ",  ";
    currentText += "arg(c" + TranslateWholeNumberIntoUnicodeSubscript(-k) + ") = " + GetRoundedNumberToNPlacesAsShortString(negativeCk[1]/Math.PI, 2) + "π";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_5_Line_5(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, k)
{
    let currentText;

    currentText = "s(t) = c₀ +";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawSigmaSumSymbol(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "k = 1", "∞");

    currentText = "cₖe";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawExponent(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, " jkω₁t");

    currentText = " + c₋ₖe";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawExponent(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "-jkω₁t");

    currentText = " = ";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;

    textCurrentStartX += DrawSigmaSumSymbol(localContext, textCurrentStartX, textBaselineY, color, font, fontSize, "k = 1", "∞");

    currentText = "Cₖ·cos(kω₁t + φₖ) where Cₖ = 2|cₖ|, φₖ = arg(cₖ)";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

function DrawFourierDescription_5_Line_6(localContext, textCurrentStartX, textBaselineY, font, fontSize, color, k, P, positiveCk)
{
    let currentText;

    currentText = "Current cosine: C" + TranslateWholeNumberIntoUnicodeSubscript(k)
    currentText += " = 2|c" + TranslateWholeNumberIntoUnicodeSubscript(k) + "| = " + (2*positiveCk[0]).toFixed(2).replace(/^-0.00$/, "0.00") + ", ";
    currentText += "φ" + TranslateWholeNumberIntoUnicodeSubscript(k) + " = arg(c" + TranslateWholeNumberIntoUnicodeSubscript(k) + ") = " + GetRoundedNumberToNPlacesAsShortString(positiveCk[1]/Math.PI, 2) + "π";
    currentText += "  ➞  " + (2*positiveCk[0]).toFixed(2).replace(/^-0.00$/, "0.00") + "·cos(" + GetRoundedNumberToNPlacesAsShortString((k*PeriodToFrequency(P)/Math.PI), 2) + "πt";
    if (positiveCk[1] < 0)
    {
        currentText += " - "
    }
    else
    {
        currentText += " + "
    }
    currentText += GetRoundedNumberToNPlacesAsShortString(Math.abs(positiveCk[1])/Math.PI, 2) + "π)";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
    textCurrentStartX += localContext.measureText(currentText).width;
}

//done

function DrawFourierDescription_6_Line_1(localContext, textCurrentStartX, textBaselineY, font, fontSize, color)
{
    let currentText = "Done.";

    SetupTextParameters(localContext, color, font, fontSize);
    localContext.font = "bold " + localContext.font;
    localContext.fillText(currentText, textCurrentStartX, textBaselineY);
}



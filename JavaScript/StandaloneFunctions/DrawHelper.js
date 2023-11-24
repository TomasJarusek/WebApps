//Ing. Tomas Jarusek, 11/2023

//https://en.wikipedia.org/wiki/Typeface_anatomy
//https://www.w3schools.com/tags/canvas_textbaseline.asp
//https://www.w3schools.com/tags/canvas_textalign.asp

//https://en.wikipedia.org/wiki/Unicode_subscripts_and_superscripts

//values were experimentally measured

//percentages of fontSize in relation to baseline

//Arial font
//based on letter E, x and p
//no ascender??
let arialCapHeight = 0.715
let arialMedian = 0.518;
let arialBaseline = 0;
let arialDescender = -0.2;

//Times New Roman font
//based on letter x
let tnrMedian = 0.47;

//based on ∫
//same for Times New Roman
let arialIntegralTop = 0.91;
let arialIntegralBottom = -0.108;

//based on ∑
//Times New Roman
let tnrSigmaTop = 0.72;
let tnrSigmaBottom = -0.23;
//Arial
let arialSigmaTop = 0.76;
let arialSigmaBottom = -0.22;

//function, that draws integral sign with both the lower bound and upper bound
//integral is drawn with respect to font baseline and font size
//returns integral sign width, so further text can be properly offset
function DrawIntegralSymbol(localContext, leftX, baselineY, color, font, fontSize, lowerBoundString, upperBoundString)
{
    //everything is calculated in relation to median of font
    //values were experimentaly measured from existing math software

    //set text properties
    localContext.textAlign = "left";
    localContext.textBaseline = "alphabetic"; 
    localContext.fillStyle = color;

    //select median based on chosen font
    let fontMedian;

    if (font === "Times New Roman")
    {
        fontMedian = tnrMedian;
    }
    else
    {
        fontMedian = arialMedian;
    }


    //integral sign draw

    let integralHeightFontMedianRatio = (arialIntegralTop - arialIntegralBottom)/fontMedian;
    let integralHeightFontMedianRequiredRatio = 4.74;
    let integralNewFontSize = fontSize*(integralHeightFontMedianRequiredRatio/integralHeightFontMedianRatio);

    let integralBottomFontMedianRequiredRatio = 1.82;
    //we move the integral down based on the size the font, but then we must substract the default vertical integral sign offset based on its new font size
    let integralVerticalOffset = fontSize*(fontMedian*integralBottomFontMedianRequiredRatio) - integralNewFontSize*(-arialIntegralBottom);
   
    localContext.font = integralNewFontSize.toString() + "px " + font;
    //save integral width
    let integralPixelWidth = localContext.measureText("∫").width;
    localContext.fillText("∫", leftX, baselineY + integralVerticalOffset);


    //lower bound draw

    let integralLowerBoundFontMedianRequiredRatio = 1.94;
    let integralLowerBoundVerticalOffset = fontSize*(fontMedian*integralLowerBoundFontMedianRequiredRatio);

    let integralLowerBoundFontSizeFontMedianRequiredRatio = 0.71;
    //fontMedian ratio for base text cancels out with fontMedian ratio for the upper bound text
    let integralLowerBoundNewFontSize = fontSize*(fontMedian*integralLowerBoundFontSizeFontMedianRequiredRatio)/fontMedian;

    //proportional to integral size, plus there is a gap
    let integralLowerBoundLeftSideOffset = integralPixelWidth*0.75;

    localContext.font = integralLowerBoundNewFontSize.toString() + "px " + font;
    let lowerBoundPixelWidth = localContext.measureText(lowerBoundString).width;
    localContext.fillText(lowerBoundString, leftX + integralLowerBoundLeftSideOffset, baselineY + integralLowerBoundVerticalOffset);


    //upper bound draw

    let integralUpperBoundFontMedianRequiredRatio = 2.38;
    let integralUpperBoundVerticalOffset = -fontSize*(fontMedian*integralUpperBoundFontMedianRequiredRatio);

    let integralUpperBoundFontSizeFontMedianRequiredRatio = 0.71;
    //fontMedian ratio for base text cancels out with fontMedian ratio for the upper bound text
    let integralUpperBoundNewFontSize = fontSize*(fontMedian*integralUpperBoundFontSizeFontMedianRequiredRatio)/fontMedian;

    //proportional to integral size, plus there is a gap
    let integralUpperBoundLeftSideOffset = integralPixelWidth*1.15;

    localContext.font = integralUpperBoundNewFontSize.toString() + "px " + font;
    let upperBoundPixelWidth = localContext.measureText(upperBoundString).width;
    localContext.fillText(upperBoundString, leftX + integralUpperBoundLeftSideOffset, baselineY + integralUpperBoundVerticalOffset);

    let lowerBoundEnd = integralLowerBoundLeftSideOffset + lowerBoundPixelWidth;
    let upperBoundEnd = integralUpperBoundLeftSideOffset + upperBoundPixelWidth;

    return lowerBoundEnd >= upperBoundEnd ? lowerBoundEnd : upperBoundEnd;
}

//function, that draws exponent part of exponent notation
//exponent is drawn with respect to font baseline and font size
//returns exponent width, so further text can be properly offset
function DrawExponent(localContext, leftX, baselineY, color, font, fontSize, exponentString)
{
    //everything is calculated in relation to median of font
    //values were experimentaly measured from existing math software

    //set text properties
    localContext.textAlign = "left";
    localContext.textBaseline = "alphabetic"; 
    localContext.fillStyle = color;

    //select median based on chosen font
    let fontMedian;

    if (font === "Times New Roman")
    {
        fontMedian = tnrMedian;
    }
    else
    {
        fontMedian = arialMedian;
    }


    //draw exponent

    let exponentMedianFontMedianRequiredRatio = 0.72;
    let exponentNewFontSize = fontSize*exponentMedianFontMedianRequiredRatio;

    let exponentVerticalOffsetFontMedianRequiredRatio = 0.81;
    let exponentVerticalOffset = -fontSize*(fontMedian*exponentVerticalOffsetFontMedianRequiredRatio);

    //small gap proportional to font size to make sure that exponent and base will not colide
    let exponentHorizontalOffset = fontSize*0.01;

    localContext.font = exponentNewFontSize.toString() + "px " + font;
    let exponentPixelWidth = localContext.measureText(exponentString).width;
    localContext.fillText(exponentString, leftX + exponentHorizontalOffset, baselineY + exponentVerticalOffset);


    //start gap + exponent width + end gap
    return exponentHorizontalOffset + exponentPixelWidth + fontSize*0.1;
}

//function, that draws whole fraction
//fraction is drawn with respect to font baseline and font size
//returns fraction width, so further text can be properly offset
function DrawFraction(localContext, leftX, baselineY, color, font, fontSize, numeratorString, denominatorString)
{
    //everything is calculated in relation to median of font
    //values were experimentaly measured from existing math software

    //set text properties
    localContext.textAlign = "center";
    localContext.textBaseline = "alphabetic";
    localContext.fillStyle = color;

    //select median based on chosen font
    let fontMedian;

    if (font === "Times New Roman")
    {
        fontMedian = tnrMedian;
    }
    else
    {
        fontMedian = arialMedian;
    }

    //calculate width of numerator and denominator
    localContext.font = fontSize.toString() + "px " + font;
    let numeratorPixelWidth = localContext.measureText(numeratorString).width;
    let denominatorPixelWidth = localContext.measureText(denominatorString).width;

    //get whole fraction width
    let fractionWidth = numeratorPixelWidth >= denominatorPixelWidth ? numeratorPixelWidth : denominatorPixelWidth;


    //numerattor draw

    let numeratorBaselineFontMedianRequiredRatio = 1.16;
    let numeratorBaselineVerticalOffset = -fontSize*(fontMedian*numeratorBaselineFontMedianRequiredRatio);

    localContext.fillText(numeratorString, leftX + fractionWidth/2, baselineY + numeratorBaselineVerticalOffset);


    //denominator draw

    let denominatorBaselineFontMedianRequiredRatio = 1.47;
    let denominatorBaselineVerticalOffset = fontSize*(fontMedian*denominatorBaselineFontMedianRequiredRatio);

    localContext.fillText(denominatorString, leftX + fractionWidth/2, baselineY + denominatorBaselineVerticalOffset);


    //fraction line draw

    let fractionLineFontMedianRequiredRatio = 0.58;
    let fractionLineVerticalOffset = -fontSize*(fontMedian*fractionLineFontMedianRequiredRatio);

    let fractionLineThickness = fontSize*(fontMedian*0.125);

    localContext.strokeStyle = color;
    localContext.lineWidth = fractionLineThickness;

    localContext.beginPath();
    localContext.moveTo(leftX, baselineY + fractionLineVerticalOffset);
    localContext.lineTo(leftX + fractionWidth, baselineY + fractionLineVerticalOffset);
    localContext.stroke();

    //fraction width + end gap
    return fractionWidth + fontSize*0.15;
}

//function, that draws sigma sum symbol with lower and upper bound
//sigma is drawn with respect to font baseline and font size
//returns sigma sum width, so further text can be properly offset
function DrawSigmaSumSymbol(localContext, leftX, baselineY, color, font, fontSize, lowerBoundString, upperBoundString)
{
    //everything is calculated in relation to median of font
    //values were experimentaly measured from existing math software

    //set text properties
    localContext.textAlign = "center";
    localContext.textBaseline = "alphabetic"; 
    localContext.fillStyle = color;

    //select median based on chosen font
    let fontMedian;
    //sigma symbol proportions are different for Times New Roman and Arial font, so they also must be set here
    let sigmaTop;
    let sigmaBottom;

    if (font === "Times New Roman")
    {
        fontMedian = tnrMedian;

        sigmaTop = tnrSigmaTop;
        sigmaBottom = tnrSigmaBottom;
    }
    else
    {
        fontMedian = arialMedian;

        sigmaTop = arialSigmaTop;
        sigmaBottom = arialSigmaBottom;
    }


    //lower bound calcultions

    let sigmaLowerBoundFontMedianRequiredRatio = 2.59;
    let sigmaLowerBoundVerticalOffset = fontSize*(fontMedian*sigmaLowerBoundFontMedianRequiredRatio);

    let sigmaLowerBoundFontSizeFontMedianRequiredRatio = 0.71;
    //fontMedian ratio for base text cancels out with fontMedian ratio for the upper bound text
    let sigmaLowerBoundNewFontSize = fontSize*(fontMedian*sigmaLowerBoundFontSizeFontMedianRequiredRatio)/fontMedian;

    localContext.font = sigmaLowerBoundNewFontSize.toString() + "px " + font;
    let lowerBoundPixelWidth = localContext.measureText(lowerBoundString).width;


    //upper bound calculations

    let sigmaUpperBoundFontMedianRequiredRatio = 2.72;
    let sigmaUpperBoundVerticalOffset = -fontSize*(fontMedian*sigmaUpperBoundFontMedianRequiredRatio);

    let sigmaUpperBoundFontSizeFontMedianRequiredRatio = 0.71;
    //fontMedian ratio for base text cancels out with fontMedian ratio for the upper bound text
    let sigmaUpperBoundNewFontSize = fontSize*(fontMedian*sigmaUpperBoundFontSizeFontMedianRequiredRatio)/fontMedian;

    localContext.font = sigmaUpperBoundNewFontSize.toString() + "px " + font;
    let upperBoundPixelWidth = localContext.measureText(upperBoundString).width;

    //bigger of two bounds
    let longerBoundWidth = upperBoundPixelWidth >= lowerBoundPixelWidth ? upperBoundPixelWidth : lowerBoundPixelWidth;


    //sigma calculations

    let sigmaHeightFontMedianRatio = (sigmaTop - sigmaBottom)/fontMedian;
    let sigmaHeightFontMedianRequiredRatio = 3.03;
    let sigmaNewFontSize = fontSize*(sigmaHeightFontMedianRequiredRatio/sigmaHeightFontMedianRatio);
    
    let sigmaBottomFontMedianRequiredRatio = 0.95;
    //we move the sigma down based on the size the font, but then we must substract the default vertical sigma sign offset based on its new font size
    let sigmaVerticalOffset = fontSize*(fontMedian*sigmaBottomFontMedianRequiredRatio) - sigmaNewFontSize*(-sigmaBottom);
       
    localContext.font = sigmaNewFontSize.toString() + "px " + font;
    let sigmaPixelWidth = localContext.measureText("∑").width;

    //widest element out of sigma sign, lower bound and upper bound
    let widestElementWidth = sigmaPixelWidth >= longerBoundWidth ? sigmaPixelWidth : longerBoundWidth;


    //draw

    //everything is going to be drawn on the same vertical centerline
    //that also means, that all three elements are going to be shifted to the right by widestElementWidth/2
    localContext.textAlign = "center";

    //bounds are going to be drawn first with appropriate font sizes
    localContext.font = sigmaUpperBoundNewFontSize.toString() + "px " + font;
    localContext.fillText(lowerBoundString, leftX + widestElementWidth/2, baselineY + sigmaLowerBoundVerticalOffset);
    localContext.fillText(upperBoundString, leftX + widestElementWidth/2, baselineY + sigmaUpperBoundVerticalOffset);

    //then sigma is going to be drawn with appropriate font size as well
    localContext.font = sigmaNewFontSize.toString() + "px " + font;
    localContext.fillText("∑", leftX + widestElementWidth/2, baselineY + sigmaVerticalOffset);

    //width of the widest element is returned togther with small gap on the right proportional to font size
    return widestElementWidth + fontSize*0.1;
}
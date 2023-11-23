//Fourier series
//Ing. Tomas Jarusek, 11/2023

function InitEventCalendar(animation)
{
    //manually calculated totalAnimationTime
    let totalAnimationTime = 38000;
    let totalAnimationTimeFirstTerm = 20000;

    //animation is going to be repeated finitely many times based on user input
    //technically, because intermediate results are saved, ALMOST whole term calculation could be done at once,
    //but because of clarity and workload balancing, it is split into logical steps done at different time points
    for (let i = 0; i <= finalTermNumber; i++)
    {
        //first term is going to be handled differently
        if (i === 0)
        {
            //general formula for 0th coefficient simplifies to just taking integral of a function to analyze over a period and multipling by 1/period (c0 has no complex part)
            //c0 then represents a vertical shift, which is added to a sum as a linear function y = c0

            animation.AddEventToCalendar(1000, function()
            {
                termIntegral = CalculateDefiniteIntegral(functionToAnalyze, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2);

                fourierZerothCoefficientRegularForm = [(1/functionToAnalyzePeriod)*termIntegral, 0];

                //IMPORTANT - even though zeroth coefficient is just a vertical shift, it still technically generated from cosine function
                //and that has important consequence for spectrum drawing - if the coefficient is negative, we can't just show negative value for magnitude,
                //because magnitude is always positive - so when negative coefficient is converted into polar coordinates
                //the magnitute is going to be positive and the negative sign is going to to come from the shift of cosine function by +-π
                fourierZerothCoefficient = ConvertComplexNumberFromGeneralFormToPolarFormNegPiPosPi(fourierZerothCoefficientRegularForm);
                //negative coefficient is always going to be shown as positive π
                fourierZerothCoefficient[1] = Math.abs(fourierZerothCoefficient[1]);

                //for the shift itself, the original possibly negative real value is used
                zerothTermFinalLinearFunction = GenerateLinearFunctionFromZerothCoefficient(fourierZerothCoefficientRegularForm[0], stepX, startX, endX);
            });

            animation.AddEventToCalendar(13000, function()
            {
                AddTwoFunctions(fourierTermsSum, zerothTermFinalLinearFunction);
            });

            //end of animation?
            if (i !== finalTermNumber)
            {
                animation.AddEventToCalendar(20000, function()
                {
                    termNumber++;
                });
            }
        }
        else
        {
            //manually calculated totalAnimationTime

            animation.AddEventToCalendar(totalAnimationTimeFirstTerm + 2000 + (i - 1)*totalAnimationTime, function()
            {  
                let termSineAndCosine = GenerateSineAndCosineForFourierCoefficientCalculation(PeriodToFrequency(functionToAnalyzePeriod)*termNumber, stepX, startX, endX);

                termSine = termSineAndCosine[0];
                termCosine = termSineAndCosine[1];
            });
            
            animation.AddEventToCalendar(totalAnimationTimeFirstTerm + 4000 + (i - 1)*totalAnimationTime, function()
            {  
                let functionMultipliedByTermSineAndCosine = MultiplyFunctionToAnalyzeBySineAndCosine(functionToAnalyze, termSine, termCosine);

                termSineMultiplied = functionMultipliedByTermSineAndCosine[0];
                termCosineMultiplied = functionMultipliedByTermSineAndCosine[1];
            });

            //sine and cosine graphs are now showing sine and cosine multiplied by function to analyze
            animation.AddEventToCalendar(totalAnimationTimeFirstTerm + 13000 + (i - 1)*totalAnimationTime, function()
            {      
                sineGraph.SetAxesDescription("t", "x(t)sin(kω₁t)", 8, 9, 16);
                cosineGraph.SetAxesDescription("t", "x(t)cos(kω₁t)", 8, 9, 16);
            });

            animation.AddEventToCalendar(totalAnimationTimeFirstTerm + 22000 + (i - 1)*totalAnimationTime, function()
            {
                termIntegrals = CalculateTermIntegrals(termSineMultiplied, termCosineMultiplied, functionToAnalyzePeriod);

                termNegativeCoefficient = CalculateFourierSeriesNegativeCoefficient(termIntegrals[0], termIntegrals[1], functionToAnalyzePeriod);
                termPositiveCoefficient = CalculateFourierSeriesPositiveCoefficient(termIntegrals[0], termIntegrals[1], functionToAnalyzePeriod);

                fourierNegativeCoefficients.push([-PeriodToFrequency(functionToAnalyzePeriod)*termNumber, termNegativeCoefficient]);
                fourierPositiveCoefficients.push([PeriodToFrequency(functionToAnalyzePeriod)*termNumber, termPositiveCoefficient]);

                termFinalCosine = GenerateCosineFromPositiveAndNegativeCoefficient(termNegativeCoefficient, termPositiveCoefficient, PeriodToFrequency(functionToAnalyzePeriod)*termNumber, stepX, startX, endX);
            });

            animation.AddEventToCalendar(totalAnimationTimeFirstTerm + 31000 + (i - 1)*totalAnimationTime, function()
            {
                AddTwoFunctions(fourierTermsSum, termFinalCosine);
            });

            //sine and cosine graphs go back to showing plain sine and cosine
            animation.AddEventToCalendar(totalAnimationTimeFirstTerm + 38000 + (i - 1)*totalAnimationTime, function()
            {
                sineGraph.SetAxesDescription("t", "sin(kω₁t)", 8, 9, 16);
                cosineGraph.SetAxesDescription("t", "cos(kω₁t)", 8, 9, 16);
            });

            //end of animation?
            if (i !== finalTermNumber)
            {
                animation.AddEventToCalendar(totalAnimationTimeFirstTerm + 38000 + (i - 1)*totalAnimationTime, function()
                {
                    termNumber++;
                });
            }
        }
    }
}

function InitAnimationCalendar(localContext, animation)
{
    //manually calculated totalAnimationTime
    let totalAnimationTime = 38000;
    let totalAnimationTimeFirstTerm = 20000;

    //animation is going to be repeated finitely many times based on user input
    for (let i = 0; i <= finalTermNumber; i++)
    {
        //first term is going to be handled differently
        if (i === 0)
        {
            //draw function to analyze
            animation.AddAnimationToCalendar(0, 7000, function(percentage)
            {
                startingFunctionGraph.DrawLine(localContext, functionToAnalyze, "rgb(0, 0, 155)", 2);
            });

            //draw term sum appearance, description appearance
            animation.AddAnimationToCalendar(0, 1000, function(percentage)
            {
                finalSumGraph.DrawLineFadeInOutAnimation(localContext, fourierTermsSum, "rgb(255, 0, 0)", 2, "in", percentage);

                let interpolatedColor = AddOpacityToColor("rgb(0,0,0)", percentage);
                DrawFourierDescription_1_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_1_Line_2(localContext, 20, 735, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_1_Line_3(localContext, 20, 756, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_1_Line_4(localContext, 20, 805, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_1_Line_5(localContext, 20, 861, "Times New Roman", 17, interpolatedColor, functionToAnalyzePeriod, 0);
            });

            //draw term sum
            animation.AddAnimationToCalendar(1000, 13000, function(percentage)
            {
                finalSumGraph.DrawLine(localContext, fourierTermsSum, "rgb(255, 0, 0)", 2);
            });

            //draw description
            animation.AddAnimationToCalendar(1000, 3000, function(percentage)
            {
                DrawFourierDescription_1_Line_1(localContext, 20, 705, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_2(localContext, 20, 735, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_3(localContext, 20, 756, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_4(localContext, 20, 805, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_5(localContext, 20, 861, "Times New Roman", 17, "rgb(0,0,0)", functionToAnalyzePeriod, 0);
            });

            //integral of function to analyze appearance, description
            animation.AddAnimationToCalendar(3000, 7000, function(percentage)
            {
                startingFunctionGraph.DrawIntegralHorizontalAppearAnimation(localContext, functionToAnalyze, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "right", percentage);

                let currentIntegralValue = CalculateDefiniteIntegral(functionToAnalyze, -functionToAnalyzePeriod/2, -functionToAnalyzePeriod/2 + percentage*functionToAnalyzePeriod);
                DrawFourierDescription_1_Line_1(localContext, 20, 705, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_2(localContext, 20, 735, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_3(localContext, 20, 756, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_4(localContext, 20, 805, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_5(localContext, 20, 861, "Times New Roman", 17, "rgb(0,0,0)", functionToAnalyzePeriod, currentIntegralValue);
            });

            //draw integral of function to analyze, description
            animation.AddAnimationToCalendar(7000, 19000, function(percentage)
            {
                startingFunctionGraph.DrawIntegralHorizontalAppearAnimation(localContext, functionToAnalyze, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "right", 1);

                //it is done like this, so the line is drawn on top of the area
                startingFunctionGraph.DrawLine(localContext, functionToAnalyze, "rgb(0, 0, 155)", 2);

                DrawFourierDescription_1_Line_1(localContext, 20, 705, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_2(localContext, 20, 735, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_3(localContext, 20, 756, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_4(localContext, 20, 805, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_1_Line_5(localContext, 20, 861, "Times New Roman", 17, "rgb(0,0,0)", functionToAnalyzePeriod, termIntegral);
            });

            //draw term cosine appearance, spectrum data points appearance
            animation.AddAnimationToCalendar(9000, 11000, function(percentage)
            {
                finalSumGraph.DrawLineFadeInOutAnimation(localContext, TranslateFunctionVertically(zerothTermFinalLinearFunction, verticalOffset), "rgb(0, 0, 155)", 3, "in", percentage);

                absSpectrum.DrawPointAsVerticalLineFadeInOutAnimation(localContext, 0, fourierZerothCoefficient[0], "rgb(255, 0, 0)", 2, "in", percentage);
                absSpectrum.DrawPointFadeInOutAnimation(localContext, 0, fourierZerothCoefficient[0], 3.5, "rgb(255, 0, 0)", "in", percentage);

                argSpectrum.DrawPointAsVerticalLineFadeInOutAnimation(localContext, 0, fourierZerothCoefficient[1]/Math.PI, "rgb(255, 0, 0)", 2, "in", percentage);
                argSpectrum.DrawPointFadeInOutAnimation(localContext, 0, fourierZerothCoefficient[1]/Math.PI, 3.5, "rgb(255, 0, 0)", "in", percentage);
            });

            //draw term sum
            animation.AddAnimationToCalendar(11000, 13000, function(percentage)
            {
                finalSumGraph.DrawLine(localContext, TranslateFunctionVertically(zerothTermFinalLinearFunction, verticalOffset), "rgb(0, 0, 155)", 3);
            });

            //draw spectrum data points
            animation.AddAnimationToCalendar(11000, 20000, function(percentage)
            {
                absSpectrum.DrawPointAsVerticalLine(localContext, 0, fourierZerothCoefficient[0], "rgb(255, 0, 0)", 2);
                absSpectrum.DrawPoint(localContext, 0, fourierZerothCoefficient[0], 3.5, "rgb(255, 0, 0)");

                argSpectrum.DrawPointAsVerticalLine(localContext, 0, fourierZerothCoefficient[1]/Math.PI, "rgb(255, 0, 0)", 2);
                argSpectrum.DrawPoint(localContext, 0, fourierZerothCoefficient[1]/Math.PI, 3.5, "rgb(255, 0, 0)");
            });

            //draw addition
            animation.AddAnimationToCalendar(13000, 17000, function(percentage)
            {
                finalSumGraph.DrawLinesAdditionNoBaseAnimation(localContext, zerothTermFinalLinearFunction, fourierTermsSum, verticalOffset, "rgb(255, 0, 0)", 2, "rgb(0, 0, 155)", 3, 0.7, 0.9, percentage);
            });

            //draw term sum
            animation.AddAnimationToCalendar(17000, 20000, function(percentage)
            {
                finalSumGraph.DrawLine(localContext, fourierTermsSum, "rgb(255, 0, 0)", 2);
            });

            //end of animation?
            if (i === finalTermNumber)
            {
                //transition to end state
                animation.AddAnimationToCalendar(19000, 20000, function(percentage)
                {
                    //function to analyze satys visible
                    startingFunctionGraph.DrawLine(localContext, functionToAnalyze, "rgb(0, 0, 155)", 2);

                    //integral fade out
                    startingFunctionGraph.DrawIntegralFadeInOutAnimation(localContext, functionToAnalyze, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "out", percentage);

                    //current description fade out
                    let interpolatedColor = AddOpacityToColor("rgb(0,0,0)", 1 - percentage);
                    DrawFourierDescription_1_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_1_Line_2(localContext, 20, 735, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_1_Line_3(localContext, 20, 756, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_1_Line_4(localContext, 20, 805, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_1_Line_5(localContext, 20, 861, "Times New Roman", 17, interpolatedColor, functionToAnalyzePeriod, termIntegral);

                    //next description fade in
                    interpolatedColor = AddOpacityToColor("rgb(0,0,0)", percentage);
                    DrawFourierDescription_6_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor);
                });
            }
            else
            {
                //transition to next term
                animation.AddAnimationToCalendar(19000, 20000, function(percentage)
                {
                    //function to analyze satys visible
                    startingFunctionGraph.DrawLine(localContext, functionToAnalyze, "rgb(0, 0, 155)", 2);

                    //integral fade out
                    startingFunctionGraph.DrawIntegralFadeInOutAnimation(localContext, functionToAnalyze, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "out", percentage);

                    //current description fade out
                    let interpolatedColor = AddOpacityToColor("rgb(0,0,0)", 1 - percentage);
                    DrawFourierDescription_1_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_1_Line_2(localContext, 20, 735, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_1_Line_3(localContext, 20, 756, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_1_Line_4(localContext, 20, 805, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_1_Line_5(localContext, 20, 861, "Times New Roman", 17, interpolatedColor, functionToAnalyzePeriod, termIntegral);

                    //next description fade in
                    interpolatedColor = AddOpacityToColor("rgb(0,0,0)", percentage);
                    DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor, termNumber + 1);
                    DrawFourierDescription_2_Line_2(localContext, 20, 745, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_2_Line_3(localContext, 20, 785, "Times New Roman", 17, interpolatedColor, functionToAnalyzePeriod);
                    DrawFourierDescription_2_Line_4(localContext, 20, 825, "Times New Roman", 17, interpolatedColor, termNumber + 1, functionToAnalyzePeriod);
                    DrawFourierDescription_2_Line_5(localContext, 20, 846, "Times New Roman", 17, interpolatedColor, termNumber + 1, functionToAnalyzePeriod);
                });
            }
        }
        else
        {
            //draw function to analyze
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 0 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 38000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                startingFunctionGraph.DrawLine(localContext, functionToAnalyze, "rgb(0, 0, 155)", 2);
            });

            //draw term sum
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 0 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 31000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                finalSumGraph.DrawLine(localContext, fourierTermsSum, "rgb(255, 0, 0)", 2);
            });

            //draw spectrum
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 0 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 38000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                absSpectrum.DrawPointAsVerticalLine(localContext, 0, fourierZerothCoefficient[0], "rgb(255, 0, 0)", 2);
                absSpectrum.DrawPoint(localContext, 0, fourierZerothCoefficient[0], 3.5, "rgb(255, 0, 0)");

                argSpectrum.DrawPointAsVerticalLine(localContext, 0, fourierZerothCoefficient[1]/Math.PI, "rgb(255, 0, 0)", 2);
                argSpectrum.DrawPoint(localContext, 0, fourierZerothCoefficient[1]/Math.PI, 3.5, "rgb(255, 0, 0)");

                for (let i = 0; i < termNumber - 1; i++)
                {
                    absSpectrum.DrawPointAsVerticalLine(localContext, fourierPositiveCoefficients[i][0]/Math.PI, fourierPositiveCoefficients[i][1][0], "rgb(255, 0, 0)", 2);
                    absSpectrum.DrawPoint(localContext, fourierPositiveCoefficients[i][0]/Math.PI, fourierPositiveCoefficients[i][1][0], 3.5, "rgb(255, 0, 0)");

                    argSpectrum.DrawPointAsVerticalLine(localContext, fourierPositiveCoefficients[i][0]/Math.PI, fourierPositiveCoefficients[i][1][1]/Math.PI, "rgb(255, 0, 0)", 2);
                    argSpectrum.DrawPoint(localContext, fourierPositiveCoefficients[i][0]/Math.PI, fourierPositiveCoefficients[i][1][1]/Math.PI, 3.5, "rgb(255, 0, 0)");
                }

                for (let i = 0; i < termNumber - 1; i++)
                {
                    absSpectrum.DrawPointAsVerticalLine(localContext, fourierNegativeCoefficients[i][0]/Math.PI, fourierNegativeCoefficients[i][1][0], "rgb(255, 0, 0)", 2);
                    absSpectrum.DrawPoint(localContext, fourierNegativeCoefficients[i][0]/Math.PI, fourierNegativeCoefficients[i][1][0], 3.5, "rgb(255, 0, 0)");

                    argSpectrum.DrawPointAsVerticalLine(localContext, fourierNegativeCoefficients[i][0]/Math.PI, fourierNegativeCoefficients[i][1][1]/Math.PI, "rgb(255, 0, 0)", 2);
                    argSpectrum.DrawPoint(localContext, fourierNegativeCoefficients[i][0]/Math.PI, fourierNegativeCoefficients[i][1][1]/Math.PI, 3.5, "rgb(255, 0, 0)");
                }
            });

            //draw first description
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 0 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 6000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, "rgb(0,0,0)", termNumber);
                DrawFourierDescription_2_Line_2(localContext, 20, 745, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_2_Line_3(localContext, 20, 785, "Times New Roman", 17, "rgb(0,0,0)", functionToAnalyzePeriod);
                DrawFourierDescription_2_Line_4(localContext, 20, 825, "Times New Roman", 17, "rgb(0,0,0)", termNumber, functionToAnalyzePeriod);
                DrawFourierDescription_2_Line_5(localContext, 20, 846, "Times New Roman", 17, "rgb(0,0,0)", termNumber, functionToAnalyzePeriod);
            });
            
            //draw sine cosine appearance
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 2000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 4000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                sineGraph.DrawLineFadeInOutAnimation(localContext, termSine, "rgb(0, 0, 155)", 2, "in", percentage);
                cosineGraph.DrawLineFadeInOutAnimation(localContext, termCosine, "rgb(0, 0, 155)", 2, "in", percentage);
            });

            //draw sine cosine
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 4000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 9000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                sineGraph.DrawLine(localContext, termSine, "rgb(0, 0, 155)", 2);
                cosineGraph.DrawLine(localContext, termCosine, "rgb(0, 0, 155)", 2);
            });

            //draw first second description transition 
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 6000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 7000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                interpolatedColor = AddOpacityToColor("rgb(0,0,0)", 1 - percentage);
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor, termNumber);
                DrawFourierDescription_2_Line_2(localContext, 20, 745, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_2_Line_3(localContext, 20, 785, "Times New Roman", 17, interpolatedColor, functionToAnalyzePeriod);
                DrawFourierDescription_2_Line_4(localContext, 20, 825, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod);
                DrawFourierDescription_2_Line_5(localContext, 20, 846, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod);

                interpolatedColor = AddOpacityToColor("rgb(0,0,0)", percentage);
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor, termNumber);
                DrawFourierDescription_3_Line_1(localContext, 20, 735, "Times New Roman", 17, interpolatedColor);
            });

            //draw second description
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 7000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 15000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, "rgb(0,0,0)", termNumber);
                DrawFourierDescription_3_Line_1(localContext, 20, 735, "Times New Roman", 17, "rgb(0,0,0)");
            });

            //draw sine cosine multiplication, draw vertical line
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 9000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 13000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                sineGraph.DrawHorizontalLineAppearAnimation(localContext, termSineMultiplied, "rgb(0, 0, 155)", 2, "right", percentage);
                sineGraph.DrawHorizontalLineAppearAnimation(localContext, termSine, "rgb(0, 0, 155)", 2, "left", 1 - percentage);

                cosineGraph.DrawHorizontalLineAppearAnimation(localContext, termCosineMultiplied, "rgb(0, 0, 155)", 2, "right", percentage);
                cosineGraph.DrawHorizontalLineAppearAnimation(localContext, termCosine, "rgb(0, 0, 155)", 2, "left", 1 - percentage);

                startingFunctionGraph.DrawMovingVerticalLineAnimation(localContext, startX, endX, multiplyBarFunctionToAnalyzeMiddleY, multiplyBarFunctionToAnalyzeLineLength, "rgb(255, 0, 0)", 4, "right", percentage);
                sineGraph.DrawMovingVerticalLineAnimation(localContext, startX, endX, multiplyBarSineCosineMiddleY, multiplyBarSineCosineLineLength, "rgb(255, 0, 0)", 4, "right", percentage);
                cosineGraph.DrawMovingVerticalLineAnimation(localContext, startX, endX, multiplyBarSineCosineMiddleY, multiplyBarSineCosineLineLength, "rgb(255, 0, 0)", 4, "right", percentage);
            });

            //draw sine cosine multiplied
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 13000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 18000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                sineGraph.DrawLine(localContext, termSineMultiplied, "rgb(0, 0, 155)", 2);
                cosineGraph.DrawLine(localContext, termCosineMultiplied, "rgb(0, 0, 155)", 2);
            });

            //draw second third description transition
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 15000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 16000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                interpolatedColor = AddOpacityToColor("rgb(0,0,0)", 1 - percentage);
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor, termNumber);
                DrawFourierDescription_3_Line_1(localContext, 20, 735, "Times New Roman", 17, interpolatedColor);

                interpolatedColor = AddOpacityToColor("rgb(0,0,0)", percentage);
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor, termNumber);
                DrawFourierDescription_4_Line_1(localContext, 20, 735, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_4_Line_2(localContext, 20, 756, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_4_Line_3(localContext, 20, 805, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_4_Line_4(localContext, 20, 860, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, 0, 0);
            });

            //draw third description
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 16000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 18000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, "rgb(0,0,0)", termNumber);
                DrawFourierDescription_4_Line_1(localContext, 20, 735, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_4_Line_2(localContext, 20, 756, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_4_Line_3(localContext, 20, 805, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_4_Line_4(localContext, 20, 860, "Times New Roman", 17, "rgb(0,0,0)", termNumber, functionToAnalyzePeriod, 0, 0);
            });

            //draw sine cosine multiplied integrals appearance, sine cosine multiplied, third description
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 18000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 22000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                sineGraph.DrawIntegralHorizontalAppearAnimation(localContext, termSineMultiplied, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "right", percentage);
                cosineGraph.DrawIntegralHorizontalAppearAnimation(localContext, termCosineMultiplied, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "right", percentage);

                //it is done like this, so the line is drawn on top of the area
                sineGraph.DrawLine(localContext, termSineMultiplied, "rgb(0, 0, 155)", 2);
                cosineGraph.DrawLine(localContext, termCosineMultiplied, "rgb(0, 0, 155)", 2);

                let currentSineIntegralValue = CalculateDefiniteIntegral(termSineMultiplied, -functionToAnalyzePeriod/2, -functionToAnalyzePeriod/2 + percentage*functionToAnalyzePeriod);
                let currentCosineIntegralValue = CalculateDefiniteIntegral(termCosineMultiplied, -functionToAnalyzePeriod/2, -functionToAnalyzePeriod/2 + percentage*functionToAnalyzePeriod);   
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, "rgb(0,0,0)", termNumber);
                DrawFourierDescription_4_Line_1(localContext, 20, 735, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_4_Line_2(localContext, 20, 756, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_4_Line_3(localContext, 20, 805, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_4_Line_4(localContext, 20, 860, "Times New Roman", 17, "rgb(0,0,0)", termNumber, functionToAnalyzePeriod, currentSineIntegralValue, currentCosineIntegralValue);
            });

            //draw sine cosine multiplied integrals, sine cosine multiplied
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 22000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 37000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                sineGraph.DrawIntegralHorizontalAppearAnimation(localContext, termSineMultiplied, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "right", 1);
                cosineGraph.DrawIntegralHorizontalAppearAnimation(localContext, termCosineMultiplied, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "right", 1);

                sineGraph.DrawLine(localContext, termSineMultiplied, "rgb(0, 0, 155)", 2);
                cosineGraph.DrawLine(localContext, termCosineMultiplied, "rgb(0, 0, 155)", 2);
            });

            //draw third description
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 22000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 24000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, "rgb(0,0,0)", termNumber);
                DrawFourierDescription_4_Line_1(localContext, 20, 735, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_4_Line_2(localContext, 20, 756, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_4_Line_3(localContext, 20, 805, "Times New Roman", 17, "rgb(0,0,0)");
                //filled integrals
                DrawFourierDescription_4_Line_4(localContext, 20, 860, "Times New Roman", 17, "rgb(0,0,0)", termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1]);
            });

            //draw third fourth description transition
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 24000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 25000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                interpolatedColor = AddOpacityToColor("rgb(0,0,0)", 1 - percentage);
                DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor, termNumber);
                DrawFourierDescription_4_Line_1(localContext, 20, 735, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_4_Line_2(localContext, 20, 756, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_4_Line_3(localContext, 20, 805, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_4_Line_4(localContext, 20, 860, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1]);

                interpolatedColor = AddOpacityToColor("rgb(0,0,0)", percentage);
                DrawFourierDescription_5_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor);
                DrawFourierDescription_5_Line_2(localContext, 20, 735, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod);
                DrawFourierDescription_5_Line_3(localContext, 20, 756, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1], termPositiveCoefficient);
                DrawFourierDescription_5_Line_4(localContext, 20, 777, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1], termNegativeCoefficient);
                DrawFourierDescription_5_Line_5(localContext, 20, 825, "Times New Roman", 17, interpolatedColor, termNumber);
                DrawFourierDescription_5_Line_6(localContext, 20, 870, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termPositiveCoefficient);
            });

            //draw fourth description transition
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 25000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 37000 + (i - 1)*totalAnimationTime, function(percentage)
            {      
                DrawFourierDescription_5_Line_1(localContext, 20, 705, "Times New Roman", 17, "rgb(0,0,0)");
                DrawFourierDescription_5_Line_2(localContext, 20, 735, "Times New Roman", 17, "rgb(0,0,0)", termNumber, functionToAnalyzePeriod);
                DrawFourierDescription_5_Line_3(localContext, 20, 756, "Times New Roman", 17, "rgb(0,0,0)", termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1], termPositiveCoefficient);
                DrawFourierDescription_5_Line_4(localContext, 20, 777, "Times New Roman", 17, "rgb(0,0,0)", termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1], termNegativeCoefficient);
                DrawFourierDescription_5_Line_5(localContext, 20, 825, "Times New Roman", 17, "rgb(0,0,0)", termNumber);
                DrawFourierDescription_5_Line_6(localContext, 20, 870, "Times New Roman", 17, "rgb(0,0,0)", termNumber, functionToAnalyzePeriod, termPositiveCoefficient);
            });

            //draw term cosine appearance, spectrum current data points appearance
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 27000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 29000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                finalSumGraph.DrawLineFadeInOutAnimation(localContext, TranslateFunctionVertically(termFinalCosine, verticalOffset), "rgb(0, 0, 155)", 3, "in", percentage);

                absSpectrum.DrawPointAsVerticalLineFadeInOutAnimation(localContext, fourierPositiveCoefficients[termNumber - 1][0]/Math.PI, fourierPositiveCoefficients[termNumber - 1][1][0], "rgb(255, 0, 0)", 2, "in", percentage);
                absSpectrum.DrawPointFadeInOutAnimation(localContext, fourierPositiveCoefficients[termNumber - 1][0]/Math.PI, fourierPositiveCoefficients[termNumber - 1][1][0], 3.5, "rgb(255, 0, 0)", "in", percentage);

                argSpectrum.DrawPointAsVerticalLineFadeInOutAnimation(localContext, fourierPositiveCoefficients[termNumber - 1][0]/Math.PI, fourierPositiveCoefficients[termNumber - 1][1][1]/Math.PI, "rgb(255, 0, 0)", 2, "in", percentage);
                argSpectrum.DrawPointFadeInOutAnimation(localContext, fourierPositiveCoefficients[termNumber - 1][0]/Math.PI, fourierPositiveCoefficients[termNumber - 1][1][1]/Math.PI, 3.5, "rgb(255, 0, 0)", "in", percentage);

                absSpectrum.DrawPointAsVerticalLineFadeInOutAnimation(localContext, fourierNegativeCoefficients[termNumber - 1][0]/Math.PI, fourierNegativeCoefficients[termNumber - 1][1][0], "rgb(255, 0, 0)", 2, "in", percentage);
                absSpectrum.DrawPointFadeInOutAnimation(localContext, fourierNegativeCoefficients[termNumber - 1][0]/Math.PI, fourierNegativeCoefficients[termNumber - 1][1][0], 3.5, "rgb(255, 0, 0)", "in", percentage);

                argSpectrum.DrawPointAsVerticalLineFadeInOutAnimation(localContext, fourierNegativeCoefficients[termNumber - 1][0]/Math.PI, fourierNegativeCoefficients[termNumber - 1][1][1]/Math.PI, "rgb(255, 0, 0)", 2, "in", percentage);
                argSpectrum.DrawPointFadeInOutAnimation(localContext, fourierNegativeCoefficients[termNumber - 1][0]/Math.PI, fourierNegativeCoefficients[termNumber - 1][1][1]/Math.PI, 3.5, "rgb(255, 0, 0)", "in", percentage);
            });

            //draw spectrum current data points
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 29000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 38000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                absSpectrum.DrawPointAsVerticalLine(localContext, fourierPositiveCoefficients[termNumber - 1][0]/Math.PI, fourierPositiveCoefficients[termNumber - 1][1][0], "rgb(255, 0, 0)", 2);
                absSpectrum.DrawPoint(localContext, fourierPositiveCoefficients[termNumber - 1][0]/Math.PI, fourierPositiveCoefficients[termNumber - 1][1][0], 3.5, "rgb(255, 0, 0)");

                argSpectrum.DrawPointAsVerticalLine(localContext, fourierPositiveCoefficients[termNumber - 1][0]/Math.PI, fourierPositiveCoefficients[termNumber - 1][1][1]/Math.PI, "rgb(255, 0, 0)", 2);
                argSpectrum.DrawPoint(localContext, fourierPositiveCoefficients[termNumber - 1][0]/Math.PI, fourierPositiveCoefficients[termNumber - 1][1][1]/Math.PI, 3.5, "rgb(255, 0, 0)");

                absSpectrum.DrawPointAsVerticalLine(localContext, fourierNegativeCoefficients[termNumber - 1][0]/Math.PI, fourierNegativeCoefficients[termNumber - 1][1][0], "rgb(255, 0, 0)", 2);
                absSpectrum.DrawPoint(localContext, fourierNegativeCoefficients[termNumber - 1][0]/Math.PI, fourierNegativeCoefficients[termNumber - 1][1][0], 3.5, "rgb(255, 0, 0)");

                argSpectrum.DrawPointAsVerticalLine(localContext, fourierNegativeCoefficients[termNumber - 1][0]/Math.PI, fourierNegativeCoefficients[termNumber - 1][1][1]/Math.PI, "rgb(255, 0, 0)", 2);
                argSpectrum.DrawPoint(localContext, fourierNegativeCoefficients[termNumber - 1][0]/Math.PI, fourierNegativeCoefficients[termNumber - 1][1][1]/Math.PI, 3.5, "rgb(255, 0, 0)");
            });

            //draw term cosine
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 29000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 31000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                finalSumGraph.DrawLine(localContext, TranslateFunctionVertically(termFinalCosine, verticalOffset), "rgb(0, 0, 155)", 3);
            });

            //draw addition
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 31000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 35000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                finalSumGraph.DrawLinesAdditionNoBaseAnimation(localContext, termFinalCosine, fourierTermsSum, verticalOffset, "rgb(255, 0, 0)", 2, "rgb(0, 0, 155)", 3, 0.7, 0.9, percentage);
            });
            
            //draw term sum
            animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 35000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 38000 + (i - 1)*totalAnimationTime, function(percentage)
            {
                finalSumGraph.DrawLine(localContext, fourierTermsSum, "rgb(255, 0, 0)", 2);
            });

            //end of animation?
            if (i === finalTermNumber)
            {
                //transition to end state
                animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 37000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 38000 + (i - 1)*totalAnimationTime, function(percentage)
                {
                    //integrals fade out
                    sineGraph.DrawIntegralFadeInOutAnimation(localContext, termSineMultiplied, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "out", percentage);
                    cosineGraph.DrawIntegralFadeInOutAnimation(localContext, termCosineMultiplied, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "out", percentage);

                    //sine cosine multiplied fade out
                    sineGraph.DrawLineFadeInOutAnimation(localContext, termSineMultiplied, "rgb(0, 0, 155)", 2, "out", percentage);
                    cosineGraph.DrawLineFadeInOutAnimation(localContext, termCosineMultiplied, "rgb(0, 0, 155)", 2, "out", percentage);

                    //current description fade out
                    interpolatedColor = AddOpacityToColor("rgb(0,0,0)", 1 - percentage);
                    DrawFourierDescription_5_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_5_Line_2(localContext, 20, 735, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod);
                    DrawFourierDescription_5_Line_3(localContext, 20, 756, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1], termPositiveCoefficient);
                    DrawFourierDescription_5_Line_4(localContext, 20, 777, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1], termNegativeCoefficient);
                    DrawFourierDescription_5_Line_5(localContext, 20, 825, "Times New Roman", 17, interpolatedColor, termNumber);
                    DrawFourierDescription_5_Line_6(localContext, 20, 870, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termPositiveCoefficient);

                    //next description fade in
                    interpolatedColor = AddOpacityToColor("rgb(0,0,0)", percentage);
                    DrawFourierDescription_6_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor);
                });
            }
            else
            {
                //transition to next term
                animation.AddAnimationToCalendar(totalAnimationTimeFirstTerm + 37000 + (i - 1)*totalAnimationTime, totalAnimationTimeFirstTerm + 38000 + (i - 1)*totalAnimationTime, function(percentage)
                {
                    //integrals fade out
                    sineGraph.DrawIntegralFadeInOutAnimation(localContext, termSineMultiplied, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "out", percentage);
                    cosineGraph.DrawIntegralFadeInOutAnimation(localContext, termCosineMultiplied, -functionToAnalyzePeriod/2, functionToAnalyzePeriod/2, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 0.5, "out", percentage);

                    //sine cosine multiplied fade out
                    sineGraph.DrawLineFadeInOutAnimation(localContext, termSineMultiplied, "rgb(0, 0, 155)", 2, "out", percentage);
                    cosineGraph.DrawLineFadeInOutAnimation(localContext, termCosineMultiplied, "rgb(0, 0, 155)", 2, "out", percentage);

                    //current description fade out
                    interpolatedColor = AddOpacityToColor("rgb(0,0,0)", 1 - percentage);
                    DrawFourierDescription_5_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_5_Line_2(localContext, 20, 735, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod);
                    DrawFourierDescription_5_Line_3(localContext, 20, 756, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1], termPositiveCoefficient);
                    DrawFourierDescription_5_Line_4(localContext, 20, 777, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termIntegrals[0], termIntegrals[1], termNegativeCoefficient);
                    DrawFourierDescription_5_Line_5(localContext, 20, 825, "Times New Roman", 17, interpolatedColor, termNumber);
                    DrawFourierDescription_5_Line_6(localContext, 20, 870, "Times New Roman", 17, interpolatedColor, termNumber, functionToAnalyzePeriod, termPositiveCoefficient);

                    //next description fade in
                    interpolatedColor = AddOpacityToColor("rgb(0,0,0)", percentage);
                    DrawFourierDescription_2_Line_1(localContext, 20, 705, "Times New Roman", 17, interpolatedColor, termNumber + 1);
                    DrawFourierDescription_2_Line_2(localContext, 20, 745, "Times New Roman", 17, interpolatedColor);
                    DrawFourierDescription_2_Line_3(localContext, 20, 785, "Times New Roman", 17, interpolatedColor, functionToAnalyzePeriod);
                    DrawFourierDescription_2_Line_4(localContext, 20, 825, "Times New Roman", 17, interpolatedColor, termNumber + 1, functionToAnalyzePeriod);
                    DrawFourierDescription_2_Line_5(localContext, 20, 846, "Times New Roman", 17, interpolatedColor, termNumber + 1, functionToAnalyzePeriod);
                });
            }
        }
    }
}



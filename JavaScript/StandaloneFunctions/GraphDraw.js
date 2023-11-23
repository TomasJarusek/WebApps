//Graph drawing
//Ing. Tomas Jarusek, 11/2023

//standard 2D graph
class Graph2D
{
	constructor() 
	{
        //top left coordinate
        this.startX = 100;
        this.startY = 100;
        //side lengths
        this.sizeX = 800;
        this.sizeY = 800;
        //half side lengths
        this.halfSizeY = this.sizeY/2;
        this.halfSizeX = this.sizeX/2;

        //axis main line thickness
        this.axisThickness = 2;
        //axis mark thickness
        this.axisMarkThickness = 2;
        //axis mark length
        this.axisMarkLength = 10;

        //pixel spacings of axes marks
        this.axisXMarkSpacing = 40;
        this.axisYMarkSpacing = 40;
        //number of pixels that are going to represent length 1 in real coordinates
        this.axisXStep = 20;
        this.axisYStep = 20;

        //units for axis values
        this.axisXUnit = "";
        this.axisYUnit = "";

        //use exp form for axis markings when possible
        this.useExpFormXAxis = false;
        this.useExpFormYAxis = false;

        //text offset relative to axis line
        this.axisXFontVerticalOffset = 10;
        this.axisYFontHorizontalOffset = 20;
        //max number of decimal points for axis
        this.axisXNumberDecimals = 2;
        this.axisYNumberDecimals = 2;
        //font size
        this.axisFontSize = 10;

        //axis descriptions
        this.axisXDescription = "x";
        this.axisYDescription = "y";
        //descriptions offsets from border
        this.axisXDescriptionOffset = 10;
        this.axisYDescriptionOffset = 15;
        //description font size
        this.axisDescriptionFontSize = 20;

        //background markings
        this.displayAxisBackgroundMarkings = true;
        this.axisBackgroundMarkingsThickness = 2;
        this.axisBackgroundMarkingsColor = "rgb(230, 230, 230)";

        //coordinates of this point are always going to be in the center of graph window
        this.viewportRealOffset = [0,0];

        //DrawAxes() stores here real positions of axes
        //it's not always 0, because they can be clamped to a side because of a viewport shift
        this.axisXCurrentRealCoordY = 0;
        this.axisYCurrentRealCoordX = 0;

        //display viewpoint and borders
        this.displayDebug = true;
	}

    //---------------------------------- SETTERS ----------------------------------
    
    SetPositionParameters(startX, startY, sizeX, sizeY)
    {
        this.startX = startX;
        this.startY = startY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.halfSizeY = this.sizeY/2;
        this.halfSizeX = this.sizeX/2;
    }

    SetAxesDrawProperties(axisThickness, axisMarkThickness, axisMarkLength)
    {
        this.axisThickness = axisThickness;
        this.axisMarkThickness = axisMarkThickness;
        this.axisMarkLength = axisMarkLength;
    }

    SetAxesScale(axisXMarkSpacing, axisYMarkSpacing, axisXStep, axisYStep)
    {
        this.axisXMarkSpacing = axisXMarkSpacing;
        this.axisYMarkSpacing = axisYMarkSpacing;
        this.axisXStep = axisXStep;
        this.axisYStep = axisYStep;
    }

    SetAxesUnit(axisXUnit, axisYUnit)
    {
        this.axisXUnit = axisXUnit;
        this.axisYUnit = axisYUnit;
    }

    //IMPORTANT - should be working, but check functionality properly next time this is required
    //also maybe add number of digits variable for mantisa...
    SetUseExpForm(useExpFormXAxis, useExpFormYAxis)
    {
        this.useExpFormXAxis = useExpFormXAxis;
        this.useExpFormYAxis = useExpFormYAxis;
    }

    SetAxesFontParameters(axisXFontVerticalOffset, axisYFontHorizontalOffset, axisXNumberDecimals, axisYNumberDecimals, axisFontSize)
    {
        this.axisXFontVerticalOffset = axisXFontVerticalOffset;
        this.axisYFontHorizontalOffset = axisYFontHorizontalOffset;
        this.axisXNumberDecimals = axisXNumberDecimals;
        this.axisYNumberDecimals = axisYNumberDecimals;
        this.axisFontSize = axisFontSize;
    }

    SetAxesDescription(axisXDescription, axisYDescription, axisXDescriptionOffset, axisYDescriptionOffset, axisDescriptionFontSize)
    {
        this.axisXDescription = axisXDescription;
        this.axisYDescription = axisYDescription;
        this.axisXDescriptionOffset = axisXDescriptionOffset;
        this.axisYDescriptionOffset = axisYDescriptionOffset;
        this.axisDescriptionFontSize = axisDescriptionFontSize;
    }

    SetDisplayAxesBackgroundMarkings(displayAxisBackgroundMarkings)
    {
        this.displayAxisBackgroundMarkings = displayAxisBackgroundMarkings;
    }

    SetAxesBackgroundMarkings(axisBackgroundMarkingsThickness, axisBackgroundMarkingsColor)
    {
        this.axisBackgroundMarkingsThickness = axisBackgroundMarkingsThickness;
        this.axisBackgroundMarkingsColor = axisBackgroundMarkingsColor;
    }

    SetViewportOffset(viewportX, viewportY)
    {
        this.viewportRealOffset = [viewportX,viewportY];
    }

    SetDisplayDebug(displayDebug)
    {
        this.displayDebug = displayDebug;
    }

    //---------------------------------- COORDINATE TRANSFORMS ----------------------------------

    TransformXCoordPixelToReal(pixelCoordinate)
    {
        return (pixelCoordinate + this.axisXStep*this.viewportRealOffset[0] - this.startX - this.halfSizeX)/this.axisXStep;
    }

    TransformXCoordRealToPixel(realCoordinate)
    {
        return this.startX + this.halfSizeX + (realCoordinate - this.viewportRealOffset[0])*this.axisXStep;
    }

    TransformYCoordPixelToReal(pixelCoordinate)
    {
        return (pixelCoordinate + this.axisYStep*this.viewportRealOffset[1] - this.startY - this.halfSizeY)/-this.axisYStep;
    }

    TransformYCoordRealToPixel(realCoordinate)
    {
        return this.startY + this.halfSizeY + (-realCoordinate - this.viewportRealOffset[1])*this.axisYStep;
    }

    //---------------------------------- DRAWING ----------------------------------

    DrawAxes(localContext)
    {        
        //text parameters
        localContext.fillStyle = "rgb(0,0,0)";
        localContext.font = this.axisFontSize.toString() + "px Arial";
        localContext.textAlign = "center";
        localContext.textBaseline = "middle";

        //markings start and end coordinates
        let markStartPixelX;
        let markEndPixelX;
        let markStartPixelY;
        let markEndPixelY;

        //pixel coordinates of axis origin
        let originPixelX = this.TransformXCoordRealToPixel(0);
        let originPixelY = this.TransformYCoordRealToPixel(0);

        //final pixel coordinates of origin when axes are stuck to the side
        let pixelX = originPixelX;
        let pixelY = originPixelY;

        //if origin is outside the window boundary - stick it to the corresponding side
        pixelX = pixelX < this.startX + this.axisMarkLength/2 ? this.startX + this.axisMarkLength/2 : pixelX;
        pixelX = pixelX > this.startX + this.sizeX - this.axisMarkLength/2 ? this.startX + this.sizeX - this.axisMarkLength/2 : pixelX;

        pixelY = pixelY < this.startY + this.axisMarkLength/2 ? this.startY + this.axisMarkLength/2 : pixelY;
        pixelY = pixelY > this.startY + this.sizeY - this.axisMarkLength/2 ? this.startY + this.sizeY - this.axisMarkLength/2 : pixelY;

        //store results
        this.axisXCurrentRealCoordY = this.TransformYCoordPixelToReal(pixelY);
        this.axisYCurrentRealCoordX = this.TransformXCoordPixelToReal(pixelX);

        //---------------------------------- MARKINGS BACKGROUND LINES ----------------------------------

        //y coordinate of markings
        markStartPixelY = pixelY - this.axisMarkLength/2;
        markEndPixelY = pixelY + this.axisMarkLength/2;

        //number of markings on the left of the Y axis that either:
        //overflow on the left side of draw area (positive number)
        //are missing before the y axis (negative number)
        let markingsLeft = Math.ceil((this.startX - originPixelX)/this.axisXMarkSpacing);

        //pixel value where the leftmost marking will be
        let markingsStartPixelX = originPixelX + markingsLeft*this.axisXMarkSpacing;

        if (this.displayAxisBackgroundMarkings === true)
        {
            //start from the first pixel value, then add spacing value after each iteration
            for (let i = markingsStartPixelX; i <= this.startX + this.sizeX; i += this.axisXMarkSpacing)
            {
                //x coordinates are the same for x axis
                markStartPixelX = i;
                markEndPixelX = i;

                if (markStartPixelX !== pixelX)
                {
                    //background markings parameters
                    localContext.strokeStyle = this.axisBackgroundMarkingsColor;
                    localContext.lineWidth = this.axisBackgroundMarkingsThickness;
                    
                    //background markings line
                    localContext.beginPath();
                    localContext.moveTo(markStartPixelX, this.startY);
                    localContext.lineTo(markEndPixelX, this.startY + this.sizeY);
                    localContext.stroke();
                }
            }
        }

        //analogous

        markStartPixelX = pixelX - this.axisMarkLength/2;
        markEndPixelX = pixelX + this.axisMarkLength/2;
        
        let markingsTop = Math.ceil((this.startY - originPixelY)/this.axisYMarkSpacing);
        let markingsStartPixelY = originPixelY + markingsTop*this.axisYMarkSpacing;

        if (this.displayAxisBackgroundMarkings === true)
        {
            for (let i = markingsStartPixelY; i <= this.startY + this.sizeY; i += this.axisYMarkSpacing)
            {
                markStartPixelY = i;
                markEndPixelY = i;

                if (markStartPixelY !== pixelY)
                {
                    localContext.strokeStyle = this.axisBackgroundMarkingsColor;
                    localContext.lineWidth = this.axisBackgroundMarkingsThickness;
                    
                    localContext.beginPath();
                    localContext.moveTo(this.startX, markStartPixelY);
                    localContext.lineTo(this.startX + this.sizeX, markEndPixelY);
                    localContext.stroke();
                }
            }
        }

        //---------------------------------- MARKINGS, NUMBERS ----------------------------------

        let axisMarkingText = "";

        markStartPixelY = pixelY - this.axisMarkLength/2;
        markEndPixelY = pixelY + this.axisMarkLength/2;

        //start from the first pixel value, then add spacing value after each iteration
        for (let i = markingsStartPixelX; i <= this.startX + this.sizeX; i += this.axisXMarkSpacing)
        {
            //x coordinates are the same for x axis
            markStartPixelX = i;
            markEndPixelX = i;

            //markings parameters
            localContext.strokeStyle = "rgb(0, 0, 0)";
            localContext.lineWidth = this.axisMarkThickness;

            //marking line
            localContext.beginPath();
            localContext.moveTo(markStartPixelX, markStartPixelY);
            localContext.lineTo(markEndPixelX, markEndPixelY);
            localContext.stroke();

            //if number of decimals is 2 for example, then the range is >= 0.01 && < 1000 -> in this way the text is max three digits long
            if (this.useExpFormXAxis === false || (Math.abs(this.TransformXCoordPixelToReal(markEndPixelX)) >= 10**(-this.axisXNumberDecimals) && Math.abs(this.TransformXCoordPixelToReal(markEndPixelX)) < 10**(this.axisXNumberDecimals + 1)))
            {
                axisMarkingText = GetRoundedNumberToNPlacesAsShortString(this.TransformXCoordPixelToReal(markEndPixelX), this.axisXNumberDecimals) + this.axisXUnit;
            }
            else
            {
                axisMarkingText = GetNumberAsStringInExponentialForm(this.TransformXCoordPixelToReal(markEndPixelX), 1) + this.axisXUnit;
            }

            //text for marking
            localContext.fillText(axisMarkingText, markStartPixelX, markEndPixelY + this.axisXFontVerticalOffset);
        }

        //analogous

        markStartPixelX = pixelX - this.axisMarkLength/2;
        markEndPixelX = pixelX + this.axisMarkLength/2;

        for (let i = markingsStartPixelY; i <= this.startY + this.sizeY; i += this.axisYMarkSpacing)
        {
            markStartPixelY = i;
            markEndPixelY = i;

            localContext.strokeStyle = "rgb(0, 0, 0)";
            localContext.lineWidth = this.axisMarkThickness;

            localContext.beginPath();
            localContext.moveTo(markStartPixelX, markStartPixelY);
            localContext.lineTo(markEndPixelX, markEndPixelY);
            localContext.stroke();

            if (this.useExpFormYAxis === false || (Math.abs(this.TransformYCoordPixelToReal(markEndPixelY)) >= 10**(-this.axisYNumberDecimals) && Math.abs(this.TransformYCoordPixelToReal(markEndPixelY)) < 10**(this.axisYNumberDecimals + 1)))
            {
                axisMarkingText = GetRoundedNumberToNPlacesAsShortString(this.TransformYCoordPixelToReal(markEndPixelY), this.axisYNumberDecimals) + this.axisYUnit;
            }
            else
            {
                axisMarkingText = GetNumberAsStringInExponentialForm(this.TransformYCoordPixelToReal(markEndPixelY), 1) + this.axisYUnit;
            }

            localContext.fillText(axisMarkingText, markStartPixelX + this.axisYFontHorizontalOffset, markEndPixelY);
        }

        //---------------------------------- AXES ----------------------------------

        //axes themselves must be drawn at the end, because otherwise
        //the grey marking lines could be drawn over them
        localContext.strokeStyle = "rgb(0, 0, 0)";
        localContext.lineWidth = this.axisThickness;

        localContext.beginPath();
	    localContext.moveTo(this.startX, pixelY);
	    localContext.lineTo(this.startX + this.sizeX, pixelY);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(pixelX, this.startY);
	    localContext.lineTo(pixelX, this.startY + this.sizeY);
	    localContext.stroke();

        //---------------------------------- AXES DESCRIPTION ----------------------------------

        //draw axes description here because we need pixelX and pixelY
        localContext.fillStyle = "rgb(0,0,0)";
        localContext.font = this.axisDescriptionFontSize.toString() + "px Arial";
        localContext.textAlign = "center";
        localContext.textBaseline = "middle";

        localContext.fillText(this.axisXDescription, this.startX - this.axisXDescriptionOffset, pixelY);
        localContext.fillText(this.axisYDescription, pixelX, this.startY - this.axisYDescriptionOffset);
    }

    DrawDebug(localContext)
    {
        //outer border
        localContext.strokeStyle = "rgb(100, 100, 100)";
        localContext.lineWidth = 1;

        localContext.beginPath();
	    localContext.moveTo(this.startX, this.startY);
	    localContext.lineTo(this.startX + this.sizeX, this.startY);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(this.startX + this.sizeX, this.startY);
	    localContext.lineTo(this.startX + this.sizeX, this.startY + this.sizeY);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(this.startX + this.sizeX, this.startY + this.sizeY);
	    localContext.lineTo(this.startX, this.startY + this.sizeY);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(this.startX, this.startY + this.sizeY);
	    localContext.lineTo(this.startX, this.startY);
	    localContext.stroke();

        //inner axis border
        localContext.beginPath();
	    localContext.moveTo(this.startX + this.axisMarkLength, this.startY + this.axisMarkLength);
	    localContext.lineTo(this.startX - this.axisMarkLength + this.sizeX, this.startY + this.axisMarkLength);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(this.startX - this.axisMarkLength + this.sizeX, this.startY + this.axisMarkLength);
	    localContext.lineTo(this.startX - this.axisMarkLength + this.sizeX, this.startY - this.axisMarkLength + this.sizeY);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(this.startX - this.axisMarkLength + this.sizeX, this.startY +-this.axisMarkLength + this.sizeY);
	    localContext.lineTo(this.startX + this.axisMarkLength, this.startY - this.axisMarkLength + this.sizeY);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(this.startX + this.axisMarkLength, this.startY - this.axisMarkLength + this.sizeY);
	    localContext.lineTo(this.startX + this.axisMarkLength, this.startY + this.axisMarkLength);
	    localContext.stroke();
    }

    //draws graph itself
    DrawBase(localContext)
	{
        localContext.fillStyle = "rgb(255, 255, 255)";
	    localContext.fillRect(this.startX, this.startY, this.sizeX, this.sizeY);

        this.DrawAxes(localContext);

        if (this.displayDebug === true)
        {
            this.DrawDebug(localContext);
        }
    }

    //draws data point inside graph
    DrawPoint(localContext, pointX, pointY, radius, color)
    {
        let pointPixelX = this.TransformXCoordRealToPixel(pointX);
        let pointPixelY = this.TransformYCoordRealToPixel(pointY);

        if (pointPixelX  < this.startX || pointPixelX  > this.startX + this.sizeX || pointPixelY < this.startY || pointPixelY > this.startY + this.sizeY)
        {
            return;
        }

        localContext.fillStyle = color;

        localContext.beginPath();
        localContext.arc(pointPixelX, pointPixelY, radius, 0, 2*Math.PI);
        localContext.fill();
    }

    //draws data point as vertical line
    DrawPointAsVerticalLine(localContext, pointX, pointY, color, lineThickness)
    {
        let lineEndpoints = [[pointX, 0],[pointX, pointY]];

        this.DrawLine(localContext, lineEndpoints, color, lineThickness);
    }

    //checks if line is within boundaries and if it crosses one, then it cuts the line so it is flush with the edge
    CheckAndCalculateLineIntersectionWithBorder(lineStartPixelX, lineStartPixelY, lineEndPixelX, lineEndPixelY)
    {
        let startOutside = false;
        let endOutside = false;

        //is start point outside boundaries?
        if (lineStartPixelX  < this.startX || lineStartPixelX  > this.startX + this.sizeX || lineStartPixelY < this.startY || lineStartPixelY > this.startY + this.sizeY)
        {
            startOutside = true;
        }

        //is end point outside boundaries?
        if (lineEndPixelX  < this.startX || lineEndPixelX  > this.startX + this.sizeX || lineEndPixelY < this.startY || lineEndPixelY > this.startY + this.sizeY)
        {
            endOutside = true;
        }

        if (startOutside === false && endOutside === false)
        {
            //if both points are within boundaries, then everything is ok and we just return the original coordinates
            return [lineStartPixelX, lineStartPixelY, lineEndPixelX, lineEndPixelY, false, false];
        }

        let newLineStartPixelX = lineStartPixelX;
        let newLineStartPixelY = lineStartPixelY;
        let newLineEndPixelX = lineEndPixelX;
        let newLineEndPixelY = lineEndPixelY;      

        let A;
        let B;
    
        let topIntersection;
        let bottomIntersection;
        let leftIntersection;
        let rightIntersection;

        //first, we calculate the parameters of line equation y = Ax + B
        //then we calculate intersections with LINES, not LINE SEGMENTS that define borders

        if (lineEndPixelX - lineStartPixelX !== 0)
        {
            //line is not vertical - use line equation to get intersections

            A = (lineEndPixelY - lineStartPixelY)/(lineEndPixelX - lineStartPixelX);
            B = lineStartPixelY - A*lineStartPixelX;
    
            topIntersection = [(this.startY - B)/A, this.startY];
            bottomIntersection = [((this.startY + this.sizeY) - B)/A, this.startY + this.sizeY];
            leftIntersection = [this.startX, this.startX*A + B];
            rightIntersection = [this.startX + this.sizeX, (this.startX + this.sizeX)*A + B]; 
        }
        else
        {
            //line is vertical - use original points coordinates to get intersections
            topIntersection = [lineStartPixelX, this.startY];
            bottomIntersection = [lineStartPixelX, this.startY + this.sizeY];
            leftIntersection = [this.startX, lineStartPixelY];
            rightIntersection = [this.startX + this.sizeX, lineStartPixelY];
        }

        //the process is now following:
        //if one point is inside and one outside, then there always going to be one valid intersection
        //if both points are outside, then there could still be an intersection, and it will have two valid intersections
        //we don't know which are valid yet - we test
        //valid intersections have to be between the start and end point and also they have to be located within the window boundary
        //if we find valid intersection, then we move the point that is outside to the new coordinates

        let validIntersections = [];

        if (((topIntersection[0] >= lineStartPixelX && topIntersection[0] <= lineEndPixelX) || (topIntersection[0] <= lineStartPixelX && topIntersection[0] >= lineEndPixelX)) && 
            ((topIntersection[1] >= lineStartPixelY && topIntersection[1] <= lineEndPixelY) || (topIntersection[1] <= lineStartPixelY && topIntersection[1] >= lineEndPixelY)) &&
            ((topIntersection[0] >= this.startX && topIntersection[0] <= this.startX + this.sizeX)))
        {
            validIntersections.push(topIntersection);
        }

        if (((bottomIntersection[0] >= lineStartPixelX && bottomIntersection[0] <= lineEndPixelX) || (bottomIntersection[0] <= lineStartPixelX && bottomIntersection[0] >= lineEndPixelX)) && 
            ((bottomIntersection[1] >= lineStartPixelY && bottomIntersection[1] <= lineEndPixelY) || (bottomIntersection[1] <= lineStartPixelY && bottomIntersection[1] >= lineEndPixelY)) &&
            ((bottomIntersection[0] >= this.startX && bottomIntersection[0] <= this.startX + this.sizeX)))
        {
            validIntersections.push(bottomIntersection);
        }

        if (((leftIntersection[0] >= lineStartPixelX && leftIntersection[0] <= lineEndPixelX) || (leftIntersection[0] <= lineStartPixelX && leftIntersection[0] >= lineEndPixelX)) && 
            ((leftIntersection[1] >= lineStartPixelY && leftIntersection[1] <= lineEndPixelY) || (leftIntersection[1] <= lineStartPixelY && leftIntersection[1] >= lineEndPixelY)) &&
            ((leftIntersection[1] >= this.startY && leftIntersection[1] <= this.startY + this.sizeY)))
        {
            validIntersections.push(leftIntersection);
        }

        if (((rightIntersection[0] >= lineStartPixelX && rightIntersection[0] <= lineEndPixelX) || (rightIntersection[0] <= lineStartPixelX && rightIntersection[0] >= lineEndPixelX)) && 
            ((rightIntersection[1] >= lineStartPixelY && rightIntersection[1] <= lineEndPixelY) || (rightIntersection[1] <= lineStartPixelY && rightIntersection[1] >= lineEndPixelY)) &&
            ((rightIntersection[1] >= this.startY && rightIntersection[1] <= this.startY + this.sizeY)))
        {
            validIntersections.push(rightIntersection);
        }

        if (validIntersections.length === 2)
        {
            //intersection with two borders

            //order does not matter in this case, because the pair is not going to be connected to any other
            return [validIntersections[0][0], validIntersections[0][1], validIntersections[1][0], validIntersections[1][1], true, true];
        }
        else if (validIntersections.length === 1)
        {
            //intersection with a single border - we must determine if start moved or end moved

            if (startOutside === true)
            {
                return [validIntersections[0][0], validIntersections[0][1], newLineEndPixelX, newLineEndPixelY, true, false];
            }
            else //if (endOutside === true)
            {
                return [newLineStartPixelX, newLineStartPixelY, validIntersections[0][0], validIntersections[0][1], false, true];
            }
        }
        else //if (validIntersections.length === 0)
        {
            //no intersection - line segment outside graph

            return undefined;
        }
    }

    //draws data line inside graph
    DrawLine(localContext, points, color, lineThickness)
    {
        let lineStartPixelX;
        let lineStartPixelY;
        let lineEndPixelX;
        let lineEndPixelY;

        let checkedCoordinates;

        localContext.strokeStyle = color;
        localContext.lineWidth = lineThickness;

        //no path is being drawn at the beginning
        let pathIsActive = false;

        //cycle through all points
        for (let i = 0; i < points.length - 1; i++)
        {
            //inside bounds coordinates
            checkedCoordinates = this.CheckAndCalculateLineIntersectionWithBorder(this.TransformXCoordRealToPixel(points[i][0]), this.TransformYCoordRealToPixel(points[i][1]), this.TransformXCoordRealToPixel(points[i + 1][0]), this.TransformYCoordRealToPixel(points[i + 1][1]));

            //undefined means whole line segment is outside and should not be drawn
            if (checkedCoordinates !== undefined)
            {
                //if it should be drawn, then we use checked coordinates

                lineStartPixelX = checkedCoordinates[0];
                lineStartPixelY = checkedCoordinates[1];
                lineEndPixelX = checkedCoordinates[2];
                lineEndPixelY = checkedCoordinates[3];

                if (pathIsActive === false)
                {
                    //path is not active, but valid line segment is found - start new path

                    localContext.beginPath();
                    localContext.moveTo(lineStartPixelX, lineStartPixelY);

                    pathIsActive = true;
                }

                if (checkedCoordinates[4] === true)
                {
                    if (checkedCoordinates[5] === true)
                    {
                        //both start and end were adjusted - in this special case, whole line is going to consist only of this single segment
                        //current line segment has to be drawn and flag to start new line has to be set

                        localContext.lineTo(lineEndPixelX, lineEndPixelY);
                        localContext.stroke();

                        pathIsActive = false;
                    }
                    else
                    {
                        //start was adjusted - this could only happen if we are coming back to graph window from outside the boundary
                        //it could either be the first valid line occurence or repeated occurence
                        //in both cases, line is already started, so we just have to add the valid endpoint

                        localContext.lineTo(lineEndPixelX, lineEndPixelY);
                    }
                }
                else
                {
                    if (checkedCoordinates[5] === true)
                    {
                        //end was adjusted - this means that for now, this is the last line segment, that is inside the graph boundary
                        //current line has to be drawn and flag to start new one has to be set

                        localContext.lineTo(lineEndPixelX, lineEndPixelY);
                        localContext.stroke();

                        pathIsActive = false;
                    }
                    else
                    {
                        //nothing was adjusted, so just extend line by another point
                        localContext.lineTo(lineEndPixelX, lineEndPixelY);
                    }
                }
            }
        }

        if (pathIsActive === true)
        {
            //line ends inside the graph - we must draw the last line part manually

            localContext.stroke();
        }
    }

    //draws addition animation for two functions
    //this version does not require summedPoints
    DrawLinesAdditionNoSumAnimation(localContext, basePoints, pointsToAdd, verticalOffset, basePointsColor, basePointsLineThickness, summedPointsColor, summedPointsLineThickness, additionEndThreshold, fadeStartThreshold, percentage)
    {
        let pointCount = basePoints.length;

        let summedPoints = [];

        for (let i = 0; i < pointCount; i++)
        {
            summedPoints.push([basePoints[i][0], basePoints[i][0] + pointsToAdd[i][1]]);
        }

        this.DrawLinesAdditionAnimation(localContext, basePoints, pointsToAdd, summedPoints, verticalOffset, basePointsColor, basePointsLineThickness, summedPointsColor, summedPointsLineThickness, additionEndThreshold, fadeStartThreshold, percentage)
    }

    //draws addition animation for two functions
    //this version does not require basePoints
    DrawLinesAdditionNoBaseAnimation(localContext, pointsToAdd, summedPoints, verticalOffset, basePointsColor, basePointsLineThickness, summedPointsColor, summedPointsLineThickness, additionEndThreshold, fadeStartThreshold, percentage)
    {
        let pointCount = summedPoints.length;

        let basePoints = [];

        for (let i = 0; i < pointCount; i++)
        {
            basePoints.push([summedPoints[i][0], summedPoints[i][1] - pointsToAdd[i][1]]);
        }

        this.DrawLinesAdditionAnimation(localContext, basePoints, pointsToAdd, summedPoints, verticalOffset, basePointsColor, basePointsLineThickness, summedPointsColor, summedPointsLineThickness, additionEndThreshold, fadeStartThreshold, percentage)
    }

    //draws addition animation for two functions
    DrawLinesAdditionAnimation(localContext, basePoints, pointsToAdd, summedPoints, verticalOffset, basePointsColor, basePointsLineThickness, summedPointsColor, summedPointsLineThickness, additionEndThreshold, fadeStartThreshold, percentage)
    {
        //all vectors must have same size
        let pointCount = basePoints.length;
        //vector for the points with applied interpolation
        let currentPoints = [];

        //vector is inicialized with pointsToAdd, that have vertical offset applied
        for (let i = 0; i < pointCount; i++)
        {
            currentPoints.push([pointsToAdd[i][0], pointsToAdd[i][1] + verticalOffset]);
        }

        //we find the largest vertical separation between the pointsToAdd and summmedPoints
        //this determines how far down the function must be translated to complete the addition
        let largestVerticalSeparation = 0;

        for (let i = 0; i < pointCount; i++)
        {
            let currentVerticalSeparation =  currentPoints[i][1] - summedPoints[i][1];

            if (currentVerticalSeparation > largestVerticalSeparation)
            {
                largestVerticalSeparation = currentVerticalSeparation;
            }
        }

        //based on a given percentage and threshold, pointsToAdd are translated down
        //percentage/additionEndThreshold can get bigger than 1, but that is not a problem, 
        //because the vertical translation is capped by summedPoints later
        let interpolatedVerticalSeparation = largestVerticalSeparation*(percentage/additionEndThreshold);

        //each point is translated down at the same speed, but some points are going to be in the correct position earlier
        //so if calculated points position would be located below target position, then it is clamped to target position
        for (let i = 0; i < pointCount; i++)
        {
            if (currentPoints[i][1] - interpolatedVerticalSeparation > summedPoints[i][1])
            {
                currentPoints[i][1] = currentPoints[i][1] - interpolatedVerticalSeparation;
            }
            else
            {
                currentPoints[i][1] = summedPoints[i][1];
            }
        }

        //when percentage is above fadeStartThreshold, old sum starts to fade
        let fadePercentage = (percentage - fadeStartThreshold)/(1 - fadeStartThreshold);
        fadePercentage = fadePercentage < 0 ? 0 : fadePercentage;

        //by clamping fade percentage to be higher than zero, one call can be used to draw first part and fade part of animation
        this.DrawLineFadeInOutAnimation(localContext, basePoints, basePointsColor, basePointsLineThickness, "out", fadePercentage);

        //if line thickness/color is different for sum and points to add
        //then interpolation is needed for smooth transition
        let finalSummedPointsColor = this.LinearlyInterpolateRGBColor(summedPointsColor, basePointsColor, fadePercentage);
        let finalSummedPointsLineThickness = summedPointsLineThickness + (basePointsLineThickness - summedPointsLineThickness)*fadePercentage;

        //sum is drawn at the end
        this.DrawLine(localContext, currentPoints, finalSummedPointsColor, finalSummedPointsLineThickness);
    }

    //line appear animation
    DrawHorizontalLineAppearAnimation(localContext, points, color, lineThickness, direction, percentage)
    {
        let pointCount = points.length;
        let slicedPoints = [];

        //based on the direction and percentage, only a certain subset of points
        //on left or right side from the original vector is going to be drawn
        if (direction === "right")
        {
            let indexEndThreshold = Math.round((pointCount - 1)*percentage);

            for (let i = 0; i <= indexEndThreshold; i++)
            {
                slicedPoints.push(points[i]);
            }
        }
        else
        {
            let indexStartThreshold = (pointCount - 1) - Math.round((pointCount - 1)*percentage);

            for (let i = indexStartThreshold; i <= pointCount - 1; i++)
            {
                slicedPoints.push(points[i]);
            }
        }

        this.DrawLine(localContext, slicedPoints, color, lineThickness);
    }

    //adds opacity to color based on percentage
    CalculateFadedShadeForColor(color, direction, percentage)
    {
        //extract rgb values
        let regex = /\(([^)]+)\)/;
        let parenthesesContent = regex.exec(color)[1];

         //calculate opacity
        let opacity = direction === "in" ? percentage : 1 - percentage;

        //create new color value from given color and interpolated opacity
        return "rgba(" + parenthesesContent + ", " + opacity.toString() + ")";
    }

    //linear interpolation of one color to another in rgb space
    LinearlyInterpolateRGBColor(firstColor, secondColor, percentage)
    {
        //extract rgb values separately
        let regex = /\( *([0-9]+) *, *([0-9]+) *, *([0-9]+)\)/;
        let firstColorContents = regex.exec(firstColor);
        let secondColorContents = regex.exec(secondColor);

        let interpolatedRed = parseFloat(firstColorContents[1]) + (parseFloat(secondColorContents[1]) - parseFloat(firstColorContents[1]))*percentage;
        let interpolatedGreen = parseFloat(firstColorContents[2]) + (parseFloat(secondColorContents[2]) - parseFloat(firstColorContents[2]))*percentage; 
        let interpolatedBlue = parseFloat(firstColorContents[3]) + (parseFloat(secondColorContents[3]) - parseFloat(firstColorContents[3]))*percentage;

        return "rgb(" + interpolatedRed.toString() + ", " + interpolatedGreen.toString() + ", " + interpolatedBlue.toString() + ")";
    }

    //draw fade in or fade out animation of a line
    DrawLineFadeInOutAnimation(localContext, points, color, lineThickness, direction, percentage)
    {
        //draw line with faded color based on percentage
        this.DrawLine(localContext, points, this.CalculateFadedShadeForColor(color, direction, percentage), lineThickness);
    }

    //draw moving vertical line animation
    DrawMovingVerticalLineAnimation(localContext, startX, endX, middleY, lineLength, color, lineThickness, direction, percentage)
    {
        let x;
        let lineEndpoints = [];

        if (direction === "right")
        {
            x = startX + (endX - startX)*percentage;

            lineEndpoints.push([x, middleY + lineLength/2]);
            lineEndpoints.push([x, middleY - lineLength/2]);
        }
        else
        {
            x = endX - (endX - startX)*percentage;

            lineEndpoints.push([x, middleY + lineLength/2]);
            lineEndpoints.push([x, middleY - lineLength/2]);
        }

        let lineCapOld = localContext.lineCap;
        localContext.lineCap = "round";
        this.DrawLine(localContext, lineEndpoints, color, lineThickness);
        localContext.lineCap = lineCapOld;
    }

    //draw horizontally appearing area under a line
    DrawIntegralHorizontalAppearAnimation(localContext, points, startX, endX, positiveColor, negativeColor, opacity, direction, percentage)
    {
        //first, add opacity to colors
        positiveColor = this.CalculateFadedShadeForColor(positiveColor, "in", opacity);
        negativeColor = this.CalculateFadedShadeForColor(negativeColor, "in", opacity);

        //interpolated value of x
        let x;
        //points for which the are under a graph should be shown
        let pointsInInterval = [];

        //min and max y coordinates of a line
        let minY = Number.MAX_VALUE;
        let maxY = Number.MIN_VALUE;

        if (direction === "right")
        {
            //curent value of x based on percentage
            x = startX + (endX - startX)*percentage;

            for (let i = 0; i < points.length; i++)
            {
                //extract all points, that are inside an interval between interpolated value and boundary
                if (points[i][0] >= startX && points[i][0] <= x)
                {
                    //integral area is vertically bounded by graph window
                    let topBoundary = this.TransformYCoordPixelToReal(this.startY);
                    let bottomBoundary = this.TransformYCoordPixelToReal(this.startY + this.sizeY);

                    if (points[i][1] > topBoundary)
                    {
                        pointsInInterval.push([points[i][0], topBoundary]);
                    }
                    else if (points[i][1] < bottomBoundary)
                    {
                        pointsInInterval.push([points[i][0], bottomBoundary]);
                    }
                    else
                    {
                        pointsInInterval.push(points[i]);
                    }
                }

                if (points[i][1] < minY)
                {
                    minY = points[i][1];
                }

                if (points[i][1] > maxY)
                {
                    maxY = points[i][1];
                }
            }
        }
        else
        {
            x = endX - (endX - startX)*percentage;

            for (let i = 0; i < points.length; i++)
            {
                //extract all points, that are inside an interval between interpolated value and boundary
                if (points[i][0] >= x && points[i][0] <= endX)
                {
                    //integral area is vertically bounded by graph window
                    let topBoundary = this.TransformYCoordPixelToReal(this.startY);
                    let bottomBoundary = this.TransformYCoordPixelToReal(this.startY + this.sizeY);

                    if (points[i][1] > topBoundary)
                    {
                        pointsInInterval.push([points[i][0], topBoundary]);
                    }
                    else if (points[i][1] < bottomBoundary)
                    {
                        pointsInInterval.push([points[i][0], bottomBoundary]);
                    }
                    else
                    {
                        pointsInInterval.push(points[i]);
                    } 
                }
                
                if (points[i][1] < minY)
                {
                    minY = points[i][1];
                }
    
                if (points[i][1] > maxY)
                {
                    maxY = points[i][1];
                }
            }
        }

        //at least one point must be extracted for the drawing to make sense
        if (pointsInInterval.length >= 1)
        {
            //first trick for drawing the area under a line
            //we want the positive and negative area to have different colors and to achieve this, it is possible to abuse linear gradient
            //the gradient starts from top and continues down, but there is a double color stop at y = 0, so the gradient is essentially split in two
            //then both the first and second gradient are going to be assigned the same start and end colors, so there is actually going to be no gradient except the jump at y = 0
            //there is one small catch however, the line could only be above or below the y = 0, se we need to be careful, how we arrange the gradient

            let colorGradient;

            if (maxY > 0)
            {
                //max above y = 0

                if (minY < 0)
                {
                    //min below y = 0

                    let zeroYPercentage = maxY/(maxY - minY);

                    colorGradient = localContext.createLinearGradient(0, this.TransformYCoordRealToPixel(maxY), 0, this.TransformYCoordRealToPixel(minY));
                    colorGradient.addColorStop(0, positiveColor);
                    colorGradient.addColorStop(zeroYPercentage, positiveColor);
                    colorGradient.addColorStop(zeroYPercentage, negativeColor);
                    colorGradient.addColorStop(1, negativeColor);
                }
                else
                {
                    //min above or equal to y = 0

                    colorGradient = localContext.createLinearGradient(0, this.TransformYCoordRealToPixel(maxY), 0, this.TransformYCoordRealToPixel(0));
                    colorGradient.addColorStop(0, positiveColor);
                    colorGradient.addColorStop(1, positiveColor);
                }
            }
            else
            {
                //max below or equal to y = 0

                if (minY < 0)
                {
                    //min below y = 0

                    colorGradient = localContext.createLinearGradient(0, this.TransformYCoordRealToPixel(0), 0, this.TransformYCoordRealToPixel(minY));
                    colorGradient.addColorStop(0, negativeColor);
                    colorGradient.addColorStop(1, negativeColor);
                }
                else
                {
                    //min above or equal to y = 0

                    //min can't be above max, so only y = 0 cound fall into this branch

                    colorGradient = localContext.createLinearGradient(0, this.TransformYCoordRealToPixel(0), 0, this.TransformYCoordRealToPixel(0));
                    //color does not matter
                    colorGradient.addColorStop(0, positiveColor);
                    colorGradient.addColorStop(1, positiveColor);
                }
            }

            localContext.fillStyle = colorGradient;      

            //second trick is that the path, that defines object to fill can intersect itself and the fill still works fine
            //so the only thing that we need to do is start at [minX, 0], then connect the line points and end at [maxX, 0]
            //this is then connected back to [minX, 0]
            //(because the axis can be clamped to side because of shift, we actualy must use this.axisXCurrentRealCoordY) instead of zero
            localContext.beginPath();

            localContext.moveTo(this.TransformXCoordRealToPixel(pointsInInterval[0][0]), this.TransformYCoordRealToPixel(this.axisXCurrentRealCoordY));
            for (let i = 0; i < pointsInInterval.length; i++)
            {
                localContext.lineTo(this.TransformXCoordRealToPixel(pointsInInterval[i][0]), this.TransformYCoordRealToPixel(pointsInInterval[i][1]));
            }
            localContext.lineTo(this.TransformXCoordRealToPixel(pointsInInterval[pointsInInterval.length - 1][0]), this.TransformYCoordRealToPixel(this.axisXCurrentRealCoordY));

            localContext.fill();
        }
    }

    //fade in/out animation for area under the graph
    DrawIntegralFadeInOutAnimation(localContext, points, startX, endX, positiveColor, negativeColor, opacity, direction, percentage)
    {
        //DrawIntegralHorizontalAppearAnimation is reused with percentage set to 1 - the area is fully drawn
        //the we can just combine color, base opacity and percentage to achieve fade in/out animation

        let totalOpacity = direction === "in" ? opacity*percentage : 1*opacity - opacity*percentage;

        this.DrawIntegralHorizontalAppearAnimation(localContext, points, startX, endX, positiveColor, negativeColor, totalOpacity, "right", 1)
    }

    //fade in/out animation for data point
    DrawPointFadeInOutAnimation(localContext, pointX, pointY, radius, color, direction, percentage)
    {
        //draw point with faded color based on percentage
        this.DrawPoint(localContext, pointX, pointY, radius, this.CalculateFadedShadeForColor(color, direction, percentage));
    }

    //fade in/out animation for data point as vertical line
    DrawPointAsVerticalLineFadeInOutAnimation(localContext, pointX, pointY, color, lineThickness, direction, percentage)
    {
        let lineEndpoints = [[pointX, 0],[pointX, pointY]];

        //reuse function for line
        this.DrawLineFadeInOutAnimation(localContext, lineEndpoints, color, lineThickness, direction, percentage);
    }
}

//graph, that moves, so that the viewpoint always stays in a visible area
class Graph2D_Dynamic extends Graph2D
{
    constructor()
    {
        super();

        //viewpoint is always going to be kept within follow borders by translating whole graph
        this.viewpointRealCoordinates = [0,0];

        //thickness of border around the edges - if viewpoints enters this space, graph starts translating
        this.followBorder = 100;
    }

    //---------------------------------- SETTERS ----------------------------------

    SetViewpointPosition(viewpointX, viewpointY)
    {
        this.viewpointRealCoordinates = [viewpointX,viewpointY];
    }

    SetFollowBorder(followBorder)
    {
        this.followBorder = followBorder;
    }

    //---------------------------------- GRAPH MOVEMENT TRACKING ----------------------------------

    //calculates and sets viewport offset to such value, that will cancel out the movement of viewpoint
    //this happens when viewpoint goes outside the defined follow border boundary - after the recalculation, the viewpoint is always going to be precisely at the boundary
    RecalculateViewportOffset()
    {
        //get pixel coordinates of viewpoint
        let pixelX = this.TransformXCoordRealToPixel(this.viewpointRealCoordinates[0]);
        let pixelY = this.TransformYCoordRealToPixel(this.viewpointRealCoordinates[1]);

        //if it is located within border, then offset is adjusted, so that the movement is counteracted
        //this is done by adding a difference between the border and viewpoint position to offset

        if (pixelX > this.startX + this.sizeX - this.followBorder)
        {
            this.viewportRealOffset[0] += this.TransformXCoordPixelToReal(pixelX) - this.TransformXCoordPixelToReal(this.startX + this.sizeX - this.followBorder);
        }

        if (pixelX < this.startX + this.followBorder)
        {
            this.viewportRealOffset[0] += this.TransformXCoordPixelToReal(pixelX) - this.TransformXCoordPixelToReal(this.startX + this.followBorder);
        }

        if (pixelY > this.startY + this.sizeY - this.followBorder)
        {
            this.viewportRealOffset[1] += this.TransformYCoordPixelToReal(this.startY + this.sizeY - this.followBorder) - this.TransformYCoordPixelToReal(pixelY);
        }

        if (pixelY < this.startY + this.followBorder)
        {
            this.viewportRealOffset[1] += this.TransformYCoordPixelToReal(this.startY + this.followBorder) - this.TransformYCoordPixelToReal(pixelY);
        }
    }

    //---------------------------------- DRAWING ----------------------------------

    DrawDebug(localContext)
    {
        super.DrawDebug(localContext);

        //movement border
        localContext.beginPath();
	    localContext.moveTo(this.startX + this.followBorder, this.startY + this.followBorder);
	    localContext.lineTo(this.startX - this.followBorder + this.sizeX, this.startY + this.followBorder);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(this.startX - this.followBorder + this.sizeX, this.startY + this.followBorder);
	    localContext.lineTo(this.startX - this.followBorder + this.sizeX, this.startY - this.followBorder + this.sizeY);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(this.startX - this.followBorder + this.sizeX, this.startY +-this.followBorder + this.sizeY);
	    localContext.lineTo(this.startX + this.followBorder, this.startY - this.followBorder + this.sizeY);
	    localContext.stroke();

        localContext.beginPath();
	    localContext.moveTo(this.startX + this.followBorder, this.startY - this.followBorder + this.sizeY);
	    localContext.lineTo(this.startX + this.followBorder, this.startY + this.followBorder);
	    localContext.stroke();

        //viewpoint
        localContext.fillStyle = "rgb(255, 0, 0)";
        let pixelX = this.TransformXCoordRealToPixel(this.viewpointRealCoordinates[0]);
        let pixelY = this.TransformYCoordRealToPixel(this.viewpointRealCoordinates[1]);
    
        if (pixelX < this.startX || pixelX > this.startX + this.sizeX || pixelY < this.startY || pixelY > this.startY + this.sizeY)
        {
            return;
        }
    
        localContext.fillRect(pixelX - 5, pixelY - 5, 10, 10);
    }

    DrawBase(localContext)
	{
        this.RecalculateViewportOffset();

        super.DrawBase(localContext);
    } 
}

//dynamic graph, that shows vectors in the graph - direction is defined via functions given by user
class Graph2D_Dynamic_VectorField extends Graph2D_Dynamic
{
    constructor()
    {
        super();

        //functions that determine vector direction
        this.vectorXFunction = function(x,y){ return x+y; };
        this.vectorYFunction = function(x,y){ return x-y; };

        //pixel vector spacings
        this.vectorSpacing = 30;
        //arrow thickness and coloring treshold
        this.arrowWidth = 2;
        //after this length of vector, the arrow won't become any more red
        this.redColorMaxTreshold = 5;
    }

    SetVectorFunctions(vectorXFunction, vectorYFunction)
    {
        this.vectorXFunction = vectorXFunction;
        this.vectorYFunction = vectorYFunction;
    }

    SetVectorDrawParameters(vectorSpacing, arrowWidth, redColorMaxTreshold)
    {
        this.vectorSpacing = vectorSpacing;
        this.arrowWidth = arrowWidth;
        this.redColorMaxTreshold = redColorMaxTreshold;
    }

    DrawVectors(localContext)
    {
        localContext.lineWidth = this.arrowWidth;

        //analogical to placing markings on a axis (this.DrawAxes(localContext))

        //pixel value of origin
        let originPixelX = this.TransformXCoordRealToPixel(0);
        let originPixelY = this.TransformYCoordRealToPixel(0);

        //calculate how many boxes fit to the left and to the top

        let vectorBoxesLeft = Math.ceil((this.startX - originPixelX)/this.vectorSpacing);
        let vectorBoxesStartPixelX = originPixelX + vectorBoxesLeft*this.vectorSpacing;

        let vectorBoxesTop = Math.ceil((this.startY - originPixelY)/this.vectorSpacing);
        let vectorBoxesStartPixelY = originPixelY + vectorBoxesTop*this.vectorSpacing;

        //start from top left and draw vectors one by one
        for (let i = vectorBoxesStartPixelX; i <= this.startX + this.sizeX - this.vectorSpacing; i += this.vectorSpacing)
        {
            for (let j = vectorBoxesStartPixelY; j <= this.startY + this.sizeY - this.vectorSpacing; j += this.vectorSpacing)
            {
                //vector is going to start at the centre of its box
                this.DrawVector(localContext, i + this.vectorSpacing/2, j + this.vectorSpacing/2);
            }
        }
    }

    InterpolateColor(firstColorR, firstColorG, firstColorB, secondColorR, secondColorG, secondColorB, interpolationPercentage)
	{
		let finalColorR = firstColorR + (secondColorR - firstColorR)*interpolationPercentage;
		let finalColorG = firstColorG + (secondColorG - firstColorG)*interpolationPercentage; 
		let finalColorB = firstColorB + (secondColorB - firstColorB)*interpolationPercentage;
		
		return "rgb(" + finalColorR.toString() + "," + finalColorG.toString() + "," + finalColorB.toString() + ")";
	}

    DrawVector(localContext, pixelVectorBaseX, pixelVectorBaseY)
    {
        //save transform matrix
        localContext.save();

        //get real coordinates of vector base
        let realVectorBaseX = this.TransformXCoordPixelToReal(pixelVectorBaseX);
        let realVectorBaseY = this.TransformYCoordPixelToReal(pixelVectorBaseY);

        //get real coordinates of where the vector is pointing
        let realVectorPointX = this.vectorXFunction(realVectorBaseX, realVectorBaseY);
        let realVectorPointY = this.vectorYFunction(realVectorBaseX, realVectorBaseY);

        //calculate angle of vector to the X axis
        //IMPORTANT - it is necessary to take into account the possible different scaling of the axes
        let angle = realVectorPointX >= 0 ? Math.atan((realVectorPointY/(this.axisXStep/this.axisYStep))/realVectorPointX) : Math.atan((realVectorPointY/(this.axisXStep/this.axisYStep))/realVectorPointX) + Math.PI;

        //calculate its length
        let vectorLength = Math.sqrt(realVectorPointX*realVectorPointX + realVectorPointY*realVectorPointY);

        //interpolate color based on its length
        //DARK GREEN -> ORANGE -> RED
        let interpolationPercentage = vectorLength >= this.redColorMaxTreshold ? 1 : vectorLength/this.redColorMaxTreshold;
        let color = interpolationPercentage <= 0.5 ? this.InterpolateColor(0, 155, 0, 255, 165, 0, interpolationPercentage*2) : this.InterpolateColor(255, 165, 0, 255, 0, 0, interpolationPercentage*2 - 1);

        localContext.fillStyle = color;
        localContext.strokeStyle = color;

        //arrow is going to be a bit smaller then half the width of its box, so two arrows can't touch
        let arrowLength = this.vectorSpacing*45/100;

        //setup tranform matrix
        //move to center - rotate - move back into previous position (operations are written in opposite order)
        localContext.transform(1, 0, 0, 1, pixelVectorBaseX, pixelVectorBaseY);
        localContext.transform(Math.cos(-angle), Math.sin(-angle), -Math.sin(-angle), Math.cos(-angle), 0, 0);
        localContext.transform(1, 0, 0, 1, -pixelVectorBaseX, -pixelVectorBaseY);	

        //draw the base of arrow
        localContext.beginPath();
        localContext.moveTo(pixelVectorBaseX, pixelVectorBaseY);
        localContext.lineTo(pixelVectorBaseX + arrowLength*3/4, pixelVectorBaseY);
        localContext.stroke();

        //draw the tip of the arrow
        localContext.beginPath();
        localContext.moveTo(pixelVectorBaseX + arrowLength*3/4, pixelVectorBaseY + arrowLength/8 + this.arrowWidth/4);
        localContext.lineTo(pixelVectorBaseX + arrowLength, pixelVectorBaseY);
        localContext.lineTo(pixelVectorBaseX + arrowLength*3/4, pixelVectorBaseY - arrowLength/8 - this.arrowWidth/4);
        localContext.fill();

        //restore transform matrix
        localContext.restore();
    }

    DrawBase(localContext)
	{
        super.DrawBase(localContext);

        this.DrawVectors(localContext);
    }
}

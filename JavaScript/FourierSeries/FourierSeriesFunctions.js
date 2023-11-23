//Fourier series
//Ing. Tomas Jarusek, 11/2023

//functions for fourier series decomposition

//-1, 1 interval repetition
//let repeatedX = X < 0 ? (X - 1) % 2 + 1 : (X + 1) % 2 - 1;

//-0.5, 0.5 interval repetition
//let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

//0, 1 interval repetition
//let repeatedX = X < 0 ? 1 -((-X) % 1) : (X + 1) % 1;

//sign function
function Sign(x)
{
    return x < -EPSILON ? -1 : (x > EPSILON ? 1 : 0);
}

//y = 4*⌊x⌋ - 2*⌊2*x⌋ + 1
//https://en.wikipedia.org/wiki/Square_wave
function SquareWave(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //discontinuities have value equal to 0
    //multiple conditions because of numerical precision
    if (Sign(X % 0.5) === 0 || Sign(X % 0.5 - 0.5) === 0 || Sign(X % 0.5 + 0.5) === 0)
    {
        return 0 + verOffset;
    }

    return amplitude*(4*Math.floor(X) - 2*Math.floor(2*X) + 1) + verOffset;
}

//y = 2*(x - ⌊x + 1/2⌋)
//https://en.wikipedia.org/wiki/Sawtooth_wave
function SawtoothWave(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //discontinuities have value equal to 0
    //multiple conditions because of numerical precision
    //they are located at 0.5 + k
    if (Sign((X - 0.5) % 1) === 0 || Sign((X - 0.5) % 1 - 1) === 0 || Sign((X - 0.5) % 1 + 1) === 0)
    {
        return 0 + verOffset;
    }

    return amplitude*(2*(X - Math.floor(X + 1/2))) + verOffset;
}

//y = 4*|x - ⌊x + 3/4⌋ + 1/4| - 1
//https://en.wikipedia.org/wiki/Triangle_wave
function TriangleWave(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    return amplitude*(4*Math.abs(X - Math.floor(X + 3/4) + 1/4) - 1) + verOffset;
}

/*//5 horizontal line segments with y = -1, -0.5, 0, 0.5, 1, -x >= -0.5 && x <= 0.5 repeated
function StepFunction(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    let y;

    if (repeatedX >= -0.5 && repeatedX < -0.3)
    {
        y = -1;
    }
    else if (repeatedX >= -0.3 && repeatedX < -0.1)
    {
        y = -0.5;
    }
    else if (repeatedX >= -0.1 && repeatedX < 0.1)
    {
        y = 0;
    }
    else if (repeatedX >= 0.1 && repeatedX < 0.3)
    {
        y = 0.5;
    }
    else if (repeatedX >= 0.3 && repeatedX <= 0.5)
    {
        y = 1;
    }

    return amplitude*y + verOffset;
}*/

//y = floor(5*x + 0.5)/2, x >= -0.5 && x <= 0.5 repeated
function FloorFunction(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(Math.floor(5*repeatedX + 0.5)/2) + verOffset;
}

//y = sin(2π*x)
function Sine_period(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    return amplitude*Math.sin(2*Math.PI*X) + verOffset;
}

//y = tan(0.844π*x)/4, x >= -0.5 && x <= 0.5 repeated
//0.844 offset is calculated in such a way to make the function start in [-0.5, -1] and end in [0.5, 1]
function Tangent(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(Math.tan(0.844*Math.PI*repeatedX)/4) + verOffset;
}

//y = 4*x^2, x >= -0.5 && x <= 0.5 repeated
function Quadratic(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(8*repeatedX*repeatedX - 1) + verOffset;
}

//y = 2*sqrt(x + 0.5) - 1, x >= -0.5 && x <= 0.5 repeated
function SquareRoot(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(2*Math.sqrt(repeatedX + 0.5) - 1) + verOffset;
}

//y = 2*sqrt(r^2 - x^2) - 0.6, x >= -0.5 && x <= 0.5 repeated
function HalfCircle(amplitude, period, horOffset, verOffset, x)
{
    let r = 0.5;

    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(2*Math.sqrt(r**2 - repeatedX**2) - 0.6) + verOffset;
}

//y = 2*(0.05/(-x + 0.047723 + 0.5) - 0.047723) - 1, x >= -0.5 && x <= 0.5 repeated
//0.047723 offset is calculated in such a way to make the function start in [-0.5, -1] and end in [0.5, 1]
function Hyperbola(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(2*(0.05/(-repeatedX + 0.047723 + 0.5) - 0.047723) - 1) + verOffset;
}

//y = 2*e^(-(5*x)^2) - 1, x >= -0.5 && x <= 0.5 repeated
function NormalDistribution(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(2*Math.pow(Math.E, (-1*Math.pow(5*repeatedX, 2))) - 1) + verOffset;
}

//y = (2/π)*arccos(2*x) - 1, x >= -0.5 && x <= 0.5 repeated
function Arccosine(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*((2/Math.PI)*Math.acos(2*repeatedX) - 1) + verOffset;
}

//y = 8*x^3, x >= -0.5 && x <= 0.5 repeated
function Cubic(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(8*repeatedX*repeatedX*repeatedX) + verOffset;
}

//y = 0.575*(3.2*(x + 0.5) - 0)(3.2*(x + 0.5) - 0.5)(3.2*(x + 0.5) - 2)(3.2*(x + 0.5) - 3.2) + 0.204, x >= -0.5 && x <= 0.5 repeated
//0.575, 3.2 and 0.204 are calculated in such a way to make the function start in [-0.5, -1] and end in [0.5, 1]
function Quartic(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(0.575*(3.2*(repeatedX + 0.5) - 0)*(3.2*(repeatedX + 0.5) - 0.5)*(3.2*(repeatedX + 0.5) - 2)*(3.2*(repeatedX + 0.5) - 3.2) + 0.204) + verOffset;
}

//y = 1.259*cbrt(x), x >= -0.5 && x <= 0.5 repeated
//1.259 is calculated in such a way to make the function start in [-0.5, -1] and end in [0.5, 1]
function CubeRoot(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(1.259*Math.cbrt(repeatedX)) + verOffset;
}

//y = sin((3*2.507*x)^2), x >= -0.5 && x <= 0.5 repeated
//2.507 is calculated in such a way to make the function start in [-0.5, -1] and end in [0.5, 1]
function SineXSquared(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(Math.sin((3*2.507*repeatedX)**2)) + verOffset;
}

//y = sin(7π*x)/(7π*x), x >= -0.5 && x <= 0.5 repeated
function SincFunction(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    if (repeatedX === 0)
    {
        return 1;
    }

    return amplitude*(Math.sin(7*Math.PI*repeatedX)/(7*Math.PI*repeatedX)) + verOffset;
}

//y = sec(2*1.231*x) - 2, sec <=> 1/cos, x >= -0.5 && x <= 0.5 repeated
//1.231 is calculated in such a way to make the function start in [-0.5, -1] and end in [0.5, 1]
function Secant(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(1/Math.cos(2*1.231*repeatedX) - 2) + verOffset;
}


//y = 0.728*arctan(10*x), x >= -0.5 && x <= 0.5 repeated
//0.728 is calculated in such a way to make the function start in [-0.5, -1] and end in [0.5, 1]
function Arctangent(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(0.728*Math.atan(10*repeatedX)) + verOffset;
}

//y = 2*2.327*arcsec(x/10 + 1.05) - 1, arcsec <=> arccos(1/x), x >= -0.5 && x <= 0.5 repeated
//2.327 is calculated in such a way to make the function start in [-0.5, -1] and end in [0.5, 1]
function Arcsecant(amplitude, period, horOffset, verOffset, x)
{
    //x with horizontal offset and period taken into account
    let X = x/period - horOffset;

    //-0.5, 0.5 interval repetition
    let repeatedX = X < 0 ? (X - 0.5) % 1 + 0.5 : (X + 0.5) % 1 - 0.5;

    return amplitude*(2*2.327*Math.acos(1/(repeatedX/10 + 1.05)) - 1) + verOffset;
}







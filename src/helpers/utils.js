export const minmax = arr => {
    let min = null,
        max = null;

    arr.forEach(({ y0, y1 }) => {
        min = min === null ? y0 : Math.min(min, y0);
        max = max === null ? y1 : Math.max(max, y1);
    });

    return { min, max };
};

export const boundBy = (x, left, right) => {
    x = left === undefined ? x : Math.max(left, x);
    x = right === undefined ? x : Math.min(right, x);
    return x;
};

export const relToAbs = (rel, a, b) => a + rel * (b - a);

export const calcYBounds = (xData, yData, x0Rel, x1Rel) => {
    let i = 1;
    let j = xData.length - 1;

    const x0 = relToAbs(x0Rel, xData[1], xData[j]);
    const x1 = relToAbs(x1Rel, xData[1], xData[j]);

    while (xData[i] < x0) i++;
    while (xData[j] > x1) j--;

    let min = yData[i],
        max = yData[i];

    for (let k = i + 1; k <= j; k++) {
        const el = yData[k];
        min = Math.min(min, el);
        max = Math.max(max, el);
    }

    return { y0: min, y1: max };
};

export const interpolate = (xData, yData, xRel) => {
    const x = relToAbs(xRel, xData[1], xData[xData.length - 1]);
    let i = 1;
    while (xData[i] < x) i++;

    const y = yData[i - 1] + ((x - xData[i - 1]) * (yData[i] - yData[i - 1])) / (xData[i] - xData[i - 1]);
    return y;
};

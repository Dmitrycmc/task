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

export const calcYBounds = (xData, yData, x0, x1) => {
    let i = 1;
    let j = xData.length - 1;

    const xMin = xData[i];
    const dx = xData[j] - xMin;
    x0 = x0 * dx + xMin;
    x1 = x1 * dx + xMin;

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

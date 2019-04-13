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

export const absToRel = (abs, a, b) => (abs - a) / (b - a);

export const calcYBounds = (xData, yData, x0Rel, x1Rel, type) => {
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

    return { y0: type === 'line' ? min : 0, y1: max };
};

export const findClosestIndex = (xData, xRel) => {
    if (!xRel) return null;
    let x = relToAbs(xRel, xData[1], xData[xData.length - 1]);
    let i = 1;
    while (xData[i] < x) i++;
    i = (xData[i - 1] + xData[i]) / 2 < x ? i : i - 1;

    return i;
};

export const interpolate = (xData, yData, xRel) => {
    if (!xRel) return null;
    const x = relToAbs(xRel, xData[1], xData[xData.length - 1]);
    let i = 1;
    while (xData[i] < x) i++;
    const y = yData[i - 1] + ((x - xData[i - 1]) * (yData[i] - yData[i - 1])) / (xData[i] - xData[i - 1]);
    return y;
};

export const getColumns = (types, columns) => {
    const xKey = Object.keys(types).filter(key => types[key] === 'x')[0];
    const xColumn = columns.filter(column => column[0] === xKey)[0];

    const keys = Object.keys(types).filter(key => types[key] !== 'x');
    const yColumns = keys.reduce((obj, key) => ({ ...obj, [key]: columns.filter(column => column[0] === key)[0] }), {});

    return { xColumn, yColumns, keys };
};

export const arrSum = (a, b) => {
    if (!a) return [...b];
    return a.map((el, i) => el + b[i]);
};

const colorToGrb = c => {
    c = c.replace(/ /g, '');
    if (c[0] === '#') {
        if (c.length === 4) {
            // #rgb
            return {
                r: parseInt(c[1] + c[1], 16),
                g: parseInt(c[2] + c[2], 16),
                b: parseInt(c[3] + c[3], 16)
            };
        } else {
            // #rrggbb
            return {
                r: parseInt(c.slice(1, 3), 16),
                g: parseInt(c.slice(3, 5), 16),
                b: parseInt(c.slice(5, 7), 16)
            };
        }
    } else {
        // rgb(r,g,b)
        const sdf = c.slice(4, -1).split(',');
        return {
            r: +sdf[0],
            g: +sdf[1],
            b: +sdf[2]
        };
    }
};

const rgbToString = ({ r, g, b }) => `rgb(${r}, ${g}, ${b})`;

export const mixColors = (c1, c2) => {
    const { r: r1, g: g1, b: b1 } = colorToGrb(c1);
    const { r: r2, g: g2, b: b2 } = colorToGrb(c2);
    return rgbToString({
        r: ((r1 + r2) / 2).toFixed(),
        g: ((g1 + g2) / 2).toFixed(),
        b: ((b1 + b2) / 2).toFixed()
    });
};

export const minmax = arr => {
    let min = null,
        max = null;

    arr.forEach(([y0, y1]) => {
        min = min === null ? y0 : Math.min(min, y0);
        max = max === null ? y1 : Math.max(max, y1);
    });

    return [min, max];
};

export const boundBy = (x, left, right) => {
    x = left === undefined ? x : Math.max(left, x);
    x = right === undefined ? x : Math.min(right, x);
    return x;
};

export const relToAbs = (rel, a, b) => a + rel * (b - a);

export const absToRel = (abs, a, b) => (abs - a) / (b - a);

export const calcYBounds = (xData, yData, x0Rel, x1Rel, type) => {
    if (!yData) return [0, 0];

    let i = 1;
    let j = xData.length - 1;

    const x0 = relToAbs(x0Rel, xData[0], xData[j]);
    const x1 = relToAbs(x1Rel, xData[0], xData[j]);

    while (xData[i] < x0) i++;
    while (xData[j] > x1) j--;

    let min = yData[i],
        max = yData[i];

    for (let k = i + 1; k <= j; k++) {
        const el = yData[k];
        min = Math.min(min, el);
        max = Math.max(max, el);
    }

    return [type === 'line' ? min : 0, max];
};

export const findClosestIndex = (xData, xRel, bars) => {
    if (!xRel) return null;
    if (bars) {
        return Math.floor(xRel * xData.length);
    }
    let x = relToAbs(xRel, xData[0], xData[xData.length - 1]);

    let i = 1;
    while (xData[i] < x) i++;
    i = (xData[i - 1] + xData[i]) / 2 < x ? i : i - 1;
    return i;
};

/*
export const interpolate = (xData, yData, xRel) => {
    if (!xRel) return null;
    const x = relToAbs(xRel, xData[0], xData[xData.length - 1]);
    let i = 1;
    while (xData[i] < x) i++;
    const y = yData[i - 1] + ((x - xData[i - 1]) * (yData[i] - yData[i - 1])) / (xData[i] - xData[i - 1]);
    return y;
};
*/

export const getColumns = (types, columns) => {
    const xKey = Object.keys(types).filter(key => types[key] === 'x')[0];
    const xColumn = columns.filter(column => column[0] === xKey)[0].slice(1);

    const keys = Object.keys(types).filter(key => types[key] !== 'x');
    const yColumns = keys.reduce(
        (obj, key) => ({ ...obj, [key]: columns.filter(column => column[0] === key)[0].slice(1) }),
        {}
    );

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

export const calcOpacityColor = (c1, c2, opacity) => {
    const { r: r1, g: g1, b: b1 } = colorToGrb(c1);
    const { r: r2, g: g2, b: b2 } = colorToGrb(c2);
    return rgbToString({
        r: (opacity * r1 + (1 - opacity) * r2).toFixed(),
        g: (opacity * g1 + (1 - opacity) * g2).toFixed(),
        b: (opacity * b1 + (1 - opacity) * b2).toFixed()
    });
};

export const prepareData = data => {
    const { colors, names, types, columns, percentage, stacked, y_scaled: doubleY } = data;

    var originY2;
    let globalYBounds = {};
    let { xColumn, yColumns, keys } = getColumns(types, columns);

    keys.forEach(key => {
        globalYBounds[key] = calcYBounds(xColumn, yColumns[key], 0, 1, types[key]);
    });

    const globalMax = minmax(Object.values(globalYBounds))[1];

    let unit = '',
        factor = 1;
    if (globalMax > 1000000000) {
        unit = 'M';
        factor = 1000000;
    }
    if (globalMax > 1000000) {
        unit = 'K';
        factor = 1000;
    }

    keys.forEach(key => {
        yColumns[key] = yColumns[key].map(el => el / factor);
        globalYBounds[key] = globalYBounds[key].map(bound => bound / factor);
    });

    if (doubleY) {
        originY2 = yColumns.y1;
        yColumns.y1 = yColumns.y1.map(el => relToAbs(absToRel(el, ...globalYBounds.y1), ...globalYBounds.y0));
    }

    return {
        colors,
        names,
        types,
        percentage,
        stacked,
        doubleY,
        xColumn,
        yColumns,
        keys,
        globalYBounds,
        unit,
        originY2
    };
};

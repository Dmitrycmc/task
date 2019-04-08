export const minmax = arr => {
    let min = null,
        max = null;

    arr.filter(arr => arr.visible).forEach(({ y0, y1 }) => {
        min = Math.min(min || y0, y0);
        max = Math.max(max || y1, y1);
    });

    return { min, max };
};

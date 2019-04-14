export const dateFormat = (ms, showDayOfWeek) => {
    const date = new Date(ms);
    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${showDayOfWeek ? dayOfWeek + ', ' : ''}${dayOfMonth} ${month} ${year}`;
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jule', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DAY = 24 * 60 * 60 * 1000;

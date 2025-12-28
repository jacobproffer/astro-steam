const playTime = (minutes) => {
    let timeOutput = '';

    if (minutes >= 120) {
        timeOutput = `${Math.round(minutes / 60)} hours`;
    } else if (minutes > 60 && minutes < 120) {
        timeOutput = '1 hour';
    } else if (minutes > 1 && minutes < 60) {
        timeOutput = `${minutes} minutes`;
    } else {
        timeOutput = `${minutes} minute`;
    }

    return timeOutput;
};

export default playTime;

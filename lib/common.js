function getTimestamp() {
    const date = new Date();
    const day = (date.getDate() < 10)? `0${date.getDate()}` : date.getDate();
    const month = ((date.getMonth()+1)<10)? `0${date.getMonth()+1}` : date.getMonth();
    const year = date.getFullYear();
    const hour = (date.getHours() < 10)? `0${date.getHours()}` : date.getHours();
    const minutes = (date.getMinutes() < 10)? `0${date.getMinutes()}` : date.getMinutes();
    const seconds = (date.getSeconds() < 10)? `0${date.getSeconds()}` : date.getSeconds();
    return `${day}/${month}/${year} - ${hour}:${minutes}:${seconds}`;
}

module.exports = { getTimestamp };
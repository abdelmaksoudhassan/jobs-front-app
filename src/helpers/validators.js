export function isValidEmail(email) {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
}

export function isValidLength(min,max,field){
    return (field.length < min || field.length > max) ? false : true
}

export function onlyLettersAndSpaces(val) {
    const regex = /^[a-zA-Z\s]*$/
    return regex.test(val);
}
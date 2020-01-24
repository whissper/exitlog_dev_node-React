function makeFixedFormat(val) {

    const formattedStr = (val.toString().length === 1 ? '0'+val.toString() : val.toString());
    
    return formattedStr;
}

function formatDate(value) {
    const days      = value.getDate();
    const months    = value.getMonth() + 1;
    const fullYear  = value.getFullYear();
    
    return makeFixedFormat(days) + '-' + makeFixedFormat(months) + '-' + fullYear;
}

export default formatDate;
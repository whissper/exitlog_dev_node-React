function formatNullValue(val) {
    if (val === null) {
        return '';
    } else {
        return val;
    }
}; 

function processToArray(object) {
    return [
        formatNullValue(object.name),
        formatNullValue(object.note),
        formatNullValue(object.postalindex),
        formatNullValue(object.region),
        formatNullValue(object.town),
        formatNullValue(object.street),
        formatNullValue(object.building),
        formatNullValue(object.apartment),
        formatNullValue(object.geolat),
        formatNullValue(object.geolon),
        formatNullValue(object.oldformat) 
    ];
};

export default processToArray;

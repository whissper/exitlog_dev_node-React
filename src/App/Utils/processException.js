/**
 * Process Error
 * @param {Object} dataObject
 * <dataObject.message> - special error message for identification of error type
 * <dataObject.methodName> - name of method where error has occurred
 * <dataObject.representError> - callback for representing error info
 * @returns {Boolean} Error either occurred (true) or didn't (false)
 */
function processException(dataObject) {
    let errorOccured = false;

    let data = dataObject || {};
    data.message = (typeof data.message === 'undefined') ? 'DEFAULT_MESSAGE' : data.message;
    data.methodName = (typeof data.methodName === 'undefined') ? 'DEFAULT_METHOD' : data.methodName;
    data.representError = (typeof data.representError === 'undefined') ?
        function(errorInfo) { alert(errorInfo); } :
        data.representError;
    
    if (data.message === 'ERROR_ACCESS_DENIED') {
        errorOccured = true;
        data.representError('access denied : method -- ' + data.methodName);
    } else if (data.message.indexOf('ERROR_PDO') !== -1) {
        errorOccured = true;
        const errorInfo = data.message.split('|');
        data.representError('PDO Error: (' + errorInfo[1] + ') : method -- ' + data.methodName);
    } else if (data.message === 'CHANGE_IMPOSSIBLE') {
        errorOccured = true;
        data.representError('Изменение\\Удаление невозможно');
    } else if (data.message === 'ERROR_POSTDATA_INCORRECT') {
        errorOccured = true;
        data.representError('postdata is incorrect : method -- ' + data.methodName);
    } else if (data.message.indexOf('ERROR_FETCH') !== -1) {
        errorOccured = true;
        const errorInfo = data.message.split('|');
        data.representError('can\'t fetch data: ' + errorInfo[1]);
    } else if (data.message.indexOf('ERROR_HTTP') !== -1) {
        errorOccured = true;
        const errorInfo = data.message.split('|');
        data.representError('http error: ' + errorInfo[1]);
    } else if (data.message.indexOf('ERROR_TIME') !== -1) {
        errorOccured = true;
        const errorInfo = data.message.split('|');
        data.representError(errorInfo[1]);
    } else if (data.message.indexOf('ERROR_WS') !== -1) {
        errorOccured = true;
        const errorInfo = data.message.split('|');
        data.representError('Web service call error: ' + errorInfo[1]);
    } else if (data.message.indexOf('ERROR_SOAP') !== -1) {
        errorOccured = true;
        const errorInfo = data.message.split('|');
        data.representError('SOAP Web service call error: ' + errorInfo[1]);
    } else if (data.message.indexOf('ERROR_JAVA') !== -1) {
        errorOccured = true;
        const errorInfo = data.message.split('|');
        data.representError('Java runtime error: ' + errorInfo[1]);
    }

    return errorOccured;
}

export default processException;

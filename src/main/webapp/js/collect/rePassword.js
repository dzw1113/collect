function usPasswordModify(serviceCode, formName) {
	sendService(serviceCode, formName, usLoginCallBack);
}

function usLoginCallBack(responseHeader, responseBody) {
	layer.alert(responseHeader.returnDesc);
}
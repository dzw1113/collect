package com.icip.pc.bean;

import java.io.Serializable;
import java.util.Map;

public class RequestMessage implements Serializable {
	private static final long serialVersionUID = -3214592333684362899L;

	private RequestHeader requestHeader;
	private Map<String, Object> requestBody;

	public RequestMessage() {
	}
	
	public RequestMessage(RequestHeader requestHeader) {
		this.requestHeader = requestHeader;
	}

	public RequestHeader getRequestHeader() {
		return requestHeader;
	}

	public void setRequestHeader(RequestHeader requestHeader) {
		this.requestHeader = requestHeader;
	}

	public Map<String, Object> getRequestBody() {
		return requestBody;
	}

	public void setRequestBody(Map<String, Object> requestBody) {
		this.requestBody = requestBody;
	}

}

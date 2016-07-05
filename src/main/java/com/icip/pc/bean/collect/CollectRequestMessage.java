package com.icip.pc.bean.collect;

import java.io.Serializable;

import com.icip.pc.bean.RequestHeader;

public class CollectRequestMessage implements Serializable {
	private static final long serialVersionUID = -3214592333684362899L;

	private RequestHeader requestHeader;
	private String requestBody;

	public CollectRequestMessage() {
	}
	
	public CollectRequestMessage(RequestHeader requestHeader) {
		this.requestHeader = requestHeader;
	}

	public RequestHeader getRequestHeader() {
		return requestHeader;
	}

	public void setRequestHeader(RequestHeader requestHeader) {
		this.requestHeader = requestHeader;
	}

	public String getRequestBody() {
		return requestBody;
	}

	public void setRequestBody(String requestBody) {
		this.requestBody = requestBody;
	}

}

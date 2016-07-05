package com.icip.pc.bean.collect;

import java.io.Serializable;

import com.icip.framework.common.data.message.AbstractResponseHeader;
import com.icip.framework.common.data.message.MessageHeader;

public class Response implements Serializable {
	private static final long serialVersionUID = 3025085349927695398L;

	public MessageHeader getResponseHeader() {
		return responseHeader;
	}

	public void setResponseHeader(MessageHeader responseHeader) {
		this.responseHeader = responseHeader;
	}

	public String getResponseBody() {
		return responseBody;
	}

	public void setResponseBody(String responseBody) {
		this.responseBody = responseBody;
	}

	private MessageHeader responseHeader;
	private String responseBody;

	public Response() {
	}

	public Response(AbstractResponseHeader header) {
		this.responseHeader = header;
	}

}

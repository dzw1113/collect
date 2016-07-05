package com.icip.pc.bean.collect;

import java.io.Serializable;


public class CollectResultResponse implements Serializable {

	private static final long serialVersionUID = 4115164642989930991L;
	private Response response;

	public Response getResponse() {
		return response;
	}

	public void setResponse(Response response) {
		this.response = response;
	}
}

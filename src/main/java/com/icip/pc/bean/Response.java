package com.icip.pc.bean;

import com.icip.framework.common.data.message.AbstractResponseHeader;
import com.icip.framework.common.data.message.AbstractResponseMessage;

public class Response extends AbstractResponseMessage {
	private static final long serialVersionUID = 3025085349927695398L;

	public Response() {
	}

	public Response(AbstractResponseHeader header) {
		super(header);
	}

}

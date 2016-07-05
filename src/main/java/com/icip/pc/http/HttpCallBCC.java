package com.icip.pc.http;

import java.io.File;
import java.util.Iterator;
import java.util.Set;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.icip.framework.common.StringUtil;
import com.icip.framework.common.context.data.InvalidArgumentException;
import com.icip.framework.common.encrypt.impl.Encryption;
import com.icip.pc.bean.RequestHeader;
import com.icip.pc.bean.RequestMessage;
//import org.apache.http.HttpStatus;

//import org.apache.http.client.HttpClient;

public class HttpCallBCC {

	public static final Logger logger = Logger.getLogger(HttpCallBCC.class);

	public static final String BCC_URL = PropertiesUtil.getInstance(
			"/app.properties").getValue("BCC_URL");

	public static final String BCC_UPLOAD_URL = PropertiesUtil.getInstance(
			"/app.properties").getValue("BCC_UPLOAD_URL");

	public static final Boolean ENCRYPTION = Boolean
			.parseBoolean(PropertiesUtil.getInstance("/app.properties")
					.getValue("ENCRYPTION"));

	public static String sendJson(RequestMessage request, String serviceCode)
			throws Exception {
		String result = null;
		try {
			logger.debug(serviceCode + ":" + pack(request));
			result = HttpDispacher.sendPost(BCC_URL + serviceCode,
					pack(request));
			logger.debug(serviceCode + ":" + result);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (ENCRYPTION) {
			result = Encryption.decryption(result);
		}
		return removeCallBackResponse(result);
	}

	// 打包请求
	private static String pack(RequestMessage request) throws Exception {
		RequestHeader header = request.getRequestHeader();
		if (null == header) {
			throw new InvalidArgumentException("报文头信息不能为空");
		}
		String jsonStr = JSONObject.toJSONString(request);
		String result = "{\"request\": " + jsonStr + "}";
		result = removeLegal(result);

		if (ENCRYPTION) {
			result = Encryption.encryption(result);
		}
		return result;
	}

	/**
	 * 去除空的
	 * 
	 * @param jsonStr
	 * @throws Exception
	 */
	public static String removeLegal(String jsonStr) throws Exception {
		JSONObject request = JSONObject.parseObject(jsonStr);
		JSONObject requestJson = request.getJSONObject("request");
		JSONObject headerJson = requestJson.getJSONObject("requestHeader");
		JSONObject bodyJson = requestJson.getJSONObject("requestBody");

		// 头处理
		Set<String> paramSet = headerJson.keySet();
		Iterator<String> it = paramSet.iterator();
		while (it.hasNext()) {
			String param = it.next();

			if ("".equals(headerJson.get(param)))
				headerJson.put(param, null);
		}

		// 体处理
		Set<String> bodySet = bodyJson.keySet();
		Iterator<String> bodyIt = bodySet.iterator();
		while (bodyIt.hasNext()) {
			String key = bodyIt.next();
			String value = "";
			try {
				value = (String) bodyJson.get(key);
				if (StringUtil.isBlank(value) || "null".equals(value)
						|| StringUtil.isBlank(value.trim())) {
					bodyIt.remove();
					bodyJson.remove(key);
				}
			} catch (Exception e) {
			}
		}

		requestJson.put("requestHeader", headerJson);
		requestJson.put("requestBody", bodyJson);
		request.put("request", requestJson);
		return JSONObject.toJSONString(request);

	}

	/**
	 * 去除callBackResponse
	 * 
	 * @param jsonStr
	 * @throws Exception
	 */
	public static String removeCallBackResponse(String jsonStr)
			throws Exception {
		JSONObject response = JSONObject.parseObject(jsonStr);
		JSONObject responseJson = response.getJSONObject("response");
		if (responseJson.containsKey("callBackResponse")) {
			responseJson.remove("callBackResponse");
		}
		JSONObject resp = new JSONObject();
		resp.put("response", responseJson);
		return JSONObject.toJSONString(resp);
	}


	public static String uploadFile(File file, String fileName) throws Exception {
		String result = null;
		 
		PostMethod postMethod = new PostMethod(BCC_UPLOAD_URL);
		try {
			// FilePart：用来上传文件的类
			FilePart fp = new FilePart(fileName, file);
			Part[] parts = { fp };

			// 对于MIME类型的请求，httpclient建议全用MulitPartRequestEntity进行包装
			MultipartRequestEntity mre = new MultipartRequestEntity(parts,
					postMethod.getParams());
			postMethod.setRequestEntity(mre);
			HttpClient client = new HttpClient();
			client.getHttpConnectionManager().getParams()
					.setConnectionTimeout(50000);// 设置连接时间
			int status = client.executeMethod(postMethod);
			if (status == HttpStatus.SC_OK) {
				if (ENCRYPTION) {
					result = Encryption.decryption(postMethod.getResponseBodyAsString());
				}else{
					result = postMethod.getResponseBodyAsString();
				}
			} else {
				System.out.println("fail");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// 释放连接
			postMethod.releaseConnection();
		}
		return removeCallBackResponse(result);
	}
}

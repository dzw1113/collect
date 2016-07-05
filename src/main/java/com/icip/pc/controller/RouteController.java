package com.icip.pc.controller;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import Decoder.BASE64Decoder;
import Decoder.BASE64Encoder;

import com.alibaba.fastjson.JSONObject;
import com.icip.framework.common.data.message.ResponseHeader;
import com.icip.pc.bean.RequestHeader;
import com.icip.pc.bean.RequestMessage;
import com.icip.pc.bean.ResultResponse;
import com.icip.pc.bean.collect.CollectRequestMessage;
import com.icip.pc.bean.collect.CollectResultResponse;
import com.icip.pc.bean.collect.Response;
import com.icip.pc.http.HttpCallBCC;

@Controller
public class RouteController {
	private static final Log logger = LogFactory.getLog(RouteController.class);

	/**
	 * 统一入口，requet要待脱离comm包
	 * 
	 * @param requestBody
	 * @return json
	 * @throws Exception
	 */
	@RequestMapping(value = "/service", method = RequestMethod.POST)
	public ModelAndView coreProcess(@RequestBody CollectRequestMessage request)
			throws Exception {
		logger.info("收到服务请求" + "----framework: service begin");
		RequestMessage requestBody = decryption(request);
		RequestHeader requestHeader = (RequestHeader) requestBody
				.getRequestHeader();

		String serviceCode = requestHeader.getServiceCode();

		String result = HttpCallBCC.sendJson(requestBody, serviceCode);
		ResultResponse bresultResponse = JSONObject.parseObject(result,
				ResultResponse.class);
		CollectResultResponse resultResponse = ecryption(bresultResponse,requestHeader.getSystemDate());
		ModelAndView mav = new ModelAndView();
		mav.addObject(resultResponse.getResponse());
		return mav;
	}

	/**
	 * collect解密
	 * 
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	private RequestMessage decryption(CollectRequestMessage request) throws Exception {
		RequestMessage rm = new RequestMessage();
		rm.setRequestHeader(request.getRequestHeader());
		String cbody = request.getRequestBody();
		String key = request.getRequestHeader().getSystemDate();
		String body = decryption(key,cbody);
		Map<String,Object> requestBody = JSONObject.parseObject(body,Map.class);
		rm.setRequestBody(requestBody);
		return rm;
	}
	
	/**
	 * collect加密
	 * @param key 
	 * 
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	private CollectResultResponse ecryption(ResultResponse resultResponse, String key) throws Exception {
		CollectResultResponse cr = new CollectResultResponse();
		Response resp = new Response();;
		String jBody = JSONObject.toJSONString(resultResponse.getResponse().getResponseBody());
		String responseBody = encryption(jBody, key);
		ResponseHeader mh = (ResponseHeader) resultResponse.getResponse().getResponseHeader();
		mh.setSystemDate(key);
		resp.setResponseHeader(mh);
		resp.setResponseBody(responseBody);
		cr.setResponse(resp);
		return cr;
	}

	public static String decryption(String key,String str) throws Exception {
		Cipher cipher = null;
		try {
			cipher = Cipher.getInstance("DES");
			cipher.init(Cipher.DECRYPT_MODE, generateKey(key));
		} catch (Exception e) {
			throw new Exception("解析出错！", e);
		}
		BASE64Decoder decoder = new BASE64Decoder();
		byte[] decryptFrom = decoder.decodeBuffer(str);
		try {
			byte[] buf = cipher.doFinal(decryptFrom);
			String result = new String(buf,"UTF-8");
			return result;
		} catch (IllegalBlockSizeException e) {
			throw new Exception("IllegalBlockSizeException", e);
		} catch (BadPaddingException e) {
			throw new Exception("BadPaddingException", e);
		}
	}

	private static SecretKey generateKey(String secretKey)
			throws NoSuchAlgorithmException, InvalidKeySpecException,
			InvalidKeyException {
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
		DESKeySpec keySpec = new DESKeySpec(secretKey.getBytes());
		keyFactory.generateSecret(keySpec);
		return keyFactory.generateSecret(keySpec);
	}
	
	
	public static String encryption(String plainData,String key) {
		Cipher cipher = null;
		try {
			cipher = Cipher.getInstance("DES");
			cipher.init(1, generateKey(key));
		} catch (NoSuchAlgorithmException e) {
			logger.error(e.getMessage(), e);
			return null;
		} catch (NoSuchPaddingException e) {
			logger.error(e.getMessage(), e);
			return null;
		} catch (InvalidKeyException e) {
			logger.error(e.getMessage(), e);
			return null;
		} catch (InvalidKeySpecException e) {
			logger.error(e.getMessage(), e);
			return null;
		}

		String str = "";
		try {
			byte[] buf = cipher.doFinal(plainData.getBytes("UTF-8"));
			String result = new BASE64Encoder().encode(buf);
			return result;
		} catch (IllegalBlockSizeException e) {
			logger.error(e.getMessage(), e);
		} catch (BadPaddingException e) {
			logger.error(e.getMessage(), e);
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(), e);
		}
		return str;
	}
	
	public static void main(String[] args) {
		String key = "20160603182053";
		String plainData = "{\"functionCodeList\":[\"F001\",\"F002\",\"F003\",\"F005\",\"F007\",\"F001\",\"F003\",\"F004\",\"F005\",\"F006\",\"F007\",\"F002\"],\"userRoleList\":[\"R003\",\"R003\",\"R003\",\"R003\",\"R003\",\"R001\",\"R001\",\"R001\",\"R001\",\"R001\",\"R001\",\"R004\"]}";
		
		String result = encryption(plainData, key).replaceAll("\n", "");
		System.err.println(result.replaceAll(" ", ""));
		
	}
}

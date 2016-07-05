package com.icip.pc.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJacksonJsonView;

import com.alibaba.fastjson.JSONObject;
import com.icip.framework.common.data.message.ResponseHeader;
import com.icip.pc.bean.ResultResponse;
import com.icip.pc.http.HttpCallBCC;

@Controller
public class FileContoller {

	private static final Log logger = LogFactory.getLog(FileContoller.class);

	/**
	 * 上传文件
	 * 
	 * @param request
	 * @param params
	 * @param values
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	public ModelAndView upload(HttpServletRequest request,
			HttpServletResponse response) {
		String result = null;
		logger.debug("------File Controller 收到文件上传请求  ------>");

		MultipartHttpServletRequest mRequest = (MultipartHttpServletRequest) request;
		Map<String, MultipartFile> fileMap = mRequest.getFileMap();

		for (Iterator<Map.Entry<String, MultipartFile>> it = fileMap.entrySet()
				.iterator(); it.hasNext();) {

			logger.debug("------File Controller 循环取multipartForm中文件对象  start ------>");

			Map.Entry<String, MultipartFile> entry = it.next();
			MultipartFile mFile = entry.getValue();
			String fileName = mFile.getName(); 

			logger.debug("------File Controller 上送约定的      fileName--------------->"
					+ fileName);

			ResponseHeader header = new ResponseHeader();

			File tempFile = new File(fileName);
			if (!tempFile.getParentFile().exists()) {
				tempFile.getParentFile().mkdirs();
			}
			try {
				tempFile.createNewFile();
				FileCopyUtils.copy(mFile.getInputStream(),
						new FileOutputStream(fileName));
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
				header.setReturnStatus("0");
			}
			try {
				result = HttpCallBCC.uploadFile(tempFile, fileName);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		ResultResponse resultResponse = JSONObject.parseObject(result,
				ResultResponse.class);
		ModelAndView mav = new ModelAndView();
//		mav.addObject(resultResponse.getResponse());
		
		MappingJacksonJsonView view = new MappingJacksonJsonView();
        Map attributes = new HashMap();
        attributes.put("response", resultResponse.getResponse());

        view.setAttributesMap(attributes);
        mav.setView(view);
		
		return mav;

	}

}

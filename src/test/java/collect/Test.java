package collect;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

public class Test {

	@org.junit.Test
	public void TestJson(){
		Map map = new HashMap();
		
		Map request = new HashMap();
		Map requestBody= new HashMap();
		requestBody.put("username", "18680303292");
		requestBody.put("password", "e10adc3949ba59abbe56e057f20f883e");
		
		Map requestHeader = new HashMap();
		requestHeader.put("softTerminalId", "P-IOS");
		
		request.put("requestBody", requestBody);
		request.put("requestHeader", requestHeader);
		
		map.put("request", request);
		String str = JSONObject.toJSONString(map);
		System.err.println(str);
	}
}

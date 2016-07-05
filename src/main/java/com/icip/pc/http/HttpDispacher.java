package com.icip.pc.http;

import java.io.IOException;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.SimpleHttpConnectionManager;
import org.apache.commons.httpclient.methods.DeleteMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.apache.commons.httpclient.protocol.Protocol;

import com.icip.framework.network.https.util.NoPKISocketFactory;


public class HttpDispacher
{
  public static final int TIME_OUT = 60000;

  @SuppressWarnings("deprecation")
public static String sendGet(String url)
  {
    String result = null;
    if ("https:".equals(url.substring(0, url.indexOf("//")))) {
      Protocol myhttps = new Protocol("https", new NoPKISocketFactory(), 443);
      Protocol.registerProtocol("https", myhttps);
    }
    GetMethod getMethod = new GetMethod(url);
    getMethod.getParams().setParameter("http.method.retry-handler", new DefaultHttpMethodRetryHandler());
    HttpClientParams httpClientParams = new HttpClientParams();
    httpClientParams.setParameter("http.method.retry-handler", new DefaultHttpMethodRetryHandler());
    httpClientParams.setSoTimeout(600000);
    HttpClient httpClient = new HttpClient(httpClientParams, new SimpleHttpConnectionManager());
    int statusCode = -1;
    try {
      statusCode = httpClient.executeMethod(getMethod);
      if (statusCode != 200) {
        System.err.println("Method failed: " + getMethod.getStatusLine());
      }
      String responseMsg = getMethod.getResponseBodyAsString();
      result = responseMsg;
    } catch (HttpException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (getMethod != null) {
        getMethod.releaseConnection();
      }
    }
    return result;
  }

  @SuppressWarnings("deprecation")
public static String sendPost(String url, String content)
  {
    String result = null;
    if ("https:".equals(url.substring(0, url.indexOf("//")))) {
      Protocol myhttps = new Protocol("https", new NoPKISocketFactory(), 443);
      Protocol.registerProtocol("https", myhttps);
    }
    PostMethod postMethod = new PostMethod(url);




    postMethod.setRequestBody(content);

    postMethod.getParams().setParameter("http.method.retry-handler", new DefaultHttpMethodRetryHandler());
    HttpClientParams httpClientParams = new HttpClientParams();
    httpClientParams.setParameter("http.method.retry-handler", new DefaultHttpMethodRetryHandler(1,false));
    httpClientParams.setSoTimeout(600000);
    httpClientParams.setContentCharset("UTF-8");
    HttpClient httpClient = new HttpClient(httpClientParams, new SimpleHttpConnectionManager());
    int statusCode = -1;
    try {
      statusCode = httpClient.executeMethod(postMethod);
      if (statusCode != 200) {
        System.err.println("Method failed: " + postMethod.getStatusLine());
      }
      String responseMsg = postMethod.getResponseBodyAsString();
      result = responseMsg;
    } catch (HttpException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (postMethod != null) {
        postMethod.releaseConnection();
      }
    }
    return result;
  }

  @SuppressWarnings("deprecation")
public static String sendDelete(String url)
  {
    String result = null;
    if ("https:".equals(url.substring(0, url.indexOf("//")))) {
      Protocol myhttps = new Protocol("https", new NoPKISocketFactory(), 443);
      Protocol.registerProtocol("https", myhttps);
    }
    DeleteMethod deleteMethod = new DeleteMethod(url);
    deleteMethod.getParams().setParameter("http.method.retry-handler", new DefaultHttpMethodRetryHandler());
    HttpClientParams httpClientParams = new HttpClientParams();
    httpClientParams.setParameter("http.method.retry-handler", new DefaultHttpMethodRetryHandler());
    httpClientParams.setSoTimeout(600000);
    HttpClient httpClient = new HttpClient(httpClientParams, new SimpleHttpConnectionManager());
    int statusCode = -1;
    try {
      statusCode = httpClient.executeMethod(deleteMethod);
      if (statusCode != 200) {
        System.err.println("Method failed: " + deleteMethod.getStatusLine());
      }
      String responseMsg = deleteMethod.getResponseBodyAsString();
      result = responseMsg;
    } catch (HttpException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (deleteMethod != null) {
        deleteMethod.releaseConnection();
      }
    }
    return result;
  }
}


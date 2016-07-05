package com.icip.pc.http;

import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Encrypt {

	private static final Log logger = LogFactory.getLog(Encrypt.class);

	private static final String DES_ALGORITHM = "DES";

	private static final String secretKey = "yzksecr0";
	
	// 全局数组
    private final static String[] strDigits = { "0", "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" };


	/**
	 * DES����
	 * 
	 * @param plainData
	 * @param secretKey
	 * @return
	 * @throws Exception
	 */
	public static String encryption(String plainData) {

		Cipher cipher = null;
		try {
			cipher = Cipher.getInstance(DES_ALGORITHM);
			cipher.init(Cipher.ENCRYPT_MODE, Encrypt.generateKey());
		} catch (NoSuchAlgorithmException e) {
			logger.error(e.getMessage(), e);
		} catch (NoSuchPaddingException e) {
			logger.error(e.getMessage(), e);
		} catch (InvalidKeyException e) {
			logger.error(e.getMessage(), e);
		}

		try {
			// FIXME Ϊ�˷�ֹ����ʱ��javax.crypto.IllegalBlockSizeException: Input
			// length must be multiple of 8 when decrypting with padded
			// cipher�쳣��
			// ���ܰѼ��ܺ���ֽ�����ֱ��ת�����ַ�
			byte[] buf = cipher.doFinal(plainData.getBytes());
			return Base64Utils.encode(buf);
		} catch (IllegalBlockSizeException e) {
			logger.error(e.getMessage(), e);
		} catch (BadPaddingException e) {
			e.printStackTrace();
			logger.error(e.getMessage(), e);
		}
		return null;
	}

	/**
	 * DES����
	 * 
	 * @param secretData
	 * @param secretKey
	 * @return
	 * @throws Exception
	 */
	public static String decryption(String secretData) throws Exception {

		Cipher cipher = null;
		try {
			cipher = Cipher.getInstance(DES_ALGORITHM);
			cipher.init(Cipher.DECRYPT_MODE, generateKey());
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			throw new Exception("NoSuchAlgorithmException", e);
		} catch (NoSuchPaddingException e) {
			e.printStackTrace();
			throw new Exception("NoSuchPaddingException", e);
		} catch (InvalidKeyException e) {
			e.printStackTrace();
			throw new Exception("InvalidKeyException", e);
		}

		try {
			byte[] buf = cipher.doFinal(Base64Utils.decode(secretData
					.toCharArray()));
			String result = new String(buf, "utf-8");
			return result;
		} catch (IllegalBlockSizeException e) {
			e.printStackTrace();
			throw new Exception("IllegalBlockSizeException", e);
		} catch (BadPaddingException e) {
			e.printStackTrace();
			throw new Exception("BadPaddingException", e);
		}
	}

	/**
	 * ���������Կ
	 * 
	 * @param secretKey
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	// FIXME SecureRandom ʵ����ȫ�����ϵͳ����ăȲ�״̬����ǵ��÷��ڵ���
	// getInstance������Ȼ����� setSeed ����
	// ��ʵ���� windows ��ÿ����ɵ� key ����ͬ�������� solaris �򲿷� linux ϵͳ����ͬ
	private static SecretKey generateKey() throws NoSuchAlgorithmException {
		SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");
		secureRandom.setSeed(secretKey.getBytes());
		// Ϊ����ѡ���DES�㷨���һ��KeyGenerator����
		KeyGenerator kg = null;
		try {
			kg = KeyGenerator.getInstance(DES_ALGORITHM);
		} catch (NoSuchAlgorithmException e) {
		}
		kg.init(secureRandom);

		// �����Կ
		return kg.generateKey();
	}

	static class Base64Utils {
		static private char[] alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
				.toCharArray();
		static private byte[] codes = new byte[256];
		static {
			for (int i = 0; i < 256; i++)
				codes[i] = -1;
			for (int i = 'A'; i <= 'Z'; i++)
				codes[i] = (byte) (i - 'A');
			for (int i = 'a'; i <= 'z'; i++)
				codes[i] = (byte) (26 + i - 'a');
			for (int i = '0'; i <= '9'; i++)
				codes[i] = (byte) (52 + i - '0');
			codes['+'] = 62;
			codes['/'] = 63;
		}

		/**
		 * ��ԭʼ��ݱ���Ϊbase64����
		 */
		protected static String encode(byte[] data) {
			char[] out = new char[((data.length + 2) / 3) * 4];
			for (int i = 0, index = 0; i < data.length; i += 3, index += 4) {
				boolean quad = false;
				boolean trip = false;
				int val = (0xFF & (int) data[i]);
				val <<= 8;
				if ((i + 1) < data.length) {
					val |= (0xFF & (int) data[i + 1]);
					trip = true;
				}
				val <<= 8;
				if ((i + 2) < data.length) {
					val |= (0xFF & (int) data[i + 2]);
					quad = true;
				}
				out[index + 3] = alphabet[(quad ? (val & 0x3F) : 64)];
				val >>= 6;
				out[index + 2] = alphabet[(trip ? (val & 0x3F) : 64)];
				val >>= 6;
				out[index + 1] = alphabet[val & 0x3F];
				val >>= 6;
				out[index + 0] = alphabet[val & 0x3F];
			}

			return new String(out);
		}

		/**
		 * ��base64�������ݽ����ԭʼ���
		 */
		protected static byte[] decode(char[] data) {
			int len = ((data.length + 3) / 4) * 3;
			if (data.length > 0 && data[data.length - 1] == '=')
				--len;
			if (data.length > 1 && data[data.length - 2] == '=')
				--len;
			byte[] out = new byte[len];
			int shift = 0;
			int accum = 0;
			int index = 0;
			for (int ix = 0; ix < data.length; ix++) {
				int value = codes[data[ix] & 0xFF];
				if (value >= 0) {
					accum <<= 6;
					shift += 6;
					accum |= value;
					if (shift >= 8) {
						shift -= 8;
						out[index++] = (byte) ((accum >> shift) & 0xff);
					}
				}
			}
			if (index != out.length)
				throw new Error("miscalculated data length!");
			return out;
		}
	}

	public static void main(String[] a) throws Exception {
		String content = "{\"response\":{\"responseHeader\":{\"serviceCode\":\"00100001\",\"interfaceVersion\":\"1.0\",\"systemDate\":\"20150610113043\",\"companyID\":\"C1194637000018\",\"serviceResponse\":{\"returnCode\":\"IICIPPDS01001\",\"returnDesc\":\"�ۺ���Ϣ��ѯ�ɹ�\",\"returnStatus\":\"COMPLETE\"}},\"responseBody\":{\"txResult\":\"��ѯ�ɹ�\",\"naPlotNum\":\"100\",\"naPlotArea\":\"10000000\",\"naEmployeeNum\":\"8000\",\"naServerProperty\":\"10000000\",\"naCompanyNum\":\"60\",\"province\":[{\"name\":\"����\",\"plotNum\":\"98\",\"plotArea\":\"12000\",\"subCompanyNum\":\"32\",\"employeeNum\":\"1198\",\"serverProperty\":\"9823\",\"subCity\":[{\"subName\":\"�ϲ�\",\"subPlotNum\":\"9\",\"companyID\":\"10000001\",\"subPlotArea\":\"111112\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"�Ž�\",\"subPlotNum\":\"8\",\"companyID\":\"10000002\",\"subPlotArea\":\"234566\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"Ƽ��\",\"subPlotNum\":\"4\",\"companyID\":\"10000003\",\"subPlotArea\":\"22221\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"������\",\"subPlotNum\":\"3\",\"companyID\":\"10000004\",\"subPlotArea\":\"34555\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"ӥ̶\",\"subPlotNum\":\"8\",\"companyID\":\"10000005\",\"subPlotArea\":\"66533\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"}]},{\"name\":\"����\",\"plotNum\":\"98\",\"plotArea\":\"12000\",\"subCompanyNum\":\"32\",\"PlotNum\":\"26\",\"employeeNum\":\"1198\",\"serverProperty\":\"9823\",\"subCity\":[{\"subName\":\"�人\",\"subPlotNum\":\"4\",\"companyID\":\"10000001\",\"subPlotArea\":\"12345\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"����\",\"subPlotNum\":\"7\",\"companyID\":\"10000002\",\"subPlotArea\":\"55662\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"����\",\"subPlotNum\":\"4\",\"companyID\":\"10000003\",\"subPlotArea\":\"2114\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"����\",\"subPlotNum\":\"3\",\"companyID\":\"10000004\",\"subPlotArea\":\"12445\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"�˲�\",\"subPlotNum\":\"8\",\"companyID\":\"10000005\",\"subPlotArea\":\"1334\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"}]},{\"name\":\"����\",\"plotNum\":\"88\",\"plotArea\":\"12345\",\"subCompanyNum\":\"28\",\"PlotNum\":\"26\",\"employeeNum\":\"1188\",\"serverProperty\":\"9823\",\"subCity\":[{\"subName\":\"����\",\"subPlotNum\":\"5\",\"companyID\":\"10000011\",\"subPlotArea\":\"12345\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"����\",\"subPlotNum\":\"9\",\"companyID\":\"10000012\",\"subPlotArea\":\"55662\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"����\",\"subPlotNum\":\"6\",\"companyID\":\"10000013\",\"subPlotArea\":\"2114\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"���Ǹ�\",\"subPlotNum\":\"3\",\"companyID\":\"10000014\",\"subPlotArea\":\"10880\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"����\",\"subPlotNum\":\"8\",\"companyID\":\"10000015\",\"subPlotArea\":\"1334\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"}]},{\"name\":\"����\",\"plotNum\":\"88\",\"plotArea\":\"12345\",\"subCompanyNum\":\"28\",\"PlotNum\":\"26\",\"employeeNum\":\"1188\",\"serverProperty\":\"9823\",\"subCity\":[{\"subName\":\"��ɳ\",\"subPlotNum\":\"5\",\"companyID\":\"10000021\",\"subPlotArea\":\"12345\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"����\",\"subPlotNum\":\"9\",\"companyID\":\"10000022\",\"subPlotArea\":\"55662\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"����\",\"subPlotNum\":\"6\",\"companyID\":\"10000023\",\"subPlotArea\":\"2114\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"�żҽ�\",\"subPlotNum\":\"3\",\"companyID\":\"10000024\",\"subPlotArea\":\"10880\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"¦��\",\"subPlotNum\":\"8\",\"companyID\":\"10000025\",\"subPlotArea\":\"1334\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"}]},{\"name\":\"�㶫\",\"plotNum\":\"88\",\"plotArea\":\"13345\",\"subCompanyNum\":\"28\",\"PlotNum\":\"26\",\"employeeNum\":\"1228\",\"serverProperty\":\"9823\",\"subCity\":[{\"subName\":\"����\",\"subPlotNum\":\"8\",\"companyID\":\"10000041\",\"subPlotArea\":\"12345\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"����\",\"subPlotNum\":\"9\",\"companyID\":\"10000042\",\"subPlotArea\":\"55662\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"�麣\",\"subPlotNum\":\"6\",\"companyID\":\"10000043\",\"subPlotArea\":\"2114\",\"subEmployeeNum\":\"670\",\"subServerProperty\":\"5433\"},{\"subName\":\"��ɽ\",\"subPlotNum\":\"8\",\"companyID\":\"10000044\",\"subPlotArea\":\"10880\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"},{\"subName\":\"տ��\",\"subPlotNum\":\"8\",\"companyID\":\"10000045\",\"subPlotArea\":\"1334\",\"subEmployeeNum\":\"600\",\"subServerProperty\":\"5433\"}]}]}}}";

		String result = Encrypt.encryption(content);
		System.out.println(result);
		System.out.println(Encrypt.decryption(result));
	}

	/**
	 * MD5加密
	 * 
	 * @param strObj
	 * @return
	 */
	public static String GetMD5Code(String strObj) {
		String resultString = null;
		try {
			resultString = new String(strObj);
			MessageDigest md = MessageDigest.getInstance("MD5");
			// md.digest() 该函数返回值为存放哈希值结果的byte数组
			resultString = byteToString(md.digest(strObj.getBytes()));
		} catch (NoSuchAlgorithmException ex) {
			ex.printStackTrace();
		}
		return resultString;
	}

	// 转换字节数组为16进制字串
	private static String byteToString(byte[] bByte) {
		StringBuffer sBuffer = new StringBuffer();
		for (int i = 0; i < bByte.length; i++) {
			sBuffer.append(byteToArrayString(bByte[i]));
		}
		return sBuffer.toString();
	}
	
	// 返回形式为数字跟字符串
    private static String byteToArrayString(byte bByte) {
        int iRet = bByte;
        // System.out.println("iRet="+iRet);
        if (iRet < 0) {
            iRet += 256;
        }
        int iD1 = iRet / 16;
        int iD2 = iRet % 16;
        return strDigits[iD1] + strDigits[iD2];
    }

}

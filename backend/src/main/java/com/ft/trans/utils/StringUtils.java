package com.ft.trans.utils;

public class StringUtils {

    public static Boolean isAlphaOnly(String str)
    {
        for (char c : str.toCharArray()) {
            if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || (c == 32))
                continue ;
            return false;
        }
        return true;
    }

}

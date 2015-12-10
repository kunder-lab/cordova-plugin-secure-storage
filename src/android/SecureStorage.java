package com.crypho.plugins;

//import android.util.Log;
import android.util.Base64;

import android.content.Context;
import android.content.Intent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.ConfigXmlParser;
import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONException;

public class SecureStorage extends CordovaPlugin {
    private static final String TAG = "SecureStorage";

    private String encryptionKey;
    private String serviceName;

    @Override
    public boolean execute(String action, CordovaArgs args, final CallbackContext callbackContext) throws JSONException {
        if ("init".equals(action)) {
            serviceName = args.getString(0);
            encryptionKey = args.getString(1);
            return true;
        }
        if ("set".equals(action)) {
            final String key = args.getString(0);
            final String value = args.getString(1);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        SecurePreferences preferences = new SecurePreferences(getContext(), serviceName, encryptionKey, true);
                        preferences.put(key, value);
                        callbackContext.success();
                    } catch (Exception e) {
                        //Log.e(TAG, "Set Storage Element failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }
        if ("get".equals(action)) {
            final String key = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        SecurePreferences preferences = new SecurePreferences(getContext(), serviceName, encryptionKey, true);
                        String value = preferences.getString(key);
                        callbackContext.success(value);
                    } catch (Exception e) {
                        //Log.e(TAG, "Get Storage Element failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }
        if ("remove".equals(action)) {
            final String key = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        SecurePreferences preferences = new SecurePreferences(getContext(), serviceName, encryptionKey, true);
                        preferences.put(key, "");
                        callbackContext.success();
                    } catch (Exception e) {
                        //Log.e(TAG, "Remove Storage Element failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }
        return false;
    }

    private Context getContext(){
        return cordova.getActivity().getApplicationContext();
    }
}

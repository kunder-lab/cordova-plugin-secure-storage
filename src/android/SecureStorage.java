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

    private SecurePreferences preferences;

    /**
    * Sets the context of the Command. This can then be used to do things like
    * get file paths associated with the Activity.
    *
    * @param cordova
    *            The context of the main Activity.
    * @param webView
    *            The CordovaWebView Cordova is running in.
    */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, CordovaArgs args, final CallbackContext callbackContext) throws JSONException {
        if ("init".equals(action)) {
            try {
                serviceName = args.getString(0);
                encryptionKey = args.getString(1);

                preferences = new SecurePreferences(getContext(), encryptionKey, serviceName);

                callbackContext.success();
            } catch (Exception e) {
                callbackContext.error(e.getMessage());
            }

            return true;
        }
        if ("set".equals(action)) {
            final String key = args.getString(0);
            final String value = args.getString(1);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        SecurePreferences.Editor editor = preferences.edit();
                        editor.putString(key, value);
                        editor.commit();

                        callbackContext.success();
                    } catch (Exception e) {
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
                        String value = preferences.getString(key, "");

                        callbackContext.success(value);
                    } catch (Exception e) {
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
                        SecurePreferences.Editor editor = preferences.edit();
                        editor.putString(key, "");
                        editor.commit();

                        callbackContext.success();
                    } catch (Exception e) {
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

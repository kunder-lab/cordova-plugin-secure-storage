var sjcl_ss = cordova.require('cordova-plugin-secure-storage.sjcl_ss');
var ESP6Promise = cordova.require('cordova-plugin-secure-storage.es6-promise').Promise;
var _AES_PARAM = {
    ks: 256,
    ts: 128,
    mode: 'ccm',
    cipher: 'aes'
 };

var _checkCallbacks = function (success, error) {

    if (typeof success != "function")  {
        console.log("SecureStorage failure: success callback parameter must be a function");
        return false;
    }

    if (typeof error != "function") {
        console.log("SecureStorage failure: error callback parameter must be a function");
        return false;
    }

    return true;
};

var SecureStorageiOS = function (success, error, service) {
    this.service = service;
    setTimeout(success, 0);
    return this;
};

SecureStorageiOS.prototype = {

    get: function (success, error, key) {
        var self = this;
        var promise = new ESP6Promise(function(resolve, reject) {
            cordova.exec(resolve, reject, "SecureStorage", "get", [self.service, key]);
        });
    
        promise.then(success, error);
        return promise;
    },

    set: function (success, error, key, value) {
        var self = this;
        var promise = new ESP6Promise(function(resolve, reject) {
            cordova.exec(resolve, reject, "SecureStorage", "set", [self.service, key, value]);
        });
    
        promise.then(success, error);
        return promise;
    },

    remove: function(success, error, key) {
        var self = this;
        var promise = new ESP6Promise(function(resolve, reject) {
            cordova.exec(resolve, reject, "SecureStorage", "remove", [self.service, key]);
        });
    
        promise.then(success, error);
        return promise;
    }
};

var SecureStorageAndroid = function (success, error, service) {
    this.service = service;
    cordova.exec(success, error, "SecureStorage", "init", [this.service]);
    return this;
};

SecureStorageAndroid.prototype = {

    get: function (success, error, key) {
        var promise = new ESP6Promise(function(resolve, reject) {
            var payload = localStorage.getItem('_SS_' + key);
            if (!payload) {
                reject('Key "' + key + '"not found.');
                return;
            }
            try {
                payload = JSON.parse(payload);
                var AESKey = payload.key;
                cordova.exec(
                    function (AESKey) {
                        try {
                            AESKey = sjcl_ss.codec.base64.toBits(AESKey);
                            var value = sjcl_ss.decrypt(AESKey, payload.value);
                            resolve(value);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    reject, "SecureStorage", "decrypt", [AESKey]);
            } catch (e) {
                reject(e);
            }
        });
        
        promise.then(success, error);
        return promise;
    },

    set: function (success, error, key, value) {
        var self = this;
        var promise = new ESP6Promise(function(resolve, reject) {
            var AESKey = sjcl_ss.random.randomWords(8);
            _AES_PARAM.adata = self.service;
            value = sjcl_ss.encrypt(AESKey, value, _AES_PARAM);

            // Ecrypt the AES key
            cordova.exec(
                function (encKey) {
                    localStorage.setItem('_SS_' + key, JSON.stringify({key: encKey, value: value}));
                    resolve(key);
                },
                function (err) {
                    reject(err);
                },
                "SecureStorage", "encrypt", [sjcl_ss.codec.base64.fromBits(AESKey)]);
        });

        promise.then(success, error);
        return promise;
    },

    remove: function(success, error, key) {
        var promise = new ESP6Promise(function(resolve, reject) {
            localStorage.removeItem('_SS_' + key);
            resolve(key);
        });

        promise.then(success, error);
        return promise;
    }
};


var SecureStorageBrowser = function (success, error, service) {
    this.service = service;
    setTimeout(success, 0);
    return this;
};

SecureStorageBrowser.prototype = {

    get: function (success, error, key) {
        var promise = new ESP6Promise(function(resolve, reject) {
            var value = localStorage.getItem('_SS_' + key);
            if (!value) {
                reject('Key "' + key + '"not found.');
            } else {
                resolve(value);
            }
        });

        promise.then(success, error);
        return promise;
    },

    set: function (success, error, key, value) {
        var promise = new ESP6Promise(function(resolve, reject) {
            localStorage.setItem('_SS_' + key, value);
            resolve(key);
        });

        promise.then(success, error);
        return promise;
    },

    remove: function(success, error, key) {
        var promise = new ESP6Promise(function(resolve, reject) {
            localStorage.removeItem('_SS_' + key);
            resolve(key);
        });

        promise.then(success, error);
        return promise;
    }
};



var SecureStorage;

switch(cordova.platformId) {

    case 'ios':
        SecureStorage = SecureStorageiOS;
        break;

    case 'android':
        SecureStorage = SecureStorageAndroid;
        break;

    case 'browser':
        SecureStorage = SecureStorageBrowser;
        break;

    default:
        SecureStorage = null;
}

if (!cordova.plugins) {
    cordova.plugins = {};
}

if (!cordova.plugins.SecureStorage) {
    cordova.plugins.SecureStorage = SecureStorage;
}

if (typeof module != 'undefined' && module.exports) {
  module.exports = SecureStorage;
}
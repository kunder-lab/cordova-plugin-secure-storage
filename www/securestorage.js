var sjcl_ss = cordova.require('cordova-plugin-secure-storage.sjcl_ss');
var ESP6Promise = cordova.require('cordova-plugin-secure-storage.es6-promise').Promise;
var _AES_PARAM = {
    ks: 256,
    ts: 128,
    mode: 'ccm',
    cipher: 'aes'
 };

var _checkCallbacks = function (success, error) {

    if (typeof success !== "function")  {
        console.log("SecureStorage failure: success callback parameter must be a function");
        return false;
    }

    if (typeof error !== "function") {
        console.log("SecureStorage failure: error callback parameter must be a function");
        return false;
    }

    return true;
};

var SecureStorageiOS = function (success, error, service) {
    var _success = function(){};
    var _service = service;

    if('function' === typeof success) {
        _success = success;
    }
    else if('string' === typeof success) {
        _service = success;
    }

    this.service = _service;
    setTimeout(_success, 0);
    return this;
};

SecureStorageiOS.prototype = {

    get: function (success, error, key) {
        var self = this;
        var _key = key;
        var _hasCalllbacks = true;

        if('string' === typeof success) {
            _key = success;
            _hasCalllbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            cordova.exec(resolve, reject, "SecureStorage", "get", [self.service, _key]);
        });
        
        if(_hasCalllbacks) {
            promise.then(success, error);
        }    
        return promise;
    },

    set: function (success, error, key, value) {
        var self = this;
        var _key = key;
        var _value = value;
        var _hasCalllbacks = true;

        if('string' === typeof success && 'function' !== typeof error && 'undefined' !== typeof error && !!error) {
            _key = success;
            _value = error;
            _hasCalllbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            cordova.exec(resolve, reject, "SecureStorage", "set", [self.service, _key, _value]);
        });
    
        if(_hasCalllbacks) {
            promise.then(success, error);
        }  
        return promise;
    },

    remove: function(success, error, key) {
        var self = this;
        var _key = key;
        var _hasCalllbacks = true;

        if('string' === typeof success) {
            _key = success;
            _hasCalllbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            cordova.exec(resolve, reject, "SecureStorage", "remove", [self.service, _key]);
        });
    
        if(_hasCalllbacks) {
            promise.then(success, error);
        }
        return promise;
    }
};

var SecureStorageAndroid = function (success, error, service) {
    var _success = function(){};
    var _error = function(){};
    var _service = service;

    if('function' === typeof success) {
        _success = success;
    }
    else if('string' === typeof success) {
        _service = success;
    }

    if('function' === typeof error) {
        _error = error;
    }

    this.service = _service;
    cordova.exec(_success, _error, "SecureStorage", "init", [_service]);
    return this;
};

SecureStorageAndroid.prototype = {

    get: function (success, error, key) {
        var _key = key;
        var _hasCalllbacks = true;

        if('string' === typeof success) {
            _key = success;
            _hasCalllbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            var payload = localStorage.getItem('_SS_' + _key);
            if (!payload) {
                reject('Key "' + _key + '"not found.');
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
                        } 
                        catch (e) {
                            reject(e);
                        }
                    },
                    reject, "SecureStorage", "decrypt", [AESKey]);
            } 
            catch (e) {
                reject(e);
            }
        });
        
        if(_hasCalllbacks) {
            promise.then(success, error);
        }
        return promise;
    },

    set: function (success, error, key, value) {
        var self = this;
        var _key = key;
        var _value = value;
        var _hasCalllbacks = true;

        if('string' === typeof success && 'function' !== typeof error && 'undefined' !== typeof error && !!error) {
            _key = success;
            _value = error;
            _hasCalllbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            var AESKey = sjcl_ss.random.randomWords(8);
            _AES_PARAM.adata = self.service;
            _value = sjcl_ss.encrypt(AESKey, _value, _AES_PARAM);

            // Ecrypt the AES key
            cordova.exec(
                function (encKey) {
                    localStorage.setItem('_SS_' + _key, JSON.stringify({_key: encKey, value: _value}));
                    resolve(_key);
                },
                function (err) {
                    reject(err);
                },
                "SecureStorage", "encrypt", [sjcl_ss.codec.base64.fromBits(AESKey)]);
        });

        if(_hasCalllbacks) {
            promise.then(success, error);
        }
        return promise;
    },

    remove: function(success, error, key) {
        var _key = key;
        var _hasCalllbacks = true;

        if('string' === typeof success) {
            _key = success;
            _hasCalllbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            localStorage.removeItem('_SS_' + _key);
            resolve(_key);
        });

        if(_hasCalllbacks) {
            promise.then(success, error);
        }
        return promise;
    }
};


var SecureStorageBrowser = function (success, error, service) {
    var _success = function(){};
    var _service = service;

    if('function' === typeof success) {
        _success = success;
    }
    else if('string' === typeof success) {
        _service = success;
    }

    this.service = _service;
    setTimeout(_success, 0);
    return this;
};

SecureStorageBrowser.prototype = {

    get: function (success, error, key) {
        var _key = key;
        var _hasCalllbacks = true;

        if('string' === typeof success) {
            _key = success;
            _hasCalllbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            var value = localStorage.getItem('_SS_' + _key);
            if (!value) {
                reject('Key "' + _key + '"not found.');
            } else {
                resolve(value);
            }
        });
        
        if(_hasCalllbacks) {
            promise.then(success, error);
        }
        return promise;
    },

    set: function (success, error, key, value) {
        var _key = key;
        var _value = value;
        var _hasCalllbacks = true;

        if('string' === typeof success && 'function' !== typeof error && 'undefined' !== typeof error && !!error) {
            _key = success;
            _value = error;
            _hasCalllbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            localStorage.setItem('_SS_' + _key, _value);
            resolve(_key);
        });

        if(_hasCalllbacks) {
            promise.then(success, error);
        }
        return promise;
    },

    remove: function(success, error, key) {
        var _key = key;
        var _hasCalllbacks = true;

        if('string' === typeof success) {
            _key = success;
            _hasCalllbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            localStorage.removeItem('_SS_' + _key);
            resolve(_key);
        });
        
        if(_hasCalllbacks) {
            promise.then(success, error);
        }
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecureStorage;
}
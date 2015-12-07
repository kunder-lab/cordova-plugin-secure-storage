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

var SecureStorageAndroid = function (success, error, service, encryptionKey) {
    var _success = function(){};
    var _error = function(error){};
    var _service = service;
	var _encryptionKey = encryptionKey;

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
	this.encryptionKey = _encryptionKey;
    cordova.exec(_success, _error, "SecureStorage", "init", [this.service, this.encryptionKey]);
    return this;
};

SecureStorageAndroid.prototype = {
    get: function (success, error, key) {
        var self = this;
        var _key = key;
        var _hasCallbacks = true;
        var _success = success;
        var _error = error;

        if('string' === typeof success) {
            _key = success;
            _hasCallbacks = false;
        }

        var promise = new ESP6Promise(function(_success, _error) {
            cordova.exec(_success, _error, "SecureStorage", "get", [_key]);
        });
        
        if(_hasCallbacks) {
            promise.then(_success, _error);
        }    
        return promise;
    },

    set: function (success, error, key, value) {
        var self = this;
        var _key = key;
        var _value = value;
        var _hasCallbacks = true;
        var _success = success;
        var _error = error;

        if('string' === typeof success && 'function' !== typeof error && 'undefined' !== typeof error && !!error) {
            _key = success;
            _value = error;
            _hasCallbacks = false;
        }

        var promise = new ESP6Promise(function(_success, _error) {
            cordova.exec(_success, _error, "SecureStorage", "set", [_key, _value]);
        });
    
        if(_hasCallbacks) {
            promise.then(_success, _error);
        }  
        return promise;
    },

    remove: function(success, error, key) {
        var self = this;
        var _key = key;
        var _hasCallbacks = true;
        var _success = success;
        var _error = error;

        if('string' === typeof success) {
            _key = success;
            _hasCallbacks = false;
        }

        var promise = new ESP6Promise(function(_success, _error) {
            cordova.exec(_success, _error, "SecureStorage", "remove", [_key]);
        });
    
        if(_hasCallbacks) {
            promise.then(_success, _error);
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
        var _hasCallbacks = true;

        if('string' === typeof success) {
            _key = success;
            _hasCallbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            var value = localStorage.getItem('_SS_' + _key);
            if (!value) {
                reject('Key "' + _key + '"not found.');
            } else {
                resolve(value);
            }
        });
        
        if(_hasCallbacks) {
            promise.then(success, error);
        }
        return promise;
    },

    set: function (success, error, key, value) {
        var _key = key;
        var _value = value;
        var _hasCallbacks = true;

        if('string' === typeof success && 'function' !== typeof error && 'undefined' !== typeof error && !!error) {
            _key = success;
            _value = error;
            _hasCallbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            localStorage.setItem('_SS_' + _key, _value);
            resolve(_key);
        });

        if(_hasCallbacks) {
            promise.then(success, error);
        }
        return promise;
    },

    remove: function(success, error, key) {
        var _key = key;
        var _hasCallbacks = true;

        if('string' === typeof success) {
            _key = success;
            _hasCallbacks = false;
        }

        var promise = new ESP6Promise(function(resolve, reject) {
            localStorage.removeItem('_SS_' + _key);
            resolve(_key);
        });
        
        if(_hasCallbacks) {
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
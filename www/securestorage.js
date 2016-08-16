var sjcl_ss = cordova.require('cordova-plugin-secure-storage.sjcl_ss');
var ESP6Promise = cordova.require('cordova-plugin-secure-storage.es6-promise').Promise;

var _rejectOnTimeout = function(callbackError) {
    setTimeout(function() {
        if('function' === typeof callbackError) {
            callbackError({
                code: 'timeout',
                error: 'The request took too long'
            });
        }
    }, SecureStorage.Timeout);
}

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
        var defer = new ESP6Promise.defer();
        var self = this;
        var _key = key;
        var _resolved = false;

        var _success = function(value){
            if(!_resolved) {
                _resolved = true;

                if('function' === typeof success) {
                    success(value);
                };

                defer.resolve(value);
            }
        };
        var _error = function(msg){
            if(!_resolved) {
                _resolved = true;

                if('function' === typeof error) {
                    error(msg);
                }

                defer.reject(msg);
            }
        };

        if('string' === typeof success) {
            _key = success;
        }

        cordova.exec(_success, _error, "SecureStorage", "get", [self.service, _key]);

        _rejectOnTimeout(_error);

        return defer.promise;
    },

    set: function (success, error, key, value) {
        var defer = new ESP6Promise.defer();
        var self = this;
        var _key = key;
        var _value = value;
        var _resolved = false;

        var _success = function(value){
            if(!_resolved) {
                _resolved = true;

                if(!!success && 'function' === typeof success) {
                    success(value);
                };

                defer.resolve(value);
            }
        };

        var _error = function(msg){
            if(!_resolved) {
                _resolved = true;

                if(!!error && 'function' === typeof error) {
                    error(msg);
                }

                defer.reject(msg);
            }
        };

        if(!!success && 'string' === typeof success) {
            _key = success;
        }
        if(!!error && 'string' === typeof error) {
            _value = error;
        }

        cordova.exec(_success, _error, "SecureStorage", "set", [self.service, _key, _value]);

        _rejectOnTimeout(_error);

        return defer.promise;
    },

    remove: function(success, error, key) {
        var defer = new ESP6Promise.defer();
        var self = this;
        var _key = key;
        var _resolved = false;

        var _success = function(value){
            if(!_resolved) {
                _resolved = true;

                if('function' === typeof success) {
                    success(value);
                };

                defer.resolve(value);
            }
        };
        var _error = function(msg){
            if(!_resolved) {
                _resolved = true;

                if('function' === typeof error) {
                    error(msg);
                }

                defer.reject(msg);
            }
        };

        if('string' === typeof success) {
            _key = success;
        }

        cordova.exec(_success, _error, "SecureStorage", "remove", [self.service, _key]);

        _rejectOnTimeout(_error);

        return defer.promise;
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
    else if('string' === typeof error) {
        _encryptionKey = error;
    }

    this.service = _service;
    this.encryptionKey = _encryptionKey;

    cordova.exec(_success, _error, "SecureStorage", "init", [this.service, this.encryptionKey]);

    return this;
};

SecureStorageAndroid.prototype = {
    get: function (success, error, key) {
        var defer = new ESP6Promise.defer();
        var self = this;
        var _key = key;
        var _resolved = false;

        var _success = function(value){
            if(!_resolved) {
                _resolved = true;

                if('function' === typeof success) {
                    success(value);
                };

                defer.resolve(value);
            }
        };

        var _error = function(msg){
            if(!_resolved) {
                _resolved = true;

                if('function' === typeof error) {
                    error(msg);
                }

                defer.reject(msg);
            }
        };

        if('string' === typeof success) {
            _key = success;
        }

        cordova.exec(_success, _error, "SecureStorage", "get", [self.service, _key]);

        _rejectOnTimeout(_error);

        return defer.promise;
    },

    set: function (success, error, key, value) {
        var defer = new ESP6Promise.defer();
        var self = this;
        var _key = key;
        var _value = value;
        var _resolved = false;

        var _success = function(value){
            if(!_resolved) {
                _resolved = true;

                if(!!success && 'function' === typeof success) {
                    success(value);
                };

                defer.resolve(value);
            }
        };
        var _error = function(msg){
            if(!_resolved) {
                _resolved = true;

                if(!!error && 'function' === typeof error) {
                    error(msg);
                }

                defer.reject(msg);
            }
        };

        if(!!success && 'string' === typeof success) {
            _key = success;
        }
        if(!!error && 'string' === typeof error) {
            _value = error;
        }

        cordova.exec(_success, _error, "SecureStorage", "set", [self.service, _key, _value]);

        _rejectOnTimeout(_error);

        return defer.promise;
    },

    remove: function(success, error, key) {
        var defer = new ESP6Promise.defer();
        var self = this;
        var _key = key;
        var _resolved = false;

        var _success = function(value){
            if(!_resolved) {
                _resolved = true;

                if('function' === typeof success) {
                    success(value);
                };

                defer.resolve(value);
            }
        };
        var _error = function(msg){
            if(!_resolved) {
                _resolved = true;

                if('function' === typeof error) {
                    error(msg);
                }

                defer.reject(msg);
            }
        };

        if('string' === typeof success) {
            _key = success;
        }

        cordova.exec(_success, _error, "SecureStorage", "remove", [self.service, _key]);

        _rejectOnTimeout(_error);

        return defer.promise;
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

SecureStorage.Timeout = 3000;

if (!cordova.plugins) {
    cordova.plugins = {};
}

if (!cordova.plugins.SecureStorage) {
    cordova.plugins.SecureStorage = SecureStorage;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecureStorage;
}
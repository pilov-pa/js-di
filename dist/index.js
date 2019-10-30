"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DI =
/*#__PURE__*/
function () {
  function DI() {
    _classCallCheck(this, DI);

    _defineProperty(this, "services", {});

    _defineProperty(this, "parameters", {});
  }

  _createClass(DI, [{
    key: "add",
    value: function add(name, className) {
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var shared = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var tags = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

      if (_typeof(name) === 'object') {
        if (this.services.hasOwnProperty(name.name)) {
          throw new Error("Service '" + name.name + "' already exists");
        }

        this.services[name.name] = {
          name: name.name,
          className: name["class"],
          args: name.args,
          shared: name.shared,
          tags: name.tags,
          compiled: null
        };
      } else {
        if (this.services.hasOwnProperty(name)) {
          throw new Error("Service '" + name + "' already exists");
        }

        if (!(typeof className === 'function')) {
          throw new Error("Parameter 'className' should be a class constructor");
        }

        this.services[name] = {
          name: name,
          className: className,
          args: args,
          shared: shared,
          tags: tags,
          compiled: null
        };
      }
    }
  }, {
    key: "addMulti",
    value: function addMulti(config) {
      if (!Array.isArray(config)) {
        throw new Error('Config should be an array');
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = config[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var serviceConfig = _step.value;
          this.add(serviceConfig);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "getByTag",
    value: function getByTag(tag) {
      var result = [];

      for (var serviceName in this.services) {
        var service = this.services[serviceName];

        if (service.tags.indexOf(tag) !== -1) {
          result.push(this.resolve(serviceName));
        }
      }

      return result;
    }
  }, {
    key: "remove",
    value: function remove(name) {
      if (typeof this.services[name] === 'undefined') {
        throw new Error("Service '" + name + "' not found");
      }

      delete this.services[name];
    }
  }, {
    key: "has",
    value: function has(name) {
      return !(typeof this.services[name] === 'undefined');
    }
  }, {
    key: "addParameter",
    value: function addParameter(name, value) {
      if (this.parameters.hasOwnProperty(name)) {
        throw new Error("Parameter '" + name + "' already exists");
      }

      this.parameters[name] = value;
    }
  }, {
    key: "addParameters",
    value: function addParameters(parameters) {
      for (var parameterName in parameters) {
        this.addParameter(parameterName, parameters[parameterName]);
      }
    }
  }, {
    key: "getParameter",
    value: function getParameter(parameterName) {
      if (!this.parameters.hasOwnProperty(parameterName)) {
        throw new Error("Parameter '" + parameterName + "' not found");
      }

      return this.parameters[parameterName];
    }
  }, {
    key: "hasParameter",
    value: function hasParameter(parameterName) {
      return this.parameters.hasOwnProperty(parameterName);
    }
  }, {
    key: "removeParameter",
    value: function removeParameter(parameterName) {
      if (!this.parameters.hasOwnProperty(parameterName)) {
        throw new Error("Parameter '" + parameterName + "' not found");
      }

      delete this.parameters[parameterName];
    }
  }, {
    key: "resolve",
    value: function resolve(name) {
      if (!this.services[name]) {
        throw new Error("Service '" + name + "' not found");
      }

      var service = this.services[name];

      if (service.shared && service.compiled !== null) {
        return service.compiled;
      }

      var resolvedArgs = [];

      for (var argIndex in service.args) {
        var arg = service.args[argIndex];
        var resolvedArg = void 0;

        if (typeof arg === 'string') {
          if (arg.indexOf('@') === 0) {
            var processedArgName = arg.substring(1);

            if (!this.parameters.hasOwnProperty(processedArgName)) {
              throw new Error("Parameter '" + processedArgName + "' not found");
            }

            resolvedArg = this.getParameter(processedArgName);
          } else if (arg.indexOf(':') === 0) {
            var _processedArgName = arg.substring(1);

            resolvedArg = this.resolve(_processedArgName);
          } else {
            resolvedArg = arg;
          }
        } else {
          resolvedArg = arg;
        }

        resolvedArgs.push(resolvedArg);
      }

      var result = _construct(service.className, resolvedArgs);

      if (service.shared) {
        service.compiled = result;
      }

      return result;
    }
  }]);

  return DI;
}();

exports["default"] = DI;
//# sourceMappingURL=index.js.map
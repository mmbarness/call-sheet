/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ (function(module) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};

  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };

  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function () {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function (record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
 true ? module.exports : 0);

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

/***/ }),

/***/ "./node_modules/underscore/modules/_baseCreate.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/_baseCreate.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ baseCreate; }
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");

 // Create a naked function reference for surrogate-prototype-swapping.

function ctor() {
  return function () {};
} // An internal function for creating a new object that inherits from another.


function baseCreate(prototype) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__.default)(prototype)) return {};
  if (_setup_js__WEBPACK_IMPORTED_MODULE_1__.nativeCreate) return (0,_setup_js__WEBPACK_IMPORTED_MODULE_1__.nativeCreate)(prototype);
  var Ctor = ctor();
  Ctor.prototype = prototype;
  var result = new Ctor();
  Ctor.prototype = null;
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_baseIteratee.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_baseIteratee.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ baseIteratee; }
/* harmony export */ });
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./identity.js */ "./node_modules/underscore/modules/identity.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./matcher.js */ "./node_modules/underscore/modules/matcher.js");
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./property.js */ "./node_modules/underscore/modules/property.js");
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");






 // An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `_.identity`,
// an arbitrary callback, a property matcher, or a property accessor.

function baseIteratee(value, context, argCount) {
  if (value == null) return _identity_js__WEBPACK_IMPORTED_MODULE_0__.default;
  if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__.default)(value)) return (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_6__.default)(value, context, argCount);
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_2__.default)(value) && !(0,_isArray_js__WEBPACK_IMPORTED_MODULE_3__.default)(value)) return (0,_matcher_js__WEBPACK_IMPORTED_MODULE_4__.default)(value);
  return (0,_property_js__WEBPACK_IMPORTED_MODULE_5__.default)(value);
}

/***/ }),

/***/ "./node_modules/underscore/modules/_cb.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/_cb.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ cb; }
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/underscore/modules/_baseIteratee.js");
/* harmony import */ var _iteratee_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./iteratee.js */ "./node_modules/underscore/modules/iteratee.js");


 // The function we call internally to generate a callback. It invokes
// `_.iteratee` if overridden, otherwise `baseIteratee`.

function cb(value, context, argCount) {
  if (_underscore_js__WEBPACK_IMPORTED_MODULE_0__.default.iteratee !== _iteratee_js__WEBPACK_IMPORTED_MODULE_2__.default) return _underscore_js__WEBPACK_IMPORTED_MODULE_0__.default.iteratee(value, context);
  return (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__.default)(value, context, argCount);
}

/***/ }),

/***/ "./node_modules/underscore/modules/_chainResult.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/_chainResult.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ chainResult; }
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
 // Helper function to continue chaining intermediate results.

function chainResult(instance, obj) {
  return instance._chain ? (0,_underscore_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj).chain() : obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_collectNonEnumProps.js":
/*!*****************************************************************!*\
  !*** ./node_modules/underscore/modules/_collectNonEnumProps.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ collectNonEnumProps; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");


 // Internal helper to create a simple lookup structure.
// `collectNonEnumProps` used to depend on `_.contains`, but this led to
// circular imports. `emulatedSet` is a one-off solution that only works for
// arrays of strings.

function emulatedSet(keys) {
  var hash = {};

  for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;

  return {
    contains: function (key) {
      return hash[key];
    },
    push: function (key) {
      hash[key] = true;
      return keys.push(key);
    }
  };
} // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
// be iterated by `for key in ...` and thus missed. Extends `keys` in place if
// needed.


function collectNonEnumProps(obj, keys) {
  keys = emulatedSet(keys);
  var nonEnumIdx = _setup_js__WEBPACK_IMPORTED_MODULE_0__.nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__.default)(constructor) && constructor.prototype || _setup_js__WEBPACK_IMPORTED_MODULE_0__.ObjProto; // Constructor is a special case.

  var prop = 'constructor';
  if ((0,_has_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj, prop) && !keys.contains(prop)) keys.push(prop);

  while (nonEnumIdx--) {
    prop = _setup_js__WEBPACK_IMPORTED_MODULE_0__.nonEnumerableProps[nonEnumIdx];

    if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
      keys.push(prop);
    }
  }
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createAssigner.js":
/*!************************************************************!*\
  !*** ./node_modules/underscore/modules/_createAssigner.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createAssigner; }
/* harmony export */ });
// An internal function for creating assigner functions.
function createAssigner(keysFunc, defaults) {
  return function (obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;

    for (var index = 1; index < length; index++) {
      var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;

      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!defaults || obj[key] === void 0) obj[key] = source[key];
      }
    }

    return obj;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createEscaper.js":
/*!***********************************************************!*\
  !*** ./node_modules/underscore/modules/_createEscaper.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createEscaper; }
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
 // Internal helper to generate functions for escaping and unescaping strings
// to/from HTML interpolation.

function createEscaper(map) {
  var escaper = function (match) {
    return map[match];
  }; // Regexes for identifying a key that needs to be escaped.


  var source = '(?:' + (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__.default)(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function (string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createIndexFinder.js":
/*!***************************************************************!*\
  !*** ./node_modules/underscore/modules/_createIndexFinder.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createIndexFinder; }
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isNaN_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isNaN.js */ "./node_modules/underscore/modules/isNaN.js");


 // Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.

function createIndexFinder(dir, predicateFind, sortedIndex) {
  return function (array, item, idx) {
    var i = 0,
        length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__.default)(array);

    if (typeof idx == 'number') {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }

    if (item !== item) {
      idx = predicateFind(_setup_js__WEBPACK_IMPORTED_MODULE_1__.slice.call(array, i, length), _isNaN_js__WEBPACK_IMPORTED_MODULE_2__.default);
      return idx >= 0 ? idx + i : -1;
    }

    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }

    return -1;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createPredicateIndexFinder.js":
/*!************************************************************************!*\
  !*** ./node_modules/underscore/modules/_createPredicateIndexFinder.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createPredicateIndexFinder; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");

 // Internal function to generate `_.findIndex` and `_.findLastIndex`.

function createPredicateIndexFinder(dir) {
  return function (array, predicate, context) {
    predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(predicate, context);
    var length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_1__.default)(array);
    var index = dir > 0 ? 0 : length - 1;

    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index;
    }

    return -1;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createReduce.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_createReduce.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createReduce; }
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");


 // Internal helper to create a reducing function, iterating left or right.

function createReduce(dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function (obj, iteratee, memo, initial) {
    var _keys = !(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj) && (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj),
        length = (_keys || obj).length,
        index = dir > 0 ? 0 : length - 1;

    if (!initial) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }

    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }

    return memo;
  };

  return function (obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_2__.default)(iteratee, context, 4), memo, initial);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createSizePropertyCheck.js":
/*!*********************************************************************!*\
  !*** ./node_modules/underscore/modules/_createSizePropertyCheck.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createSizePropertyCheck; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
 // Common internal logic for `isArrayLike` and `isBufferLike`.

function createSizePropertyCheck(getSizeProperty) {
  return function (collection) {
    var sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= _setup_js__WEBPACK_IMPORTED_MODULE_0__.MAX_ARRAY_INDEX;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_deepGet.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/_deepGet.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ deepGet; }
/* harmony export */ });
// Internal function to obtain a nested property in `obj` along `path`.
function deepGet(obj, path) {
  var length = path.length;

  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }

  return length ? obj : void 0;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_escapeMap.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/_escapeMap.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// Internal list of HTML entities for escaping.
/* harmony default export */ __webpack_exports__["default"] = ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
});

/***/ }),

/***/ "./node_modules/underscore/modules/_executeBound.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_executeBound.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ executeBound; }
/* harmony export */ });
/* harmony import */ var _baseCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseCreate.js */ "./node_modules/underscore/modules/_baseCreate.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");

 // Internal function to execute `sourceFunc` bound to `context` with optional
// `args`. Determines whether to execute a function as a constructor or as a
// normal function.

function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self = (0,_baseCreate_js__WEBPACK_IMPORTED_MODULE_0__.default)(sourceFunc.prototype);
  var result = sourceFunc.apply(self, args);
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__.default)(result)) return result;
  return self;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_flatten.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/_flatten.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ flatten; }
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/underscore/modules/isArguments.js");



 // Internal implementation of a recursive `flatten` function.

function flatten(input, depth, strict, output) {
  output = output || [];

  if (!depth && depth !== 0) {
    depth = Infinity;
  } else if (depth <= 0) {
    return output.concat(input);
  }

  var idx = output.length;

  for (var i = 0, length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__.default)(input); i < length; i++) {
    var value = input[i];

    if ((0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__.default)(value) && ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_2__.default)(value) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_3__.default)(value))) {
      // Flatten current level of array or arguments object.
      if (depth > 1) {
        flatten(value, depth - 1, strict, output);
        idx = output.length;
      } else {
        var j = 0,
            len = value.length;

        while (j < len) output[idx++] = value[j++];
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }

  return output;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_getByteLength.js":
/*!***********************************************************!*\
  !*** ./node_modules/underscore/modules/_getByteLength.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shallowProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_shallowProperty.js */ "./node_modules/underscore/modules/_shallowProperty.js");
 // Internal helper to obtain the `byteLength` property of an object.

/* harmony default export */ __webpack_exports__["default"] = ((0,_shallowProperty_js__WEBPACK_IMPORTED_MODULE_0__.default)('byteLength'));

/***/ }),

/***/ "./node_modules/underscore/modules/_getLength.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/_getLength.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shallowProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_shallowProperty.js */ "./node_modules/underscore/modules/_shallowProperty.js");
 // Internal helper to obtain the `length` property of an object.

/* harmony default export */ __webpack_exports__["default"] = ((0,_shallowProperty_js__WEBPACK_IMPORTED_MODULE_0__.default)('length'));

/***/ }),

/***/ "./node_modules/underscore/modules/_group.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/_group.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ group; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");

 // An internal function used for aggregate "group by" operations.

function group(behavior, partition) {
  return function (obj, iteratee, context) {
    var result = partition ? [[], []] : {};
    iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(iteratee, context);
    (0,_each_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj, function (value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_has.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/_has.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ has; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
 // Internal function to check whether `key` is an own property name of `obj`.

function has(obj, key) {
  return obj != null && _setup_js__WEBPACK_IMPORTED_MODULE_0__.hasOwnProperty.call(obj, key);
}

/***/ }),

/***/ "./node_modules/underscore/modules/_hasObjectTag.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_hasObjectTag.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('Object'));

/***/ }),

/***/ "./node_modules/underscore/modules/_isArrayLike.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/_isArrayLike.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createSizePropertyCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createSizePropertyCheck.js */ "./node_modules/underscore/modules/_createSizePropertyCheck.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");

 // Internal helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094

/* harmony default export */ __webpack_exports__["default"] = ((0,_createSizePropertyCheck_js__WEBPACK_IMPORTED_MODULE_0__.default)(_getLength_js__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./node_modules/underscore/modules/_isBufferLike.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_isBufferLike.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createSizePropertyCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createSizePropertyCheck.js */ "./node_modules/underscore/modules/_createSizePropertyCheck.js");
/* harmony import */ var _getByteLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getByteLength.js */ "./node_modules/underscore/modules/_getByteLength.js");

 // Internal helper to determine whether we should spend extensive checks against
// `ArrayBuffer` et al.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createSizePropertyCheck_js__WEBPACK_IMPORTED_MODULE_0__.default)(_getByteLength_js__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./node_modules/underscore/modules/_keyInObj.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/_keyInObj.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ keyInObj; }
/* harmony export */ });
// Internal `_.pick` helper function to determine whether `key` is an enumerable
// property name of `obj`.
function keyInObj(value, key, obj) {
  return key in obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_methodFingerprint.js":
/*!***************************************************************!*\
  !*** ./node_modules/underscore/modules/_methodFingerprint.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ie11fingerprint": function() { return /* binding */ ie11fingerprint; },
/* harmony export */   "mapMethods": function() { return /* binding */ mapMethods; },
/* harmony export */   "weakMapMethods": function() { return /* binding */ weakMapMethods; },
/* harmony export */   "setMethods": function() { return /* binding */ setMethods; }
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");


 // Since the regular `Object.prototype.toString` type tests don't work for
// some types in IE 11, we use a fingerprinting heuristic instead, based
// on the methods. It's not great, but it's the best we got.
// The fingerprint method lists are defined below.

function ie11fingerprint(methods) {
  var length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__.default)(methods);
  return function (obj) {
    if (obj == null) return false; // `Map`, `WeakMap` and `Set` have no enumerable keys.

    var keys = (0,_allKeys_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj);
    if ((0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__.default)(keys)) return false;

    for (var i = 0; i < length; i++) {
      if (!(0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj[methods[i]])) return false;
    } // If we are testing against `WeakMap`, we need to ensure that
    // `obj` doesn't have a `forEach` method in order to distinguish
    // it from a regular `Map`.


    return methods !== weakMapMethods || !(0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj[forEachName]);
  };
} // In the interest of compact minification, we write
// each string in the fingerprints only once.

var forEachName = 'forEach',
    hasName = 'has',
    commonInit = ['clear', 'delete'],
    mapTail = ['get', hasName, 'set']; // `Map`, `WeakMap` and `Set` each have slightly different
// combinations of the above sublists.

var mapMethods = commonInit.concat(forEachName, mapTail),
    weakMapMethods = commonInit.concat(mapTail),
    setMethods = ['add'].concat(commonInit, forEachName, hasName);

/***/ }),

/***/ "./node_modules/underscore/modules/_optimizeCb.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/_optimizeCb.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ optimizeCb; }
/* harmony export */ });
// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;

  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function (value) {
        return func.call(context, value);
      };
    // The 2-argument case is omitted because we’re not using it.

    case 3:
      return function (value, index, collection) {
        return func.call(context, value, index, collection);
      };

    case 4:
      return function (accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }

  return function () {
    return func.apply(context, arguments);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_setup.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/_setup.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VERSION": function() { return /* binding */ VERSION; },
/* harmony export */   "root": function() { return /* binding */ root; },
/* harmony export */   "ArrayProto": function() { return /* binding */ ArrayProto; },
/* harmony export */   "ObjProto": function() { return /* binding */ ObjProto; },
/* harmony export */   "SymbolProto": function() { return /* binding */ SymbolProto; },
/* harmony export */   "push": function() { return /* binding */ push; },
/* harmony export */   "slice": function() { return /* binding */ slice; },
/* harmony export */   "toString": function() { return /* binding */ toString; },
/* harmony export */   "hasOwnProperty": function() { return /* binding */ hasOwnProperty; },
/* harmony export */   "supportsArrayBuffer": function() { return /* binding */ supportsArrayBuffer; },
/* harmony export */   "supportsDataView": function() { return /* binding */ supportsDataView; },
/* harmony export */   "nativeIsArray": function() { return /* binding */ nativeIsArray; },
/* harmony export */   "nativeKeys": function() { return /* binding */ nativeKeys; },
/* harmony export */   "nativeCreate": function() { return /* binding */ nativeCreate; },
/* harmony export */   "nativeIsView": function() { return /* binding */ nativeIsView; },
/* harmony export */   "_isNaN": function() { return /* binding */ _isNaN; },
/* harmony export */   "_isFinite": function() { return /* binding */ _isFinite; },
/* harmony export */   "hasEnumBug": function() { return /* binding */ hasEnumBug; },
/* harmony export */   "nonEnumerableProps": function() { return /* binding */ nonEnumerableProps; },
/* harmony export */   "MAX_ARRAY_INDEX": function() { return /* binding */ MAX_ARRAY_INDEX; }
/* harmony export */ });
// Current version.
var VERSION = '1.13.1'; // Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.

var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || Function('return this')() || {}; // Save bytes in the minified (but not gzipped) version:

var ArrayProto = Array.prototype,
    ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null; // Create quick reference variables for speed access to core prototypes.

var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty; // Modern feature detection.

var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
    supportsDataView = typeof DataView !== 'undefined'; // All **ECMAScript 5+** native function implementations that we hope to use
// are declared here.

var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create,
    nativeIsView = supportsArrayBuffer && ArrayBuffer.isView; // Create references to these builtin functions because we override them.

var _isNaN = isNaN,
    _isFinite = isFinite; // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.

var hasEnumBug = !{
  toString: null
}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // The largest integer that can be represented exactly.

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

/***/ }),

/***/ "./node_modules/underscore/modules/_shallowProperty.js":
/*!*************************************************************!*\
  !*** ./node_modules/underscore/modules/_shallowProperty.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ shallowProperty; }
/* harmony export */ });
// Internal helper to generate a function to obtain property `key` from `obj`.
function shallowProperty(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_stringTagBug.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_stringTagBug.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hasStringTagBug": function() { return /* binding */ hasStringTagBug; },
/* harmony export */   "isIE11": function() { return /* binding */ isIE11; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _hasObjectTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_hasObjectTag.js */ "./node_modules/underscore/modules/_hasObjectTag.js");

 // In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
// In IE 11, the most common among them, this problem also applies to
// `Map`, `WeakMap` and `Set`.

var hasStringTagBug = _setup_js__WEBPACK_IMPORTED_MODULE_0__.supportsDataView && (0,_hasObjectTag_js__WEBPACK_IMPORTED_MODULE_1__.default)(new DataView(new ArrayBuffer(8))),
    isIE11 = typeof Map !== 'undefined' && (0,_hasObjectTag_js__WEBPACK_IMPORTED_MODULE_1__.default)(new Map());

/***/ }),

/***/ "./node_modules/underscore/modules/_tagTester.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/_tagTester.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ tagTester; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
 // Internal function for creating a `toString`-based type tester.

function tagTester(name) {
  var tag = '[object ' + name + ']';
  return function (obj) {
    return _setup_js__WEBPACK_IMPORTED_MODULE_0__.toString.call(obj) === tag;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_toBufferView.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_toBufferView.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toBufferView; }
/* harmony export */ });
/* harmony import */ var _getByteLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getByteLength.js */ "./node_modules/underscore/modules/_getByteLength.js");
 // Internal function to wrap or shallow-copy an ArrayBuffer,
// typed array or DataView to a new view, reusing the buffer.

function toBufferView(bufferSource) {
  return new Uint8Array(bufferSource.buffer || bufferSource, bufferSource.byteOffset || 0, (0,_getByteLength_js__WEBPACK_IMPORTED_MODULE_0__.default)(bufferSource));
}

/***/ }),

/***/ "./node_modules/underscore/modules/_toPath.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/_toPath.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toPath; }
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPath.js */ "./node_modules/underscore/modules/toPath.js");

 // Internal wrapper for `_.toPath` to enable minification.
// Similar to `cb` for `_.iteratee`.

function toPath(path) {
  return _underscore_js__WEBPACK_IMPORTED_MODULE_0__.default.toPath(path);
}

/***/ }),

/***/ "./node_modules/underscore/modules/_unescapeMap.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/_unescapeMap.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _invert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./invert.js */ "./node_modules/underscore/modules/invert.js");
/* harmony import */ var _escapeMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_escapeMap.js */ "./node_modules/underscore/modules/_escapeMap.js");

 // Internal list of HTML entities for unescaping.

/* harmony default export */ __webpack_exports__["default"] = ((0,_invert_js__WEBPACK_IMPORTED_MODULE_0__.default)(_escapeMap_js__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./node_modules/underscore/modules/after.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/after.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ after; }
/* harmony export */ });
// Returns a function that will only be executed on and after the Nth call.
function after(times, func) {
  return function () {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/allKeys.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/allKeys.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ allKeys; }
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _collectNonEnumProps_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_collectNonEnumProps.js */ "./node_modules/underscore/modules/_collectNonEnumProps.js");


 // Retrieve all the enumerable property names of an object.

function allKeys(obj) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj)) return [];
  var keys = [];

  for (var key in obj) keys.push(key); // Ahem, IE < 9.


  if (_setup_js__WEBPACK_IMPORTED_MODULE_1__.hasEnumBug) (0,_collectNonEnumProps_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj, keys);
  return keys;
}

/***/ }),

/***/ "./node_modules/underscore/modules/before.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/before.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ before; }
/* harmony export */ });
// Returns a function that will only be executed up to (but not including) the
// Nth call.
function before(times, func) {
  var memo;
  return function () {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }

    if (times <= 1) func = null;
    return memo;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/bind.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/bind.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _executeBound_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_executeBound.js */ "./node_modules/underscore/modules/_executeBound.js");


 // Create a function bound to a given object (assigning `this`, and arguments,
// optionally).

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (func, context, args) {
  if (!(0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__.default)(func)) throw new TypeError('Bind must be called on a function');
  var bound = (0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (callArgs) {
    return (0,_executeBound_js__WEBPACK_IMPORTED_MODULE_2__.default)(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/bindAll.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/bindAll.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");
/* harmony import */ var _bind_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bind.js */ "./node_modules/underscore/modules/bind.js");


 // Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (obj, keys) {
  keys = (0,_flatten_js__WEBPACK_IMPORTED_MODULE_1__.default)(keys, false, false);
  var index = keys.length;
  if (index < 1) throw new Error('bindAll must be passed function names');

  while (index--) {
    var key = keys[index];
    obj[key] = (0,_bind_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj[key], obj);
  }

  return obj;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/chain.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/chain.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ chain; }
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
 // Start chaining a wrapped Underscore object.

function chain(obj) {
  var instance = (0,_underscore_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj);

  instance._chain = true;
  return instance;
}

/***/ }),

/***/ "./node_modules/underscore/modules/chunk.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/chunk.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ chunk; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
 // Chunk a single array into multiple arrays, each containing `count` or fewer
// items.

function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result = [];
  var i = 0,
      length = array.length;

  while (i < length) {
    result.push(_setup_js__WEBPACK_IMPORTED_MODULE_0__.slice.call(array, i, i += count));
  }

  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/clone.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/clone.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ clone; }
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _extend_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extend.js */ "./node_modules/underscore/modules/extend.js");


 // Create a (shallow-cloned) duplicate of an object.

function clone(obj) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj)) return obj;
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj) ? obj.slice() : (0,_extend_js__WEBPACK_IMPORTED_MODULE_2__.default)({}, obj);
}

/***/ }),

/***/ "./node_modules/underscore/modules/compact.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/compact.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ compact; }
/* harmony export */ });
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");
 // Trim out all falsy values from an array.

function compact(array) {
  return (0,_filter_js__WEBPACK_IMPORTED_MODULE_0__.default)(array, Boolean);
}

/***/ }),

/***/ "./node_modules/underscore/modules/compose.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/compose.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ compose; }
/* harmony export */ });
// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function () {
    var i = start;
    var result = args[start].apply(this, arguments);

    while (i--) result = args[i].call(this, result);

    return result;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/constant.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/constant.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ constant; }
/* harmony export */ });
// Predicate-generating function. Often useful outside of Underscore.
function constant(value) {
  return function () {
    return value;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/contains.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/contains.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ contains; }
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _indexOf_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./indexOf.js */ "./node_modules/underscore/modules/indexOf.js");


 // Determine if the array or object contains a given item (using `===`).

function contains(obj, item, fromIndex, guard) {
  if (!(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj)) obj = (0,_values_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj);
  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
  return (0,_indexOf_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj, item, fromIndex) >= 0;
}

/***/ }),

/***/ "./node_modules/underscore/modules/countBy.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/countBy.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_group.js */ "./node_modules/underscore/modules/_group.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");

 // Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.

/* harmony default export */ __webpack_exports__["default"] = ((0,_group_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (result, value, key) {
  if ((0,_has_js__WEBPACK_IMPORTED_MODULE_1__.default)(result, key)) result[key]++;else result[key] = 1;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/create.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/create.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ create; }
/* harmony export */ });
/* harmony import */ var _baseCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseCreate.js */ "./node_modules/underscore/modules/_baseCreate.js");
/* harmony import */ var _extendOwn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extendOwn.js */ "./node_modules/underscore/modules/extendOwn.js");

 // Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.

function create(prototype, props) {
  var result = (0,_baseCreate_js__WEBPACK_IMPORTED_MODULE_0__.default)(prototype);
  if (props) (0,_extendOwn_js__WEBPACK_IMPORTED_MODULE_1__.default)(result, props);
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/debounce.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/debounce.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ debounce; }
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _now_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./now.js */ "./node_modules/underscore/modules/now.js");

 // When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.

function debounce(func, wait, immediate) {
  var timeout, previous, args, result, context;

  var later = function () {
    var passed = (0,_now_js__WEBPACK_IMPORTED_MODULE_1__.default)() - previous;

    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args); // This check is needed because `func` can recursively invoke `debounced`.

      if (!timeout) args = context = null;
    }
  };

  var debounced = (0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (_args) {
    context = this;
    args = _args;
    previous = (0,_now_js__WEBPACK_IMPORTED_MODULE_1__.default)();

    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result = func.apply(context, args);
    }

    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  };

  return debounced;
}

/***/ }),

/***/ "./node_modules/underscore/modules/defaults.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/defaults.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createAssigner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createAssigner.js */ "./node_modules/underscore/modules/_createAssigner.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");

 // Fill in a given object with default properties.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createAssigner_js__WEBPACK_IMPORTED_MODULE_0__.default)(_allKeys_js__WEBPACK_IMPORTED_MODULE_1__.default, true));

/***/ }),

/***/ "./node_modules/underscore/modules/defer.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/defer.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _partial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./partial.js */ "./node_modules/underscore/modules/partial.js");
/* harmony import */ var _delay_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./delay.js */ "./node_modules/underscore/modules/delay.js");
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");


 // Defers a function, scheduling it to run after the current call stack has
// cleared.

/* harmony default export */ __webpack_exports__["default"] = ((0,_partial_js__WEBPACK_IMPORTED_MODULE_0__.default)(_delay_js__WEBPACK_IMPORTED_MODULE_1__.default, _underscore_js__WEBPACK_IMPORTED_MODULE_2__.default, 1));

/***/ }),

/***/ "./node_modules/underscore/modules/delay.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/delay.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
 // Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
}));

/***/ }),

/***/ "./node_modules/underscore/modules/difference.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/difference.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");



 // Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (array, rest) {
  rest = (0,_flatten_js__WEBPACK_IMPORTED_MODULE_1__.default)(rest, true, true);
  return (0,_filter_js__WEBPACK_IMPORTED_MODULE_2__.default)(array, function (value) {
    return !(0,_contains_js__WEBPACK_IMPORTED_MODULE_3__.default)(rest, value);
  });
}));

/***/ }),

/***/ "./node_modules/underscore/modules/each.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/each.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ each; }
/* harmony export */ });
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");


 // The cornerstone for collection functions, an `each`
// implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.

function each(obj, iteratee, context) {
  iteratee = (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_0__.default)(iteratee, context);
  var i, length;

  if ((0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj);

    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee(obj[_keys[i]], _keys[i], obj);
    }
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/escape.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/escape.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createEscaper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createEscaper.js */ "./node_modules/underscore/modules/_createEscaper.js");
/* harmony import */ var _escapeMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_escapeMap.js */ "./node_modules/underscore/modules/_escapeMap.js");

 // Function for escaping strings to HTML interpolation.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createEscaper_js__WEBPACK_IMPORTED_MODULE_0__.default)(_escapeMap_js__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./node_modules/underscore/modules/every.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/every.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ every; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");


 // Determine whether all of the elements pass a truth test.

function every(obj, predicate, context) {
  predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(predicate, context);

  var _keys = !(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj) && (0,_keys_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj),
      length = (_keys || obj).length;

  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }

  return true;
}

/***/ }),

/***/ "./node_modules/underscore/modules/extend.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/extend.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createAssigner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createAssigner.js */ "./node_modules/underscore/modules/_createAssigner.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");

 // Extend a given object with all the properties in passed-in object(s).

/* harmony default export */ __webpack_exports__["default"] = ((0,_createAssigner_js__WEBPACK_IMPORTED_MODULE_0__.default)(_allKeys_js__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./node_modules/underscore/modules/extendOwn.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/extendOwn.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createAssigner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createAssigner.js */ "./node_modules/underscore/modules/_createAssigner.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");

 // Assigns a given object with all the own properties in the passed-in
// object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

/* harmony default export */ __webpack_exports__["default"] = ((0,_createAssigner_js__WEBPACK_IMPORTED_MODULE_0__.default)(_keys_js__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./node_modules/underscore/modules/filter.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/filter.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ filter; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");

 // Return all the elements that pass a truth test.

function filter(obj, predicate, context) {
  var results = [];
  predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(predicate, context);
  (0,_each_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj, function (value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}

/***/ }),

/***/ "./node_modules/underscore/modules/find.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/find.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ find; }
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _findIndex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./findIndex.js */ "./node_modules/underscore/modules/findIndex.js");
/* harmony import */ var _findKey_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./findKey.js */ "./node_modules/underscore/modules/findKey.js");


 // Return the first value which passes a truth test.

function find(obj, predicate, context) {
  var keyFinder = (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj) ? _findIndex_js__WEBPACK_IMPORTED_MODULE_1__.default : _findKey_js__WEBPACK_IMPORTED_MODULE_2__.default;
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}

/***/ }),

/***/ "./node_modules/underscore/modules/findIndex.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/findIndex.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createPredicateIndexFinder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createPredicateIndexFinder.js */ "./node_modules/underscore/modules/_createPredicateIndexFinder.js");
 // Returns the first index on an array-like that passes a truth test.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createPredicateIndexFinder_js__WEBPACK_IMPORTED_MODULE_0__.default)(1));

/***/ }),

/***/ "./node_modules/underscore/modules/findKey.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/findKey.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ findKey; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");

 // Returns the first key on an object that passes a truth test.

function findKey(obj, predicate, context) {
  predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(predicate, context);

  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj),
      key;

  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}

/***/ }),

/***/ "./node_modules/underscore/modules/findLastIndex.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/findLastIndex.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createPredicateIndexFinder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createPredicateIndexFinder.js */ "./node_modules/underscore/modules/_createPredicateIndexFinder.js");
 // Returns the last index on an array-like that passes a truth test.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createPredicateIndexFinder_js__WEBPACK_IMPORTED_MODULE_0__.default)(-1));

/***/ }),

/***/ "./node_modules/underscore/modules/findWhere.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/findWhere.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ findWhere; }
/* harmony export */ });
/* harmony import */ var _find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./find.js */ "./node_modules/underscore/modules/find.js");
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matcher.js */ "./node_modules/underscore/modules/matcher.js");

 // Convenience version of a common use case of `_.find`: getting the first
// object containing specific `key:value` pairs.

function findWhere(obj, attrs) {
  return (0,_find_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj, (0,_matcher_js__WEBPACK_IMPORTED_MODULE_1__.default)(attrs));
}

/***/ }),

/***/ "./node_modules/underscore/modules/first.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/first.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ first; }
/* harmony export */ });
/* harmony import */ var _initial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./initial.js */ "./node_modules/underscore/modules/initial.js");
 // Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `_.map`.

function first(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[0];
  return (0,_initial_js__WEBPACK_IMPORTED_MODULE_0__.default)(array, array.length - n);
}

/***/ }),

/***/ "./node_modules/underscore/modules/flatten.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/flatten.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ flatten; }
/* harmony export */ });
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");
 // Flatten out an array, either recursively (by default), or up to `depth`.
// Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.

function flatten(array, depth) {
  return (0,_flatten_js__WEBPACK_IMPORTED_MODULE_0__.default)(array, depth, false);
}

/***/ }),

/***/ "./node_modules/underscore/modules/functions.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/functions.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ functions; }
/* harmony export */ });
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
 // Return a sorted list of the function names available on the object.

function functions(obj) {
  var names = [];

  for (var key in obj) {
    if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj[key])) names.push(key);
  }

  return names.sort();
}

/***/ }),

/***/ "./node_modules/underscore/modules/get.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/get.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ get; }
/* harmony export */ });
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");
/* harmony import */ var _deepGet_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_deepGet.js */ "./node_modules/underscore/modules/_deepGet.js");
/* harmony import */ var _isUndefined_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isUndefined.js */ "./node_modules/underscore/modules/isUndefined.js");


 // Get the value of the (deep) property on `path` from `object`.
// If any property in `path` does not exist or if the value is
// `undefined`, return `defaultValue` instead.
// The `path` is normalized through `_.toPath`.

function get(object, path, defaultValue) {
  var value = (0,_deepGet_js__WEBPACK_IMPORTED_MODULE_1__.default)(object, (0,_toPath_js__WEBPACK_IMPORTED_MODULE_0__.default)(path));
  return (0,_isUndefined_js__WEBPACK_IMPORTED_MODULE_2__.default)(value) ? defaultValue : value;
}

/***/ }),

/***/ "./node_modules/underscore/modules/groupBy.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/groupBy.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_group.js */ "./node_modules/underscore/modules/_group.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");

 // Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.

/* harmony default export */ __webpack_exports__["default"] = ((0,_group_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (result, value, key) {
  if ((0,_has_js__WEBPACK_IMPORTED_MODULE_1__.default)(result, key)) result[key].push(value);else result[key] = [value];
}));

/***/ }),

/***/ "./node_modules/underscore/modules/has.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/has.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ has; }
/* harmony export */ });
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");

 // Shortcut function for checking if an object has a given property directly on
// itself (in other words, not on a prototype). Unlike the internal `has`
// function, this public version can also traverse nested properties.

function has(obj, path) {
  path = (0,_toPath_js__WEBPACK_IMPORTED_MODULE_1__.default)(path);
  var length = path.length;

  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (!(0,_has_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj, key)) return false;
    obj = obj[key];
  }

  return !!length;
}

/***/ }),

/***/ "./node_modules/underscore/modules/identity.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/identity.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ identity; }
/* harmony export */ });
// Keep the identity function around for default iteratees.
function identity(value) {
  return value;
}

/***/ }),

/***/ "./node_modules/underscore/modules/index-all.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/index-all.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* reexport safe */ _index_default_js__WEBPACK_IMPORTED_MODULE_0__.default; },
/* harmony export */   "VERSION": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.VERSION; },
/* harmony export */   "after": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.after; },
/* harmony export */   "all": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.all; },
/* harmony export */   "allKeys": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.allKeys; },
/* harmony export */   "any": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.any; },
/* harmony export */   "assign": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.assign; },
/* harmony export */   "before": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.before; },
/* harmony export */   "bind": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.bind; },
/* harmony export */   "bindAll": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.bindAll; },
/* harmony export */   "chain": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.chain; },
/* harmony export */   "chunk": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.chunk; },
/* harmony export */   "clone": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.clone; },
/* harmony export */   "collect": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.collect; },
/* harmony export */   "compact": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.compact; },
/* harmony export */   "compose": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.compose; },
/* harmony export */   "constant": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.constant; },
/* harmony export */   "contains": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.contains; },
/* harmony export */   "countBy": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.countBy; },
/* harmony export */   "create": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.create; },
/* harmony export */   "debounce": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.debounce; },
/* harmony export */   "defaults": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.defaults; },
/* harmony export */   "defer": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.defer; },
/* harmony export */   "delay": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.delay; },
/* harmony export */   "detect": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.detect; },
/* harmony export */   "difference": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.difference; },
/* harmony export */   "drop": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.drop; },
/* harmony export */   "each": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.each; },
/* harmony export */   "escape": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.escape; },
/* harmony export */   "every": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.every; },
/* harmony export */   "extend": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.extend; },
/* harmony export */   "extendOwn": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.extendOwn; },
/* harmony export */   "filter": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.filter; },
/* harmony export */   "find": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.find; },
/* harmony export */   "findIndex": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.findIndex; },
/* harmony export */   "findKey": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.findKey; },
/* harmony export */   "findLastIndex": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.findLastIndex; },
/* harmony export */   "findWhere": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.findWhere; },
/* harmony export */   "first": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.first; },
/* harmony export */   "flatten": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.flatten; },
/* harmony export */   "foldl": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.foldl; },
/* harmony export */   "foldr": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.foldr; },
/* harmony export */   "forEach": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.forEach; },
/* harmony export */   "functions": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.functions; },
/* harmony export */   "get": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.get; },
/* harmony export */   "groupBy": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.groupBy; },
/* harmony export */   "has": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.has; },
/* harmony export */   "head": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.head; },
/* harmony export */   "identity": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.identity; },
/* harmony export */   "include": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.include; },
/* harmony export */   "includes": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.includes; },
/* harmony export */   "indexBy": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.indexBy; },
/* harmony export */   "indexOf": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.indexOf; },
/* harmony export */   "initial": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.initial; },
/* harmony export */   "inject": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.inject; },
/* harmony export */   "intersection": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.intersection; },
/* harmony export */   "invert": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.invert; },
/* harmony export */   "invoke": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.invoke; },
/* harmony export */   "isArguments": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isArguments; },
/* harmony export */   "isArray": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isArray; },
/* harmony export */   "isArrayBuffer": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer; },
/* harmony export */   "isBoolean": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isBoolean; },
/* harmony export */   "isDataView": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isDataView; },
/* harmony export */   "isDate": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isDate; },
/* harmony export */   "isElement": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isElement; },
/* harmony export */   "isEmpty": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isEmpty; },
/* harmony export */   "isEqual": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isEqual; },
/* harmony export */   "isError": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isError; },
/* harmony export */   "isFinite": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isFinite; },
/* harmony export */   "isFunction": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isFunction; },
/* harmony export */   "isMap": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isMap; },
/* harmony export */   "isMatch": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isMatch; },
/* harmony export */   "isNaN": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isNaN; },
/* harmony export */   "isNull": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isNull; },
/* harmony export */   "isNumber": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isNumber; },
/* harmony export */   "isObject": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isObject; },
/* harmony export */   "isRegExp": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isRegExp; },
/* harmony export */   "isSet": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isSet; },
/* harmony export */   "isString": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isString; },
/* harmony export */   "isSymbol": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isSymbol; },
/* harmony export */   "isTypedArray": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isTypedArray; },
/* harmony export */   "isUndefined": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined; },
/* harmony export */   "isWeakMap": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isWeakMap; },
/* harmony export */   "isWeakSet": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isWeakSet; },
/* harmony export */   "iteratee": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.iteratee; },
/* harmony export */   "keys": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.keys; },
/* harmony export */   "last": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.last; },
/* harmony export */   "lastIndexOf": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.lastIndexOf; },
/* harmony export */   "map": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.map; },
/* harmony export */   "mapObject": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.mapObject; },
/* harmony export */   "matcher": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.matcher; },
/* harmony export */   "matches": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.matches; },
/* harmony export */   "max": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.max; },
/* harmony export */   "memoize": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.memoize; },
/* harmony export */   "methods": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.methods; },
/* harmony export */   "min": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.min; },
/* harmony export */   "mixin": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.mixin; },
/* harmony export */   "negate": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.negate; },
/* harmony export */   "noop": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.noop; },
/* harmony export */   "now": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.now; },
/* harmony export */   "object": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.object; },
/* harmony export */   "omit": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.omit; },
/* harmony export */   "once": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.once; },
/* harmony export */   "pairs": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.pairs; },
/* harmony export */   "partial": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.partial; },
/* harmony export */   "partition": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.partition; },
/* harmony export */   "pick": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.pick; },
/* harmony export */   "pluck": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.pluck; },
/* harmony export */   "property": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.property; },
/* harmony export */   "propertyOf": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf; },
/* harmony export */   "random": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.random; },
/* harmony export */   "range": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.range; },
/* harmony export */   "reduce": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.reduce; },
/* harmony export */   "reduceRight": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.reduceRight; },
/* harmony export */   "reject": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.reject; },
/* harmony export */   "rest": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.rest; },
/* harmony export */   "restArguments": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.restArguments; },
/* harmony export */   "result": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.result; },
/* harmony export */   "sample": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.sample; },
/* harmony export */   "select": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.select; },
/* harmony export */   "shuffle": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.shuffle; },
/* harmony export */   "size": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.size; },
/* harmony export */   "some": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.some; },
/* harmony export */   "sortBy": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.sortBy; },
/* harmony export */   "sortedIndex": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.sortedIndex; },
/* harmony export */   "tail": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.tail; },
/* harmony export */   "take": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.take; },
/* harmony export */   "tap": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.tap; },
/* harmony export */   "template": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.template; },
/* harmony export */   "templateSettings": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.templateSettings; },
/* harmony export */   "throttle": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.throttle; },
/* harmony export */   "times": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.times; },
/* harmony export */   "toArray": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.toArray; },
/* harmony export */   "toPath": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.toPath; },
/* harmony export */   "transpose": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.transpose; },
/* harmony export */   "unescape": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.unescape; },
/* harmony export */   "union": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.union; },
/* harmony export */   "uniq": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.uniq; },
/* harmony export */   "unique": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.unique; },
/* harmony export */   "uniqueId": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.uniqueId; },
/* harmony export */   "unzip": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.unzip; },
/* harmony export */   "values": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.values; },
/* harmony export */   "where": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.where; },
/* harmony export */   "without": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.without; },
/* harmony export */   "wrap": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.wrap; },
/* harmony export */   "zip": function() { return /* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.zip; }
/* harmony export */ });
/* harmony import */ var _index_default_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index-default.js */ "./node_modules/underscore/modules/index-default.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ "./node_modules/underscore/modules/index.js");
// ESM Exports
// ===========
// This module is the package entry point for ES module users. In other words,
// it is the module they are interfacing with when they import from the whole
// package instead of from a submodule, like this:
//
// ```js
// import { map } from 'underscore';
// ```
//
// The difference with `./index-default`, which is the package entry point for
// CommonJS, AMD and UMD users, is purely technical. In ES modules, named and
// default exports are considered to be siblings, so when you have a default
// export, its properties are not automatically available as named exports. For
// this reason, we re-export the named exports in addition to providing the same
// default export as in `./index-default`.



/***/ }),

/***/ "./node_modules/underscore/modules/index-default.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/index-default.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/underscore/modules/index.js");
// Default Export
// ==============
// In this module, we mix our bundled exports into the `_` object and export
// the result. This is analogous to setting `module.exports = _` in CommonJS.
// Hence, this module is also the entry point of our UMD bundle and the package
// entry point for CommonJS and AMD users. In other words, this is (the source
// of) the module you are interfacing with when you do any of the following:
//
// ```js
// // CommonJS
// var _ = require('underscore');
//
// // AMD
// define(['underscore'], function(_) {...});
//
// // UMD in the browser
// // _ is available as a global variable
// ```

 // Add all of the Underscore functions to the wrapper object.

var _ = (0,_index_js__WEBPACK_IMPORTED_MODULE_0__.mixin)(_index_js__WEBPACK_IMPORTED_MODULE_0__); // Legacy Node.js API.


_._ = _; // Export the Underscore API.

/* harmony default export */ __webpack_exports__["default"] = (_);

/***/ }),

/***/ "./node_modules/underscore/modules/index.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VERSION": function() { return /* reexport safe */ _setup_js__WEBPACK_IMPORTED_MODULE_0__.VERSION; },
/* harmony export */   "restArguments": function() { return /* reexport safe */ _restArguments_js__WEBPACK_IMPORTED_MODULE_1__.default; },
/* harmony export */   "isObject": function() { return /* reexport safe */ _isObject_js__WEBPACK_IMPORTED_MODULE_2__.default; },
/* harmony export */   "isNull": function() { return /* reexport safe */ _isNull_js__WEBPACK_IMPORTED_MODULE_3__.default; },
/* harmony export */   "isUndefined": function() { return /* reexport safe */ _isUndefined_js__WEBPACK_IMPORTED_MODULE_4__.default; },
/* harmony export */   "isBoolean": function() { return /* reexport safe */ _isBoolean_js__WEBPACK_IMPORTED_MODULE_5__.default; },
/* harmony export */   "isElement": function() { return /* reexport safe */ _isElement_js__WEBPACK_IMPORTED_MODULE_6__.default; },
/* harmony export */   "isString": function() { return /* reexport safe */ _isString_js__WEBPACK_IMPORTED_MODULE_7__.default; },
/* harmony export */   "isNumber": function() { return /* reexport safe */ _isNumber_js__WEBPACK_IMPORTED_MODULE_8__.default; },
/* harmony export */   "isDate": function() { return /* reexport safe */ _isDate_js__WEBPACK_IMPORTED_MODULE_9__.default; },
/* harmony export */   "isRegExp": function() { return /* reexport safe */ _isRegExp_js__WEBPACK_IMPORTED_MODULE_10__.default; },
/* harmony export */   "isError": function() { return /* reexport safe */ _isError_js__WEBPACK_IMPORTED_MODULE_11__.default; },
/* harmony export */   "isSymbol": function() { return /* reexport safe */ _isSymbol_js__WEBPACK_IMPORTED_MODULE_12__.default; },
/* harmony export */   "isArrayBuffer": function() { return /* reexport safe */ _isArrayBuffer_js__WEBPACK_IMPORTED_MODULE_13__.default; },
/* harmony export */   "isDataView": function() { return /* reexport safe */ _isDataView_js__WEBPACK_IMPORTED_MODULE_14__.default; },
/* harmony export */   "isArray": function() { return /* reexport safe */ _isArray_js__WEBPACK_IMPORTED_MODULE_15__.default; },
/* harmony export */   "isFunction": function() { return /* reexport safe */ _isFunction_js__WEBPACK_IMPORTED_MODULE_16__.default; },
/* harmony export */   "isArguments": function() { return /* reexport safe */ _isArguments_js__WEBPACK_IMPORTED_MODULE_17__.default; },
/* harmony export */   "isFinite": function() { return /* reexport safe */ _isFinite_js__WEBPACK_IMPORTED_MODULE_18__.default; },
/* harmony export */   "isNaN": function() { return /* reexport safe */ _isNaN_js__WEBPACK_IMPORTED_MODULE_19__.default; },
/* harmony export */   "isTypedArray": function() { return /* reexport safe */ _isTypedArray_js__WEBPACK_IMPORTED_MODULE_20__.default; },
/* harmony export */   "isEmpty": function() { return /* reexport safe */ _isEmpty_js__WEBPACK_IMPORTED_MODULE_21__.default; },
/* harmony export */   "isMatch": function() { return /* reexport safe */ _isMatch_js__WEBPACK_IMPORTED_MODULE_22__.default; },
/* harmony export */   "isEqual": function() { return /* reexport safe */ _isEqual_js__WEBPACK_IMPORTED_MODULE_23__.default; },
/* harmony export */   "isMap": function() { return /* reexport safe */ _isMap_js__WEBPACK_IMPORTED_MODULE_24__.default; },
/* harmony export */   "isWeakMap": function() { return /* reexport safe */ _isWeakMap_js__WEBPACK_IMPORTED_MODULE_25__.default; },
/* harmony export */   "isSet": function() { return /* reexport safe */ _isSet_js__WEBPACK_IMPORTED_MODULE_26__.default; },
/* harmony export */   "isWeakSet": function() { return /* reexport safe */ _isWeakSet_js__WEBPACK_IMPORTED_MODULE_27__.default; },
/* harmony export */   "keys": function() { return /* reexport safe */ _keys_js__WEBPACK_IMPORTED_MODULE_28__.default; },
/* harmony export */   "allKeys": function() { return /* reexport safe */ _allKeys_js__WEBPACK_IMPORTED_MODULE_29__.default; },
/* harmony export */   "values": function() { return /* reexport safe */ _values_js__WEBPACK_IMPORTED_MODULE_30__.default; },
/* harmony export */   "pairs": function() { return /* reexport safe */ _pairs_js__WEBPACK_IMPORTED_MODULE_31__.default; },
/* harmony export */   "invert": function() { return /* reexport safe */ _invert_js__WEBPACK_IMPORTED_MODULE_32__.default; },
/* harmony export */   "functions": function() { return /* reexport safe */ _functions_js__WEBPACK_IMPORTED_MODULE_33__.default; },
/* harmony export */   "methods": function() { return /* reexport safe */ _functions_js__WEBPACK_IMPORTED_MODULE_33__.default; },
/* harmony export */   "extend": function() { return /* reexport safe */ _extend_js__WEBPACK_IMPORTED_MODULE_34__.default; },
/* harmony export */   "extendOwn": function() { return /* reexport safe */ _extendOwn_js__WEBPACK_IMPORTED_MODULE_35__.default; },
/* harmony export */   "assign": function() { return /* reexport safe */ _extendOwn_js__WEBPACK_IMPORTED_MODULE_35__.default; },
/* harmony export */   "defaults": function() { return /* reexport safe */ _defaults_js__WEBPACK_IMPORTED_MODULE_36__.default; },
/* harmony export */   "create": function() { return /* reexport safe */ _create_js__WEBPACK_IMPORTED_MODULE_37__.default; },
/* harmony export */   "clone": function() { return /* reexport safe */ _clone_js__WEBPACK_IMPORTED_MODULE_38__.default; },
/* harmony export */   "tap": function() { return /* reexport safe */ _tap_js__WEBPACK_IMPORTED_MODULE_39__.default; },
/* harmony export */   "get": function() { return /* reexport safe */ _get_js__WEBPACK_IMPORTED_MODULE_40__.default; },
/* harmony export */   "has": function() { return /* reexport safe */ _has_js__WEBPACK_IMPORTED_MODULE_41__.default; },
/* harmony export */   "mapObject": function() { return /* reexport safe */ _mapObject_js__WEBPACK_IMPORTED_MODULE_42__.default; },
/* harmony export */   "identity": function() { return /* reexport safe */ _identity_js__WEBPACK_IMPORTED_MODULE_43__.default; },
/* harmony export */   "constant": function() { return /* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_44__.default; },
/* harmony export */   "noop": function() { return /* reexport safe */ _noop_js__WEBPACK_IMPORTED_MODULE_45__.default; },
/* harmony export */   "toPath": function() { return /* reexport safe */ _toPath_js__WEBPACK_IMPORTED_MODULE_46__.default; },
/* harmony export */   "property": function() { return /* reexport safe */ _property_js__WEBPACK_IMPORTED_MODULE_47__.default; },
/* harmony export */   "propertyOf": function() { return /* reexport safe */ _propertyOf_js__WEBPACK_IMPORTED_MODULE_48__.default; },
/* harmony export */   "matcher": function() { return /* reexport safe */ _matcher_js__WEBPACK_IMPORTED_MODULE_49__.default; },
/* harmony export */   "matches": function() { return /* reexport safe */ _matcher_js__WEBPACK_IMPORTED_MODULE_49__.default; },
/* harmony export */   "times": function() { return /* reexport safe */ _times_js__WEBPACK_IMPORTED_MODULE_50__.default; },
/* harmony export */   "random": function() { return /* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_51__.default; },
/* harmony export */   "now": function() { return /* reexport safe */ _now_js__WEBPACK_IMPORTED_MODULE_52__.default; },
/* harmony export */   "escape": function() { return /* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_53__.default; },
/* harmony export */   "unescape": function() { return /* reexport safe */ _unescape_js__WEBPACK_IMPORTED_MODULE_54__.default; },
/* harmony export */   "templateSettings": function() { return /* reexport safe */ _templateSettings_js__WEBPACK_IMPORTED_MODULE_55__.default; },
/* harmony export */   "template": function() { return /* reexport safe */ _template_js__WEBPACK_IMPORTED_MODULE_56__.default; },
/* harmony export */   "result": function() { return /* reexport safe */ _result_js__WEBPACK_IMPORTED_MODULE_57__.default; },
/* harmony export */   "uniqueId": function() { return /* reexport safe */ _uniqueId_js__WEBPACK_IMPORTED_MODULE_58__.default; },
/* harmony export */   "chain": function() { return /* reexport safe */ _chain_js__WEBPACK_IMPORTED_MODULE_59__.default; },
/* harmony export */   "iteratee": function() { return /* reexport safe */ _iteratee_js__WEBPACK_IMPORTED_MODULE_60__.default; },
/* harmony export */   "partial": function() { return /* reexport safe */ _partial_js__WEBPACK_IMPORTED_MODULE_61__.default; },
/* harmony export */   "bind": function() { return /* reexport safe */ _bind_js__WEBPACK_IMPORTED_MODULE_62__.default; },
/* harmony export */   "bindAll": function() { return /* reexport safe */ _bindAll_js__WEBPACK_IMPORTED_MODULE_63__.default; },
/* harmony export */   "memoize": function() { return /* reexport safe */ _memoize_js__WEBPACK_IMPORTED_MODULE_64__.default; },
/* harmony export */   "delay": function() { return /* reexport safe */ _delay_js__WEBPACK_IMPORTED_MODULE_65__.default; },
/* harmony export */   "defer": function() { return /* reexport safe */ _defer_js__WEBPACK_IMPORTED_MODULE_66__.default; },
/* harmony export */   "throttle": function() { return /* reexport safe */ _throttle_js__WEBPACK_IMPORTED_MODULE_67__.default; },
/* harmony export */   "debounce": function() { return /* reexport safe */ _debounce_js__WEBPACK_IMPORTED_MODULE_68__.default; },
/* harmony export */   "wrap": function() { return /* reexport safe */ _wrap_js__WEBPACK_IMPORTED_MODULE_69__.default; },
/* harmony export */   "negate": function() { return /* reexport safe */ _negate_js__WEBPACK_IMPORTED_MODULE_70__.default; },
/* harmony export */   "compose": function() { return /* reexport safe */ _compose_js__WEBPACK_IMPORTED_MODULE_71__.default; },
/* harmony export */   "after": function() { return /* reexport safe */ _after_js__WEBPACK_IMPORTED_MODULE_72__.default; },
/* harmony export */   "before": function() { return /* reexport safe */ _before_js__WEBPACK_IMPORTED_MODULE_73__.default; },
/* harmony export */   "once": function() { return /* reexport safe */ _once_js__WEBPACK_IMPORTED_MODULE_74__.default; },
/* harmony export */   "findKey": function() { return /* reexport safe */ _findKey_js__WEBPACK_IMPORTED_MODULE_75__.default; },
/* harmony export */   "findIndex": function() { return /* reexport safe */ _findIndex_js__WEBPACK_IMPORTED_MODULE_76__.default; },
/* harmony export */   "findLastIndex": function() { return /* reexport safe */ _findLastIndex_js__WEBPACK_IMPORTED_MODULE_77__.default; },
/* harmony export */   "sortedIndex": function() { return /* reexport safe */ _sortedIndex_js__WEBPACK_IMPORTED_MODULE_78__.default; },
/* harmony export */   "indexOf": function() { return /* reexport safe */ _indexOf_js__WEBPACK_IMPORTED_MODULE_79__.default; },
/* harmony export */   "lastIndexOf": function() { return /* reexport safe */ _lastIndexOf_js__WEBPACK_IMPORTED_MODULE_80__.default; },
/* harmony export */   "find": function() { return /* reexport safe */ _find_js__WEBPACK_IMPORTED_MODULE_81__.default; },
/* harmony export */   "detect": function() { return /* reexport safe */ _find_js__WEBPACK_IMPORTED_MODULE_81__.default; },
/* harmony export */   "findWhere": function() { return /* reexport safe */ _findWhere_js__WEBPACK_IMPORTED_MODULE_82__.default; },
/* harmony export */   "each": function() { return /* reexport safe */ _each_js__WEBPACK_IMPORTED_MODULE_83__.default; },
/* harmony export */   "forEach": function() { return /* reexport safe */ _each_js__WEBPACK_IMPORTED_MODULE_83__.default; },
/* harmony export */   "map": function() { return /* reexport safe */ _map_js__WEBPACK_IMPORTED_MODULE_84__.default; },
/* harmony export */   "collect": function() { return /* reexport safe */ _map_js__WEBPACK_IMPORTED_MODULE_84__.default; },
/* harmony export */   "reduce": function() { return /* reexport safe */ _reduce_js__WEBPACK_IMPORTED_MODULE_85__.default; },
/* harmony export */   "foldl": function() { return /* reexport safe */ _reduce_js__WEBPACK_IMPORTED_MODULE_85__.default; },
/* harmony export */   "inject": function() { return /* reexport safe */ _reduce_js__WEBPACK_IMPORTED_MODULE_85__.default; },
/* harmony export */   "reduceRight": function() { return /* reexport safe */ _reduceRight_js__WEBPACK_IMPORTED_MODULE_86__.default; },
/* harmony export */   "foldr": function() { return /* reexport safe */ _reduceRight_js__WEBPACK_IMPORTED_MODULE_86__.default; },
/* harmony export */   "filter": function() { return /* reexport safe */ _filter_js__WEBPACK_IMPORTED_MODULE_87__.default; },
/* harmony export */   "select": function() { return /* reexport safe */ _filter_js__WEBPACK_IMPORTED_MODULE_87__.default; },
/* harmony export */   "reject": function() { return /* reexport safe */ _reject_js__WEBPACK_IMPORTED_MODULE_88__.default; },
/* harmony export */   "every": function() { return /* reexport safe */ _every_js__WEBPACK_IMPORTED_MODULE_89__.default; },
/* harmony export */   "all": function() { return /* reexport safe */ _every_js__WEBPACK_IMPORTED_MODULE_89__.default; },
/* harmony export */   "some": function() { return /* reexport safe */ _some_js__WEBPACK_IMPORTED_MODULE_90__.default; },
/* harmony export */   "any": function() { return /* reexport safe */ _some_js__WEBPACK_IMPORTED_MODULE_90__.default; },
/* harmony export */   "contains": function() { return /* reexport safe */ _contains_js__WEBPACK_IMPORTED_MODULE_91__.default; },
/* harmony export */   "includes": function() { return /* reexport safe */ _contains_js__WEBPACK_IMPORTED_MODULE_91__.default; },
/* harmony export */   "include": function() { return /* reexport safe */ _contains_js__WEBPACK_IMPORTED_MODULE_91__.default; },
/* harmony export */   "invoke": function() { return /* reexport safe */ _invoke_js__WEBPACK_IMPORTED_MODULE_92__.default; },
/* harmony export */   "pluck": function() { return /* reexport safe */ _pluck_js__WEBPACK_IMPORTED_MODULE_93__.default; },
/* harmony export */   "where": function() { return /* reexport safe */ _where_js__WEBPACK_IMPORTED_MODULE_94__.default; },
/* harmony export */   "max": function() { return /* reexport safe */ _max_js__WEBPACK_IMPORTED_MODULE_95__.default; },
/* harmony export */   "min": function() { return /* reexport safe */ _min_js__WEBPACK_IMPORTED_MODULE_96__.default; },
/* harmony export */   "shuffle": function() { return /* reexport safe */ _shuffle_js__WEBPACK_IMPORTED_MODULE_97__.default; },
/* harmony export */   "sample": function() { return /* reexport safe */ _sample_js__WEBPACK_IMPORTED_MODULE_98__.default; },
/* harmony export */   "sortBy": function() { return /* reexport safe */ _sortBy_js__WEBPACK_IMPORTED_MODULE_99__.default; },
/* harmony export */   "groupBy": function() { return /* reexport safe */ _groupBy_js__WEBPACK_IMPORTED_MODULE_100__.default; },
/* harmony export */   "indexBy": function() { return /* reexport safe */ _indexBy_js__WEBPACK_IMPORTED_MODULE_101__.default; },
/* harmony export */   "countBy": function() { return /* reexport safe */ _countBy_js__WEBPACK_IMPORTED_MODULE_102__.default; },
/* harmony export */   "partition": function() { return /* reexport safe */ _partition_js__WEBPACK_IMPORTED_MODULE_103__.default; },
/* harmony export */   "toArray": function() { return /* reexport safe */ _toArray_js__WEBPACK_IMPORTED_MODULE_104__.default; },
/* harmony export */   "size": function() { return /* reexport safe */ _size_js__WEBPACK_IMPORTED_MODULE_105__.default; },
/* harmony export */   "pick": function() { return /* reexport safe */ _pick_js__WEBPACK_IMPORTED_MODULE_106__.default; },
/* harmony export */   "omit": function() { return /* reexport safe */ _omit_js__WEBPACK_IMPORTED_MODULE_107__.default; },
/* harmony export */   "first": function() { return /* reexport safe */ _first_js__WEBPACK_IMPORTED_MODULE_108__.default; },
/* harmony export */   "head": function() { return /* reexport safe */ _first_js__WEBPACK_IMPORTED_MODULE_108__.default; },
/* harmony export */   "take": function() { return /* reexport safe */ _first_js__WEBPACK_IMPORTED_MODULE_108__.default; },
/* harmony export */   "initial": function() { return /* reexport safe */ _initial_js__WEBPACK_IMPORTED_MODULE_109__.default; },
/* harmony export */   "last": function() { return /* reexport safe */ _last_js__WEBPACK_IMPORTED_MODULE_110__.default; },
/* harmony export */   "rest": function() { return /* reexport safe */ _rest_js__WEBPACK_IMPORTED_MODULE_111__.default; },
/* harmony export */   "tail": function() { return /* reexport safe */ _rest_js__WEBPACK_IMPORTED_MODULE_111__.default; },
/* harmony export */   "drop": function() { return /* reexport safe */ _rest_js__WEBPACK_IMPORTED_MODULE_111__.default; },
/* harmony export */   "compact": function() { return /* reexport safe */ _compact_js__WEBPACK_IMPORTED_MODULE_112__.default; },
/* harmony export */   "flatten": function() { return /* reexport safe */ _flatten_js__WEBPACK_IMPORTED_MODULE_113__.default; },
/* harmony export */   "without": function() { return /* reexport safe */ _without_js__WEBPACK_IMPORTED_MODULE_114__.default; },
/* harmony export */   "uniq": function() { return /* reexport safe */ _uniq_js__WEBPACK_IMPORTED_MODULE_115__.default; },
/* harmony export */   "unique": function() { return /* reexport safe */ _uniq_js__WEBPACK_IMPORTED_MODULE_115__.default; },
/* harmony export */   "union": function() { return /* reexport safe */ _union_js__WEBPACK_IMPORTED_MODULE_116__.default; },
/* harmony export */   "intersection": function() { return /* reexport safe */ _intersection_js__WEBPACK_IMPORTED_MODULE_117__.default; },
/* harmony export */   "difference": function() { return /* reexport safe */ _difference_js__WEBPACK_IMPORTED_MODULE_118__.default; },
/* harmony export */   "unzip": function() { return /* reexport safe */ _unzip_js__WEBPACK_IMPORTED_MODULE_119__.default; },
/* harmony export */   "transpose": function() { return /* reexport safe */ _unzip_js__WEBPACK_IMPORTED_MODULE_119__.default; },
/* harmony export */   "zip": function() { return /* reexport safe */ _zip_js__WEBPACK_IMPORTED_MODULE_120__.default; },
/* harmony export */   "object": function() { return /* reexport safe */ _object_js__WEBPACK_IMPORTED_MODULE_121__.default; },
/* harmony export */   "range": function() { return /* reexport safe */ _range_js__WEBPACK_IMPORTED_MODULE_122__.default; },
/* harmony export */   "chunk": function() { return /* reexport safe */ _chunk_js__WEBPACK_IMPORTED_MODULE_123__.default; },
/* harmony export */   "mixin": function() { return /* reexport safe */ _mixin_js__WEBPACK_IMPORTED_MODULE_124__.default; },
/* harmony export */   "default": function() { return /* reexport safe */ _underscore_array_methods_js__WEBPACK_IMPORTED_MODULE_125__.default; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _isNull_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isNull.js */ "./node_modules/underscore/modules/isNull.js");
/* harmony import */ var _isUndefined_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isUndefined.js */ "./node_modules/underscore/modules/isUndefined.js");
/* harmony import */ var _isBoolean_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isBoolean.js */ "./node_modules/underscore/modules/isBoolean.js");
/* harmony import */ var _isElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isElement.js */ "./node_modules/underscore/modules/isElement.js");
/* harmony import */ var _isString_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./isString.js */ "./node_modules/underscore/modules/isString.js");
/* harmony import */ var _isNumber_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./isNumber.js */ "./node_modules/underscore/modules/isNumber.js");
/* harmony import */ var _isDate_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./isDate.js */ "./node_modules/underscore/modules/isDate.js");
/* harmony import */ var _isRegExp_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./isRegExp.js */ "./node_modules/underscore/modules/isRegExp.js");
/* harmony import */ var _isError_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./isError.js */ "./node_modules/underscore/modules/isError.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/underscore/modules/isSymbol.js");
/* harmony import */ var _isArrayBuffer_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./isArrayBuffer.js */ "./node_modules/underscore/modules/isArrayBuffer.js");
/* harmony import */ var _isDataView_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./isDataView.js */ "./node_modules/underscore/modules/isDataView.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/underscore/modules/isArguments.js");
/* harmony import */ var _isFinite_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./isFinite.js */ "./node_modules/underscore/modules/isFinite.js");
/* harmony import */ var _isNaN_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./isNaN.js */ "./node_modules/underscore/modules/isNaN.js");
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./isTypedArray.js */ "./node_modules/underscore/modules/isTypedArray.js");
/* harmony import */ var _isEmpty_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./isEmpty.js */ "./node_modules/underscore/modules/isEmpty.js");
/* harmony import */ var _isMatch_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./isMatch.js */ "./node_modules/underscore/modules/isMatch.js");
/* harmony import */ var _isEqual_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./isEqual.js */ "./node_modules/underscore/modules/isEqual.js");
/* harmony import */ var _isMap_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./isMap.js */ "./node_modules/underscore/modules/isMap.js");
/* harmony import */ var _isWeakMap_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./isWeakMap.js */ "./node_modules/underscore/modules/isWeakMap.js");
/* harmony import */ var _isSet_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./isSet.js */ "./node_modules/underscore/modules/isSet.js");
/* harmony import */ var _isWeakSet_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./isWeakSet.js */ "./node_modules/underscore/modules/isWeakSet.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _pairs_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./pairs.js */ "./node_modules/underscore/modules/pairs.js");
/* harmony import */ var _invert_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./invert.js */ "./node_modules/underscore/modules/invert.js");
/* harmony import */ var _functions_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./functions.js */ "./node_modules/underscore/modules/functions.js");
/* harmony import */ var _extend_js__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./extend.js */ "./node_modules/underscore/modules/extend.js");
/* harmony import */ var _extendOwn_js__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./extendOwn.js */ "./node_modules/underscore/modules/extendOwn.js");
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./defaults.js */ "./node_modules/underscore/modules/defaults.js");
/* harmony import */ var _create_js__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./create.js */ "./node_modules/underscore/modules/create.js");
/* harmony import */ var _clone_js__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./clone.js */ "./node_modules/underscore/modules/clone.js");
/* harmony import */ var _tap_js__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./tap.js */ "./node_modules/underscore/modules/tap.js");
/* harmony import */ var _get_js__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./get.js */ "./node_modules/underscore/modules/get.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./has.js */ "./node_modules/underscore/modules/has.js");
/* harmony import */ var _mapObject_js__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./mapObject.js */ "./node_modules/underscore/modules/mapObject.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./identity.js */ "./node_modules/underscore/modules/identity.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./constant.js */ "./node_modules/underscore/modules/constant.js");
/* harmony import */ var _noop_js__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./noop.js */ "./node_modules/underscore/modules/noop.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./toPath.js */ "./node_modules/underscore/modules/toPath.js");
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./property.js */ "./node_modules/underscore/modules/property.js");
/* harmony import */ var _propertyOf_js__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./propertyOf.js */ "./node_modules/underscore/modules/propertyOf.js");
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./matcher.js */ "./node_modules/underscore/modules/matcher.js");
/* harmony import */ var _times_js__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./times.js */ "./node_modules/underscore/modules/times.js");
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./random.js */ "./node_modules/underscore/modules/random.js");
/* harmony import */ var _now_js__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ./now.js */ "./node_modules/underscore/modules/now.js");
/* harmony import */ var _escape_js__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./escape.js */ "./node_modules/underscore/modules/escape.js");
/* harmony import */ var _unescape_js__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ./unescape.js */ "./node_modules/underscore/modules/unescape.js");
/* harmony import */ var _templateSettings_js__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./templateSettings.js */ "./node_modules/underscore/modules/templateSettings.js");
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ./template.js */ "./node_modules/underscore/modules/template.js");
/* harmony import */ var _result_js__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ./result.js */ "./node_modules/underscore/modules/result.js");
/* harmony import */ var _uniqueId_js__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ./uniqueId.js */ "./node_modules/underscore/modules/uniqueId.js");
/* harmony import */ var _chain_js__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ./chain.js */ "./node_modules/underscore/modules/chain.js");
/* harmony import */ var _iteratee_js__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ./iteratee.js */ "./node_modules/underscore/modules/iteratee.js");
/* harmony import */ var _partial_js__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! ./partial.js */ "./node_modules/underscore/modules/partial.js");
/* harmony import */ var _bind_js__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ./bind.js */ "./node_modules/underscore/modules/bind.js");
/* harmony import */ var _bindAll_js__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ./bindAll.js */ "./node_modules/underscore/modules/bindAll.js");
/* harmony import */ var _memoize_js__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(/*! ./memoize.js */ "./node_modules/underscore/modules/memoize.js");
/* harmony import */ var _delay_js__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(/*! ./delay.js */ "./node_modules/underscore/modules/delay.js");
/* harmony import */ var _defer_js__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(/*! ./defer.js */ "./node_modules/underscore/modules/defer.js");
/* harmony import */ var _throttle_js__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(/*! ./throttle.js */ "./node_modules/underscore/modules/throttle.js");
/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(/*! ./debounce.js */ "./node_modules/underscore/modules/debounce.js");
/* harmony import */ var _wrap_js__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(/*! ./wrap.js */ "./node_modules/underscore/modules/wrap.js");
/* harmony import */ var _negate_js__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(/*! ./negate.js */ "./node_modules/underscore/modules/negate.js");
/* harmony import */ var _compose_js__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(/*! ./compose.js */ "./node_modules/underscore/modules/compose.js");
/* harmony import */ var _after_js__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(/*! ./after.js */ "./node_modules/underscore/modules/after.js");
/* harmony import */ var _before_js__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(/*! ./before.js */ "./node_modules/underscore/modules/before.js");
/* harmony import */ var _once_js__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(/*! ./once.js */ "./node_modules/underscore/modules/once.js");
/* harmony import */ var _findKey_js__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(/*! ./findKey.js */ "./node_modules/underscore/modules/findKey.js");
/* harmony import */ var _findIndex_js__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(/*! ./findIndex.js */ "./node_modules/underscore/modules/findIndex.js");
/* harmony import */ var _findLastIndex_js__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__(/*! ./findLastIndex.js */ "./node_modules/underscore/modules/findLastIndex.js");
/* harmony import */ var _sortedIndex_js__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__(/*! ./sortedIndex.js */ "./node_modules/underscore/modules/sortedIndex.js");
/* harmony import */ var _indexOf_js__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__(/*! ./indexOf.js */ "./node_modules/underscore/modules/indexOf.js");
/* harmony import */ var _lastIndexOf_js__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__(/*! ./lastIndexOf.js */ "./node_modules/underscore/modules/lastIndexOf.js");
/* harmony import */ var _find_js__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__(/*! ./find.js */ "./node_modules/underscore/modules/find.js");
/* harmony import */ var _findWhere_js__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__(/*! ./findWhere.js */ "./node_modules/underscore/modules/findWhere.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _reduce_js__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__(/*! ./reduce.js */ "./node_modules/underscore/modules/reduce.js");
/* harmony import */ var _reduceRight_js__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__(/*! ./reduceRight.js */ "./node_modules/underscore/modules/reduceRight.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");
/* harmony import */ var _reject_js__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__(/*! ./reject.js */ "./node_modules/underscore/modules/reject.js");
/* harmony import */ var _every_js__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__(/*! ./every.js */ "./node_modules/underscore/modules/every.js");
/* harmony import */ var _some_js__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__(/*! ./some.js */ "./node_modules/underscore/modules/some.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");
/* harmony import */ var _invoke_js__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__(/*! ./invoke.js */ "./node_modules/underscore/modules/invoke.js");
/* harmony import */ var _pluck_js__WEBPACK_IMPORTED_MODULE_93__ = __webpack_require__(/*! ./pluck.js */ "./node_modules/underscore/modules/pluck.js");
/* harmony import */ var _where_js__WEBPACK_IMPORTED_MODULE_94__ = __webpack_require__(/*! ./where.js */ "./node_modules/underscore/modules/where.js");
/* harmony import */ var _max_js__WEBPACK_IMPORTED_MODULE_95__ = __webpack_require__(/*! ./max.js */ "./node_modules/underscore/modules/max.js");
/* harmony import */ var _min_js__WEBPACK_IMPORTED_MODULE_96__ = __webpack_require__(/*! ./min.js */ "./node_modules/underscore/modules/min.js");
/* harmony import */ var _shuffle_js__WEBPACK_IMPORTED_MODULE_97__ = __webpack_require__(/*! ./shuffle.js */ "./node_modules/underscore/modules/shuffle.js");
/* harmony import */ var _sample_js__WEBPACK_IMPORTED_MODULE_98__ = __webpack_require__(/*! ./sample.js */ "./node_modules/underscore/modules/sample.js");
/* harmony import */ var _sortBy_js__WEBPACK_IMPORTED_MODULE_99__ = __webpack_require__(/*! ./sortBy.js */ "./node_modules/underscore/modules/sortBy.js");
/* harmony import */ var _groupBy_js__WEBPACK_IMPORTED_MODULE_100__ = __webpack_require__(/*! ./groupBy.js */ "./node_modules/underscore/modules/groupBy.js");
/* harmony import */ var _indexBy_js__WEBPACK_IMPORTED_MODULE_101__ = __webpack_require__(/*! ./indexBy.js */ "./node_modules/underscore/modules/indexBy.js");
/* harmony import */ var _countBy_js__WEBPACK_IMPORTED_MODULE_102__ = __webpack_require__(/*! ./countBy.js */ "./node_modules/underscore/modules/countBy.js");
/* harmony import */ var _partition_js__WEBPACK_IMPORTED_MODULE_103__ = __webpack_require__(/*! ./partition.js */ "./node_modules/underscore/modules/partition.js");
/* harmony import */ var _toArray_js__WEBPACK_IMPORTED_MODULE_104__ = __webpack_require__(/*! ./toArray.js */ "./node_modules/underscore/modules/toArray.js");
/* harmony import */ var _size_js__WEBPACK_IMPORTED_MODULE_105__ = __webpack_require__(/*! ./size.js */ "./node_modules/underscore/modules/size.js");
/* harmony import */ var _pick_js__WEBPACK_IMPORTED_MODULE_106__ = __webpack_require__(/*! ./pick.js */ "./node_modules/underscore/modules/pick.js");
/* harmony import */ var _omit_js__WEBPACK_IMPORTED_MODULE_107__ = __webpack_require__(/*! ./omit.js */ "./node_modules/underscore/modules/omit.js");
/* harmony import */ var _first_js__WEBPACK_IMPORTED_MODULE_108__ = __webpack_require__(/*! ./first.js */ "./node_modules/underscore/modules/first.js");
/* harmony import */ var _initial_js__WEBPACK_IMPORTED_MODULE_109__ = __webpack_require__(/*! ./initial.js */ "./node_modules/underscore/modules/initial.js");
/* harmony import */ var _last_js__WEBPACK_IMPORTED_MODULE_110__ = __webpack_require__(/*! ./last.js */ "./node_modules/underscore/modules/last.js");
/* harmony import */ var _rest_js__WEBPACK_IMPORTED_MODULE_111__ = __webpack_require__(/*! ./rest.js */ "./node_modules/underscore/modules/rest.js");
/* harmony import */ var _compact_js__WEBPACK_IMPORTED_MODULE_112__ = __webpack_require__(/*! ./compact.js */ "./node_modules/underscore/modules/compact.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_113__ = __webpack_require__(/*! ./flatten.js */ "./node_modules/underscore/modules/flatten.js");
/* harmony import */ var _without_js__WEBPACK_IMPORTED_MODULE_114__ = __webpack_require__(/*! ./without.js */ "./node_modules/underscore/modules/without.js");
/* harmony import */ var _uniq_js__WEBPACK_IMPORTED_MODULE_115__ = __webpack_require__(/*! ./uniq.js */ "./node_modules/underscore/modules/uniq.js");
/* harmony import */ var _union_js__WEBPACK_IMPORTED_MODULE_116__ = __webpack_require__(/*! ./union.js */ "./node_modules/underscore/modules/union.js");
/* harmony import */ var _intersection_js__WEBPACK_IMPORTED_MODULE_117__ = __webpack_require__(/*! ./intersection.js */ "./node_modules/underscore/modules/intersection.js");
/* harmony import */ var _difference_js__WEBPACK_IMPORTED_MODULE_118__ = __webpack_require__(/*! ./difference.js */ "./node_modules/underscore/modules/difference.js");
/* harmony import */ var _unzip_js__WEBPACK_IMPORTED_MODULE_119__ = __webpack_require__(/*! ./unzip.js */ "./node_modules/underscore/modules/unzip.js");
/* harmony import */ var _zip_js__WEBPACK_IMPORTED_MODULE_120__ = __webpack_require__(/*! ./zip.js */ "./node_modules/underscore/modules/zip.js");
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_121__ = __webpack_require__(/*! ./object.js */ "./node_modules/underscore/modules/object.js");
/* harmony import */ var _range_js__WEBPACK_IMPORTED_MODULE_122__ = __webpack_require__(/*! ./range.js */ "./node_modules/underscore/modules/range.js");
/* harmony import */ var _chunk_js__WEBPACK_IMPORTED_MODULE_123__ = __webpack_require__(/*! ./chunk.js */ "./node_modules/underscore/modules/chunk.js");
/* harmony import */ var _mixin_js__WEBPACK_IMPORTED_MODULE_124__ = __webpack_require__(/*! ./mixin.js */ "./node_modules/underscore/modules/mixin.js");
/* harmony import */ var _underscore_array_methods_js__WEBPACK_IMPORTED_MODULE_125__ = __webpack_require__(/*! ./underscore-array-methods.js */ "./node_modules/underscore/modules/underscore-array-methods.js");
// Named Exports
// =============
//     Underscore.js 1.13.1
//     https://underscorejs.org
//     (c) 2009-2021 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
// Baseline setup.

 // Object Functions
// ----------------
// Our most fundamental functions operate on any JavaScript object.
// Most functions in Underscore depend on at least one function in this section.
// A group of functions that check the types of core JavaScript values.
// These are often informally referred to as the "isType" functions.


























 // Functions that treat an object as a dictionary of key-value pairs.















 // Utility Functions
// -----------------
// A bit of a grab bag: Predicate-generating functions for use with filters and
// loops, string escaping and templating, create random numbers and unique ids,
// and functions that facilitate Underscore's chaining and iteration conventions.


















 // Function (ahem) Functions
// -------------------------
// These functions take a function as an argument and return a new function
// as the result. Also known as higher-order functions.














 // Finders
// -------
// Functions that extract (the position of) a single element from an object
// or array based on some criterion.








 // Collection Functions
// --------------------
// Functions that work on any collection of elements: either an array, or
// an object of key-value pairs.























 // `_.pick` and `_.omit` are actually object functions, but we put
// them here in order to create a more natural reading order in the
// monolithic build as they depend on `_.contains`.


 // Array Functions
// ---------------
// Functions that operate on arrays (and array-likes) only, because they’re
// expressed in terms of operations on an ordered list of values.
















 // OOP
// ---
// These modules support the "object-oriented" calling style. See also
// `underscore.js` and `index-default.js`.




/***/ }),

/***/ "./node_modules/underscore/modules/indexBy.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/indexBy.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_group.js */ "./node_modules/underscore/modules/_group.js");
 // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
// when you know that your index values will be unique.

/* harmony default export */ __webpack_exports__["default"] = ((0,_group_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (result, value, key) {
  result[key] = value;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/indexOf.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/indexOf.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sortedIndex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sortedIndex.js */ "./node_modules/underscore/modules/sortedIndex.js");
/* harmony import */ var _findIndex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./findIndex.js */ "./node_modules/underscore/modules/findIndex.js");
/* harmony import */ var _createIndexFinder_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_createIndexFinder.js */ "./node_modules/underscore/modules/_createIndexFinder.js");


 // Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createIndexFinder_js__WEBPACK_IMPORTED_MODULE_2__.default)(1, _findIndex_js__WEBPACK_IMPORTED_MODULE_1__.default, _sortedIndex_js__WEBPACK_IMPORTED_MODULE_0__.default));

/***/ }),

/***/ "./node_modules/underscore/modules/initial.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/initial.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ initial; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
 // Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.

function initial(array, n, guard) {
  return _setup_js__WEBPACK_IMPORTED_MODULE_0__.slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}

/***/ }),

/***/ "./node_modules/underscore/modules/intersection.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/intersection.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ intersection; }
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");

 // Produce an array that contains every item shared between all the
// passed-in arrays.

function intersection(array) {
  var result = [];
  var argsLength = arguments.length;

  for (var i = 0, length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__.default)(array); i < length; i++) {
    var item = array[i];
    if ((0,_contains_js__WEBPACK_IMPORTED_MODULE_1__.default)(result, item)) continue;
    var j;

    for (j = 1; j < argsLength; j++) {
      if (!(0,_contains_js__WEBPACK_IMPORTED_MODULE_1__.default)(arguments[j], item)) break;
    }

    if (j === argsLength) result.push(item);
  }

  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/invert.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/invert.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ invert; }
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
 // Invert the keys and values of an object. The values must be serializable.

function invert(obj) {
  var result = {};

  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj);

  for (var i = 0, length = _keys.length; i < length; i++) {
    result[obj[_keys[i]]] = _keys[i];
  }

  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/invoke.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/invoke.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _deepGet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_deepGet.js */ "./node_modules/underscore/modules/_deepGet.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");




 // Invoke a method (with arguments) on every item in a collection.

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (obj, path, args) {
  var contextPath, func;

  if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__.default)(path)) {
    func = path;
  } else {
    path = (0,_toPath_js__WEBPACK_IMPORTED_MODULE_4__.default)(path);
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }

  return (0,_map_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj, function (context) {
    var method = func;

    if (!method) {
      if (contextPath && contextPath.length) {
        context = (0,_deepGet_js__WEBPACK_IMPORTED_MODULE_3__.default)(context, contextPath);
      }

      if (context == null) return void 0;
      method = context[path];
    }

    return method == null ? method : method.apply(context, args);
  });
}));

/***/ }),

/***/ "./node_modules/underscore/modules/isArguments.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/isArguments.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");


var isArguments = (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('Arguments'); // Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.

(function () {
  if (!isArguments(arguments)) {
    isArguments = function (obj) {
      return (0,_has_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj, 'callee');
    };
  }
})();

/* harmony default export */ __webpack_exports__["default"] = (isArguments);

/***/ }),

/***/ "./node_modules/underscore/modules/isArray.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isArray.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

 // Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.

/* harmony default export */ __webpack_exports__["default"] = (_setup_js__WEBPACK_IMPORTED_MODULE_0__.nativeIsArray || (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_1__.default)('Array'));

/***/ }),

/***/ "./node_modules/underscore/modules/isArrayBuffer.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/isArrayBuffer.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('ArrayBuffer'));

/***/ }),

/***/ "./node_modules/underscore/modules/isBoolean.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/isBoolean.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isBoolean; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
 // Is a given value a boolean?

function isBoolean(obj) {
  return obj === true || obj === false || _setup_js__WEBPACK_IMPORTED_MODULE_0__.toString.call(obj) === '[object Boolean]';
}

/***/ }),

/***/ "./node_modules/underscore/modules/isDataView.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/isDataView.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _isArrayBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isArrayBuffer.js */ "./node_modules/underscore/modules/isArrayBuffer.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");




var isDataView = (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('DataView'); // In IE 10 - Edge 13, we need a different heuristic
// to determine whether an object is a `DataView`.

function ie10IsDataView(obj) {
  return obj != null && (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj.getInt8) && (0,_isArrayBuffer_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj.buffer);
}

/* harmony default export */ __webpack_exports__["default"] = (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_3__.hasStringTagBug ? ie10IsDataView : isDataView);

/***/ }),

/***/ "./node_modules/underscore/modules/isDate.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/isDate.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('Date'));

/***/ }),

/***/ "./node_modules/underscore/modules/isElement.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/isElement.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isElement; }
/* harmony export */ });
// Is a given value a DOM element?
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

/***/ }),

/***/ "./node_modules/underscore/modules/isEmpty.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isEmpty.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isEmpty; }
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _isString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isString.js */ "./node_modules/underscore/modules/isString.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/underscore/modules/isArguments.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");




 // Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.

function isEmpty(obj) {
  if (obj == null) return true; // Skip the more expensive `toString`-based type checks if `obj` has no
  // `.length`.

  var length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj);
  if (typeof length == 'number' && ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj) || (0,_isString_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_3__.default)(obj))) return length === 0;
  return (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__.default)((0,_keys_js__WEBPACK_IMPORTED_MODULE_4__.default)(obj)) === 0;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isEqual.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isEqual.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isEqual; }
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _getByteLength_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getByteLength.js */ "./node_modules/underscore/modules/_getByteLength.js");
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isTypedArray.js */ "./node_modules/underscore/modules/isTypedArray.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");
/* harmony import */ var _isDataView_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isDataView.js */ "./node_modules/underscore/modules/isDataView.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");
/* harmony import */ var _toBufferView_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_toBufferView.js */ "./node_modules/underscore/modules/_toBufferView.js");









 // We use this string twice, so give it a name for minification.

var tagDataView = '[object DataView]'; // Internal recursive comparison function for `_.isEqual`.

function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b; // `null` or `undefined` only equal to itself (strict comparison).

  if (a == null || b == null) return false; // `NaN`s are equivalent, but non-reflexive.

  if (a !== a) return b !== b; // Exhaust primitive checks

  var type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
  return deepEq(a, b, aStack, bStack);
} // Internal recursive comparison function for `_.isEqual`.


function deepEq(a, b, aStack, bStack) {
  // Unwrap any wrapped objects.
  if (a instanceof _underscore_js__WEBPACK_IMPORTED_MODULE_0__.default) a = a._wrapped;
  if (b instanceof _underscore_js__WEBPACK_IMPORTED_MODULE_0__.default) b = b._wrapped; // Compare `[[Class]]` names.

  var className = _setup_js__WEBPACK_IMPORTED_MODULE_1__.toString.call(a);
  if (className !== _setup_js__WEBPACK_IMPORTED_MODULE_1__.toString.call(b)) return false; // Work around a bug in IE 10 - Edge 13.

  if (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_5__.hasStringTagBug && className == '[object Object]' && (0,_isDataView_js__WEBPACK_IMPORTED_MODULE_6__.default)(a)) {
    if (!(0,_isDataView_js__WEBPACK_IMPORTED_MODULE_6__.default)(b)) return false;
    className = tagDataView;
  }

  switch (className) {
    // These types are compared by value.
    case '[object RegExp]': // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')

    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return '' + a === '' + b;

    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) return +b !== +b; // An `egal` comparison is performed for other numeric values.

      return +a === 0 ? 1 / +a === 1 / b : +a === +b;

    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;

    case '[object Symbol]':
      return _setup_js__WEBPACK_IMPORTED_MODULE_1__.SymbolProto.valueOf.call(a) === _setup_js__WEBPACK_IMPORTED_MODULE_1__.SymbolProto.valueOf.call(b);

    case '[object ArrayBuffer]':
    case tagDataView:
      // Coerce to typed array so we can fall through.
      return deepEq((0,_toBufferView_js__WEBPACK_IMPORTED_MODULE_9__.default)(a), (0,_toBufferView_js__WEBPACK_IMPORTED_MODULE_9__.default)(b), aStack, bStack);
  }

  var areArrays = className === '[object Array]';

  if (!areArrays && (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__.default)(a)) {
    var byteLength = (0,_getByteLength_js__WEBPACK_IMPORTED_MODULE_2__.default)(a);
    if (byteLength !== (0,_getByteLength_js__WEBPACK_IMPORTED_MODULE_2__.default)(b)) return false;
    if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
    areArrays = true;
  }

  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') return false; // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.

    var aCtor = a.constructor,
        bCtor = b.constructor;

    if (aCtor !== bCtor && !((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_4__.default)(aCtor) && aCtor instanceof aCtor && (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_4__.default)(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
      return false;
    }
  } // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.


  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;

  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
  } // Add the first object to the stack of traversed objects.


  aStack.push(a);
  bStack.push(b); // Recursively compare objects and arrays.

  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false; // Deep compare the contents, ignoring non-numeric properties.

    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  } else {
    // Deep compare objects.
    var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_7__.default)(a),
        key;

    length = _keys.length; // Ensure that both objects contain the same number of properties before comparing deep equality.

    if ((0,_keys_js__WEBPACK_IMPORTED_MODULE_7__.default)(b).length !== length) return false;

    while (length--) {
      // Deep compare each member
      key = _keys[length];
      if (!((0,_has_js__WEBPACK_IMPORTED_MODULE_8__.default)(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  } // Remove the first object from the stack of traversed objects.


  aStack.pop();
  bStack.pop();
  return true;
} // Perform a deep comparison to check if two objects are equal.


function isEqual(a, b) {
  return eq(a, b);
}

/***/ }),

/***/ "./node_modules/underscore/modules/isError.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isError.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('Error'));

/***/ }),

/***/ "./node_modules/underscore/modules/isFinite.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isFinite.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isFinite; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/underscore/modules/isSymbol.js");

 // Is a given object a finite number?

function isFinite(obj) {
  return !(0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj) && (0,_setup_js__WEBPACK_IMPORTED_MODULE_0__._isFinite)(obj) && !isNaN(parseFloat(obj));
}

/***/ }),

/***/ "./node_modules/underscore/modules/isFunction.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/isFunction.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");


var isFunction = (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('Function'); // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
// v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).

var nodelist = _setup_js__WEBPACK_IMPORTED_MODULE_1__.root.document && _setup_js__WEBPACK_IMPORTED_MODULE_1__.root.document.childNodes;

if ( true && typeof Int8Array != 'object' && typeof nodelist != 'function') {
  isFunction = function (obj) {
    return typeof obj == 'function' || false;
  };
}

/* harmony default export */ __webpack_exports__["default"] = (isFunction);

/***/ }),

/***/ "./node_modules/underscore/modules/isMap.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/isMap.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");
/* harmony import */ var _methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_methodFingerprint.js */ "./node_modules/underscore/modules/_methodFingerprint.js");



/* harmony default export */ __webpack_exports__["default"] = (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__.isIE11 ? (0,_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.ie11fingerprint)(_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.mapMethods) : (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('Map'));

/***/ }),

/***/ "./node_modules/underscore/modules/isMatch.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isMatch.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isMatch; }
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
 // Returns whether an object has a given set of `key:value` pairs.

function isMatch(object, attrs) {
  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__.default)(attrs),
      length = _keys.length;

  if (object == null) return !length;
  var obj = Object(object);

  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }

  return true;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isNaN.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/isNaN.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isNaN; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isNumber_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isNumber.js */ "./node_modules/underscore/modules/isNumber.js");

 // Is the given value `NaN`?

function isNaN(obj) {
  return (0,_isNumber_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj) && (0,_setup_js__WEBPACK_IMPORTED_MODULE_0__._isNaN)(obj);
}

/***/ }),

/***/ "./node_modules/underscore/modules/isNull.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/isNull.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isNull; }
/* harmony export */ });
// Is a given value equal to null?
function isNull(obj) {
  return obj === null;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isNumber.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isNumber.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('Number'));

/***/ }),

/***/ "./node_modules/underscore/modules/isObject.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isObject.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isObject; }
/* harmony export */ });
// Is a given variable an object?
function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isRegExp.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isRegExp.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('RegExp'));

/***/ }),

/***/ "./node_modules/underscore/modules/isSet.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/isSet.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");
/* harmony import */ var _methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_methodFingerprint.js */ "./node_modules/underscore/modules/_methodFingerprint.js");



/* harmony default export */ __webpack_exports__["default"] = (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__.isIE11 ? (0,_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.ie11fingerprint)(_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.setMethods) : (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('Set'));

/***/ }),

/***/ "./node_modules/underscore/modules/isString.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isString.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('String'));

/***/ }),

/***/ "./node_modules/underscore/modules/isSymbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isSymbol.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('Symbol'));

/***/ }),

/***/ "./node_modules/underscore/modules/isTypedArray.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/isTypedArray.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isDataView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isDataView.js */ "./node_modules/underscore/modules/isDataView.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constant.js */ "./node_modules/underscore/modules/constant.js");
/* harmony import */ var _isBufferLike_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_isBufferLike.js */ "./node_modules/underscore/modules/_isBufferLike.js");



 // Is a given value a typed array?

var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;

function isTypedArray(obj) {
  // `ArrayBuffer.isView` is the most future-proof, so use it when available.
  // Otherwise, fall back on the above regular expression.
  return _setup_js__WEBPACK_IMPORTED_MODULE_0__.nativeIsView ? (0,_setup_js__WEBPACK_IMPORTED_MODULE_0__.nativeIsView)(obj) && !(0,_isDataView_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj) : (0,_isBufferLike_js__WEBPACK_IMPORTED_MODULE_3__.default)(obj) && typedArrayPattern.test(_setup_js__WEBPACK_IMPORTED_MODULE_0__.toString.call(obj));
}

/* harmony default export */ __webpack_exports__["default"] = (_setup_js__WEBPACK_IMPORTED_MODULE_0__.supportsArrayBuffer ? isTypedArray : (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__.default)(false));

/***/ }),

/***/ "./node_modules/underscore/modules/isUndefined.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/isUndefined.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isUndefined; }
/* harmony export */ });
// Is a given variable undefined?
function isUndefined(obj) {
  return obj === void 0;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isWeakMap.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/isWeakMap.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");
/* harmony import */ var _methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_methodFingerprint.js */ "./node_modules/underscore/modules/_methodFingerprint.js");



/* harmony default export */ __webpack_exports__["default"] = (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__.isIE11 ? (0,_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.ie11fingerprint)(_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.weakMapMethods) : (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('WeakMap'));

/***/ }),

/***/ "./node_modules/underscore/modules/isWeakSet.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/isWeakSet.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__.default)('WeakSet'));

/***/ }),

/***/ "./node_modules/underscore/modules/iteratee.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/iteratee.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ iteratee; }
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/underscore/modules/_baseIteratee.js");

 // External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only `argCount` argument.

function iteratee(value, context) {
  return (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__.default)(value, context, Infinity);
}
_underscore_js__WEBPACK_IMPORTED_MODULE_0__.default.iteratee = iteratee;

/***/ }),

/***/ "./node_modules/underscore/modules/keys.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/keys.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ keys; }
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");
/* harmony import */ var _collectNonEnumProps_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_collectNonEnumProps.js */ "./node_modules/underscore/modules/_collectNonEnumProps.js");



 // Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.

function keys(obj) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj)) return [];
  if (_setup_js__WEBPACK_IMPORTED_MODULE_1__.nativeKeys) return (0,_setup_js__WEBPACK_IMPORTED_MODULE_1__.nativeKeys)(obj);
  var keys = [];

  for (var key in obj) if ((0,_has_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj, key)) keys.push(key); // Ahem, IE < 9.


  if (_setup_js__WEBPACK_IMPORTED_MODULE_1__.hasEnumBug) (0,_collectNonEnumProps_js__WEBPACK_IMPORTED_MODULE_3__.default)(obj, keys);
  return keys;
}

/***/ }),

/***/ "./node_modules/underscore/modules/last.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/last.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ last; }
/* harmony export */ });
/* harmony import */ var _rest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rest.js */ "./node_modules/underscore/modules/rest.js");
 // Get the last element of an array. Passing **n** will return the last N
// values in the array.

function last(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return (0,_rest_js__WEBPACK_IMPORTED_MODULE_0__.default)(array, Math.max(0, array.length - n));
}

/***/ }),

/***/ "./node_modules/underscore/modules/lastIndexOf.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/lastIndexOf.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _findLastIndex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./findLastIndex.js */ "./node_modules/underscore/modules/findLastIndex.js");
/* harmony import */ var _createIndexFinder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_createIndexFinder.js */ "./node_modules/underscore/modules/_createIndexFinder.js");

 // Return the position of the last occurrence of an item in an array,
// or -1 if the item is not included in the array.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createIndexFinder_js__WEBPACK_IMPORTED_MODULE_1__.default)(-1, _findLastIndex_js__WEBPACK_IMPORTED_MODULE_0__.default));

/***/ }),

/***/ "./node_modules/underscore/modules/map.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/map.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ map; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");


 // Return the results of applying the iteratee to each element.

function map(obj, iteratee, context) {
  iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(iteratee, context);

  var _keys = !(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj) && (0,_keys_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj),
      length = (_keys || obj).length,
      results = Array(length);

  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }

  return results;
}

/***/ }),

/***/ "./node_modules/underscore/modules/mapObject.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/mapObject.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ mapObject; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");

 // Returns the results of applying the `iteratee` to each element of `obj`.
// In contrast to `_.map` it returns an object.

function mapObject(obj, iteratee, context) {
  iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(iteratee, context);

  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj),
      length = _keys.length,
      results = {};

  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }

  return results;
}

/***/ }),

/***/ "./node_modules/underscore/modules/matcher.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/matcher.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ matcher; }
/* harmony export */ });
/* harmony import */ var _extendOwn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extendOwn.js */ "./node_modules/underscore/modules/extendOwn.js");
/* harmony import */ var _isMatch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isMatch.js */ "./node_modules/underscore/modules/isMatch.js");

 // Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.

function matcher(attrs) {
  attrs = (0,_extendOwn_js__WEBPACK_IMPORTED_MODULE_0__.default)({}, attrs);
  return function (obj) {
    return (0,_isMatch_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj, attrs);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/max.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/max.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ max; }
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");



 // Return the maximum element (or element-based computation).

function max(obj, iteratee, context) {
  var result = -Infinity,
      lastComputed = -Infinity,
      value,
      computed;

  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
    obj = (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj) ? obj : (0,_values_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj);

    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];

      if (value != null && value > result) {
        result = value;
      }
    }
  } else {
    iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_2__.default)(iteratee, context);
    (0,_each_js__WEBPACK_IMPORTED_MODULE_3__.default)(obj, function (v, index, list) {
      computed = iteratee(v, index, list);

      if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }

  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/memoize.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/memoize.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ memoize; }
/* harmony export */ });
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");
 // Memoize an expensive function by storing its results.

function memoize(func, hasher) {
  var memoize = function (key) {
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!(0,_has_js__WEBPACK_IMPORTED_MODULE_0__.default)(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };

  memoize.cache = {};
  return memoize;
}

/***/ }),

/***/ "./node_modules/underscore/modules/min.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/min.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ min; }
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");



 // Return the minimum element (or element-based computation).

function min(obj, iteratee, context) {
  var result = Infinity,
      lastComputed = Infinity,
      value,
      computed;

  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
    obj = (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj) ? obj : (0,_values_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj);

    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];

      if (value != null && value < result) {
        result = value;
      }
    }
  } else {
    iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_2__.default)(iteratee, context);
    (0,_each_js__WEBPACK_IMPORTED_MODULE_3__.default)(obj, function (v, index, list) {
      computed = iteratee(v, index, list);

      if (computed < lastComputed || computed === Infinity && result === Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }

  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/mixin.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/mixin.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ mixin; }
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");
/* harmony import */ var _functions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./functions.js */ "./node_modules/underscore/modules/functions.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _chainResult_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_chainResult.js */ "./node_modules/underscore/modules/_chainResult.js");




 // Add your own custom functions to the Underscore object.

function mixin(obj) {
  (0,_each_js__WEBPACK_IMPORTED_MODULE_1__.default)((0,_functions_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj), function (name) {
    var func = _underscore_js__WEBPACK_IMPORTED_MODULE_0__.default[name] = obj[name];

    _underscore_js__WEBPACK_IMPORTED_MODULE_0__.default.prototype[name] = function () {
      var args = [this._wrapped];
      _setup_js__WEBPACK_IMPORTED_MODULE_3__.push.apply(args, arguments);
      return (0,_chainResult_js__WEBPACK_IMPORTED_MODULE_4__.default)(this, func.apply(_underscore_js__WEBPACK_IMPORTED_MODULE_0__.default, args));
    };
  });
  return _underscore_js__WEBPACK_IMPORTED_MODULE_0__.default;
}

/***/ }),

/***/ "./node_modules/underscore/modules/negate.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/negate.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ negate; }
/* harmony export */ });
// Returns a negated version of the passed-in predicate.
function negate(predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/noop.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/noop.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ noop; }
/* harmony export */ });
// Predicate-generating function. Often useful outside of Underscore.
function noop() {}

/***/ }),

/***/ "./node_modules/underscore/modules/now.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/now.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// A (possibly faster) way to get the current timestamp as an integer.
/* harmony default export */ __webpack_exports__["default"] = (Date.now || function () {
  return new Date().getTime();
});

/***/ }),

/***/ "./node_modules/underscore/modules/object.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/object.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ object; }
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
 // Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values. Passing by pairs is the reverse of `_.pairs`.

function object(list, values) {
  var result = {};

  for (var i = 0, length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__.default)(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i];
    } else {
      result[list[i][0]] = list[i][1];
    }
  }

  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/omit.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/omit.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _negate_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./negate.js */ "./node_modules/underscore/modules/negate.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");
/* harmony import */ var _pick_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pick.js */ "./node_modules/underscore/modules/pick.js");






 // Return a copy of the object without the disallowed properties.

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (obj, keys) {
  var iteratee = keys[0],
      context;

  if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__.default)(iteratee)) {
    iteratee = (0,_negate_js__WEBPACK_IMPORTED_MODULE_2__.default)(iteratee);
    if (keys.length > 1) context = keys[1];
  } else {
    keys = (0,_map_js__WEBPACK_IMPORTED_MODULE_3__.default)((0,_flatten_js__WEBPACK_IMPORTED_MODULE_4__.default)(keys, false, false), String);

    iteratee = function (value, key) {
      return !(0,_contains_js__WEBPACK_IMPORTED_MODULE_5__.default)(keys, key);
    };
  }

  return (0,_pick_js__WEBPACK_IMPORTED_MODULE_6__.default)(obj, iteratee, context);
}));

/***/ }),

/***/ "./node_modules/underscore/modules/once.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/once.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _partial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./partial.js */ "./node_modules/underscore/modules/partial.js");
/* harmony import */ var _before_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./before.js */ "./node_modules/underscore/modules/before.js");

 // Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.

/* harmony default export */ __webpack_exports__["default"] = ((0,_partial_js__WEBPACK_IMPORTED_MODULE_0__.default)(_before_js__WEBPACK_IMPORTED_MODULE_1__.default, 2));

/***/ }),

/***/ "./node_modules/underscore/modules/pairs.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/pairs.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ pairs; }
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
 // Convert an object into a list of `[key, value]` pairs.
// The opposite of `_.object` with one argument.

function pairs(obj) {
  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj);

  var length = _keys.length;
  var pairs = Array(length);

  for (var i = 0; i < length; i++) {
    pairs[i] = [_keys[i], obj[_keys[i]]];
  }

  return pairs;
}

/***/ }),

/***/ "./node_modules/underscore/modules/partial.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/partial.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _executeBound_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_executeBound.js */ "./node_modules/underscore/modules/_executeBound.js");
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");


 // Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. `_` acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.

var partial = (0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (func, boundArgs) {
  var placeholder = partial.placeholder;

  var bound = function () {
    var position = 0,
        length = boundArgs.length;
    var args = Array(length);

    for (var i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }

    while (position < arguments.length) args.push(arguments[position++]);

    return (0,_executeBound_js__WEBPACK_IMPORTED_MODULE_1__.default)(func, bound, this, this, args);
  };

  return bound;
});
partial.placeholder = _underscore_js__WEBPACK_IMPORTED_MODULE_2__.default;
/* harmony default export */ __webpack_exports__["default"] = (partial);

/***/ }),

/***/ "./node_modules/underscore/modules/partition.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/partition.js ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_group.js */ "./node_modules/underscore/modules/_group.js");
 // Split a collection into two arrays: one whose elements all pass the given
// truth test, and one whose elements all do not pass the truth test.

/* harmony default export */ __webpack_exports__["default"] = ((0,_group_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (result, value, pass) {
  result[pass ? 0 : 1].push(value);
}, true));

/***/ }),

/***/ "./node_modules/underscore/modules/pick.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/pick.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");
/* harmony import */ var _keyInObj_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_keyInObj.js */ "./node_modules/underscore/modules/_keyInObj.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");





 // Return a copy of the object only containing the allowed properties.

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (obj, keys) {
  var result = {},
      iteratee = keys[0];
  if (obj == null) return result;

  if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__.default)(iteratee)) {
    if (keys.length > 1) iteratee = (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_2__.default)(iteratee, keys[1]);
    keys = (0,_allKeys_js__WEBPACK_IMPORTED_MODULE_3__.default)(obj);
  } else {
    iteratee = _keyInObj_js__WEBPACK_IMPORTED_MODULE_4__.default;
    keys = (0,_flatten_js__WEBPACK_IMPORTED_MODULE_5__.default)(keys, false, false);
    obj = Object(obj);
  }

  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (iteratee(value, key, obj)) result[key] = value;
  }

  return result;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/pluck.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/pluck.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ pluck; }
/* harmony export */ });
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./property.js */ "./node_modules/underscore/modules/property.js");

 // Convenience version of a common use case of `_.map`: fetching a property.

function pluck(obj, key) {
  return (0,_map_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj, (0,_property_js__WEBPACK_IMPORTED_MODULE_1__.default)(key));
}

/***/ }),

/***/ "./node_modules/underscore/modules/property.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/property.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ property; }
/* harmony export */ });
/* harmony import */ var _deepGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_deepGet.js */ "./node_modules/underscore/modules/_deepGet.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");

 // Creates a function that, when passed an object, will traverse that object’s
// properties down the given `path`, specified as an array of keys or indices.

function property(path) {
  path = (0,_toPath_js__WEBPACK_IMPORTED_MODULE_1__.default)(path);
  return function (obj) {
    return (0,_deepGet_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj, path);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/propertyOf.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/propertyOf.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ propertyOf; }
/* harmony export */ });
/* harmony import */ var _noop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./noop.js */ "./node_modules/underscore/modules/noop.js");
/* harmony import */ var _get_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get.js */ "./node_modules/underscore/modules/get.js");

 // Generates a function for a given object that returns a given property.

function propertyOf(obj) {
  if (obj == null) return _noop_js__WEBPACK_IMPORTED_MODULE_0__.default;
  return function (path) {
    return (0,_get_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj, path);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/random.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/random.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ random; }
/* harmony export */ });
// Return a random integer between `min` and `max` (inclusive).
function random(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }

  return min + Math.floor(Math.random() * (max - min + 1));
}

/***/ }),

/***/ "./node_modules/underscore/modules/range.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/range.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ range; }
/* harmony export */ });
// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](https://docs.python.org/library/functions.html#range).
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }

  if (!step) {
    step = stop < start ? -1 : 1;
  }

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
}

/***/ }),

/***/ "./node_modules/underscore/modules/reduce.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/reduce.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createReduce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createReduce.js */ "./node_modules/underscore/modules/_createReduce.js");
 // **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createReduce_js__WEBPACK_IMPORTED_MODULE_0__.default)(1));

/***/ }),

/***/ "./node_modules/underscore/modules/reduceRight.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/reduceRight.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createReduce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createReduce.js */ "./node_modules/underscore/modules/_createReduce.js");
 // The right-associative version of reduce, also known as `foldr`.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createReduce_js__WEBPACK_IMPORTED_MODULE_0__.default)(-1));

/***/ }),

/***/ "./node_modules/underscore/modules/reject.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/reject.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ reject; }
/* harmony export */ });
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");
/* harmony import */ var _negate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./negate.js */ "./node_modules/underscore/modules/negate.js");
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");


 // Return all the elements for which a truth test fails.

function reject(obj, predicate, context) {
  return (0,_filter_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj, (0,_negate_js__WEBPACK_IMPORTED_MODULE_1__.default)((0,_cb_js__WEBPACK_IMPORTED_MODULE_2__.default)(predicate)), context);
}

/***/ }),

/***/ "./node_modules/underscore/modules/rest.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/rest.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ rest; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
 // Returns everything but the first entry of the `array`. Especially useful on
// the `arguments` object. Passing an **n** will return the rest N values in the
// `array`.

function rest(array, n, guard) {
  return _setup_js__WEBPACK_IMPORTED_MODULE_0__.slice.call(array, n == null || guard ? 1 : n);
}

/***/ }),

/***/ "./node_modules/underscore/modules/restArguments.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/restArguments.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ restArguments; }
/* harmony export */ });
// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;

    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }

    switch (startIndex) {
      case 0:
        return func.call(this, rest);

      case 1:
        return func.call(this, arguments[0], rest);

      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }

    var args = Array(startIndex + 1);

    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }

    args[startIndex] = rest;
    return func.apply(this, args);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/result.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/result.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ result; }
/* harmony export */ });
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");

 // Traverses the children of `obj` along `path`. If a child is a function, it
// is invoked with its parent as context. Returns the value of the final
// child, or `fallback` if any child is undefined.

function result(obj, path, fallback) {
  path = (0,_toPath_js__WEBPACK_IMPORTED_MODULE_1__.default)(path);
  var length = path.length;

  if (!length) {
    return (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_0__.default)(fallback) ? fallback.call(obj) : fallback;
  }

  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];

    if (prop === void 0) {
      prop = fallback;
      i = length; // Ensure we don't continue iterating.
    }

    obj = (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_0__.default)(prop) ? prop.call(obj) : prop;
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/sample.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/sample.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ sample; }
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _clone_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clone.js */ "./node_modules/underscore/modules/clone.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./random.js */ "./node_modules/underscore/modules/random.js");




 // Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `_.map`.

function sample(obj, n, guard) {
  if (n == null || guard) {
    if (!(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj)) obj = (0,_values_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj);
    return obj[(0,_random_js__WEBPACK_IMPORTED_MODULE_4__.default)(obj.length - 1)];
  }

  var sample = (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj) ? (0,_clone_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj) : (0,_values_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj);
  var length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_3__.default)(sample);
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;

  for (var index = 0; index < n; index++) {
    var rand = (0,_random_js__WEBPACK_IMPORTED_MODULE_4__.default)(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }

  return sample.slice(0, n);
}

/***/ }),

/***/ "./node_modules/underscore/modules/shuffle.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/shuffle.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ shuffle; }
/* harmony export */ });
/* harmony import */ var _sample_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sample.js */ "./node_modules/underscore/modules/sample.js");
 // Shuffle a collection.

function shuffle(obj) {
  return (0,_sample_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj, Infinity);
}

/***/ }),

/***/ "./node_modules/underscore/modules/size.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/size.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ size; }
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");

 // Return the number of elements in a collection.

function size(obj) {
  if (obj == null) return 0;
  return (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj) ? obj.length : (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj).length;
}

/***/ }),

/***/ "./node_modules/underscore/modules/some.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/some.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ some; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");


 // Determine if at least one element in the object passes a truth test.

function some(obj, predicate, context) {
  predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(predicate, context);

  var _keys = !(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__.default)(obj) && (0,_keys_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj),
      length = (_keys || obj).length;

  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }

  return false;
}

/***/ }),

/***/ "./node_modules/underscore/modules/sortBy.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/sortBy.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ sortBy; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _pluck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pluck.js */ "./node_modules/underscore/modules/pluck.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");


 // Sort the object's values by a criterion produced by an iteratee.

function sortBy(obj, iteratee, context) {
  var index = 0;
  iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(iteratee, context);
  return (0,_pluck_js__WEBPACK_IMPORTED_MODULE_1__.default)((0,_map_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj, function (value, key, list) {
    return {
      value: value,
      index: index++,
      criteria: iteratee(value, key, list)
    };
  }).sort(function (left, right) {
    var a = left.criteria;
    var b = right.criteria;

    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }

    return left.index - right.index;
  }), 'value');
}

/***/ }),

/***/ "./node_modules/underscore/modules/sortedIndex.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/sortedIndex.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ sortedIndex; }
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");

 // Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.

function sortedIndex(array, obj, iteratee, context) {
  iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__.default)(iteratee, context, 1);
  var value = iteratee(obj);
  var low = 0,
      high = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_1__.default)(array);

  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
  }

  return low;
}

/***/ }),

/***/ "./node_modules/underscore/modules/tap.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/tap.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ tap; }
/* harmony export */ });
// Invokes `interceptor` with the `obj` and then returns `obj`.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/template.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/template.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ template; }
/* harmony export */ });
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaults.js */ "./node_modules/underscore/modules/defaults.js");
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _templateSettings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./templateSettings.js */ "./node_modules/underscore/modules/templateSettings.js");


 // When customizing `_.templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.

var noMatch = /(.)^/; // Certain characters need to be escaped so that they can be put into a
// string literal.

var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};
var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

function escapeChar(match) {
  return '\\' + escapes[match];
} // In order to prevent third-party code injection through
// `_.templateSettings.variable`, we test it against the following regular
// expression. It is intentionally a bit more liberal than just matching valid
// identifiers, but still prevents possible loopholes through defaults or
// destructuring assignment.


var bareIdentifier = /^\s*(\w|\$)+\s*$/; // JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.

function template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = (0,_defaults_js__WEBPACK_IMPORTED_MODULE_0__.default)({}, settings, _underscore_js__WEBPACK_IMPORTED_MODULE_1__.default.templateSettings); // Combine delimiters into one regular expression via alternation.

  var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g'); // Compile the template source, escaping string literals appropriately.

  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    } // Adobe VMs need the match returned to produce the correct offset.


    return match;
  });
  source += "';\n";
  var argument = settings.variable;

  if (argument) {
    // Insure against third-party code injection. (CVE-2021-23358)
    if (!bareIdentifier.test(argument)) throw new Error('variable is not a bare identifier: ' + argument);
  } else {
    // If a variable is not specified, place data values in local scope.
    source = 'with(obj||{}){\n' + source + '}\n';
    argument = 'obj';
  }

  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
  var render;

  try {
    render = new Function(argument, '_', source);
  } catch (e) {
    e.source = source;
    throw e;
  }

  var template = function (data) {
    return render.call(this, data, _underscore_js__WEBPACK_IMPORTED_MODULE_1__.default);
  }; // Provide the compiled source as a convenience for precompilation.


  template.source = 'function(' + argument + '){\n' + source + '}';
  return template;
}

/***/ }),

/***/ "./node_modules/underscore/modules/templateSettings.js":
/*!*************************************************************!*\
  !*** ./node_modules/underscore/modules/templateSettings.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
 // By default, Underscore uses ERB-style template delimiters. Change the
// following template settings to use alternative delimiters.

/* harmony default export */ __webpack_exports__["default"] = (_underscore_js__WEBPACK_IMPORTED_MODULE_0__.default.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
});

/***/ }),

/***/ "./node_modules/underscore/modules/throttle.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/throttle.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ throttle; }
/* harmony export */ });
/* harmony import */ var _now_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./now.js */ "./node_modules/underscore/modules/now.js");
 // Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.

function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : (0,_now_js__WEBPACK_IMPORTED_MODULE_0__.default)();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var _now = (0,_now_js__WEBPACK_IMPORTED_MODULE_0__.default)();

    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

/***/ }),

/***/ "./node_modules/underscore/modules/times.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/times.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ times; }
/* harmony export */ });
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");
 // Run a function **n** times.

function times(n, iteratee, context) {
  var accum = Array(Math.max(0, n));
  iteratee = (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_0__.default)(iteratee, context, 1);

  for (var i = 0; i < n; i++) accum[i] = iteratee(i);

  return accum;
}

/***/ }),

/***/ "./node_modules/underscore/modules/toArray.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/toArray.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toArray; }
/* harmony export */ });
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isString.js */ "./node_modules/underscore/modules/isString.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./identity.js */ "./node_modules/underscore/modules/identity.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");






 // Safely create a real, live array from anything iterable.

var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function toArray(obj) {
  if (!obj) return [];
  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj)) return _setup_js__WEBPACK_IMPORTED_MODULE_1__.slice.call(obj);

  if ((0,_isString_js__WEBPACK_IMPORTED_MODULE_2__.default)(obj)) {
    // Keep surrogate pair characters together.
    return obj.match(reStrSymbol);
  }

  if ((0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_3__.default)(obj)) return (0,_map_js__WEBPACK_IMPORTED_MODULE_4__.default)(obj, _identity_js__WEBPACK_IMPORTED_MODULE_5__.default);
  return (0,_values_js__WEBPACK_IMPORTED_MODULE_6__.default)(obj);
}

/***/ }),

/***/ "./node_modules/underscore/modules/toPath.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/toPath.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toPath; }
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");

 // Normalize a (deep) property `path` to array.
// Like `_.iteratee`, this function can be customized.

function toPath(path) {
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__.default)(path) ? path : [path];
}
_underscore_js__WEBPACK_IMPORTED_MODULE_0__.default.toPath = toPath;

/***/ }),

/***/ "./node_modules/underscore/modules/underscore-array-methods.js":
/*!*********************************************************************!*\
  !*** ./node_modules/underscore/modules/underscore-array-methods.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _chainResult_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_chainResult.js */ "./node_modules/underscore/modules/_chainResult.js");



 // Add all mutator `Array` functions to the wrapper.

(0,_each_js__WEBPACK_IMPORTED_MODULE_1__.default)(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
  var method = _setup_js__WEBPACK_IMPORTED_MODULE_2__.ArrayProto[name];

  _underscore_js__WEBPACK_IMPORTED_MODULE_0__.default.prototype[name] = function () {
    var obj = this._wrapped;

    if (obj != null) {
      method.apply(obj, arguments);

      if ((name === 'shift' || name === 'splice') && obj.length === 0) {
        delete obj[0];
      }
    }

    return (0,_chainResult_js__WEBPACK_IMPORTED_MODULE_3__.default)(this, obj);
  };
}); // Add all accessor `Array` functions to the wrapper.

(0,_each_js__WEBPACK_IMPORTED_MODULE_1__.default)(['concat', 'join', 'slice'], function (name) {
  var method = _setup_js__WEBPACK_IMPORTED_MODULE_2__.ArrayProto[name];

  _underscore_js__WEBPACK_IMPORTED_MODULE_0__.default.prototype[name] = function () {
    var obj = this._wrapped;
    if (obj != null) obj = method.apply(obj, arguments);
    return (0,_chainResult_js__WEBPACK_IMPORTED_MODULE_3__.default)(this, obj);
  };
});
/* harmony default export */ __webpack_exports__["default"] = (_underscore_js__WEBPACK_IMPORTED_MODULE_0__.default);

/***/ }),

/***/ "./node_modules/underscore/modules/underscore.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/underscore.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _; }
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
 // If Underscore is called as a function, it returns a wrapped object that can
// be used OO-style. This wrapper holds altered versions of all functions added
// through `_.mixin`. Wrapped objects may be chained.

function _(obj) {
  if (obj instanceof _) return obj;
  if (!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
}
_.VERSION = _setup_js__WEBPACK_IMPORTED_MODULE_0__.VERSION; // Extracts the result from a wrapped and chained object.

_.prototype.value = function () {
  return this._wrapped;
}; // Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.


_.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

_.prototype.toString = function () {
  return String(this._wrapped);
};

/***/ }),

/***/ "./node_modules/underscore/modules/unescape.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/unescape.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createEscaper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createEscaper.js */ "./node_modules/underscore/modules/_createEscaper.js");
/* harmony import */ var _unescapeMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_unescapeMap.js */ "./node_modules/underscore/modules/_unescapeMap.js");

 // Function for unescaping strings from HTML interpolation.

/* harmony default export */ __webpack_exports__["default"] = ((0,_createEscaper_js__WEBPACK_IMPORTED_MODULE_0__.default)(_unescapeMap_js__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./node_modules/underscore/modules/union.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/union.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _uniq_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./uniq.js */ "./node_modules/underscore/modules/uniq.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");


 // Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (arrays) {
  return (0,_uniq_js__WEBPACK_IMPORTED_MODULE_1__.default)((0,_flatten_js__WEBPACK_IMPORTED_MODULE_2__.default)(arrays, true, true));
}));

/***/ }),

/***/ "./node_modules/underscore/modules/uniq.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/uniq.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ uniq; }
/* harmony export */ });
/* harmony import */ var _isBoolean_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isBoolean.js */ "./node_modules/underscore/modules/isBoolean.js");
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");



 // Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.

function uniq(array, isSorted, iteratee, context) {
  if (!(0,_isBoolean_js__WEBPACK_IMPORTED_MODULE_0__.default)(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }

  if (iteratee != null) iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_1__.default)(iteratee, context);
  var result = [];
  var seen = [];

  for (var i = 0, length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_2__.default)(array); i < length; i++) {
    var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;

    if (isSorted && !iteratee) {
      if (!i || seen !== computed) result.push(value);
      seen = computed;
    } else if (iteratee) {
      if (!(0,_contains_js__WEBPACK_IMPORTED_MODULE_3__.default)(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!(0,_contains_js__WEBPACK_IMPORTED_MODULE_3__.default)(result, value)) {
      result.push(value);
    }
  }

  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/uniqueId.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/uniqueId.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ uniqueId; }
/* harmony export */ });
// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
}

/***/ }),

/***/ "./node_modules/underscore/modules/unzip.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/unzip.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ unzip; }
/* harmony export */ });
/* harmony import */ var _max_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./max.js */ "./node_modules/underscore/modules/max.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _pluck_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pluck.js */ "./node_modules/underscore/modules/pluck.js");


 // Complement of zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.

function unzip(array) {
  var length = array && (0,_max_js__WEBPACK_IMPORTED_MODULE_0__.default)(array, _getLength_js__WEBPACK_IMPORTED_MODULE_1__.default).length || 0;
  var result = Array(length);

  for (var index = 0; index < length; index++) {
    result[index] = (0,_pluck_js__WEBPACK_IMPORTED_MODULE_2__.default)(array, index);
  }

  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/values.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/values.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ values; }
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
 // Retrieve the values of an object's properties.

function values(obj) {
  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj);

  var length = _keys.length;
  var values = Array(length);

  for (var i = 0; i < length; i++) {
    values[i] = obj[_keys[i]];
  }

  return values;
}

/***/ }),

/***/ "./node_modules/underscore/modules/where.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/where.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ where; }
/* harmony export */ });
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matcher.js */ "./node_modules/underscore/modules/matcher.js");

 // Convenience version of a common use case of `_.filter`: selecting only
// objects containing specific `key:value` pairs.

function where(obj, attrs) {
  return (0,_filter_js__WEBPACK_IMPORTED_MODULE_0__.default)(obj, (0,_matcher_js__WEBPACK_IMPORTED_MODULE_1__.default)(attrs));
}

/***/ }),

/***/ "./node_modules/underscore/modules/without.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/without.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _difference_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./difference.js */ "./node_modules/underscore/modules/difference.js");

 // Return a version of the array that does not contain the specified value(s).

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(function (array, otherArrays) {
  return (0,_difference_js__WEBPACK_IMPORTED_MODULE_1__.default)(array, otherArrays);
}));

/***/ }),

/***/ "./node_modules/underscore/modules/wrap.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/wrap.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ wrap; }
/* harmony export */ });
/* harmony import */ var _partial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./partial.js */ "./node_modules/underscore/modules/partial.js");
 // Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.

function wrap(func, wrapper) {
  return (0,_partial_js__WEBPACK_IMPORTED_MODULE_0__.default)(wrapper, func);
}

/***/ }),

/***/ "./node_modules/underscore/modules/zip.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/zip.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _unzip_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./unzip.js */ "./node_modules/underscore/modules/unzip.js");

 // Zip together multiple lists into a single array -- elements that share
// an index go together.

/* harmony default export */ __webpack_exports__["default"] = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__.default)(_unzip_js__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./src/scripts/data_builder.js":
/*!*************************************!*\
  !*** ./src/scripts/data_builder.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "allCredits": function() { return /* binding */ allCredits; },
/* harmony export */   "creditsParser": function() { return /* binding */ creditsParser; }
/* harmony export */ });
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/scripts/utils.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! underscore */ "./node_modules/underscore/modules/index-all.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }




var allCredits = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(searchQuery) {
    var role,
        input,
        filmography,
        filmObj,
        id,
        film,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            role = _args.length > 1 && _args[1] !== undefined ? _args[1] : "Director";
            //cast and crew of every movie a director's made
            input = searchQuery.name || searchQuery.nameId;
            _context.next = 4;
            return _utils__WEBPACK_IMPORTED_MODULE_1__.getFilmography(input, role);

          case 4:
            filmography = _context.sent;
            filmObj = {};
            _context.next = 8;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });

          case 8:
            for (id in filmography.movies) {
              film = filmography.movies[id];
              filmObj[film.id] = {
                title: film.title,
                id: film.id,
                overview: film.overview,
                genre_ids: film.genre_ids,
                credit_id: film.credit_id,
                cast: filmography.credits[film.id].cast,
                crew: filmography.credits[film.id].crew
              };
            }

            return _context.abrupt("return", filmObj);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function allCredits(_x) {
    return _ref.apply(this, arguments);
  };
}();
var creditsParser = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(input) {
    var role,
        cast,
        castObj,
        crew,
        crewObj,
        counter,
        allFilmCredits,
        arr,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            role = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "Director";
            cast = [];
            castObj = {};
            crew = [];
            crewObj = {};
            counter = {};
            _context2.next = 8;
            return allCredits({
              name: input
            }, role).then(function (resp) {
              return resp;
            });

          case 8:
            allFilmCredits = _context2.sent;
            arr = Object.values(allFilmCredits);
            arr.forEach(function (movie) {
              movie.cast.forEach(function (person) {
                return cast.push(person.name);
              });
              movie.crew.forEach(function (person) {
                return crew.push(person.name);
              });
            });
            cast.forEach(function (person) {
              if (castObj[person] === undefined) {
                castObj[person] = 1;
              } else {
                castObj[person] += 1;
              }
            });
            crew.forEach(function (person) {
              if (crewObj[person] === undefined) {
                crewObj[person] = 1;
              } else {
                crewObj[person] += 1;
              }
            });
            counter.castUnique = Object.values(castObj).length;
            counter.castAll = cast.length;
            counter.familiarCast = "".concat(parseFloat(Math.abs(counter.castUnique - counter.castAll) / counter.castAll * 100).toFixed(2), "%");
            counter.crewUnique = Object.values(crewObj).length;
            counter.crewAll = crew.length;
            counter.familiarCrew = "".concat(parseFloat(Math.abs(counter.crewUnique - counter.crewAll) / counter.crewAll * 100).toFixed(2), "%");
            return _context2.abrupt("return", {
              movies: allFilmCredits,
              allCast: cast,
              allCastUniques: castObj,
              allCrew: crew,
              allCrewUniques: crewObj,
              counter: counter
            });

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function creditsParser(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./src/scripts/utils.js":
/*!******************************!*\
  !*** ./src/scripts/utils.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "searchPerson": function() { return /* binding */ searchPerson; },
/* harmony export */   "sleep": function() { return /* binding */ sleep; },
/* harmony export */   "getFilmography": function() { return /* binding */ getFilmography; },
/* harmony export */   "searchMovie": function() { return /* binding */ searchMovie; },
/* harmony export */   "getMovieCredits": function() { return /* binding */ getMovieCredits; }
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var api_key = "9c9d46fba5cd7cda8a027831ee64f45e";
var searchPerson = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name) {
    var role,
        searchUrl,
        personResults,
        json,
        person,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            role = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'Directing';
            searchUrl = "https://api.themoviedb.org/3/search/person?api_key=".concat(api_key, "&language=en-US&query=").concat(name.replace(' ', '%20'), "&page=1&include_adult=false");
            _context.prev = 2;
            _context.next = 5;
            return fetch(searchUrl, {
              method: 'GET'
            });

          case 5:
            personResults = _context.sent;
            _context.next = 8;
            return personResults.json();

          case 8:
            json = _context.sent;
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](2);
            debugger;
            console.log(_context.t0);

          case 15:
            debugger;
            json.results.length > 1 ? person = json.results.filter(function (person) {
              return RegExp("\\b".concat(name, "\\b"), 'gi').test(person.name);
            }) //filter out names that dont match (case-insensitive)
            .sort(function (a, b) {
              return b.popularity - a.popularity;
            }) : //results might return sorted by popularity by default, but just to make sure
            person = json.results[0];
            person.length === 0 ? person = json.results[0] : person;
            return _context.abrupt("return", Array.isArray(person) && person.length > 0 ? person[0] : person);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 11]]);
  }));

  return function searchPerson(_x) {
    return _ref.apply(this, arguments);
  };
}();
var sleep = function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};
var getFilmography = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(input) {
    var role,
        searchVar,
        searchUrl,
        searchResults,
        searchJson,
        results,
        resultsObj,
        creditsObj,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            role = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "Director";

            if (!(typeof input === 'string')) {
              _context4.next = 7;
              break;
            }

            _context4.next = 4;
            return searchPerson(input).then(function (resp) {
              return resp.id;
            });

          case 4:
            _context4.t0 = _context4.sent;
            _context4.next = 8;
            break;

          case 7:
            _context4.t0 = input;

          case 8:
            searchVar = _context4.t0;
            searchUrl = "https://api.themoviedb.org/3/person/".concat(searchVar, "/movie_credits?api_key=").concat(api_key, "&language=en-US");
            _context4.next = 12;
            return fetch(searchUrl, {
              method: 'GET'
            });

          case 12:
            searchResults = _context4.sent;
            _context4.next = 15;
            return searchResults.json();

          case 15:
            searchJson = _context4.sent;
            _context4.next = 18;
            return searchJson.crew.filter(function (movie) {
              return movie.job === role && //filter for role passed in from original function call. Director by default
              movie.release_date !== "" //"real" movies will have release dates
              && movie.video !== true;
            }) //"video" field is true when its not a studio film
            .sort(function (a, b) {
              return new Date(b.release_date) - new Date(a.release_date);
            });

          case 18:
            results = _context4.sent;
            //sort new->old
            resultsObj = {};
            creditsObj = {};
            sleep(100).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return results.forEach( /*#__PURE__*/function () {
                        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(movie) {
                          return regeneratorRuntime.wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  resultsObj[movie.id] = movie;
                                  _context2.next = 3;
                                  return getMovieCredits(movie.id);

                                case 3:
                                  creditsObj[movie.id] = _context2.sent;

                                case 4:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2);
                        }));

                        return function (_x3) {
                          return _ref4.apply(this, arguments);
                        };
                      }());

                    case 2:
                      return _context3.abrupt("return", resultsObj = _context3.sent);

                    case 3:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })));
            return _context4.abrupt("return", {
              movies: resultsObj,
              credits: creditsObj
            });

          case 23:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getFilmography(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var searchMovie = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(movieTitle) {
    var searchUrl, movieResults;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            //format movieTitles like 'The+Interpreter'
            searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=".concat(api_key, "&language=en-US&query=").concat(movieTitle.replace(' ', '%20'), "&page=1&include_adult=false");
            _context5.next = 3;
            return fetch(searchUrl, {
              method: 'GET'
            });

          case 3:
            movieResults = _context5.sent;
            return _context5.abrupt("return", movieResults.json());

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function searchMovie(_x4) {
    return _ref5.apply(this, arguments);
  };
}();
var getMovieCredits = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(input) {
    var searchVar, credits_url, credits;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!(input === _typeof('string'))) {
              _context6.next = 6;
              break;
            }

            _context6.next = 3;
            return searchMovie(input).then(function (resp) {
              return resp.results[0].id;
            });

          case 3:
            _context6.t0 = _context6.sent;
            _context6.next = 7;
            break;

          case 6:
            _context6.t0 = input;

          case 7:
            searchVar = _context6.t0;
            credits_url = "https://api.themoviedb.org/3/movie/".concat(searchVar, "/credits?api_key=").concat(api_key, "&language=en-US");
            _context6.next = 11;
            return fetch(credits_url, {
              method: 'GET'
            });

          case 11:
            credits = _context6.sent;
            return _context6.abrupt("return", credits.json());

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getMovieCredits(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scripts_data_builder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scripts/data_builder */ "./src/scripts/data_builder.js");

(0,_scripts_data_builder__WEBPACK_IMPORTED_MODULE_0__.creditsParser)('Martin Scorsse', 'Director').then(function (data) {
  return console.log('Scorsese:', {
    cast: data.counter.familiarCast,
    crew: data.counter.familiarCrew
  });
}); // creditsParser('Alfred Hitchcock', 'Director').then(data => console.log( 'Hitchcock:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
// creditsParser('Stanley Kubrick', 'Director').then(data => console.log( 'Kubrick:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew } ))
// creditsParser('Clint Eastwood', 'Director').then(data => console.log('Eastwood:', {cast: data.counter.familiarCast, crew: data.counter.familiarCrew}))
// creditsParser('Christopher Nolan', 'Director').then(data => console.log('Nolan:', {cast: data.counter.familiarCast, crew: data.counter.familiarCrew}))
// creditsParser('David Lowery', 'Director').then(data => console.log('Lowery:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
// creditsParser('Chloe Zhao', 'Director').then(data => console.log('Zhao:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9fYmFzZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9fYmFzZUl0ZXJhdGVlLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19jYi5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9fY2hhaW5SZXN1bHQuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX2NvbGxlY3ROb25FbnVtUHJvcHMuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX2NyZWF0ZUFzc2lnbmVyLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19jcmVhdGVFc2NhcGVyLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19jcmVhdGVJbmRleEZpbmRlci5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9fY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX2NyZWF0ZVJlZHVjZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9fY3JlYXRlU2l6ZVByb3BlcnR5Q2hlY2suanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX2RlZXBHZXQuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX2VzY2FwZU1hcC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9fZXhlY3V0ZUJvdW5kLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19mbGF0dGVuLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19nZXRCeXRlTGVuZ3RoLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19nZXRMZW5ndGguanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX2dyb3VwLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19oYXMuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX2hhc09iamVjdFRhZy5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9faXNBcnJheUxpa2UuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX2lzQnVmZmVyTGlrZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9fa2V5SW5PYmouanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX21ldGhvZEZpbmdlcnByaW50LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19vcHRpbWl6ZUNiLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19zZXR1cC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9fc2hhbGxvd1Byb3BlcnR5LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL19zdHJpbmdUYWdCdWcuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX3RhZ1Rlc3Rlci5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9fdG9CdWZmZXJWaWV3LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL190b1BhdGguanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvX3VuZXNjYXBlTWFwLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2FmdGVyLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2FsbEtleXMuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvYmVmb3JlLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvYmluZEFsbC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9jaGFpbi5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9jaHVuay5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9jbG9uZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9jb21wYWN0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2NvbXBvc2UuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvY29uc3RhbnQuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvY29udGFpbnMuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvY291bnRCeS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvZGVmZXIuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvZGVsYXkuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvZGlmZmVyZW5jZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9lYWNoLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2VzY2FwZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9ldmVyeS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9leHRlbmQuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvZXh0ZW5kT3duLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2ZpbHRlci5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9maW5kLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2ZpbmRJbmRleC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9maW5kS2V5LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2ZpbmRMYXN0SW5kZXguanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvZmluZFdoZXJlLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2ZpcnN0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2ZsYXR0ZW4uanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvZnVuY3Rpb25zLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2dldC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9ncm91cEJ5LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2hhcy5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pZGVudGl0eS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pbmRleC1hbGwuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvaW5kZXgtZGVmYXVsdC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pbmRleEJ5LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvaW5pdGlhbC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pbnRlcnNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvaW52ZXJ0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2ludm9rZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pc0FycmF5LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzQXJyYXlCdWZmZXIuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvaXNCb29sZWFuLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzRGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvaXNEYXRlLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pc0VtcHR5LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzRXF1YWwuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvaXNFcnJvci5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pc0Zpbml0ZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pc0Z1bmN0aW9uLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzTWFwLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzTWF0Y2guanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvaXNOYU4uanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvaXNOdWxsLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzTnVtYmVyLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzT2JqZWN0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzUmVnRXhwLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzU2V0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzU3RyaW5nLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzU3ltYm9sLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2lzVHlwZWRBcnJheS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pc1VuZGVmaW5lZC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9pc1dlYWtNYXAuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvaXNXZWFrU2V0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2l0ZXJhdGVlLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL2tleXMuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvbGFzdC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9sYXN0SW5kZXhPZi5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9tYXAuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvbWFwT2JqZWN0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL21hdGNoZXIuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvbWF4LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL21lbW9pemUuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvbWluLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL21peGluLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL25lZ2F0ZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9ub29wLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL25vdy5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9vYmplY3QuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvb21pdC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9vbmNlLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3BhaXJzLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3BhcnRpYWwuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvcGFydGl0aW9uLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3BpY2suanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvcGx1Y2suanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvcHJvcGVydHlPZi5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvcmFuZ2UuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvcmVkdWNlLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3JlZHVjZVJpZ2h0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3JlamVjdC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9yZXN0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3Jlc3RBcmd1bWVudHMuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvcmVzdWx0LmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3NhbXBsZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9zaHVmZmxlLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3NpemUuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvc29tZS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy9zb3J0QnkuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvc29ydGVkSW5kZXguanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvdGFwLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3RlbXBsYXRlLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3RlbXBsYXRlU2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvdGltZXMuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvdG9BcnJheS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy90b1BhdGguanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvdW5kZXJzY29yZS1hcnJheS1tZXRob2RzLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3VuZGVyc2NvcmUuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvdW5lc2NhcGUuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvdW5pb24uanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvdW5pcS5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy91bmlxdWVJZC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy91bnppcC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy92YWx1ZXMuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvd2hlcmUuanMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi8uL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL21vZHVsZXMvd2l0aG91dC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvbW9kdWxlcy93cmFwLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS9tb2R1bGVzL3ppcC5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vc3JjL3NjcmlwdHMvZGF0YV9idWlsZGVyLmpzIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vLi9zcmMvc2NyaXB0cy91dGlscy5qcyIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vanNfcHJvamVjdF9za2VsZXRvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2pzX3Byb2plY3Rfc2tlbGV0b24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9qc19wcm9qZWN0X3NrZWxldG9uLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImFsbENyZWRpdHMiLCJzZWFyY2hRdWVyeSIsInJvbGUiLCJpbnB1dCIsIm5hbWUiLCJuYW1lSWQiLCJ0bWRiIiwiZmlsbW9ncmFwaHkiLCJmaWxtT2JqIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiaWQiLCJtb3ZpZXMiLCJmaWxtIiwidGl0bGUiLCJvdmVydmlldyIsImdlbnJlX2lkcyIsImNyZWRpdF9pZCIsImNhc3QiLCJjcmVkaXRzIiwiY3JldyIsImNyZWRpdHNQYXJzZXIiLCJjYXN0T2JqIiwiY3Jld09iaiIsImNvdW50ZXIiLCJ0aGVuIiwicmVzcCIsImFsbEZpbG1DcmVkaXRzIiwiYXJyIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsIm1vdmllIiwicGVyc29uIiwicHVzaCIsInVuZGVmaW5lZCIsImNhc3RVbmlxdWUiLCJsZW5ndGgiLCJjYXN0QWxsIiwiZmFtaWxpYXJDYXN0IiwicGFyc2VGbG9hdCIsIk1hdGgiLCJhYnMiLCJ0b0ZpeGVkIiwiY3Jld1VuaXF1ZSIsImNyZXdBbGwiLCJmYW1pbGlhckNyZXciLCJhbGxDYXN0IiwiYWxsQ2FzdFVuaXF1ZXMiLCJhbGxDcmV3IiwiYWxsQ3Jld1VuaXF1ZXMiLCJhcGlfa2V5Iiwic2VhcmNoUGVyc29uIiwic2VhcmNoVXJsIiwicmVwbGFjZSIsImZldGNoIiwibWV0aG9kIiwicGVyc29uUmVzdWx0cyIsImpzb24iLCJjb25zb2xlIiwibG9nIiwicmVzdWx0cyIsImZpbHRlciIsIlJlZ0V4cCIsInRlc3QiLCJzb3J0IiwiYSIsImIiLCJwb3B1bGFyaXR5IiwiQXJyYXkiLCJpc0FycmF5Iiwic2xlZXAiLCJtcyIsImdldEZpbG1vZ3JhcGh5Iiwic2VhcmNoVmFyIiwic2VhcmNoUmVzdWx0cyIsInNlYXJjaEpzb24iLCJqb2IiLCJyZWxlYXNlX2RhdGUiLCJ2aWRlbyIsIkRhdGUiLCJyZXN1bHRzT2JqIiwiY3JlZGl0c09iaiIsImdldE1vdmllQ3JlZGl0cyIsInNlYXJjaE1vdmllIiwibW92aWVUaXRsZSIsIm1vdmllUmVzdWx0cyIsImNyZWRpdHNfdXJsIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCOztBQUVoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0Qzs7QUFFQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLDBDQUEwQztBQUMxQzs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx5REFBeUQ7QUFDekQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZHQUE2RztBQUM3Rzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHdDQUF3QztBQUN4QywyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULG9DQUFvQztBQUNwQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILG9DQUFvQyxjQUFjO0FBQ2xEO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7O0FBRWhELHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQUdBO0FBQ0E7QUFDQSxHQUFHLGdDQUFnQyxrQkFBa0I7QUFDckQ7OztBQUdBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FB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SEk7O0FBQUE7QUFHekJyQyxtQkFIeUI7QUFBQSw4Q0FNdEJBLE9BQU8sQ0FBQ3VDLElBQVIsRUFOc0I7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBZnlCLGVBQWU7QUFBQTtBQUFBO0FBQUEsR0FBckIsQzs7Ozs7O1VDOURQO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBLGNBQWMsMEJBQTBCLEVBQUU7V0FDMUMsY0FBYyxlQUFlO1dBQzdCLGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsNkNBQTZDLHdEQUF3RCxFOzs7OztXQ0FyRztXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7OztBQ05BO0FBRUE5RCxvRUFBYSxDQUFDLGdCQUFELEVBQW1CLFVBQW5CLENBQWIsQ0FBNENJLElBQTVDLENBQWlELFVBQUErRCxJQUFJO0FBQUEsU0FBSTdCLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFdBQVosRUFBd0I7QUFBRTFDLFFBQUksRUFBRXNFLElBQUksQ0FBQ2hFLE9BQUwsQ0FBYWUsWUFBckI7QUFBbUNuQixRQUFJLEVBQUVvRSxJQUFJLENBQUNoRSxPQUFMLENBQWFzQjtBQUF0RCxHQUF4QixDQUFKO0FBQUEsQ0FBckQsRSxDQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtSiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xudmFyIHJ1bnRpbWUgPSBmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBJRSA4IGhhcyBhIGJyb2tlbiBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhhdCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLlxuICAgIGRlZmluZSh7fSwgXCJcIik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGRlZmluZSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTsgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cblxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG5cbiAgZXhwb3J0cy53cmFwID0gd3JhcDsgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBcIm5vcm1hbFwiLFxuICAgICAgICBhcmc6IGZuLmNhbGwob2JqLCBhcmcpXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogXCJ0aHJvd1wiLFxuICAgICAgICBhcmc6IGVyclxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7IC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307IC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cblxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cblxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9IC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cblxuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcblxuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiYgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID0gR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IGRlZmluZShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIik7IC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24gKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvciA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8IC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgZGVmaW5lKGdlbkZ1biwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIik7XG4gICAgfVxuXG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07IC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG5cblxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICBfX2F3YWl0OiBhcmdcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcblxuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbiAodW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9IC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZywgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfSAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuXG5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcblxuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yOyAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cblxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24gKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcih3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSwgUHJvbWlzZUltcGwpO1xuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbikgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9IC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcblxuXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG5cbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lID8gR2VuU3RhdGVDb21wbGV0ZWQgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7IC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG5cblxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcblxuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoIWluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7IC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cblxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYzsgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH0gLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuXG5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfSAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG5cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTsgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHtcbiAgICAgIHRyeUxvYzogbG9jc1swXVxuICAgIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3tcbiAgICAgIHRyeUxvYzogXCJyb290XCJcbiAgICB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuXG4gICAga2V5cy5yZXZlcnNlKCk7IC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuXG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfSAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cblxuXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcblxuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH0gLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZG9uZVJlc3VsdFxuICAgIH07XG4gIH1cblxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgZG9uZTogdHJ1ZVxuICAgIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcbiAgICByZXNldDogZnVuY3Rpb24gKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwOyAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cblxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJiBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJiAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24gKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYWJydXB0OiBmdW5jdGlvbiAodHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJiBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJiAodHlwZSA9PT0gXCJicmVha1wiIHx8IHR5cGUgPT09IFwiY29udGludWVcIikgJiYgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiYgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uIChyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fCByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcbiAgICBmaW5pc2g6IGZ1bmN0aW9uIChmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblxuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uICh0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfSAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cblxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbiAoaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTsgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG5cbiAgcmV0dXJuIGV4cG9ydHM7XG59KCAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbi8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbi8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG50eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufSIsImltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCB7IG5hdGl2ZUNyZWF0ZSB9IGZyb20gJy4vX3NldHVwLmpzJzsgLy8gQ3JlYXRlIGEgbmFrZWQgZnVuY3Rpb24gcmVmZXJlbmNlIGZvciBzdXJyb2dhdGUtcHJvdG90eXBlLXN3YXBwaW5nLlxuXG5mdW5jdGlvbiBjdG9yKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge307XG59IC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIGFub3RoZXIuXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmFzZUNyZWF0ZShwcm90b3R5cGUpIHtcbiAgaWYgKCFpc09iamVjdChwcm90b3R5cGUpKSByZXR1cm4ge307XG4gIGlmIChuYXRpdmVDcmVhdGUpIHJldHVybiBuYXRpdmVDcmVhdGUocHJvdG90eXBlKTtcbiAgdmFyIEN0b3IgPSBjdG9yKCk7XG4gIEN0b3IucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICB2YXIgcmVzdWx0ID0gbmV3IEN0b3IoKTtcbiAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICByZXR1cm4gcmVzdWx0O1xufSIsImltcG9ydCBpZGVudGl0eSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXkuanMnO1xuaW1wb3J0IG1hdGNoZXIgZnJvbSAnLi9tYXRjaGVyLmpzJztcbmltcG9ydCBwcm9wZXJ0eSBmcm9tICcuL3Byb3BlcnR5LmpzJztcbmltcG9ydCBvcHRpbWl6ZUNiIGZyb20gJy4vX29wdGltaXplQ2IuanMnOyAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBjYWxsYmFja3MgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBlYWNoXG4vLyBlbGVtZW50IGluIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIHRoZSBkZXNpcmVkIHJlc3VsdCDigJQgZWl0aGVyIGBfLmlkZW50aXR5YCxcbi8vIGFuIGFyYml0cmFyeSBjYWxsYmFjaywgYSBwcm9wZXJ0eSBtYXRjaGVyLCBvciBhIHByb3BlcnR5IGFjY2Vzc29yLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiYXNlSXRlcmF0ZWUodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gaWRlbnRpdHk7XG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiAhaXNBcnJheSh2YWx1ZSkpIHJldHVybiBtYXRjaGVyKHZhbHVlKTtcbiAgcmV0dXJuIHByb3BlcnR5KHZhbHVlKTtcbn0iLCJpbXBvcnQgXyBmcm9tICcuL3VuZGVyc2NvcmUuanMnO1xuaW1wb3J0IGJhc2VJdGVyYXRlZSBmcm9tICcuL19iYXNlSXRlcmF0ZWUuanMnO1xuaW1wb3J0IGl0ZXJhdGVlIGZyb20gJy4vaXRlcmF0ZWUuanMnOyAvLyBUaGUgZnVuY3Rpb24gd2UgY2FsbCBpbnRlcm5hbGx5IHRvIGdlbmVyYXRlIGEgY2FsbGJhY2suIEl0IGludm9rZXNcbi8vIGBfLml0ZXJhdGVlYCBpZiBvdmVycmlkZGVuLCBvdGhlcndpc2UgYGJhc2VJdGVyYXRlZWAuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNiKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICBpZiAoXy5pdGVyYXRlZSAhPT0gaXRlcmF0ZWUpIHJldHVybiBfLml0ZXJhdGVlKHZhbHVlLCBjb250ZXh0KTtcbiAgcmV0dXJuIGJhc2VJdGVyYXRlZSh2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpO1xufSIsImltcG9ydCBfIGZyb20gJy4vdW5kZXJzY29yZS5qcyc7IC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2hhaW5SZXN1bHQoaW5zdGFuY2UsIG9iaikge1xuICByZXR1cm4gaW5zdGFuY2UuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG59IiwiaW1wb3J0IHsgbm9uRW51bWVyYWJsZVByb3BzLCBPYmpQcm90byB9IGZyb20gJy4vX3NldHVwLmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaGFzIGZyb20gJy4vX2hhcy5qcyc7IC8vIEludGVybmFsIGhlbHBlciB0byBjcmVhdGUgYSBzaW1wbGUgbG9va3VwIHN0cnVjdHVyZS5cbi8vIGBjb2xsZWN0Tm9uRW51bVByb3BzYCB1c2VkIHRvIGRlcGVuZCBvbiBgXy5jb250YWluc2AsIGJ1dCB0aGlzIGxlZCB0b1xuLy8gY2lyY3VsYXIgaW1wb3J0cy4gYGVtdWxhdGVkU2V0YCBpcyBhIG9uZS1vZmYgc29sdXRpb24gdGhhdCBvbmx5IHdvcmtzIGZvclxuLy8gYXJyYXlzIG9mIHN0cmluZ3MuXG5cbmZ1bmN0aW9uIGVtdWxhdGVkU2V0KGtleXMpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBmb3IgKHZhciBsID0ga2V5cy5sZW5ndGgsIGkgPSAwOyBpIDwgbDsgKytpKSBoYXNoW2tleXNbaV1dID0gdHJ1ZTtcblxuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gaGFzaFtrZXldO1xuICAgIH0sXG4gICAgcHVzaDogZnVuY3Rpb24gKGtleSkge1xuICAgICAgaGFzaFtrZXldID0gdHJ1ZTtcbiAgICAgIHJldHVybiBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gIH07XG59IC8vIEludGVybmFsIGhlbHBlci4gQ2hlY2tzIGBrZXlzYCBmb3IgdGhlIHByZXNlbmNlIG9mIGtleXMgaW4gSUUgPCA5IHRoYXQgd29uJ3Rcbi8vIGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLiBFeHRlbmRzIGBrZXlzYCBpbiBwbGFjZSBpZlxuLy8gbmVlZGVkLlxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKSB7XG4gIGtleXMgPSBlbXVsYXRlZFNldChrZXlzKTtcbiAgdmFyIG5vbkVudW1JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoO1xuICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gIHZhciBwcm90byA9IGlzRnVuY3Rpb24oY29uc3RydWN0b3IpICYmIGNvbnN0cnVjdG9yLnByb3RvdHlwZSB8fCBPYmpQcm90bzsgLy8gQ29uc3RydWN0b3IgaXMgYSBzcGVjaWFsIGNhc2UuXG5cbiAgdmFyIHByb3AgPSAnY29uc3RydWN0b3InO1xuICBpZiAoaGFzKG9iaiwgcHJvcCkgJiYgIWtleXMuY29udGFpbnMocHJvcCkpIGtleXMucHVzaChwcm9wKTtcblxuICB3aGlsZSAobm9uRW51bUlkeC0tKSB7XG4gICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tub25FbnVtSWR4XTtcblxuICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gIT09IHByb3RvW3Byb3BdICYmICFrZXlzLmNvbnRhaW5zKHByb3ApKSB7XG4gICAgICBrZXlzLnB1c2gocHJvcCk7XG4gICAgfVxuICB9XG59IiwiLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFzc2lnbmVyIGZ1bmN0aW9ucy5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGtleXNGdW5jLCBkZWZhdWx0cykge1xuICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmIChkZWZhdWx0cykgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgaWYgKGxlbmd0aCA8IDIgfHwgb2JqID09IG51bGwpIHJldHVybiBvYmo7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICBrZXlzID0ga2V5c0Z1bmMoc291cmNlKSxcbiAgICAgICAgICBsID0ga2V5cy5sZW5ndGg7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICBpZiAoIWRlZmF1bHRzIHx8IG9ialtrZXldID09PSB2b2lkIDApIG9ialtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfTtcbn0iLCJpbXBvcnQga2V5cyBmcm9tICcuL2tleXMuanMnOyAvLyBJbnRlcm5hbCBoZWxwZXIgdG8gZ2VuZXJhdGUgZnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzXG4vLyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlRXNjYXBlcihtYXApIHtcbiAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gbWFwW21hdGNoXTtcbiAgfTsgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkLlxuXG5cbiAgdmFyIHNvdXJjZSA9ICcoPzonICsga2V5cyhtYXApLmpvaW4oJ3wnKSArICcpJztcbiAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgdmFyIHJlcGxhY2VSZWdleHAgPSBSZWdFeHAoc291cmNlLCAnZycpO1xuICByZXR1cm4gZnVuY3Rpb24gKHN0cmluZykge1xuICAgIHN0cmluZyA9IHN0cmluZyA9PSBudWxsID8gJycgOiAnJyArIHN0cmluZztcbiAgICByZXR1cm4gdGVzdFJlZ2V4cC50ZXN0KHN0cmluZykgPyBzdHJpbmcucmVwbGFjZShyZXBsYWNlUmVnZXhwLCBlc2NhcGVyKSA6IHN0cmluZztcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0TGVuZ3RoIGZyb20gJy4vX2dldExlbmd0aC5qcyc7XG5pbXBvcnQgeyBzbGljZSB9IGZyb20gJy4vX3NldHVwLmpzJztcbmltcG9ydCBpc05hTiBmcm9tICcuL2lzTmFOLmpzJzsgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgdGhlIGBfLmluZGV4T2ZgIGFuZCBgXy5sYXN0SW5kZXhPZmAgZnVuY3Rpb25zLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJbmRleEZpbmRlcihkaXIsIHByZWRpY2F0ZUZpbmQsIHNvcnRlZEluZGV4KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYXJyYXksIGl0ZW0sIGlkeCkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcblxuICAgIGlmICh0eXBlb2YgaWR4ID09ICdudW1iZXInKSB7XG4gICAgICBpZiAoZGlyID4gMCkge1xuICAgICAgICBpID0gaWR4ID49IDAgPyBpZHggOiBNYXRoLm1heChpZHggKyBsZW5ndGgsIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVuZ3RoID0gaWR4ID49IDAgPyBNYXRoLm1pbihpZHggKyAxLCBsZW5ndGgpIDogaWR4ICsgbGVuZ3RoICsgMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNvcnRlZEluZGV4ICYmIGlkeCAmJiBsZW5ndGgpIHtcbiAgICAgIGlkeCA9IHNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgIHJldHVybiBhcnJheVtpZHhdID09PSBpdGVtID8gaWR4IDogLTE7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW0gIT09IGl0ZW0pIHtcbiAgICAgIGlkeCA9IHByZWRpY2F0ZUZpbmQoc2xpY2UuY2FsbChhcnJheSwgaSwgbGVuZ3RoKSwgaXNOYU4pO1xuICAgICAgcmV0dXJuIGlkeCA+PSAwID8gaWR4ICsgaSA6IC0xO1xuICAgIH1cblxuICAgIGZvciAoaWR4ID0gZGlyID4gMCA/IGkgOiBsZW5ndGggLSAxOyBpZHggPj0gMCAmJiBpZHggPCBsZW5ndGg7IGlkeCArPSBkaXIpIHtcbiAgICAgIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfTtcbn0iLCJpbXBvcnQgY2IgZnJvbSAnLi9fY2IuanMnO1xuaW1wb3J0IGdldExlbmd0aCBmcm9tICcuL19nZXRMZW5ndGguanMnOyAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBgXy5maW5kSW5kZXhgIGFuZCBgXy5maW5kTGFzdEluZGV4YC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoZGlyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYXJyYXksIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuXG4gICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH07XG59IiwiaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vX2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCBrZXlzIGZyb20gJy4va2V5cy5qcyc7XG5pbXBvcnQgb3B0aW1pemVDYiBmcm9tICcuL19vcHRpbWl6ZUNiLmpzJzsgLy8gSW50ZXJuYWwgaGVscGVyIHRvIGNyZWF0ZSBhIHJlZHVjaW5nIGZ1bmN0aW9uLCBpdGVyYXRpbmcgbGVmdCBvciByaWdodC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlUmVkdWNlKGRpcikge1xuICAvLyBXcmFwIGNvZGUgdGhhdCByZWFzc2lnbnMgYXJndW1lbnQgdmFyaWFibGVzIGluIGEgc2VwYXJhdGUgZnVuY3Rpb24gdGhhblxuICAvLyB0aGUgb25lIHRoYXQgYWNjZXNzZXMgYGFyZ3VtZW50cy5sZW5ndGhgIHRvIGF2b2lkIGEgcGVyZiBoaXQuICgjMTk5MSlcbiAgdmFyIHJlZHVjZXIgPSBmdW5jdGlvbiAob2JqLCBpdGVyYXRlZSwgbWVtbywgaW5pdGlhbCkge1xuICAgIHZhciBfa2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIGtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKF9rZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcblxuICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgbWVtbyA9IG9ialtfa2V5cyA/IF9rZXlzW2luZGV4XSA6IGluZGV4XTtcbiAgICAgIGluZGV4ICs9IGRpcjtcbiAgICB9XG5cbiAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IF9rZXlzID8gX2tleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBtZW1vID0gaXRlcmF0ZWUobWVtbywgb2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cblxuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiAob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+PSAzO1xuICAgIHJldHVybiByZWR1Y2VyKG9iaiwgb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgNCksIG1lbW8sIGluaXRpYWwpO1xuICB9O1xufSIsImltcG9ydCB7IE1BWF9BUlJBWV9JTkRFWCB9IGZyb20gJy4vX3NldHVwLmpzJzsgLy8gQ29tbW9uIGludGVybmFsIGxvZ2ljIGZvciBgaXNBcnJheUxpa2VgIGFuZCBgaXNCdWZmZXJMaWtlYC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlU2l6ZVByb3BlcnR5Q2hlY2soZ2V0U2l6ZVByb3BlcnR5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgIHZhciBzaXplUHJvcGVydHkgPSBnZXRTaXplUHJvcGVydHkoY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIHR5cGVvZiBzaXplUHJvcGVydHkgPT0gJ251bWJlcicgJiYgc2l6ZVByb3BlcnR5ID49IDAgJiYgc2l6ZVByb3BlcnR5IDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgfTtcbn0iLCIvLyBJbnRlcm5hbCBmdW5jdGlvbiB0byBvYnRhaW4gYSBuZXN0ZWQgcHJvcGVydHkgaW4gYG9iamAgYWxvbmcgYHBhdGhgLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVlcEdldChvYmosIHBhdGgpIHtcbiAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgb2JqID0gb2JqW3BhdGhbaV1dO1xuICB9XG5cbiAgcmV0dXJuIGxlbmd0aCA/IG9iaiA6IHZvaWQgMDtcbn0iLCIvLyBJbnRlcm5hbCBsaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuZXhwb3J0IGRlZmF1bHQge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90OycsXG4gIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgJ2AnOiAnJiN4NjA7J1xufTsiLCJpbXBvcnQgYmFzZUNyZWF0ZSBmcm9tICcuL19iYXNlQ3JlYXRlLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJzsgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdG8gZXhlY3V0ZSBgc291cmNlRnVuY2AgYm91bmQgdG8gYGNvbnRleHRgIHdpdGggb3B0aW9uYWxcbi8vIGBhcmdzYC4gRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGV4ZWN1dGUgYSBmdW5jdGlvbiBhcyBhIGNvbnN0cnVjdG9yIG9yIGFzIGFcbi8vIG5vcm1hbCBmdW5jdGlvbi5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXhlY3V0ZUJvdW5kKHNvdXJjZUZ1bmMsIGJvdW5kRnVuYywgY29udGV4dCwgY2FsbGluZ0NvbnRleHQsIGFyZ3MpIHtcbiAgaWYgKCEoY2FsbGluZ0NvbnRleHQgaW5zdGFuY2VvZiBib3VuZEZ1bmMpKSByZXR1cm4gc291cmNlRnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgdmFyIHNlbGYgPSBiYXNlQ3JlYXRlKHNvdXJjZUZ1bmMucHJvdG90eXBlKTtcbiAgdmFyIHJlc3VsdCA9IHNvdXJjZUZ1bmMuYXBwbHkoc2VsZiwgYXJncyk7XG4gIGlmIChpc09iamVjdChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICByZXR1cm4gc2VsZjtcbn0iLCJpbXBvcnQgZ2V0TGVuZ3RoIGZyb20gJy4vX2dldExlbmd0aC5qcyc7XG5pbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9faXNBcnJheUxpa2UuanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcbmltcG9ydCBpc0FyZ3VtZW50cyBmcm9tICcuL2lzQXJndW1lbnRzLmpzJzsgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmbGF0dGVuKGlucHV0LCBkZXB0aCwgc3RyaWN0LCBvdXRwdXQpIHtcbiAgb3V0cHV0ID0gb3V0cHV0IHx8IFtdO1xuXG4gIGlmICghZGVwdGggJiYgZGVwdGggIT09IDApIHtcbiAgICBkZXB0aCA9IEluZmluaXR5O1xuICB9IGVsc2UgaWYgKGRlcHRoIDw9IDApIHtcbiAgICByZXR1cm4gb3V0cHV0LmNvbmNhdChpbnB1dCk7XG4gIH1cblxuICB2YXIgaWR4ID0gb3V0cHV0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGlucHV0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG5cbiAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICAvLyBGbGF0dGVuIGN1cnJlbnQgbGV2ZWwgb2YgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdC5cbiAgICAgIGlmIChkZXB0aCA+IDEpIHtcbiAgICAgICAgZmxhdHRlbih2YWx1ZSwgZGVwdGggLSAxLCBzdHJpY3QsIG91dHB1dCk7XG4gICAgICAgIGlkeCA9IG91dHB1dC5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaiA9IDAsXG4gICAgICAgICAgICBsZW4gPSB2YWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGogPCBsZW4pIG91dHB1dFtpZHgrK10gPSB2YWx1ZVtqKytdO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59IiwiaW1wb3J0IHNoYWxsb3dQcm9wZXJ0eSBmcm9tICcuL19zaGFsbG93UHJvcGVydHkuanMnOyAvLyBJbnRlcm5hbCBoZWxwZXIgdG8gb2J0YWluIHRoZSBgYnl0ZUxlbmd0aGAgcHJvcGVydHkgb2YgYW4gb2JqZWN0LlxuXG5leHBvcnQgZGVmYXVsdCBzaGFsbG93UHJvcGVydHkoJ2J5dGVMZW5ndGgnKTsiLCJpbXBvcnQgc2hhbGxvd1Byb3BlcnR5IGZyb20gJy4vX3NoYWxsb3dQcm9wZXJ0eS5qcyc7IC8vIEludGVybmFsIGhlbHBlciB0byBvYnRhaW4gdGhlIGBsZW5ndGhgIHByb3BlcnR5IG9mIGFuIG9iamVjdC5cblxuZXhwb3J0IGRlZmF1bHQgc2hhbGxvd1Byb3BlcnR5KCdsZW5ndGgnKTsiLCJpbXBvcnQgY2IgZnJvbSAnLi9fY2IuanMnO1xuaW1wb3J0IGVhY2ggZnJvbSAnLi9lYWNoLmpzJzsgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBncm91cChiZWhhdmlvciwgcGFydGl0aW9uKSB7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBwYXJ0aXRpb24gPyBbW10sIFtdXSA6IHt9O1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XG4gICAgICB2YXIga2V5ID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgYmVoYXZpb3IocmVzdWx0LCB2YWx1ZSwga2V5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSIsImltcG9ydCB7IGhhc093blByb3BlcnR5IH0gZnJvbSAnLi9fc2V0dXAuanMnOyAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0byBjaGVjayB3aGV0aGVyIGBrZXlgIGlzIGFuIG93biBwcm9wZXJ0eSBuYW1lIG9mIGBvYmpgLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoYXMob2JqLCBrZXkpIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xufSIsImltcG9ydCB0YWdUZXN0ZXIgZnJvbSAnLi9fdGFnVGVzdGVyLmpzJztcbmV4cG9ydCBkZWZhdWx0IHRhZ1Rlc3RlcignT2JqZWN0Jyk7IiwiaW1wb3J0IGNyZWF0ZVNpemVQcm9wZXJ0eUNoZWNrIGZyb20gJy4vX2NyZWF0ZVNpemVQcm9wZXJ0eUNoZWNrLmpzJztcbmltcG9ydCBnZXRMZW5ndGggZnJvbSAnLi9fZ2V0TGVuZ3RoLmpzJzsgLy8gSW50ZXJuYWwgaGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4vLyBzaG91bGQgYmUgaXRlcmF0ZWQgYXMgYW4gYXJyYXkgb3IgYXMgYW4gb2JqZWN0LlxuLy8gUmVsYXRlZDogaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoXG4vLyBBdm9pZHMgYSB2ZXJ5IG5hc3R5IGlPUyA4IEpJVCBidWcgb24gQVJNLTY0LiAjMjA5NFxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaXplUHJvcGVydHlDaGVjayhnZXRMZW5ndGgpOyIsImltcG9ydCBjcmVhdGVTaXplUHJvcGVydHlDaGVjayBmcm9tICcuL19jcmVhdGVTaXplUHJvcGVydHlDaGVjay5qcyc7XG5pbXBvcnQgZ2V0Qnl0ZUxlbmd0aCBmcm9tICcuL19nZXRCeXRlTGVuZ3RoLmpzJzsgLy8gSW50ZXJuYWwgaGVscGVyIHRvIGRldGVybWluZSB3aGV0aGVyIHdlIHNob3VsZCBzcGVuZCBleHRlbnNpdmUgY2hlY2tzIGFnYWluc3Rcbi8vIGBBcnJheUJ1ZmZlcmAgZXQgYWwuXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNpemVQcm9wZXJ0eUNoZWNrKGdldEJ5dGVMZW5ndGgpOyIsIi8vIEludGVybmFsIGBfLnBpY2tgIGhlbHBlciBmdW5jdGlvbiB0byBkZXRlcm1pbmUgd2hldGhlciBga2V5YCBpcyBhbiBlbnVtZXJhYmxlXG4vLyBwcm9wZXJ0eSBuYW1lIG9mIGBvYmpgLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ga2V5SW5PYmoodmFsdWUsIGtleSwgb2JqKSB7XG4gIHJldHVybiBrZXkgaW4gb2JqO1xufSIsImltcG9ydCBnZXRMZW5ndGggZnJvbSAnLi9fZ2V0TGVuZ3RoLmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgYWxsS2V5cyBmcm9tICcuL2FsbEtleXMuanMnOyAvLyBTaW5jZSB0aGUgcmVndWxhciBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AgdHlwZSB0ZXN0cyBkb24ndCB3b3JrIGZvclxuLy8gc29tZSB0eXBlcyBpbiBJRSAxMSwgd2UgdXNlIGEgZmluZ2VycHJpbnRpbmcgaGV1cmlzdGljIGluc3RlYWQsIGJhc2VkXG4vLyBvbiB0aGUgbWV0aG9kcy4gSXQncyBub3QgZ3JlYXQsIGJ1dCBpdCdzIHRoZSBiZXN0IHdlIGdvdC5cbi8vIFRoZSBmaW5nZXJwcmludCBtZXRob2QgbGlzdHMgYXJlIGRlZmluZWQgYmVsb3cuXG5cbmV4cG9ydCBmdW5jdGlvbiBpZTExZmluZ2VycHJpbnQobWV0aG9kcykge1xuICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKG1ldGhvZHMpO1xuICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlOyAvLyBgTWFwYCwgYFdlYWtNYXBgIGFuZCBgU2V0YCBoYXZlIG5vIGVudW1lcmFibGUga2V5cy5cblxuICAgIHZhciBrZXlzID0gYWxsS2V5cyhvYmopO1xuICAgIGlmIChnZXRMZW5ndGgoa2V5cykpIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNGdW5jdGlvbihvYmpbbWV0aG9kc1tpXV0pKSByZXR1cm4gZmFsc2U7XG4gICAgfSAvLyBJZiB3ZSBhcmUgdGVzdGluZyBhZ2FpbnN0IGBXZWFrTWFwYCwgd2UgbmVlZCB0byBlbnN1cmUgdGhhdFxuICAgIC8vIGBvYmpgIGRvZXNuJ3QgaGF2ZSBhIGBmb3JFYWNoYCBtZXRob2QgaW4gb3JkZXIgdG8gZGlzdGluZ3Vpc2hcbiAgICAvLyBpdCBmcm9tIGEgcmVndWxhciBgTWFwYC5cblxuXG4gICAgcmV0dXJuIG1ldGhvZHMgIT09IHdlYWtNYXBNZXRob2RzIHx8ICFpc0Z1bmN0aW9uKG9ialtmb3JFYWNoTmFtZV0pO1xuICB9O1xufSAvLyBJbiB0aGUgaW50ZXJlc3Qgb2YgY29tcGFjdCBtaW5pZmljYXRpb24sIHdlIHdyaXRlXG4vLyBlYWNoIHN0cmluZyBpbiB0aGUgZmluZ2VycHJpbnRzIG9ubHkgb25jZS5cblxudmFyIGZvckVhY2hOYW1lID0gJ2ZvckVhY2gnLFxuICAgIGhhc05hbWUgPSAnaGFzJyxcbiAgICBjb21tb25Jbml0ID0gWydjbGVhcicsICdkZWxldGUnXSxcbiAgICBtYXBUYWlsID0gWydnZXQnLCBoYXNOYW1lLCAnc2V0J107IC8vIGBNYXBgLCBgV2Vha01hcGAgYW5kIGBTZXRgIGVhY2ggaGF2ZSBzbGlnaHRseSBkaWZmZXJlbnRcbi8vIGNvbWJpbmF0aW9ucyBvZiB0aGUgYWJvdmUgc3VibGlzdHMuXG5cbmV4cG9ydCB2YXIgbWFwTWV0aG9kcyA9IGNvbW1vbkluaXQuY29uY2F0KGZvckVhY2hOYW1lLCBtYXBUYWlsKSxcbiAgICB3ZWFrTWFwTWV0aG9kcyA9IGNvbW1vbkluaXQuY29uY2F0KG1hcFRhaWwpLFxuICAgIHNldE1ldGhvZHMgPSBbJ2FkZCddLmNvbmNhdChjb21tb25Jbml0LCBmb3JFYWNoTmFtZSwgaGFzTmFtZSk7IiwiLy8gSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVmZmljaWVudCAoZm9yIGN1cnJlbnQgZW5naW5lcykgdmVyc2lvblxuLy8gb2YgdGhlIHBhc3NlZC1pbiBjYWxsYmFjaywgdG8gYmUgcmVwZWF0ZWRseSBhcHBsaWVkIGluIG90aGVyIFVuZGVyc2NvcmVcbi8vIGZ1bmN0aW9ucy5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGltaXplQ2IoZnVuYywgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgcmV0dXJuIGZ1bmM7XG5cbiAgc3dpdGNoIChhcmdDb3VudCA9PSBudWxsID8gMyA6IGFyZ0NvdW50KSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgLy8gVGhlIDItYXJndW1lbnQgY2FzZSBpcyBvbWl0dGVkIGJlY2F1c2Ugd2XigJlyZSBub3QgdXNpbmcgaXQuXG5cbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuXG4gICAgY2FzZSA0OlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICB9O1xufSIsIi8vIEN1cnJlbnQgdmVyc2lvbi5cbmV4cG9ydCB2YXIgVkVSU0lPTiA9ICcxLjEzLjEnOyAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCAoYHNlbGZgKSBpbiB0aGUgYnJvd3NlciwgYGdsb2JhbGBcbi8vIG9uIHRoZSBzZXJ2ZXIsIG9yIGB0aGlzYCBpbiBzb21lIHZpcnR1YWwgbWFjaGluZXMuIFdlIHVzZSBgc2VsZmBcbi8vIGluc3RlYWQgb2YgYHdpbmRvd2AgZm9yIGBXZWJXb3JrZXJgIHN1cHBvcnQuXG5cbmV4cG9ydCB2YXIgcm9vdCA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYuc2VsZiA9PT0gc2VsZiAmJiBzZWxmIHx8IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsLmdsb2JhbCA9PT0gZ2xvYmFsICYmIGdsb2JhbCB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpIHx8IHt9OyAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuXG5leHBvcnQgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsXG4gICAgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuZXhwb3J0IHZhciBTeW1ib2xQcm90byA9IHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnID8gU3ltYm9sLnByb3RvdHlwZSA6IG51bGw7IC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuXG5leHBvcnQgdmFyIHB1c2ggPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIHRvU3RyaW5nID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTsgLy8gTW9kZXJuIGZlYXR1cmUgZGV0ZWN0aW9uLlxuXG5leHBvcnQgdmFyIHN1cHBvcnRzQXJyYXlCdWZmZXIgPSB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnLFxuICAgIHN1cHBvcnRzRGF0YVZpZXcgPSB0eXBlb2YgRGF0YVZpZXcgIT09ICd1bmRlZmluZWQnOyAvLyBBbGwgKipFQ01BU2NyaXB0IDUrKiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4vLyBhcmUgZGVjbGFyZWQgaGVyZS5cblxuZXhwb3J0IHZhciBuYXRpdmVJc0FycmF5ID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZSxcbiAgICBuYXRpdmVJc1ZpZXcgPSBzdXBwb3J0c0FycmF5QnVmZmVyICYmIEFycmF5QnVmZmVyLmlzVmlldzsgLy8gQ3JlYXRlIHJlZmVyZW5jZXMgdG8gdGhlc2UgYnVpbHRpbiBmdW5jdGlvbnMgYmVjYXVzZSB3ZSBvdmVycmlkZSB0aGVtLlxuXG5leHBvcnQgdmFyIF9pc05hTiA9IGlzTmFOLFxuICAgIF9pc0Zpbml0ZSA9IGlzRmluaXRlOyAvLyBLZXlzIGluIElFIDwgOSB0aGF0IHdvbid0IGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLlxuXG5leHBvcnQgdmFyIGhhc0VudW1CdWcgPSAhe1xuICB0b1N0cmluZzogbnVsbFxufS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbmV4cG9ydCB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWyd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTsgLy8gVGhlIGxhcmdlc3QgaW50ZWdlciB0aGF0IGNhbiBiZSByZXByZXNlbnRlZCBleGFjdGx5LlxuXG5leHBvcnQgdmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7IiwiLy8gSW50ZXJuYWwgaGVscGVyIHRvIGdlbmVyYXRlIGEgZnVuY3Rpb24gdG8gb2J0YWluIHByb3BlcnR5IGBrZXlgIGZyb20gYG9iamAuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGFsbG93UHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW2tleV07XG4gIH07XG59IiwiaW1wb3J0IHsgc3VwcG9ydHNEYXRhVmlldyB9IGZyb20gJy4vX3NldHVwLmpzJztcbmltcG9ydCBoYXNPYmplY3RUYWcgZnJvbSAnLi9faGFzT2JqZWN0VGFnLmpzJzsgLy8gSW4gSUUgMTAgLSBFZGdlIDEzLCBgRGF0YVZpZXdgIGhhcyBzdHJpbmcgdGFnIGAnW29iamVjdCBPYmplY3RdJ2AuXG4vLyBJbiBJRSAxMSwgdGhlIG1vc3QgY29tbW9uIGFtb25nIHRoZW0sIHRoaXMgcHJvYmxlbSBhbHNvIGFwcGxpZXMgdG9cbi8vIGBNYXBgLCBgV2Vha01hcGAgYW5kIGBTZXRgLlxuXG5leHBvcnQgdmFyIGhhc1N0cmluZ1RhZ0J1ZyA9IHN1cHBvcnRzRGF0YVZpZXcgJiYgaGFzT2JqZWN0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoOCkpKSxcbiAgICBpc0lFMTEgPSB0eXBlb2YgTWFwICE9PSAndW5kZWZpbmVkJyAmJiBoYXNPYmplY3RUYWcobmV3IE1hcCgpKTsiLCJpbXBvcnQgeyB0b1N0cmluZyB9IGZyb20gJy4vX3NldHVwLmpzJzsgLy8gSW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgYHRvU3RyaW5nYC1iYXNlZCB0eXBlIHRlc3Rlci5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGFnVGVzdGVyKG5hbWUpIHtcbiAgdmFyIHRhZyA9ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09IHRhZztcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0Qnl0ZUxlbmd0aCBmcm9tICcuL19nZXRCeXRlTGVuZ3RoLmpzJzsgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdG8gd3JhcCBvciBzaGFsbG93LWNvcHkgYW4gQXJyYXlCdWZmZXIsXG4vLyB0eXBlZCBhcnJheSBvciBEYXRhVmlldyB0byBhIG5ldyB2aWV3LCByZXVzaW5nIHRoZSBidWZmZXIuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvQnVmZmVyVmlldyhidWZmZXJTb3VyY2UpIHtcbiAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJ1ZmZlclNvdXJjZS5idWZmZXIgfHwgYnVmZmVyU291cmNlLCBidWZmZXJTb3VyY2UuYnl0ZU9mZnNldCB8fCAwLCBnZXRCeXRlTGVuZ3RoKGJ1ZmZlclNvdXJjZSkpO1xufSIsImltcG9ydCBfIGZyb20gJy4vdW5kZXJzY29yZS5qcyc7XG5pbXBvcnQgJy4vdG9QYXRoLmpzJzsgLy8gSW50ZXJuYWwgd3JhcHBlciBmb3IgYF8udG9QYXRoYCB0byBlbmFibGUgbWluaWZpY2F0aW9uLlxuLy8gU2ltaWxhciB0byBgY2JgIGZvciBgXy5pdGVyYXRlZWAuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvUGF0aChwYXRoKSB7XG4gIHJldHVybiBfLnRvUGF0aChwYXRoKTtcbn0iLCJpbXBvcnQgaW52ZXJ0IGZyb20gJy4vaW52ZXJ0LmpzJztcbmltcG9ydCBlc2NhcGVNYXAgZnJvbSAnLi9fZXNjYXBlTWFwLmpzJzsgLy8gSW50ZXJuYWwgbGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciB1bmVzY2FwaW5nLlxuXG5leHBvcnQgZGVmYXVsdCBpbnZlcnQoZXNjYXBlTWFwKTsiLCIvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb24gYW5kIGFmdGVyIHRoZSBOdGggY2FsbC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFmdGVyKHRpbWVzLCBmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbn0iLCJpbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgeyBoYXNFbnVtQnVnIH0gZnJvbSAnLi9fc2V0dXAuanMnO1xuaW1wb3J0IGNvbGxlY3ROb25FbnVtUHJvcHMgZnJvbSAnLi9fY29sbGVjdE5vbkVudW1Qcm9wcy5qcyc7IC8vIFJldHJpZXZlIGFsbCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBhbiBvYmplY3QuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFsbEtleXMob2JqKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICB2YXIga2V5cyA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpOyAvLyBBaGVtLCBJRSA8IDkuXG5cblxuICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICByZXR1cm4ga2V5cztcbn0iLCIvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGVcbi8vIE50aCBjYWxsLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmVmb3JlKHRpbWVzLCBmdW5jKSB7XG4gIHZhciBtZW1vO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICgtLXRpbWVzID4gMCkge1xuICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBpZiAodGltZXMgPD0gMSkgZnVuYyA9IG51bGw7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59IiwiaW1wb3J0IHJlc3RBcmd1bWVudHMgZnJvbSAnLi9yZXN0QXJndW1lbnRzLmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgZXhlY3V0ZUJvdW5kIGZyb20gJy4vX2V4ZWN1dGVCb3VuZC5qcyc7IC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuLy8gb3B0aW9uYWxseSkuXG5cbmV4cG9ydCBkZWZhdWx0IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24gKGZ1bmMsIGNvbnRleHQsIGFyZ3MpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdCaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgZnVuY3Rpb24nKTtcbiAgdmFyIGJvdW5kID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbiAoY2FsbEFyZ3MpIHtcbiAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCBjb250ZXh0LCB0aGlzLCBhcmdzLmNvbmNhdChjYWxsQXJncykpO1xuICB9KTtcbiAgcmV0dXJuIGJvdW5kO1xufSk7IiwiaW1wb3J0IHJlc3RBcmd1bWVudHMgZnJvbSAnLi9yZXN0QXJndW1lbnRzLmpzJztcbmltcG9ydCBmbGF0dGVuIGZyb20gJy4vX2ZsYXR0ZW4uanMnO1xuaW1wb3J0IGJpbmQgZnJvbSAnLi9iaW5kLmpzJzsgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4vLyBhcmUgdGhlIG1ldGhvZCBuYW1lcyB0byBiZSBib3VuZC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0IGFsbCBjYWxsYmFja3Ncbi8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cblxuZXhwb3J0IGRlZmF1bHQgcmVzdEFyZ3VtZW50cyhmdW5jdGlvbiAob2JqLCBrZXlzKSB7XG4gIGtleXMgPSBmbGF0dGVuKGtleXMsIGZhbHNlLCBmYWxzZSk7XG4gIHZhciBpbmRleCA9IGtleXMubGVuZ3RoO1xuICBpZiAoaW5kZXggPCAxKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcblxuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICBvYmpba2V5XSA9IGJpbmQob2JqW2tleV0sIG9iaik7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufSk7IiwiaW1wb3J0IF8gZnJvbSAnLi91bmRlcnNjb3JlLmpzJzsgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjaGFpbihvYmopIHtcbiAgdmFyIGluc3RhbmNlID0gXyhvYmopO1xuXG4gIGluc3RhbmNlLl9jaGFpbiA9IHRydWU7XG4gIHJldHVybiBpbnN0YW5jZTtcbn0iLCJpbXBvcnQgeyBzbGljZSB9IGZyb20gJy4vX3NldHVwLmpzJzsgLy8gQ2h1bmsgYSBzaW5nbGUgYXJyYXkgaW50byBtdWx0aXBsZSBhcnJheXMsIGVhY2ggY29udGFpbmluZyBgY291bnRgIG9yIGZld2VyXG4vLyBpdGVtcy5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2h1bmsoYXJyYXksIGNvdW50KSB7XG4gIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50IDwgMSkgcmV0dXJuIFtdO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMCxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoaSA8IGxlbmd0aCkge1xuICAgIHJlc3VsdC5wdXNoKHNsaWNlLmNhbGwoYXJyYXksIGksIGkgKz0gY291bnQpKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59IiwiaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcbmltcG9ydCBleHRlbmQgZnJvbSAnLi9leHRlbmQuanMnOyAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNsb25lKG9iaikge1xuICBpZiAoIWlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gIHJldHVybiBpc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IGV4dGVuZCh7fSwgb2JqKTtcbn0iLCJpbXBvcnQgZmlsdGVyIGZyb20gJy4vZmlsdGVyLmpzJzsgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21wYWN0KGFycmF5KSB7XG4gIHJldHVybiBmaWx0ZXIoYXJyYXksIEJvb2xlYW4pO1xufSIsIi8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4vLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaSA9IHN0YXJ0O1xuICAgIHZhciByZXN1bHQgPSBhcmdzW3N0YXJ0XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgd2hpbGUgKGktLSkgcmVzdWx0ID0gYXJnc1tpXS5jYWxsKHRoaXMsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSIsIi8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9uLiBPZnRlbiB1c2VmdWwgb3V0c2lkZSBvZiBVbmRlcnNjb3JlLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59IiwiaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vX2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCB2YWx1ZXMgZnJvbSAnLi92YWx1ZXMuanMnO1xuaW1wb3J0IGluZGV4T2YgZnJvbSAnLi9pbmRleE9mLmpzJzsgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiBpdGVtICh1c2luZyBgPT09YCkuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbnRhaW5zKG9iaiwgaXRlbSwgZnJvbUluZGV4LCBndWFyZCkge1xuICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IHZhbHVlcyhvYmopO1xuICBpZiAodHlwZW9mIGZyb21JbmRleCAhPSAnbnVtYmVyJyB8fCBndWFyZCkgZnJvbUluZGV4ID0gMDtcbiAgcmV0dXJuIGluZGV4T2Yob2JqLCBpdGVtLCBmcm9tSW5kZXgpID49IDA7XG59IiwiaW1wb3J0IGdyb3VwIGZyb20gJy4vX2dyb3VwLmpzJztcbmltcG9ydCBoYXMgZnJvbSAnLi9faGFzLmpzJzsgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4vLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbi8vIGNyaXRlcmlvbi5cblxuZXhwb3J0IGRlZmF1bHQgZ3JvdXAoZnVuY3Rpb24gKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICBpZiAoaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKztlbHNlIHJlc3VsdFtrZXldID0gMTtcbn0pOyIsImltcG9ydCBiYXNlQ3JlYXRlIGZyb20gJy4vX2Jhc2VDcmVhdGUuanMnO1xuaW1wb3J0IGV4dGVuZE93biBmcm9tICcuL2V4dGVuZE93bi5qcyc7IC8vIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlIG9iamVjdC5cbi8vIElmIGFkZGl0aW9uYWwgcHJvcGVydGllcyBhcmUgcHJvdmlkZWQgdGhlbiB0aGV5IHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4vLyBjcmVhdGVkIG9iamVjdC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgcHJvcHMpIHtcbiAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgaWYgKHByb3BzKSBleHRlbmRPd24ocmVzdWx0LCBwcm9wcyk7XG4gIHJldHVybiByZXN1bHQ7XG59IiwiaW1wb3J0IHJlc3RBcmd1bWVudHMgZnJvbSAnLi9yZXN0QXJndW1lbnRzLmpzJztcbmltcG9ydCBub3cgZnJvbSAnLi9ub3cuanMnOyAvLyBXaGVuIGEgc2VxdWVuY2Ugb2YgY2FsbHMgb2YgdGhlIHJldHVybmVkIGZ1bmN0aW9uIGVuZHMsIHRoZSBhcmd1bWVudFxuLy8gZnVuY3Rpb24gaXMgdHJpZ2dlcmVkLiBUaGUgZW5kIG9mIGEgc2VxdWVuY2UgaXMgZGVmaW5lZCBieSB0aGUgYHdhaXRgXG4vLyBwYXJhbWV0ZXIuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdGhlIGFyZ3VtZW50IGZ1bmN0aW9uIHdpbGwgYmVcbi8vIHRyaWdnZXJlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzZXF1ZW5jZSBpbnN0ZWFkIG9mIGF0IHRoZSBlbmQuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICB2YXIgdGltZW91dCwgcHJldmlvdXMsIGFyZ3MsIHJlc3VsdCwgY29udGV4dDtcblxuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhc3NlZCA9IG5vdygpIC0gcHJldmlvdXM7XG5cbiAgICBpZiAod2FpdCA+IHBhc3NlZCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBwYXNzZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpOyAvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCBiZWNhdXNlIGBmdW5jYCBjYW4gcmVjdXJzaXZlbHkgaW52b2tlIGBkZWJvdW5jZWRgLlxuXG4gICAgICBpZiAoIXRpbWVvdXQpIGFyZ3MgPSBjb250ZXh0ID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGRlYm91bmNlZCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24gKF9hcmdzKSB7XG4gICAgY29udGV4dCA9IHRoaXM7XG4gICAgYXJncyA9IF9hcmdzO1xuICAgIHByZXZpb3VzID0gbm93KCk7XG5cbiAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChpbW1lZGlhdGUpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG5cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IGFyZ3MgPSBjb250ZXh0ID0gbnVsbDtcbiAgfTtcblxuICByZXR1cm4gZGVib3VuY2VkO1xufSIsImltcG9ydCBjcmVhdGVBc3NpZ25lciBmcm9tICcuL19jcmVhdGVBc3NpZ25lci5qcyc7XG5pbXBvcnQgYWxsS2V5cyBmcm9tICcuL2FsbEtleXMuanMnOyAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVBc3NpZ25lcihhbGxLZXlzLCB0cnVlKTsiLCJpbXBvcnQgcGFydGlhbCBmcm9tICcuL3BhcnRpYWwuanMnO1xuaW1wb3J0IGRlbGF5IGZyb20gJy4vZGVsYXkuanMnO1xuaW1wb3J0IF8gZnJvbSAnLi91bmRlcnNjb3JlLmpzJzsgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4vLyBjbGVhcmVkLlxuXG5leHBvcnQgZGVmYXVsdCBwYXJ0aWFsKGRlbGF5LCBfLCAxKTsiLCJpbXBvcnQgcmVzdEFyZ3VtZW50cyBmcm9tICcuL3Jlc3RBcmd1bWVudHMuanMnOyAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4vLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG5cbmV4cG9ydCBkZWZhdWx0IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24gKGZ1bmMsIHdhaXQsIGFyZ3MpIHtcbiAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICB9LCB3YWl0KTtcbn0pOyIsImltcG9ydCByZXN0QXJndW1lbnRzIGZyb20gJy4vcmVzdEFyZ3VtZW50cy5qcyc7XG5pbXBvcnQgZmxhdHRlbiBmcm9tICcuL19mbGF0dGVuLmpzJztcbmltcG9ydCBmaWx0ZXIgZnJvbSAnLi9maWx0ZXIuanMnO1xuaW1wb3J0IGNvbnRhaW5zIGZyb20gJy4vY29udGFpbnMuanMnOyAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4vLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuXG5leHBvcnQgZGVmYXVsdCByZXN0QXJndW1lbnRzKGZ1bmN0aW9uIChhcnJheSwgcmVzdCkge1xuICByZXN0ID0gZmxhdHRlbihyZXN0LCB0cnVlLCB0cnVlKTtcbiAgcmV0dXJuIGZpbHRlcihhcnJheSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuICFjb250YWlucyhyZXN0LCB2YWx1ZSk7XG4gIH0pO1xufSk7IiwiaW1wb3J0IG9wdGltaXplQ2IgZnJvbSAnLi9fb3B0aW1pemVDYi5qcyc7XG5pbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9faXNBcnJheUxpa2UuanMnO1xuaW1wb3J0IGtleXMgZnJvbSAnLi9rZXlzLmpzJzsgLy8gVGhlIGNvcm5lcnN0b25lIGZvciBjb2xsZWN0aW9uIGZ1bmN0aW9ucywgYW4gYGVhY2hgXG4vLyBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbi8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbi8vIHNwYXJzZSBhcnJheS1saWtlcyBhcyBpZiB0aGV5IHdlcmUgZGVuc2UuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVhY2gob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICB2YXIgaSwgbGVuZ3RoO1xuXG4gIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBfa2V5cyA9IGtleXMob2JqKTtcblxuICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpdGVyYXRlZShvYmpbX2tleXNbaV1dLCBfa2V5c1tpXSwgb2JqKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufSIsImltcG9ydCBjcmVhdGVFc2NhcGVyIGZyb20gJy4vX2NyZWF0ZUVzY2FwZXIuanMnO1xuaW1wb3J0IGVzY2FwZU1hcCBmcm9tICcuL19lc2NhcGVNYXAuanMnOyAvLyBGdW5jdGlvbiBmb3IgZXNjYXBpbmcgc3RyaW5ncyB0byBIVE1MIGludGVycG9sYXRpb24uXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUVzY2FwZXIoZXNjYXBlTWFwKTsiLCJpbXBvcnQgY2IgZnJvbSAnLi9fY2IuanMnO1xuaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vX2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCBrZXlzIGZyb20gJy4va2V5cy5qcyc7IC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgcGFzcyBhIHRydXRoIHRlc3QuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV2ZXJ5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG5cbiAgdmFyIF9rZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYga2V5cyhvYmopLFxuICAgICAgbGVuZ3RoID0gKF9rZXlzIHx8IG9iaikubGVuZ3RoO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICB2YXIgY3VycmVudEtleSA9IF9rZXlzID8gX2tleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn0iLCJpbXBvcnQgY3JlYXRlQXNzaWduZXIgZnJvbSAnLi9fY3JlYXRlQXNzaWduZXIuanMnO1xuaW1wb3J0IGFsbEtleXMgZnJvbSAnLi9hbGxLZXlzLmpzJzsgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUFzc2lnbmVyKGFsbEtleXMpOyIsImltcG9ydCBjcmVhdGVBc3NpZ25lciBmcm9tICcuL19jcmVhdGVBc3NpZ25lci5qcyc7XG5pbXBvcnQga2V5cyBmcm9tICcuL2tleXMuanMnOyAvLyBBc3NpZ25zIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBvd24gcHJvcGVydGllcyBpbiB0aGUgcGFzc2VkLWluXG4vLyBvYmplY3QocykuXG4vLyAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbilcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQXNzaWduZXIoa2V5cyk7IiwiaW1wb3J0IGNiIGZyb20gJy4vX2NiLmpzJztcbmltcG9ydCBlYWNoIGZyb20gJy4vZWFjaC5qcyc7IC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbHRlcihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICB2YXIgcmVzdWx0cyA9IFtdO1xuICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICBlYWNoKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHRzO1xufSIsImltcG9ydCBpc0FycmF5TGlrZSBmcm9tICcuL19pc0FycmF5TGlrZS5qcyc7XG5pbXBvcnQgZmluZEluZGV4IGZyb20gJy4vZmluZEluZGV4LmpzJztcbmltcG9ydCBmaW5kS2V5IGZyb20gJy4vZmluZEtleS5qcyc7IC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmluZChvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICB2YXIga2V5RmluZGVyID0gaXNBcnJheUxpa2Uob2JqKSA/IGZpbmRJbmRleCA6IGZpbmRLZXk7XG4gIHZhciBrZXkgPSBrZXlGaW5kZXIob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICBpZiAoa2V5ICE9PSB2b2lkIDAgJiYga2V5ICE9PSAtMSkgcmV0dXJuIG9ialtrZXldO1xufSIsImltcG9ydCBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlciBmcm9tICcuL19jcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlci5qcyc7IC8vIFJldHVybnMgdGhlIGZpcnN0IGluZGV4IG9uIGFuIGFycmF5LWxpa2UgdGhhdCBwYXNzZXMgYSB0cnV0aCB0ZXN0LlxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigxKTsiLCJpbXBvcnQgY2IgZnJvbSAnLi9fY2IuanMnO1xuaW1wb3J0IGtleXMgZnJvbSAnLi9rZXlzLmpzJzsgLy8gUmV0dXJucyB0aGUgZmlyc3Qga2V5IG9uIGFuIG9iamVjdCB0aGF0IHBhc3NlcyBhIHRydXRoIHRlc3QuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbmRLZXkob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcblxuICB2YXIgX2tleXMgPSBrZXlzKG9iaiksXG4gICAgICBrZXk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAga2V5ID0gX2tleXNbaV07XG4gICAgaWYgKHByZWRpY2F0ZShvYmpba2V5XSwga2V5LCBvYmopKSByZXR1cm4ga2V5O1xuICB9XG59IiwiaW1wb3J0IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyIGZyb20gJy4vX2NyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyLmpzJzsgLy8gUmV0dXJucyB0aGUgbGFzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgdHJ1dGggdGVzdC5cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoLTEpOyIsImltcG9ydCBmaW5kIGZyb20gJy4vZmluZC5qcyc7XG5pbXBvcnQgbWF0Y2hlciBmcm9tICcuL21hdGNoZXIuanMnOyAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBfLmZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdFxuLy8gb2JqZWN0IGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbmRXaGVyZShvYmosIGF0dHJzKSB7XG4gIHJldHVybiBmaW5kKG9iaiwgbWF0Y2hlcihhdHRycykpO1xufSIsImltcG9ydCBpbml0aWFsIGZyb20gJy4vaW5pdGlhbC5qcyc7IC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpcnN0KGFycmF5LCBuLCBndWFyZCkge1xuICBpZiAoYXJyYXkgPT0gbnVsbCB8fCBhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gbiA9PSBudWxsIHx8IGd1YXJkID8gdm9pZCAwIDogW107XG4gIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgcmV0dXJuIGluaXRpYWwoYXJyYXksIGFycmF5Lmxlbmd0aCAtIG4pO1xufSIsImltcG9ydCBfZmxhdHRlbiBmcm9tICcuL19mbGF0dGVuLmpzJzsgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIHVwIHRvIGBkZXB0aGAuXG4vLyBQYXNzaW5nIGB0cnVlYCBvciBgZmFsc2VgIGFzIGBkZXB0aGAgbWVhbnMgYDFgIG9yIGBJbmZpbml0eWAsIHJlc3BlY3RpdmVseS5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmxhdHRlbihhcnJheSwgZGVwdGgpIHtcbiAgcmV0dXJuIF9mbGF0dGVuKGFycmF5LCBkZXB0aCwgZmFsc2UpO1xufSIsImltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7IC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZnVuY3Rpb25zKG9iaikge1xuICB2YXIgbmFtZXMgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gIH1cblxuICByZXR1cm4gbmFtZXMuc29ydCgpO1xufSIsImltcG9ydCB0b1BhdGggZnJvbSAnLi9fdG9QYXRoLmpzJztcbmltcG9ydCBkZWVwR2V0IGZyb20gJy4vX2RlZXBHZXQuanMnO1xuaW1wb3J0IGlzVW5kZWZpbmVkIGZyb20gJy4vaXNVbmRlZmluZWQuanMnOyAvLyBHZXQgdGhlIHZhbHVlIG9mIHRoZSAoZGVlcCkgcHJvcGVydHkgb24gYHBhdGhgIGZyb20gYG9iamVjdGAuXG4vLyBJZiBhbnkgcHJvcGVydHkgaW4gYHBhdGhgIGRvZXMgbm90IGV4aXN0IG9yIGlmIHRoZSB2YWx1ZSBpc1xuLy8gYHVuZGVmaW5lZGAsIHJldHVybiBgZGVmYXVsdFZhbHVlYCBpbnN0ZWFkLlxuLy8gVGhlIGBwYXRoYCBpcyBub3JtYWxpemVkIHRocm91Z2ggYF8udG9QYXRoYC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIHZhciB2YWx1ZSA9IGRlZXBHZXQob2JqZWN0LCB0b1BhdGgocGF0aCkpO1xuICByZXR1cm4gaXNVbmRlZmluZWQodmFsdWUpID8gZGVmYXVsdFZhbHVlIDogdmFsdWU7XG59IiwiaW1wb3J0IGdyb3VwIGZyb20gJy4vX2dyb3VwLmpzJztcbmltcG9ydCBoYXMgZnJvbSAnLi9faGFzLmpzJzsgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG5cbmV4cG9ydCBkZWZhdWx0IGdyb3VwKGZ1bmN0aW9uIChyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgaWYgKGhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldLnB1c2godmFsdWUpO2Vsc2UgcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xufSk7IiwiaW1wb3J0IF9oYXMgZnJvbSAnLi9faGFzLmpzJztcbmltcG9ydCB0b1BhdGggZnJvbSAnLi9fdG9QYXRoLmpzJzsgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseSBvblxuLy8gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS4gVW5saWtlIHRoZSBpbnRlcm5hbCBgaGFzYFxuLy8gZnVuY3Rpb24sIHRoaXMgcHVibGljIHZlcnNpb24gY2FuIGFsc28gdHJhdmVyc2UgbmVzdGVkIHByb3BlcnRpZXMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhhcyhvYmosIHBhdGgpIHtcbiAgcGF0aCA9IHRvUGF0aChwYXRoKTtcbiAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0gcGF0aFtpXTtcbiAgICBpZiAoIV9oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgb2JqID0gb2JqW2tleV07XG4gIH1cblxuICByZXR1cm4gISFsZW5ndGg7XG59IiwiLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdGVlcy5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn0iLCIvLyBFU00gRXhwb3J0c1xuLy8gPT09PT09PT09PT1cbi8vIFRoaXMgbW9kdWxlIGlzIHRoZSBwYWNrYWdlIGVudHJ5IHBvaW50IGZvciBFUyBtb2R1bGUgdXNlcnMuIEluIG90aGVyIHdvcmRzLFxuLy8gaXQgaXMgdGhlIG1vZHVsZSB0aGV5IGFyZSBpbnRlcmZhY2luZyB3aXRoIHdoZW4gdGhleSBpbXBvcnQgZnJvbSB0aGUgd2hvbGVcbi8vIHBhY2thZ2UgaW5zdGVhZCBvZiBmcm9tIGEgc3VibW9kdWxlLCBsaWtlIHRoaXM6XG4vL1xuLy8gYGBganNcbi8vIGltcG9ydCB7IG1hcCB9IGZyb20gJ3VuZGVyc2NvcmUnO1xuLy8gYGBgXG4vL1xuLy8gVGhlIGRpZmZlcmVuY2Ugd2l0aCBgLi9pbmRleC1kZWZhdWx0YCwgd2hpY2ggaXMgdGhlIHBhY2thZ2UgZW50cnkgcG9pbnQgZm9yXG4vLyBDb21tb25KUywgQU1EIGFuZCBVTUQgdXNlcnMsIGlzIHB1cmVseSB0ZWNobmljYWwuIEluIEVTIG1vZHVsZXMsIG5hbWVkIGFuZFxuLy8gZGVmYXVsdCBleHBvcnRzIGFyZSBjb25zaWRlcmVkIHRvIGJlIHNpYmxpbmdzLCBzbyB3aGVuIHlvdSBoYXZlIGEgZGVmYXVsdFxuLy8gZXhwb3J0LCBpdHMgcHJvcGVydGllcyBhcmUgbm90IGF1dG9tYXRpY2FsbHkgYXZhaWxhYmxlIGFzIG5hbWVkIGV4cG9ydHMuIEZvclxuLy8gdGhpcyByZWFzb24sIHdlIHJlLWV4cG9ydCB0aGUgbmFtZWQgZXhwb3J0cyBpbiBhZGRpdGlvbiB0byBwcm92aWRpbmcgdGhlIHNhbWVcbi8vIGRlZmF1bHQgZXhwb3J0IGFzIGluIGAuL2luZGV4LWRlZmF1bHRgLlxuZXhwb3J0IHsgZGVmYXVsdCB9IGZyb20gJy4vaW5kZXgtZGVmYXVsdC5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2luZGV4LmpzJzsiLCIvLyBEZWZhdWx0IEV4cG9ydFxuLy8gPT09PT09PT09PT09PT1cbi8vIEluIHRoaXMgbW9kdWxlLCB3ZSBtaXggb3VyIGJ1bmRsZWQgZXhwb3J0cyBpbnRvIHRoZSBgX2Agb2JqZWN0IGFuZCBleHBvcnRcbi8vIHRoZSByZXN1bHQuIFRoaXMgaXMgYW5hbG9nb3VzIHRvIHNldHRpbmcgYG1vZHVsZS5leHBvcnRzID0gX2AgaW4gQ29tbW9uSlMuXG4vLyBIZW5jZSwgdGhpcyBtb2R1bGUgaXMgYWxzbyB0aGUgZW50cnkgcG9pbnQgb2Ygb3VyIFVNRCBidW5kbGUgYW5kIHRoZSBwYWNrYWdlXG4vLyBlbnRyeSBwb2ludCBmb3IgQ29tbW9uSlMgYW5kIEFNRCB1c2Vycy4gSW4gb3RoZXIgd29yZHMsIHRoaXMgaXMgKHRoZSBzb3VyY2Vcbi8vIG9mKSB0aGUgbW9kdWxlIHlvdSBhcmUgaW50ZXJmYWNpbmcgd2l0aCB3aGVuIHlvdSBkbyBhbnkgb2YgdGhlIGZvbGxvd2luZzpcbi8vXG4vLyBgYGBqc1xuLy8gLy8gQ29tbW9uSlNcbi8vIHZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuLy9cbi8vIC8vIEFNRFxuLy8gZGVmaW5lKFsndW5kZXJzY29yZSddLCBmdW5jdGlvbihfKSB7Li4ufSk7XG4vL1xuLy8gLy8gVU1EIGluIHRoZSBicm93c2VyXG4vLyAvLyBfIGlzIGF2YWlsYWJsZSBhcyBhIGdsb2JhbCB2YXJpYWJsZVxuLy8gYGBgXG5pbXBvcnQgKiBhcyBhbGxFeHBvcnRzIGZyb20gJy4vaW5kZXguanMnO1xuaW1wb3J0IHsgbWl4aW4gfSBmcm9tICcuL2luZGV4LmpzJzsgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuXG52YXIgXyA9IG1peGluKGFsbEV4cG9ydHMpOyAvLyBMZWdhY3kgTm9kZS5qcyBBUEkuXG5cblxuXy5fID0gXzsgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIEFQSS5cblxuZXhwb3J0IGRlZmF1bHQgXzsiLCIvLyBOYW1lZCBFeHBvcnRzXG4vLyA9PT09PT09PT09PT09XG4vLyAgICAgVW5kZXJzY29yZS5qcyAxLjEzLjFcbi8vICAgICBodHRwczovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDIxIEplcmVteSBBc2hrZW5hcywgSnVsaWFuIEdvbmdncmlqcCwgYW5kIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vLyBCYXNlbGluZSBzZXR1cC5cbmV4cG9ydCB7IFZFUlNJT04gfSBmcm9tICcuL19zZXR1cC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHJlc3RBcmd1bWVudHMgfSBmcm9tICcuL3Jlc3RBcmd1bWVudHMuanMnOyAvLyBPYmplY3QgRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tXG4vLyBPdXIgbW9zdCBmdW5kYW1lbnRhbCBmdW5jdGlvbnMgb3BlcmF0ZSBvbiBhbnkgSmF2YVNjcmlwdCBvYmplY3QuXG4vLyBNb3N0IGZ1bmN0aW9ucyBpbiBVbmRlcnNjb3JlIGRlcGVuZCBvbiBhdCBsZWFzdCBvbmUgZnVuY3Rpb24gaW4gdGhpcyBzZWN0aW9uLlxuLy8gQSBncm91cCBvZiBmdW5jdGlvbnMgdGhhdCBjaGVjayB0aGUgdHlwZXMgb2YgY29yZSBKYXZhU2NyaXB0IHZhbHVlcy5cbi8vIFRoZXNlIGFyZSBvZnRlbiBpbmZvcm1hbGx5IHJlZmVycmVkIHRvIGFzIHRoZSBcImlzVHlwZVwiIGZ1bmN0aW9ucy5cblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc09iamVjdCB9IGZyb20gJy4vaXNPYmplY3QuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc051bGwgfSBmcm9tICcuL2lzTnVsbC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzVW5kZWZpbmVkIH0gZnJvbSAnLi9pc1VuZGVmaW5lZC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzQm9vbGVhbiB9IGZyb20gJy4vaXNCb29sZWFuLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNFbGVtZW50IH0gZnJvbSAnLi9pc0VsZW1lbnQuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1N0cmluZyB9IGZyb20gJy4vaXNTdHJpbmcuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc051bWJlciB9IGZyb20gJy4vaXNOdW1iZXIuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0RhdGUgfSBmcm9tICcuL2lzRGF0ZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzUmVnRXhwIH0gZnJvbSAnLi9pc1JlZ0V4cC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzRXJyb3IgfSBmcm9tICcuL2lzRXJyb3IuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1N5bWJvbCB9IGZyb20gJy4vaXNTeW1ib2wuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0FycmF5QnVmZmVyIH0gZnJvbSAnLi9pc0FycmF5QnVmZmVyLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNEYXRhVmlldyB9IGZyb20gJy4vaXNEYXRhVmlldy5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzQXJyYXkgfSBmcm9tICcuL2lzQXJyYXkuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNBcmd1bWVudHMgfSBmcm9tICcuL2lzQXJndW1lbnRzLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNGaW5pdGUgfSBmcm9tICcuL2lzRmluaXRlLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNOYU4gfSBmcm9tICcuL2lzTmFOLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNUeXBlZEFycmF5IH0gZnJvbSAnLi9pc1R5cGVkQXJyYXkuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0VtcHR5IH0gZnJvbSAnLi9pc0VtcHR5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNNYXRjaCB9IGZyb20gJy4vaXNNYXRjaC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzRXF1YWwgfSBmcm9tICcuL2lzRXF1YWwuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc01hcCB9IGZyb20gJy4vaXNNYXAuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1dlYWtNYXAgfSBmcm9tICcuL2lzV2Vha01hcC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzU2V0IH0gZnJvbSAnLi9pc1NldC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzV2Vha1NldCB9IGZyb20gJy4vaXNXZWFrU2V0LmpzJzsgLy8gRnVuY3Rpb25zIHRoYXQgdHJlYXQgYW4gb2JqZWN0IGFzIGEgZGljdGlvbmFyeSBvZiBrZXktdmFsdWUgcGFpcnMuXG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMga2V5cyB9IGZyb20gJy4va2V5cy5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGFsbEtleXMgfSBmcm9tICcuL2FsbEtleXMuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2YWx1ZXMgfSBmcm9tICcuL3ZhbHVlcy5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHBhaXJzIH0gZnJvbSAnLi9wYWlycy5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGludmVydCB9IGZyb20gJy4vaW52ZXJ0LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZnVuY3Rpb25zLCBkZWZhdWx0IGFzIG1ldGhvZHMgfSBmcm9tICcuL2Z1bmN0aW9ucy5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGV4dGVuZCB9IGZyb20gJy4vZXh0ZW5kLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZXh0ZW5kT3duLCBkZWZhdWx0IGFzIGFzc2lnbiB9IGZyb20gJy4vZXh0ZW5kT3duLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGVmYXVsdHMgfSBmcm9tICcuL2RlZmF1bHRzLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY3JlYXRlIH0gZnJvbSAnLi9jcmVhdGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjbG9uZSB9IGZyb20gJy4vY2xvbmUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB0YXAgfSBmcm9tICcuL3RhcC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldCB9IGZyb20gJy4vZ2V0LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaGFzIH0gZnJvbSAnLi9oYXMuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBtYXBPYmplY3QgfSBmcm9tICcuL21hcE9iamVjdC5qcyc7IC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gQSBiaXQgb2YgYSBncmFiIGJhZzogUHJlZGljYXRlLWdlbmVyYXRpbmcgZnVuY3Rpb25zIGZvciB1c2Ugd2l0aCBmaWx0ZXJzIGFuZFxuLy8gbG9vcHMsIHN0cmluZyBlc2NhcGluZyBhbmQgdGVtcGxhdGluZywgY3JlYXRlIHJhbmRvbSBudW1iZXJzIGFuZCB1bmlxdWUgaWRzLFxuLy8gYW5kIGZ1bmN0aW9ucyB0aGF0IGZhY2lsaXRhdGUgVW5kZXJzY29yZSdzIGNoYWluaW5nIGFuZCBpdGVyYXRpb24gY29udmVudGlvbnMuXG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgaWRlbnRpdHkgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY29uc3RhbnQgfSBmcm9tICcuL2NvbnN0YW50LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbm9vcCB9IGZyb20gJy4vbm9vcC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHRvUGF0aCB9IGZyb20gJy4vdG9QYXRoLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgcHJvcGVydHkgfSBmcm9tICcuL3Byb3BlcnR5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgcHJvcGVydHlPZiB9IGZyb20gJy4vcHJvcGVydHlPZi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIG1hdGNoZXIsIGRlZmF1bHQgYXMgbWF0Y2hlcyB9IGZyb20gJy4vbWF0Y2hlci5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHRpbWVzIH0gZnJvbSAnLi90aW1lcy5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHJhbmRvbSB9IGZyb20gJy4vcmFuZG9tLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbm93IH0gZnJvbSAnLi9ub3cuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlc2NhcGUgfSBmcm9tICcuL2VzY2FwZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHVuZXNjYXBlIH0gZnJvbSAnLi91bmVzY2FwZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHRlbXBsYXRlU2V0dGluZ3MgfSBmcm9tICcuL3RlbXBsYXRlU2V0dGluZ3MuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB0ZW1wbGF0ZSB9IGZyb20gJy4vdGVtcGxhdGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyByZXN1bHQgfSBmcm9tICcuL3Jlc3VsdC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHVuaXF1ZUlkIH0gZnJvbSAnLi91bmlxdWVJZC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGNoYWluIH0gZnJvbSAnLi9jaGFpbi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGl0ZXJhdGVlIH0gZnJvbSAnLi9pdGVyYXRlZS5qcyc7IC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFRoZXNlIGZ1bmN0aW9ucyB0YWtlIGEgZnVuY3Rpb24gYXMgYW4gYXJndW1lbnQgYW5kIHJldHVybiBhIG5ldyBmdW5jdGlvblxuLy8gYXMgdGhlIHJlc3VsdC4gQWxzbyBrbm93biBhcyBoaWdoZXItb3JkZXIgZnVuY3Rpb25zLlxuXG5leHBvcnQgeyBkZWZhdWx0IGFzIHBhcnRpYWwgfSBmcm9tICcuL3BhcnRpYWwuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBiaW5kIH0gZnJvbSAnLi9iaW5kLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgYmluZEFsbCB9IGZyb20gJy4vYmluZEFsbC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIG1lbW9pemUgfSBmcm9tICcuL21lbW9pemUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkZWxheSB9IGZyb20gJy4vZGVsYXkuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkZWZlciB9IGZyb20gJy4vZGVmZXIuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkZWJvdW5jZSB9IGZyb20gJy4vZGVib3VuY2UuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB3cmFwIH0gZnJvbSAnLi93cmFwLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbmVnYXRlIH0gZnJvbSAnLi9uZWdhdGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjb21wb3NlIH0gZnJvbSAnLi9jb21wb3NlLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgYWZ0ZXIgfSBmcm9tICcuL2FmdGVyLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgYmVmb3JlIH0gZnJvbSAnLi9iZWZvcmUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBvbmNlIH0gZnJvbSAnLi9vbmNlLmpzJzsgLy8gRmluZGVyc1xuLy8gLS0tLS0tLVxuLy8gRnVuY3Rpb25zIHRoYXQgZXh0cmFjdCAodGhlIHBvc2l0aW9uIG9mKSBhIHNpbmdsZSBlbGVtZW50IGZyb20gYW4gb2JqZWN0XG4vLyBvciBhcnJheSBiYXNlZCBvbiBzb21lIGNyaXRlcmlvbi5cblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBmaW5kS2V5IH0gZnJvbSAnLi9maW5kS2V5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZmluZEluZGV4IH0gZnJvbSAnLi9maW5kSW5kZXguanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBmaW5kTGFzdEluZGV4IH0gZnJvbSAnLi9maW5kTGFzdEluZGV4LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc29ydGVkSW5kZXggfSBmcm9tICcuL3NvcnRlZEluZGV4LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaW5kZXhPZiB9IGZyb20gJy4vaW5kZXhPZi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGxhc3RJbmRleE9mIH0gZnJvbSAnLi9sYXN0SW5kZXhPZi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGZpbmQsIGRlZmF1bHQgYXMgZGV0ZWN0IH0gZnJvbSAnLi9maW5kLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZmluZFdoZXJlIH0gZnJvbSAnLi9maW5kV2hlcmUuanMnOyAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEZ1bmN0aW9ucyB0aGF0IHdvcmsgb24gYW55IGNvbGxlY3Rpb24gb2YgZWxlbWVudHM6IGVpdGhlciBhbiBhcnJheSwgb3Jcbi8vIGFuIG9iamVjdCBvZiBrZXktdmFsdWUgcGFpcnMuXG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgZWFjaCwgZGVmYXVsdCBhcyBmb3JFYWNoIH0gZnJvbSAnLi9lYWNoLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbWFwLCBkZWZhdWx0IGFzIGNvbGxlY3QgfSBmcm9tICcuL21hcC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHJlZHVjZSwgZGVmYXVsdCBhcyBmb2xkbCwgZGVmYXVsdCBhcyBpbmplY3QgfSBmcm9tICcuL3JlZHVjZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHJlZHVjZVJpZ2h0LCBkZWZhdWx0IGFzIGZvbGRyIH0gZnJvbSAnLi9yZWR1Y2VSaWdodC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGZpbHRlciwgZGVmYXVsdCBhcyBzZWxlY3QgfSBmcm9tICcuL2ZpbHRlci5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHJlamVjdCB9IGZyb20gJy4vcmVqZWN0LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZXZlcnksIGRlZmF1bHQgYXMgYWxsIH0gZnJvbSAnLi9ldmVyeS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNvbWUsIGRlZmF1bHQgYXMgYW55IH0gZnJvbSAnLi9zb21lLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY29udGFpbnMsIGRlZmF1bHQgYXMgaW5jbHVkZXMsIGRlZmF1bHQgYXMgaW5jbHVkZSB9IGZyb20gJy4vY29udGFpbnMuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpbnZva2UgfSBmcm9tICcuL2ludm9rZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHBsdWNrIH0gZnJvbSAnLi9wbHVjay5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHdoZXJlIH0gZnJvbSAnLi93aGVyZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIG1heCB9IGZyb20gJy4vbWF4LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbWluIH0gZnJvbSAnLi9taW4uanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzaHVmZmxlIH0gZnJvbSAnLi9zaHVmZmxlLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2FtcGxlIH0gZnJvbSAnLi9zYW1wbGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzb3J0QnkgfSBmcm9tICcuL3NvcnRCeS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdyb3VwQnkgfSBmcm9tICcuL2dyb3VwQnkuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpbmRleEJ5IH0gZnJvbSAnLi9pbmRleEJ5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY291bnRCeSB9IGZyb20gJy4vY291bnRCeS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHBhcnRpdGlvbiB9IGZyb20gJy4vcGFydGl0aW9uLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdG9BcnJheSB9IGZyb20gJy4vdG9BcnJheS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNpemUgfSBmcm9tICcuL3NpemUuanMnOyAvLyBgXy5waWNrYCBhbmQgYF8ub21pdGAgYXJlIGFjdHVhbGx5IG9iamVjdCBmdW5jdGlvbnMsIGJ1dCB3ZSBwdXRcbi8vIHRoZW0gaGVyZSBpbiBvcmRlciB0byBjcmVhdGUgYSBtb3JlIG5hdHVyYWwgcmVhZGluZyBvcmRlciBpbiB0aGVcbi8vIG1vbm9saXRoaWMgYnVpbGQgYXMgdGhleSBkZXBlbmQgb24gYF8uY29udGFpbnNgLlxuXG5leHBvcnQgeyBkZWZhdWx0IGFzIHBpY2sgfSBmcm9tICcuL3BpY2suanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBvbWl0IH0gZnJvbSAnLi9vbWl0LmpzJzsgLy8gQXJyYXkgRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS1cbi8vIEZ1bmN0aW9ucyB0aGF0IG9wZXJhdGUgb24gYXJyYXlzIChhbmQgYXJyYXktbGlrZXMpIG9ubHksIGJlY2F1c2UgdGhleeKAmXJlXG4vLyBleHByZXNzZWQgaW4gdGVybXMgb2Ygb3BlcmF0aW9ucyBvbiBhbiBvcmRlcmVkIGxpc3Qgb2YgdmFsdWVzLlxuXG5leHBvcnQgeyBkZWZhdWx0IGFzIGZpcnN0LCBkZWZhdWx0IGFzIGhlYWQsIGRlZmF1bHQgYXMgdGFrZSB9IGZyb20gJy4vZmlyc3QuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpbml0aWFsIH0gZnJvbSAnLi9pbml0aWFsLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbGFzdCB9IGZyb20gJy4vbGFzdC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHJlc3QsIGRlZmF1bHQgYXMgdGFpbCwgZGVmYXVsdCBhcyBkcm9wIH0gZnJvbSAnLi9yZXN0LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY29tcGFjdCB9IGZyb20gJy4vY29tcGFjdC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGZsYXR0ZW4gfSBmcm9tICcuL2ZsYXR0ZW4uanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB3aXRob3V0IH0gZnJvbSAnLi93aXRob3V0LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdW5pcSwgZGVmYXVsdCBhcyB1bmlxdWUgfSBmcm9tICcuL3VuaXEuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1bmlvbiB9IGZyb20gJy4vdW5pb24uanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpbnRlcnNlY3Rpb24gfSBmcm9tICcuL2ludGVyc2VjdGlvbi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRpZmZlcmVuY2UgfSBmcm9tICcuL2RpZmZlcmVuY2UuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1bnppcCwgZGVmYXVsdCBhcyB0cmFuc3Bvc2UgfSBmcm9tICcuL3VuemlwLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgemlwIH0gZnJvbSAnLi96aXAuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBvYmplY3QgfSBmcm9tICcuL29iamVjdC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHJhbmdlIH0gZnJvbSAnLi9yYW5nZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGNodW5rIH0gZnJvbSAnLi9jaHVuay5qcyc7IC8vIE9PUFxuLy8gLS0tXG4vLyBUaGVzZSBtb2R1bGVzIHN1cHBvcnQgdGhlIFwib2JqZWN0LW9yaWVudGVkXCIgY2FsbGluZyBzdHlsZS4gU2VlIGFsc29cbi8vIGB1bmRlcnNjb3JlLmpzYCBhbmQgYGluZGV4LWRlZmF1bHQuanNgLlxuXG5leHBvcnQgeyBkZWZhdWx0IGFzIG1peGluIH0gZnJvbSAnLi9taXhpbi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IH0gZnJvbSAnLi91bmRlcnNjb3JlLWFycmF5LW1ldGhvZHMuanMnOyIsImltcG9ydCBncm91cCBmcm9tICcuL19ncm91cC5qcyc7IC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgXy5ncm91cEJ5YCwgYnV0IGZvclxuLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuXG5leHBvcnQgZGVmYXVsdCBncm91cChmdW5jdGlvbiAocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gIHJlc3VsdFtrZXldID0gdmFsdWU7XG59KTsiLCJpbXBvcnQgc29ydGVkSW5kZXggZnJvbSAnLi9zb3J0ZWRJbmRleC5qcyc7XG5pbXBvcnQgZmluZEluZGV4IGZyb20gJy4vZmluZEluZGV4LmpzJztcbmltcG9ydCBjcmVhdGVJbmRleEZpbmRlciBmcm9tICcuL19jcmVhdGVJbmRleEZpbmRlci5qcyc7IC8vIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbi8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4vLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbi8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUluZGV4RmluZGVyKDEsIGZpbmRJbmRleCwgc29ydGVkSW5kZXgpOyIsImltcG9ydCB7IHNsaWNlIH0gZnJvbSAnLi9fc2V0dXAuanMnOyAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbi8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4vLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbml0aWFsKGFycmF5LCBuLCBndWFyZCkge1xuICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xufSIsImltcG9ydCBnZXRMZW5ndGggZnJvbSAnLi9fZ2V0TGVuZ3RoLmpzJztcbmltcG9ydCBjb250YWlucyBmcm9tICcuL2NvbnRhaW5zLmpzJzsgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuLy8gcGFzc2VkLWluIGFycmF5cy5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW50ZXJzZWN0aW9uKGFycmF5KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgIGlmIChjb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICB2YXIgajtcblxuICAgIGZvciAoaiA9IDE7IGogPCBhcmdzTGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmICghY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGogPT09IGFyZ3NMZW5ndGgpIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn0iLCJpbXBvcnQga2V5cyBmcm9tICcuL2tleXMuanMnOyAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGludmVydChvYmopIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIHZhciBfa2V5cyA9IGtleXMob2JqKTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gX2tleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICByZXN1bHRbb2JqW19rZXlzW2ldXV0gPSBfa2V5c1tpXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59IiwiaW1wb3J0IHJlc3RBcmd1bWVudHMgZnJvbSAnLi9yZXN0QXJndW1lbnRzLmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgbWFwIGZyb20gJy4vbWFwLmpzJztcbmltcG9ydCBkZWVwR2V0IGZyb20gJy4vX2RlZXBHZXQuanMnO1xuaW1wb3J0IHRvUGF0aCBmcm9tICcuL190b1BhdGguanMnOyAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cblxuZXhwb3J0IGRlZmF1bHQgcmVzdEFyZ3VtZW50cyhmdW5jdGlvbiAob2JqLCBwYXRoLCBhcmdzKSB7XG4gIHZhciBjb250ZXh0UGF0aCwgZnVuYztcblxuICBpZiAoaXNGdW5jdGlvbihwYXRoKSkge1xuICAgIGZ1bmMgPSBwYXRoO1xuICB9IGVsc2Uge1xuICAgIHBhdGggPSB0b1BhdGgocGF0aCk7XG4gICAgY29udGV4dFBhdGggPSBwYXRoLnNsaWNlKDAsIC0xKTtcbiAgICBwYXRoID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgcmV0dXJuIG1hcChvYmosIGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGZ1bmM7XG5cbiAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgaWYgKGNvbnRleHRQYXRoICYmIGNvbnRleHRQYXRoLmxlbmd0aCkge1xuICAgICAgICBjb250ZXh0ID0gZGVlcEdldChjb250ZXh0LCBjb250ZXh0UGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb250ZXh0ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgICBtZXRob2QgPSBjb250ZXh0W3BhdGhdO1xuICAgIH1cblxuICAgIHJldHVybiBtZXRob2QgPT0gbnVsbCA/IG1ldGhvZCA6IG1ldGhvZC5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfSk7XG59KTsiLCJpbXBvcnQgdGFnVGVzdGVyIGZyb20gJy4vX3RhZ1Rlc3Rlci5qcyc7XG5pbXBvcnQgaGFzIGZyb20gJy4vX2hhcy5qcyc7XG52YXIgaXNBcmd1bWVudHMgPSB0YWdUZXN0ZXIoJ0FyZ3VtZW50cycpOyAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFIDwgOSksIHdoZXJlXG4vLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoIWlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBpc0FyZ3VtZW50cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBoYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgfTtcbiAgfVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgaXNBcmd1bWVudHM7IiwiaW1wb3J0IHsgbmF0aXZlSXNBcnJheSB9IGZyb20gJy4vX3NldHVwLmpzJztcbmltcG9ydCB0YWdUZXN0ZXIgZnJvbSAnLi9fdGFnVGVzdGVyLmpzJzsgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbi8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBgQXJyYXkuaXNBcnJheWAuXG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUlzQXJyYXkgfHwgdGFnVGVzdGVyKCdBcnJheScpOyIsImltcG9ydCB0YWdUZXN0ZXIgZnJvbSAnLi9fdGFnVGVzdGVyLmpzJztcbmV4cG9ydCBkZWZhdWx0IHRhZ1Rlc3RlcignQXJyYXlCdWZmZXInKTsiLCJpbXBvcnQgeyB0b1N0cmluZyB9IGZyb20gJy4vX3NldHVwLmpzJzsgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQm9vbGVhbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufSIsImltcG9ydCB0YWdUZXN0ZXIgZnJvbSAnLi9fdGFnVGVzdGVyLmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNBcnJheUJ1ZmZlciBmcm9tICcuL2lzQXJyYXlCdWZmZXIuanMnO1xuaW1wb3J0IHsgaGFzU3RyaW5nVGFnQnVnIH0gZnJvbSAnLi9fc3RyaW5nVGFnQnVnLmpzJztcbnZhciBpc0RhdGFWaWV3ID0gdGFnVGVzdGVyKCdEYXRhVmlldycpOyAvLyBJbiBJRSAxMCAtIEVkZ2UgMTMsIHdlIG5lZWQgYSBkaWZmZXJlbnQgaGV1cmlzdGljXG4vLyB0byBkZXRlcm1pbmUgd2hldGhlciBhbiBvYmplY3QgaXMgYSBgRGF0YVZpZXdgLlxuXG5mdW5jdGlvbiBpZTEwSXNEYXRhVmlldyhvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIGlzRnVuY3Rpb24ob2JqLmdldEludDgpICYmIGlzQXJyYXlCdWZmZXIob2JqLmJ1ZmZlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc1N0cmluZ1RhZ0J1ZyA/IGllMTBJc0RhdGFWaWV3IDogaXNEYXRhVmlldzsiLCJpbXBvcnQgdGFnVGVzdGVyIGZyb20gJy4vX3RhZ1Rlc3Rlci5qcyc7XG5leHBvcnQgZGVmYXVsdCB0YWdUZXN0ZXIoJ0RhdGUnKTsiLCIvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0VsZW1lbnQob2JqKSB7XG4gIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbn0iLCJpbXBvcnQgZ2V0TGVuZ3RoIGZyb20gJy4vX2dldExlbmd0aC5qcyc7XG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXkuanMnO1xuaW1wb3J0IGlzU3RyaW5nIGZyb20gJy4vaXNTdHJpbmcuanMnO1xuaW1wb3J0IGlzQXJndW1lbnRzIGZyb20gJy4vaXNBcmd1bWVudHMuanMnO1xuaW1wb3J0IGtleXMgZnJvbSAnLi9rZXlzLmpzJzsgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4vLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlOyAvLyBTa2lwIHRoZSBtb3JlIGV4cGVuc2l2ZSBgdG9TdHJpbmdgLWJhc2VkIHR5cGUgY2hlY2tzIGlmIGBvYmpgIGhhcyBub1xuICAvLyBgLmxlbmd0aGAuXG5cbiAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChvYmopO1xuICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiAoaXNBcnJheShvYmopIHx8IGlzU3RyaW5nKG9iaikgfHwgaXNBcmd1bWVudHMob2JqKSkpIHJldHVybiBsZW5ndGggPT09IDA7XG4gIHJldHVybiBnZXRMZW5ndGgoa2V5cyhvYmopKSA9PT0gMDtcbn0iLCJpbXBvcnQgXyBmcm9tICcuL3VuZGVyc2NvcmUuanMnO1xuaW1wb3J0IHsgdG9TdHJpbmcsIFN5bWJvbFByb3RvIH0gZnJvbSAnLi9fc2V0dXAuanMnO1xuaW1wb3J0IGdldEJ5dGVMZW5ndGggZnJvbSAnLi9fZ2V0Qnl0ZUxlbmd0aC5qcyc7XG5pbXBvcnQgaXNUeXBlZEFycmF5IGZyb20gJy4vaXNUeXBlZEFycmF5LmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgeyBoYXNTdHJpbmdUYWdCdWcgfSBmcm9tICcuL19zdHJpbmdUYWdCdWcuanMnO1xuaW1wb3J0IGlzRGF0YVZpZXcgZnJvbSAnLi9pc0RhdGFWaWV3LmpzJztcbmltcG9ydCBrZXlzIGZyb20gJy4va2V5cy5qcyc7XG5pbXBvcnQgaGFzIGZyb20gJy4vX2hhcy5qcyc7XG5pbXBvcnQgdG9CdWZmZXJWaWV3IGZyb20gJy4vX3RvQnVmZmVyVmlldy5qcyc7IC8vIFdlIHVzZSB0aGlzIHN0cmluZyB0d2ljZSwgc28gZ2l2ZSBpdCBhIG5hbWUgZm9yIG1pbmlmaWNhdGlvbi5cblxudmFyIHRhZ0RhdGFWaWV3ID0gJ1tvYmplY3QgRGF0YVZpZXddJzsgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBfLmlzRXF1YWxgLlxuXG5mdW5jdGlvbiBlcShhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwczovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjsgLy8gYG51bGxgIG9yIGB1bmRlZmluZWRgIG9ubHkgZXF1YWwgdG8gaXRzZWxmIChzdHJpY3QgY29tcGFyaXNvbikuXG5cbiAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBmYWxzZTsgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cblxuICBpZiAoYSAhPT0gYSkgcmV0dXJuIGIgIT09IGI7IC8vIEV4aGF1c3QgcHJpbWl0aXZlIGNoZWNrc1xuXG4gIHZhciB0eXBlID0gdHlwZW9mIGE7XG4gIGlmICh0eXBlICE9PSAnZnVuY3Rpb24nICYmIHR5cGUgIT09ICdvYmplY3QnICYmIHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBkZWVwRXEoYSwgYiwgYVN0YWNrLCBiU3RhY2spO1xufSAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYF8uaXNFcXVhbGAuXG5cblxuZnVuY3Rpb24gZGVlcEVxKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkOyAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuXG4gIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICBpZiAoY2xhc3NOYW1lICE9PSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7IC8vIFdvcmsgYXJvdW5kIGEgYnVnIGluIElFIDEwIC0gRWRnZSAxMy5cblxuICBpZiAoaGFzU3RyaW5nVGFnQnVnICYmIGNsYXNzTmFtZSA9PSAnW29iamVjdCBPYmplY3RdJyAmJiBpc0RhdGFWaWV3KGEpKSB7XG4gICAgaWYgKCFpc0RhdGFWaWV3KGIpKSByZXR1cm4gZmFsc2U7XG4gICAgY2xhc3NOYW1lID0gdGFnRGF0YVZpZXc7XG4gIH1cblxuICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgIC8vIFRoZXNlIHR5cGVzIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOiAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuXG4gICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG5cbiAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cbiAgICAgIC8vIE9iamVjdChOYU4pIGlzIGVxdWl2YWxlbnQgdG8gTmFOLlxuICAgICAgaWYgKCthICE9PSArYSkgcmV0dXJuICtiICE9PSArYjsgLy8gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvciBvdGhlciBudW1lcmljIHZhbHVlcy5cblxuICAgICAgcmV0dXJuICthID09PSAwID8gMSAvICthID09PSAxIC8gYiA6ICthID09PSArYjtcblxuICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgcmV0dXJuICthID09PSArYjtcblxuICAgIGNhc2UgJ1tvYmplY3QgU3ltYm9sXSc6XG4gICAgICByZXR1cm4gU3ltYm9sUHJvdG8udmFsdWVPZi5jYWxsKGEpID09PSBTeW1ib2xQcm90by52YWx1ZU9mLmNhbGwoYik7XG5cbiAgICBjYXNlICdbb2JqZWN0IEFycmF5QnVmZmVyXSc6XG4gICAgY2FzZSB0YWdEYXRhVmlldzpcbiAgICAgIC8vIENvZXJjZSB0byB0eXBlZCBhcnJheSBzbyB3ZSBjYW4gZmFsbCB0aHJvdWdoLlxuICAgICAgcmV0dXJuIGRlZXBFcSh0b0J1ZmZlclZpZXcoYSksIHRvQnVmZmVyVmlldyhiKSwgYVN0YWNrLCBiU3RhY2spO1xuICB9XG5cbiAgdmFyIGFyZUFycmF5cyA9IGNsYXNzTmFtZSA9PT0gJ1tvYmplY3QgQXJyYXldJztcblxuICBpZiAoIWFyZUFycmF5cyAmJiBpc1R5cGVkQXJyYXkoYSkpIHtcbiAgICB2YXIgYnl0ZUxlbmd0aCA9IGdldEJ5dGVMZW5ndGgoYSk7XG4gICAgaWYgKGJ5dGVMZW5ndGggIT09IGdldEJ5dGVMZW5ndGgoYikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoYS5idWZmZXIgPT09IGIuYnVmZmVyICYmIGEuYnl0ZU9mZnNldCA9PT0gYi5ieXRlT2Zmc2V0KSByZXR1cm4gdHJ1ZTtcbiAgICBhcmVBcnJheXMgPSB0cnVlO1xuICB9XG5cbiAgaWYgKCFhcmVBcnJheXMpIHtcbiAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTsgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzIG9yIGBBcnJheWBzXG4gICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cblxuICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsXG4gICAgICAgIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcblxuICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShpc0Z1bmN0aW9uKGFDdG9yKSAmJiBhQ3RvciBpbnN0YW5jZW9mIGFDdG9yICYmIGlzRnVuY3Rpb24oYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpICYmICdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0gLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cbiAgLy8gSW5pdGlhbGl6aW5nIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG5cblxuICBhU3RhY2sgPSBhU3RhY2sgfHwgW107XG4gIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiO1xuICB9IC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cblxuXG4gIGFTdGFjay5wdXNoKGEpO1xuICBiU3RhY2sucHVzaChiKTsgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG5cbiAgaWYgKGFyZUFycmF5cykge1xuICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgIGxlbmd0aCA9IGEubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7IC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICB2YXIgX2tleXMgPSBrZXlzKGEpLFxuICAgICAgICBrZXk7XG5cbiAgICBsZW5ndGggPSBfa2V5cy5sZW5ndGg7IC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cblxuICAgIGlmIChrZXlzKGIpLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlclxuICAgICAga2V5ID0gX2tleXNbbGVuZ3RoXTtcbiAgICAgIGlmICghKGhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9IC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuXG5cbiAgYVN0YWNrLnBvcCgpO1xuICBiU3RhY2sucG9wKCk7XG4gIHJldHVybiB0cnVlO1xufSAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0VxdWFsKGEsIGIpIHtcbiAgcmV0dXJuIGVxKGEsIGIpO1xufSIsImltcG9ydCB0YWdUZXN0ZXIgZnJvbSAnLi9fdGFnVGVzdGVyLmpzJztcbmV4cG9ydCBkZWZhdWx0IHRhZ1Rlc3RlcignRXJyb3InKTsiLCJpbXBvcnQgeyBfaXNGaW5pdGUgfSBmcm9tICcuL19zZXR1cC5qcyc7XG5pbXBvcnQgaXNTeW1ib2wgZnJvbSAnLi9pc1N5bWJvbC5qcyc7IC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNGaW5pdGUob2JqKSB7XG4gIHJldHVybiAhaXNTeW1ib2wob2JqKSAmJiBfaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbn0iLCJpbXBvcnQgdGFnVGVzdGVyIGZyb20gJy4vX3RhZ1Rlc3Rlci5qcyc7XG5pbXBvcnQgeyByb290IH0gZnJvbSAnLi9fc2V0dXAuanMnO1xudmFyIGlzRnVuY3Rpb24gPSB0YWdUZXN0ZXIoJ0Z1bmN0aW9uJyk7IC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSBgdHlwZW9mYCBidWdzIGluIG9sZFxuLy8gdjgsIElFIDExICgjMTYyMSksIFNhZmFyaSA4ICgjMTkyOSksIGFuZCBQaGFudG9tSlMgKCMyMjM2KS5cblxudmFyIG5vZGVsaXN0ID0gcm9vdC5kb2N1bWVudCAmJiByb290LmRvY3VtZW50LmNoaWxkTm9kZXM7XG5cbmlmICh0eXBlb2YgLy4vICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIEludDhBcnJheSAhPSAnb2JqZWN0JyAmJiB0eXBlb2Ygbm9kZWxpc3QgIT0gJ2Z1bmN0aW9uJykge1xuICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzRnVuY3Rpb247IiwiaW1wb3J0IHRhZ1Rlc3RlciBmcm9tICcuL190YWdUZXN0ZXIuanMnO1xuaW1wb3J0IHsgaXNJRTExIH0gZnJvbSAnLi9fc3RyaW5nVGFnQnVnLmpzJztcbmltcG9ydCB7IGllMTFmaW5nZXJwcmludCwgbWFwTWV0aG9kcyB9IGZyb20gJy4vX21ldGhvZEZpbmdlcnByaW50LmpzJztcbmV4cG9ydCBkZWZhdWx0IGlzSUUxMSA/IGllMTFmaW5nZXJwcmludChtYXBNZXRob2RzKSA6IHRhZ1Rlc3RlcignTWFwJyk7IiwiaW1wb3J0IGtleXMgZnJvbSAnLi9rZXlzLmpzJzsgLy8gUmV0dXJucyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzTWF0Y2gob2JqZWN0LCBhdHRycykge1xuICB2YXIgX2tleXMgPSBrZXlzKGF0dHJzKSxcbiAgICAgIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDtcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiAhbGVuZ3RoO1xuICB2YXIgb2JqID0gT2JqZWN0KG9iamVjdCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBfa2V5c1tpXTtcbiAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0gfHwgIShrZXkgaW4gb2JqKSkgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59IiwiaW1wb3J0IHsgX2lzTmFOIH0gZnJvbSAnLi9fc2V0dXAuanMnO1xuaW1wb3J0IGlzTnVtYmVyIGZyb20gJy4vaXNOdW1iZXIuanMnOyAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzTmFOKG9iaikge1xuICByZXR1cm4gaXNOdW1iZXIob2JqKSAmJiBfaXNOYU4ob2JqKTtcbn0iLCIvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc051bGwob2JqKSB7XG4gIHJldHVybiBvYmogPT09IG51bGw7XG59IiwiaW1wb3J0IHRhZ1Rlc3RlciBmcm9tICcuL190YWdUZXN0ZXIuanMnO1xuZXhwb3J0IGRlZmF1bHQgdGFnVGVzdGVyKCdOdW1iZXInKTsiLCIvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xufSIsImltcG9ydCB0YWdUZXN0ZXIgZnJvbSAnLi9fdGFnVGVzdGVyLmpzJztcbmV4cG9ydCBkZWZhdWx0IHRhZ1Rlc3RlcignUmVnRXhwJyk7IiwiaW1wb3J0IHRhZ1Rlc3RlciBmcm9tICcuL190YWdUZXN0ZXIuanMnO1xuaW1wb3J0IHsgaXNJRTExIH0gZnJvbSAnLi9fc3RyaW5nVGFnQnVnLmpzJztcbmltcG9ydCB7IGllMTFmaW5nZXJwcmludCwgc2V0TWV0aG9kcyB9IGZyb20gJy4vX21ldGhvZEZpbmdlcnByaW50LmpzJztcbmV4cG9ydCBkZWZhdWx0IGlzSUUxMSA/IGllMTFmaW5nZXJwcmludChzZXRNZXRob2RzKSA6IHRhZ1Rlc3RlcignU2V0Jyk7IiwiaW1wb3J0IHRhZ1Rlc3RlciBmcm9tICcuL190YWdUZXN0ZXIuanMnO1xuZXhwb3J0IGRlZmF1bHQgdGFnVGVzdGVyKCdTdHJpbmcnKTsiLCJpbXBvcnQgdGFnVGVzdGVyIGZyb20gJy4vX3RhZ1Rlc3Rlci5qcyc7XG5leHBvcnQgZGVmYXVsdCB0YWdUZXN0ZXIoJ1N5bWJvbCcpOyIsImltcG9ydCB7IHN1cHBvcnRzQXJyYXlCdWZmZXIsIG5hdGl2ZUlzVmlldywgdG9TdHJpbmcgfSBmcm9tICcuL19zZXR1cC5qcyc7XG5pbXBvcnQgaXNEYXRhVmlldyBmcm9tICcuL2lzRGF0YVZpZXcuanMnO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gJy4vY29uc3RhbnQuanMnO1xuaW1wb3J0IGlzQnVmZmVyTGlrZSBmcm9tICcuL19pc0J1ZmZlckxpa2UuanMnOyAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgdHlwZWQgYXJyYXk/XG5cbnZhciB0eXBlZEFycmF5UGF0dGVybiA9IC9cXFtvYmplY3QgKChJfFVpKW50KDh8MTZ8MzIpfEZsb2F0KDMyfDY0KXxVaW50OENsYW1wZWR8QmlnKEl8VWkpbnQ2NClBcnJheVxcXS87XG5cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheShvYmopIHtcbiAgLy8gYEFycmF5QnVmZmVyLmlzVmlld2AgaXMgdGhlIG1vc3QgZnV0dXJlLXByb29mLCBzbyB1c2UgaXQgd2hlbiBhdmFpbGFibGUuXG4gIC8vIE90aGVyd2lzZSwgZmFsbCBiYWNrIG9uIHRoZSBhYm92ZSByZWd1bGFyIGV4cHJlc3Npb24uXG4gIHJldHVybiBuYXRpdmVJc1ZpZXcgPyBuYXRpdmVJc1ZpZXcob2JqKSAmJiAhaXNEYXRhVmlldyhvYmopIDogaXNCdWZmZXJMaWtlKG9iaikgJiYgdHlwZWRBcnJheVBhdHRlcm4udGVzdCh0b1N0cmluZy5jYWxsKG9iaikpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdXBwb3J0c0FycmF5QnVmZmVyID8gaXNUeXBlZEFycmF5IDogY29uc3RhbnQoZmFsc2UpOyIsIi8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHZvaWQgMDtcbn0iLCJpbXBvcnQgdGFnVGVzdGVyIGZyb20gJy4vX3RhZ1Rlc3Rlci5qcyc7XG5pbXBvcnQgeyBpc0lFMTEgfSBmcm9tICcuL19zdHJpbmdUYWdCdWcuanMnO1xuaW1wb3J0IHsgaWUxMWZpbmdlcnByaW50LCB3ZWFrTWFwTWV0aG9kcyB9IGZyb20gJy4vX21ldGhvZEZpbmdlcnByaW50LmpzJztcbmV4cG9ydCBkZWZhdWx0IGlzSUUxMSA/IGllMTFmaW5nZXJwcmludCh3ZWFrTWFwTWV0aG9kcykgOiB0YWdUZXN0ZXIoJ1dlYWtNYXAnKTsiLCJpbXBvcnQgdGFnVGVzdGVyIGZyb20gJy4vX3RhZ1Rlc3Rlci5qcyc7XG5leHBvcnQgZGVmYXVsdCB0YWdUZXN0ZXIoJ1dlYWtTZXQnKTsiLCJpbXBvcnQgXyBmcm9tICcuL3VuZGVyc2NvcmUuanMnO1xuaW1wb3J0IGJhc2VJdGVyYXRlZSBmcm9tICcuL19iYXNlSXRlcmF0ZWUuanMnOyAvLyBFeHRlcm5hbCB3cmFwcGVyIGZvciBvdXIgY2FsbGJhY2sgZ2VuZXJhdG9yLiBVc2VycyBtYXkgY3VzdG9taXplXG4vLyBgXy5pdGVyYXRlZWAgaWYgdGhleSB3YW50IGFkZGl0aW9uYWwgcHJlZGljYXRlL2l0ZXJhdGVlIHNob3J0aGFuZCBzdHlsZXMuXG4vLyBUaGlzIGFic3RyYWN0aW9uIGhpZGVzIHRoZSBpbnRlcm5hbC1vbmx5IGBhcmdDb3VudGAgYXJndW1lbnQuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGl0ZXJhdGVlKHZhbHVlLCBjb250ZXh0KSB7XG4gIHJldHVybiBiYXNlSXRlcmF0ZWUodmFsdWUsIGNvbnRleHQsIEluZmluaXR5KTtcbn1cbl8uaXRlcmF0ZWUgPSBpdGVyYXRlZTsiLCJpbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgeyBuYXRpdmVLZXlzLCBoYXNFbnVtQnVnIH0gZnJvbSAnLi9fc2V0dXAuanMnO1xuaW1wb3J0IGhhcyBmcm9tICcuL19oYXMuanMnO1xuaW1wb3J0IGNvbGxlY3ROb25FbnVtUHJvcHMgZnJvbSAnLi9fY29sbGVjdE5vbkVudW1Qcm9wcy5qcyc7IC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbi8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2AuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgdmFyIGtleXMgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7IC8vIEFoZW0sIElFIDwgOS5cblxuXG4gIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gIHJldHVybiBrZXlzO1xufSIsImltcG9ydCByZXN0IGZyb20gJy4vcmVzdC5qcyc7IC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbi8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxhc3QoYXJyYXksIG4sIGd1YXJkKSB7XG4gIGlmIChhcnJheSA9PSBudWxsIHx8IGFycmF5Lmxlbmd0aCA8IDEpIHJldHVybiBuID09IG51bGwgfHwgZ3VhcmQgPyB2b2lkIDAgOiBbXTtcbiAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICByZXR1cm4gcmVzdChhcnJheSwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gbikpO1xufSIsImltcG9ydCBmaW5kTGFzdEluZGV4IGZyb20gJy4vZmluZExhc3RJbmRleC5qcyc7XG5pbXBvcnQgY3JlYXRlSW5kZXhGaW5kZXIgZnJvbSAnLi9fY3JlYXRlSW5kZXhGaW5kZXIuanMnOyAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBsYXN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbi8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUluZGV4RmluZGVyKC0xLCBmaW5kTGFzdEluZGV4KTsiLCJpbXBvcnQgY2IgZnJvbSAnLi9fY2IuanMnO1xuaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vX2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCBrZXlzIGZyb20gJy4va2V5cy5qcyc7IC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50LlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXAob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcblxuICB2YXIgX2tleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBrZXlzKG9iaiksXG4gICAgICBsZW5ndGggPSAoX2tleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICByZXN1bHRzID0gQXJyYXkobGVuZ3RoKTtcblxuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgdmFyIGN1cnJlbnRLZXkgPSBfa2V5cyA/IF9rZXlzW2luZGV4XSA6IGluZGV4O1xuICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59IiwiaW1wb3J0IGNiIGZyb20gJy4vX2NiLmpzJztcbmltcG9ydCBrZXlzIGZyb20gJy4va2V5cy5qcyc7IC8vIFJldHVybnMgdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGBpdGVyYXRlZWAgdG8gZWFjaCBlbGVtZW50IG9mIGBvYmpgLlxuLy8gSW4gY29udHJhc3QgdG8gYF8ubWFwYCBpdCByZXR1cm5zIGFuIG9iamVjdC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFwT2JqZWN0KG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG5cbiAgdmFyIF9rZXlzID0ga2V5cyhvYmopLFxuICAgICAgbGVuZ3RoID0gX2tleXMubGVuZ3RoLFxuICAgICAgcmVzdWx0cyA9IHt9O1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICB2YXIgY3VycmVudEtleSA9IF9rZXlzW2luZGV4XTtcbiAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59IiwiaW1wb3J0IGV4dGVuZE93biBmcm9tICcuL2V4dGVuZE93bi5qcyc7XG5pbXBvcnQgaXNNYXRjaCBmcm9tICcuL2lzTWF0Y2guanMnOyAvLyBSZXR1cm5zIGEgcHJlZGljYXRlIGZvciBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2Zcbi8vIGBrZXk6dmFsdWVgIHBhaXJzLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaGVyKGF0dHJzKSB7XG4gIGF0dHJzID0gZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIGlzTWF0Y2gob2JqLCBhdHRycyk7XG4gIH07XG59IiwiaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vX2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCB2YWx1ZXMgZnJvbSAnLi92YWx1ZXMuanMnO1xuaW1wb3J0IGNiIGZyb20gJy4vX2NiLmpzJztcbmltcG9ydCBlYWNoIGZyb20gJy4vZWFjaC5qcyc7IC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF4KG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSxcbiAgICAgIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgIHZhbHVlLFxuICAgICAgY29tcHV0ZWQ7XG5cbiAgaWYgKGl0ZXJhdGVlID09IG51bGwgfHwgdHlwZW9mIGl0ZXJhdGVlID09ICdudW1iZXInICYmIHR5cGVvZiBvYmpbMF0gIT0gJ29iamVjdCcgJiYgb2JqICE9IG51bGwpIHtcbiAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogdmFsdWVzKG9iaik7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZSA9IG9ialtpXTtcblxuICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPiByZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbiAodiwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodiwgaW5kZXgsIGxpc3QpO1xuXG4gICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICByZXN1bHQgPSB2O1xuICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59IiwiaW1wb3J0IGhhcyBmcm9tICcuL19oYXMuanMnOyAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIGhhc2hlcikge1xuICB2YXIgbWVtb2l6ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgY2FjaGUgPSBtZW1vaXplLmNhY2hlO1xuICAgIHZhciBhZGRyZXNzID0gJycgKyAoaGFzaGVyID8gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBrZXkpO1xuICAgIGlmICghaGFzKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIGNhY2hlW2FkZHJlc3NdO1xuICB9O1xuXG4gIG1lbW9pemUuY2FjaGUgPSB7fTtcbiAgcmV0dXJuIG1lbW9pemU7XG59IiwiaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vX2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCB2YWx1ZXMgZnJvbSAnLi92YWx1ZXMuanMnO1xuaW1wb3J0IGNiIGZyb20gJy4vX2NiLmpzJztcbmltcG9ydCBlYWNoIGZyb20gJy4vZWFjaC5qcyc7IC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWluKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgdmFyIHJlc3VsdCA9IEluZmluaXR5LFxuICAgICAgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICB2YWx1ZSxcbiAgICAgIGNvbXB1dGVkO1xuXG4gIGlmIChpdGVyYXRlZSA9PSBudWxsIHx8IHR5cGVvZiBpdGVyYXRlZSA9PSAnbnVtYmVyJyAmJiB0eXBlb2Ygb2JqWzBdICE9ICdvYmplY3QnICYmIG9iaiAhPSBudWxsKSB7XG4gICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IHZhbHVlcyhvYmopO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWUgPSBvYmpbaV07XG5cbiAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlIDwgcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24gKHYsIGluZGV4LCBsaXN0KSB7XG4gICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHYsIGluZGV4LCBsaXN0KTtcblxuICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSBJbmZpbml0eSAmJiByZXN1bHQgPT09IEluZmluaXR5KSB7XG4gICAgICAgIHJlc3VsdCA9IHY7XG4gICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn0iLCJpbXBvcnQgXyBmcm9tICcuL3VuZGVyc2NvcmUuanMnO1xuaW1wb3J0IGVhY2ggZnJvbSAnLi9lYWNoLmpzJztcbmltcG9ydCBmdW5jdGlvbnMgZnJvbSAnLi9mdW5jdGlvbnMuanMnO1xuaW1wb3J0IHsgcHVzaCB9IGZyb20gJy4vX3NldHVwLmpzJztcbmltcG9ydCBjaGFpblJlc3VsdCBmcm9tICcuL19jaGFpblJlc3VsdC5qcyc7IC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGVhY2goZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuXG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjaGFpblJlc3VsdCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICB9O1xuICB9KTtcbiAgcmV0dXJuIF87XG59IiwiLy8gUmV0dXJucyBhIG5lZ2F0ZWQgdmVyc2lvbiBvZiB0aGUgcGFzc2VkLWluIHByZWRpY2F0ZS5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5lZ2F0ZShwcmVkaWNhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufSIsIi8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9uLiBPZnRlbiB1c2VmdWwgb3V0c2lkZSBvZiBVbmRlcnNjb3JlLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm9vcCgpIHt9IiwiLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuZXhwb3J0IGRlZmF1bHQgRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG59OyIsImltcG9ydCBnZXRMZW5ndGggZnJvbSAnLi9fZ2V0TGVuZ3RoLmpzJzsgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4vLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuIFBhc3NpbmcgYnkgcGFpcnMgaXMgdGhlIHJldmVyc2Ugb2YgYF8ucGFpcnNgLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvYmplY3QobGlzdCwgdmFsdWVzKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGxpc3QpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodmFsdWVzKSB7XG4gICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn0iLCJpbXBvcnQgcmVzdEFyZ3VtZW50cyBmcm9tICcuL3Jlc3RBcmd1bWVudHMuanMnO1xuaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pc0Z1bmN0aW9uLmpzJztcbmltcG9ydCBuZWdhdGUgZnJvbSAnLi9uZWdhdGUuanMnO1xuaW1wb3J0IG1hcCBmcm9tICcuL21hcC5qcyc7XG5pbXBvcnQgZmxhdHRlbiBmcm9tICcuL19mbGF0dGVuLmpzJztcbmltcG9ydCBjb250YWlucyBmcm9tICcuL2NvbnRhaW5zLmpzJztcbmltcG9ydCBwaWNrIGZyb20gJy4vcGljay5qcyc7IC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBkaXNhbGxvd2VkIHByb3BlcnRpZXMuXG5cbmV4cG9ydCBkZWZhdWx0IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24gKG9iaiwga2V5cykge1xuICB2YXIgaXRlcmF0ZWUgPSBrZXlzWzBdLFxuICAgICAgY29udGV4dDtcblxuICBpZiAoaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICBpdGVyYXRlZSA9IG5lZ2F0ZShpdGVyYXRlZSk7XG4gICAgaWYgKGtleXMubGVuZ3RoID4gMSkgY29udGV4dCA9IGtleXNbMV07XG4gIH0gZWxzZSB7XG4gICAga2V5cyA9IG1hcChmbGF0dGVuKGtleXMsIGZhbHNlLCBmYWxzZSksIFN0cmluZyk7XG5cbiAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICByZXR1cm4gIWNvbnRhaW5zKGtleXMsIGtleSk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBwaWNrKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xufSk7IiwiaW1wb3J0IHBhcnRpYWwgZnJvbSAnLi9wYXJ0aWFsLmpzJztcbmltcG9ydCBiZWZvcmUgZnJvbSAnLi9iZWZvcmUuanMnOyAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbi8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG5cbmV4cG9ydCBkZWZhdWx0IHBhcnRpYWwoYmVmb3JlLCAyKTsiLCJpbXBvcnQga2V5cyBmcm9tICcuL2tleXMuanMnOyAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbi8vIFRoZSBvcHBvc2l0ZSBvZiBgXy5vYmplY3RgIHdpdGggb25lIGFyZ3VtZW50LlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYWlycyhvYmopIHtcbiAgdmFyIF9rZXlzID0ga2V5cyhvYmopO1xuXG4gIHZhciBsZW5ndGggPSBfa2V5cy5sZW5ndGg7XG4gIHZhciBwYWlycyA9IEFycmF5KGxlbmd0aCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHBhaXJzW2ldID0gW19rZXlzW2ldLCBvYmpbX2tleXNbaV1dXTtcbiAgfVxuXG4gIHJldHVybiBwYWlycztcbn0iLCJpbXBvcnQgcmVzdEFyZ3VtZW50cyBmcm9tICcuL3Jlc3RBcmd1bWVudHMuanMnO1xuaW1wb3J0IGV4ZWN1dGVCb3VuZCBmcm9tICcuL19leGVjdXRlQm91bmQuanMnO1xuaW1wb3J0IF8gZnJvbSAnLi91bmRlcnNjb3JlLmpzJzsgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIGBfYCBhY3RzXG4vLyBhcyBhIHBsYWNlaG9sZGVyIGJ5IGRlZmF1bHQsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmVcbi8vIHByZS1maWxsZWQuIFNldCBgXy5wYXJ0aWFsLnBsYWNlaG9sZGVyYCBmb3IgYSBjdXN0b20gcGxhY2Vob2xkZXIgYXJndW1lbnQuXG5cbnZhciBwYXJ0aWFsID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbiAoZnVuYywgYm91bmRBcmdzKSB7XG4gIHZhciBwbGFjZWhvbGRlciA9IHBhcnRpYWwucGxhY2Vob2xkZXI7XG5cbiAgdmFyIGJvdW5kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IDAsXG4gICAgICAgIGxlbmd0aCA9IGJvdW5kQXJncy5sZW5ndGg7XG4gICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGJvdW5kQXJnc1tpXSA9PT0gcGxhY2Vob2xkZXIgPyBhcmd1bWVudHNbcG9zaXRpb24rK10gOiBib3VuZEFyZ3NbaV07XG4gICAgfVxuXG4gICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG5cbiAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgfTtcblxuICByZXR1cm4gYm91bmQ7XG59KTtcbnBhcnRpYWwucGxhY2Vob2xkZXIgPSBfO1xuZXhwb3J0IGRlZmF1bHQgcGFydGlhbDsiLCJpbXBvcnQgZ3JvdXAgZnJvbSAnLi9fZ3JvdXAuanMnOyAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHBhc3MgdGhlIGdpdmVuXG4vLyB0cnV0aCB0ZXN0LCBhbmQgb25lIHdob3NlIGVsZW1lbnRzIGFsbCBkbyBub3QgcGFzcyB0aGUgdHJ1dGggdGVzdC5cblxuZXhwb3J0IGRlZmF1bHQgZ3JvdXAoZnVuY3Rpb24gKHJlc3VsdCwgdmFsdWUsIHBhc3MpIHtcbiAgcmVzdWx0W3Bhc3MgPyAwIDogMV0ucHVzaCh2YWx1ZSk7XG59LCB0cnVlKTsiLCJpbXBvcnQgcmVzdEFyZ3VtZW50cyBmcm9tICcuL3Jlc3RBcmd1bWVudHMuanMnO1xuaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pc0Z1bmN0aW9uLmpzJztcbmltcG9ydCBvcHRpbWl6ZUNiIGZyb20gJy4vX29wdGltaXplQ2IuanMnO1xuaW1wb3J0IGFsbEtleXMgZnJvbSAnLi9hbGxLZXlzLmpzJztcbmltcG9ydCBrZXlJbk9iaiBmcm9tICcuL19rZXlJbk9iai5qcyc7XG5pbXBvcnQgZmxhdHRlbiBmcm9tICcuL19mbGF0dGVuLmpzJzsgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgYWxsb3dlZCBwcm9wZXJ0aWVzLlxuXG5leHBvcnQgZGVmYXVsdCByZXN0QXJndW1lbnRzKGZ1bmN0aW9uIChvYmosIGtleXMpIHtcbiAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgaXRlcmF0ZWUgPSBrZXlzWzBdO1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaXRlcmF0ZWUpKSB7XG4gICAgaWYgKGtleXMubGVuZ3RoID4gMSkgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBrZXlzWzFdKTtcbiAgICBrZXlzID0gYWxsS2V5cyhvYmopO1xuICB9IGVsc2Uge1xuICAgIGl0ZXJhdGVlID0ga2V5SW5PYmo7XG4gICAga2V5cyA9IGZsYXR0ZW4oa2V5cywgZmFsc2UsIGZhbHNlKTtcbiAgICBvYmogPSBPYmplY3Qob2JqKTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufSk7IiwiaW1wb3J0IG1hcCBmcm9tICcuL21hcC5qcyc7XG5pbXBvcnQgcHJvcGVydHkgZnJvbSAnLi9wcm9wZXJ0eS5qcyc7IC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYF8ubWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGx1Y2sob2JqLCBrZXkpIHtcbiAgcmV0dXJuIG1hcChvYmosIHByb3BlcnR5KGtleSkpO1xufSIsImltcG9ydCBkZWVwR2V0IGZyb20gJy4vX2RlZXBHZXQuanMnO1xuaW1wb3J0IHRvUGF0aCBmcm9tICcuL190b1BhdGguanMnOyAvLyBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBwYXNzZWQgYW4gb2JqZWN0LCB3aWxsIHRyYXZlcnNlIHRoYXQgb2JqZWN04oCZc1xuLy8gcHJvcGVydGllcyBkb3duIHRoZSBnaXZlbiBgcGF0aGAsIHNwZWNpZmllZCBhcyBhbiBhcnJheSBvZiBrZXlzIG9yIGluZGljZXMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHByb3BlcnR5KHBhdGgpIHtcbiAgcGF0aCA9IHRvUGF0aChwYXRoKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gZGVlcEdldChvYmosIHBhdGgpO1xuICB9O1xufSIsImltcG9ydCBub29wIGZyb20gJy4vbm9vcC5qcyc7XG5pbXBvcnQgZ2V0IGZyb20gJy4vZ2V0LmpzJzsgLy8gR2VuZXJhdGVzIGEgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gb2JqZWN0IHRoYXQgcmV0dXJucyBhIGdpdmVuIHByb3BlcnR5LlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwcm9wZXJ0eU9mKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiBub29wO1xuICByZXR1cm4gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICByZXR1cm4gZ2V0KG9iaiwgcGF0aCk7XG4gIH07XG59IiwiLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBgbWluYCBhbmQgYG1heGAgKGluY2x1c2l2ZSkuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYW5kb20obWluLCBtYXgpIHtcbiAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgbWF4ID0gbWluO1xuICAgIG1pbiA9IDA7XG4gIH1cblxuICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbn0iLCIvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4vLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYW5nZShzdGFydCwgc3RvcCwgc3RlcCkge1xuICBpZiAoc3RvcCA9PSBudWxsKSB7XG4gICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgc3RhcnQgPSAwO1xuICB9XG5cbiAgaWYgKCFzdGVwKSB7XG4gICAgc3RlcCA9IHN0b3AgPCBzdGFydCA/IC0xIDogMTtcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gIHZhciByYW5nZSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbGVuZ3RoOyBpZHgrKywgc3RhcnQgKz0gc3RlcCkge1xuICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn0iLCJpbXBvcnQgY3JlYXRlUmVkdWNlIGZyb20gJy4vX2NyZWF0ZVJlZHVjZS5qcyc7IC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbi8vIG9yIGBmb2xkbGAuXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJlZHVjZSgxKTsiLCJpbXBvcnQgY3JlYXRlUmVkdWNlIGZyb20gJy4vX2NyZWF0ZVJlZHVjZS5qcyc7IC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSZWR1Y2UoLTEpOyIsImltcG9ydCBmaWx0ZXIgZnJvbSAnLi9maWx0ZXIuanMnO1xuaW1wb3J0IG5lZ2F0ZSBmcm9tICcuL25lZ2F0ZS5qcyc7XG5pbXBvcnQgY2IgZnJvbSAnLi9fY2IuanMnOyAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWplY3Qob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgcmV0dXJuIGZpbHRlcihvYmosIG5lZ2F0ZShjYihwcmVkaWNhdGUpKSwgY29udGV4dCk7XG59IiwiaW1wb3J0IHsgc2xpY2UgfSBmcm9tICcuL19zZXR1cC5qcyc7IC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBgYXJyYXlgLiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuLy8gdGhlIGBhcmd1bWVudHNgIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVybiB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGVcbi8vIGBhcnJheWAuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc3QoYXJyYXksIG4sIGd1YXJkKSB7XG4gIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbik7XG59IiwiLy8gU29tZSBmdW5jdGlvbnMgdGFrZSBhIHZhcmlhYmxlIG51bWJlciBvZiBhcmd1bWVudHMsIG9yIGEgZmV3IGV4cGVjdGVkXG4vLyBhcmd1bWVudHMgYXQgdGhlIGJlZ2lubmluZyBhbmQgdGhlbiBhIHZhcmlhYmxlIG51bWJlciBvZiB2YWx1ZXMgdG8gb3BlcmF0ZVxuLy8gb24uIFRoaXMgaGVscGVyIGFjY3VtdWxhdGVzIGFsbCByZW1haW5pbmcgYXJndW1lbnRzIHBhc3QgdGhlIGZ1bmN0aW9u4oCZc1xuLy8gYXJndW1lbnQgbGVuZ3RoIChvciBhbiBleHBsaWNpdCBgc3RhcnRJbmRleGApLCBpbnRvIGFuIGFycmF5IHRoYXQgYmVjb21lc1xuLy8gdGhlIGxhc3QgYXJndW1lbnQuIFNpbWlsYXIgdG8gRVM24oCZcyBcInJlc3QgcGFyYW1ldGVyXCIuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXN0QXJndW1lbnRzKGZ1bmMsIHN0YXJ0SW5kZXgpIHtcbiAgc3RhcnRJbmRleCA9IHN0YXJ0SW5kZXggPT0gbnVsbCA/IGZ1bmMubGVuZ3RoIC0gMSA6ICtzdGFydEluZGV4O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChhcmd1bWVudHMubGVuZ3RoIC0gc3RhcnRJbmRleCwgMCksXG4gICAgICAgIHJlc3QgPSBBcnJheShsZW5ndGgpLFxuICAgICAgICBpbmRleCA9IDA7XG5cbiAgICBmb3IgKDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJlc3RbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4ICsgc3RhcnRJbmRleF07XG4gICAgfVxuXG4gICAgc3dpdGNoIChzdGFydEluZGV4KSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpcywgcmVzdCk7XG5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmd1bWVudHNbMF0sIHJlc3QpO1xuXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0sIHJlc3QpO1xuICAgIH1cblxuICAgIHZhciBhcmdzID0gQXJyYXkoc3RhcnRJbmRleCArIDEpO1xuXG4gICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgc3RhcnRJbmRleDsgaW5kZXgrKykge1xuICAgICAgYXJnc1tpbmRleF0gPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgIH1cblxuICAgIGFyZ3Nbc3RhcnRJbmRleF0gPSByZXN0O1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xufSIsImltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgdG9QYXRoIGZyb20gJy4vX3RvUGF0aC5qcyc7IC8vIFRyYXZlcnNlcyB0aGUgY2hpbGRyZW4gb2YgYG9iamAgYWxvbmcgYHBhdGhgLiBJZiBhIGNoaWxkIGlzIGEgZnVuY3Rpb24sIGl0XG4vLyBpcyBpbnZva2VkIHdpdGggaXRzIHBhcmVudCBhcyBjb250ZXh0LiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZmluYWxcbi8vIGNoaWxkLCBvciBgZmFsbGJhY2tgIGlmIGFueSBjaGlsZCBpcyB1bmRlZmluZWQuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc3VsdChvYmosIHBhdGgsIGZhbGxiYWNrKSB7XG4gIHBhdGggPSB0b1BhdGgocGF0aCk7XG4gIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aDtcblxuICBpZiAoIWxlbmd0aCkge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKGZhbGxiYWNrKSA/IGZhbGxiYWNrLmNhbGwob2JqKSA6IGZhbGxiYWNrO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBwcm9wID0gb2JqID09IG51bGwgPyB2b2lkIDAgOiBvYmpbcGF0aFtpXV07XG5cbiAgICBpZiAocHJvcCA9PT0gdm9pZCAwKSB7XG4gICAgICBwcm9wID0gZmFsbGJhY2s7XG4gICAgICBpID0gbGVuZ3RoOyAvLyBFbnN1cmUgd2UgZG9uJ3QgY29udGludWUgaXRlcmF0aW5nLlxuICAgIH1cblxuICAgIG9iaiA9IGlzRnVuY3Rpb24ocHJvcCkgPyBwcm9wLmNhbGwob2JqKSA6IHByb3A7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufSIsImltcG9ydCBpc0FycmF5TGlrZSBmcm9tICcuL19pc0FycmF5TGlrZS5qcyc7XG5pbXBvcnQgY2xvbmUgZnJvbSAnLi9jbG9uZS5qcyc7XG5pbXBvcnQgdmFsdWVzIGZyb20gJy4vdmFsdWVzLmpzJztcbmltcG9ydCBnZXRMZW5ndGggZnJvbSAnLi9fZ2V0TGVuZ3RoLmpzJztcbmltcG9ydCByYW5kb20gZnJvbSAnLi9yYW5kb20uanMnOyAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbiB1c2luZyB0aGUgbW9kZXJuIHZlcnNpb24gb2YgdGhlXG4vLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbi8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2FtcGxlKG9iaiwgbiwgZ3VhcmQpIHtcbiAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gdmFsdWVzKG9iaik7XG4gICAgcmV0dXJuIG9ialtyYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgfVxuXG4gIHZhciBzYW1wbGUgPSBpc0FycmF5TGlrZShvYmopID8gY2xvbmUob2JqKSA6IHZhbHVlcyhvYmopO1xuICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKHNhbXBsZSk7XG4gIG4gPSBNYXRoLm1heChNYXRoLm1pbihuLCBsZW5ndGgpLCAwKTtcbiAgdmFyIGxhc3QgPSBsZW5ndGggLSAxO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBuOyBpbmRleCsrKSB7XG4gICAgdmFyIHJhbmQgPSByYW5kb20oaW5kZXgsIGxhc3QpO1xuICAgIHZhciB0ZW1wID0gc2FtcGxlW2luZGV4XTtcbiAgICBzYW1wbGVbaW5kZXhdID0gc2FtcGxlW3JhbmRdO1xuICAgIHNhbXBsZVtyYW5kXSA9IHRlbXA7XG4gIH1cblxuICByZXR1cm4gc2FtcGxlLnNsaWNlKDAsIG4pO1xufSIsImltcG9ydCBzYW1wbGUgZnJvbSAnLi9zYW1wbGUuanMnOyAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbi5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2h1ZmZsZShvYmopIHtcbiAgcmV0dXJuIHNhbXBsZShvYmosIEluZmluaXR5KTtcbn0iLCJpbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9faXNBcnJheUxpa2UuanMnO1xuaW1wb3J0IGtleXMgZnJvbSAnLi9rZXlzLmpzJzsgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYSBjb2xsZWN0aW9uLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaXplKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqKSA/IG9iai5sZW5ndGggOiBrZXlzKG9iaikubGVuZ3RoO1xufSIsImltcG9ydCBjYiBmcm9tICcuL19jYi5qcyc7XG5pbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9faXNBcnJheUxpa2UuanMnO1xuaW1wb3J0IGtleXMgZnJvbSAnLi9rZXlzLmpzJzsgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgcGFzc2VzIGEgdHJ1dGggdGVzdC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc29tZShvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuXG4gIHZhciBfa2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIGtleXMob2JqKSxcbiAgICAgIGxlbmd0aCA9IChfa2V5cyB8fCBvYmopLmxlbmd0aDtcblxuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgdmFyIGN1cnJlbnRLZXkgPSBfa2V5cyA/IF9rZXlzW2luZGV4XSA6IGluZGV4O1xuICAgIGlmIChwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn0iLCJpbXBvcnQgY2IgZnJvbSAnLi9fY2IuanMnO1xuaW1wb3J0IHBsdWNrIGZyb20gJy4vcGx1Y2suanMnO1xuaW1wb3J0IG1hcCBmcm9tICcuL21hcC5qcyc7IC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRlZS5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc29ydEJ5KG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgdmFyIGluZGV4ID0gMDtcbiAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gIHJldHVybiBwbHVjayhtYXAob2JqLCBmdW5jdGlvbiAodmFsdWUsIGtleSwgbGlzdCkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBpbmRleDogaW5kZXgrKyxcbiAgICAgIGNyaXRlcmlhOiBpdGVyYXRlZSh2YWx1ZSwga2V5LCBsaXN0KVxuICAgIH07XG4gIH0pLnNvcnQoZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG5cbiAgICBpZiAoYSAhPT0gYikge1xuICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgfSksICd2YWx1ZScpO1xufSIsImltcG9ydCBjYiBmcm9tICcuL19jYi5qcyc7XG5pbXBvcnQgZ2V0TGVuZ3RoIGZyb20gJy4vX2dldExlbmd0aC5qcyc7IC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbi8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc29ydGVkSW5kZXgoYXJyYXksIG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gIHZhciB2YWx1ZSA9IGl0ZXJhdGVlKG9iaik7XG4gIHZhciBsb3cgPSAwLFxuICAgICAgaGlnaCA9IGdldExlbmd0aChhcnJheSk7XG5cbiAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICB2YXIgbWlkID0gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKTtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbbWlkXSkgPCB2YWx1ZSkgbG93ID0gbWlkICsgMTtlbHNlIGhpZ2ggPSBtaWQ7XG4gIH1cblxuICByZXR1cm4gbG93O1xufSIsIi8vIEludm9rZXMgYGludGVyY2VwdG9yYCB3aXRoIHRoZSBgb2JqYCBhbmQgdGhlbiByZXR1cm5zIGBvYmpgLlxuLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4vLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRhcChvYmosIGludGVyY2VwdG9yKSB7XG4gIGludGVyY2VwdG9yKG9iaik7XG4gIHJldHVybiBvYmo7XG59IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMuanMnO1xuaW1wb3J0IF8gZnJvbSAnLi91bmRlcnNjb3JlLmpzJztcbmltcG9ydCAnLi90ZW1wbGF0ZVNldHRpbmdzLmpzJzsgLy8gV2hlbiBjdXN0b21pemluZyBgXy50ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4vLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4vLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cblxudmFyIG5vTWF0Y2ggPSAvKC4pXi87IC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4vLyBzdHJpbmcgbGl0ZXJhbC5cblxudmFyIGVzY2FwZXMgPSB7XG4gIFwiJ1wiOiBcIidcIixcbiAgJ1xcXFwnOiAnXFxcXCcsXG4gICdcXHInOiAncicsXG4gICdcXG4nOiAnbicsXG4gICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgJ1xcdTIwMjknOiAndTIwMjknXG59O1xudmFyIGVzY2FwZVJlZ0V4cCA9IC9cXFxcfCd8XFxyfFxcbnxcXHUyMDI4fFxcdTIwMjkvZztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihtYXRjaCkge1xuICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG59IC8vIEluIG9yZGVyIHRvIHByZXZlbnQgdGhpcmQtcGFydHkgY29kZSBpbmplY3Rpb24gdGhyb3VnaFxuLy8gYF8udGVtcGxhdGVTZXR0aW5ncy52YXJpYWJsZWAsIHdlIHRlc3QgaXQgYWdhaW5zdCB0aGUgZm9sbG93aW5nIHJlZ3VsYXJcbi8vIGV4cHJlc3Npb24uIEl0IGlzIGludGVudGlvbmFsbHkgYSBiaXQgbW9yZSBsaWJlcmFsIHRoYW4ganVzdCBtYXRjaGluZyB2YWxpZFxuLy8gaWRlbnRpZmllcnMsIGJ1dCBzdGlsbCBwcmV2ZW50cyBwb3NzaWJsZSBsb29waG9sZXMgdGhyb3VnaCBkZWZhdWx0cyBvclxuLy8gZGVzdHJ1Y3R1cmluZyBhc3NpZ25tZW50LlxuXG5cbnZhciBiYXJlSWRlbnRpZmllciA9IC9eXFxzKihcXHd8XFwkKStcXHMqJC87IC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4vLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4vLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbi8vIE5COiBgb2xkU2V0dGluZ3NgIG9ubHkgZXhpc3RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUodGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gIGlmICghc2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MpIHNldHRpbmdzID0gb2xkU2V0dGluZ3M7XG4gIHNldHRpbmdzID0gZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpOyAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cblxuICB2YXIgbWF0Y2hlciA9IFJlZ0V4cChbKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7IC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG5cbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbiAobWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KS5yZXBsYWNlKGVzY2FwZVJlZ0V4cCwgZXNjYXBlQ2hhcik7XG4gICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICBpZiAoZXNjYXBlKSB7XG4gICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUpIHtcbiAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgfSAvLyBBZG9iZSBWTXMgbmVlZCB0aGUgbWF0Y2ggcmV0dXJuZWQgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBvZmZzZXQuXG5cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfSk7XG4gIHNvdXJjZSArPSBcIic7XFxuXCI7XG4gIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlO1xuXG4gIGlmIChhcmd1bWVudCkge1xuICAgIC8vIEluc3VyZSBhZ2FpbnN0IHRoaXJkLXBhcnR5IGNvZGUgaW5qZWN0aW9uLiAoQ1ZFLTIwMjEtMjMzNTgpXG4gICAgaWYgKCFiYXJlSWRlbnRpZmllci50ZXN0KGFyZ3VtZW50KSkgdGhyb3cgbmV3IEVycm9yKCd2YXJpYWJsZSBpcyBub3QgYSBiYXJlIGlkZW50aWZpZXI6ICcgKyBhcmd1bWVudCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuICAgIGFyZ3VtZW50ID0gJ29iaic7XG4gIH1cblxuICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArIHNvdXJjZSArICdyZXR1cm4gX19wO1xcbic7XG4gIHZhciByZW5kZXI7XG5cbiAgdHJ5IHtcbiAgICByZW5kZXIgPSBuZXcgRnVuY3Rpb24oYXJndW1lbnQsICdfJywgc291cmNlKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGUuc291cmNlID0gc291cmNlO1xuICAgIHRocm93IGU7XG4gIH1cblxuICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgfTsgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuXG5cbiAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyBhcmd1bWVudCArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn0iLCJpbXBvcnQgXyBmcm9tICcuL3VuZGVyc2NvcmUuanMnOyAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMuIENoYW5nZSB0aGVcbi8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cblxuZXhwb3J0IGRlZmF1bHQgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICBldmFsdWF0ZTogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgaW50ZXJwb2xhdGU6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICBlc2NhcGU6IC88JS0oW1xcc1xcU10rPyklPi9nXG59OyIsImltcG9ydCBub3cgZnJvbSAnLi9ub3cuanMnOyAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2Vcbi8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3Ncbi8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciB0aW1lb3V0LCBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gIHZhciBwcmV2aW91cyA9IDA7XG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbm93KCk7XG4gICAgdGltZW91dCA9IG51bGw7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgfTtcblxuICB2YXIgdGhyb3R0bGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfbm93ID0gbm93KCk7XG5cbiAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gX25vdztcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChfbm93IC0gcHJldmlvdXMpO1xuICAgIGNvbnRleHQgPSB0aGlzO1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcHJldmlvdXMgPSBfbm93O1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgcHJldmlvdXMgPSAwO1xuICAgIHRpbWVvdXQgPSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gIH07XG5cbiAgcmV0dXJuIHRocm90dGxlZDtcbn0iLCJpbXBvcnQgb3B0aW1pemVDYiBmcm9tICcuL19vcHRpbWl6ZUNiLmpzJzsgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRpbWVzKG4sIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcblxuICByZXR1cm4gYWNjdW07XG59IiwiaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcbmltcG9ydCB7IHNsaWNlIH0gZnJvbSAnLi9fc2V0dXAuanMnO1xuaW1wb3J0IGlzU3RyaW5nIGZyb20gJy4vaXNTdHJpbmcuanMnO1xuaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vX2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCBtYXAgZnJvbSAnLi9tYXAuanMnO1xuaW1wb3J0IGlkZW50aXR5IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuaW1wb3J0IHZhbHVlcyBmcm9tICcuL3ZhbHVlcy5qcyc7IC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG5cbnZhciByZVN0clN5bWJvbCA9IC9bXlxcdWQ4MDAtXFx1ZGZmZl18W1xcdWQ4MDAtXFx1ZGJmZl1bXFx1ZGMwMC1cXHVkZmZmXXxbXFx1ZDgwMC1cXHVkZmZmXS9nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9BcnJheShvYmopIHtcbiAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgaWYgKGlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcblxuICBpZiAoaXNTdHJpbmcob2JqKSkge1xuICAgIC8vIEtlZXAgc3Vycm9nYXRlIHBhaXIgY2hhcmFjdGVycyB0b2dldGhlci5cbiAgICByZXR1cm4gb2JqLm1hdGNoKHJlU3RyU3ltYm9sKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5TGlrZShvYmopKSByZXR1cm4gbWFwKG9iaiwgaWRlbnRpdHkpO1xuICByZXR1cm4gdmFsdWVzKG9iaik7XG59IiwiaW1wb3J0IF8gZnJvbSAnLi91bmRlcnNjb3JlLmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheS5qcyc7IC8vIE5vcm1hbGl6ZSBhIChkZWVwKSBwcm9wZXJ0eSBgcGF0aGAgdG8gYXJyYXkuXG4vLyBMaWtlIGBfLml0ZXJhdGVlYCwgdGhpcyBmdW5jdGlvbiBjYW4gYmUgY3VzdG9taXplZC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9QYXRoKHBhdGgpIHtcbiAgcmV0dXJuIGlzQXJyYXkocGF0aCkgPyBwYXRoIDogW3BhdGhdO1xufVxuXy50b1BhdGggPSB0b1BhdGg7IiwiaW1wb3J0IF8gZnJvbSAnLi91bmRlcnNjb3JlLmpzJztcbmltcG9ydCBlYWNoIGZyb20gJy4vZWFjaC5qcyc7XG5pbXBvcnQgeyBBcnJheVByb3RvIH0gZnJvbSAnLi9fc2V0dXAuanMnO1xuaW1wb3J0IGNoYWluUmVzdWx0IGZyb20gJy4vX2NoYWluUmVzdWx0LmpzJzsgLy8gQWRkIGFsbCBtdXRhdG9yIGBBcnJheWAgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuXG5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuXG4gIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuXG4gICAgaWYgKG9iaiAhPSBudWxsKSB7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuXG4gICAgICBpZiAoKG5hbWUgPT09ICdzaGlmdCcgfHwgbmFtZSA9PT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIG9ialswXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhaW5SZXN1bHQodGhpcywgb2JqKTtcbiAgfTtcbn0pOyAvLyBBZGQgYWxsIGFjY2Vzc29yIGBBcnJheWAgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuXG5lYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG5cbiAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgaWYgKG9iaiAhPSBudWxsKSBvYmogPSBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBjaGFpblJlc3VsdCh0aGlzLCBvYmopO1xuICB9O1xufSk7XG5leHBvcnQgZGVmYXVsdCBfOyIsImltcG9ydCB7IFZFUlNJT04gfSBmcm9tICcuL19zZXR1cC5qcyc7IC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0IGNhblxuLy8gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIGZ1bmN0aW9ucyBhZGRlZFxuLy8gdGhyb3VnaCBgXy5taXhpbmAuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gXyhvYmopIHtcbiAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG59XG5fLlZFUlNJT04gPSBWRVJTSU9OOyAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cblxuXy5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl93cmFwcGVkO1xufTsgLy8gUHJvdmlkZSB1bndyYXBwaW5nIHByb3hpZXMgZm9yIHNvbWUgbWV0aG9kcyB1c2VkIGluIGVuZ2luZSBvcGVyYXRpb25zXG4vLyBzdWNoIGFzIGFyaXRobWV0aWMgYW5kIEpTT04gc3RyaW5naWZpY2F0aW9uLlxuXG5cbl8ucHJvdG90eXBlLnZhbHVlT2YgPSBfLnByb3RvdHlwZS50b0pTT04gPSBfLnByb3RvdHlwZS52YWx1ZTtcblxuXy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBTdHJpbmcodGhpcy5fd3JhcHBlZCk7XG59OyIsImltcG9ydCBjcmVhdGVFc2NhcGVyIGZyb20gJy4vX2NyZWF0ZUVzY2FwZXIuanMnO1xuaW1wb3J0IHVuZXNjYXBlTWFwIGZyb20gJy4vX3VuZXNjYXBlTWFwLmpzJzsgLy8gRnVuY3Rpb24gZm9yIHVuZXNjYXBpbmcgc3RyaW5ncyBmcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRXNjYXBlcih1bmVzY2FwZU1hcCk7IiwiaW1wb3J0IHJlc3RBcmd1bWVudHMgZnJvbSAnLi9yZXN0QXJndW1lbnRzLmpzJztcbmltcG9ydCB1bmlxIGZyb20gJy4vdW5pcS5qcyc7XG5pbXBvcnQgZmxhdHRlbiBmcm9tICcuL19mbGF0dGVuLmpzJzsgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4vLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cblxuZXhwb3J0IGRlZmF1bHQgcmVzdEFyZ3VtZW50cyhmdW5jdGlvbiAoYXJyYXlzKSB7XG4gIHJldHVybiB1bmlxKGZsYXR0ZW4oYXJyYXlzLCB0cnVlLCB0cnVlKSk7XG59KTsiLCJpbXBvcnQgaXNCb29sZWFuIGZyb20gJy4vaXNCb29sZWFuLmpzJztcbmltcG9ydCBjYiBmcm9tICcuL19jYi5qcyc7XG5pbXBvcnQgZ2V0TGVuZ3RoIGZyb20gJy4vX2dldExlbmd0aC5qcyc7XG5pbXBvcnQgY29udGFpbnMgZnJvbSAnLi9jb250YWlucy5qcyc7IC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4vLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4vLyBUaGUgZmFzdGVyIGFsZ29yaXRobSB3aWxsIG5vdCB3b3JrIHdpdGggYW4gaXRlcmF0ZWUgaWYgdGhlIGl0ZXJhdGVlXG4vLyBpcyBub3QgYSBvbmUtdG8tb25lIGZ1bmN0aW9uLCBzbyBwcm92aWRpbmcgYW4gaXRlcmF0ZWUgd2lsbCBkaXNhYmxlXG4vLyB0aGUgZmFzdGVyIGFsZ29yaXRobS5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdW5pcShhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gIGlmICghaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgIGNvbnRleHQgPSBpdGVyYXRlZTtcbiAgICBpdGVyYXRlZSA9IGlzU29ydGVkO1xuICAgIGlzU29ydGVkID0gZmFsc2U7XG4gIH1cblxuICBpZiAoaXRlcmF0ZWUgIT0gbnVsbCkgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIHNlZW4gPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaV0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSwgaSwgYXJyYXkpIDogdmFsdWU7XG5cbiAgICBpZiAoaXNTb3J0ZWQgJiYgIWl0ZXJhdGVlKSB7XG4gICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIHNlZW4gPSBjb21wdXRlZDtcbiAgICB9IGVsc2UgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICBpZiAoIWNvbnRhaW5zKHNlZW4sIGNvbXB1dGVkKSkge1xuICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghY29udGFpbnMocmVzdWx0LCB2YWx1ZSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufSIsIi8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4vLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxudmFyIGlkQ291bnRlciA9IDA7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG59IiwiaW1wb3J0IG1heCBmcm9tICcuL21heC5qcyc7XG5pbXBvcnQgZ2V0TGVuZ3RoIGZyb20gJy4vX2dldExlbmd0aC5qcyc7XG5pbXBvcnQgcGx1Y2sgZnJvbSAnLi9wbHVjay5qcyc7IC8vIENvbXBsZW1lbnQgb2YgemlwLiBVbnppcCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyBhbmQgZ3JvdXBzXG4vLyBlYWNoIGFycmF5J3MgZWxlbWVudHMgb24gc2hhcmVkIGluZGljZXMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVuemlwKGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSAmJiBtYXgoYXJyYXksIGdldExlbmd0aCkubGVuZ3RoIHx8IDA7XG4gIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICByZXN1bHRbaW5kZXhdID0gcGx1Y2soYXJyYXksIGluZGV4KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59IiwiaW1wb3J0IGtleXMgZnJvbSAnLi9rZXlzLmpzJzsgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2YWx1ZXMob2JqKSB7XG4gIHZhciBfa2V5cyA9IGtleXMob2JqKTtcblxuICB2YXIgbGVuZ3RoID0gX2tleXMubGVuZ3RoO1xuICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFsdWVzW2ldID0gb2JqW19rZXlzW2ldXTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59IiwiaW1wb3J0IGZpbHRlciBmcm9tICcuL2ZpbHRlci5qcyc7XG5pbXBvcnQgbWF0Y2hlciBmcm9tICcuL21hdGNoZXIuanMnOyAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBfLmZpbHRlcmA6IHNlbGVjdGluZyBvbmx5XG4vLyBvYmplY3RzIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdoZXJlKG9iaiwgYXR0cnMpIHtcbiAgcmV0dXJuIGZpbHRlcihvYmosIG1hdGNoZXIoYXR0cnMpKTtcbn0iLCJpbXBvcnQgcmVzdEFyZ3VtZW50cyBmcm9tICcuL3Jlc3RBcmd1bWVudHMuanMnO1xuaW1wb3J0IGRpZmZlcmVuY2UgZnJvbSAnLi9kaWZmZXJlbmNlLmpzJzsgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG5cbmV4cG9ydCBkZWZhdWx0IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24gKGFycmF5LCBvdGhlckFycmF5cykge1xuICByZXR1cm4gZGlmZmVyZW5jZShhcnJheSwgb3RoZXJBcnJheXMpO1xufSk7IiwiaW1wb3J0IHBhcnRpYWwgZnJvbSAnLi9wYXJ0aWFsLmpzJzsgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4vLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4vLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3cmFwKGZ1bmMsIHdyYXBwZXIpIHtcbiAgcmV0dXJuIHBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG59IiwiaW1wb3J0IHJlc3RBcmd1bWVudHMgZnJvbSAnLi9yZXN0QXJndW1lbnRzLmpzJztcbmltcG9ydCB1bnppcCBmcm9tICcuL3VuemlwLmpzJzsgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG5cbmV4cG9ydCBkZWZhdWx0IHJlc3RBcmd1bWVudHModW56aXApOyIsImltcG9ydCBcInJlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZVwiO1xuaW1wb3J0ICogYXMgdG1kYiBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJ1xuXG5cblxuZXhwb3J0IGNvbnN0IGFsbENyZWRpdHMgPSBhc3luYyAoc2VhcmNoUXVlcnksIHJvbGUgPSBcIkRpcmVjdG9yXCIpID0+IHsgLy9jYXN0IGFuZCBjcmV3IG9mIGV2ZXJ5IG1vdmllIGEgZGlyZWN0b3IncyBtYWRlXG4gICAgbGV0IGlucHV0ID0gc2VhcmNoUXVlcnkubmFtZSB8fCBzZWFyY2hRdWVyeS5uYW1lSWRcbiAgICBsZXQgZmlsbW9ncmFwaHkgPSBhd2FpdCB0bWRiLmdldEZpbG1vZ3JhcGh5KGlucHV0LCByb2xlKVxuICAgIGxldCBmaWxtT2JqID0ge31cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gICAgZm9yIChjb25zdCBpZCBpbiBmaWxtb2dyYXBoeS5tb3ZpZXMpIHtcbiAgICAgICAgbGV0IGZpbG0gPSBmaWxtb2dyYXBoeS5tb3ZpZXNbaWRdXG4gICAgICAgIGZpbG1PYmpbZmlsbS5pZF0gPSB7XG4gICAgICAgICAgICB0aXRsZTogZmlsbS50aXRsZSxcbiAgICAgICAgICAgIGlkOiBmaWxtLmlkLFxuICAgICAgICAgICAgb3ZlcnZpZXc6IGZpbG0ub3ZlcnZpZXcsXG4gICAgICAgICAgICBnZW5yZV9pZHM6IGZpbG0uZ2VucmVfaWRzLFxuICAgICAgICAgICAgY3JlZGl0X2lkOiBmaWxtLmNyZWRpdF9pZCxcbiAgICAgICAgICAgIGNhc3Q6IGZpbG1vZ3JhcGh5LmNyZWRpdHNbZmlsbS5pZF0uY2FzdCxcbiAgICAgICAgICAgIGNyZXc6IGZpbG1vZ3JhcGh5LmNyZWRpdHNbZmlsbS5pZF0uY3Jld1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWxtT2JqXG59XG5cbmV4cG9ydCBjb25zdCBjcmVkaXRzUGFyc2VyID0gYXN5bmMgKGlucHV0LCByb2xlID0gXCJEaXJlY3RvclwiKSA9PiB7XG4gICAgbGV0IGNhc3QgPSBbXVxuICAgIGxldCBjYXN0T2JqID0ge31cbiAgICBsZXQgY3JldyA9IFtdXG4gICAgbGV0IGNyZXdPYmogPSB7fVxuICAgIGxldCBjb3VudGVyID0ge31cbiAgICBsZXQgYWxsRmlsbUNyZWRpdHMgPSBhd2FpdCBhbGxDcmVkaXRzKHsgbmFtZTogaW5wdXQgfSwgcm9sZSkudGhlbihyZXNwID0+IChyZXNwKSlcbiAgICBsZXQgYXJyID0gKE9iamVjdC52YWx1ZXMoYWxsRmlsbUNyZWRpdHMpKVxuXG4gICAgYXJyLmZvckVhY2gobW92aWUgPT4ge1xuICAgICAgIG1vdmllLmNhc3QuZm9yRWFjaChwZXJzb24gPT4gY2FzdC5wdXNoKHBlcnNvbi5uYW1lKSlcbiAgICAgICBtb3ZpZS5jcmV3LmZvckVhY2gocGVyc29uID0+IGNyZXcucHVzaChwZXJzb24ubmFtZSkpXG4gICAgfSlcblxuICAgIGNhc3QuZm9yRWFjaChwZXJzb24gPT4ge1xuICAgICAgICBpZiAoY2FzdE9ialtwZXJzb25dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNhc3RPYmpbcGVyc29uXSA9IDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhc3RPYmpbcGVyc29uXSArPSAxXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGNyZXcuZm9yRWFjaChwZXJzb24gPT4ge1xuICAgICAgICBpZiAoY3Jld09ialtwZXJzb25dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNyZXdPYmpbcGVyc29uXSA9IDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNyZXdPYmpbcGVyc29uXSArPSAxXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGNvdW50ZXIuY2FzdFVuaXF1ZSA9IE9iamVjdC52YWx1ZXMoY2FzdE9iaikubGVuZ3RoXG4gICAgY291bnRlci5jYXN0QWxsID0gY2FzdC5sZW5ndGg7XG4gICAgY291bnRlci5mYW1pbGlhckNhc3QgPSBgJHtwYXJzZUZsb2F0KChNYXRoLmFicygoY291bnRlci5jYXN0VW5pcXVlIC0gY291bnRlci5jYXN0QWxsKSkgLyBjb3VudGVyLmNhc3RBbGwpICogMTAwKS50b0ZpeGVkKDIpfSVgXG4gICAgY291bnRlci5jcmV3VW5pcXVlID0gT2JqZWN0LnZhbHVlcyhjcmV3T2JqKS5sZW5ndGg7XG4gICAgY291bnRlci5jcmV3QWxsID0gY3Jldy5sZW5ndGg7XG4gICAgY291bnRlci5mYW1pbGlhckNyZXcgPSBgJHtwYXJzZUZsb2F0KChNYXRoLmFicygoY291bnRlci5jcmV3VW5pcXVlIC0gY291bnRlci5jcmV3QWxsKSkgLyBjb3VudGVyLmNyZXdBbGwpICogMTAwKS50b0ZpeGVkKDIpfSVgXG5cbiAgICByZXR1cm4geyBtb3ZpZXM6IGFsbEZpbG1DcmVkaXRzLCBhbGxDYXN0OiBjYXN0LCBhbGxDYXN0VW5pcXVlczogY2FzdE9iaiwgYWxsQ3JldzogY3JldywgYWxsQ3Jld1VuaXF1ZXM6IGNyZXdPYmosIGNvdW50ZXI6IGNvdW50ZXIgfVxufVxuXG5cbiIsImNvbnN0IGFwaV9rZXkgPSBcIjljOWQ0NmZiYTVjZDdjZGE4YTAyNzgzMWVlNjRmNDVlXCJcblxuZXhwb3J0IGNvbnN0IHNlYXJjaFBlcnNvbiA9IGFzeW5jKG5hbWUsIHJvbGUgPSAnRGlyZWN0aW5nJykgPT4ge1xuICBjb25zdCBzZWFyY2hVcmwgPSBgaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvcGVyc29uP2FwaV9rZXk9JHthcGlfa2V5fSZsYW5ndWFnZT1lbi1VUyZxdWVyeT0ke25hbWUucmVwbGFjZSgnICcsICclMjAnKX0mcGFnZT0xJmluY2x1ZGVfYWR1bHQ9ZmFsc2VgXG4gIGxldCBwZXJzb25SZXN1bHRzXG4gIGxldCBqc29uXG4gIHRyeSB7XG4gICAgcGVyc29uUmVzdWx0cyA9IGF3YWl0IGZldGNoKHNlYXJjaFVybCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAganNvbiA9IGF3YWl0IHBlcnNvblJlc3VsdHMuanNvbigpXG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgIH1cbiAgZGVidWdnZXI7XG4gIGxldCBwZXJzb25cbiAgKGpzb24ucmVzdWx0cy5sZW5ndGggPiAxKSBcbiAgICA/IChwZXJzb24gPSBqc29uLnJlc3VsdHMuZmlsdGVyKHBlcnNvbiA9PiBSZWdFeHAoYFxcXFxiJHtuYW1lfVxcXFxiYCwgJ2dpJykudGVzdChwZXJzb24ubmFtZSkpIC8vZmlsdGVyIG91dCBuYW1lcyB0aGF0IGRvbnQgbWF0Y2ggKGNhc2UtaW5zZW5zaXRpdmUpXG4gICAgICAuc29ydCgoYSxiKSA9PiBiLnBvcHVsYXJpdHkgLSBhLnBvcHVsYXJpdHkpKSAvL3Jlc3VsdHMgbWlnaHQgcmV0dXJuIHNvcnRlZCBieSBwb3B1bGFyaXR5IGJ5IGRlZmF1bHQsIGJ1dCBqdXN0IHRvIG1ha2Ugc3VyZVxuICAgIDogKHBlcnNvbiA9IGpzb24ucmVzdWx0c1swXSlcbiAgcGVyc29uLmxlbmd0aCA9PT0gMCA/IHBlcnNvbiA9IGpzb24ucmVzdWx0c1swXSA6IHBlcnNvbiBcbiAgcmV0dXJuICgoQXJyYXkuaXNBcnJheShwZXJzb24pICYmIHBlcnNvbi5sZW5ndGggPiAwKSA/IHBlcnNvblswXSA6IHBlcnNvbikgLy8gaWYgdGhlIGZpbHRlcnMgd2VyZSBlbm91Z2ggdG8gcGFyZSBcInBlcnNvblwiIGRvd24gdG8gc2luZ2xlIHBlcnNvbiwgcmV0dXJucyB0aGF0IHBlcnNvbiwgZWxzZSByZXR1cm5zIHRoZSBtb3N0IHBvcHVsYXIuIHNob3VsZCBwcm9sbHkgYmUgcmVmYWN0b3JlZCBsb25ndGVybVxufVxuXG5leHBvcnQgY29uc3Qgc2xlZXAgPSAobXMpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0RmlsbW9ncmFwaHkgID0gYXN5bmMoaW5wdXQsIHJvbGU9XCJEaXJlY3RvclwiKSA9PiB7XG4gIC8vY2FuIHRha2UgaW4gZWl0aGVyIGEgcGVyc29uJ3MgaWQgb3IgbmFtZS0gaWYgbmFtZSBpcyBwcm92aWRlZCwgd2lsbCBuZWVkIHRvIGZpcnN0IHNlYXJjaCBmb3IgdGhlIHBlcnNvbi4gZm9yIG5vdywgYXNzdW1lcyB0aGUgZmlyc3QgcmVzdWx0IGlzIHRoZSBjb3JyZWN0IHJlc3VsdFxuICBsZXQgc2VhcmNoVmFyID0gKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpID8gYXdhaXQgKHNlYXJjaFBlcnNvbihpbnB1dCkpLnRoZW4ocmVzcCA9PiB7cmV0dXJuKHJlc3AuaWQpfSkgOiBpbnB1dFxuICBjb25zdCBzZWFyY2hVcmwgPSBgaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9wZXJzb24vJHtzZWFyY2hWYXJ9L21vdmllX2NyZWRpdHM/YXBpX2tleT0ke2FwaV9rZXl9Jmxhbmd1YWdlPWVuLVVTYFxuICBjb25zdCBzZWFyY2hSZXN1bHRzID0gYXdhaXQgZmV0Y2goc2VhcmNoVXJsLCB7XG4gICAgbWV0aG9kOiAnR0VUJ1xuICB9KVxuICBsZXQgc2VhcmNoSnNvbiA9IGF3YWl0IHNlYXJjaFJlc3VsdHMuanNvbigpXG4gIGxldCByZXN1bHRzID0gYXdhaXQgc2VhcmNoSnNvbi5jcmV3LmZpbHRlclxuICAgIChtb3ZpZSA9PiAobW92aWUuam9iID09PSByb2xlKSAvL2ZpbHRlciBmb3Igcm9sZSBwYXNzZWQgaW4gZnJvbSBvcmlnaW5hbCBmdW5jdGlvbiBjYWxsLiBEaXJlY3RvciBieSBkZWZhdWx0XG4gICAgJiYgKG1vdmllLnJlbGVhc2VfZGF0ZSAhPT0gXCJcIikgLy9cInJlYWxcIiBtb3ZpZXMgd2lsbCBoYXZlIHJlbGVhc2UgZGF0ZXNcbiAgICAmJiAobW92aWUudmlkZW8gIT09IHRydWUpKSAvL1widmlkZW9cIiBmaWVsZCBpcyB0cnVlIHdoZW4gaXRzIG5vdCBhIHN0dWRpbyBmaWxtXG4gICAgLnNvcnQoKGEsYikgPT4ge3JldHVybihuZXcgRGF0ZShiLnJlbGVhc2VfZGF0ZSkgLSBuZXcgRGF0ZShhLnJlbGVhc2VfZGF0ZSkpfSkgLy9zb3J0IG5ldy0+b2xkXG4gIGxldCByZXN1bHRzT2JqID0ge31cbiAgbGV0IGNyZWRpdHNPYmogPSB7fVxuICBzbGVlcCgxMDApLnRoZW4oYXN5bmMgKCkgPT4gXG4gIHJlc3VsdHNPYmogPSBhd2FpdCByZXN1bHRzLmZvckVhY2goYXN5bmMobW92aWUpPT57IFxuICAgIHJlc3VsdHNPYmpbbW92aWUuaWRdID0gbW92aWVcbiAgICBjcmVkaXRzT2JqW21vdmllLmlkXSA9IGF3YWl0IGdldE1vdmllQ3JlZGl0cyhtb3ZpZS5pZClcbiAgICB9KVxuICApXG4gIHJldHVybiB7bW92aWVzOiByZXN1bHRzT2JqLCBjcmVkaXRzOiBjcmVkaXRzT2JqfVxufVxuXG5leHBvcnQgY29uc3Qgc2VhcmNoTW92aWUgPSBhc3luYyAobW92aWVUaXRsZSkgPT4ge1xuICAvL2Zvcm1hdCBtb3ZpZVRpdGxlcyBsaWtlICdUaGUrSW50ZXJwcmV0ZXInXG4gIGNvbnN0IHNlYXJjaFVybCA9IGBodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL3NlYXJjaC9tb3ZpZT9hcGlfa2V5PSR7YXBpX2tleX0mbGFuZ3VhZ2U9ZW4tVVMmcXVlcnk9JHttb3ZpZVRpdGxlLnJlcGxhY2UoJyAnLCclMjAnKX0mcGFnZT0xJmluY2x1ZGVfYWR1bHQ9ZmFsc2VgXG4gIGNvbnN0IG1vdmllUmVzdWx0cyA9IGF3YWl0IGZldGNoKHNlYXJjaFVybCwge1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gIH0pXG4gIHJldHVybiBtb3ZpZVJlc3VsdHMuanNvbigpOyBcbn1cblxuZXhwb3J0IGNvbnN0IGdldE1vdmllQ3JlZGl0cyA9IGFzeW5jIChpbnB1dCkgPT4ge1xuICBsZXQgc2VhcmNoVmFyID0gKGlucHV0ID09PSB0eXBlb2YgJ3N0cmluZycpID8gYXdhaXQgKHNlYXJjaE1vdmllKGlucHV0KSkudGhlbihyZXNwID0+IHtyZXR1cm4ocmVzcC5yZXN1bHRzWzBdLmlkKX0pIDogaW5wdXRcbiAgY29uc3QgY3JlZGl0c191cmwgPSBgaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9tb3ZpZS8ke3NlYXJjaFZhcn0vY3JlZGl0cz9hcGlfa2V5PSR7YXBpX2tleX0mbGFuZ3VhZ2U9ZW4tVVNgXG4gIGxldCBjcmVkaXRzID0gYXdhaXQgZmV0Y2goY3JlZGl0c191cmwsIHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICB9KVxuICByZXR1cm4gY3JlZGl0cy5qc29uKClcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNyZWRpdHNQYXJzZXIgfSBmcm9tIFwiLi9zY3JpcHRzL2RhdGFfYnVpbGRlclwiO1xuXG5jcmVkaXRzUGFyc2VyKCdNYXJ0aW4gU2NvcnNzZScsICdEaXJlY3RvcicpLnRoZW4oZGF0YSA9PiBjb25zb2xlLmxvZygnU2NvcnNlc2U6Jyx7IGNhc3Q6IGRhdGEuY291bnRlci5mYW1pbGlhckNhc3QsIGNyZXc6IGRhdGEuY291bnRlci5mYW1pbGlhckNyZXcgfSkpXG4vLyBjcmVkaXRzUGFyc2VyKCdBbGZyZWQgSGl0Y2hjb2NrJywgJ0RpcmVjdG9yJykudGhlbihkYXRhID0+IGNvbnNvbGUubG9nKCAnSGl0Y2hjb2NrOicsIHsgY2FzdDogZGF0YS5jb3VudGVyLmZhbWlsaWFyQ2FzdCwgY3JldzogZGF0YS5jb3VudGVyLmZhbWlsaWFyQ3JldyB9KSlcbi8vIGNyZWRpdHNQYXJzZXIoJ1N0YW5sZXkgS3VicmljaycsICdEaXJlY3RvcicpLnRoZW4oZGF0YSA9PiBjb25zb2xlLmxvZyggJ0t1YnJpY2s6JywgeyBjYXN0OiBkYXRhLmNvdW50ZXIuZmFtaWxpYXJDYXN0LCBjcmV3OiBkYXRhLmNvdW50ZXIuZmFtaWxpYXJDcmV3IH0gKSlcbi8vIGNyZWRpdHNQYXJzZXIoJ0NsaW50IEVhc3R3b29kJywgJ0RpcmVjdG9yJykudGhlbihkYXRhID0+IGNvbnNvbGUubG9nKCdFYXN0d29vZDonLCB7Y2FzdDogZGF0YS5jb3VudGVyLmZhbWlsaWFyQ2FzdCwgY3JldzogZGF0YS5jb3VudGVyLmZhbWlsaWFyQ3Jld30pKVxuLy8gY3JlZGl0c1BhcnNlcignQ2hyaXN0b3BoZXIgTm9sYW4nLCAnRGlyZWN0b3InKS50aGVuKGRhdGEgPT4gY29uc29sZS5sb2coJ05vbGFuOicsIHtjYXN0OiBkYXRhLmNvdW50ZXIuZmFtaWxpYXJDYXN0LCBjcmV3OiBkYXRhLmNvdW50ZXIuZmFtaWxpYXJDcmV3fSkpXG4vLyBjcmVkaXRzUGFyc2VyKCdEYXZpZCBMb3dlcnknLCAnRGlyZWN0b3InKS50aGVuKGRhdGEgPT4gY29uc29sZS5sb2coJ0xvd2VyeTonLCB7IGNhc3Q6IGRhdGEuY291bnRlci5mYW1pbGlhckNhc3QsIGNyZXc6IGRhdGEuY291bnRlci5mYW1pbGlhckNyZXcgfSkpXG4vLyBjcmVkaXRzUGFyc2VyKCdDaGxvZSBaaGFvJywgJ0RpcmVjdG9yJykudGhlbihkYXRhID0+IGNvbnNvbGUubG9nKCdaaGFvOicsIHsgY2FzdDogZGF0YS5jb3VudGVyLmZhbWlsaWFyQ2FzdCwgY3JldzogZGF0YS5jb3VudGVyLmZhbWlsaWFyQ3JldyB9KSlcbiJdLCJzb3VyY2VSb290IjoiIn0=
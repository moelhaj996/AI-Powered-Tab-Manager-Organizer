"use strict";
(self["webpackChunkai_tab_manager"] = self["webpackChunkai_tab_manager"] || []).push([["vendor-react-dnd"],{

/***/ "./node_modules/@react-dnd/asap/dist/AsapQueue.js":
/*!********************************************************!*\
  !*** ./node_modules/@react-dnd/asap/dist/AsapQueue.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsapQueue: () => (/* binding */ AsapQueue)
/* harmony export */ });
/* harmony import */ var _makeRequestCall_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./makeRequestCall.js */ "./node_modules/@react-dnd/asap/dist/makeRequestCall.js");
/* eslint-disable no-restricted-globals, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-non-null-assertion */ 
class AsapQueue {
    // Use the fastest means possible to execute a task in its own turn, with
    // priority over other events including IO, animation, reflow, and redraw
    // events in browsers.
    //
    // An exception thrown by a task will permanently interrupt the processing of
    // subsequent tasks. The higher level `asap` function ensures that if an
    // exception is thrown by a task, that the task queue will continue flushing as
    // soon as possible, but if you use `rawAsap` directly, you are responsible to
    // either ensure that no exceptions are thrown from your task, or to manually
    // call `rawAsap.requestFlush` if an exception is thrown.
    enqueueTask(task) {
        const { queue: q , requestFlush  } = this;
        if (!q.length) {
            requestFlush();
            this.flushing = true;
        }
        // Equivalent to push, but avoids a function call.
        q[q.length] = task;
    }
    constructor(){
        this.queue = [];
        // We queue errors to ensure they are thrown in right order (FIFO).
        // Array-as-queue is good enough here, since we are just dealing with exceptions.
        this.pendingErrors = [];
        // Once a flush has been requested, no further calls to `requestFlush` are
        // necessary until the next `flush` completes.
        // @ts-ignore
        this.flushing = false;
        // The position of the next task to execute in the task queue. This is
        // preserved between calls to `flush` so that it can be resumed if
        // a task throws an exception.
        this.index = 0;
        // If a task schedules additional tasks recursively, the task queue can grow
        // unbounded. To prevent memory exhaustion, the task queue will periodically
        // truncate already-completed tasks.
        this.capacity = 1024;
        // The flush function processes all tasks that have been scheduled with
        // `rawAsap` unless and until one of those tasks throws an exception.
        // If a task throws an exception, `flush` ensures that its state will remain
        // consistent and will resume where it left off when called again.
        // However, `flush` does not make any arrangements to be called again if an
        // exception is thrown.
        this.flush = ()=>{
            const { queue: q  } = this;
            while(this.index < q.length){
                const currentIndex = this.index;
                // Advance the index before calling the task. This ensures that we will
                // begin flushing on the next task the task throws an error.
                this.index++;
                q[currentIndex].call();
                // Prevent leaking memory for long chains of recursive calls to `asap`.
                // If we call `asap` within tasks scheduled by `asap`, the queue will
                // grow, but to avoid an O(n) walk for every task we execute, we don't
                // shift tasks off the queue after they have been executed.
                // Instead, we periodically shift 1024 tasks off the queue.
                if (this.index > this.capacity) {
                    // Manually shift all values starting at the index back to the
                    // beginning of the queue.
                    for(let scan = 0, newLength = q.length - this.index; scan < newLength; scan++){
                        q[scan] = q[scan + this.index];
                    }
                    q.length -= this.index;
                    this.index = 0;
                }
            }
            q.length = 0;
            this.index = 0;
            this.flushing = false;
        };
        // In a web browser, exceptions are not fatal. However, to avoid
        // slowing down the queue of pending tasks, we rethrow the error in a
        // lower priority turn.
        this.registerPendingError = (err)=>{
            this.pendingErrors.push(err);
            this.requestErrorThrow();
        };
        // `requestFlush` requests that the high priority event queue be flushed as
        // soon as possible.
        // This is useful to prevent an error thrown in a task from stalling the event
        // queue if the exception handled by Node.js’s
        // `process.on("uncaughtException")` or by a domain.
        // `requestFlush` is implemented using a strategy based on data collected from
        // every available SauceLabs Selenium web driver worker at time of writing.
        // https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593
        this.requestFlush = (0,_makeRequestCall_js__WEBPACK_IMPORTED_MODULE_0__.makeRequestCall)(this.flush);
        this.requestErrorThrow = (0,_makeRequestCall_js__WEBPACK_IMPORTED_MODULE_0__.makeRequestCallFromTimer)(()=>{
            // Throw first error
            if (this.pendingErrors.length) {
                throw this.pendingErrors.shift();
            }
        });
    }
} // The message channel technique was discovered by Malte Ubl and was the
 // original foundation for this library.
 // http://www.nonblocking.io/2011/06/windownexttick.html
 // Safari 6.0.5 (at least) intermittently fails to create message ports on a
 // page's first load. Thankfully, this version of Safari supports
 // MutationObservers, so we don't need to fall back in that case.
 // function makeRequestCallFromMessageChannel(callback) {
 //     var channel = new MessageChannel();
 //     channel.port1.onmessage = callback;
 //     return function requestCall() {
 //         channel.port2.postMessage(0);
 //     };
 // }
 // For reasons explained above, we are also unable to use `setImmediate`
 // under any circumstances.
 // Even if we were, there is another bug in Internet Explorer 10.
 // It is not sufficient to assign `setImmediate` to `requestFlush` because
 // `setImmediate` must be called *by name* and therefore must be wrapped in a
 // closure.
 // Never forget.
 // function makeRequestCallFromSetImmediate(callback) {
 //     return function requestCall() {
 //         setImmediate(callback);
 //     };
 // }
 // Safari 6.0 has a problem where timers will get lost while the user is
 // scrolling. This problem does not impact ASAP because Safari 6.0 supports
 // mutation observers, so that implementation is used instead.
 // However, if we ever elect to use timers in Safari, the prevalent work-around
 // is to add a scroll event listener that calls for a flush.
 // `setTimeout` does not call the passed callback if the delay is less than
 // approximately 7 in web workers in Firefox 8 through 18, and sometimes not
 // even then.
 // This is for `asap.js` only.
 // Its name will be periodically randomized to break any code that depends on
 // // its existence.
 // rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer
 // ASAP was originally a nextTick shim included in Q. This was factored out
 // into this ASAP package. It was later adapted to RSVP which made further
 // amendments. These decisions, particularly to marginalize MessageChannel and
 // to capture the MutationObserver implementation in a closure, were integrated
 // back into ASAP proper.
 // https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

//# sourceMappingURL=AsapQueue.js.map

/***/ }),

/***/ "./node_modules/@react-dnd/asap/dist/RawTask.js":
/*!******************************************************!*\
  !*** ./node_modules/@react-dnd/asap/dist/RawTask.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RawTask: () => (/* binding */ RawTask)
/* harmony export */ });
// `call`, just like a function.
class RawTask {
    call() {
        try {
            this.task && this.task();
        } catch (error) {
            this.onError(error);
        } finally{
            this.task = null;
            this.release(this);
        }
    }
    constructor(onError, release){
        this.onError = onError;
        this.release = release;
        this.task = null;
    }
}

//# sourceMappingURL=RawTask.js.map

/***/ }),

/***/ "./node_modules/@react-dnd/asap/dist/TaskFactory.js":
/*!**********************************************************!*\
  !*** ./node_modules/@react-dnd/asap/dist/TaskFactory.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaskFactory: () => (/* binding */ TaskFactory)
/* harmony export */ });
/* harmony import */ var _RawTask_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RawTask.js */ "./node_modules/@react-dnd/asap/dist/RawTask.js");

class TaskFactory {
    create(task) {
        const tasks = this.freeTasks;
        const t1 = tasks.length ? tasks.pop() : new _RawTask_js__WEBPACK_IMPORTED_MODULE_0__.RawTask(this.onError, (t)=>tasks[tasks.length] = t
        );
        t1.task = task;
        return t1;
    }
    constructor(onError){
        this.onError = onError;
        this.freeTasks = [];
    }
}

//# sourceMappingURL=TaskFactory.js.map

/***/ }),

/***/ "./node_modules/@react-dnd/asap/dist/asap.js":
/*!***************************************************!*\
  !*** ./node_modules/@react-dnd/asap/dist/asap.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asap: () => (/* binding */ asap)
/* harmony export */ });
/* harmony import */ var _AsapQueue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AsapQueue.js */ "./node_modules/@react-dnd/asap/dist/AsapQueue.js");
/* harmony import */ var _TaskFactory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TaskFactory.js */ "./node_modules/@react-dnd/asap/dist/TaskFactory.js");


const asapQueue = new _AsapQueue_js__WEBPACK_IMPORTED_MODULE_0__.AsapQueue();
const taskFactory = new _TaskFactory_js__WEBPACK_IMPORTED_MODULE_1__.TaskFactory(asapQueue.registerPendingError);
/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */ function asap(task) {
    asapQueue.enqueueTask(taskFactory.create(task));
}

//# sourceMappingURL=asap.js.map

/***/ }),

/***/ "./node_modules/@react-dnd/asap/dist/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@react-dnd/asap/dist/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsapQueue: () => (/* reexport safe */ _AsapQueue_js__WEBPACK_IMPORTED_MODULE_1__.AsapQueue),
/* harmony export */   TaskFactory: () => (/* reexport safe */ _TaskFactory_js__WEBPACK_IMPORTED_MODULE_2__.TaskFactory),
/* harmony export */   asap: () => (/* reexport safe */ _asap_js__WEBPACK_IMPORTED_MODULE_0__.asap)
/* harmony export */ });
/* harmony import */ var _asap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./asap.js */ "./node_modules/@react-dnd/asap/dist/asap.js");
/* harmony import */ var _AsapQueue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsapQueue.js */ "./node_modules/@react-dnd/asap/dist/AsapQueue.js");
/* harmony import */ var _TaskFactory_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TaskFactory.js */ "./node_modules/@react-dnd/asap/dist/TaskFactory.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types.js */ "./node_modules/@react-dnd/asap/dist/types.js");





//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@react-dnd/asap/dist/makeRequestCall.js":
/*!**************************************************************!*\
  !*** ./node_modules/@react-dnd/asap/dist/makeRequestCall.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeRequestCall: () => (/* binding */ makeRequestCall),
/* harmony export */   makeRequestCallFromMutationObserver: () => (/* binding */ makeRequestCallFromMutationObserver),
/* harmony export */   makeRequestCallFromTimer: () => (/* binding */ makeRequestCallFromTimer)
/* harmony export */ });
// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
/* globals self */ const scope = typeof global !== 'undefined' ? global : self;
const BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;
function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        const timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        const intervalHandle = setInterval(handleTimer, 50);
        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}
// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    let toggle = 1;
    const observer = new BrowserMutationObserver(callback);
    const node = document.createTextNode('');
    observer.observe(node, {
        characterData: true
    });
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}
const makeRequestCall = typeof BrowserMutationObserver === 'function' ? // reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
makeRequestCallFromMutationObserver : // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.
// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396
// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
makeRequestCallFromTimer;

//# sourceMappingURL=makeRequestCall.js.map

/***/ }),

/***/ "./node_modules/@react-dnd/asap/dist/types.js":
/*!****************************************************!*\
  !*** ./node_modules/@react-dnd/asap/dist/types.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);


//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/@react-dnd/invariant/dist/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@react-dnd/invariant/dist/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   invariant: () => (/* binding */ invariant)
/* harmony export */ });
/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */ function invariant(condition, format, ...args) {
    if (isProduction()) {
        if (format === undefined) {
            throw new Error('invariant requires an error message argument');
        }
    }
    if (!condition) {
        let error;
        if (format === undefined) {
            error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
        } else {
            let argIndex = 0;
            error = new Error(format.replace(/%s/g, function() {
                return args[argIndex++];
            }));
            error.name = 'Invariant Violation';
        }
        error.framesToPop = 1 // we don't care about invariant's own frame
        ;
        throw error;
    }
}
function isProduction() {
    return typeof process !== 'undefined' && "development" === 'production';
}

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@react-dnd/shallowequal/dist/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@react-dnd/shallowequal/dist/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   shallowEqual: () => (/* binding */ shallowEqual)
/* harmony export */ });
function shallowEqual(objA, objB, compare, compareContext) {
    let compareResult = compare ? compare.call(compareContext, objA, objB) : void 0;
    if (compareResult !== void 0) {
        return !!compareResult;
    }
    if (objA === objB) {
        return true;
    }
    if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB) {
        return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    // Test for A's keys different from B.
    for(let idx = 0; idx < keysA.length; idx++){
        const key = keysA[idx];
        if (!bHasOwnProperty(key)) {
            return false;
        }
        const valueA = objA[key];
        const valueB = objB[key];
        compareResult = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
        if (compareResult === false || compareResult === void 0 && valueA !== valueB) {
            return false;
        }
    }
    return true;
}

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/core/DndContext.js":
/*!********************************************************!*\
  !*** ./node_modules/react-dnd/dist/core/DndContext.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DndContext: () => (/* binding */ DndContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

/**
 * Create the React Context
 */ const DndContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
    dragDropManager: undefined
});

//# sourceMappingURL=DndContext.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/core/DndProvider.js":
/*!*********************************************************!*\
  !*** ./node_modules/react-dnd/dist/core/DndProvider.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DndProvider: () => (/* binding */ DndProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var dnd_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dnd-core */ "./node_modules/dnd-core/dist/createDragDropManager.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _DndContext_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DndContext.js */ "./node_modules/react-dnd/dist/core/DndContext.js");
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}




let refCount = 0;
const INSTANCE_SYM = Symbol.for('__REACT_DND_CONTEXT_INSTANCE__');
var DndProvider = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(function DndProvider(_param) {
    var { children  } = _param, props = _objectWithoutProperties(_param, [
        "children"
    ]);
    const [manager, isGlobalInstance] = getDndContextValue(props) // memoized from props
    ;
    /**
		 * If the global context was used to store the DND context
		 * then where theres no more references to it we should
		 * clean it up to avoid memory leaks
		 */ (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (isGlobalInstance) {
            const context = getGlobalContext();
            ++refCount;
            return ()=>{
                if (--refCount === 0) {
                    context[INSTANCE_SYM] = null;
                }
            };
        }
        return;
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_DndContext_js__WEBPACK_IMPORTED_MODULE_2__.DndContext.Provider, {
        value: manager,
        children: children
    });
});
/**
 * A React component that provides the React-DnD context
 */ 
function getDndContextValue(props) {
    if ('manager' in props) {
        const manager = {
            dragDropManager: props.manager
        };
        return [
            manager,
            false
        ];
    }
    const manager = createSingletonDndContext(props.backend, props.context, props.options, props.debugMode);
    const isGlobalInstance = !props.context;
    return [
        manager,
        isGlobalInstance
    ];
}
function createSingletonDndContext(backend, context = getGlobalContext(), options, debugMode) {
    const ctx = context;
    if (!ctx[INSTANCE_SYM]) {
        ctx[INSTANCE_SYM] = {
            dragDropManager: (0,dnd_core__WEBPACK_IMPORTED_MODULE_3__.createDragDropManager)(backend, context, options, debugMode)
        };
    }
    return ctx[INSTANCE_SYM];
}
function getGlobalContext() {
    return typeof global !== 'undefined' ? global : window;
}

//# sourceMappingURL=DndProvider.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useCollectedProps.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useCollectedProps.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCollectedProps: () => (/* binding */ useCollectedProps)
/* harmony export */ });
/* harmony import */ var _useMonitorOutput_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useMonitorOutput.js */ "./node_modules/react-dnd/dist/hooks/useMonitorOutput.js");

function useCollectedProps(collector, monitor, connector) {
    return (0,_useMonitorOutput_js__WEBPACK_IMPORTED_MODULE_0__.useMonitorOutput)(monitor, collector || (()=>({})
    ), ()=>connector.reconnect()
    );
}

//# sourceMappingURL=useCollectedProps.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useCollector.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useCollector.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCollector: () => (/* binding */ useCollector)
/* harmony export */ });
/* harmony import */ var fast_deep_equal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fast-deep-equal */ "./node_modules/fast-deep-equal/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useIsomorphicLayoutEffect.js */ "./node_modules/react-dnd/dist/hooks/useIsomorphicLayoutEffect.js");



/**
 *
 * @param monitor The monitor to collect state from
 * @param collect The collecting function
 * @param onUpdate A method to invoke when updates occur
 */ function useCollector(monitor, collect, onUpdate) {
    const [collected, setCollected] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(()=>collect(monitor)
    );
    const updateCollected = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{
        const nextValue = collect(monitor);
        // This needs to be a deep-equality check because some monitor-collected values
        // include XYCoord objects that may be equivalent, but do not have instance equality.
        if (!fast_deep_equal__WEBPACK_IMPORTED_MODULE_0__(collected, nextValue)) {
            setCollected(nextValue);
            if (onUpdate) {
                onUpdate();
            }
        }
    }, [
        collected,
        monitor,
        onUpdate
    ]);
    // update the collected properties after react renders.
    // Note that the "Dustbin Stress Test" fails if this is not
    // done when the component updates
    (0,_useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(updateCollected);
    return [
        collected,
        updateCollected
    ];
}

//# sourceMappingURL=useCollector.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrag/DragSourceImpl.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrag/DragSourceImpl.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DragSourceImpl: () => (/* binding */ DragSourceImpl)
/* harmony export */ });
class DragSourceImpl {
    beginDrag() {
        const spec = this.spec;
        const monitor = this.monitor;
        let result = null;
        if (typeof spec.item === 'object') {
            result = spec.item;
        } else if (typeof spec.item === 'function') {
            result = spec.item(monitor);
        } else {
            result = {};
        }
        return result !== null && result !== void 0 ? result : null;
    }
    canDrag() {
        const spec = this.spec;
        const monitor = this.monitor;
        if (typeof spec.canDrag === 'boolean') {
            return spec.canDrag;
        } else if (typeof spec.canDrag === 'function') {
            return spec.canDrag(monitor);
        } else {
            return true;
        }
    }
    isDragging(globalMonitor, target) {
        const spec = this.spec;
        const monitor = this.monitor;
        const { isDragging  } = spec;
        return isDragging ? isDragging(monitor) : target === globalMonitor.getSourceId();
    }
    endDrag() {
        const spec = this.spec;
        const monitor = this.monitor;
        const connector = this.connector;
        const { end  } = spec;
        if (end) {
            end(monitor.getItem(), monitor);
        }
        connector.reconnect();
    }
    constructor(spec, monitor, connector){
        this.spec = spec;
        this.monitor = monitor;
        this.connector = connector;
    }
}

//# sourceMappingURL=DragSourceImpl.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrag/connectors.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrag/connectors.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useConnectDragPreview: () => (/* binding */ useConnectDragPreview),
/* harmony export */   useConnectDragSource: () => (/* binding */ useConnectDragSource)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function useConnectDragSource(connector) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>connector.hooks.dragSource()
    , [
        connector
    ]);
}
function useConnectDragPreview(connector) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>connector.hooks.dragPreview()
    , [
        connector
    ]);
}

//# sourceMappingURL=connectors.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrag/useDrag.js":
/*!**************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrag/useDrag.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDrag: () => (/* binding */ useDrag)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var _useCollectedProps_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../useCollectedProps.js */ "./node_modules/react-dnd/dist/hooks/useCollectedProps.js");
/* harmony import */ var _useOptionalFactory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../useOptionalFactory.js */ "./node_modules/react-dnd/dist/hooks/useOptionalFactory.js");
/* harmony import */ var _connectors_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./connectors.js */ "./node_modules/react-dnd/dist/hooks/useDrag/connectors.js");
/* harmony import */ var _useDragSourceConnector_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useDragSourceConnector.js */ "./node_modules/react-dnd/dist/hooks/useDrag/useDragSourceConnector.js");
/* harmony import */ var _useDragSourceMonitor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useDragSourceMonitor.js */ "./node_modules/react-dnd/dist/hooks/useDrag/useDragSourceMonitor.js");
/* harmony import */ var _useRegisteredDragSource_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./useRegisteredDragSource.js */ "./node_modules/react-dnd/dist/hooks/useDrag/useRegisteredDragSource.js");







/**
 * useDragSource hook
 * @param sourceSpec The drag source specification (object or function, function preferred)
 * @param deps The memoization deps array to use when evaluating spec changes
 */ function useDrag(specArg, deps) {
    const spec = (0,_useOptionalFactory_js__WEBPACK_IMPORTED_MODULE_1__.useOptionalFactory)(specArg, deps);
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(!spec.begin, `useDrag::spec.begin was deprecated in v14. Replace spec.begin() with spec.item(). (see more here - https://react-dnd.github.io/react-dnd/docs/api/use-drag)`);
    const monitor = (0,_useDragSourceMonitor_js__WEBPACK_IMPORTED_MODULE_2__.useDragSourceMonitor)();
    const connector = (0,_useDragSourceConnector_js__WEBPACK_IMPORTED_MODULE_3__.useDragSourceConnector)(spec.options, spec.previewOptions);
    (0,_useRegisteredDragSource_js__WEBPACK_IMPORTED_MODULE_4__.useRegisteredDragSource)(spec, monitor, connector);
    return [
        (0,_useCollectedProps_js__WEBPACK_IMPORTED_MODULE_5__.useCollectedProps)(spec.collect, monitor, connector),
        (0,_connectors_js__WEBPACK_IMPORTED_MODULE_6__.useConnectDragSource)(connector),
        (0,_connectors_js__WEBPACK_IMPORTED_MODULE_6__.useConnectDragPreview)(connector), 
    ];
}

//# sourceMappingURL=useDrag.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrag/useDragSource.js":
/*!********************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrag/useDragSource.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDragSource: () => (/* binding */ useDragSource)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _DragSourceImpl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DragSourceImpl.js */ "./node_modules/react-dnd/dist/hooks/useDrag/DragSourceImpl.js");


function useDragSource(spec, monitor, connector) {
    const handler = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>new _DragSourceImpl_js__WEBPACK_IMPORTED_MODULE_1__.DragSourceImpl(spec, monitor, connector)
    , [
        monitor,
        connector
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        handler.spec = spec;
    }, [
        spec
    ]);
    return handler;
}

//# sourceMappingURL=useDragSource.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrag/useDragSourceConnector.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrag/useDragSourceConnector.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDragSourceConnector: () => (/* binding */ useDragSourceConnector)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _internals_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../internals/index.js */ "./node_modules/react-dnd/dist/internals/SourceConnector.js");
/* harmony import */ var _useDragDropManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../useDragDropManager.js */ "./node_modules/react-dnd/dist/hooks/useDragDropManager.js");
/* harmony import */ var _useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../useIsomorphicLayoutEffect.js */ "./node_modules/react-dnd/dist/hooks/useIsomorphicLayoutEffect.js");




function useDragSourceConnector(dragSourceOptions, dragPreviewOptions) {
    const manager = (0,_useDragDropManager_js__WEBPACK_IMPORTED_MODULE_1__.useDragDropManager)();
    const connector = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>new _internals_index_js__WEBPACK_IMPORTED_MODULE_2__.SourceConnector(manager.getBackend())
    , [
        manager
    ]);
    (0,_useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_3__.useIsomorphicLayoutEffect)(()=>{
        connector.dragSourceOptions = dragSourceOptions || null;
        connector.reconnect();
        return ()=>connector.disconnectDragSource()
        ;
    }, [
        connector,
        dragSourceOptions
    ]);
    (0,_useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_3__.useIsomorphicLayoutEffect)(()=>{
        connector.dragPreviewOptions = dragPreviewOptions || null;
        connector.reconnect();
        return ()=>connector.disconnectDragPreview()
        ;
    }, [
        connector,
        dragPreviewOptions
    ]);
    return connector;
}

//# sourceMappingURL=useDragSourceConnector.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrag/useDragSourceMonitor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrag/useDragSourceMonitor.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDragSourceMonitor: () => (/* binding */ useDragSourceMonitor)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _internals_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../internals/index.js */ "./node_modules/react-dnd/dist/internals/DragSourceMonitorImpl.js");
/* harmony import */ var _useDragDropManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../useDragDropManager.js */ "./node_modules/react-dnd/dist/hooks/useDragDropManager.js");



function useDragSourceMonitor() {
    const manager = (0,_useDragDropManager_js__WEBPACK_IMPORTED_MODULE_1__.useDragDropManager)();
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>new _internals_index_js__WEBPACK_IMPORTED_MODULE_2__.DragSourceMonitorImpl(manager)
    , [
        manager
    ]);
}

//# sourceMappingURL=useDragSourceMonitor.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrag/useDragType.js":
/*!******************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrag/useDragType.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDragType: () => (/* binding */ useDragType)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function useDragType(spec) {
    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{
        const result = spec.type;
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(result != null, 'spec.type must be defined');
        return result;
    }, [
        spec
    ]);
}

//# sourceMappingURL=useDragType.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrag/useRegisteredDragSource.js":
/*!******************************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrag/useRegisteredDragSource.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useRegisteredDragSource: () => (/* binding */ useRegisteredDragSource)
/* harmony export */ });
/* harmony import */ var _internals_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../internals/index.js */ "./node_modules/react-dnd/dist/internals/registration.js");
/* harmony import */ var _useDragDropManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../useDragDropManager.js */ "./node_modules/react-dnd/dist/hooks/useDragDropManager.js");
/* harmony import */ var _useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../useIsomorphicLayoutEffect.js */ "./node_modules/react-dnd/dist/hooks/useIsomorphicLayoutEffect.js");
/* harmony import */ var _useDragSource_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useDragSource.js */ "./node_modules/react-dnd/dist/hooks/useDrag/useDragSource.js");
/* harmony import */ var _useDragType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useDragType.js */ "./node_modules/react-dnd/dist/hooks/useDrag/useDragType.js");





function useRegisteredDragSource(spec, monitor, connector) {
    const manager = (0,_useDragDropManager_js__WEBPACK_IMPORTED_MODULE_0__.useDragDropManager)();
    const handler = (0,_useDragSource_js__WEBPACK_IMPORTED_MODULE_1__.useDragSource)(spec, monitor, connector);
    const itemType = (0,_useDragType_js__WEBPACK_IMPORTED_MODULE_2__.useDragType)(spec);
    (0,_useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_3__.useIsomorphicLayoutEffect)(function registerDragSource() {
        if (itemType != null) {
            const [handlerId, unregister] = (0,_internals_index_js__WEBPACK_IMPORTED_MODULE_4__.registerSource)(itemType, handler, manager);
            monitor.receiveHandlerId(handlerId);
            connector.receiveHandlerId(handlerId);
            return unregister;
        }
        return;
    }, [
        manager,
        monitor,
        connector,
        handler,
        itemType
    ]);
}

//# sourceMappingURL=useRegisteredDragSource.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDragDropManager.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDragDropManager.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDragDropManager: () => (/* binding */ useDragDropManager)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _core_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/index.js */ "./node_modules/react-dnd/dist/core/DndContext.js");



/**
 * A hook to retrieve the DragDropManager from Context
 */ function useDragDropManager() {
    const { dragDropManager  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_core_index_js__WEBPACK_IMPORTED_MODULE_2__.DndContext);
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(dragDropManager != null, 'Expected drag drop context');
    return dragDropManager;
}

//# sourceMappingURL=useDragDropManager.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrop/DropTargetImpl.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrop/DropTargetImpl.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DropTargetImpl: () => (/* binding */ DropTargetImpl)
/* harmony export */ });
class DropTargetImpl {
    canDrop() {
        const spec = this.spec;
        const monitor = this.monitor;
        return spec.canDrop ? spec.canDrop(monitor.getItem(), monitor) : true;
    }
    hover() {
        const spec = this.spec;
        const monitor = this.monitor;
        if (spec.hover) {
            spec.hover(monitor.getItem(), monitor);
        }
    }
    drop() {
        const spec = this.spec;
        const monitor = this.monitor;
        if (spec.drop) {
            return spec.drop(monitor.getItem(), monitor);
        }
        return;
    }
    constructor(spec, monitor){
        this.spec = spec;
        this.monitor = monitor;
    }
}

//# sourceMappingURL=DropTargetImpl.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrop/connectors.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrop/connectors.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useConnectDropTarget: () => (/* binding */ useConnectDropTarget)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function useConnectDropTarget(connector) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>connector.hooks.dropTarget()
    , [
        connector
    ]);
}

//# sourceMappingURL=connectors.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrop/useAccept.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrop/useAccept.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useAccept: () => (/* binding */ useAccept)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


/**
 * Internal utility hook to get an array-version of spec.accept.
 * The main utility here is that we aren't creating a new array on every render if a non-array spec.accept is passed in.
 * @param spec
 */ function useAccept(spec) {
    const { accept  } = spec;
    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(spec.accept != null, 'accept must be defined');
        return Array.isArray(accept) ? accept : [
            accept
        ];
    }, [
        accept
    ]);
}

//# sourceMappingURL=useAccept.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrop/useDrop.js":
/*!**************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrop/useDrop.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDrop: () => (/* binding */ useDrop)
/* harmony export */ });
/* harmony import */ var _useCollectedProps_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../useCollectedProps.js */ "./node_modules/react-dnd/dist/hooks/useCollectedProps.js");
/* harmony import */ var _useOptionalFactory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../useOptionalFactory.js */ "./node_modules/react-dnd/dist/hooks/useOptionalFactory.js");
/* harmony import */ var _connectors_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./connectors.js */ "./node_modules/react-dnd/dist/hooks/useDrop/connectors.js");
/* harmony import */ var _useDropTargetConnector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useDropTargetConnector.js */ "./node_modules/react-dnd/dist/hooks/useDrop/useDropTargetConnector.js");
/* harmony import */ var _useDropTargetMonitor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useDropTargetMonitor.js */ "./node_modules/react-dnd/dist/hooks/useDrop/useDropTargetMonitor.js");
/* harmony import */ var _useRegisteredDropTarget_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useRegisteredDropTarget.js */ "./node_modules/react-dnd/dist/hooks/useDrop/useRegisteredDropTarget.js");






/**
 * useDropTarget Hook
 * @param spec The drop target specification (object or function, function preferred)
 * @param deps The memoization deps array to use when evaluating spec changes
 */ function useDrop(specArg, deps) {
    const spec = (0,_useOptionalFactory_js__WEBPACK_IMPORTED_MODULE_0__.useOptionalFactory)(specArg, deps);
    const monitor = (0,_useDropTargetMonitor_js__WEBPACK_IMPORTED_MODULE_1__.useDropTargetMonitor)();
    const connector = (0,_useDropTargetConnector_js__WEBPACK_IMPORTED_MODULE_2__.useDropTargetConnector)(spec.options);
    (0,_useRegisteredDropTarget_js__WEBPACK_IMPORTED_MODULE_3__.useRegisteredDropTarget)(spec, monitor, connector);
    return [
        (0,_useCollectedProps_js__WEBPACK_IMPORTED_MODULE_4__.useCollectedProps)(spec.collect, monitor, connector),
        (0,_connectors_js__WEBPACK_IMPORTED_MODULE_5__.useConnectDropTarget)(connector), 
    ];
}

//# sourceMappingURL=useDrop.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrop/useDropTarget.js":
/*!********************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrop/useDropTarget.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDropTarget: () => (/* binding */ useDropTarget)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _DropTargetImpl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DropTargetImpl.js */ "./node_modules/react-dnd/dist/hooks/useDrop/DropTargetImpl.js");


function useDropTarget(spec, monitor) {
    const dropTarget = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>new _DropTargetImpl_js__WEBPACK_IMPORTED_MODULE_1__.DropTargetImpl(spec, monitor)
    , [
        monitor
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        dropTarget.spec = spec;
    }, [
        spec
    ]);
    return dropTarget;
}

//# sourceMappingURL=useDropTarget.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrop/useDropTargetConnector.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrop/useDropTargetConnector.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDropTargetConnector: () => (/* binding */ useDropTargetConnector)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _internals_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../internals/index.js */ "./node_modules/react-dnd/dist/internals/TargetConnector.js");
/* harmony import */ var _useDragDropManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../useDragDropManager.js */ "./node_modules/react-dnd/dist/hooks/useDragDropManager.js");
/* harmony import */ var _useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../useIsomorphicLayoutEffect.js */ "./node_modules/react-dnd/dist/hooks/useIsomorphicLayoutEffect.js");




function useDropTargetConnector(options) {
    const manager = (0,_useDragDropManager_js__WEBPACK_IMPORTED_MODULE_1__.useDragDropManager)();
    const connector = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>new _internals_index_js__WEBPACK_IMPORTED_MODULE_2__.TargetConnector(manager.getBackend())
    , [
        manager
    ]);
    (0,_useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_3__.useIsomorphicLayoutEffect)(()=>{
        connector.dropTargetOptions = options || null;
        connector.reconnect();
        return ()=>connector.disconnectDropTarget()
        ;
    }, [
        options
    ]);
    return connector;
}

//# sourceMappingURL=useDropTargetConnector.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrop/useDropTargetMonitor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrop/useDropTargetMonitor.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDropTargetMonitor: () => (/* binding */ useDropTargetMonitor)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _internals_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../internals/index.js */ "./node_modules/react-dnd/dist/internals/DropTargetMonitorImpl.js");
/* harmony import */ var _useDragDropManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../useDragDropManager.js */ "./node_modules/react-dnd/dist/hooks/useDragDropManager.js");



function useDropTargetMonitor() {
    const manager = (0,_useDragDropManager_js__WEBPACK_IMPORTED_MODULE_1__.useDragDropManager)();
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>new _internals_index_js__WEBPACK_IMPORTED_MODULE_2__.DropTargetMonitorImpl(manager)
    , [
        manager
    ]);
}

//# sourceMappingURL=useDropTargetMonitor.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useDrop/useRegisteredDropTarget.js":
/*!******************************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useDrop/useRegisteredDropTarget.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useRegisteredDropTarget: () => (/* binding */ useRegisteredDropTarget)
/* harmony export */ });
/* harmony import */ var _internals_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../internals/index.js */ "./node_modules/react-dnd/dist/internals/registration.js");
/* harmony import */ var _useDragDropManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../useDragDropManager.js */ "./node_modules/react-dnd/dist/hooks/useDragDropManager.js");
/* harmony import */ var _useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../useIsomorphicLayoutEffect.js */ "./node_modules/react-dnd/dist/hooks/useIsomorphicLayoutEffect.js");
/* harmony import */ var _useAccept_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useAccept.js */ "./node_modules/react-dnd/dist/hooks/useDrop/useAccept.js");
/* harmony import */ var _useDropTarget_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useDropTarget.js */ "./node_modules/react-dnd/dist/hooks/useDrop/useDropTarget.js");





function useRegisteredDropTarget(spec, monitor, connector) {
    const manager = (0,_useDragDropManager_js__WEBPACK_IMPORTED_MODULE_0__.useDragDropManager)();
    const dropTarget = (0,_useDropTarget_js__WEBPACK_IMPORTED_MODULE_1__.useDropTarget)(spec, monitor);
    const accept = (0,_useAccept_js__WEBPACK_IMPORTED_MODULE_2__.useAccept)(spec);
    (0,_useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_3__.useIsomorphicLayoutEffect)(function registerDropTarget() {
        const [handlerId, unregister] = (0,_internals_index_js__WEBPACK_IMPORTED_MODULE_4__.registerTarget)(accept, dropTarget, manager);
        monitor.receiveHandlerId(handlerId);
        connector.receiveHandlerId(handlerId);
        return unregister;
    }, [
        manager,
        monitor,
        dropTarget,
        connector,
        accept.map((a)=>a.toString()
        ).join('|'), 
    ]);
}

//# sourceMappingURL=useRegisteredDropTarget.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useIsomorphicLayoutEffect.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useIsomorphicLayoutEffect.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsomorphicLayoutEffect: () => (/* binding */ useIsomorphicLayoutEffect)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// suppress the useLayoutEffect warning on server side.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect;

//# sourceMappingURL=useIsomorphicLayoutEffect.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useMonitorOutput.js":
/*!***************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useMonitorOutput.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMonitorOutput: () => (/* binding */ useMonitorOutput)
/* harmony export */ });
/* harmony import */ var _useCollector_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useCollector.js */ "./node_modules/react-dnd/dist/hooks/useCollector.js");
/* harmony import */ var _useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useIsomorphicLayoutEffect.js */ "./node_modules/react-dnd/dist/hooks/useIsomorphicLayoutEffect.js");


function useMonitorOutput(monitor, collect, onCollect) {
    const [collected, updateCollected] = (0,_useCollector_js__WEBPACK_IMPORTED_MODULE_0__.useCollector)(monitor, collect, onCollect);
    (0,_useIsomorphicLayoutEffect_js__WEBPACK_IMPORTED_MODULE_1__.useIsomorphicLayoutEffect)(function subscribeToMonitorStateChange() {
        const handlerId = monitor.getHandlerId();
        if (handlerId == null) {
            return;
        }
        return monitor.subscribeToStateChange(updateCollected, {
            handlerIds: [
                handlerId
            ]
        });
    }, [
        monitor,
        updateCollected
    ]);
    return collected;
}

//# sourceMappingURL=useMonitorOutput.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/hooks/useOptionalFactory.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react-dnd/dist/hooks/useOptionalFactory.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOptionalFactory: () => (/* binding */ useOptionalFactory)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function useOptionalFactory(arg, deps) {
    const memoDeps = [
        ...deps || []
    ];
    if (deps == null && typeof arg !== 'function') {
        memoDeps.push(arg);
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>{
        return typeof arg === 'function' ? arg() : arg;
    }, memoDeps);
}

//# sourceMappingURL=useOptionalFactory.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/internals/DragSourceMonitorImpl.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-dnd/dist/internals/DragSourceMonitorImpl.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DragSourceMonitorImpl: () => (/* binding */ DragSourceMonitorImpl)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");

let isCallingCanDrag = false;
let isCallingIsDragging = false;
class DragSourceMonitorImpl {
    receiveHandlerId(sourceId) {
        this.sourceId = sourceId;
    }
    getHandlerId() {
        return this.sourceId;
    }
    canDrag() {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(!isCallingCanDrag, 'You may not call monitor.canDrag() inside your canDrag() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor');
        try {
            isCallingCanDrag = true;
            return this.internalMonitor.canDragSource(this.sourceId);
        } finally{
            isCallingCanDrag = false;
        }
    }
    isDragging() {
        if (!this.sourceId) {
            return false;
        }
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(!isCallingIsDragging, 'You may not call monitor.isDragging() inside your isDragging() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor');
        try {
            isCallingIsDragging = true;
            return this.internalMonitor.isDraggingSource(this.sourceId);
        } finally{
            isCallingIsDragging = false;
        }
    }
    subscribeToStateChange(listener, options) {
        return this.internalMonitor.subscribeToStateChange(listener, options);
    }
    isDraggingSource(sourceId) {
        return this.internalMonitor.isDraggingSource(sourceId);
    }
    isOverTarget(targetId, options) {
        return this.internalMonitor.isOverTarget(targetId, options);
    }
    getTargetIds() {
        return this.internalMonitor.getTargetIds();
    }
    isSourcePublic() {
        return this.internalMonitor.isSourcePublic();
    }
    getSourceId() {
        return this.internalMonitor.getSourceId();
    }
    subscribeToOffsetChange(listener) {
        return this.internalMonitor.subscribeToOffsetChange(listener);
    }
    canDragSource(sourceId) {
        return this.internalMonitor.canDragSource(sourceId);
    }
    canDropOnTarget(targetId) {
        return this.internalMonitor.canDropOnTarget(targetId);
    }
    getItemType() {
        return this.internalMonitor.getItemType();
    }
    getItem() {
        return this.internalMonitor.getItem();
    }
    getDropResult() {
        return this.internalMonitor.getDropResult();
    }
    didDrop() {
        return this.internalMonitor.didDrop();
    }
    getInitialClientOffset() {
        return this.internalMonitor.getInitialClientOffset();
    }
    getInitialSourceClientOffset() {
        return this.internalMonitor.getInitialSourceClientOffset();
    }
    getSourceClientOffset() {
        return this.internalMonitor.getSourceClientOffset();
    }
    getClientOffset() {
        return this.internalMonitor.getClientOffset();
    }
    getDifferenceFromInitialOffset() {
        return this.internalMonitor.getDifferenceFromInitialOffset();
    }
    constructor(manager){
        this.sourceId = null;
        this.internalMonitor = manager.getMonitor();
    }
}

//# sourceMappingURL=DragSourceMonitorImpl.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/internals/DropTargetMonitorImpl.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-dnd/dist/internals/DropTargetMonitorImpl.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DropTargetMonitorImpl: () => (/* binding */ DropTargetMonitorImpl)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");

let isCallingCanDrop = false;
class DropTargetMonitorImpl {
    receiveHandlerId(targetId) {
        this.targetId = targetId;
    }
    getHandlerId() {
        return this.targetId;
    }
    subscribeToStateChange(listener, options) {
        return this.internalMonitor.subscribeToStateChange(listener, options);
    }
    canDrop() {
        // Cut out early if the target id has not been set. This should prevent errors
        // where the user has an older version of dnd-core like in
        // https://github.com/react-dnd/react-dnd/issues/1310
        if (!this.targetId) {
            return false;
        }
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(!isCallingCanDrop, 'You may not call monitor.canDrop() inside your canDrop() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor');
        try {
            isCallingCanDrop = true;
            return this.internalMonitor.canDropOnTarget(this.targetId);
        } finally{
            isCallingCanDrop = false;
        }
    }
    isOver(options) {
        if (!this.targetId) {
            return false;
        }
        return this.internalMonitor.isOverTarget(this.targetId, options);
    }
    getItemType() {
        return this.internalMonitor.getItemType();
    }
    getItem() {
        return this.internalMonitor.getItem();
    }
    getDropResult() {
        return this.internalMonitor.getDropResult();
    }
    didDrop() {
        return this.internalMonitor.didDrop();
    }
    getInitialClientOffset() {
        return this.internalMonitor.getInitialClientOffset();
    }
    getInitialSourceClientOffset() {
        return this.internalMonitor.getInitialSourceClientOffset();
    }
    getSourceClientOffset() {
        return this.internalMonitor.getSourceClientOffset();
    }
    getClientOffset() {
        return this.internalMonitor.getClientOffset();
    }
    getDifferenceFromInitialOffset() {
        return this.internalMonitor.getDifferenceFromInitialOffset();
    }
    constructor(manager){
        this.targetId = null;
        this.internalMonitor = manager.getMonitor();
    }
}

//# sourceMappingURL=DropTargetMonitorImpl.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/internals/SourceConnector.js":
/*!******************************************************************!*\
  !*** ./node_modules/react-dnd/dist/internals/SourceConnector.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SourceConnector: () => (/* binding */ SourceConnector)
/* harmony export */ });
/* harmony import */ var _react_dnd_shallowequal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/shallowequal */ "./node_modules/@react-dnd/shallowequal/dist/index.js");
/* harmony import */ var _isRef_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isRef.js */ "./node_modules/react-dnd/dist/internals/isRef.js");
/* harmony import */ var _wrapConnectorHooks_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wrapConnectorHooks.js */ "./node_modules/react-dnd/dist/internals/wrapConnectorHooks.js");



class SourceConnector {
    receiveHandlerId(newHandlerId) {
        if (this.handlerId === newHandlerId) {
            return;
        }
        this.handlerId = newHandlerId;
        this.reconnect();
    }
    get connectTarget() {
        return this.dragSource;
    }
    get dragSourceOptions() {
        return this.dragSourceOptionsInternal;
    }
    set dragSourceOptions(options) {
        this.dragSourceOptionsInternal = options;
    }
    get dragPreviewOptions() {
        return this.dragPreviewOptionsInternal;
    }
    set dragPreviewOptions(options) {
        this.dragPreviewOptionsInternal = options;
    }
    reconnect() {
        const didChange = this.reconnectDragSource();
        this.reconnectDragPreview(didChange);
    }
    reconnectDragSource() {
        const dragSource = this.dragSource;
        // if nothing has changed then don't resubscribe
        const didChange = this.didHandlerIdChange() || this.didConnectedDragSourceChange() || this.didDragSourceOptionsChange();
        if (didChange) {
            this.disconnectDragSource();
        }
        if (!this.handlerId) {
            return didChange;
        }
        if (!dragSource) {
            this.lastConnectedDragSource = dragSource;
            return didChange;
        }
        if (didChange) {
            this.lastConnectedHandlerId = this.handlerId;
            this.lastConnectedDragSource = dragSource;
            this.lastConnectedDragSourceOptions = this.dragSourceOptions;
            this.dragSourceUnsubscribe = this.backend.connectDragSource(this.handlerId, dragSource, this.dragSourceOptions);
        }
        return didChange;
    }
    reconnectDragPreview(forceDidChange = false) {
        const dragPreview = this.dragPreview;
        // if nothing has changed then don't resubscribe
        const didChange = forceDidChange || this.didHandlerIdChange() || this.didConnectedDragPreviewChange() || this.didDragPreviewOptionsChange();
        if (didChange) {
            this.disconnectDragPreview();
        }
        if (!this.handlerId) {
            return;
        }
        if (!dragPreview) {
            this.lastConnectedDragPreview = dragPreview;
            return;
        }
        if (didChange) {
            this.lastConnectedHandlerId = this.handlerId;
            this.lastConnectedDragPreview = dragPreview;
            this.lastConnectedDragPreviewOptions = this.dragPreviewOptions;
            this.dragPreviewUnsubscribe = this.backend.connectDragPreview(this.handlerId, dragPreview, this.dragPreviewOptions);
        }
    }
    didHandlerIdChange() {
        return this.lastConnectedHandlerId !== this.handlerId;
    }
    didConnectedDragSourceChange() {
        return this.lastConnectedDragSource !== this.dragSource;
    }
    didConnectedDragPreviewChange() {
        return this.lastConnectedDragPreview !== this.dragPreview;
    }
    didDragSourceOptionsChange() {
        return !(0,_react_dnd_shallowequal__WEBPACK_IMPORTED_MODULE_0__.shallowEqual)(this.lastConnectedDragSourceOptions, this.dragSourceOptions);
    }
    didDragPreviewOptionsChange() {
        return !(0,_react_dnd_shallowequal__WEBPACK_IMPORTED_MODULE_0__.shallowEqual)(this.lastConnectedDragPreviewOptions, this.dragPreviewOptions);
    }
    disconnectDragSource() {
        if (this.dragSourceUnsubscribe) {
            this.dragSourceUnsubscribe();
            this.dragSourceUnsubscribe = undefined;
        }
    }
    disconnectDragPreview() {
        if (this.dragPreviewUnsubscribe) {
            this.dragPreviewUnsubscribe();
            this.dragPreviewUnsubscribe = undefined;
            this.dragPreviewNode = null;
            this.dragPreviewRef = null;
        }
    }
    get dragSource() {
        return this.dragSourceNode || this.dragSourceRef && this.dragSourceRef.current;
    }
    get dragPreview() {
        return this.dragPreviewNode || this.dragPreviewRef && this.dragPreviewRef.current;
    }
    clearDragSource() {
        this.dragSourceNode = null;
        this.dragSourceRef = null;
    }
    clearDragPreview() {
        this.dragPreviewNode = null;
        this.dragPreviewRef = null;
    }
    constructor(backend){
        this.hooks = (0,_wrapConnectorHooks_js__WEBPACK_IMPORTED_MODULE_1__.wrapConnectorHooks)({
            dragSource: (node, options)=>{
                this.clearDragSource();
                this.dragSourceOptions = options || null;
                if ((0,_isRef_js__WEBPACK_IMPORTED_MODULE_2__.isRef)(node)) {
                    this.dragSourceRef = node;
                } else {
                    this.dragSourceNode = node;
                }
                this.reconnectDragSource();
            },
            dragPreview: (node, options)=>{
                this.clearDragPreview();
                this.dragPreviewOptions = options || null;
                if ((0,_isRef_js__WEBPACK_IMPORTED_MODULE_2__.isRef)(node)) {
                    this.dragPreviewRef = node;
                } else {
                    this.dragPreviewNode = node;
                }
                this.reconnectDragPreview();
            }
        });
        this.handlerId = null;
        // The drop target may either be attached via ref or connect function
        this.dragSourceRef = null;
        this.dragSourceOptionsInternal = null;
        // The drag preview may either be attached via ref or connect function
        this.dragPreviewRef = null;
        this.dragPreviewOptionsInternal = null;
        this.lastConnectedHandlerId = null;
        this.lastConnectedDragSource = null;
        this.lastConnectedDragSourceOptions = null;
        this.lastConnectedDragPreview = null;
        this.lastConnectedDragPreviewOptions = null;
        this.backend = backend;
    }
}

//# sourceMappingURL=SourceConnector.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/internals/TargetConnector.js":
/*!******************************************************************!*\
  !*** ./node_modules/react-dnd/dist/internals/TargetConnector.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TargetConnector: () => (/* binding */ TargetConnector)
/* harmony export */ });
/* harmony import */ var _react_dnd_shallowequal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/shallowequal */ "./node_modules/@react-dnd/shallowequal/dist/index.js");
/* harmony import */ var _isRef_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isRef.js */ "./node_modules/react-dnd/dist/internals/isRef.js");
/* harmony import */ var _wrapConnectorHooks_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wrapConnectorHooks.js */ "./node_modules/react-dnd/dist/internals/wrapConnectorHooks.js");



class TargetConnector {
    get connectTarget() {
        return this.dropTarget;
    }
    reconnect() {
        // if nothing has changed then don't resubscribe
        const didChange = this.didHandlerIdChange() || this.didDropTargetChange() || this.didOptionsChange();
        if (didChange) {
            this.disconnectDropTarget();
        }
        const dropTarget = this.dropTarget;
        if (!this.handlerId) {
            return;
        }
        if (!dropTarget) {
            this.lastConnectedDropTarget = dropTarget;
            return;
        }
        if (didChange) {
            this.lastConnectedHandlerId = this.handlerId;
            this.lastConnectedDropTarget = dropTarget;
            this.lastConnectedDropTargetOptions = this.dropTargetOptions;
            this.unsubscribeDropTarget = this.backend.connectDropTarget(this.handlerId, dropTarget, this.dropTargetOptions);
        }
    }
    receiveHandlerId(newHandlerId) {
        if (newHandlerId === this.handlerId) {
            return;
        }
        this.handlerId = newHandlerId;
        this.reconnect();
    }
    get dropTargetOptions() {
        return this.dropTargetOptionsInternal;
    }
    set dropTargetOptions(options) {
        this.dropTargetOptionsInternal = options;
    }
    didHandlerIdChange() {
        return this.lastConnectedHandlerId !== this.handlerId;
    }
    didDropTargetChange() {
        return this.lastConnectedDropTarget !== this.dropTarget;
    }
    didOptionsChange() {
        return !(0,_react_dnd_shallowequal__WEBPACK_IMPORTED_MODULE_0__.shallowEqual)(this.lastConnectedDropTargetOptions, this.dropTargetOptions);
    }
    disconnectDropTarget() {
        if (this.unsubscribeDropTarget) {
            this.unsubscribeDropTarget();
            this.unsubscribeDropTarget = undefined;
        }
    }
    get dropTarget() {
        return this.dropTargetNode || this.dropTargetRef && this.dropTargetRef.current;
    }
    clearDropTarget() {
        this.dropTargetRef = null;
        this.dropTargetNode = null;
    }
    constructor(backend){
        this.hooks = (0,_wrapConnectorHooks_js__WEBPACK_IMPORTED_MODULE_1__.wrapConnectorHooks)({
            dropTarget: (node, options)=>{
                this.clearDropTarget();
                this.dropTargetOptions = options;
                if ((0,_isRef_js__WEBPACK_IMPORTED_MODULE_2__.isRef)(node)) {
                    this.dropTargetRef = node;
                } else {
                    this.dropTargetNode = node;
                }
                this.reconnect();
            }
        });
        this.handlerId = null;
        // The drop target may either be attached via ref or connect function
        this.dropTargetRef = null;
        this.dropTargetOptionsInternal = null;
        this.lastConnectedHandlerId = null;
        this.lastConnectedDropTarget = null;
        this.lastConnectedDropTargetOptions = null;
        this.backend = backend;
    }
}

//# sourceMappingURL=TargetConnector.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/internals/isRef.js":
/*!********************************************************!*\
  !*** ./node_modules/react-dnd/dist/internals/isRef.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRef: () => (/* binding */ isRef)
/* harmony export */ });
function isRef(obj) {
    return(// eslint-disable-next-line no-prototype-builtins
    obj !== null && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, 'current'));
}

//# sourceMappingURL=isRef.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/internals/registration.js":
/*!***************************************************************!*\
  !*** ./node_modules/react-dnd/dist/internals/registration.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerSource: () => (/* binding */ registerSource),
/* harmony export */   registerTarget: () => (/* binding */ registerTarget)
/* harmony export */ });
function registerTarget(type, target, manager) {
    const registry = manager.getRegistry();
    const targetId = registry.addTarget(type, target);
    return [
        targetId,
        ()=>registry.removeTarget(targetId)
    ];
}
function registerSource(type, source, manager) {
    const registry = manager.getRegistry();
    const sourceId = registry.addSource(type, source);
    return [
        sourceId,
        ()=>registry.removeSource(sourceId)
    ];
}

//# sourceMappingURL=registration.js.map

/***/ }),

/***/ "./node_modules/react-dnd/dist/internals/wrapConnectorHooks.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-dnd/dist/internals/wrapConnectorHooks.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   wrapConnectorHooks: () => (/* binding */ wrapConnectorHooks)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function throwIfCompositeComponentElement(element) {
    // Custom components can no longer be wrapped directly in React DnD 2.0
    // so that we don't need to depend on findDOMNode() from react-dom.
    if (typeof element.type === 'string') {
        return;
    }
    const displayName = element.type.displayName || element.type.name || 'the component';
    throw new Error('Only native element nodes can now be passed to React DnD connectors.' + `You can either wrap ${displayName} into a <div>, or turn it into a ` + 'drag source or a drop target itself.');
}
function wrapHookToRecognizeElement(hook) {
    return (elementOrNode = null, options = null)=>{
        // When passed a node, call the hook straight away.
        if (!(0,react__WEBPACK_IMPORTED_MODULE_1__.isValidElement)(elementOrNode)) {
            const node = elementOrNode;
            hook(node, options);
            // return the node so it can be chained (e.g. when within callback refs
            // <div ref={node => connectDragSource(connectDropTarget(node))}/>
            return node;
        }
        // If passed a ReactElement, clone it and attach this function as a ref.
        // This helps us achieve a neat API where user doesn't even know that refs
        // are being used under the hood.
        const element = elementOrNode;
        throwIfCompositeComponentElement(element);
        // When no options are passed, use the hook directly
        const ref = options ? (node)=>hook(node, options)
         : hook;
        return cloneWithRef(element, ref);
    };
}
function wrapConnectorHooks(hooks) {
    const wrappedHooks = {};
    Object.keys(hooks).forEach((key)=>{
        const hook = hooks[key];
        // ref objects should be passed straight through without wrapping
        if (key.endsWith('Ref')) {
            wrappedHooks[key] = hooks[key];
        } else {
            const wrappedHook = wrapHookToRecognizeElement(hook);
            wrappedHooks[key] = ()=>wrappedHook
            ;
        }
    });
    return wrappedHooks;
}
function setRef(ref, node) {
    if (typeof ref === 'function') {
        ref(node);
    } else {
        ref.current = node;
    }
}
function cloneWithRef(element, newRef) {
    const previousRef = element.ref;
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof previousRef !== 'string', 'Cannot connect React DnD to an element with an existing string ref. ' + 'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' + 'Read more: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs');
    if (!previousRef) {
        // When there is no ref on the element, use the new ref directly
        return (0,react__WEBPACK_IMPORTED_MODULE_1__.cloneElement)(element, {
            ref: newRef
        });
    } else {
        return (0,react__WEBPACK_IMPORTED_MODULE_1__.cloneElement)(element, {
            ref: (node)=>{
                setRef(previousRef, node);
                setRef(newRef, node);
            }
        });
    }
}

//# sourceMappingURL=wrapConnectorHooks.js.map

/***/ })

}]);
//# sourceMappingURL=vendor-react-dnd.js.map
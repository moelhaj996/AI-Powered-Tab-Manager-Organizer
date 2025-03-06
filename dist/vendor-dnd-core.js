"use strict";
(self["webpackChunkai_tab_manager"] = self["webpackChunkai_tab_manager"] || []).push([["vendor-dnd-core"],{

/***/ "./node_modules/dnd-core/dist/actions/dragDrop/beginDrag.js":
/*!******************************************************************!*\
  !*** ./node_modules/dnd-core/dist/actions/dragDrop/beginDrag.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBeginDrag: () => (/* binding */ createBeginDrag)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var _utils_js_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/js_utils.js */ "./node_modules/dnd-core/dist/utils/js_utils.js");
/* harmony import */ var _local_setClientOffset_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./local/setClientOffset.js */ "./node_modules/dnd-core/dist/actions/dragDrop/local/setClientOffset.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");




const ResetCoordinatesAction = {
    type: _types_js__WEBPACK_IMPORTED_MODULE_1__.INIT_COORDS,
    payload: {
        clientOffset: null,
        sourceClientOffset: null
    }
};
function createBeginDrag(manager) {
    return function beginDrag(sourceIds = [], options = {
        publishSource: true
    }) {
        const { publishSource =true , clientOffset , getSourceClientOffset ,  } = options;
        const monitor = manager.getMonitor();
        const registry = manager.getRegistry();
        // Initialize the coordinates using the client offset
        manager.dispatch((0,_local_setClientOffset_js__WEBPACK_IMPORTED_MODULE_2__.setClientOffset)(clientOffset));
        verifyInvariants(sourceIds, monitor, registry);
        // Get the draggable source
        const sourceId = getDraggableSource(sourceIds, monitor);
        if (sourceId == null) {
            manager.dispatch(ResetCoordinatesAction);
            return;
        }
        // Get the source client offset
        let sourceClientOffset = null;
        if (clientOffset) {
            if (!getSourceClientOffset) {
                throw new Error('getSourceClientOffset must be defined');
            }
            verifyGetSourceClientOffsetIsFunction(getSourceClientOffset);
            sourceClientOffset = getSourceClientOffset(sourceId);
        }
        // Initialize the full coordinates
        manager.dispatch((0,_local_setClientOffset_js__WEBPACK_IMPORTED_MODULE_2__.setClientOffset)(clientOffset, sourceClientOffset));
        const source = registry.getSource(sourceId);
        const item = source.beginDrag(monitor, sourceId);
        // If source.beginDrag returns null, this is an indicator to cancel the drag
        if (item == null) {
            return undefined;
        }
        verifyItemIsObject(item);
        registry.pinSource(sourceId);
        const itemType = registry.getSourceType(sourceId);
        return {
            type: _types_js__WEBPACK_IMPORTED_MODULE_1__.BEGIN_DRAG,
            payload: {
                itemType,
                item,
                sourceId,
                clientOffset: clientOffset || null,
                sourceClientOffset: sourceClientOffset || null,
                isSourcePublic: !!publishSource
            }
        };
    };
}
function verifyInvariants(sourceIds, monitor, registry) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(!monitor.isDragging(), 'Cannot call beginDrag while dragging.');
    sourceIds.forEach(function(sourceId) {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(registry.getSource(sourceId), 'Expected sourceIds to be registered.');
    });
}
function verifyGetSourceClientOffsetIsFunction(getSourceClientOffset) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
}
function verifyItemIsObject(item) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)((0,_utils_js_utils_js__WEBPACK_IMPORTED_MODULE_3__.isObject)(item), 'Item must be an object.');
}
function getDraggableSource(sourceIds, monitor) {
    let sourceId = null;
    for(let i = sourceIds.length - 1; i >= 0; i--){
        if (monitor.canDragSource(sourceIds[i])) {
            sourceId = sourceIds[i];
            break;
        }
    }
    return sourceId;
}

//# sourceMappingURL=beginDrag.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/actions/dragDrop/drop.js":
/*!*************************************************************!*\
  !*** ./node_modules/dnd-core/dist/actions/dragDrop/drop.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDrop: () => (/* binding */ createDrop)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var _utils_js_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/js_utils.js */ "./node_modules/dnd-core/dist/utils/js_utils.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}



function createDrop(manager) {
    return function drop(options = {}) {
        const monitor = manager.getMonitor();
        const registry = manager.getRegistry();
        verifyInvariants(monitor);
        const targetIds = getDroppableTargets(monitor);
        // Multiple actions are dispatched here, which is why this doesn't return an action
        targetIds.forEach((targetId, index)=>{
            const dropResult = determineDropResult(targetId, index, registry, monitor);
            const action = {
                type: _types_js__WEBPACK_IMPORTED_MODULE_1__.DROP,
                payload: {
                    dropResult: _objectSpread({}, options, dropResult)
                }
            };
            manager.dispatch(action);
        });
    };
}
function verifyInvariants(monitor) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(monitor.isDragging(), 'Cannot call drop while not dragging.');
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');
}
function determineDropResult(targetId, index, registry, monitor) {
    const target = registry.getTarget(targetId);
    let dropResult = target ? target.drop(monitor, targetId) : undefined;
    verifyDropResultType(dropResult);
    if (typeof dropResult === 'undefined') {
        dropResult = index === 0 ? {} : monitor.getDropResult();
    }
    return dropResult;
}
function verifyDropResultType(dropResult) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof dropResult === 'undefined' || (0,_utils_js_utils_js__WEBPACK_IMPORTED_MODULE_2__.isObject)(dropResult), 'Drop result must either be an object or undefined.');
}
function getDroppableTargets(monitor) {
    const targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);
    targetIds.reverse();
    return targetIds;
}

//# sourceMappingURL=drop.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/actions/dragDrop/endDrag.js":
/*!****************************************************************!*\
  !*** ./node_modules/dnd-core/dist/actions/dragDrop/endDrag.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createEndDrag: () => (/* binding */ createEndDrag)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");


function createEndDrag(manager) {
    return function endDrag() {
        const monitor = manager.getMonitor();
        const registry = manager.getRegistry();
        verifyIsDragging(monitor);
        const sourceId = monitor.getSourceId();
        if (sourceId != null) {
            const source = registry.getSource(sourceId, true);
            source.endDrag(monitor, sourceId);
            registry.unpinSource();
        }
        return {
            type: _types_js__WEBPACK_IMPORTED_MODULE_1__.END_DRAG
        };
    };
}
function verifyIsDragging(monitor) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(monitor.isDragging(), 'Cannot call endDrag while not dragging.');
}

//# sourceMappingURL=endDrag.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/actions/dragDrop/hover.js":
/*!**************************************************************!*\
  !*** ./node_modules/dnd-core/dist/actions/dragDrop/hover.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHover: () => (/* binding */ createHover)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var _utils_matchesType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/matchesType.js */ "./node_modules/dnd-core/dist/utils/matchesType.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");



function createHover(manager) {
    return function hover(targetIdsArg, { clientOffset  } = {}) {
        verifyTargetIdsIsArray(targetIdsArg);
        const targetIds = targetIdsArg.slice(0);
        const monitor = manager.getMonitor();
        const registry = manager.getRegistry();
        const draggedItemType = monitor.getItemType();
        removeNonMatchingTargetIds(targetIds, registry, draggedItemType);
        checkInvariants(targetIds, monitor, registry);
        hoverAllTargets(targetIds, monitor, registry);
        return {
            type: _types_js__WEBPACK_IMPORTED_MODULE_1__.HOVER,
            payload: {
                targetIds,
                clientOffset: clientOffset || null
            }
        };
    };
}
function verifyTargetIdsIsArray(targetIdsArg) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(Array.isArray(targetIdsArg), 'Expected targetIds to be an array.');
}
function checkInvariants(targetIds, monitor, registry) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(monitor.isDragging(), 'Cannot call hover while not dragging.');
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(!monitor.didDrop(), 'Cannot call hover after drop.');
    for(let i = 0; i < targetIds.length; i++){
        const targetId = targetIds[i];
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');
        const target = registry.getTarget(targetId);
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(target, 'Expected targetIds to be registered.');
    }
}
function removeNonMatchingTargetIds(targetIds, registry, draggedItemType) {
    // Remove those targetIds that don't match the targetType.  This
    // fixes shallow isOver which would only be non-shallow because of
    // non-matching targets.
    for(let i = targetIds.length - 1; i >= 0; i--){
        const targetId = targetIds[i];
        const targetType = registry.getTargetType(targetId);
        if (!(0,_utils_matchesType_js__WEBPACK_IMPORTED_MODULE_2__.matchesType)(targetType, draggedItemType)) {
            targetIds.splice(i, 1);
        }
    }
}
function hoverAllTargets(targetIds, monitor, registry) {
    // Finally call hover on all matching targets.
    targetIds.forEach(function(targetId) {
        const target = registry.getTarget(targetId);
        target.hover(monitor, targetId);
    });
}

//# sourceMappingURL=hover.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/actions/dragDrop/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/dnd-core/dist/actions/dragDrop/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BEGIN_DRAG: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.BEGIN_DRAG),
/* harmony export */   DROP: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.DROP),
/* harmony export */   END_DRAG: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.END_DRAG),
/* harmony export */   HOVER: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.HOVER),
/* harmony export */   INIT_COORDS: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.INIT_COORDS),
/* harmony export */   PUBLISH_DRAG_SOURCE: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.PUBLISH_DRAG_SOURCE),
/* harmony export */   createDragDropActions: () => (/* binding */ createDragDropActions)
/* harmony export */ });
/* harmony import */ var _beginDrag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./beginDrag.js */ "./node_modules/dnd-core/dist/actions/dragDrop/beginDrag.js");
/* harmony import */ var _drop_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./drop.js */ "./node_modules/dnd-core/dist/actions/dragDrop/drop.js");
/* harmony import */ var _endDrag_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./endDrag.js */ "./node_modules/dnd-core/dist/actions/dragDrop/endDrag.js");
/* harmony import */ var _hover_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hover.js */ "./node_modules/dnd-core/dist/actions/dragDrop/hover.js");
/* harmony import */ var _publishDragSource_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./publishDragSource.js */ "./node_modules/dnd-core/dist/actions/dragDrop/publishDragSource.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");






function createDragDropActions(manager) {
    return {
        beginDrag: (0,_beginDrag_js__WEBPACK_IMPORTED_MODULE_1__.createBeginDrag)(manager),
        publishDragSource: (0,_publishDragSource_js__WEBPACK_IMPORTED_MODULE_2__.createPublishDragSource)(manager),
        hover: (0,_hover_js__WEBPACK_IMPORTED_MODULE_3__.createHover)(manager),
        drop: (0,_drop_js__WEBPACK_IMPORTED_MODULE_4__.createDrop)(manager),
        endDrag: (0,_endDrag_js__WEBPACK_IMPORTED_MODULE_5__.createEndDrag)(manager)
    };
}

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/actions/dragDrop/local/setClientOffset.js":
/*!******************************************************************************!*\
  !*** ./node_modules/dnd-core/dist/actions/dragDrop/local/setClientOffset.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setClientOffset: () => (/* binding */ setClientOffset)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");

function setClientOffset(clientOffset, sourceClientOffset) {
    return {
        type: _types_js__WEBPACK_IMPORTED_MODULE_0__.INIT_COORDS,
        payload: {
            sourceClientOffset: sourceClientOffset || null,
            clientOffset: clientOffset || null
        }
    };
}

//# sourceMappingURL=setClientOffset.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/actions/dragDrop/publishDragSource.js":
/*!**************************************************************************!*\
  !*** ./node_modules/dnd-core/dist/actions/dragDrop/publishDragSource.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPublishDragSource: () => (/* binding */ createPublishDragSource)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");

function createPublishDragSource(manager) {
    return function publishDragSource() {
        const monitor = manager.getMonitor();
        if (monitor.isDragging()) {
            return {
                type: _types_js__WEBPACK_IMPORTED_MODULE_0__.PUBLISH_DRAG_SOURCE
            };
        }
        return;
    };
}

//# sourceMappingURL=publishDragSource.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/actions/dragDrop/types.js":
/*!**************************************************************!*\
  !*** ./node_modules/dnd-core/dist/actions/dragDrop/types.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BEGIN_DRAG: () => (/* binding */ BEGIN_DRAG),
/* harmony export */   DROP: () => (/* binding */ DROP),
/* harmony export */   END_DRAG: () => (/* binding */ END_DRAG),
/* harmony export */   HOVER: () => (/* binding */ HOVER),
/* harmony export */   INIT_COORDS: () => (/* binding */ INIT_COORDS),
/* harmony export */   PUBLISH_DRAG_SOURCE: () => (/* binding */ PUBLISH_DRAG_SOURCE)
/* harmony export */ });
const INIT_COORDS = 'dnd-core/INIT_COORDS';
const BEGIN_DRAG = 'dnd-core/BEGIN_DRAG';
const PUBLISH_DRAG_SOURCE = 'dnd-core/PUBLISH_DRAG_SOURCE';
const HOVER = 'dnd-core/HOVER';
const DROP = 'dnd-core/DROP';
const END_DRAG = 'dnd-core/END_DRAG';

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/actions/registry.js":
/*!********************************************************!*\
  !*** ./node_modules/dnd-core/dist/actions/registry.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ADD_SOURCE: () => (/* binding */ ADD_SOURCE),
/* harmony export */   ADD_TARGET: () => (/* binding */ ADD_TARGET),
/* harmony export */   REMOVE_SOURCE: () => (/* binding */ REMOVE_SOURCE),
/* harmony export */   REMOVE_TARGET: () => (/* binding */ REMOVE_TARGET),
/* harmony export */   addSource: () => (/* binding */ addSource),
/* harmony export */   addTarget: () => (/* binding */ addTarget),
/* harmony export */   removeSource: () => (/* binding */ removeSource),
/* harmony export */   removeTarget: () => (/* binding */ removeTarget)
/* harmony export */ });
const ADD_SOURCE = 'dnd-core/ADD_SOURCE';
const ADD_TARGET = 'dnd-core/ADD_TARGET';
const REMOVE_SOURCE = 'dnd-core/REMOVE_SOURCE';
const REMOVE_TARGET = 'dnd-core/REMOVE_TARGET';
function addSource(sourceId) {
    return {
        type: ADD_SOURCE,
        payload: {
            sourceId
        }
    };
}
function addTarget(targetId) {
    return {
        type: ADD_TARGET,
        payload: {
            targetId
        }
    };
}
function removeSource(sourceId) {
    return {
        type: REMOVE_SOURCE,
        payload: {
            sourceId
        }
    };
}
function removeTarget(targetId) {
    return {
        type: REMOVE_TARGET,
        payload: {
            targetId
        }
    };
}

//# sourceMappingURL=registry.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/classes/DragDropManagerImpl.js":
/*!*******************************************************************!*\
  !*** ./node_modules/dnd-core/dist/classes/DragDropManagerImpl.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DragDropManagerImpl: () => (/* binding */ DragDropManagerImpl)
/* harmony export */ });
/* harmony import */ var _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/dragDrop/index.js */ "./node_modules/dnd-core/dist/actions/dragDrop/index.js");

class DragDropManagerImpl {
    receiveBackend(backend) {
        this.backend = backend;
    }
    getMonitor() {
        return this.monitor;
    }
    getBackend() {
        return this.backend;
    }
    getRegistry() {
        return this.monitor.registry;
    }
    getActions() {
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */ const manager = this;
        const { dispatch  } = this.store;
        function bindActionCreator(actionCreator) {
            return (...args)=>{
                const action = actionCreator.apply(manager, args);
                if (typeof action !== 'undefined') {
                    dispatch(action);
                }
            };
        }
        const actions = (0,_actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.createDragDropActions)(this);
        return Object.keys(actions).reduce((boundActions, key)=>{
            const action = actions[key];
            boundActions[key] = bindActionCreator(action);
            return boundActions;
        }, {});
    }
    dispatch(action) {
        this.store.dispatch(action);
    }
    constructor(store, monitor){
        this.isSetUp = false;
        this.handleRefCountChange = ()=>{
            const shouldSetUp = this.store.getState().refCount > 0;
            if (this.backend) {
                if (shouldSetUp && !this.isSetUp) {
                    this.backend.setup();
                    this.isSetUp = true;
                } else if (!shouldSetUp && this.isSetUp) {
                    this.backend.teardown();
                    this.isSetUp = false;
                }
            }
        };
        this.store = store;
        this.monitor = monitor;
        store.subscribe(this.handleRefCountChange);
    }
}

//# sourceMappingURL=DragDropManagerImpl.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/classes/DragDropMonitorImpl.js":
/*!*******************************************************************!*\
  !*** ./node_modules/dnd-core/dist/classes/DragDropMonitorImpl.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DragDropMonitorImpl: () => (/* binding */ DragDropMonitorImpl)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var _utils_coords_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/coords.js */ "./node_modules/dnd-core/dist/utils/coords.js");
/* harmony import */ var _utils_dirtiness_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/dirtiness.js */ "./node_modules/dnd-core/dist/utils/dirtiness.js");
/* harmony import */ var _utils_matchesType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/matchesType.js */ "./node_modules/dnd-core/dist/utils/matchesType.js");




class DragDropMonitorImpl {
    subscribeToStateChange(listener, options = {}) {
        const { handlerIds  } = options;
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof listener === 'function', 'listener must be a function.');
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof handlerIds === 'undefined' || Array.isArray(handlerIds), 'handlerIds, when specified, must be an array of strings.');
        let prevStateId = this.store.getState().stateId;
        const handleChange = ()=>{
            const state = this.store.getState();
            const currentStateId = state.stateId;
            try {
                const canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !(0,_utils_dirtiness_js__WEBPACK_IMPORTED_MODULE_1__.areDirty)(state.dirtyHandlerIds, handlerIds);
                if (!canSkipListener) {
                    listener();
                }
            } finally{
                prevStateId = currentStateId;
            }
        };
        return this.store.subscribe(handleChange);
    }
    subscribeToOffsetChange(listener) {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof listener === 'function', 'listener must be a function.');
        let previousState = this.store.getState().dragOffset;
        const handleChange = ()=>{
            const nextState = this.store.getState().dragOffset;
            if (nextState === previousState) {
                return;
            }
            previousState = nextState;
            listener();
        };
        return this.store.subscribe(handleChange);
    }
    canDragSource(sourceId) {
        if (!sourceId) {
            return false;
        }
        const source = this.registry.getSource(sourceId);
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(source, `Expected to find a valid source. sourceId=${sourceId}`);
        if (this.isDragging()) {
            return false;
        }
        return source.canDrag(this, sourceId);
    }
    canDropOnTarget(targetId) {
        // undefined on initial render
        if (!targetId) {
            return false;
        }
        const target = this.registry.getTarget(targetId);
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(target, `Expected to find a valid target. targetId=${targetId}`);
        if (!this.isDragging() || this.didDrop()) {
            return false;
        }
        const targetType = this.registry.getTargetType(targetId);
        const draggedItemType = this.getItemType();
        return (0,_utils_matchesType_js__WEBPACK_IMPORTED_MODULE_2__.matchesType)(targetType, draggedItemType) && target.canDrop(this, targetId);
    }
    isDragging() {
        return Boolean(this.getItemType());
    }
    isDraggingSource(sourceId) {
        // undefined on initial render
        if (!sourceId) {
            return false;
        }
        const source = this.registry.getSource(sourceId, true);
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(source, `Expected to find a valid source. sourceId=${sourceId}`);
        if (!this.isDragging() || !this.isSourcePublic()) {
            return false;
        }
        const sourceType = this.registry.getSourceType(sourceId);
        const draggedItemType = this.getItemType();
        if (sourceType !== draggedItemType) {
            return false;
        }
        return source.isDragging(this, sourceId);
    }
    isOverTarget(targetId, options = {
        shallow: false
    }) {
        // undefined on initial render
        if (!targetId) {
            return false;
        }
        const { shallow  } = options;
        if (!this.isDragging()) {
            return false;
        }
        const targetType = this.registry.getTargetType(targetId);
        const draggedItemType = this.getItemType();
        if (draggedItemType && !(0,_utils_matchesType_js__WEBPACK_IMPORTED_MODULE_2__.matchesType)(targetType, draggedItemType)) {
            return false;
        }
        const targetIds = this.getTargetIds();
        if (!targetIds.length) {
            return false;
        }
        const index = targetIds.indexOf(targetId);
        if (shallow) {
            return index === targetIds.length - 1;
        } else {
            return index > -1;
        }
    }
    getItemType() {
        return this.store.getState().dragOperation.itemType;
    }
    getItem() {
        return this.store.getState().dragOperation.item;
    }
    getSourceId() {
        return this.store.getState().dragOperation.sourceId;
    }
    getTargetIds() {
        return this.store.getState().dragOperation.targetIds;
    }
    getDropResult() {
        return this.store.getState().dragOperation.dropResult;
    }
    didDrop() {
        return this.store.getState().dragOperation.didDrop;
    }
    isSourcePublic() {
        return Boolean(this.store.getState().dragOperation.isSourcePublic);
    }
    getInitialClientOffset() {
        return this.store.getState().dragOffset.initialClientOffset;
    }
    getInitialSourceClientOffset() {
        return this.store.getState().dragOffset.initialSourceClientOffset;
    }
    getClientOffset() {
        return this.store.getState().dragOffset.clientOffset;
    }
    getSourceClientOffset() {
        return (0,_utils_coords_js__WEBPACK_IMPORTED_MODULE_3__.getSourceClientOffset)(this.store.getState().dragOffset);
    }
    getDifferenceFromInitialOffset() {
        return (0,_utils_coords_js__WEBPACK_IMPORTED_MODULE_3__.getDifferenceFromInitialOffset)(this.store.getState().dragOffset);
    }
    constructor(store, registry){
        this.store = store;
        this.registry = registry;
    }
}

//# sourceMappingURL=DragDropMonitorImpl.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/classes/HandlerRegistryImpl.js":
/*!*******************************************************************!*\
  !*** ./node_modules/dnd-core/dist/classes/HandlerRegistryImpl.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HandlerRegistryImpl: () => (/* binding */ HandlerRegistryImpl)
/* harmony export */ });
/* harmony import */ var _react_dnd_asap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/asap */ "./node_modules/@react-dnd/asap/dist/index.js");
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");
/* harmony import */ var _actions_registry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../actions/registry.js */ "./node_modules/dnd-core/dist/actions/registry.js");
/* harmony import */ var _contracts_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contracts.js */ "./node_modules/dnd-core/dist/contracts.js");
/* harmony import */ var _interfaces_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../interfaces.js */ "./node_modules/dnd-core/dist/interfaces.js");
/* harmony import */ var _utils_getNextUniqueId_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getNextUniqueId.js */ "./node_modules/dnd-core/dist/utils/getNextUniqueId.js");






function getNextHandlerId(role) {
    const id = (0,_utils_getNextUniqueId_js__WEBPACK_IMPORTED_MODULE_2__.getNextUniqueId)().toString();
    switch(role){
        case _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.SOURCE:
            return `S${id}`;
        case _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.TARGET:
            return `T${id}`;
        default:
            throw new Error(`Unknown Handler Role: ${role}`);
    }
}
function parseRoleFromHandlerId(handlerId) {
    switch(handlerId[0]){
        case 'S':
            return _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.SOURCE;
        case 'T':
            return _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.TARGET;
        default:
            throw new Error(`Cannot parse handler ID: ${handlerId}`);
    }
}
function mapContainsValue(map, searchValue) {
    const entries = map.entries();
    let isDone = false;
    do {
        const { done , value: [, value] ,  } = entries.next();
        if (value === searchValue) {
            return true;
        }
        isDone = !!done;
    }while (!isDone)
    return false;
}
class HandlerRegistryImpl {
    addSource(type, source) {
        (0,_contracts_js__WEBPACK_IMPORTED_MODULE_4__.validateType)(type);
        (0,_contracts_js__WEBPACK_IMPORTED_MODULE_4__.validateSourceContract)(source);
        const sourceId = this.addHandler(_interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.SOURCE, type, source);
        this.store.dispatch((0,_actions_registry_js__WEBPACK_IMPORTED_MODULE_5__.addSource)(sourceId));
        return sourceId;
    }
    addTarget(type, target) {
        (0,_contracts_js__WEBPACK_IMPORTED_MODULE_4__.validateType)(type, true);
        (0,_contracts_js__WEBPACK_IMPORTED_MODULE_4__.validateTargetContract)(target);
        const targetId = this.addHandler(_interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.TARGET, type, target);
        this.store.dispatch((0,_actions_registry_js__WEBPACK_IMPORTED_MODULE_5__.addTarget)(targetId));
        return targetId;
    }
    containsHandler(handler) {
        return mapContainsValue(this.dragSources, handler) || mapContainsValue(this.dropTargets, handler);
    }
    getSource(sourceId, includePinned = false) {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_1__.invariant)(this.isSourceId(sourceId), 'Expected a valid source ID.');
        const isPinned = includePinned && sourceId === this.pinnedSourceId;
        const source = isPinned ? this.pinnedSource : this.dragSources.get(sourceId);
        return source;
    }
    getTarget(targetId) {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_1__.invariant)(this.isTargetId(targetId), 'Expected a valid target ID.');
        return this.dropTargets.get(targetId);
    }
    getSourceType(sourceId) {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_1__.invariant)(this.isSourceId(sourceId), 'Expected a valid source ID.');
        return this.types.get(sourceId);
    }
    getTargetType(targetId) {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_1__.invariant)(this.isTargetId(targetId), 'Expected a valid target ID.');
        return this.types.get(targetId);
    }
    isSourceId(handlerId) {
        const role = parseRoleFromHandlerId(handlerId);
        return role === _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.SOURCE;
    }
    isTargetId(handlerId) {
        const role = parseRoleFromHandlerId(handlerId);
        return role === _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.TARGET;
    }
    removeSource(sourceId) {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_1__.invariant)(this.getSource(sourceId), 'Expected an existing source.');
        this.store.dispatch((0,_actions_registry_js__WEBPACK_IMPORTED_MODULE_5__.removeSource)(sourceId));
        (0,_react_dnd_asap__WEBPACK_IMPORTED_MODULE_0__.asap)(()=>{
            this.dragSources.delete(sourceId);
            this.types.delete(sourceId);
        });
    }
    removeTarget(targetId) {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_1__.invariant)(this.getTarget(targetId), 'Expected an existing target.');
        this.store.dispatch((0,_actions_registry_js__WEBPACK_IMPORTED_MODULE_5__.removeTarget)(targetId));
        this.dropTargets.delete(targetId);
        this.types.delete(targetId);
    }
    pinSource(sourceId) {
        const source = this.getSource(sourceId);
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_1__.invariant)(source, 'Expected an existing source.');
        this.pinnedSourceId = sourceId;
        this.pinnedSource = source;
    }
    unpinSource() {
        (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_1__.invariant)(this.pinnedSource, 'No source is pinned at the time.');
        this.pinnedSourceId = null;
        this.pinnedSource = null;
    }
    addHandler(role, type, handler) {
        const id = getNextHandlerId(role);
        this.types.set(id, type);
        if (role === _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.SOURCE) {
            this.dragSources.set(id, handler);
        } else if (role === _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.HandlerRole.TARGET) {
            this.dropTargets.set(id, handler);
        }
        return id;
    }
    constructor(store){
        this.types = new Map();
        this.dragSources = new Map();
        this.dropTargets = new Map();
        this.pinnedSourceId = null;
        this.pinnedSource = null;
        this.store = store;
    }
}

//# sourceMappingURL=HandlerRegistryImpl.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/contracts.js":
/*!*************************************************!*\
  !*** ./node_modules/dnd-core/dist/contracts.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   validateSourceContract: () => (/* binding */ validateSourceContract),
/* harmony export */   validateTargetContract: () => (/* binding */ validateTargetContract),
/* harmony export */   validateType: () => (/* binding */ validateType)
/* harmony export */ });
/* harmony import */ var _react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-dnd/invariant */ "./node_modules/@react-dnd/invariant/dist/index.js");

function validateSourceContract(source) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof source.canDrag === 'function', 'Expected canDrag to be a function.');
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof source.beginDrag === 'function', 'Expected beginDrag to be a function.');
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof source.endDrag === 'function', 'Expected endDrag to be a function.');
}
function validateTargetContract(target) {
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof target.canDrop === 'function', 'Expected canDrop to be a function.');
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof target.hover === 'function', 'Expected hover to be a function.');
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof target.drop === 'function', 'Expected beginDrag to be a function.');
}
function validateType(type, allowArray) {
    if (allowArray && Array.isArray(type)) {
        type.forEach((t)=>validateType(t, false)
        );
        return;
    }
    (0,_react_dnd_invariant__WEBPACK_IMPORTED_MODULE_0__.invariant)(typeof type === 'string' || typeof type === 'symbol', allowArray ? 'Type can only be a string, a symbol, or an array of either.' : 'Type can only be a string or a symbol.');
}

//# sourceMappingURL=contracts.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/createDragDropManager.js":
/*!*************************************************************!*\
  !*** ./node_modules/dnd-core/dist/createDragDropManager.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDragDropManager: () => (/* binding */ createDragDropManager)
/* harmony export */ });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _classes_DragDropManagerImpl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/DragDropManagerImpl.js */ "./node_modules/dnd-core/dist/classes/DragDropManagerImpl.js");
/* harmony import */ var _classes_DragDropMonitorImpl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/DragDropMonitorImpl.js */ "./node_modules/dnd-core/dist/classes/DragDropMonitorImpl.js");
/* harmony import */ var _classes_HandlerRegistryImpl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/HandlerRegistryImpl.js */ "./node_modules/dnd-core/dist/classes/HandlerRegistryImpl.js");
/* harmony import */ var _reducers_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reducers/index.js */ "./node_modules/dnd-core/dist/reducers/index.js");





function createDragDropManager(backendFactory, globalContext = undefined, backendOptions = {}, debugMode = false) {
    const store = makeStoreInstance(debugMode);
    const monitor = new _classes_DragDropMonitorImpl_js__WEBPACK_IMPORTED_MODULE_0__.DragDropMonitorImpl(store, new _classes_HandlerRegistryImpl_js__WEBPACK_IMPORTED_MODULE_1__.HandlerRegistryImpl(store));
    const manager = new _classes_DragDropManagerImpl_js__WEBPACK_IMPORTED_MODULE_2__.DragDropManagerImpl(store, monitor);
    const backend = backendFactory(manager, globalContext, backendOptions);
    manager.receiveBackend(backend);
    return manager;
}
function makeStoreInstance(debugMode) {
    // TODO: if we ever make a react-native version of this,
    // we'll need to consider how to pull off dev-tooling
    const reduxDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;
    return (0,redux__WEBPACK_IMPORTED_MODULE_3__.createStore)(_reducers_index_js__WEBPACK_IMPORTED_MODULE_4__.reduce, debugMode && reduxDevTools && reduxDevTools({
        name: 'dnd-core',
        instanceId: 'dnd-core'
    }));
}

//# sourceMappingURL=createDragDropManager.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/interfaces.js":
/*!**************************************************!*\
  !*** ./node_modules/dnd-core/dist/interfaces.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HandlerRole: () => (/* binding */ HandlerRole)
/* harmony export */ });
var HandlerRole;
(function(HandlerRole) {
    HandlerRole["SOURCE"] = "SOURCE";
    HandlerRole["TARGET"] = "TARGET";
})(HandlerRole || (HandlerRole = {}));

//# sourceMappingURL=interfaces.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/reducers/dirtyHandlerIds.js":
/*!****************************************************************!*\
  !*** ./node_modules/dnd-core/dist/reducers/dirtyHandlerIds.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reduce: () => (/* binding */ reduce)
/* harmony export */ });
/* harmony import */ var _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/dragDrop/index.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");
/* harmony import */ var _actions_registry_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions/registry.js */ "./node_modules/dnd-core/dist/actions/registry.js");
/* harmony import */ var _utils_dirtiness_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/dirtiness.js */ "./node_modules/dnd-core/dist/utils/dirtiness.js");
/* harmony import */ var _utils_equality_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/equality.js */ "./node_modules/dnd-core/dist/utils/equality.js");
/* harmony import */ var _utils_js_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/js_utils.js */ "./node_modules/dnd-core/dist/utils/js_utils.js");





function reduce(// eslint-disable-next-line @typescript-eslint/no-unused-vars
_state = _utils_dirtiness_js__WEBPACK_IMPORTED_MODULE_0__.NONE, action) {
    switch(action.type){
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_1__.HOVER:
            break;
        case _actions_registry_js__WEBPACK_IMPORTED_MODULE_2__.ADD_SOURCE:
        case _actions_registry_js__WEBPACK_IMPORTED_MODULE_2__.ADD_TARGET:
        case _actions_registry_js__WEBPACK_IMPORTED_MODULE_2__.REMOVE_TARGET:
        case _actions_registry_js__WEBPACK_IMPORTED_MODULE_2__.REMOVE_SOURCE:
            return _utils_dirtiness_js__WEBPACK_IMPORTED_MODULE_0__.NONE;
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_1__.BEGIN_DRAG:
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_1__.PUBLISH_DRAG_SOURCE:
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_1__.END_DRAG:
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_1__.DROP:
        default:
            return _utils_dirtiness_js__WEBPACK_IMPORTED_MODULE_0__.ALL;
    }
    const { targetIds =[] , prevTargetIds =[]  } = action.payload;
    const result = (0,_utils_js_utils_js__WEBPACK_IMPORTED_MODULE_3__.xor)(targetIds, prevTargetIds);
    const didChange = result.length > 0 || !(0,_utils_equality_js__WEBPACK_IMPORTED_MODULE_4__.areArraysEqual)(targetIds, prevTargetIds);
    if (!didChange) {
        return _utils_dirtiness_js__WEBPACK_IMPORTED_MODULE_0__.NONE;
    }
    // Check the target ids at the innermost position. If they are valid, add them
    // to the result
    const prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
    const innermostTargetId = targetIds[targetIds.length - 1];
    if (prevInnermostTargetId !== innermostTargetId) {
        if (prevInnermostTargetId) {
            result.push(prevInnermostTargetId);
        }
        if (innermostTargetId) {
            result.push(innermostTargetId);
        }
    }
    return result;
}

//# sourceMappingURL=dirtyHandlerIds.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/reducers/dragOffset.js":
/*!***********************************************************!*\
  !*** ./node_modules/dnd-core/dist/reducers/dragOffset.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reduce: () => (/* binding */ reduce)
/* harmony export */ });
/* harmony import */ var _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/dragDrop/index.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");
/* harmony import */ var _utils_equality_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/equality.js */ "./node_modules/dnd-core/dist/utils/equality.js");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}


const initialState = {
    initialSourceClientOffset: null,
    initialClientOffset: null,
    clientOffset: null
};
function reduce(state = initialState, action) {
    const { payload  } = action;
    switch(action.type){
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.INIT_COORDS:
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.BEGIN_DRAG:
            return {
                initialSourceClientOffset: payload.sourceClientOffset,
                initialClientOffset: payload.clientOffset,
                clientOffset: payload.clientOffset
            };
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.HOVER:
            if ((0,_utils_equality_js__WEBPACK_IMPORTED_MODULE_1__.areCoordsEqual)(state.clientOffset, payload.clientOffset)) {
                return state;
            }
            return _objectSpread({}, state, {
                clientOffset: payload.clientOffset
            });
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.END_DRAG:
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.DROP:
            return initialState;
        default:
            return state;
    }
}

//# sourceMappingURL=dragOffset.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/reducers/dragOperation.js":
/*!**************************************************************!*\
  !*** ./node_modules/dnd-core/dist/reducers/dragOperation.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reduce: () => (/* binding */ reduce)
/* harmony export */ });
/* harmony import */ var _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/dragDrop/index.js */ "./node_modules/dnd-core/dist/actions/dragDrop/types.js");
/* harmony import */ var _actions_registry_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/registry.js */ "./node_modules/dnd-core/dist/actions/registry.js");
/* harmony import */ var _utils_js_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/js_utils.js */ "./node_modules/dnd-core/dist/utils/js_utils.js");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}



const initialState = {
    itemType: null,
    item: null,
    sourceId: null,
    targetIds: [],
    dropResult: null,
    didDrop: false,
    isSourcePublic: null
};
function reduce(state = initialState, action) {
    const { payload  } = action;
    switch(action.type){
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.BEGIN_DRAG:
            return _objectSpread({}, state, {
                itemType: payload.itemType,
                item: payload.item,
                sourceId: payload.sourceId,
                isSourcePublic: payload.isSourcePublic,
                dropResult: null,
                didDrop: false
            });
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.PUBLISH_DRAG_SOURCE:
            return _objectSpread({}, state, {
                isSourcePublic: true
            });
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.HOVER:
            return _objectSpread({}, state, {
                targetIds: payload.targetIds
            });
        case _actions_registry_js__WEBPACK_IMPORTED_MODULE_1__.REMOVE_TARGET:
            if (state.targetIds.indexOf(payload.targetId) === -1) {
                return state;
            }
            return _objectSpread({}, state, {
                targetIds: (0,_utils_js_utils_js__WEBPACK_IMPORTED_MODULE_2__.without)(state.targetIds, payload.targetId)
            });
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.DROP:
            return _objectSpread({}, state, {
                dropResult: payload.dropResult,
                didDrop: true,
                targetIds: []
            });
        case _actions_dragDrop_index_js__WEBPACK_IMPORTED_MODULE_0__.END_DRAG:
            return _objectSpread({}, state, {
                itemType: null,
                item: null,
                sourceId: null,
                dropResult: null,
                didDrop: false,
                isSourcePublic: null,
                targetIds: []
            });
        default:
            return state;
    }
}

//# sourceMappingURL=dragOperation.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/reducers/index.js":
/*!******************************************************!*\
  !*** ./node_modules/dnd-core/dist/reducers/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reduce: () => (/* binding */ reduce)
/* harmony export */ });
/* harmony import */ var _utils_js_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/js_utils.js */ "./node_modules/dnd-core/dist/utils/js_utils.js");
/* harmony import */ var _dirtyHandlerIds_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dirtyHandlerIds.js */ "./node_modules/dnd-core/dist/reducers/dirtyHandlerIds.js");
/* harmony import */ var _dragOffset_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dragOffset.js */ "./node_modules/dnd-core/dist/reducers/dragOffset.js");
/* harmony import */ var _dragOperation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dragOperation.js */ "./node_modules/dnd-core/dist/reducers/dragOperation.js");
/* harmony import */ var _refCount_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./refCount.js */ "./node_modules/dnd-core/dist/reducers/refCount.js");
/* harmony import */ var _stateId_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./stateId.js */ "./node_modules/dnd-core/dist/reducers/stateId.js");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}






function reduce(state = {}, action) {
    return {
        dirtyHandlerIds: (0,_dirtyHandlerIds_js__WEBPACK_IMPORTED_MODULE_0__.reduce)(state.dirtyHandlerIds, {
            type: action.type,
            payload: _objectSpread({}, action.payload, {
                prevTargetIds: (0,_utils_js_utils_js__WEBPACK_IMPORTED_MODULE_1__.get)(state, 'dragOperation.targetIds', [])
            })
        }),
        dragOffset: (0,_dragOffset_js__WEBPACK_IMPORTED_MODULE_2__.reduce)(state.dragOffset, action),
        refCount: (0,_refCount_js__WEBPACK_IMPORTED_MODULE_3__.reduce)(state.refCount, action),
        dragOperation: (0,_dragOperation_js__WEBPACK_IMPORTED_MODULE_4__.reduce)(state.dragOperation, action),
        stateId: (0,_stateId_js__WEBPACK_IMPORTED_MODULE_5__.reduce)(state.stateId)
    };
}

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/reducers/refCount.js":
/*!*********************************************************!*\
  !*** ./node_modules/dnd-core/dist/reducers/refCount.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reduce: () => (/* binding */ reduce)
/* harmony export */ });
/* harmony import */ var _actions_registry_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/registry.js */ "./node_modules/dnd-core/dist/actions/registry.js");

function reduce(state = 0, action) {
    switch(action.type){
        case _actions_registry_js__WEBPACK_IMPORTED_MODULE_0__.ADD_SOURCE:
        case _actions_registry_js__WEBPACK_IMPORTED_MODULE_0__.ADD_TARGET:
            return state + 1;
        case _actions_registry_js__WEBPACK_IMPORTED_MODULE_0__.REMOVE_SOURCE:
        case _actions_registry_js__WEBPACK_IMPORTED_MODULE_0__.REMOVE_TARGET:
            return state - 1;
        default:
            return state;
    }
}

//# sourceMappingURL=refCount.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/reducers/stateId.js":
/*!********************************************************!*\
  !*** ./node_modules/dnd-core/dist/reducers/stateId.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reduce: () => (/* binding */ reduce)
/* harmony export */ });
function reduce(state = 0) {
    return state + 1;
}

//# sourceMappingURL=stateId.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/utils/coords.js":
/*!****************************************************!*\
  !*** ./node_modules/dnd-core/dist/utils/coords.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   getDifferenceFromInitialOffset: () => (/* binding */ getDifferenceFromInitialOffset),
/* harmony export */   getSourceClientOffset: () => (/* binding */ getSourceClientOffset),
/* harmony export */   subtract: () => (/* binding */ subtract)
/* harmony export */ });
/**
 * Coordinate addition
 * @param a The first coordinate
 * @param b The second coordinate
 */ function add(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    };
}
/**
 * Coordinate subtraction
 * @param a The first coordinate
 * @param b The second coordinate
 */ function subtract(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    };
}
/**
 * Returns the cartesian distance of the drag source component's position, based on its position
 * at the time when the current drag operation has started, and the movement difference.
 *
 * Returns null if no item is being dragged.
 *
 * @param state The offset state to compute from
 */ function getSourceClientOffset(state) {
    const { clientOffset , initialClientOffset , initialSourceClientOffset  } = state;
    if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
        return null;
    }
    return subtract(add(clientOffset, initialSourceClientOffset), initialClientOffset);
}
/**
 * Determines the x,y offset between the client offset and the initial client offset
 *
 * @param state The offset state to compute from
 */ function getDifferenceFromInitialOffset(state) {
    const { clientOffset , initialClientOffset  } = state;
    if (!clientOffset || !initialClientOffset) {
        return null;
    }
    return subtract(clientOffset, initialClientOffset);
}

//# sourceMappingURL=coords.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/utils/dirtiness.js":
/*!*******************************************************!*\
  !*** ./node_modules/dnd-core/dist/utils/dirtiness.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALL: () => (/* binding */ ALL),
/* harmony export */   NONE: () => (/* binding */ NONE),
/* harmony export */   areDirty: () => (/* binding */ areDirty)
/* harmony export */ });
/* harmony import */ var _js_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js_utils.js */ "./node_modules/dnd-core/dist/utils/js_utils.js");

const NONE = [];
const ALL = [];
NONE.__IS_NONE__ = true;
ALL.__IS_ALL__ = true;
/**
 * Determines if the given handler IDs are dirty or not.
 *
 * @param dirtyIds The set of dirty handler ids
 * @param handlerIds The set of handler ids to check
 */ function areDirty(dirtyIds, handlerIds) {
    if (dirtyIds === NONE) {
        return false;
    }
    if (dirtyIds === ALL || typeof handlerIds === 'undefined') {
        return true;
    }
    const commonIds = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_0__.intersection)(handlerIds, dirtyIds);
    return commonIds.length > 0;
}

//# sourceMappingURL=dirtiness.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/utils/equality.js":
/*!******************************************************!*\
  !*** ./node_modules/dnd-core/dist/utils/equality.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   areArraysEqual: () => (/* binding */ areArraysEqual),
/* harmony export */   areCoordsEqual: () => (/* binding */ areCoordsEqual),
/* harmony export */   strictEquality: () => (/* binding */ strictEquality)
/* harmony export */ });
const strictEquality = (a, b)=>a === b
;
/**
 * Determine if two cartesian coordinate offsets are equal
 * @param offsetA
 * @param offsetB
 */ function areCoordsEqual(offsetA, offsetB) {
    if (!offsetA && !offsetB) {
        return true;
    } else if (!offsetA || !offsetB) {
        return false;
    } else {
        return offsetA.x === offsetB.x && offsetA.y === offsetB.y;
    }
}
/**
 * Determines if two arrays of items are equal
 * @param a The first array of items
 * @param b The second array of items
 */ function areArraysEqual(a, b, isEqual = strictEquality) {
    if (a.length !== b.length) {
        return false;
    }
    for(let i = 0; i < a.length; ++i){
        if (!isEqual(a[i], b[i])) {
            return false;
        }
    }
    return true;
}

//# sourceMappingURL=equality.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/utils/getNextUniqueId.js":
/*!*************************************************************!*\
  !*** ./node_modules/dnd-core/dist/utils/getNextUniqueId.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getNextUniqueId: () => (/* binding */ getNextUniqueId)
/* harmony export */ });
let nextUniqueId = 0;
function getNextUniqueId() {
    return nextUniqueId++;
}

//# sourceMappingURL=getNextUniqueId.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/utils/js_utils.js":
/*!******************************************************!*\
  !*** ./node_modules/dnd-core/dist/utils/js_utils.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   intersection: () => (/* binding */ intersection),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   without: () => (/* binding */ without),
/* harmony export */   xor: () => (/* binding */ xor)
/* harmony export */ });
// cheap lodash replacements
/**
 * drop-in replacement for _.get
 * @param obj
 * @param path
 * @param defaultValue
 */ function get(obj, path, defaultValue) {
    return path.split('.').reduce((a, c)=>a && a[c] ? a[c] : defaultValue || null
    , obj);
}
/**
 * drop-in replacement for _.without
 */ function without(items, item) {
    return items.filter((i)=>i !== item
    );
}
/**
 * drop-in replacement for _.isString
 * @param input
 */ function isString(input) {
    return typeof input === 'string';
}
/**
 * drop-in replacement for _.isString
 * @param input
 */ function isObject(input) {
    return typeof input === 'object';
}
/**
 * replacement for _.xor
 * @param itemsA
 * @param itemsB
 */ function xor(itemsA, itemsB) {
    const map = new Map();
    const insertItem = (item)=>{
        map.set(item, map.has(item) ? map.get(item) + 1 : 1);
    };
    itemsA.forEach(insertItem);
    itemsB.forEach(insertItem);
    const result = [];
    map.forEach((count, key)=>{
        if (count === 1) {
            result.push(key);
        }
    });
    return result;
}
/**
 * replacement for _.intersection
 * @param itemsA
 * @param itemsB
 */ function intersection(itemsA, itemsB) {
    return itemsA.filter((t)=>itemsB.indexOf(t) > -1
    );
}

//# sourceMappingURL=js_utils.js.map

/***/ }),

/***/ "./node_modules/dnd-core/dist/utils/matchesType.js":
/*!*********************************************************!*\
  !*** ./node_modules/dnd-core/dist/utils/matchesType.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   matchesType: () => (/* binding */ matchesType)
/* harmony export */ });
function matchesType(targetType, draggedItemType) {
    if (draggedItemType === null) {
        return targetType === null;
    }
    return Array.isArray(targetType) ? targetType.some((t)=>t === draggedItemType
    ) : targetType === draggedItemType;
}

//# sourceMappingURL=matchesType.js.map

/***/ })

}]);
//# sourceMappingURL=vendor-dnd-core.js.map
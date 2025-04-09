/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./static/ts/eventBus.ts":
/*!*******************************!*\
  !*** ./static/ts/eventBus.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass EventBus {\n    constructor() {\n        this.events = new Map();\n        // Initialize with default events\n        this.events.set(\"section:change\", []);\n        this.events.set(\"theme:change\", []);\n        this.events.set(\"capsule:load\", []);\n        this.events.set(\"capsule:interact\", []);\n        this.events.set(\"mfe:loaded\", []);\n        this.events.set(\"mfe:message\", []);\n        this.events.set(\"state:update\", []);\n    }\n    subscribe(event, callback) {\n        if (!this.events.has(event)) {\n            this.events.set(event, []);\n        }\n        const callbacks = this.events.get(event);\n        callbacks.push(callback);\n        // Return unsubscribe function\n        return () => {\n            const index = callbacks.indexOf(callback);\n            if (index !== -1) {\n                callbacks.splice(index, 1);\n            }\n        };\n    }\n    publish(event, data = {}) {\n        if (!this.events.has(event)) {\n            return;\n        }\n        const callbacks = this.events.get(event);\n        callbacks.forEach((callback) => {\n            try {\n                callback(data);\n            }\n            catch (error) {\n                console.error(`Error in event handler for ${event}:`, error);\n            }\n        });\n        // Log events to server if they're interaction events\n        if (event.includes(\"interact\") || event.includes(\"click\")) {\n            this.logEvent(event, data);\n        }\n    }\n    logEvent(event, data) {\n        fetch(\"/api/events\", {\n            method: \"POST\",\n            headers: {\n                \"Content-Type\": \"application/json\",\n            },\n            body: JSON.stringify({\n                event,\n                data,\n                timestamp: new Date().toISOString(),\n            }),\n        }).catch((err) => console.error(\"Failed to log event:\", err));\n    }\n}\n// Create a global instance\nconst eventBus = new EventBus();\nwindow.eventBus = eventBus;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (eventBus);\n\n\n//# sourceURL=webpack://htmx-mfe/./static/ts/eventBus.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./static/ts/eventBus.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
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

/***/ "./static/ts/core-shell.ts":
/*!*********************************!*\
  !*** ./static/ts/core-shell.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CoreShell: () => (/* binding */ CoreShell)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nclass CoreShell {\n    constructor() {\n        this.mfeFrames = new Map();\n        this.state = {\n            user: { name: \"\", role: \"\" },\n            activeSection: \"hero\",\n            theme: \"light\",\n        };\n        this.initEventListeners();\n        this.fetchInitialState();\n        // Make the core shell accessible globally\n        window.coreShell = this;\n    }\n    // Register an MFE iframe\n    registerMfe(id, frame) {\n        this.mfeFrames.set(id, frame);\n        console.log(`MFE registered: ${id}`);\n        // Send current state to the newly registered MFE once it loads\n        frame.addEventListener(\"load\", () => {\n            this.sendStateToMfe(id);\n        });\n    }\n    initEventListeners() {\n        // Listen for messages from MFEs\n        window.addEventListener(\"message\", this.handleMfeMessage.bind(this));\n        // Listen for HTMX events\n        document.body.addEventListener(\"htmx:afterSwap\", this.handleHtmxAfterSwap.bind(this));\n        // Register scroll events for section detection\n        window.addEventListener(\"scroll\", this.debounce(this.detectActiveSection.bind(this), 100));\n        // Theme toggle\n        const themeToggle = document.getElementById(\"theme-toggle\");\n        if (themeToggle) {\n            themeToggle.addEventListener(\"click\", this.toggleTheme.bind(this));\n        }\n    }\n    toggleTheme() {\n        const newTheme = this.state.theme === \"light\" ? \"dark\" : \"light\";\n        this.updateState({ theme: newTheme });\n        // Apply theme to document\n        document.documentElement.classList.toggle(\"dark\", newTheme === \"dark\");\n    }\n    fetchInitialState() {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const response = yield fetch(\"/api/state\");\n                const stateData = yield response.json();\n                this.state = Object.assign(Object.assign({}, this.state), stateData);\n                this.broadcastStateUpdate();\n                // Apply initial theme\n                document.documentElement.classList.toggle(\"dark\", this.state.theme === \"dark\");\n            }\n            catch (error) {\n                console.error(\"Failed to fetch initial state:\", error);\n            }\n        });\n    }\n    handleHtmxAfterSwap(event) {\n        console.log(\"HTMX after swap:\", event);\n    }\n    handleMfeMessage(event) {\n        const message = event.data;\n        if (!message || typeof message !== \"object\" || !message.type) {\n            return;\n        }\n        console.log(`Received message from MFE: ${message.source}`, message);\n        switch (message.type) {\n            case \"STATE_REQUEST\":\n                this.sendStateToMfe(message.source);\n                break;\n            case \"STATE_UPDATE\":\n                this.updateState(message.payload);\n                break;\n            case \"EVENT\":\n                this.handleMfeEvent(message.payload, message.source);\n                break;\n        }\n    }\n    handleMfeEvent(event, source) {\n        // Log the event\n        fetch(\"/api/events\", {\n            method: \"POST\",\n            headers: { \"Content-Type\": \"application/json\" },\n            body: JSON.stringify({ event, source }),\n        });\n        // Broadcast to other MFEs\n        this.broadcastToMfes({\n            type: \"EVENT\",\n            payload: event,\n            source,\n        }, source);\n    }\n    updateState(update) {\n        this.state = Object.assign(Object.assign({}, this.state), update);\n        // Apply theme if it was updated\n        if (update.theme) {\n            document.documentElement.classList.toggle(\"dark\", update.theme === \"dark\");\n        }\n        // Broadcast the update to all MFEs\n        this.broadcastStateUpdate();\n        // Send the update to the server\n        fetch(\"/api/state\", {\n            method: \"POST\",\n            headers: { \"Content-Type\": \"application/json\" },\n            body: JSON.stringify(update),\n        });\n    }\n    sendStateToMfe(target) {\n        const frame = this.mfeFrames.get(target);\n        if (frame && frame.contentWindow) {\n            frame.contentWindow.postMessage({\n                type: \"STATE_UPDATE\",\n                payload: this.state,\n                source: \"shell\",\n            }, \"*\");\n        }\n    }\n    broadcastStateUpdate() {\n        this.broadcastToMfes({\n            type: \"STATE_UPDATE\",\n            payload: this.state,\n            source: \"shell\",\n        });\n    }\n    broadcastToMfes(message, excludeSource) {\n        this.mfeFrames.forEach((frame, id) => {\n            if (id !== excludeSource && frame.contentWindow) {\n                frame.contentWindow.postMessage(message, \"*\");\n            }\n        });\n    }\n    detectActiveSection() {\n        const sections = document.querySelectorAll(\"section[id]\");\n        let currentSection = \"\";\n        sections.forEach((section) => {\n            const rect = section.getBoundingClientRect();\n            if (rect.top <= 100 && rect.bottom >= 100) {\n                currentSection = section.id;\n            }\n        });\n        if (currentSection && currentSection !== this.state.activeSection) {\n            this.updateState({ activeSection: currentSection });\n        }\n    }\n    debounce(func, wait) {\n        let timeout = null;\n        return (...args) => {\n            const later = () => {\n                timeout = null;\n                func(...args);\n            };\n            if (timeout !== null) {\n                clearTimeout(timeout);\n            }\n            timeout = window.setTimeout(later, wait);\n        };\n    }\n}\n// Initialize the core shell when the DOM is loaded\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n    new CoreShell();\n});\n\n\n//# sourceURL=webpack://htmx-mfe/./static/ts/core-shell.ts?");

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
/******/ 	__webpack_modules__["./static/ts/core-shell.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
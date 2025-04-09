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

/***/ "./static/ts/wasm-terminal.ts":
/*!************************************!*\
  !*** ./static/ts/wasm-terminal.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nclass WasmTerminal {\n    constructor(containerId) {\n        this.history = [];\n        this.historyIndex = -1;\n        this.wasmInstance = null;\n        this.container = document.getElementById(containerId);\n        if (!this.container) {\n            throw new Error(`Container element with id \"${containerId}\" not found`);\n        }\n        this.createTerminalUI();\n        this.loadWasmModule();\n    }\n    createTerminalUI() {\n        // Create terminal header\n        const header = document.createElement(\"div\");\n        header.className = \"terminal-header\";\n        header.innerHTML = `\r\n            <div class=\"terminal-title\">Tijo's Terminal</div>\r\n            <div class=\"terminal-dots\">\r\n                <div class=\"terminal-dot terminal-dot-red\"></div>\r\n                <div class=\"terminal-dot terminal-dot-yellow\"></div>\r\n                <div class=\"terminal-dot terminal-dot-green\"></div>\r\n            </div>\r\n        `;\n        this.container.appendChild(header);\n        // Create terminal output area\n        this.output = document.createElement(\"div\");\n        this.output.className = \"terminal-output\";\n        this.container.appendChild(this.output);\n        // Add welcome message\n        this.addOutput(\"Welcome to Tijo's WebAssembly Terminal!\");\n        this.addOutput('Type \"help\" to see available commands.');\n        // Create terminal input area\n        const inputContainer = document.createElement(\"div\");\n        inputContainer.className = \"terminal-input-container\";\n        const prompt = document.createElement(\"span\");\n        prompt.className = \"terminal-prompt\";\n        prompt.textContent = \"> \";\n        inputContainer.appendChild(prompt);\n        this.input = document.createElement(\"input\");\n        this.input.className = \"terminal-input\";\n        this.input.type = \"text\";\n        this.input.autocomplete = \"off\";\n        this.input.spellcheck = false;\n        this.input.addEventListener(\"keydown\", this.handleInput.bind(this));\n        inputContainer.appendChild(this.input);\n        this.container.appendChild(inputContainer);\n        // Focus input when terminal is clicked\n        this.container.addEventListener(\"click\", () => {\n            this.input.focus();\n        });\n        // Initial focus\n        this.input.focus();\n    }\n    handleInput(event) {\n        if (event.key === \"Enter\") {\n            const command = this.input.value.trim();\n            if (command) {\n                // Add command to history\n                this.history.push(command);\n                this.historyIndex = this.history.length;\n                // Display command\n                this.addOutput(`> ${command}`);\n                // Process command\n                this.executeCommand(command);\n                // Clear input\n                this.input.value = \"\";\n            }\n        }\n        else if (event.key === \"ArrowUp\") {\n            event.preventDefault();\n            if (this.historyIndex > 0) {\n                this.historyIndex--;\n                this.input.value = this.history[this.historyIndex];\n            }\n        }\n        else if (event.key === \"ArrowDown\") {\n            event.preventDefault();\n            if (this.historyIndex < this.history.length - 1) {\n                this.historyIndex++;\n                this.input.value = this.history[this.historyIndex];\n            }\n            else {\n                this.historyIndex = this.history.length;\n                this.input.value = \"\";\n            }\n        }\n    }\n    executeCommand(command) {\n        const parts = command.split(\" \");\n        const cmd = parts[0].toLowerCase();\n        const args = parts.slice(1);\n        switch (cmd) {\n            case \"help\":\n                this.showHelp();\n                break;\n            case \"clear\":\n                this.clearOutput();\n                break;\n            case \"echo\":\n                this.addOutput(args.join(\" \"));\n                break;\n            case \"date\":\n                this.addOutput(new Date().toString());\n                break;\n            case \"wasm\":\n                this.executeWasmCommand(args);\n                break;\n            default:\n                this.addOutput(`Command not found: ${cmd}. Type \"help\" for available commands.`);\n        }\n    }\n    showHelp() {\n        this.addOutput(\"Available commands:\");\n        this.addOutput(\"  help - Show this help message\");\n        this.addOutput(\"  clear - Clear the terminal\");\n        this.addOutput(\"  echo [text] - Display text\");\n        this.addOutput(\"  date - Show current date and time\");\n        this.addOutput(\"  wasm [function] [args] - Execute WebAssembly function\");\n    }\n    clearOutput() {\n        this.output.innerHTML = \"\";\n    }\n    addOutput(text) {\n        const line = document.createElement(\"div\");\n        line.className = \"terminal-line\";\n        line.textContent = text;\n        this.output.appendChild(line);\n        // Scroll to bottom\n        this.output.scrollTop = this.output.scrollHeight;\n    }\n    loadWasmModule() {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const response = yield fetch(\"/static/wasm/main.wasm\");\n                const buffer = yield response.arrayBuffer();\n                const module = yield WebAssembly.compile(buffer);\n                const importObject = {\n                    env: {\n                        consoleLog: (ptr, len) => {\n                            // This would need actual memory handling in a real implementation\n                            this.addOutput(`WASM output: ${ptr}, ${len}`);\n                        },\n                    },\n                };\n                this.wasmInstance = yield WebAssembly.instantiate(module, importObject);\n                this.addOutput(\"WebAssembly module loaded successfully!\");\n            }\n            catch (error) {\n                console.error(\"Failed to load WebAssembly module:\", error);\n                this.addOutput(\"Failed to load WebAssembly module. Using fallback mode.\");\n            }\n        });\n    }\n    executeWasmCommand(args) {\n        if (!this.wasmInstance) {\n            this.addOutput(\"WebAssembly module not loaded.\");\n            return;\n        }\n        const funcName = args[0];\n        if (!funcName) {\n            this.addOutput(\"Usage: wasm [function] [args]\");\n            return;\n        }\n        const func = this.wasmInstance.exports[funcName];\n        if (typeof func !== \"function\") {\n            this.addOutput(`Function \"${funcName}\" not found in WebAssembly module.`);\n            return;\n        }\n        try {\n            // Parse arguments as numbers\n            const numArgs = args.slice(1).map((arg) => parseInt(arg, 10));\n            const result = func(...numArgs);\n            this.addOutput(`Result: ${result}`);\n        }\n        catch (error) {\n            console.error(\"Error executing WebAssembly function:\", error);\n            this.addOutput(`Error executing function: ${error}`);\n        }\n    }\n}\n// Initialize the terminal when the DOM is loaded\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n    const container = document.getElementById(\"terminal-container\");\n    if (container) {\n        new WasmTerminal(\"terminal-container\");\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WasmTerminal);\n\n\n//# sourceURL=webpack://htmx-mfe/./static/ts/wasm-terminal.ts?");

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
/******/ 	__webpack_modules__["./static/ts/wasm-terminal.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
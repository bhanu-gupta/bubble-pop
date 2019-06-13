/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/board.js":
/*!*************************!*\
  !*** ./src/js/board.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _bubble__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bubble */ \"./src/js/bubble.js\");\n\n\n\nclass Board {\n    constructor(game, ctx) {\n        this.bubbles = [];\n        this.bubbleShooter = null;\n        this.nextShooterBubble = null;\n        this.monkeys = [];\n        this.ctx = ctx;\n        this.game = game;\n        this.caughtBananas = 0;\n        this.DIM_X = 210;\n        this.DIM_Y = 150;\n        this.leftOffset = 20;\n        this.topOffset = 70;\n        this.rows = 5;\n        this.columns = 11;\n        this.bubbleDiameter = 40;\n        this.colors = ['red', 'orange', 'yellow', 'green', 'seagreen', 'blue', 'purple', 'pink'];\n        this.bubbleShooterX = 235;\n        this.bubbleShooterY = 570;\n        this.nextShooterX = 110;\n        this.nextShooterY = 580;\n        this.populate();\n    }\n\n    populate() {\n        let y = this.topOffset;\n        let shift = false;\n        for (let i=0; i < this.rows; i++) {\n            let x = this.leftOffset;\n            if(shift) {\n                x = x + (this.bubbleDiameter/2);\n            }\n            for(let j=0; j < this.columns; j++) {\n                this.bubbles.push(new _bubble__WEBPACK_IMPORTED_MODULE_0__[\"default\"]('bubble', x , y))\n                x = x + (this.bubbleDiameter);\n            }\n            shift = !shift;\n            y = y + (this.bubbleDiameter);\n        }\n        this.image = new Image();\n        this.image.src = \"assets/images/bubbles.png\";\n        this.image.sprites = {};\n        this.getBubblesFromImage();\n    }\n\n    getBubblesFromImage() {\n        const board = this;\n        this.image.onload = () => {\n            for (let i = 0; i < 8; i++) {\n                board.image.sprites[board.colors[i]] = ({ x: i * 42, y: 0, w: 40, h: 40});\n            }\n            board.drawBubbles();\n            board.drawBubbleShooter();\n            board.game.ready = true;\n        }\n    }\n\n    drawBubbles() {\n        const board = this;\n        board.bubbles.forEach((bubble) => {\n            bubble.draw(board.ctx, board.image);\n        });\n        this.placeRandomBananas();\n    }\n\n    drawBubbleShooter() {\n        if (!this.bubbleShooter) {\n            if (this.nextShooterBubble) {\n                this.bubbleShooter = this.nextShooterBubble;\n                this.bubbleShooter.x = this.bubbleShooterX;\n                this.bubbleShooter.y = this.bubbleShooterY;\n            } else {\n                this.bubbleShooter = new _bubble__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\n                                            'shooter', \n                                            this.bubbleShooterX, \n                                            this.bubbleShooterY, \n                                            this.selectRandomBubble(this.rows - 1, this.rows - 1).color);\n            }\n            this.nextShooterBubble = new _bubble__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\n                'shooter',\n                this.nextShooterX,\n                this.nextShooterY,\n                this.selectRandomBubble(this.rows - 1, this.rows - 1).color);\n            this.nextShooterBubble.draw(this.ctx, this.image);\n        }\n        this.bubbleShooter.draw(this.ctx, this.image);\n    }\n\n    render() {\n    }\n\n    checkCollision() {\n        const shooterX = this.bubbleShooter.x;\n        const shooterY = this.bubbleShooter.y;\n        for (let i=0; i < this.bubbles.length; i++) {\n            const bubble = this.bubbles[i];\n            if (bubble.removed === false) {\n                if (shooterX > bubble.x\n                    && shooterX < bubble.x + this.bubbleDiameter \n                    && shooterY > bubble.y\n                    && shooterY < bubble.y + this.bubbleDiameter ) {\n                        return true;\n                }\n            }\n        }\n        return false;\n    }\n\n    getAdjacentBubbles(bubbleX, bubbleY, color) {\n        const checkLeftX = bubbleX - (this.bubbleDiameter/2);\n        const checkRightX = bubbleX + (this.bubbleDiameter / 2) + 1;\n        const checkLeftY = bubbleY - 1;\n        const checkRightY = bubbleY + (this.bubbleDiameter / 2) + 1;\n        for (let i = 0; i < this.bubbles.length; i++) {\n            const bubble = this.bubbles[i];\n            if (color === bubble.color && bubble.removed === false) {\n                if (checkLeftX > bubble.x\n                    && checkLeftX < bubble.x + this.bubbleDiameter \n                    && chec > bubble.y\n                    && shooterY < bubble.y + this.bubbleDiameter ) {\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n\n    removeLooseBubbles() {\n\n    }\n\n    selectRandomBubble(rowStart, rowEnd) {\n        const sampleData = this.bubbles.slice((rowStart-1)*this.columns, rowEnd*this.columns);\n        return sampleData[Math.floor(Math.random() * sampleData.length)];\n    }\n\n    placeRandomBananas() {\n        for (let i = 0; i < this.game.bananaTarget; i++) {\n            const allocatedBubble = this.selectRandomBubble(2, this.rows-1);\n            allocatedBubble.drawBanana(this.ctx);\n        }\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Board);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvYm9hcmQuanM/MzkwZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQThCOzs7QUFHOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsZUFBZTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixrQkFBa0I7QUFDMUMsc0NBQXNDLCtDQUFNO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDLHlEQUF5RCwrQkFBK0I7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLHlDQUF5QywrQ0FBTTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLCtDQUFNO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIseUJBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHlCQUF5QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsNEJBQTRCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsb0VBQUsiLCJmaWxlIjoiLi9zcmMvanMvYm9hcmQuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnViYmxlIGZyb20gJy4vYnViYmxlJztcblxuXG5jbGFzcyBCb2FyZCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgY3R4KSB7XG4gICAgICAgIHRoaXMuYnViYmxlcyA9IFtdO1xuICAgICAgICB0aGlzLmJ1YmJsZVNob290ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLm5leHRTaG9vdGVyQnViYmxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5tb25rZXlzID0gW107XG4gICAgICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmNhdWdodEJhbmFuYXMgPSAwO1xuICAgICAgICB0aGlzLkRJTV9YID0gMjEwO1xuICAgICAgICB0aGlzLkRJTV9ZID0gMTUwO1xuICAgICAgICB0aGlzLmxlZnRPZmZzZXQgPSAyMDtcbiAgICAgICAgdGhpcy50b3BPZmZzZXQgPSA3MDtcbiAgICAgICAgdGhpcy5yb3dzID0gNTtcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gMTE7XG4gICAgICAgIHRoaXMuYnViYmxlRGlhbWV0ZXIgPSA0MDtcbiAgICAgICAgdGhpcy5jb2xvcnMgPSBbJ3JlZCcsICdvcmFuZ2UnLCAneWVsbG93JywgJ2dyZWVuJywgJ3NlYWdyZWVuJywgJ2JsdWUnLCAncHVycGxlJywgJ3BpbmsnXTtcbiAgICAgICAgdGhpcy5idWJibGVTaG9vdGVyWCA9IDIzNTtcbiAgICAgICAgdGhpcy5idWJibGVTaG9vdGVyWSA9IDU3MDtcbiAgICAgICAgdGhpcy5uZXh0U2hvb3RlclggPSAxMTA7XG4gICAgICAgIHRoaXMubmV4dFNob290ZXJZID0gNTgwO1xuICAgICAgICB0aGlzLnBvcHVsYXRlKCk7XG4gICAgfVxuXG4gICAgcG9wdWxhdGUoKSB7XG4gICAgICAgIGxldCB5ID0gdGhpcy50b3BPZmZzZXQ7XG4gICAgICAgIGxldCBzaGlmdCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgICAgICAgbGV0IHggPSB0aGlzLmxlZnRPZmZzZXQ7XG4gICAgICAgICAgICBpZihzaGlmdCkge1xuICAgICAgICAgICAgICAgIHggPSB4ICsgKHRoaXMuYnViYmxlRGlhbWV0ZXIvMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWJibGVzLnB1c2gobmV3IEJ1YmJsZSgnYnViYmxlJywgeCAsIHkpKVxuICAgICAgICAgICAgICAgIHggPSB4ICsgKHRoaXMuYnViYmxlRGlhbWV0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hpZnQgPSAhc2hpZnQ7XG4gICAgICAgICAgICB5ID0geSArICh0aGlzLmJ1YmJsZURpYW1ldGVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHRoaXMuaW1hZ2Uuc3JjID0gXCJhc3NldHMvaW1hZ2VzL2J1YmJsZXMucG5nXCI7XG4gICAgICAgIHRoaXMuaW1hZ2Uuc3ByaXRlcyA9IHt9O1xuICAgICAgICB0aGlzLmdldEJ1YmJsZXNGcm9tSW1hZ2UoKTtcbiAgICB9XG5cbiAgICBnZXRCdWJibGVzRnJvbUltYWdlKCkge1xuICAgICAgICBjb25zdCBib2FyZCA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgICAgICAgICAgICBib2FyZC5pbWFnZS5zcHJpdGVzW2JvYXJkLmNvbG9yc1tpXV0gPSAoeyB4OiBpICogNDIsIHk6IDAsIHc6IDQwLCBoOiA0MH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm9hcmQuZHJhd0J1YmJsZXMoKTtcbiAgICAgICAgICAgIGJvYXJkLmRyYXdCdWJibGVTaG9vdGVyKCk7XG4gICAgICAgICAgICBib2FyZC5nYW1lLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyYXdCdWJibGVzKCkge1xuICAgICAgICBjb25zdCBib2FyZCA9IHRoaXM7XG4gICAgICAgIGJvYXJkLmJ1YmJsZXMuZm9yRWFjaCgoYnViYmxlKSA9PiB7XG4gICAgICAgICAgICBidWJibGUuZHJhdyhib2FyZC5jdHgsIGJvYXJkLmltYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGxhY2VSYW5kb21CYW5hbmFzKCk7XG4gICAgfVxuXG4gICAgZHJhd0J1YmJsZVNob290ZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5idWJibGVTaG9vdGVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5uZXh0U2hvb3RlckJ1YmJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYnViYmxlU2hvb3RlciA9IHRoaXMubmV4dFNob290ZXJCdWJibGU7XG4gICAgICAgICAgICAgICAgdGhpcy5idWJibGVTaG9vdGVyLnggPSB0aGlzLmJ1YmJsZVNob290ZXJYO1xuICAgICAgICAgICAgICAgIHRoaXMuYnViYmxlU2hvb3Rlci55ID0gdGhpcy5idWJibGVTaG9vdGVyWTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWJibGVTaG9vdGVyID0gbmV3IEJ1YmJsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Nob290ZXInLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWJibGVTaG9vdGVyWCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnViYmxlU2hvb3RlclksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFJhbmRvbUJ1YmJsZSh0aGlzLnJvd3MgLSAxLCB0aGlzLnJvd3MgLSAxKS5jb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5leHRTaG9vdGVyQnViYmxlID0gbmV3IEJ1YmJsZShcbiAgICAgICAgICAgICAgICAnc2hvb3RlcicsXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0U2hvb3RlclgsXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0U2hvb3RlclksXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RSYW5kb21CdWJibGUodGhpcy5yb3dzIC0gMSwgdGhpcy5yb3dzIC0gMSkuY29sb3IpO1xuICAgICAgICAgICAgdGhpcy5uZXh0U2hvb3RlckJ1YmJsZS5kcmF3KHRoaXMuY3R4LCB0aGlzLmltYWdlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1YmJsZVNob290ZXIuZHJhdyh0aGlzLmN0eCwgdGhpcy5pbWFnZSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgIH1cblxuICAgIGNoZWNrQ29sbGlzaW9uKCkge1xuICAgICAgICBjb25zdCBzaG9vdGVyWCA9IHRoaXMuYnViYmxlU2hvb3Rlci54O1xuICAgICAgICBjb25zdCBzaG9vdGVyWSA9IHRoaXMuYnViYmxlU2hvb3Rlci55O1xuICAgICAgICBmb3IgKGxldCBpPTA7IGkgPCB0aGlzLmJ1YmJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1YmJsZSA9IHRoaXMuYnViYmxlc1tpXTtcbiAgICAgICAgICAgIGlmIChidWJibGUucmVtb3ZlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2hvb3RlclggPiBidWJibGUueFxuICAgICAgICAgICAgICAgICAgICAmJiBzaG9vdGVyWCA8IGJ1YmJsZS54ICsgdGhpcy5idWJibGVEaWFtZXRlciBcbiAgICAgICAgICAgICAgICAgICAgJiYgc2hvb3RlclkgPiBidWJibGUueVxuICAgICAgICAgICAgICAgICAgICAmJiBzaG9vdGVyWSA8IGJ1YmJsZS55ICsgdGhpcy5idWJibGVEaWFtZXRlciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0QWRqYWNlbnRCdWJibGVzKGJ1YmJsZVgsIGJ1YmJsZVksIGNvbG9yKSB7XG4gICAgICAgIGNvbnN0IGNoZWNrTGVmdFggPSBidWJibGVYIC0gKHRoaXMuYnViYmxlRGlhbWV0ZXIvMik7XG4gICAgICAgIGNvbnN0IGNoZWNrUmlnaHRYID0gYnViYmxlWCArICh0aGlzLmJ1YmJsZURpYW1ldGVyIC8gMikgKyAxO1xuICAgICAgICBjb25zdCBjaGVja0xlZnRZID0gYnViYmxlWSAtIDE7XG4gICAgICAgIGNvbnN0IGNoZWNrUmlnaHRZID0gYnViYmxlWSArICh0aGlzLmJ1YmJsZURpYW1ldGVyIC8gMikgKyAxO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnViYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYnViYmxlID0gdGhpcy5idWJibGVzW2ldO1xuICAgICAgICAgICAgaWYgKGNvbG9yID09PSBidWJibGUuY29sb3IgJiYgYnViYmxlLnJlbW92ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrTGVmdFggPiBidWJibGUueFxuICAgICAgICAgICAgICAgICAgICAmJiBjaGVja0xlZnRYIDwgYnViYmxlLnggKyB0aGlzLmJ1YmJsZURpYW1ldGVyIFxuICAgICAgICAgICAgICAgICAgICAmJiBjaGVjID4gYnViYmxlLnlcbiAgICAgICAgICAgICAgICAgICAgJiYgc2hvb3RlclkgPCBidWJibGUueSArIHRoaXMuYnViYmxlRGlhbWV0ZXIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVtb3ZlTG9vc2VCdWJibGVzKCkge1xuXG4gICAgfVxuXG4gICAgc2VsZWN0UmFuZG9tQnViYmxlKHJvd1N0YXJ0LCByb3dFbmQpIHtcbiAgICAgICAgY29uc3Qgc2FtcGxlRGF0YSA9IHRoaXMuYnViYmxlcy5zbGljZSgocm93U3RhcnQtMSkqdGhpcy5jb2x1bW5zLCByb3dFbmQqdGhpcy5jb2x1bW5zKTtcbiAgICAgICAgcmV0dXJuIHNhbXBsZURhdGFbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2FtcGxlRGF0YS5sZW5ndGgpXTtcbiAgICB9XG5cbiAgICBwbGFjZVJhbmRvbUJhbmFuYXMoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLmJhbmFuYVRhcmdldDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhbGxvY2F0ZWRCdWJibGUgPSB0aGlzLnNlbGVjdFJhbmRvbUJ1YmJsZSgyLCB0aGlzLnJvd3MtMSk7XG4gICAgICAgICAgICBhbGxvY2F0ZWRCdWJibGUuZHJhd0JhbmFuYSh0aGlzLmN0eCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/js/board.js\n");

/***/ }),

/***/ "./src/js/bubble.js":
/*!**************************!*\
  !*** ./src/js/bubble.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar level1Colors = [\n    'red',\n    'green',\n    'yellow'\n];\n\nvar level2Colors = [\n    '#FFBC00',\n    '#DD4E00',\n    '#00BD00',\n    '#1dd186'\n];\n\nvar level3Colors = [\n    '#FFBC00',\n    '#DD4E00',\n    '#00BD00',\n    '#1dd186',\n    '#616a77'\n];\n\nclass Bubble {\n\n    //type = shooter, bubble, monkey\n    constructor(type, x, y, color) {\n        this.removed = false;\n        this.type = type;\n        this.color = color || this.getRandomColour();\n        this.x = x;\n        this.y = y;\n        this.diameter = 40;\n    }\n\n    draw(ctx, bubbleSprite) {\n        ctx.beginPath();\n        const spr = bubbleSprite.sprites[this.color];\n        const w = spr.w;\n        const h = spr.h;\n        ctx.drawImage(bubbleSprite, spr.x, spr.y, w, h, this.x, this.y, w, h);\n        ctx.closePath();\n    }\n\n    clearBubble() {\n        this.removed = true;\n    }\n\n    getRandomColour() {\n        return level1Colors[Math.floor(Math.random() * level1Colors.length)];\n    }\n\n    clearArc(ctx) {\n        ctx.save();\n        ctx.beginPath();\n        ctx.globalCompositeOperation = 'destination-out';\n        ctx.clearRect(this.x, this.y, this.diameter, this.diameter);\n        ctx.fill();\n        ctx.restore();\n    }\n\n    drawBanana(ctx) {\n        var bananaImg = document.createElement('img');\n        this.type= 'bananaImg';\n        bananaImg.src = 'assets/images/banana.png';\n        bananaImg.onload = () => {\n            this.clearArc(ctx);\n            const radius = (this.diameter/2)-1;\n            ctx.arc(this.x + radius + 2, this.y + radius + 2, radius, 0, Math.PI * 2, true);\n            ctx.fillStyle = \"#70D434\";\n            ctx.fill();\n            ctx.drawImage(bananaImg, 0, 0, bananaImg.width, bananaImg.height, this.x + 5, this.y+5, 27, 27);\n        };\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Bubble);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvYnViYmxlLmpzP2QwN2QiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSxxRUFBTSxFQUFDIiwiZmlsZSI6Ii4vc3JjL2pzL2J1YmJsZS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBsZXZlbDFDb2xvcnMgPSBbXG4gICAgJ3JlZCcsXG4gICAgJ2dyZWVuJyxcbiAgICAneWVsbG93J1xuXTtcblxudmFyIGxldmVsMkNvbG9ycyA9IFtcbiAgICAnI0ZGQkMwMCcsXG4gICAgJyNERDRFMDAnLFxuICAgICcjMDBCRDAwJyxcbiAgICAnIzFkZDE4Nidcbl07XG5cbnZhciBsZXZlbDNDb2xvcnMgPSBbXG4gICAgJyNGRkJDMDAnLFxuICAgICcjREQ0RTAwJyxcbiAgICAnIzAwQkQwMCcsXG4gICAgJyMxZGQxODYnLFxuICAgICcjNjE2YTc3J1xuXTtcblxuY2xhc3MgQnViYmxlIHtcblxuICAgIC8vdHlwZSA9IHNob290ZXIsIGJ1YmJsZSwgbW9ua2V5XG4gICAgY29uc3RydWN0b3IodHlwZSwgeCwgeSwgY29sb3IpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciB8fCB0aGlzLmdldFJhbmRvbUNvbG91cigpO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLmRpYW1ldGVyID0gNDA7XG4gICAgfVxuXG4gICAgZHJhdyhjdHgsIGJ1YmJsZVNwcml0ZSkge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnN0IHNwciA9IGJ1YmJsZVNwcml0ZS5zcHJpdGVzW3RoaXMuY29sb3JdO1xuICAgICAgICBjb25zdCB3ID0gc3ByLnc7XG4gICAgICAgIGNvbnN0IGggPSBzcHIuaDtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShidWJibGVTcHJpdGUsIHNwci54LCBzcHIueSwgdywgaCwgdGhpcy54LCB0aGlzLnksIHcsIGgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgfVxuXG4gICAgY2xlYXJCdWJibGUoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tQ29sb3VyKCkge1xuICAgICAgICByZXR1cm4gbGV2ZWwxQ29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxldmVsMUNvbG9ycy5sZW5ndGgpXTtcbiAgICB9XG5cbiAgICBjbGVhckFyYyhjdHgpIHtcbiAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW91dCc7XG4gICAgICAgIGN0eC5jbGVhclJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMuZGlhbWV0ZXIsIHRoaXMuZGlhbWV0ZXIpO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIGRyYXdCYW5hbmEoY3R4KSB7XG4gICAgICAgIHZhciBiYW5hbmFJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgdGhpcy50eXBlPSAnYmFuYW5hSW1nJztcbiAgICAgICAgYmFuYW5hSW1nLnNyYyA9ICdhc3NldHMvaW1hZ2VzL2JhbmFuYS5wbmcnO1xuICAgICAgICBiYW5hbmFJbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGVhckFyYyhjdHgpO1xuICAgICAgICAgICAgY29uc3QgcmFkaXVzID0gKHRoaXMuZGlhbWV0ZXIvMiktMTtcbiAgICAgICAgICAgIGN0eC5hcmModGhpcy54ICsgcmFkaXVzICsgMiwgdGhpcy55ICsgcmFkaXVzICsgMiwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCIjNzBENDM0XCI7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShiYW5hbmFJbWcsIDAsIDAsIGJhbmFuYUltZy53aWR0aCwgYmFuYW5hSW1nLmhlaWdodCwgdGhpcy54ICsgNSwgdGhpcy55KzUsIDI3LCAyNyk7XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdWJibGU7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/js/bubble.js\n");

/***/ }),

/***/ "./src/js/game.js":
/*!************************!*\
  !*** ./src/js/game.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ \"./src/js/board.js\");\n\n\nclass Game {\n    constructor(ctx, canvas) {\n        this.board = new _board__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this,ctx);\n        this.canvas = canvas;\n        this.score = 0;\n        this.level = 1;\n        this.bananaTarget = 5;\n        this.playAngle = null;\n        this.ready = false;\n        this.currentMoveCount = 0;\n        this.movesAllowed = 20;\n        this.onMouseMove = this.onMouseMove.bind(this);\n        this.onMouseDown = this.onMouseDown.bind(this);\n        this.shooterMoving = false;\n    }\n\n    play() {\n        this.makeMove();\n    }\n\n    won() {\n        if (this.board.caughtBananas === this.bananaTarget) {\n            return true;\n        }\n        return false;\n    }\n\n    gameOver() {\n        if (this.board.currentMoveCount > this.movesAllowed) {\n            return true;\n        }\n        return false;\n    }\n\n    makeMove() {\n\n        const rads = this.degToRad(this.playAngle);\n        const speed = 500;\n        let dx = Math.cos(rads) * speed / 60;\n        let dy = Math.sin(rads) * speed / 60;\n\n        var interval = setInterval(() => {\n            if (this.board.bubbleShooter.x + dx <= 0) {\n                this.playAngle = 180 - this.playAngle;\n                dx = -dx;\n            } else if (this.board.bubbleShooter.x + dx + this.board.bubbleDiameter >= this.canvas.width) {\n                this.playAngle = 180 - this.playAngle;\n                dx = -dx;\n            }\n\n            if (this.board.checkCollision()) {\n                this.board.bubbles.push(this.board.bubbleShooter);\n                this.board.bubbleShooter = null;\n                this.shooterMoving = false;\n                clearInterval(interval);\n            } else {\n                this.board.bubbleShooter.clearArc(this.board.ctx);\n                this.board.bubbleShooter.x = this.board.bubbleShooter.x + dx;\n                this.board.bubbleShooter.y = this.board.bubbleShooter.y - dy;\n            }\n            this.board.drawBubbleShooter();\n\n        }, 1000 / 60);\n    }\n\n    start() {\n        this.board.render();\n    }\n\n    radToDeg(angle) {\n        return angle * (180 / Math.PI);\n    }\n\n    degToRad(angle) {\n        return angle * (Math.PI / 180);\n    }\n\n    onMouseMove(e) {\n        if (this.shooterMoving === false) {\n            const pos = this.getMousePos(this.canvas, e);\n            let mouseangle = this.radToDeg(\n                Math.atan2(\n                    (this.board.bubbleShooterY + this.board.bubbleDiameter) - pos.y, \n                    pos.x - (this.board.bubbleShooterX + this.board.bubbleDiameter)\n                )\n            );\n            if (mouseangle < 0) {\n                mouseangle = 180 + (180 + mouseangle);\n            }\n            const lbound = 8;\n            const ubound = 172;\n            if (mouseangle > 90 && mouseangle < 270) {\n                if (mouseangle > ubound) {\n                    mouseangle = ubound;\n                }\n            } else {\n                if (mouseangle < lbound || mouseangle >= 270) {\n                    mouseangle = lbound;\n                }\n            }\n            this.playAngle = mouseangle;\n        }\n    }\n\n    onMouseDown(e) {\n        if (this.shooterMoving ===  false) {\n            if(this.gameOver) {\n                this.loadNewGame();\n            }\n            if (this.ready) { \n                this.shooterMoving = true;\n                this.play();\n                this.currentMoveCount += 1;\n            }\n        }\n    }\n\n    getMousePos(canvas, e) {\n        var rect = canvas.getBoundingClientRect();\n        return {\n            x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width),\n            y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)\n        };\n    }\n\n    loadNewGame() {\n\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Game);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvZ2FtZS5qcz8yMzJkIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBNEI7O0FBRTVCO0FBQ0E7QUFDQSx5QkFBeUIsOENBQUs7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFZSxtRUFBSSIsImZpbGUiOiIuL3NyYy9qcy9nYW1lLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJvYXJkIGZyb20gJy4vYm9hcmQnO1xuXG5jbGFzcyBHYW1lIHtcbiAgICBjb25zdHJ1Y3RvcihjdHgsIGNhbnZhcykge1xuICAgICAgICB0aGlzLmJvYXJkID0gbmV3IEJvYXJkKHRoaXMsY3R4KTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLmxldmVsID0gMTtcbiAgICAgICAgdGhpcy5iYW5hbmFUYXJnZXQgPSA1O1xuICAgICAgICB0aGlzLnBsYXlBbmdsZSA9IG51bGw7XG4gICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50TW92ZUNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5tb3Zlc0FsbG93ZWQgPSAyMDtcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZSA9IHRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93biA9IHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zaG9vdGVyTW92aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5tYWtlTW92ZSgpO1xuICAgIH1cblxuICAgIHdvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQuY2F1Z2h0QmFuYW5hcyA9PT0gdGhpcy5iYW5hbmFUYXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnYW1lT3ZlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQuY3VycmVudE1vdmVDb3VudCA+IHRoaXMubW92ZXNBbGxvd2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbWFrZU1vdmUoKSB7XG5cbiAgICAgICAgY29uc3QgcmFkcyA9IHRoaXMuZGVnVG9SYWQodGhpcy5wbGF5QW5nbGUpO1xuICAgICAgICBjb25zdCBzcGVlZCA9IDUwMDtcbiAgICAgICAgbGV0IGR4ID0gTWF0aC5jb3MocmFkcykgKiBzcGVlZCAvIDYwO1xuICAgICAgICBsZXQgZHkgPSBNYXRoLnNpbihyYWRzKSAqIHNwZWVkIC8gNjA7XG5cbiAgICAgICAgdmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmQuYnViYmxlU2hvb3Rlci54ICsgZHggPD0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheUFuZ2xlID0gMTgwIC0gdGhpcy5wbGF5QW5nbGU7XG4gICAgICAgICAgICAgICAgZHggPSAtZHg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9hcmQuYnViYmxlU2hvb3Rlci54ICsgZHggKyB0aGlzLmJvYXJkLmJ1YmJsZURpYW1ldGVyID49IHRoaXMuY2FudmFzLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QW5nbGUgPSAxODAgLSB0aGlzLnBsYXlBbmdsZTtcbiAgICAgICAgICAgICAgICBkeCA9IC1keDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmQuY2hlY2tDb2xsaXNpb24oKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuYnViYmxlcy5wdXNoKHRoaXMuYm9hcmQuYnViYmxlU2hvb3Rlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5idWJibGVTaG9vdGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnNob290ZXJNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5idWJibGVTaG9vdGVyLmNsZWFyQXJjKHRoaXMuYm9hcmQuY3R4KTtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmJ1YmJsZVNob290ZXIueCA9IHRoaXMuYm9hcmQuYnViYmxlU2hvb3Rlci54ICsgZHg7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5idWJibGVTaG9vdGVyLnkgPSB0aGlzLmJvYXJkLmJ1YmJsZVNob290ZXIueSAtIGR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ib2FyZC5kcmF3QnViYmxlU2hvb3RlcigpO1xuXG4gICAgICAgIH0sIDEwMDAgLyA2MCk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuYm9hcmQucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgcmFkVG9EZWcoYW5nbGUpIHtcbiAgICAgICAgcmV0dXJuIGFuZ2xlICogKDE4MCAvIE1hdGguUEkpO1xuICAgIH1cblxuICAgIGRlZ1RvUmFkKGFuZ2xlKSB7XG4gICAgICAgIHJldHVybiBhbmdsZSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICB9XG5cbiAgICBvbk1vdXNlTW92ZShlKSB7XG4gICAgICAgIGlmICh0aGlzLnNob290ZXJNb3ZpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLmdldE1vdXNlUG9zKHRoaXMuY2FudmFzLCBlKTtcbiAgICAgICAgICAgIGxldCBtb3VzZWFuZ2xlID0gdGhpcy5yYWRUb0RlZyhcbiAgICAgICAgICAgICAgICBNYXRoLmF0YW4yKFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5ib2FyZC5idWJibGVTaG9vdGVyWSArIHRoaXMuYm9hcmQuYnViYmxlRGlhbWV0ZXIpIC0gcG9zLnksIFxuICAgICAgICAgICAgICAgICAgICBwb3MueCAtICh0aGlzLmJvYXJkLmJ1YmJsZVNob290ZXJYICsgdGhpcy5ib2FyZC5idWJibGVEaWFtZXRlcilcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKG1vdXNlYW5nbGUgPCAwKSB7XG4gICAgICAgICAgICAgICAgbW91c2VhbmdsZSA9IDE4MCArICgxODAgKyBtb3VzZWFuZ2xlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxib3VuZCA9IDg7XG4gICAgICAgICAgICBjb25zdCB1Ym91bmQgPSAxNzI7XG4gICAgICAgICAgICBpZiAobW91c2VhbmdsZSA+IDkwICYmIG1vdXNlYW5nbGUgPCAyNzApIHtcbiAgICAgICAgICAgICAgICBpZiAobW91c2VhbmdsZSA+IHVib3VuZCkge1xuICAgICAgICAgICAgICAgICAgICBtb3VzZWFuZ2xlID0gdWJvdW5kO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlYW5nbGUgPCBsYm91bmQgfHwgbW91c2VhbmdsZSA+PSAyNzApIHtcbiAgICAgICAgICAgICAgICAgICAgbW91c2VhbmdsZSA9IGxib3VuZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBsYXlBbmdsZSA9IG1vdXNlYW5nbGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlRG93bihlKSB7XG4gICAgICAgIGlmICh0aGlzLnNob290ZXJNb3ZpbmcgPT09ICBmYWxzZSkge1xuICAgICAgICAgICAgaWYodGhpcy5nYW1lT3Zlcikge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZE5ld0dhbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5KSB7IFxuICAgICAgICAgICAgICAgIHRoaXMuc2hvb3Rlck1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW92ZUNvdW50ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRNb3VzZVBvcyhjYW52YXMsIGUpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBNYXRoLnJvdW5kKChlLmNsaWVudFggLSByZWN0LmxlZnQpIC8gKHJlY3QucmlnaHQgLSByZWN0LmxlZnQpICogY2FudmFzLndpZHRoKSxcbiAgICAgICAgICAgIHk6IE1hdGgucm91bmQoKGUuY2xpZW50WSAtIHJlY3QudG9wKSAvIChyZWN0LmJvdHRvbSAtIHJlY3QudG9wKSAqIGNhbnZhcy5oZWlnaHQpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbG9hZE5ld0dhbWUoKSB7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/js/game.js\n");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/game */ \"./src/js/game.js\");\n/* harmony import */ var _js_board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/board */ \"./src/js/board.js\");\n\n\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n    var canvas = document.getElementById(\"bubble-shooter-game\");\n\n    const ctx = canvas.getContext(\"2d\");\n\n    const game = new _js_game__WEBPACK_IMPORTED_MODULE_0__[\"default\"](ctx, canvas);\n    game.start();\n    canvas.addEventListener(\"mousemove\", game.onMouseMove);\n    canvas.addEventListener(\"mousedown\", game.onMouseDown);\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5qcz81NmQ3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUE2QjtBQUNFOztBQUUvQjtBQUNBOztBQUVBOztBQUVBLHFCQUFxQixnREFBSTtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6Ii4vc3JjL21haW4uanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2FtZSBmcm9tICcuL2pzL2dhbWUnO1xuaW1wb3J0IEJvYXJkIGZyb20gJy4vanMvYm9hcmQnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNob290ZXItZ2FtZVwiKTtcblxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICBjb25zdCBnYW1lID0gbmV3IEdhbWUoY3R4LCBjYW52YXMpO1xuICAgIGdhbWUuc3RhcnQoKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBnYW1lLm9uTW91c2VNb3ZlKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBnYW1lLm9uTW91c2VEb3duKTtcbn0pOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main.js\n");

/***/ })

/******/ });
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installMouseHelper = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, page.evaluateOnNewDocument(function () {
                    if (window !== window.parent)
                        return;
                    window.addEventListener('DOMContentLoaded', function () {
                        var box = document.createElement('puppeteer-mouse-pointer');
                        var styleElement = document.createElement('style');
                        styleElement.innerHTML = "\n          puppeteer-mouse-pointer {\n            pointer-events: none;\n            position: absolute;\n            top: 0;\n            z-index: 10000;\n            left: 0;\n            width: 20px;\n            height: 20px;\n            background: rgba(0,0,0,.4);\n            border: 1px solid white;\n            border-radius: 10px;\n            margin: -10px 0 0 -10px;\n            padding: 0;\n            transition: background .2s, border-radius .2s, border-color .2s;\n          }\n          puppeteer-mouse-pointer.button-1 {\n            transition: none;\n            background: rgba(0,0,0,0.9);\n          }\n          puppeteer-mouse-pointer.button-2 {\n            transition: none;\n            border-color: rgba(0,0,255,0.9);\n          }\n          puppeteer-mouse-pointer.button-3 {\n            transition: none;\n            border-radius: 4px;\n          }\n          puppeteer-mouse-pointer.button-4 {\n            transition: none;\n            border-color: rgba(255,0,0,0.9);\n          }\n          puppeteer-mouse-pointer.button-5 {\n            transition: none;\n            border-color: rgba(0,255,0,0.9);\n          }\n        ";
                        document.head.appendChild(styleElement);
                        document.body.appendChild(box);
                        document.addEventListener('mousemove', function (event) {
                            box.style.left = event.pageX + 'px';
                            box.style.top = event.pageY + 'px';
                            updateButtons(event.buttons);
                        }, true);
                        document.addEventListener('mousedown', function (event) {
                            updateButtons(event.buttons);
                            box.classList.add('button-' + event.which);
                        }, true);
                        document.addEventListener('mouseup', function (event) {
                            updateButtons(event.buttons);
                            box.classList.remove('button-' + event.which);
                        }, true);
                        function updateButtons(buttons) {
                            for (var i = 0; i < 5; i++)
                                box.classList.toggle('button-' + i, buttons & (1 << i));
                        }
                    }, false);
                })];
            case 1: return [2, _a.sent()];
        }
    });
}); };

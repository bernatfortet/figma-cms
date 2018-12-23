"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var axios_1 = require("axios");
var PERSONAL_ACCESS_TOKEN = '3429-bf1d6755-7de1-446b-aace-4d1b00d1a775';
var FILE_KEY = 'EuXW2OoSnNpWqU9ULu1sOYhN';
function fetchFigma(endpoint) {
    var options = {
        method: 'GET',
        headers: { "x-figma-token": PERSONAL_ACCESS_TOKEN },
        url: "https://api.figma.com/v1/" + endpoint,
    };
    return axios_1.default(options)
        .then(function (response) {
        return response.data;
    })
        .catch(function (error) { return ({ err: error }); });
}
function fetchFile(fileKey) {
    return __awaiter(this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchFigma("files/" + fileKey)];
                case 1:
                    file = _a.sent();
                    if (!file || !file.document)
                        throw ('File not found');
                    return [2 /*return*/, file.document];
            }
        });
    });
}
exports.fetchFile = fetchFile;
function getFigmaCanvas(file, canvasName) {
    var canvas = file.children.filter(function (el) { return el.type == 'CANVAS' && el.name == canvasName; })[0];
    return canvas;
}
exports.getFigmaCanvas = getFigmaCanvas;
function getFrameFromCanvas(canvas, frameName) {
    var frame = canvas.children.filter(function (el) { return el.type == 'FRAME' && el.name == frameName; })[0];
    return frame;
}
exports.getFrameFromCanvas = getFrameFromCanvas;
function fetchImages(imageIds) {
    return __awaiter(this, void 0, void 0, function () {
        var parsedImageIds, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parsedImageIds = imageIds.join(',');
                    return [4 /*yield*/, fetchFigma("images/" + FILE_KEY + "?ids=" + parsedImageIds)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.images];
            }
        });
    });
}
exports.fetchImages = fetchImages;
function fetchFileImages(fileKey) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchFigma("files/" + fileKey + "/images")];
                case 1:
                    result = _a.sent();
                    if (result.error)
                        throw ('File not found');
                    if (!result.meta || !result.meta.images)
                        throw ('No Images found');
                    return [2 /*return*/, result.meta.images];
            }
        });
    });
}
exports.fetchFileImages = fetchFileImages;
function parseValueProps(website) {
    var valuePropsRoot = website.children.find(function (i) { return i.name == 'ValueProps'; });
    var valuePropsSorted = valuePropsRoot.children.sort(sortedByName);
    var valuePropsText = valuePropsSorted.map(function (i) { return ({
        title: i.children.find(function (i) { return i.name == 'title'; }).characters,
        text: i.children.find(function (i) { return i.name == 'text'; }).characters,
    }); });
    return valuePropsText;
}
exports.parseValueProps = parseValueProps;
function parseBannerTitle(website) {
    var banner = website.children.find(function (i) { return i.name == 'Banner'; });
    return banner.children.find(function (i) { return i.name == 'title'; }).characters;
}
exports.parseBannerTitle = parseBannerTitle;
var sortedByName = function (a, b) { return a.name > b.name; };

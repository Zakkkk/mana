"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const loadLayout = (gs, layoutName) => {
    for (let i = 0; i < gs.loadedLayouts.length; i++) {
        if (gs.loadedLayouts[i].name == layoutName) {
            return i;
        }
    }
    let data;
    try {
        data = JSON.parse(fs.readFileSync(`layouts/${layoutName}.json`, "utf8"));
        if (data.name != undefined &&
            data.rows != undefined &&
            data.fingermap != undefined &&
            data.hasMagic != undefined) {
            if (!data.hasMagic) {
                gs.loadedLayouts.push(data);
                return gs.loadedLayouts.length - 1;
            }
            if (data.magicIdentifier != undefined && data.magicRules != undefined) {
                const magicRules = [];
                data.magicRules.forEach((magicRule) => {
                    magicRules.push({
                        activator: magicRule[0],
                        transformTo: magicRule[1],
                    });
                });
                data.magicRules = magicRules;
                gs.loadedLayouts.push(data);
                return gs.loadedLayouts.length - 1;
            }
        }
        else {
            console.log("The layout could not be loaded because it is missing inforamtion.");
        }
    }
    catch (err) {
        console.error("There was a problem loading this layout.");
        return -1;
    }
    return -1;
};
exports.default = loadLayout;

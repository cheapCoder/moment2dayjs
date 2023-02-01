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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const dayjs_1 = __importDefault(require("dayjs"));
const mo = require('moment');
const b = (0, moment_1.default)();
b.seconds();
moment_1.default.duration();
// -------------------
// Moment.js
(0, moment_1.default)().add(7, 'days').add(1, 'months');
(0, moment_1.default)().seconds();
// => 49
(0, moment_1.default)().hours();
// => 19
// Native
new Date().getSeconds();
// => 49
new Date().getHours();
// => 19
// dayjs
(0, dayjs_1.default)().second();
// => 49
(0, dayjs_1.default)().hour();
// => 19
// ------------------------------
(0, moment_1.default)().weekday(-7); // 上个星期一
(0, moment_1.default)().weekday(); // 上个星期一
// ------------------------------
// console.log(moment() as Moment);
console.log((0, moment_1.default)());
const a = (0, moment_1.default)('123');
console.log(b.unix());
const [m, setMoment] = (0, react_1.useState)((0, moment_1.default)());
/*对antd的Select进行封装，使得Select选择框的宽度自动跟随下拉菜单的宽度*/
const AutoWidthSelect = function (props) {
    const [m, setMoment] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        setMoment((0, moment_1.default)());
    }, []);
    return (<>
      <div>123123</div>
      <span>what</span>
      <h1>h11111</h1>

      {m === null || m === void 0 ? void 0 : m.date()}
    </>);
};
class Compone extends react_1.default.Component {
}
exports.default = AutoWidthSelect;

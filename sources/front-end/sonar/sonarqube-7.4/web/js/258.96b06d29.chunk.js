(window.webpackJsonp=window.webpackJsonp||[]).push([[258],{641:function(t,e,n){"use strict";n.d(e,"a",function(){return a});var o=n(565),r=n(568),i=n(573);function a(t){var e=t.className,n=t.fill,a=void 0===n?i.green:n,c=t.size;return o.createElement(r.a,{className:e,size:c},o.createElement("path",{d:"M12.607 6.554q0-0.25-0.161-0.411l-0.813-0.804q-0.17-0.17-0.402-0.17t-0.402 0.17l-3.643 3.634-2.018-2.018q-0.17-0.17-0.402-0.17t-0.402 0.17l-0.813 0.804q-0.161 0.161-0.161 0.411 0 0.241 0.161 0.402l3.232 3.232q0.17 0.17 0.402 0.17 0.241 0 0.411-0.17l4.848-4.848q0.161-0.161 0.161-0.402zM14.857 8q0 1.866-0.92 3.442t-2.496 2.496-3.442 0.92-3.442-0.92-2.496-2.496-0.92-3.442 0.92-3.442 2.496-2.496 3.442-0.92 3.442 0.92 2.496 2.496 0.92 3.442z",style:{fill:a}}))}},658:function(t,e,n){"use strict";n.d(e,"a",function(){return c});var o=n(565),r=n(566),i=n(750),a=(n(954)," \\\n  ");function c(t){var e=t.className,n=t.isOneLine,c=t.noCopy,s=t.snippet,u=Array.isArray(s)?s.filter(function(t){return void 0!==t}):[s],l=n?u.join(" "):u.join(a);return o.createElement("div",{className:r("code-snippet",{"code-snippet-oneline":n},e)},o.createElement("pre",null,l),!c&&o.createElement(i.a,{copyValue:l}))}},661:function(t,e,n){"use strict";n.d(e,"a",function(){return a});var o=n(565),r=n(568),i=n(573);function a(t){var e=t.className,n=t.fill,a=void 0===n?i.red:n,c=t.size;return o.createElement(r.a,{className:e,size:c},o.createElement("path",{d:"M11.402 10.018q0-0.232-0.17-0.402l-1.616-1.616 1.616-1.616q0.17-0.17 0.17-0.402 0-0.241-0.17-0.411l-0.804-0.804q-0.17-0.17-0.411-0.17-0.232 0-0.402 0.17l-1.616 1.616-1.616-1.616q-0.17-0.17-0.402-0.17-0.241 0-0.411 0.17l-0.804 0.804q-0.17 0.17-0.17 0.411 0 0.232 0.17 0.402l1.616 1.616-1.616 1.616q-0.17 0.17-0.17 0.402 0 0.241 0.17 0.411l0.804 0.804q0.17 0.17 0.411 0.17 0.232 0 0.402-0.17l1.616-1.616 1.616 1.616q0.17 0.17 0.402 0.17 0.241 0 0.411-0.17l0.804-0.804q0.17-0.17 0.17-0.411zM14.857 8q0 1.866-0.92 3.442t-2.496 2.496-3.442 0.92-3.442-0.92-2.496-2.496-0.92-3.442 0.92-3.442 2.496-2.496 3.442-0.92 3.442 0.92 2.496 2.496 0.92 3.442z",style:{fill:a}}))}},750:function(t,e,n){"use strict";var o,r=n(565),i=n(566),a=n(803),c=n(576),s=n(567),u=n(13),l=(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),f=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.mounted=!1,e.state={tooltipShown:!1},e.showTooltip=function(){e.mounted&&(e.setState({tooltipShown:!0}),setTimeout(function(){e.mounted&&e.setState({tooltipShown:!1})},1e3))},e}return l(e,t),e.prototype.componentDidMount=function(){this.mounted=!0,this.copyButton&&(this.clipboard=new a(this.copyButton),this.clipboard.on("success",this.showTooltip))},e.prototype.componentDidUpdate=function(){this.clipboard&&this.clipboard.destroy(),this.copyButton&&(this.clipboard=new a(this.copyButton),this.clipboard.on("success",this.showTooltip))},e.prototype.componentWillUnmount=function(){this.mounted=!1,this.clipboard&&this.clipboard.destroy()},e.prototype.render=function(){var t=this;return r.createElement(c.a,{overlay:Object(u.l)("copied_action"),visible:this.state.tooltipShown},r.createElement(s.a,{className:i("js-copy-to-clipboard no-select",this.props.className),"data-clipboard-text":this.props.copyValue,innerRef:function(e){return t.copyButton=e}},Object(u.l)("copy")))},e}(r.PureComponent);e.a=f},803:function(t,e,n){
/*!
 * clipboard.js v2.0.1
 * https://zenorocha.github.io/clipboard.js
 * 
 * Licensed MIT © Zeno Rocha
 */
var o;o=function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.i=function(t){return t},n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e,n){var o,r,i;r=[t,n(7)],void 0===(i="function"==typeof(o=function(t,e){"use strict";var n,o=(n=e)&&n.__esModule?n:{default:n},r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),a=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.resolveOptions(e),this.initSelection()}return i(t,[{key:"resolveOptions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action=t.action,this.container=t.container,this.emitter=t.emitter,this.target=t.target,this.text=t.text,this.trigger=t.trigger,this.selectedText=""}},{key:"initSelection",value:function(){this.text?this.selectFake():this.target&&this.selectTarget()}},{key:"selectFake",value:function(){var t=this,e="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return t.removeFake()},this.fakeHandler=this.container.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[e?"right":"left"]="-9999px";var n=window.pageYOffset||document.documentElement.scrollTop;this.fakeElem.style.top=n+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,this.container.appendChild(this.fakeElem),this.selectedText=(0,o.default)(this.fakeElem),this.copyText()}},{key:"removeFake",value:function(){this.fakeHandler&&(this.container.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(this.container.removeChild(this.fakeElem),this.fakeElem=null)}},{key:"selectTarget",value:function(){this.selectedText=(0,o.default)(this.target),this.copyText()}},{key:"copyText",value:function(){var t=void 0;try{t=document.execCommand(this.action)}catch(e){t=!1}this.handleResult(t)}},{key:"handleResult",value:function(t){this.emitter.emit(t?"success":"error",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}},{key:"clearSelection",value:function(){this.trigger&&this.trigger.focus(),window.getSelection().removeAllRanges()}},{key:"destroy",value:function(){this.removeFake()}},{key:"action",set:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"copy";if(this._action=t,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function(){return this._action}},{key:"target",set:function(t){if(void 0!==t){if(!t||"object"!==(void 0===t?"undefined":r(t))||1!==t.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&t.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(t.hasAttribute("readonly")||t.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=t}},get:function(){return this._target}}]),t}();t.exports=a})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o=n(6),r=n(5);t.exports=function(t,e,n){if(!t&&!e&&!n)throw new Error("Missing required arguments");if(!o.string(e))throw new TypeError("Second argument must be a String");if(!o.fn(n))throw new TypeError("Third argument must be a Function");if(o.node(t))return function(t,e,n){return t.addEventListener(e,n),{destroy:function(){t.removeEventListener(e,n)}}}(t,e,n);if(o.nodeList(t))return function(t,e,n){return Array.prototype.forEach.call(t,function(t){t.addEventListener(e,n)}),{destroy:function(){Array.prototype.forEach.call(t,function(t){t.removeEventListener(e,n)})}}}(t,e,n);if(o.string(t))return function(t,e,n){return r(document.body,t,e,n)}(t,e,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}},function(t,e){function n(){}n.prototype={on:function(t,e,n){var o=this.e||(this.e={});return(o[t]||(o[t]=[])).push({fn:e,ctx:n}),this},once:function(t,e,n){var o=this;function r(){o.off(t,r),e.apply(n,arguments)}return r._=e,this.on(t,r,n)},emit:function(t){for(var e=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),o=0,r=n.length;o<r;o++)n[o].fn.apply(n[o].ctx,e);return this},off:function(t,e){var n=this.e||(this.e={}),o=n[t],r=[];if(o&&e)for(var i=0,a=o.length;i<a;i++)o[i].fn!==e&&o[i].fn._!==e&&r.push(o[i]);return r.length?n[t]=r:delete n[t],this}},t.exports=n},function(t,e,n){var o,r,i;r=[t,n(0),n(2),n(1)],void 0===(i="function"==typeof(o=function(t,e,n,o){"use strict";var r=c(e),i=c(n),a=c(o);function c(t){return t&&t.__esModule?t:{default:t}}var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),l=function(t){function e(t,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var o=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return o.resolveOptions(n),o.listenClick(t),o}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),u(e,[{key:"resolveOptions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof t.action?t.action:this.defaultAction,this.target="function"==typeof t.target?t.target:this.defaultTarget,this.text="function"==typeof t.text?t.text:this.defaultText,this.container="object"===s(t.container)?t.container:document.body}},{key:"listenClick",value:function(t){var e=this;this.listener=(0,a.default)(t,"click",function(t){return e.onClick(t)})}},{key:"onClick",value:function(t){var e=t.delegateTarget||t.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new r.default({action:this.action(e),target:this.target(e),text:this.text(e),container:this.container,trigger:e,emitter:this})}},{key:"defaultAction",value:function(t){return f("action",t)}},{key:"defaultTarget",value:function(t){var e=f("target",t);if(e)return document.querySelector(e)}},{key:"defaultText",value:function(t){return f("text",t)}},{key:"destroy",value:function(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)}}],[{key:"isSupported",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],e="string"==typeof t?[t]:t,n=!!document.queryCommandSupported;return e.forEach(function(t){n=n&&!!document.queryCommandSupported(t)}),n}}]),e}(i.default);function f(t,e){var n="data-clipboard-"+t;if(e.hasAttribute(n))return e.getAttribute(n)}t.exports=l})?o.apply(e,r):o)||(t.exports=i)},function(t,e){var n=9;if("undefined"!=typeof Element&&!Element.prototype.matches){var o=Element.prototype;o.matches=o.matchesSelector||o.mozMatchesSelector||o.msMatchesSelector||o.oMatchesSelector||o.webkitMatchesSelector}t.exports=function(t,e){for(;t&&t.nodeType!==n;){if("function"==typeof t.matches&&t.matches(e))return t;t=t.parentNode}}},function(t,e,n){var o=n(4);function r(t,e,n,r,i){var a=function(t,e,n,r){return function(n){n.delegateTarget=o(n.target,e),n.delegateTarget&&r.call(t,n)}}.apply(this,arguments);return t.addEventListener(n,a,i),{destroy:function(){t.removeEventListener(n,a,i)}}}t.exports=function(t,e,n,o,i){return"function"==typeof t.addEventListener?r.apply(null,arguments):"function"==typeof n?r.bind(null,document).apply(null,arguments):("string"==typeof t&&(t=document.querySelectorAll(t)),Array.prototype.map.call(t,function(t){return r(t,e,n,o,i)}))}},function(t,e){e.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},e.nodeList=function(t){var n=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===n||"[object HTMLCollection]"===n)&&"length"in t&&(0===t.length||e.node(t[0]))},e.string=function(t){return"string"==typeof t||t instanceof String},e.fn=function(t){return"[object Function]"===Object.prototype.toString.call(t)}},function(t,e){t.exports=function(t){var e;if("SELECT"===t.nodeName)t.focus(),e=t.value;else if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName){var n=t.hasAttribute("readonly");n||t.setAttribute("readonly",""),t.select(),t.setSelectionRange(0,t.value.length),n||t.removeAttribute("readonly"),e=t.value}else{t.hasAttribute("contenteditable")&&t.focus();var o=window.getSelection(),r=document.createRange();r.selectNodeContents(t),o.removeAllRanges(),o.addRange(r),e=o.toString()}return e}}])},t.exports=o()},953:function(t,e,n){(t.exports=n(571)(!1)).push([t.i,".code-snippet{position:relative;margin:8px 0;background:#404040;color:#f0f0f0;border-radius:3px}.code-snippet pre{padding:16px;overflow:auto}.code-snippet button{position:absolute;top:16px;right:16px;line-height:18px;border:1px solid #fff;color:#fff;font-size:11px;font-weight:400;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.code-snippet button:active,.code-snippet button:focus,.code-snippet button:hover{background-color:#fff;color:#404040}.code-snippet-oneline pre{padding-bottom:40px}.code-snippet-oneline button{top:auto;top:40px}",""])},954:function(t,e,n){var o=n(953);"string"==typeof o&&(o=[[t.i,o,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};n(570)(o,r);o.locals&&(t.exports=o.locals)}}]);
//# sourceMappingURL=258.96b06d29.chunk.js.map
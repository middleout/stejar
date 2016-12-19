module.exports=function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={i:moduleId,l:!1,exports:{}};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.l=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.i=function(value){return value},__webpack_require__.d=function(exports,name,getter){Object.defineProperty(exports,name,{configurable:!1,enumerable:!0,get:getter})},__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=12)}([function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}__webpack_require__.d(exports,"Observable",function(){return Observable});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),Observable=function(){function Observable(){_classCallCheck(this,Observable),this.listeners=[]}return _createClass(Observable,[{key:"subscribe",value:function(callback){var _this=this;return this.listeners.push(callback),function(){var index=_this.listeners.indexOf(callback);_this.listeners.splice(index,1)}}},{key:"onNext",value:function(value){return this.listeners.forEach(function(item){return item(value)}),null}},{key:"asObservable",value:function(){var observable=new Observable;return this.subscribe(function(value){return observable.onNext(value)}),observable}}]),Observable}()},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_IMPORTED_MODULE_0__src__=__webpack_require__(5);for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__src__)"default"!==__WEBPACK_IMPORT_KEY__&&function(key){__webpack_require__.d(exports,key,function(){return __WEBPACK_IMPORTED_MODULE_0__src__[key]})}(__WEBPACK_IMPORT_KEY__)},function(module,exports,__webpack_require__){"use strict";function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var __WEBPACK_IMPORTED_MODULE_0__stejar_di__=__webpack_require__(11),__WEBPACK_IMPORTED_MODULE_0__stejar_di___default=__WEBPACK_IMPORTED_MODULE_0__stejar_di__&&__WEBPACK_IMPORTED_MODULE_0__stejar_di__.__esModule?function(){return __WEBPACK_IMPORTED_MODULE_0__stejar_di__["default"]}:function(){return __WEBPACK_IMPORTED_MODULE_0__stejar_di__};__webpack_require__.d(__WEBPACK_IMPORTED_MODULE_0__stejar_di___default,"a",__WEBPACK_IMPORTED_MODULE_0__stejar_di___default),__webpack_require__.d(exports,"PromiseStatus",function(){return PromiseStatus}),__webpack_require__.d(exports,"PromiseService",function(){return PromiseService});var PromiseStatus,_createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},__decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"===("undefined"==typeof Reflect?"undefined":_typeof(Reflect))&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__metadata=this&&this.__metadata||function(k,v){if("object"===("undefined"==typeof Reflect?"undefined":_typeof(Reflect))&&"function"==typeof Reflect.metadata)return Reflect.metadata(k,v)},pe=__webpack_require__(10);!function(PromiseStatus){PromiseStatus[PromiseStatus.RESOLVED="resolved"]="RESOLVED",PromiseStatus[PromiseStatus.REJECTED="rejected"]="REJECTED"}(PromiseStatus||(PromiseStatus={}));var PromiseService=function(){function PromiseService(){_classCallCheck(this,PromiseService)}return _createClass(PromiseService,[{key:"allSettled",value:function(){for(var _len=arguments.length,data=Array(_len),_key=0;_key<_len;_key++)data[_key]=arguments[_key];return pe.array.allSettled(data)}},{key:"chain",value:function(promises){return function(){if(0===promises.length)return Promise.resolve(arguments.length>0?arguments.length<=0?void 0:arguments[0]:null);for(var promise=promises[0].apply(promises,arguments),i=1;i<promises.length;i++)promise=promise.then(promises[i]);return promise}}},{key:"hashAll",value:function(entry){return pe.array.objectAll(entry)}},{key:"hashSettled",value:function(entry){var list=Object.keys(entry).map(function(entryName){return entry[entryName]});return this.allSettled.apply(this,_toConsumableArray(list)).then(function(results){return results.reduce(function(map,result,index){return map[Object.keys(entry)[index]]=result},{})})}},{key:"delay",value:function(timeout){return pe.delay(timeout)}}]),PromiseService}();PromiseService=__decorate([__WEBPACK_IMPORTED_MODULE_0__stejar_di__.injectable,__metadata("design:paramtypes",[])],PromiseService)},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var __WEBPACK_IMPORTED_MODULE_0__Observable__=__webpack_require__(0);__webpack_require__.d(exports,"Subject",function(){return Subject});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_get=function get(object,property,receiver){null===object&&(object=Function.prototype);var desc=Object.getOwnPropertyDescriptor(object,property);if(void 0===desc){var parent=Object.getPrototypeOf(object);return null===parent?void 0:get(parent,property,receiver)}if("value"in desc)return desc.value;var getter=desc.get;if(void 0!==getter)return getter.call(receiver)},Subject=function(_Observable){function Subject(value){_classCallCheck(this,Subject);var _this=_possibleConstructorReturn(this,(Subject.__proto__||Object.getPrototypeOf(Subject)).call(this));return _this.value=value,_this}return _inherits(Subject,_Observable),_createClass(Subject,[{key:"next",value:function(value){var _this2=this;this.value=value,this.listeners.forEach(function(item){return item(_this2.value)})}},{key:"subscribe",value:function(callback){var unsub=_get(Subject.prototype.__proto__||Object.getPrototypeOf(Subject.prototype),"subscribe",this).call(this,callback);return this.next(this.value),unsub}},{key:"getValue",value:function(){return this.value}}]),Subject}(__WEBPACK_IMPORTED_MODULE_0__Observable__.Observable)},function(module,exports,__webpack_require__){"use strict";function loadImage(url){return new Promise(function(resolve,reject){var img=new Image;img.onload=function(){return resolve(url)},img.onerror=function(){return reject(url)},img.onabort=function(){return reject(url)},img.src=url})}function loadImages(urls){return Promise.all(urls.map(function(url){return loadImage(url)}))}exports.loadImage=loadImage,exports.loadImages=loadImages},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_IMPORTED_MODULE_0__scriptLoader__=__webpack_require__(9),__WEBPACK_IMPORTED_MODULE_1__imageLoader__=__webpack_require__(4),__WEBPACK_IMPORTED_MODULE_2__PromiseService__=__webpack_require__(2),__WEBPACK_IMPORTED_MODULE_3__Observable__=__webpack_require__(0),__WEBPACK_IMPORTED_MODULE_4__Subject__=__webpack_require__(3),__WEBPACK_IMPORTED_MODULE_5__postMessage__=__webpack_require__(8),__WEBPACK_IMPORTED_MODULE_6__popupWindow__=__webpack_require__(7),__WEBPACK_IMPORTED_MODULE_7__newWindow__=__webpack_require__(6);for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__scriptLoader__)"default"!==__WEBPACK_IMPORT_KEY__&&function(key){__webpack_require__.d(exports,key,function(){return __WEBPACK_IMPORTED_MODULE_0__scriptLoader__[key]})}(__WEBPACK_IMPORT_KEY__);for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__imageLoader__)"default"!==__WEBPACK_IMPORT_KEY__&&function(key){__webpack_require__.d(exports,key,function(){return __WEBPACK_IMPORTED_MODULE_1__imageLoader__[key]})}(__WEBPACK_IMPORT_KEY__);for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_2__PromiseService__)"default"!==__WEBPACK_IMPORT_KEY__&&function(key){__webpack_require__.d(exports,key,function(){return __WEBPACK_IMPORTED_MODULE_2__PromiseService__[key]})}(__WEBPACK_IMPORT_KEY__);for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_3__Observable__)"default"!==__WEBPACK_IMPORT_KEY__&&function(key){__webpack_require__.d(exports,key,function(){return __WEBPACK_IMPORTED_MODULE_3__Observable__[key]})}(__WEBPACK_IMPORT_KEY__);for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_4__Subject__)"default"!==__WEBPACK_IMPORT_KEY__&&function(key){__webpack_require__.d(exports,key,function(){return __WEBPACK_IMPORTED_MODULE_4__Subject__[key]})}(__WEBPACK_IMPORT_KEY__);for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_5__postMessage__)"default"!==__WEBPACK_IMPORT_KEY__&&function(key){__webpack_require__.d(exports,key,function(){return __WEBPACK_IMPORTED_MODULE_5__postMessage__[key]})}(__WEBPACK_IMPORT_KEY__);for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_6__popupWindow__)"default"!==__WEBPACK_IMPORT_KEY__&&function(key){__webpack_require__.d(exports,key,function(){return __WEBPACK_IMPORTED_MODULE_6__popupWindow__[key]})}(__WEBPACK_IMPORT_KEY__);for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_7__newWindow__)"default"!==__WEBPACK_IMPORT_KEY__&&function(key){__webpack_require__.d(exports,key,function(){return __WEBPACK_IMPORTED_MODULE_7__newWindow__[key]})}(__WEBPACK_IMPORT_KEY__)},function(module,exports,__webpack_require__){"use strict";function newWindow(url){var newWindow=window.open(url,"_blank");window.focus&&newWindow.focus()}exports.newWindow=newWindow},function(module,exports,__webpack_require__){"use strict";function popupWindow(url,title){var width=arguments.length>2&&void 0!==arguments[2]?arguments[2]:800,height=arguments.length>3&&void 0!==arguments[3]?arguments[3]:600,y=window.outerHeight/2+window.screenY-height/2,x=window.outerWidth/2+window.screenX-width/2,newWindow=window.open(url,title,"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+width+", height="+height+", top="+y+", left="+x);window.focus&&newWindow.focus()}exports.popupWindow=popupWindow},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function postMessage(topic,payload){var origin=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"*",target=arguments.length>3&&void 0!==arguments[3]?arguments[3]:window;payload=JSON.stringify(payload),target.postMessage({topic:topic,payload:payload},origin)}function addCrossDomainEventListener(topic,callback){var listener=function(event){if(event&&event.data&&event.data.topic&&event.data.topic==topic){var payload=event.data.payload;void 0===payload&&(payload=null),callback(payload?"string"==typeof payload?JSON.parse(payload):payload:{})}},eventMethod=window.addEventListener?"addEventListener":"attachEvent",eventer=window[eventMethod],messageEvent="attachEvent"==eventMethod?"onmessage":"message";return eventer(messageEvent,listener,!1),listener}function removeCrossDomainEventListener(listener){var eventMethod=window.removeEventListener?"removeEventListener":"detachEvent",eventer=window[eventMethod],messageEvent="detachEvent"==eventMethod?"onmessage":"message";eventer(messageEvent,listener,!1)}exports.postMessage=postMessage,exports.addCrossDomainEventListener=addCrossDomainEventListener,exports.removeCrossDomainEventListener=removeCrossDomainEventListener,__webpack_require__.d(exports,"Channel",function(){return Channel});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),Channel=function(){function Channel(origin){var target=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window,debug=arguments.length>2&&void 0!==arguments[2]&&arguments[2];_classCallCheck(this,Channel),this.origin=origin,this.target=target,this.debug=debug,this.debugListenres=[]}return _createClass(Channel,[{key:"subscribe",value:function(topic,callback){return this.debug&&(console.log('Subscribing to "'+topic+'" ...'),this.debugListenres.push(addCrossDomainEventListener(topic,function(payload){console.log('Received message for topic "'+topic+'" and payload: ',payload)}))),addCrossDomainEventListener(topic,callback)}},{key:"unsuscribe",value:function(listener){return removeCrossDomainEventListener(listener)}},{key:"send",value:function(topic,payload){return this.debug&&console.log('Sending message for "'+topic+'" with payload: ',payload),postMessage(topic,payload,this.origin,this.target)}}]),Channel}()},function(module,exports,__webpack_require__){"use strict";function loadScript(url){var timeout=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return new Promise(function(resolve,reject){var script=document.createElement("script"),prior=document.getElementsByTagName("script")[0];script.async=1,prior.parentNode.insertBefore(script,prior);var resolved=!1,timeoutVar=setTimeout(function(){resolved||reject()},timeout);script.onload=script.onreadystatechange=function(_,isAbort){(isAbort||!script.readyState||/loaded|complete/.test(script.readyState))&&(script.onload=script.onreadystatechange=null,script=void 0,isAbort||(resolved=!0,clearTimeout(timeoutVar),resolve()))},script.src=url})}exports.loadScript=loadScript},function(module,exports){module.exports=require("@hughfdjackson/promise-extras")},function(module,exports){module.exports=require("@stejar/di")},function(module,exports,__webpack_require__){module.exports=__webpack_require__(1)}]);
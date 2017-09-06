module.exports=function(e){function __webpack_require__(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}var r={};return __webpack_require__.m=e,__webpack_require__.c=r,__webpack_require__.d=function(e,r,t){__webpack_require__.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:t})},__webpack_require__.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(r,"a",r),r},__webpack_require__.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=6)}([function(e,r,t){"use strict";t.d(r,"a",function(){return o});var n=t(2),i=t.n(n),o=i.a.object},function(e,r){e.exports=require("react")},function(e,r){e.exports=require("prop-types")},function(e,r){e.exports=require("hoist-non-react-statics")},function(e,r,t){"use strict";function getDisplayName(e){return e.displayName||e.name||"AnonymousComponent"}r.a=getDisplayName},function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function _inherits(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}function withServiceManager(e){var r="WithServiceManager("+Object(u.a)(e)+")",t=function(t){function WithServiceManager(e,t){_classCallCheck(this,WithServiceManager);var n=_possibleConstructorReturn(this,(WithServiceManager.__proto__||Object.getPrototypeOf(WithServiceManager)).call(this,e,t));return n.serviceManager=e.serviceManager||t.serviceManager,a()(n.serviceManager,'Could not find "serviceManager" in either the context or props of "'+r+'". Either wrap the root component in a <Provider>, or explicitly pass "serviceManager" as a prop to "'+r+'".'),n}return _inherits(WithServiceManager,t),p(WithServiceManager,[{key:"render",value:function(){return Object(c.createElement)(e,Object.assign({},this.props,{serviceManager:this.serviceManager}))}}]),WithServiceManager}(c.Component);return t.displayName=r,t.WrappedComponent=e,t.contextTypes={serviceManager:s.a},t.propTypes={serviceManager:s.a},i()(t,e)}r.a=withServiceManager;var n=t(3),i=t.n(n),o=t(9),a=t.n(o),c=t(1),u=(t.n(c),t(4)),s=t(0),p=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}()},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t(0);t.d(r,"shape",function(){return n.a});var i=t(7);t.d(r,"inject",function(){return i.a});var o=t(5);t.d(r,"withServiceManager",function(){return o.a});var a=t(10);t.d(r,"ServiceProvider",function(){return a.a})},function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function _inherits(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}function inject(e){return function(r){var t="Inject("+Object(c.a)(r)+")",i=function(t){function Inject(){return _classCallCheck(this,Inject),_possibleConstructorReturn(this,(Inject.__proto__||Object.getPrototypeOf(Inject)).apply(this,arguments))}return _inherits(Inject,t),s(Inject,[{key:"render",value:function(){var t=this,n={};return Object.keys(e).forEach(function(r){n[r]=t.props.serviceManager.get(e[r])}),Object(a.createElement)(r,Object.assign({},this.props,n))}}]),Inject}(a.Component);return i.displayName=t,i.WrappedComponent=r,i=n.__decorate([u.a],i),o()(i,r)}}r.a=inject;var n=t(8),i=(t.n(n),t(3)),o=t.n(i),a=t(1),c=(t.n(a),t(4)),u=t(5),s=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}()},function(e,r){e.exports=require("tslib")},function(e,r){e.exports=require("invariant")},function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function _inherits(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}t.d(r,"a",function(){return u});var n=t(2),i=t.n(n),o=t(1),a=(t.n(o),t(0)),c=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}(),u=function(e){function ServiceProvider(e,r){_classCallCheck(this,ServiceProvider);var t=_possibleConstructorReturn(this,(ServiceProvider.__proto__||Object.getPrototypeOf(ServiceProvider)).call(this,e,r));return t.serviceManager=e.serviceManager,t}return _inherits(ServiceProvider,e),c(ServiceProvider,[{key:"getChildContext",value:function(){return{serviceManager:this.serviceManager}}},{key:"render",value:function(){return o.Children.only(this.props.children)}}]),ServiceProvider}(o.Component);u.propTypes={children:i.a.element.isRequired,serviceManager:a.a.isRequired},u.childContextTypes={serviceManager:a.a.isRequired}}]);
"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer'); // eslint-disable-line

}

var isStateless = function isStateless(TargetComponent) {
  return typeof TargetComponent === 'function' && !(TargetComponent.prototype && TargetComponent.prototype.isReactComponent);
};

function handleViewport(TargetComponent, options, config) {
  if (options === void 0) {
    options = {};
  }

  if (config === void 0) {
    config = {
      disconnectOnLeave: false
    };
  }

  var InViewport =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(InViewport, _Component);

    function InViewport(props) {
      var _this;

      _this = _Component.call(this, props) || this;
      _this.observer = null;
      _this.node = null;
      _this.state = {
        inViewport: false,
        enterCount: 0,
        leaveCount: 0
      };
      _this.intersected = false;
      _this.handleIntersection = _this.handleIntersection.bind(_assertThisInitialized(_this));
      _this.initIntersectionObserver = _this.initIntersectionObserver.bind(_assertThisInitialized(_this));
      _this.setInnerRef = _this.setInnerRef.bind(_assertThisInitialized(_this));
      _this.setRef = _this.setRef.bind(_assertThisInitialized(_this));
      return _this;
    }

    var _proto = InViewport.prototype;

    _proto.componentDidMount = function componentDidMount() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      this.initIntersectionObserver();
      this.startObserver(this.node, this.observer);
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      // reset observer on update, to fix race condition that when observer init,
      // the element is not in viewport, such as in animation
      if (!this.intersected && !prevState.inViewport) {
        if (this.observer && this.node) {
          this.observer.unobserve(this.node); // $FlowFixMe

          this.observer.observe(this.node);
        }
      }
    };

    _proto.initIntersectionObserver = function initIntersectionObserver() {
      if (!this.observer) {
        var root = typeof options.root === 'function' ? options.root() : options.root; // $FlowFixMe

        this.observer = new IntersectionObserver(this.handleIntersection, _extends({}, options, {
          root: root
        }));
      }
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      this.stopObserver(this.node, this.observer);
    };

    _proto.startObserver = function startObserver(node, observer) {
      if (node && observer) {
        observer.observe(node);
      }
    };

    _proto.stopObserver = function stopObserver(node, observer) {
      if (node && observer) {
        observer.unobserve(node);
        observer.disconnect();
        this.observer = null;
      }
    };

    _proto.handleIntersection = function handleIntersection(entries) {
      var _this$props = this.props,
          onEnterViewport = _this$props.onEnterViewport,
          onLeaveViewport = _this$props.onLeaveViewport;
      var entry = entries[0] || {};
      var isIntersecting = entry.isIntersecting,
          intersectionRatio = entry.intersectionRatio;
      var inViewport = typeof isIntersecting !== 'undefined' ? isIntersecting : intersectionRatio > 0; // enter

      if (!this.intersected && inViewport) {
        this.intersected = true;
        onEnterViewport && onEnterViewport();
        this.setState({
          inViewport: inViewport,
          enterCount: this.state.enterCount + 1
        });
        return;
      } // leave


      if (this.intersected && !inViewport) {
        this.intersected = false;
        onLeaveViewport && onLeaveViewport();

        if (config.disconnectOnLeave) {
          // disconnect obsever on leave
          this.observer && this.observer.disconnect();
        }

        this.setState({
          inViewport: inViewport,
          leaveCount: this.state.leaveCount + 1
        });
      }
    };

    _proto.setRef = function setRef(node) {
      // $FlowFixMe
      this.node = (0, _reactDom.findDOMNode)(node);
    };

    _proto.setInnerRef = function setInnerRef(node) {
      if (node && !this.node) {
        // handle stateless
        this.node = node;
      }
    };

    _proto.render = function render() {
      var _this$props2 = this.props,
          onEnterViewport = _this$props2.onEnterViewport,
          onLeaveViewport = _this$props2.onLeaveViewport,
          otherProps = _objectWithoutPropertiesLoose(_this$props2, ["onEnterViewport", "onLeaveViewport"]); // pass ref to class and innerRef for stateless component


      var _this$state = this.state,
          inViewport = _this$state.inViewport,
          enterCount = _this$state.enterCount,
          leaveCount = _this$state.leaveCount;
      var refProps = isStateless(TargetComponent) ? {
        innerRef: this.setInnerRef
      } : {
        ref: this.setRef
      };
      return (// $FlowFixMe
        _react["default"].createElement(TargetComponent, _extends({}, otherProps, {
          inViewport: inViewport,
          enterCount: enterCount,
          leaveCount: leaveCount
        }, refProps))
      );
    };

    return InViewport;
  }(_react.Component);

  return (0, _hoistNonReactStatics["default"])(InViewport, TargetComponent);
}

var _default = handleViewport;
exports["default"] = _default;
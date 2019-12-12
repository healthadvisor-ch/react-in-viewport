"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer'); // eslint-disable-line

}

var isStateless = TargetComponent => typeof TargetComponent === 'function' && !(TargetComponent.prototype && TargetComponent.prototype.isReactComponent);

function handleViewport(TargetComponent, options, config) {
  if (options === void 0) {
    options = {};
  }

  if (config === void 0) {
    config = {
      disconnectOnLeave: false
    };
  }

  class InViewport extends _react.Component {
    constructor(props) {
      super(props);
      this.observer = null;
      this.node = null;
      this.state = {
        inViewport: false,
        enterCount: 0,
        leaveCount: 0
      };
      this.intersected = false;
      this.handleIntersection = this.handleIntersection.bind(this);
      this.initIntersectionObserver = this.initIntersectionObserver.bind(this);
      this.setInnerRef = this.setInnerRef.bind(this);
      this.setRef = this.setRef.bind(this);
    }

    componentDidMount() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      this.initIntersectionObserver();
      this.startObserver(this.node, this.observer);
    }

    componentDidUpdate(prevProps, prevState) {
      // reset observer on update, to fix race condition that when observer init,
      // the element is not in viewport, such as in animation
      if (!this.intersected && !prevState.inViewport) {
        if (this.observer && this.node) {
          this.observer.unobserve(this.node); // $FlowFixMe

          this.observer.observe(this.node);
        }
      }
    }

    initIntersectionObserver() {
      if (!this.observer) {
        var root = typeof options.root === 'function' ? options.root() : options.root; // $FlowFixMe

        this.observer = new IntersectionObserver(this.handleIntersection, _extends({}, options, {
          root
        }));
      }
    }

    componentWillUnmount() {
      this.stopObserver(this.node, this.observer);
    }

    startObserver(node, observer) {
      if (node && observer) {
        observer.observe(node);
      }
    }

    stopObserver(node, observer) {
      if (node && observer) {
        observer.unobserve(node);
        observer.disconnect();
        this.observer = null;
      }
    }

    handleIntersection(entries) {
      var {
        onEnterViewport,
        onLeaveViewport
      } = this.props;
      var entry = entries[0] || {};
      var {
        isIntersecting,
        intersectionRatio
      } = entry;
      var inViewport = typeof isIntersecting !== 'undefined' ? isIntersecting : intersectionRatio > 0; // enter

      if (!this.intersected && inViewport) {
        this.intersected = true;
        onEnterViewport && onEnterViewport();
        this.setState({
          inViewport,
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
          inViewport,
          leaveCount: this.state.leaveCount + 1
        });
      }
    }

    setRef(node) {
      // $FlowFixMe
      this.node = (0, _reactDom.findDOMNode)(node);
    }

    setInnerRef(node) {
      if (node && !this.node) {
        // handle stateless
        this.node = node;
      }
    }

    render() {
      var _this$props = this.props,
          otherProps = _objectWithoutPropertiesLoose(_this$props, ["onEnterViewport", "onLeaveViewport"]); // pass ref to class and innerRef for stateless component


      var {
        inViewport,
        enterCount,
        leaveCount
      } = this.state;
      var refProps = isStateless(TargetComponent) ? {
        innerRef: this.setInnerRef
      } : {
        ref: this.setRef
      };
      return (// $FlowFixMe
        _react.default.createElement(TargetComponent, _extends({}, otherProps, {
          inViewport: inViewport,
          enterCount: enterCount,
          leaveCount: leaveCount
        }, refProps))
      );
    }

  }

  return (0, _hoistNonReactStatics.default)(InViewport, TargetComponent);
}

var _default = handleViewport;
exports.default = _default;
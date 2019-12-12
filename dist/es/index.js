var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import hoistNonReactStatic from 'hoist-non-react-statics';

if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer'); // eslint-disable-line
}

var isStateless = function isStateless(TargetComponent) {
  return typeof TargetComponent === 'function' && !(TargetComponent.prototype && TargetComponent.prototype.isReactComponent);
};

function handleViewport(TargetComponent) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { disconnectOnLeave: false };

  var InViewport = function (_Component) {
    _inherits(InViewport, _Component);

    function InViewport(props) {
      _classCallCheck(this, InViewport);

      var _this = _possibleConstructorReturn(this, _Component.call(this, props));

      _this.observer = null;
      _this.node = null;
      _this.state = {
        inViewport: false,
        enterCount: 0,
        leaveCount: 0
      };
      _this.intersected = false;
      _this.handleIntersection = _this.handleIntersection.bind(_this);
      _this.initIntersectionObserver = _this.initIntersectionObserver.bind(_this);
      _this.setInnerRef = _this.setInnerRef.bind(_this);
      _this.setRef = _this.setRef.bind(_this);
      return _this;
    }

    InViewport.prototype.componentDidMount = function componentDidMount() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      this.initIntersectionObserver();
      this.startObserver(this.node, this.observer);
    };

    InViewport.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      // reset observer on update, to fix race condition that when observer init,
      // the element is not in viewport, such as in animation
      if (!this.intersected && !prevState.inViewport) {
        if (this.observer && this.node) {
          this.observer.unobserve(this.node); // $FlowFixMe
          this.observer.observe(this.node);
        }
      }
    };

    InViewport.prototype.initIntersectionObserver = function initIntersectionObserver() {
      if (!this.observer) {
        var root = typeof options.root === 'function' ? options.root() : options.root;
        // $FlowFixMe
        this.observer = new IntersectionObserver(this.handleIntersection, Object.assign({}, options, { root: root }));
      }
    };

    InViewport.prototype.componentWillUnmount = function componentWillUnmount() {
      this.stopObserver(this.node, this.observer);
    };

    InViewport.prototype.startObserver = function startObserver(node, observer) {
      if (node && observer) {
        observer.observe(node);
      }
    };

    InViewport.prototype.stopObserver = function stopObserver(node, observer) {
      if (node && observer) {
        observer.unobserve(node);
        observer.disconnect();
        this.observer = null;
      }
    };

    InViewport.prototype.handleIntersection = function handleIntersection(entries) {
      var _props = this.props,
        onEnterViewport = _props.onEnterViewport,
        onLeaveViewport = _props.onLeaveViewport;

      var entry = entries[0] || {};
      var isIntersecting = entry.isIntersecting,
        intersectionRatio = entry.intersectionRatio;

      var inViewport = typeof isIntersecting !== 'undefined' ? isIntersecting : intersectionRatio > 0;

      // enter
      if (!this.intersected && inViewport) {
        this.intersected = true;
        onEnterViewport && onEnterViewport();
        this.setState({
          inViewport: inViewport,
          enterCount: this.state.enterCount + 1
        });
        return;
      }

      // leave
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

    InViewport.prototype.setRef = function setRef(node) {
      // $FlowFixMe
      this.node = findDOMNode(node);
    };

    InViewport.prototype.setInnerRef = function setInnerRef(node) {
      if (node && !this.node) {
        // handle stateless
        this.node = node;
      }
    };

    InViewport.prototype.render = function render() {
      var _props2 = this.props,
        onEnterViewport = _props2.onEnterViewport,
        onLeaveViewport = _props2.onLeaveViewport,
        otherProps = _objectWithoutProperties(_props2, ['onEnterViewport', 'onLeaveViewport']);
      // pass ref to class and innerRef for stateless component


      var _state = this.state,
        inViewport = _state.inViewport,
        enterCount = _state.enterCount,
        leaveCount = _state.leaveCount;

      var refProps = isStateless(TargetComponent) ? { innerRef: this.setInnerRef } : { ref: this.setRef };
      return (
        // $FlowFixMe
        React.createElement(TargetComponent, _extends({}, otherProps, {
          inViewport: inViewport,
          enterCount: enterCount,
          leaveCount: leaveCount
        }, refProps))
      );
    };

    return InViewport;
  }(Component);

  return hoistNonReactStatic(InViewport, TargetComponent);
}

export default handleViewport;

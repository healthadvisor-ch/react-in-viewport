"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = require("react");

var _reactDom = require("react-dom");

var _constants = require("./constants");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var useInViewport = function useInViewport(target, options, config, props) {
  if (options === void 0) {
    options = _constants.defaultOptions;
  }

  if (config === void 0) {
    config = _constants.defaultConfig;
  }

  if (props === void 0) {
    props = _constants.defaultProps;
  }

  var _props = props,
      onEnterViewport = _props.onEnterViewport,
      onLeaveViewport = _props.onLeaveViewport;

  var _useState = (0, _react.useState)(),
      forceUpdate = _useState[1];

  var observer = (0, _react.useRef)();
  var inViewportRef = (0, _react.useRef)(false);
  var intersected = (0, _react.useRef)(false);
  var enterCountRef = (0, _react.useRef)(0);
  var leaveCountRef = (0, _react.useRef)(0);

  function startObserver(_ref) {
    var observerRef = _ref.observerRef;
    var targetRef = target.current;

    if (targetRef) {
      var node = (0, _reactDom.findDOMNode)(targetRef);

      if (node) {
        observerRef == null ? void 0 : observerRef.observe(node);
      }
    }
  }

  function stopObserver(_ref2) {
    var observerRef = _ref2.observerRef;
    var targetRef = target.current;

    if (targetRef) {
      var node = (0, _reactDom.findDOMNode)(targetRef);

      if (node) {
        observerRef == null ? void 0 : observerRef.unobserve(node);
      }
    }

    observerRef == null ? void 0 : observerRef.disconnect();
    observer.current = null;
  }

  function handleIntersection(entries) {
    var entry = entries[0] || {};
    var isIntersecting = entry.isIntersecting,
        intersectionRatio = entry.intersectionRatio;
    var isInViewport = typeof isIntersecting !== 'undefined' ? isIntersecting : intersectionRatio > 0; // enter

    if (!intersected.current && isInViewport) {
      intersected.current = true;
      onEnterViewport == null ? void 0 : onEnterViewport();
      enterCountRef.current += 1;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
      return;
    } // leave


    if (intersected.current && !isInViewport) {
      intersected.current = false;
      onLeaveViewport == null ? void 0 : onLeaveViewport();

      if (config.disconnectOnLeave && observer.current) {
        // disconnect obsever on leave
        observer.current.disconnect();
      }

      leaveCountRef.current += 1;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
    }
  }

  function initIntersectionObserver(_ref3) {
    var observerRef = _ref3.observerRef;

    if (!observerRef) {
      var root = typeof options.root === 'function' ? options.root() : options.root;
      observer.current = new IntersectionObserver(handleIntersection, _extends({}, options, {
        root: root
      }));
      return observer.current;
    }

    return observerRef;
  }

  (0, _react.useEffect)(function () {
    var observerRef = observer.current; // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

    observerRef = initIntersectionObserver({
      observerRef: observerRef
    });
    startObserver({
      observerRef: observerRef
    });
    return function () {
      stopObserver({
        observerRef: observerRef
      });
    };
  }, [target.current, options, config, onEnterViewport, onLeaveViewport]);
  return {
    inViewport: inViewportRef.current,
    enterCount: enterCountRef.current,
    leaveCount: leaveCountRef.current
  };
};

var _default = useInViewport;
exports["default"] = _default;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect, ReactReduxContext } from 'react-redux';
import { Router } from 'react-router';
import isEqualWith from 'lodash.isequalwith';
import { onLocationChanged as _onLocationChanged } from './actions';
import createSelectors from './selectors';

var createConnectedRouter = function createConnectedRouter(structure) {
  var _createSelectors = createSelectors(structure),
      getLocation = _createSelectors.getLocation;
  /*
   * ConnectedRouter listens to a history object passed from props.
   * When history is changed, it dispatches action to redux store.
   * Then, store will pass props to component to render.
   * This creates uni-directional flow from history->store->router->components.
   */


  var ConnectedRouter = /*#__PURE__*/function (_PureComponent) {
    _inherits(ConnectedRouter, _PureComponent);

    var _super = _createSuper(ConnectedRouter);

    function ConnectedRouter(props) {
      var _this;

      _classCallCheck(this, ConnectedRouter);

      _this = _super.call(this, props);
      var store = props.store,
          history = props.history,
          onLocationChanged = props.onLocationChanged,
          stateCompareFunction = props.stateCompareFunction;
      _this.inTimeTravelling = false; // Subscribe to store changes to check if we are in time travelling

      _this.unsubscribe = store.subscribe(function () {
        // Extract store's location
        var _getLocation = getLocation(store.getState()),
            pathnameInStore = _getLocation.pathname,
            searchInStore = _getLocation.search,
            hashInStore = _getLocation.hash,
            stateInStore = _getLocation.state; // Extract history's location


        var _history$location = history.location,
            pathnameInHistory = _history$location.pathname,
            searchInHistory = _history$location.search,
            hashInHistory = _history$location.hash,
            stateInHistory = _history$location.state; // If we do time travelling, the location in store is changed but location in history is not changed

        if (props.history.action === 'PUSH' && (pathnameInHistory !== pathnameInStore || searchInHistory !== searchInStore || hashInHistory !== hashInStore || !isEqualWith(stateInStore, stateInHistory, stateCompareFunction))) {
          _this.inTimeTravelling = true; // Update history's location to match store's location

          history.push({
            pathname: pathnameInStore,
            search: searchInStore,
            hash: hashInStore,
            state: stateInStore
          });
        }
      });

      var handleLocationChange = function handleLocationChange(location, action) {
        var isFirstRendering = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        // Dispatch onLocationChanged except when we're in time travelling
        if (!_this.inTimeTravelling) {
          onLocationChanged(location, action, isFirstRendering);
        } else {
          _this.inTimeTravelling = false;
        }
      }; // Listen to history changes


      _this.unlisten = history.listen(handleLocationChange);

      if (!props.noInitialPop) {
        // Dispatch a location change action for the initial location.
        // This makes it backward-compatible with react-router-redux.
        // But, we add `isFirstRendering` to `true` to prevent double-rendering.
        handleLocationChange(history.location, history.action, true);
      }

      return _this;
    }

    _createClass(ConnectedRouter, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.unlisten();
        this.unsubscribe();
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            history = _this$props.history,
            children = _this$props.children;
        return /*#__PURE__*/React.createElement(Router, {
          history: history
        }, children);
      }
    }]);

    return ConnectedRouter;
  }(PureComponent);

  ConnectedRouter.propTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired
    }).isRequired,
    history: PropTypes.shape({
      action: PropTypes.string.isRequired,
      listen: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired,
      push: PropTypes.func.isRequired
    }).isRequired,
    basename: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    onLocationChanged: PropTypes.func.isRequired,
    noInitialPop: PropTypes.bool,
    stateCompareFunction: PropTypes.func
  };

  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
      onLocationChanged: function onLocationChanged(location, action, isFirstRendering) {
        return dispatch(_onLocationChanged(location, action, isFirstRendering));
      }
    };
  };

  var ConnectedRouterWithContext = function ConnectedRouterWithContext(props) {
    var Context = props.context || ReactReduxContext;

    if (Context == null) {
      throw 'Please upgrade to react-redux v6';
    }

    return /*#__PURE__*/React.createElement(Context.Consumer, null, function (_ref) {
      var store = _ref.store;
      return /*#__PURE__*/React.createElement(ConnectedRouter, _extends({
        store: store
      }, props));
    });
  };

  ConnectedRouterWithContext.propTypes = {
    context: PropTypes.object
  };
  return connect(null, mapDispatchToProps)(ConnectedRouterWithContext);
};

export default createConnectedRouter;
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

require('../../entry.noworker');

var _PageSVG = require('../PageSVG');

var _PageSVG2 = _interopRequireDefault(_PageSVG);

var _failing_page = require('../../../__mocks__/_failing_page');

var _failing_page2 = _interopRequireDefault(_failing_page);

var _utils = require('../../__tests__/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable comma-dangle */

describe('PageSVG', function () {
  describe('loading', function () {
    it('calls onRenderError when failed to render canvas', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var _makeAsyncCallback, onRenderError, onRenderErrorPromise;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _makeAsyncCallback = (0, _utils.makeAsyncCallback)(), onRenderError = _makeAsyncCallback.func, onRenderErrorPromise = _makeAsyncCallback.promise;


              (0, _utils.muteConsole)();

              (0, _enzyme.mount)(_react2.default.createElement(_PageSVG2.default, null), {
                context: {
                  onRenderError: onRenderError,
                  page: _failing_page2.default
                }
              });

              expect.assertions(1);
              _context.next = 6;
              return expect(onRenderErrorPromise).resolves.toBeInstanceOf(Error);

            case 6:

              (0, _utils.restoreConsole)();

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));
  });
});
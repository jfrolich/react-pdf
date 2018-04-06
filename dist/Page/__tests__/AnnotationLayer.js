'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _pdfjsDist = require('pdfjs-dist');

var _pdfjsDist2 = _interopRequireDefault(_pdfjsDist);

require('../../entry.noworker');

var _AnnotationLayer = require('../AnnotationLayer');

var _AnnotationLayer2 = _interopRequireDefault(_AnnotationLayer);

var _failing_page = require('../../../__mocks__/_failing_page');

var _failing_page2 = _interopRequireDefault(_failing_page);

var _utils = require('../../__tests__/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PDFJS = _pdfjsDist2.default.PDFJS;

var _loadPDF = (0, _utils.loadPDF)('./__mocks__/_pdf.pdf'),
    fileArrayBuffer = _loadPDF.arrayBuffer;

/* eslint-disable comma-dangle */

describe('AnnotationLayer', function () {
  // Loaded page
  var page = void 0;
  var page2 = void 0;

  // Loaded page text items
  var desiredAnnotations = void 0;
  var desiredAnnotations2 = void 0;

  beforeAll((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var pdf;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return PDFJS.getDocument({ data: fileArrayBuffer });

          case 2:
            pdf = _context.sent;
            _context.next = 5;
            return pdf.getPage(1);

          case 5:
            page = _context.sent;
            _context.next = 8;
            return page.getAnnotations();

          case 8:
            desiredAnnotations = _context.sent;
            _context.next = 11;
            return pdf.getPage(2);

          case 11:
            page2 = _context.sent;
            _context.next = 14;
            return page2.getAnnotations();

          case 14:
            desiredAnnotations2 = _context.sent;

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  describe('loading', function () {
    it('loads annotations and calls onGetAnnotationsSuccess callback properly', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var _makeAsyncCallback, onGetAnnotationsSuccess, onGetAnnotationsSuccessPromise;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _makeAsyncCallback = (0, _utils.makeAsyncCallback)(), onGetAnnotationsSuccess = _makeAsyncCallback.func, onGetAnnotationsSuccessPromise = _makeAsyncCallback.promise;


              (0, _enzyme.mount)(_react2.default.createElement(_AnnotationLayer2.default, null), {
                context: {
                  onGetAnnotationsSuccess: onGetAnnotationsSuccess,
                  page: page
                }
              });

              expect.assertions(1);
              _context2.next = 5;
              return expect(onGetAnnotationsSuccessPromise).resolves.toMatchObject(desiredAnnotations);

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('calls onGetAnnotationsError when failed to load annotations', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var _makeAsyncCallback2, onGetAnnotationsError, onGetAnnotationsErrorPromise;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _makeAsyncCallback2 = (0, _utils.makeAsyncCallback)(), onGetAnnotationsError = _makeAsyncCallback2.func, onGetAnnotationsErrorPromise = _makeAsyncCallback2.promise;


              (0, _utils.muteConsole)();

              (0, _enzyme.mount)(_react2.default.createElement(_AnnotationLayer2.default, null), {
                context: {
                  onGetAnnotationsError: onGetAnnotationsError,
                  page: _failing_page2.default
                }
              });

              expect.assertions(1);
              _context3.next = 6;
              return expect(onGetAnnotationsErrorPromise).resolves.toBeInstanceOf(Error);

            case 6:

              (0, _utils.restoreConsole)();

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('replaces annotations properly', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var _makeAsyncCallback3, onGetAnnotationsSuccess, onGetAnnotationsSuccessPromise, mountedComponent, _makeAsyncCallback4, onGetAnnotationsSuccess2, onGetAnnotationsSuccessPromise2;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _makeAsyncCallback3 = (0, _utils.makeAsyncCallback)(), onGetAnnotationsSuccess = _makeAsyncCallback3.func, onGetAnnotationsSuccessPromise = _makeAsyncCallback3.promise;
              mountedComponent = (0, _enzyme.mount)(_react2.default.createElement(_AnnotationLayer2.default, null), {
                context: {
                  onGetAnnotationsSuccess: onGetAnnotationsSuccess,
                  page: page
                }
              });


              expect.assertions(2);
              _context4.next = 5;
              return expect(onGetAnnotationsSuccessPromise).resolves.toMatchObject(desiredAnnotations);

            case 5:
              _makeAsyncCallback4 = (0, _utils.makeAsyncCallback)(), onGetAnnotationsSuccess2 = _makeAsyncCallback4.func, onGetAnnotationsSuccessPromise2 = _makeAsyncCallback4.promise;


              mountedComponent.setContext({
                onGetAnnotationsSuccess: onGetAnnotationsSuccess2,
                page: page2
              });

              _context4.next = 9;
              return expect(onGetAnnotationsSuccessPromise2).resolves.toMatchObject(desiredAnnotations2);

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));
  });

  describe('rendering', function () {
    it('renders annotations properly', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var _makeAsyncCallback5, onRenderAnnotationsSuccess, onRenderAnnotationsSuccessPromise, component;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _makeAsyncCallback5 = (0, _utils.makeAsyncCallback)(), onRenderAnnotationsSuccess = _makeAsyncCallback5.func, onRenderAnnotationsSuccessPromise = _makeAsyncCallback5.promise;
              component = (0, _enzyme.mount)(_react2.default.createElement(_AnnotationLayer2.default, null), {
                context: {
                  onRenderAnnotationsSuccess: onRenderAnnotationsSuccess,
                  page: page
                }
              });


              expect.assertions(1);

              return _context5.abrupt('return', onRenderAnnotationsSuccessPromise.then(function () {
                component.update();
                var annotationItems = component.children();

                expect(annotationItems).toHaveLength(desiredAnnotations.length);
              }));

            case 4:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    it('renders annotations at a given rotation', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var _makeAsyncCallback6, onRenderAnnotationsSuccess, onRenderAnnotationsSuccessPromise, rotate, component;

      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _makeAsyncCallback6 = (0, _utils.makeAsyncCallback)(), onRenderAnnotationsSuccess = _makeAsyncCallback6.func, onRenderAnnotationsSuccessPromise = _makeAsyncCallback6.promise;
              rotate = 90;
              component = (0, _enzyme.mount)(_react2.default.createElement(_AnnotationLayer2.default, null), {
                context: {
                  onRenderAnnotationsSuccess: onRenderAnnotationsSuccess,
                  page: page,
                  rotate: rotate
                }
              });


              expect.assertions(1);
              return _context6.abrupt('return', onRenderAnnotationsSuccessPromise.then(function () {
                component.update();

                var _component$instance = component.instance(),
                    viewport = _component$instance.viewport;

                expect(viewport.rotation).toEqual(rotate);
              }));

            case 5:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));

    it('renders annotations at a given scale', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var _makeAsyncCallback7, onRenderAnnotationsSuccess, onRenderAnnotationsSuccessPromise, scale, component;

      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _makeAsyncCallback7 = (0, _utils.makeAsyncCallback)(), onRenderAnnotationsSuccess = _makeAsyncCallback7.func, onRenderAnnotationsSuccessPromise = _makeAsyncCallback7.promise;
              scale = 2;
              component = (0, _enzyme.mount)(_react2.default.createElement(_AnnotationLayer2.default, null), {
                context: {
                  onRenderAnnotationsSuccess: onRenderAnnotationsSuccess,
                  page: page,
                  scale: scale
                }
              });


              expect.assertions(1);
              return _context7.abrupt('return', onRenderAnnotationsSuccessPromise.then(function () {
                component.update();

                var _component$instance2 = component.instance(),
                    viewport = _component$instance2.viewport;

                expect(viewport.scale).toEqual(scale);
              }));

            case 5:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));
  });
});
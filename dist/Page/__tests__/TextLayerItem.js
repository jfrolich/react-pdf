'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _TextLayerItem = require('../TextLayerItem');

var _TextLayerItem2 = _interopRequireDefault(_TextLayerItem);

var _utils = require('../../__tests__/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PDFJS = _pdfjsDist2.default.PDFJS;

var _loadPDF = (0, _utils.loadPDF)('./__mocks__/_pdf.pdf'),
    fileArrayBuffer = _loadPDF.arrayBuffer;

describe('TextLayerItem', function () {
  // Loaded page
  var page = void 0;

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

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  var defaultProps = {
    fontName: '',
    itemIndex: 0,
    str: 'Test',
    transform: [],
    width: 0
  };

  describe('rendering', function () {
    it('renders text content properly', function () {
      var str = 'Test string';

      var component = (0, _enzyme.shallow)(_react2.default.createElement(_TextLayerItem2.default, (0, _extends3.default)({}, defaultProps, {
        str: str
      })), {
        context: {
          page: page
        }
      });

      var textItem = component.text();
      expect(textItem).toEqual(str);
    });

    it('calls customTextRenderer with necessary arguments', function () {
      var customTextRenderer = jest.fn();
      var str = 'Test string';
      var itemIndex = 5;

      (0, _enzyme.shallow)(_react2.default.createElement(_TextLayerItem2.default, (0, _extends3.default)({}, defaultProps, {
        itemIndex: itemIndex,
        str: str
      })), {
        context: {
          page: page,
          customTextRenderer: customTextRenderer
        }
      });

      expect(customTextRenderer).toBeCalledWith(expect.objectContaining({
        str: str,
        itemIndex: itemIndex
      }));
    });

    it('renders text content properly given customTextRenderer', function () {
      var customTextRenderer = function customTextRenderer() {
        return 'Test value';
      };

      var component = (0, _enzyme.shallow)(_react2.default.createElement(_TextLayerItem2.default, defaultProps), {
        context: {
          page: page,
          customTextRenderer: customTextRenderer
        }
      });

      var textItem = component.text();
      expect(textItem).toEqual('Test value');
    });
  });
});
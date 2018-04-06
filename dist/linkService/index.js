'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleLinkService = exports.PDFLinkService = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dom_events = require('./dom_events');

var _ui_utils = require('./ui_utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} PDFLinkServiceOptions
 * @property {EventBus} eventBus - The application event bus.
 * @property {number} externalLinkTarget - (optional) Specifies the `target`
 *   attribute for external links. Must use one of the values from {LinkTarget}.
 *   Defaults to using no target.
 * @property {string} externalLinkRel - (optional) Specifies the `rel` attribute
 *   for external links. Defaults to stripping the referrer.
 */

/**
 * Performs navigation functions inside PDF, such as opening specified page,
 * or destination.
 * @implements {IPDFLinkService}
 */
/* Copyright 2015 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var PDFLinkService = function () {
  /**
   * @param {PDFLinkServiceOptions} options
   */
  function PDFLinkService() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        eventBus = _ref.eventBus,
        _ref$externalLinkTarg = _ref.externalLinkTarget,
        externalLinkTarget = _ref$externalLinkTarg === undefined ? null : _ref$externalLinkTarg,
        _ref$externalLinkRel = _ref.externalLinkRel,
        externalLinkRel = _ref$externalLinkRel === undefined ? null : _ref$externalLinkRel;

    (0, _classCallCheck3.default)(this, PDFLinkService);

    this.eventBus = eventBus || (0, _dom_events.getGlobalEventBus)();
    this.externalLinkTarget = externalLinkTarget;
    this.externalLinkRel = externalLinkRel;

    this.baseUrl = null;
    this.pdfDocument = null;
    this.pdfViewer = null;
    this.pdfHistory = null;

    this._pagesRefCache = null;
  }

  (0, _createClass3.default)(PDFLinkService, [{
    key: 'setDocument',
    value: function setDocument(pdfDocument, baseUrl) {
      this.baseUrl = baseUrl;
      this.pdfDocument = pdfDocument;
      this._pagesRefCache = (0, _create2.default)(null);
    }
  }, {
    key: 'setViewer',
    value: function setViewer(pdfViewer) {
      this.pdfViewer = pdfViewer;
    }
  }, {
    key: 'setHistory',
    value: function setHistory(pdfHistory) {
      this.pdfHistory = pdfHistory;
    }

    /**
     * @returns {number}
     */

  }, {
    key: 'navigateTo',


    /**
     * @param {string|Array} dest - The named, or explicit, PDF destination.
     */
    value: function navigateTo(dest) {
      var _this = this;

      var goToDestination = function goToDestination(_ref2) {
        var namedDest = _ref2.namedDest,
            explicitDest = _ref2.explicitDest;

        // Dest array looks like that: <page-ref> </XYZ|/FitXXX> <args..>
        var destRef = explicitDest[0],
            pageNumber = void 0;

        if (destRef instanceof Object) {
          pageNumber = _this._cachedPageNumber(destRef);

          if (pageNumber === null) {
            // Fetch the page reference if it's not yet available. This could
            // only occur during loading, before all pages have been resolved.
            _this.pdfDocument.getPageIndex(destRef).then(function (pageIndex) {
              _this.cachePageRef(pageIndex + 1, destRef);
              goToDestination({ namedDest: namedDest, explicitDest: explicitDest });
            }).catch(function () {
              console.error('PDFLinkService.navigateTo: "' + destRef + '" is not ' + ('a valid page reference, for dest="' + dest + '".'));
            });
            return;
          }
        } else if ((0, _isInteger2.default)(destRef)) {
          pageNumber = destRef + 1;
        } else {
          console.error('PDFLinkService.navigateTo: "' + destRef + '" is not ' + ('a valid destination reference, for dest="' + dest + '".'));
          return;
        }
        if (!pageNumber || pageNumber < 1 || pageNumber > _this.pagesCount) {
          console.error('PDFLinkService.navigateTo: "' + pageNumber + '" is not ' + ('a valid page number, for dest="' + dest + '".'));
          return;
        }

        if (_this.pdfHistory) {
          // Update the browser history before scrolling the new destination into
          // view, to be able to accurately capture the current document position.
          _this.pdfHistory.pushCurrentPosition();
          _this.pdfHistory.push({ namedDest: namedDest, explicitDest: explicitDest, pageNumber: pageNumber });
        }

        _this.pdfViewer.scrollPageIntoView({
          pageNumber: pageNumber,
          destArray: explicitDest
        });
      };

      new _promise2.default(function (resolve, reject) {
        if (typeof dest === 'string') {
          _this.pdfDocument.getDestination(dest).then(function (destArray) {
            resolve({
              namedDest: dest,
              explicitDest: destArray
            });
          });
          return;
        }
        resolve({
          namedDest: '',
          explicitDest: dest
        });
      }).then(function (data) {
        if (!(data.explicitDest instanceof Array)) {
          console.error('PDFLinkService.navigateTo: "' + data.explicitDest + '" is' + (' not a valid destination array, for dest="' + dest + '".'));
          return;
        }
        goToDestination(data);
      });
    }

    /**
     * @param {string|Array} dest - The PDF destination object.
     * @returns {string} The hyperlink to the PDF object.
     */

  }, {
    key: 'getDestinationHash',
    value: function getDestinationHash(dest) {
      if (typeof dest === 'string') {
        return this.getAnchorUrl('#' + escape(dest));
      }
      if (dest instanceof Array) {
        var str = (0, _stringify2.default)(dest);
        return this.getAnchorUrl('#' + escape(str));
      }
      return this.getAnchorUrl('');
    }

    /**
     * Prefix the full url on anchor links to make sure that links are resolved
     * relative to the current URL instead of the one defined in <base href>.
     * @param {String} anchor The anchor hash, including the #.
     * @returns {string} The hyperlink to the PDF object.
     */

  }, {
    key: 'getAnchorUrl',
    value: function getAnchorUrl(anchor) {
      return (this.baseUrl || '') + anchor;
    }

    /**
     * @param {string} hash
     */

  }, {
    key: 'setHash',
    value: function setHash(hash) {
      var pageNumber = void 0,
          dest = void 0;
      if (hash.includes('=')) {
        var params = (0, _ui_utils.parseQueryString)(hash);
        if ('search' in params) {
          this.eventBus.dispatch('findfromurlhash', {
            source: this,
            query: params['search'].replace(/"/g, ''),
            phraseSearch: params['phrase'] === 'true'
          });
        }
        // borrowing syntax from "Parameters for Opening PDF Files"
        if ('nameddest' in params) {
          this.navigateTo(params.nameddest);
          return;
        }
        if ('page' in params) {
          pageNumber = params.page | 0 || 1;
        }
        if ('zoom' in params) {
          // Build the destination array.
          var zoomArgs = params.zoom.split(','); // scale,left,top
          var zoomArg = zoomArgs[0];
          var zoomArgNumber = parseFloat(zoomArg);

          if (!zoomArg.includes('Fit')) {
            // If the zoomArg is a number, it has to get divided by 100. If it's
            // a string, it should stay as it is.
            dest = [null, { name: 'XYZ' }, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null, zoomArgs.length > 2 ? zoomArgs[2] | 0 : null, zoomArgNumber ? zoomArgNumber / 100 : zoomArg];
          } else {
            if (zoomArg === 'Fit' || zoomArg === 'FitB') {
              dest = [null, { name: zoomArg }];
            } else if (zoomArg === 'FitH' || zoomArg === 'FitBH' || zoomArg === 'FitV' || zoomArg === 'FitBV') {
              dest = [null, { name: zoomArg }, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null];
            } else if (zoomArg === 'FitR') {
              if (zoomArgs.length !== 5) {
                console.error('PDFLinkService.setHash: Not enough parameters for "FitR".');
              } else {
                dest = [null, { name: zoomArg }, zoomArgs[1] | 0, zoomArgs[2] | 0, zoomArgs[3] | 0, zoomArgs[4] | 0];
              }
            } else {
              console.error('PDFLinkService.setHash: "' + zoomArg + '" is not ' + 'a valid zoom value.');
            }
          }
        }
        if (dest) {
          this.pdfViewer.scrollPageIntoView({
            pageNumber: pageNumber || this.page,
            destArray: dest,
            allowNegativeOffset: true
          });
        } else if (pageNumber) {
          this.page = pageNumber; // simple page
        }
        if ('pagemode' in params) {
          this.eventBus.dispatch('pagemode', {
            source: this,
            mode: params.pagemode
          });
        }
      } else {
        // Named (or explicit) destination.
        dest = unescape(hash);
        try {
          dest = JSON.parse(dest);

          if (!(dest instanceof Array)) {
            // Avoid incorrectly rejecting a valid named destination, such as
            // e.g. "4.3" or "true", because `JSON.parse` converted its type.
            dest = dest.toString();
          }
        } catch (ex) {}

        if (typeof dest === 'string' || isValidExplicitDestination(dest)) {
          this.navigateTo(dest);
          return;
        }
        console.error('PDFLinkService.setHash: "' + unescape(hash) + '" is not ' + 'a valid destination.');
      }
    }

    /**
     * @param {string} action
     */

  }, {
    key: 'executeNamedAction',
    value: function executeNamedAction(action) {
      // See PDF reference, table 8.45 - Named action
      switch (action) {
        case 'GoBack':
          if (this.pdfHistory) {
            this.pdfHistory.back();
          }
          break;

        case 'GoForward':
          if (this.pdfHistory) {
            this.pdfHistory.forward();
          }
          break;

        case 'NextPage':
          if (this.page < this.pagesCount) {
            this.page++;
          }
          break;

        case 'PrevPage':
          if (this.page > 1) {
            this.page--;
          }
          break;

        case 'LastPage':
          this.page = this.pagesCount;
          break;

        case 'FirstPage':
          this.page = 1;
          break;

        default:
          break; // No action according to spec
      }

      this.eventBus.dispatch('namedaction', {
        source: this,
        action: action
      });
    }

    /**
     * @param {Object} params
     */

  }, {
    key: 'onFileAttachmentAnnotation',
    value: function onFileAttachmentAnnotation(_ref3) {
      var id = _ref3.id,
          filename = _ref3.filename,
          content = _ref3.content;

      this.eventBus.dispatch('fileattachmentannotation', {
        source: this,
        id: id,
        filename: filename,
        content: content
      });
    }

    /**
     * @param {number} pageNum - page number.
     * @param {Object} pageRef - reference to the page.
     */

  }, {
    key: 'cachePageRef',
    value: function cachePageRef(pageNum, pageRef) {
      var refStr = pageRef.num + ' ' + pageRef.gen + ' R';
      this._pagesRefCache[refStr] = pageNum;
    }
  }, {
    key: '_cachedPageNumber',
    value: function _cachedPageNumber(pageRef) {
      var refStr = pageRef.num + ' ' + pageRef.gen + ' R';
      return this._pagesRefCache && this._pagesRefCache[refStr] || null;
    }
  }, {
    key: 'pagesCount',
    get: function get() {
      return this.pdfDocument ? this.pdfDocument.numPages : 0;
    }

    /**
     * @returns {number}
     */

  }, {
    key: 'page',
    get: function get() {
      return this.pdfViewer.currentPageNumber;
    }

    /**
     * @param {number} value
     */
    ,
    set: function set(value) {
      this.pdfViewer.currentPageNumber = value;
    }

    /**
     * @returns {number}
     */

  }, {
    key: 'rotation',
    get: function get() {
      return this.pdfViewer.pagesRotation;
    }

    /**
     * @param {number} value
     */
    ,
    set: function set(value) {
      this.pdfViewer.pagesRotation = value;
    }
  }]);
  return PDFLinkService;
}();

function isValidExplicitDestination(dest) {
  if (!(dest instanceof Array)) {
    return false;
  }
  var destLength = dest.length,
      allowNull = true;
  if (destLength < 2) {
    return false;
  }
  var page = dest[0];
  if (!((typeof page === 'undefined' ? 'undefined' : (0, _typeof3.default)(page)) === 'object' && (0, _isInteger2.default)(page.num) && (0, _isInteger2.default)(page.gen)) && !((0, _isInteger2.default)(page) && page >= 0)) {
    return false;
  }
  var zoom = dest[1];
  if (!((typeof zoom === 'undefined' ? 'undefined' : (0, _typeof3.default)(zoom)) === 'object' && typeof zoom.name === 'string')) {
    return false;
  }
  switch (zoom.name) {
    case 'XYZ':
      if (destLength !== 5) {
        return false;
      }
      break;
    case 'Fit':
    case 'FitB':
      return destLength === 2;
    case 'FitH':
    case 'FitBH':
    case 'FitV':
    case 'FitBV':
      if (destLength !== 3) {
        return false;
      }
      break;
    case 'FitR':
      if (destLength !== 6) {
        return false;
      }
      allowNull = false;
      break;
    default:
      return false;
  }
  for (var i = 2; i < destLength; i++) {
    var param = dest[i];
    if (!(typeof param === 'number' || allowNull && param === null)) {
      return false;
    }
  }
  return true;
}

var SimpleLinkService = function () {
  function SimpleLinkService() {
    (0, _classCallCheck3.default)(this, SimpleLinkService);

    this.externalLinkTarget = null;
    this.externalLinkRel = null;
  }

  /**
   * @returns {number}
   */


  (0, _createClass3.default)(SimpleLinkService, [{
    key: 'navigateTo',


    /**
     * @param dest - The PDF destination object.
     */
    value: function navigateTo(dest) {}

    /**
     * @param dest - The PDF destination object.
     * @returns {string} The hyperlink to the PDF object.
     */

  }, {
    key: 'getDestinationHash',
    value: function getDestinationHash(dest) {
      return '#';
    }

    /**
     * @param hash - The PDF parameters/hash.
     * @returns {string} The hyperlink to the PDF object.
     */

  }, {
    key: 'getAnchorUrl',
    value: function getAnchorUrl(hash) {
      return '#';
    }

    /**
     * @param {string} hash
     */

  }, {
    key: 'setHash',
    value: function setHash(hash) {}

    /**
     * @param {string} action
     */

  }, {
    key: 'executeNamedAction',
    value: function executeNamedAction(action) {}

    /**
     * @param {Object} params
     */

  }, {
    key: 'onFileAttachmentAnnotation',
    value: function onFileAttachmentAnnotation(_ref4) {
      var id = _ref4.id,
          filename = _ref4.filename,
          content = _ref4.content;
    }

    /**
     * @param {number} pageNum - page number.
     * @param {Object} pageRef - reference to the page.
     */

  }, {
    key: 'cachePageRef',
    value: function cachePageRef(pageNum, pageRef) {}
  }, {
    key: 'page',
    get: function get() {
      return 0;
    }

    /**
     * @param {number} value
     */
    ,
    set: function set(value) {}

    /**
     * @returns {number}
     */

  }, {
    key: 'rotation',
    get: function get() {
      return 0;
    }

    /**
     * @param {number} value
     */
    ,
    set: function set(value) {}
  }]);
  return SimpleLinkService;
}();

exports.PDFLinkService = PDFLinkService;
exports.SimpleLinkService = SimpleLinkService;
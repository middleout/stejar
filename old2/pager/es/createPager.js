"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPager = createPager;

function createPager(_ref) {
  var currentPage = _ref.currentPage,
      totalItems = _ref.totalItems,
      itemsPerPage = _ref.itemsPerPage,
      generateHrefForPage = _ref.generateHrefForPage,
      onChangePage = _ref.onChangePage,
      rangeToShow = _ref.rangeToShow;
  // Calculate the total number of pages
  var totalPages = Math.ceil(totalItems / itemsPerPage); // If the first button should be enabled

  var allowFirst = currentPage !== 1; // If the back button should be enabled

  var allowPrevious = currentPage !== 1; // If the next button should be enabled

  var allowNext = currentPage !== totalPages; // If the last button should be enabled

  var allowLast = currentPage !== totalPages; // If we're on the first page

  var firstPage = 1; // The index of the previous page

  var previousPage = currentPage - 1; // The index of the next page

  var nextPage = currentPage + 1; // Just a nice alias

  var lastPage = totalPages;
  var pages = [];

  if (rangeToShow * 2 + 1 >= totalPages) {
    for (var i = 1; i <= totalPages; i++) {
      pages.push({
        page: i,
        current: i === currentPage,
        url: generateHrefForPage(i),
        onChange: function (page) {
          return function (event) {
            return onChangePage(page, event);
          };
        }(i)
      });
    }
  } else {
    var left = rangeToShow;
    var right = rangeToShow;
    var possibleLeft = 0;

    for (var _i = currentPage - 1; _i >= 1; _i--) {
      possibleLeft++;
    }

    if (possibleLeft < left) {
      right = right + left - possibleLeft;
      left = possibleLeft;
    }

    var possibleRight = 0;

    for (var _i2 = currentPage + 1; _i2 <= totalPages; _i2++) {
      possibleRight++;
    }

    if (possibleRight < right) {
      if (possibleLeft - left > right - possibleRight) {
        left = left + right - possibleRight;
      }

      right = possibleRight;
    }

    for (var _i3 = currentPage - left; _i3 <= currentPage + right; _i3++) {
      pages.push({
        page: _i3,
        current: _i3 === currentPage,
        url: generateHrefForPage(_i3),
        onChange: function (page) {
          return function (event) {
            return onChangePage(page, event);
          };
        }(_i3)
      });
    }
  }

  return {
    allowFirst: allowFirst,
    firstPage: firstPage,
    allowPrevious: allowPrevious,
    previousPage: previousPage,
    allowNext: allowNext,
    nextPage: nextPage,
    allowLast: allowLast,
    lastPage: lastPage,
    pages: pages
  };
}
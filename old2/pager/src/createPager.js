export function createPager({ currentPage, totalItems, itemsPerPage, generateHrefForPage, onChangePage, rangeToShow }) {
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // If the first button should be enabled
    const allowFirst = currentPage !== 1;

    // If the back button should be enabled
    const allowPrevious = currentPage !== 1;

    // If the next button should be enabled
    const allowNext = currentPage !== totalPages;

    // If the last button should be enabled
    const allowLast = currentPage !== totalPages;

    // If we're on the first page
    const firstPage = 1;

    // The index of the previous page
    const previousPage = currentPage - 1;

    // The index of the next page
    const nextPage = currentPage + 1;

    // Just a nice alias
    const lastPage = totalPages;

    let pages = [];

    if (rangeToShow * 2 + 1 >= totalPages) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push({
                page: i,
                current: i === currentPage,
                url: generateHrefForPage(i),
                onChange: (page => event => onChangePage(page, event))(i),
            });
        }
    } else {
        let left = rangeToShow;
        let right = rangeToShow;

        let possibleLeft = 0;
        for (let i = currentPage - 1; i >= 1; i--) {
            possibleLeft++;
        }

        if (possibleLeft < left) {
            right = right + left - possibleLeft;
            left = possibleLeft;
        }

        let possibleRight = 0;
        for (let i = currentPage + 1; i <= totalPages; i++) {
            possibleRight++;
        }

        if (possibleRight < right) {
            if (possibleLeft - left > right - possibleRight) {
                left = left + right - possibleRight;
            }

            right = possibleRight;
        }

        for (let i = currentPage - left; i <= currentPage + right; i++) {
            pages.push({
                page: i,
                current: i === currentPage,
                url: generateHrefForPage(i),
                onChange: (page => event => onChangePage(page, event))(i),
            });
        }
    }

    return {
        allowFirst,
        firstPage,
        allowPrevious,
        previousPage,
        allowNext,
        nextPage,
        allowLast,
        lastPage,
        pages,
    };
}

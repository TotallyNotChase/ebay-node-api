'use strict';

const urlObject = require('./buildURL');
const { getRequest } = require('./request');
const { constructAdditionalParams } = require('./utils');
const FIND_ITEMS_BY_KEYWORD = 'findItemsByKeywords';
const FIND_ITEMS_BY_CATEGORY = 'findItemsByCategory';
const FIND_COMPLETED_ITEMS = 'findCompletedItems';
const FIND_ITEMS_ADV = 'findItemsAdvanced';
const FIND_EBAY_STORES = 'findItemsIneBayStores';

const findItemsByKeywords = function (options) {
    if (!options) {
        throw new Error('INVALID_REQUEST_PARMS --> Keyword is missing, Keyword is required');
    }
    this.options.operationName = FIND_ITEMS_BY_KEYWORD;
    this.options.param = 'keywords';
    // support only keyword string.
    if (!options.keywords) options = { keywords: options };
    options.keywords = encodeURIComponent(options.keywords);
    this.options.additionalParam = constructAdditionalParams(options);
    const url = urlObject.buildSearchUrl(this.options);
    return getRequest(url).then((data) => {
        return JSON.parse(data).findItemsByKeywordsResponse;
    }, console.error // eslint-disable-line no-console
    );
};

const findItemsByCategory = function (categoryID) {
    if (!categoryID) throw new Error('INVALID_REQUEST_PARMS --> Category ID is null or invalid');
    this.options.name = categoryID;
    this.options.operationName = FIND_ITEMS_BY_CATEGORY;
    this.options.param = 'categoryId';
    const url = urlObject.buildSearchUrl(this.options);
    return getRequest(url).then((data) => {
        return JSON.parse(data).findItemsByCategoryResponse;
    }, console.error // eslint-disable-line no-console
    );
};

/**
 * searches for items whose listings are completed and are no longer available for
 * sale by category (using categoryId), by keywords (using keywords), or a combination of the two.
 * @param {Object} options
 */
const findCompletedItems = function (options) {
    if (!options) throw new Error('INVALID_REQUEST_PARMS --> Keyword or category ID are required.');
    if (!options.keywords && !options.categoryId) throw new Error('Keyword or category ID are required.');
    if (options.keywords) {
        options.keywords = encodeURIComponent(options.keywords);
    }
    this.options.operationName = FIND_COMPLETED_ITEMS;
    this.options.additionalParam = constructAdditionalParams(options);
    const url = urlObject.buildSearchUrl(this.options);
    return getRequest(url).then((data) => {
        return JSON.parse(data).findCompletedItemsResponse;

    }, console.error // eslint-disable-line no-console
    );
};


/**
 * searches for items whose listings are completed and are no longer available for
 * sale by category (using categoryId), by keywords (using keywords), or a combination of the two.
 * @param {Object} options
 */
const findItemsAdvanced = function (options) {
    if (!options) throw new Error('INVALID_REQUEST_PARMS --> check here for input fields https://developer.ebay.com/DevZone/finding/CallRef/findItemsAdvanced.html#Input');
    if (options.keywords) {
        options.keywords = encodeURIComponent(options.keywords);
    }
    this.options.operationName = FIND_ITEMS_ADV;
    this.options.additionalParam = constructAdditionalParams(options);
    const url = urlObject.buildSearchUrl(this.options);
    console.log(url);
    return getRequest(url).then((data) => {
        return JSON.parse(data).findItemsAdvancedResponse;
    }, console.error // eslint-disable-line no-console
    );
};


const getVersion = function () {
    this.options.operationName = 'getVersion';
    const url = urlObject.buildSearchUrl(this.options);
    return getRequest(url).then((data) => {
        return JSON.parse(data).getVersionResponse[0];
    }, console.error // eslint-disable-line no-console
    );
};

/**
 * Searches for items on eBay using specific eBay product values.
 * @param {Object} options
 */
const findItemsByProduct = function (options) {
    if (!options) throw new Error('INVALID_REQUEST_PARMS --> Please enter the Valid input.');
    if (!options.productId) throw new Error('INVALID_REQUEST_PARMS --> Product ID is required.');
    let type = options.type ? options.type : 'ReferenceID';
    this.options.operationName = 'findItemsByProduct';
    this.options.additionalParam = constructAdditionalParams(options);
    let url = urlObject.buildSearchUrl(this.options);
    url = `${url}&productId.@type=${type}`;
    console.log(url);
    return getRequest(url).then((data) => {
        return JSON.parse(data).findItemsByProductResponse;

    }, console.error // eslint-disable-line no-console
    );
};

const findItemsIneBayStores = function (options) {
    if (!options) throw new Error('INVALID_REQUEST_PARMS --> Please enter the Valid input.');
    if (!options.storeName) throw new Error('INVALID_REQUEST_PARMS --> Store name is required.');
    this.options.operationName = FIND_EBAY_STORES;
    this.options.additionalParam = constructAdditionalParams(options);
    console.log(urlObject.buildSearchUrl(this.options));
    return getRequest(urlObject.buildSearchUrl(this.options)).then((data) => {
        return JSON.parse(data).findItemsIneBayStoresResponse;

    }, console.error // eslint-disable-line no-console
    );
};

module.exports = {
    findItemsByKeywords,
    findItemsByCategory,
    findCompletedItems,
    findItemsByProduct,
    findItemsAdvanced,
    findItemsIneBayStores,
    getVersion
};
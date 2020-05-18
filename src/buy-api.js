'use strict';
const fs = require('fs');
const makeString = require('make-string');
const qs = require('querystring');
const { makeRequest } = require('./request');
const { base64Encode, encodeURLQuery } = require('./utils')

const getItemById = function (itemId) {
    if (!itemId) throw new Error('Item Id is required');
    if (!this.appAccessToken) throw new Error('Missing Application Access token, Generate access token');
    const auth = 'Bearer ' + this.appAccessToken;
    const id = encodeURIComponent(itemId);
    let config = {
        contentType: 'application/json'
    };
    return new Promise((resolve, reject) => {
        makeRequest(this, config, `/buy/browse/v1/item/${id}`, 'GET', auth).then((result) => {
            return resolve(JSON.parse(result));
        }).then((error) => {
            return reject(error);
        });
    });
};

const getItemByLegacyId = function (legacyOptions) {
    if (!legacyOptions) throw new Error('Error Required input to get Items By LegacyID');
    if (!this.appAccessToken) throw new Error('Missing Application Access token, Generate access token');
    if (!legacyOptions.legacyItemId) throw new Error('Error Legacy Item Id is required');
    const auth = 'Bearer ' + this.appAccessToken;
    let param = 'legacy_item_id=' + legacyOptions.legacyItemId;
    param += legacyOptions.legacyVariationSku ? '&legacy_variation_sku=' + legacyOptions.legacyVariationSku : '';
    let config = {
        contentType: 'application/json'
    };
    return new Promise((resolve, reject) => {
        makeRequest(this, config, `/buy/browse/v1/item/get_item_by_legacy_id?${param}`, 'GET', auth).then((result) => {
            return resolve(JSON.parse(result));
        }).then((error) => {
            return reject(error);
        });
    });
};

const getItemByItemGroup = function (itemGroupId) {
    if (typeof itemGroupId === 'object') throw new Error('Expecting String or number (Item group id)');
    if (!itemGroupId) throw new Error('Error Item Group ID is required');
    if (!this.appAccessToken) throw new Error('Missing Application Access token, Generate access token');
    const auth = 'Bearer ' + this.appAccessToken;
    let config = {
        contentType: 'application/json'
    };
    return new Promise((resolve, reject) => {
        makeRequest(this, config, `/buy/browse/v1/item/get_items_by_item_group?item_group_id=${itemGroupId}`, 'GET', auth).then((result) => {
            resolve(result);
        }).then((error) => {
            reject(error);
        });
    });
};

const searchItems = function (searchConfig) {
    if (!searchConfig) throw new Error('Missing or invalid input parameter to search');
    if (!searchConfig.keyword && !searchConfig.categoryId && !searchConfig.gtin) throw new Error('Error --> Keyword or category id is required in query param');
    if (!this.appAccessToken) throw new Error('Missing Application Access token, Generate access token');
    const auth = 'Bearer ' + this.appAccessToken;
    let queryParam = searchConfig.keyword ? 'q=' + encodeURIComponent(searchConfig.keyword) : '';
    queryParam = queryParam + (searchConfig.gtin ? '&gtin=' + searchConfig.gtin : '');
    queryParam = queryParam + (searchConfig.categoryId ? '&category_ids=' + searchConfig.categoryId : '');
    queryParam = queryParam + (searchConfig.limit ? '&limit=' + searchConfig.limit : '');
    queryParam = queryParam + (searchConfig.offset ? '&offset=' + searchConfig.offset : '');
    queryParam = queryParam + (searchConfig.sort ? '&sort=' + searchConfig.sort : '');
    if (searchConfig.fieldgroups !== undefined) queryParam = queryParam + '&fieldgroups=' + searchConfig.fieldgroups;
    if (searchConfig.filter !== undefined) queryParam = queryParam + '&filter=' + encodeURLQuery(makeString(searchConfig.filter, { quotes: 'no', braces: 'false' }));
    queryParam = queryParam + (searchConfig.aspect_filter ? '&aspect_filter=' + encodeURLQuery(makeString(searchConfig.aspect_filter, { quotes: 'no', braces: 'false' })) : '');
    let config = {
        contentType: 'application/json'
    };
    return new Promise((resolve, reject) => {
        makeRequest(this, config, `/buy/browse/v1/item_summary/search?${(queryParam)}`, 'GET', auth).then((result) => {
            resolve(result);
        }).then((error) => {
            reject(error);
        });
    });
};

const searchByImage = function (searchConfig) {
    if (!searchConfig) throw new Error('Missing or invalid input parameter to search by image');
    if (!this.appAccessToken) throw new Error('Missing Application Access token, Generate access token');
    if (!searchConfig.imgPath && !searchConfig.base64Image) throw new Error('imgPath or base64Image is required');
    const auth = 'Bearer ' + this.appAccessToken;
    const encodeImage = searchConfig.imgPath ? base64Encode(fs.readFileSync(searchConfig.imgPath)) : searchConfig.base64Image;
    let config = qs.stringify({
        data: { image: encodeImage },
        contentType: "application/json",
    });
    const queryString = makeString(searchConfig, { quotes: 'no', braces: 'false', seperator: '&', assignment: '=' });
    return new Promise((resolve, reject) => {
        makeRequest(this, config, `/buy/browse/v1/item_summary/search_by_image?${queryString}`, 'POST', auth).then((result) => {
            resolve(result);
        }).then((error) => {
            reject(error);
        });
    });
};

module.exports = {
    getItemById,
    getItemByLegacyId,
    getItemByItemGroup,
    searchItems,
    searchByImage
};

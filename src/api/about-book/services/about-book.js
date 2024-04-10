'use strict';

/**
 * about-book service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::about-book.about-book');

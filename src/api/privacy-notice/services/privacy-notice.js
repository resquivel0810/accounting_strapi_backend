'use strict';

/**
 * privacy-notice service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::privacy-notice.privacy-notice');

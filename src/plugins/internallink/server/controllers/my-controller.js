'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('internallink')
      .service('myService')
      .getWelcomeMessage();
  },
});

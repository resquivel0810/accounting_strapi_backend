'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('comments')
      .service('myService')
      .getWelcomeMessage();
  },
});

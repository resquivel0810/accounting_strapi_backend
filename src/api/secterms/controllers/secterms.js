'use strict';

/**
 * A set of functions called "actions" for `secterms`
 */

module.exports = {
    async secTerms(ctx, next) {
      try {
        const  {id} = ctx.params;
        const {account}=ctx.params;
        const data = await strapi
          .service("api::secterms.secterms")
          .secTerms(id, account);
        console.log(data, "data");
  
        ctx.body = data;
      } catch (err) {
        ctx.badRequest("Post report controller error", { moreDetails: err });
      }
    },
  };

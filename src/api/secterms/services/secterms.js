'use strict';

/**
 * secterms service
 */

module.exports = {
    secTerms: async (id,account) => {
      try {
        // fetching data
        const entries = await strapi.entityService.findOne(
          "api::term.term",id,
          {
            fields: ["id", "text", "definition", "free","locale"],
            populate: {
              synonyms: {
                fields: ["id", "text", "definition","locale"],
              },
              localizations: {
                fields: ["id", "text", "definition","free","locale"],
                populate: {
                    synonyms: {
                        fields: ["id", "text", "definition","locale"],
                    },
                },
              },
            },
          }
        );
  
        
          if(account<2&&entries.free==false)
          {
            entries.definition="";
          }
          entries.localizations.forEach(element => {
            if(account<2&&element.free==false)
            {
                element.definition="";
            }
          });
        // return the reduced data
        return entries;
      } catch (err) {
        return err;
      }
    },
  };

module.exports = {
    routes: [
      {
        method: "GET",
        path: "/secterms/:id/:account",
        handler: "secterms.secTerms",
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };

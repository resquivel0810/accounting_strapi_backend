import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import HelloWorldButton from "./components/HelloWorldButton";
// import { useCMEditViewDataManager } from "@strapi/helper-plugin";
// import React from 'react';
// import{
//     Button

// } from "@strapi/design-system/"

const name = pluginPkg.strapi.name;
// const HelloWorldButton  = async () => {
//   const component = await import(
//     /* webpackChunkName: "users-providers-settings-page" */ './pages/App'
//   );

//   return component ;
// };

export default {
  register(app) {
    // app.addMenuLink({
    //   to: `/plugins/${pluginId}`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${pluginId}.plugin.name`,
    //     defaultMessage: name,
    //   },
    //   Component: async () => {
    //     const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

    //     return component;
    //   },
    //   permissions: [
    //     // Uncomment to set the permissions of the plugin here
    //     // {
    //     //   action: '', // the action name should be plugin::plugin-name.actionType
    //     //   subject: null,
    //     // },
    //   ],
    // });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },
  bootstrap(app) {
    app.injectContentManagerComponent("editView", "right-links", {
      name: "helloWorldButton-component",
      Component: HelloWorldButton,
    });
    },
  // bootstrap(app) {},
  // bootstrap(app) {
  //   const { initialData } = useCMEditViewDataManager();
  //   app.injectContentManagerComponent('editView', 'informations', {
  //     name: 'my-plugin-my-compo',
  //     Component: () => {
  //       return (
  //           <Button
  //           variant="secondary"
  //           startIcon={<Up />}
  //           onClick={() => alert("Hello World")}
  //         >
  //           Hello World
  //         </Button>
  //       );
  //     },
  //   });
  // },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};

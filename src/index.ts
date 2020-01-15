import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {ButtonExtension} from "./button";
import {MyTabExtension} from "./widget";

/**
 * Initialization data for the mybutton extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'demo-jl-ext',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension demo-jl-ext is activated!');

    // Add mybutton demo code
    let buttonExtension = new ButtonExtension();
    app.docRegistry.addWidgetExtension('Notebook', buttonExtension);

    // Add mytabextension code
    let tabExtension = new MyTabExtension();
    app.docRegistry.addWidgetExtension('Editor', tabExtension);
  }
};

export default extension;

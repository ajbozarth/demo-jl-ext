import {ToolbarButton} from '@jupyterlab/apputils';
import {DocumentRegistry, IDocumentWidget} from "@jupyterlab/docregistry";
import {FileEditor} from '@jupyterlab/fileeditor';
import {OutputArea, OutputAreaModel} from '@jupyterlab/outputarea';
import {RenderMimeRegistry, standardRendererFactories as initialFactories} from '@jupyterlab/rendermime';

import {IDisposable} from "@phosphor/disposable";
import {BoxLayout, DockPanel, TabBar, Widget} from '@phosphor/widgets';

export class MyTabExtension implements DocumentRegistry.IWidgetExtension<IDocumentWidget<FileEditor>, DocumentRegistry.ICodeModel> {
    private dockPanel: DockPanel;
    private outputAreaWidget: OutputArea;

    createNew(widget: IDocumentWidget<FileEditor>, context: DocumentRegistry.IContext<DocumentRegistry.ICodeModel>): IDisposable {
        // Create buttons for opening and closing the tab bar and it's content separate from the expected functionality
        const showButton = new ToolbarButton({
            iconClassName: 'jp-RunIcon',
            onClick: this.displayOutputArea,
            tooltip: 'Show Tab'
        });
        const hideButton = new ToolbarButton({
            iconClassName: 'jp-StopIcon',
            onClick: this.resetOutputArea,
            tooltip: 'Hide Tab'
        });

        const toolbar = widget.toolbar;
        toolbar.addItem('showTab', showButton);
        toolbar.addItem('hideTab', hideButton);

        // Create the dockpanel that contains the tab bar and it's content
        this.dockPanel = new DockPanel();
        Widget.attach(this.dockPanel, document.body);

        // Create output area widget to use for some content in the tab
        const model: OutputAreaModel = new OutputAreaModel();
        const renderMimeRegistry = new RenderMimeRegistry({ initialFactories });
        this.outputAreaWidget = new OutputArea({ rendermime: renderMimeRegistry, model });

        // Add dockpanel to the file editor widget
        const layout = widget.layout as BoxLayout;
        layout.addWidget(this.dockPanel);

        return this.dockPanel;
    }

    // Clear and hides the whole tab bar and content (should be run on tab close)
    private resetOutputArea = () => {
        this.dockPanel.hide();
        this.outputAreaWidget.model.clear();
    };

    private hasOutputTab = () => {
        return Object.entries(this.dockPanel.tabBars()).length !== 0;
    };

    private displayOutputArea = () => {
        this.dockPanel.show();

        BoxLayout.setStretch(this.dockPanel, 1);

        // Only create the tab bar and content if it doesn't exist yet
        if ( !this.hasOutputTab() ) {
            // Add a tab to dockPanel (tab containing empty outputAreaWidget)
            this.dockPanel.addWidget(this.outputAreaWidget, { mode: 'split-bottom' });

            // next() is used here since tabBars() returns an iterator, but it only ever contains a single TabBar
            let myTabBar: TabBar<Widget> = this.dockPanel.tabBars().next();
            myTabBar.id = 'my-tab-bar';
            myTabBar.currentTitle.label = 'My Tab';
            myTabBar.currentTitle.closable = true;

            // This is the code that doesn't seem to work, this should run resetOutputArea on tab close, but doesn't
            // I've included console log for faster checking on if the connect was successful and if the callback runs
            let connectSucc = myTabBar.tabCloseRequested.connect((sender, args) => {
                console.log('tab close request caught');
                this.resetOutputArea();
            }, this);
            console.log('tab close request connected: ' + connectSucc);
        }
    };
}

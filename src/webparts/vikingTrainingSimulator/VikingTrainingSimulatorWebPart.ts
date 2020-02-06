import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'VikingTrainingSimulatorWebPartStrings';
import { VikingTrainingSimulator } from './components/VikingTrainingSimulator';
import { IVikingTrainingSimulatorProps } from './components/IVikingTrainingSimulatorProps';

export default class VikingTrainingSimulatorWebPart extends BaseClientSideWebPart<{}> {

  public render(): void {
    const element: React.ReactElement<IVikingTrainingSimulatorProps> = React.createElement(
      VikingTrainingSimulator,
      {
        userEmail: this.context.pageContext.user.email.toLowerCase()
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

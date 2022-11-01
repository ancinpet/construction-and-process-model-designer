import { Component } from '@angular/core';
import { StateManagerService } from './services/state-management/state-manager.service';
import { OCDCommunicationService } from './services/ocd-communication/ocd-communication.service';
import { AMDCommunicationService } from './services/amd-communication/amd-communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.root.component.html',
  styleUrls: ['./app.root.component.scss'],
  providers: [StateManagerService, OCDCommunicationService, AMDCommunicationService]
})
export class AppRootComponent {
  title = 'EnterpriseDesigner'
}

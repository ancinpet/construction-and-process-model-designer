import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalrService, ConnectionStateOptions } from 'src/app/services/signalr/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {

  public connectionStatusMessage: string;
  public toopTipText: string;
  public statusIcon: string;
  private connectionStatesSubscription: Subscription;
  constructor(private connectionService: SignalrService) { }

  ngOnInit() {
    this.connectionStatesSubscription = this.connectionService.getConnectionStates$().subscribe(
      (connectionState) => this.onUpdate(connectionState),
      (error) => this.onError(error),
      () => this.onComplete());
  }

  ngOnDestroy(): void {
    this.connectionStatesSubscription.unsubscribe();
  }

  private onUpdate(connectionState: ConnectionStateOptions): void {
    switch (connectionState) {
      case ConnectionStateOptions.connected:
        this.connectionStatusMessage = "connected";
        this.toopTipText = "Changes are synchronized";
        this.statusIcon = "cloud_done";
        break;

      case ConnectionStateOptions.disconnected:
        this.connectionStatusMessage = "disconnected";
        this.toopTipText = "All changes are done locally";
        this.statusIcon = "cloud_off";
        break;

      case ConnectionStateOptions.connecting:
        this.connectionStatusMessage = "connecting";
        this.toopTipText = "Trying to connect. (All changes are done locally)";
        this.statusIcon = "cloud_off";
        break;

      default:
        this.connectionStatusMessage = "unkwnown";
        this.toopTipText = "Oops! Something went wrong";
        this.statusIcon = "warning";
        break;
    }
  }

  private onError(error) {
    console.log("[connection-status] subscriber error: %s", error);
  }

  private onComplete() {
    console.log("[connection-status] subscribtion end");
  }

}

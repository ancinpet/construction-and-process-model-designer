import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@aspnet/signalr';
import { IAction, StateManagerService } from '../state-management/state-manager.service';
import { jsonGuidReviver } from 'src/app/model/utils';
import { BehaviorSubject, Observable } from 'rxjs';

/** possible states of server connection */
export enum ConnectionStateOptions { disconnected, connected, connecting };

/**
 * Service using SignlalR to comunicate with the server.
 * 
 *  */
@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: HubConnection;
  private reconnecting: boolean;
  private retryAttempt: number;
  private maxRetryAttemts: number;
  private connectionState: BehaviorSubject<ConnectionStateOptions> = new BehaviorSubject(ConnectionStateOptions.disconnected);
  constructor(private stateManagerService: StateManagerService) {

    this.retryAttempt = 0;
    this.maxRetryAttemts = 0;
    this.reconnecting = false;

    this.hubConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl('https://localhost:5001/actions')
      .build();

    this.startConnection();
  }

  private startConnection() {
    if (this.retryAttempt <= this.maxRetryAttemts) {
      console.log('[HUB_CONNECTION] Starting connection...');
      this.hubConnection
        .start()
        .then(() => this.onConnectionStart())
        .catch(err => this.onConnectionFail(err));
    }
    else {
      this.reconnecting = false;
      this.connectionState.next(ConnectionStateOptions.disconnected);
    }
  }

  private onConnectionStart() {
    console.log('[HUB_CONNECTION] Connection started');
    this.connectionState.next(ConnectionStateOptions.connected);
    this.retryAttempt = 0;
    this.maxRetryAttemts = 4;
    this.reconnecting = false;
    this.hubConnection.on('ReceiveAction', (type: string, payload: string) => {
      let restoredPayload = JSON.parse(payload, jsonGuidReviver);
      this.stateManagerService.dispatchAction({ type: type, payload: restoredPayload });
    });

    this.hubConnection.onclose(err => this.onDisconnect(err));
  }

  private onConnectionFail(err) {
    console.log('[HUB_CONNECTION] Error while starting connection: ' + err.toString())
    this.reconnecting = true;
    this.retryAttempt++;
    setTimeout(() => this.startConnection(), 5000);
  }

  private onDisconnect(err: any) {
    console.log("[HUB_CONNECTION] disconnected: " + err.toString());
    this.reconnecting = true;
    this.connectionState.next(ConnectionStateOptions.connecting);
    setTimeout(() => this.startConnection(), 3000);
  }
  /**
   * send action to server via signalr
    * @param action - action to be send to server
    * 
   */
  sendAction(action: IAction) {
    if (this.hubConnection.state == HubConnectionState.Connected)
      this.hubConnection.invoke('DispatchAction', action.type, JSON.stringify(action.payload));
  }

  /**
   * returns state of the signalr connection as observable
   * @returns stream of connestion states
  */
  getConnectionStates$(): Observable<ConnectionStateOptions> {
    return this.connectionState.asObservable();
  }

}

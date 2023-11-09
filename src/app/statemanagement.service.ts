import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class StateManagementService {

  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _username: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private _userId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _ws: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  constructor() { }

  getLoginState(){
    return {
      isLoggedIn: this._isLoggedIn.asObservable(),
      username: this._username.asObservable(),
      userId: this._userId.asObservable(),
      ws: this._ws.asObservable()
    }
  }

  logIn(username: string, userId: number, isLoggedIn: boolean) : void {
    this._isLoggedIn.next(true);
    this._userId.next(userId);
    this._username.next(username);
    this._ws.next(webSocket(`ws://localhost:3000/?username=${username}`));
  }

  signOut(){
    this._isLoggedIn.next(false);
    this._userId.next(0);
    this._username.next("");
    this._ws.next(null);
  }
}

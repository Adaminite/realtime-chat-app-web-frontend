import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogInEvent } from './login/login.component';
import { webSocket } from 'rxjs/webSocket';
import { StateManagementService } from './statemanagement.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'realtime-chat-app-frontend';

  isLoggedIn: boolean = false;
  isLoggedInSubscription: any;

  constructor(private stateManagementService: StateManagementService){}

  ngOnInit() : void {
    this.isLoggedInSubscription = this.stateManagementService.getLoginState().isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy(): void {
    this.isLoggedInSubscription.unsubscribe();
  }

  signOut() : void {
    this.stateManagementService.signOut();
  }
}

import { Component } from '@angular/core';
import { LogInEvent } from './login/login.component';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'realtime-chat-app-frontend';

  isLoggedIn: boolean = false;
  username: string = "";
  ws: any = null;

  logIn(value: LogInEvent) : void {
    this.isLoggedIn = value["isSignedIn"];
    this.username = value["username"];
    this.ws = webSocket(`ws://localhost:3000/?username=${this.username}`);
  }

  signOut() : void {
    this.isLoggedIn = false;
    this.username = "";
    this.ws.complete();
  }
}

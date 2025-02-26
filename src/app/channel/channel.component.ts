import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent {
  @Input()
  messages: Array<any> = [];

  @Input()
  channelName: string = "";

  @Input()
  webSocket: any;

  @Input()
  channelId: number = 0;

  @Input()
  username: string = "";

  messageForm = this.formBuilder.group({
    message: new FormControl('')
  });

  addUserForm = this.formBuilder.group({
    username: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder){}

  onSubmit() : void {
    const message: string | null | undefined = this.messageForm.value["message"];
    this.webSocket.next({
      'channelName': this.channelName,
      'channelId': this.channelId,
      'message': message,
      'time_stamp': Date.now(),
      'event': 'broadcastMessage'
    });
  }

  async addUser(): Promise<void> {
    const username : string  = this.addUserForm.value["username"] || "";

    if(!username){
      return;
    }

    const response = await fetch(`${environment.serverURL}/channels/adduser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({
        channelName: this.channelName,
        channelId: this.channelId,
        username: username
      })
    });

    const json = await response.json();
    if(json["err"]){
      alert(json["err"]);
    }
  }
}

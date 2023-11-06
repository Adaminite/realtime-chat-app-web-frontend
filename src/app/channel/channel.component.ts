import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

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

  messageForm = this.formBuilder.group({
    message: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder){}

  onSubmit() : void {
    console.log(this.messageForm);
    const message: string | null | undefined = this.messageForm.value["message"];
    console.log("Message: " + message);
    this.webSocket.next({
      'channelName': this.channelName,
      'channelId': this.channelId,
      'message': message,
      'event': 'broadcastMessage'
    });
  }

}

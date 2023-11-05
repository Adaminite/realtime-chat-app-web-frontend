import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  @Input()
  username: string = "";

  @Input()
  userId: number = -1;

  channels: Map<string, Array<string>> = new Map<string, Array<string>>();
  channelList: string[] = [];
  currentChannel: string = "";

  @Input()
  ws: any = null;

  channelForm = this.formBuilder.group({
    channelName: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder){}
  
  ngOnInit() : void {
    this.ws.subscribe({

      next: (value: any) => {
        console.log(value);

        if(value["eventName"] === "createChannel"){
          this.channels.set(String(value["channelName"]), []);
          this.updateChannelList();
        }
        else if(value["eventName"] === "receiveMessage"){
          this.channels.get(String(value["channelName"]))?.push(String(value["message"]));
        }
      },
      error: (err: any) => {console.log("Error:" + err)},
      complete: () => {console.log("Connection closed")}
    });

    
  }

  async createRoom() : Promise<void> {
    const channelName : string | null | undefined = this.channelForm.value["channelName"];
    console.log(JSON.stringify({"channelName": channelName}))
    const response = await fetch('http://localhost:3000/channels/create', {
      method: "POST",
      mode: 'cors',
      headers : {
        "Content-Type": "application/json"
      },
      body : JSON.stringify({
        channelName,
        userId: this.userId,
        username: this.username
      })
    });

    const json = await response.json();
    console.log(json);
  }

  updateChannelList() : void {
    this.channelList = Array.from(this.channels.keys());
  }

  getCurrentChannelMessages() : Array<string> {
    return (this.channels.get(this.currentChannel)) || [];
  }

  toggleChannel(newChannel: string) : void {
    this.currentChannel = newChannel;
  }

}

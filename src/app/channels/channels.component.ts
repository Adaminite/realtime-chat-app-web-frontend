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
  userId: number = 0;

  channels: Map<number, Array<any>> = new Map<number, Array<any>>();
  channelIdToName: Map<number, string> = new Map<number, string>();

  channelList: number[] = [];
  currentChannel: number = 0;

  @Input()
  ws: any = null;

  channelForm = this.formBuilder.group({
    channelName: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder){}
  
  async ngOnInit() : Promise<void> {
    try{
      const response = await fetch('http://localhost:3000/users/channelswithmessages/' + this.userId, {
        mode: "cors",
        method: "GET",
        headers: {
          "Accept-Type": "application/json"
        }
      });
  
      const responseJson = await response.json();
      console.log(responseJson);

      const responseChannels = responseJson["channels"];
      responseChannels.forEach((channel: any) => {
        this.channels.set(Number(channel["channelId"]), channel["messages"]);
        this.channelIdToName.set(Number(channel["channelId"]), channel["channelName"]);
      });
      this.updateChannelList();
    } catch(err){
      alert("Error loading channels. Please refresh to try again");
    }


  

    this.ws.subscribe({

      next: (value: any) => {
        console.log(value);

        if(value["eventName"] === "createChannel"){
          this.channels.set(value["channelId"], []);
          this.channelIdToName.set(value["channelId"], value["channelName"]);
          this.updateChannelList();
        }
        else if(value["eventName"] === "receiveMessage"){
          this.channels.get(value["channelId"])?.push(String(value["message"]));
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
    console.log(this.channelList);
  }

  getCurrentChannelMessages() : Array<string> {
    return (this.channels.get(this.currentChannel)) || [];
  }

  getCurrentChannelName(): string {
    return this.channelIdToName.get(this.currentChannel) || "";
  }

  toggleChannel(newChannel: number) : void {
    this.currentChannel = newChannel;
  }

}

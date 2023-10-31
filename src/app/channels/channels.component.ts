import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-test',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  messageForm = this.formBuilder.group({
    message: new FormControl('')
  });

  messages: Array<string> = [];
  channels: Array<string> = [];

  ws = webSocket("ws://localhost:3000/?username=johndoe");

  channelForm = this.formBuilder.group({
    channelName: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder){}
  
  ngOnInit() : void {
    
    this.ws.subscribe({
      next: (value: any) => {
        console.log(value);

        if(value["eventName"] && value["eventName"] === "createChannel"){
          this.channels.push(String(value["channelName"]));
        }
        else{
          this.messages.push(String(value["message"]));
        }

        console.log("Channels: " + this.channels);
        console.log("Messages: " + this.messages);
      },
      error: (err) => {console.log("Error:" + err)},
      complete: () => {console.log("Connection closed")}
    });
    

    /*
    this.ws.addEventListener('message', (event: MessageEvent) => {
      console.log(event);
    });
    */
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
      body : JSON.stringify({channelName})
    });

    const json = await response.json();
    console.log(json);
  }
  /*
  sendMessage(){

  }
 */ 
  onSubmit() : void {
    console.log(this.messageForm);
    const message: string | null | undefined = this.messageForm.value["message"];
    console.log("Message: " + message);
    //this.messages.push();
    this.ws.next({'message': message});
    //this.ws.send(String(message));
  }
  
}

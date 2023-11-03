import { Component, Output, EventEmitter} from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';

export interface LogInEvent{
  isSignedIn: boolean,
  username: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output()
  logInEvent: EventEmitter<LogInEvent> = new EventEmitter<LogInEvent>();

  logInForm = this.formBuilder.group({
    username: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder){}
  
  signIn() : void {
    const username : string | null | undefined = this.logInForm.value["username"]
    if(username){
      this.logInEvent.emit({
        isSignedIn: true,
        username: username
      });
    }
  }
}

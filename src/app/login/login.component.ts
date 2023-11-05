import { Component, Output, EventEmitter} from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';

export interface LogInEvent{
  isSignedIn: boolean,
  username: string,
  userId: number
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output()
  logInEvent: EventEmitter<LogInEvent> = new EventEmitter<LogInEvent>();

  errorMessage: string = '';
  logInForm = this.formBuilder.group({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder){}
  
  async signIn() : Promise<void> {
    const username : string | null | undefined = this.logInForm.value["username"];
    const password: string | null | undefined = this.logInForm.value["password"];
    
    if(!username || !password){
      this.errorMessage = "Missing username or password";
      return;
    }

    const response = await fetch('http://localhost:3000/users/login', {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const json = await response.json();

    if(json["err"]){
      this.errorMessage = json["err"];
    } else{
      this.logInEvent.emit({
        isSignedIn: true,
        username: json["username"],
        userId: json["user_id"]
      });
    }

    this.logInForm.reset();
  }
}

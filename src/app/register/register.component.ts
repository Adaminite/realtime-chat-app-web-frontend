import { Component, Output } from '@angular/core';
import { Form, FormBuilder, FormControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { LogInEvent } from '../login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output()
  registerEvent: EventEmitter<LogInEvent> = new EventEmitter<LogInEvent>();
  
  errorMessage: string = '';

  registrationForm = this.formBuilder.group({
    username: new FormControl(''),
    password: new FormControl(''),
    passwordConfirm: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder){}

  async register() : Promise<void> {
    console.log(this.registrationForm.value);
    const data = this.registrationForm.value;

    const username : string | null | undefined = data["username"];
    const password : string | null | undefined = data["password"];
    const confirmPassword : string | null | undefined = data["passwordConfirm"];

    if(!password || !confirmPassword || password !== confirmPassword){
      this.errorMessage = "Potentially missing a password field or passwords do not match";
      this.registrationForm.controls.password.reset();
      this.registrationForm.controls.passwordConfirm.reset();
    }
    else if(!username){
      this.errorMessage = "Invalid username";
      this.registrationForm.reset();
    }
    else{
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const json = response.json();
      
      console.log(json);
      
      this.registrationForm.reset();
    }
    
  }
}

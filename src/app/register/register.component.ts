import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { LogInEvent } from '../login/login.component';
import { StateManagementService } from '../statemanagement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Output()
  registerEvent: EventEmitter<LogInEvent> = new EventEmitter<LogInEvent>();
  
  errorMessage: string = '';

  registrationForm = this.formBuilder.group({
    username: new FormControl(''),
    password: new FormControl(''),
    passwordConfirm: new FormControl('')
  });

  isLoggedIn: boolean = false;

  isLoggedInSubscription: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private stateManagementService: StateManagementService){}

  ngOnInit(): void {
    const observables = this.stateManagementService.getLoginState();
    this.isLoggedInSubscription = observables.isLoggedIn.subscribe(async (isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if(isLoggedIn){
        await this.router.navigateByUrl('/channels');
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoggedInSubscription.unsubscribe();
  }

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
    } else if(!username){
      this.errorMessage = "Invalid username";
      this.registrationForm.reset();
    } else{
      const response = await fetch("http://localhost:3000/users/register", {
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
      } else {
        /*
        this.registerEvent.emit({
          isSignedIn: true,
          userId: json["user_id"],
          username: json["username"]
        });
        */

        this.stateManagementService.logIn(json["username"], json["user_id"], true)
      }

      this.registrationForm.reset();
    }
    
  }
}

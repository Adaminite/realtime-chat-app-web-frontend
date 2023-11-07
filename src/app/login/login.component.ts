import { Component, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { StateManagementService } from '../statemanagement.service';
import { Router } from '@angular/router';

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
export class LoginComponent implements OnInit, OnDestroy {

  @Output()
  logInEvent: EventEmitter<LogInEvent> = new EventEmitter<LogInEvent>();

  errorMessage: string = '';
  logInForm = this.formBuilder.group({
    username: new FormControl(''),
    password: new FormControl('')
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
      this.stateManagementService.logIn(json["username"], json["user_id"], true)
    }

    this.logInForm.reset();
  }
}

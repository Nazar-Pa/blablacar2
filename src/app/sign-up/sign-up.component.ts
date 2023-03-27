import { Component, OnDestroy, OnInit } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../database.service';
import { AuthenticationService } from '../services/authentication.service';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password != confirmPassword) {
      return {
        passwordsDontMatch: true
      }
    }
    return null;
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  user$ = this.authService.currentUser$;
  url!: string;
  displayName!: string;

  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: passwordMatchValidator() })

  constructor(private authService: AuthenticationService,
    private databaseService: DatabaseService,
    private router: Router) { }

  ngOnInit(): void {
  
  }

  submit() {
    if (!this.signUpForm.valid) return;

    const { name, email, password } = this.signUpForm.value;
    this.authService.signUp(name, email, password).subscribe(res => {
      this.router.navigate([''])
      updateProfile(res.user, { displayName: name });
      this.databaseService.createUser({name, email, u_id: res.user.uid}).subscribe();
      this.authService.getName(name);

      if(this.url == "publish-ride") {
        this.router.navigate(['/publish-ride'])
        this.url = '';
      } else this.router.navigate([''])
    })
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  NgForm,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private fb: FormBuilder, private data: DataService, private router : Router) {}

  ngOnInit(): void {
    this.allowLogin = true;
  }

  confirmPasswordCheckValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    let password = control.get('password');
    let confirmPassword = control.get('confirmPassword');

    return password &&
      confirmPassword &&
      password.value !== confirmPassword.value
      ? { confirmPasswordCheck: true }
      : null;
  };

  forgotPasswordForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}'
          ),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.confirmPasswordCheckValidator }
  );


  signUpForm = new FormGroup(
    {
      firstName: new FormControl<string>('', [Validators.required,]),
      lastName: new FormControl<string>('', [Validators.required]),
      contactNumber: new FormControl<number>(
        0,
        [
          Validators.required,
          Validators.min(6000000000),
          Validators.max(9999999999),
        ],
      ),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>(
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}'
          ),
        ],
      ),
      confirmPassword: new FormControl<string>('', [Validators.required]),
    },
    { validators: [this.confirmPasswordCheckValidator] }
  );

  get firstName() {
    return this.signUpForm.get('firstName');
  }
  get lastName() {
    return this.signUpForm.get('lastName');
  }
  get contactNumber() {
    return this.signUpForm.get('contactNumber');
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
  allowLogin: boolean = true;

  openSignUp() {
    this.allowLogin = false;
  }

  openLogin() {
    this.allowLogin = true;
  }

  login(ref: NgForm) {
    console.log(ref.value);
    this.data.login(ref.value).subscribe({
      next: (result) => {
        console.log(result)
        sessionStorage.clear()
        sessionStorage.setItem("id",result.id)
        sessionStorage.setItem("token",result.token)
        sessionStorage.setItem("email",result.email)
        sessionStorage.setItem("name",result.name)
        sessionStorage.setItem("role",result.role)
        alert("/"+result.role);
        this.router.navigateByUrl("/"+result.role)
      },
      error: (error) => {
        alert(error)
      },
    });
  } 

  signUp() {
    let obj = {
      firstName : this.firstName?.value,
      lastName : this.lastName?.value,
      password : this.password?.value,
      email_address : this.email?.value,
      contact_number : this.contactNumber?.value,
    }
    
    this.data.signup(obj).subscribe({
      next : (result)=>{
        alert(result.message)
      },
      error : (error)=>{
        alert(error)
      }
    })
  }

  updatePassword() {
    this.data.resetPassword(this.forgotPasswordForm.value).subscribe({
      next : (result)=>{
        alert(result.message)
      },
      error : (error)=>{
        alert(error)
      }
    })
  }
}

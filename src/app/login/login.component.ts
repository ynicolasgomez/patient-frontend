import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogin: boolean = true;
  formLogin!: FormGroup;
  constructor(private fb: FormBuilder, private loginService: LoginService,) { }

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

Login(): void {
  if (this.formLogin.invalid) {
    this.formLogin.markAllAsTouched();
    return;
  }

  this.loginService.login(this.formLogin.value).subscribe({
    next: (data: any) => {
      console.log('Login exitoso:', data);
      this.isLogin = false;
    },
    error: (error: any) => {
      console.error('Error en el login:', error);
    }
  });
}


}

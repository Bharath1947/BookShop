import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, Subscription } from 'rxjs';
import { Post } from '../models/post.model';
import { PostService } from '../services/post.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AuthRespData } from '../models/authResp.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./app.component.css'],
})
export class AuthComponent {
  loginOption: boolean = false;
  loadspinner: boolean | unknown = null;
  error: string | unknown = null;
  constructor(private authserve: AuthService, private router: Router) {}
  onSwitching() {
    this.loginOption = !this.loginOption;
    console.log(this.loginOption);
  }
  onSubmit(appform: NgForm) {
    let cmnobserve: Observable<AuthRespData>;
    this.loadspinner = true;
    if (!appform.valid) {
      return;
    }
    console.log(appform.value);
    if (this.loginOption) {
      cmnobserve = this.authserve.login(
        appform.value.email,
        appform.value.password
      );
    } else {
      cmnobserve = this.authserve.signUp(
        appform.value.email,
        appform.value.password
      );
    }
    cmnobserve.subscribe(
      (resp) => {
        console.log(resp);
        this.router.navigate(['/books']);
      },
      (errormesage) => {
        console.log(errormesage);
        this.error = errormesage;
      }
    );
    appform.reset();
    this.loadspinner = null;
    this.error = null;
  }
}

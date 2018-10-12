import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService } from '../../../core/http/auth.service';

@Component({
  selector : 'app-reset',
  templateUrl : './reset.component.html',
  styleUrls : ['./reset.component.scss']
})

export class ResetComponent implements OnInit {

  public form: FormGroup;
  public _email: string = '';
  public _accessCode: string = '';

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private spinnerService: Ng4LoadingSpinnerService,
              private authService: AuthService,
              private toast: ToasterService) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      let query: any = {...params.keys, ...params};
      this._email = query.params.email || '';
      this._accessCode = query.params.accessCode || '';
    });

    this.form = this.fb.group({
      email : [this._email, [Validators.required, Validators.email]],
      accessCode : [this._accessCode, [Validators.required]],
      new_password : ['', [Validators.required, Validators.minLength(6)]],
      confirm_password : ['', [Validators.required]]
    });
  }

  get data(): any { return this.form.value; }

  set data(data: any) { this.form.patchValue(data); }

  get email(): any { return this.form.get('email'); }

  get accessCode(): any { return this.form.get('accessCode'); }

  get new_password(): any { return this.form.get('new_password'); }

  get confirm_password(): any { return this.form.get('confirm_password'); }

  /**
   * Submit Form
   */
  public onSubmit() {
    this.spinnerService.show();
    this.authService.reset(this.data).subscribe(
      (resp: any) => {
        if (!resp.status) {
          this.toast.pop('warning', resp.name, resp.msg);
          return;
        }

        this.toast.pop('success', 'Success', resp.msg);
        setTimeout(() => {
          this.router.navigate(['/auth/login']).catch().then();
        }, 400);
      },

      (err: any) => this.toast.pop('error', 'Error', err.message),
      () => this.hideSpinner()
    );
  }

  /**
   * Hide loading spinner with a timeout
   */
  private hideSpinner() {
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1200);
  }
}

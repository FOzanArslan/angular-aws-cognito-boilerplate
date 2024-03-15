import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession
} from "amazon-cognito-identity-js";
import { environment } from "src/environments/environment";
import { SnackbarService } from "src/app/core/services/snackbar.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  loginForm!: FormGroup;
  confirmationForm!: FormGroup;
  confirmationStep = false;
  cognitoUser!: CognitoUser;

  constructor(private fb: FormBuilder, private router: Router, private snackbar: SnackbarService) {
    this.loginForm = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(8)])
    });
    this.confirmationForm = this.fb.group({
      code: new FormControl("", [Validators.required, Validators.minLength(6)]),
      newPassword: new FormControl("", [Validators.required, Validators.minLength(8)])
    });
  }

  login() {
    let authenticationDetails = new AuthenticationDetails({
      Username: this.loginForm.value.email,
      Password: this.loginForm.value.password
    });
    let userPool = new CognitoUserPool({
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    });
    let userData = { Username: this.loginForm.value.email, Pool: userPool };
    this.cognitoUser = new CognitoUser(userData);
    this.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session: CognitoUserSession) => {
        return new Promise((resolve, reject) => {
          this.cognitoUser.getUserAttributes((err: any, result: any) => {
            if (err) {
              this.snackbar.show(err.message || JSON.stringify(err), "danger");
              reject(err.message || JSON.stringify(err));
              return;
            }
            const userDetails = {} as any;
            for (let i = 0; i < result.length; i++) {
              userDetails[result[i].getName().replace("custom:", "")] = result[i].getValue();
            }
            localStorage.setItem("userDetails", JSON.stringify(userDetails));
            resolve("Authenticated");
            this.router.navigate(["home"]);
          });
        });
      },
      onFailure: (err) => {
        this.snackbar.show(err.message || JSON.stringify(err), "danger");
      }
    });
  }

  forgotPassword() {
    if (!this.loginForm.value.email) {
      this.snackbar.show("Please enter your e-mail address first", "warning");
      return;
    }
    var userPool = new CognitoUserPool({
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    });
    let userData = { Username: this.loginForm.value.email, Pool: userPool };
    this.cognitoUser = new CognitoUser(userData);
    this.cognitoUser.forgotPassword({
      onSuccess: (result) => {
        this.snackbar.show(
          "Please enter the confirmation code from your e-mail and the new desired password.",
          "success"
        );
        this.confirmationStep = true;
      },
      onFailure: (err) => {
        this.snackbar.show(err.message || JSON.stringify(err), "danger");
      }
    });
  }

  confirmPassword() {
    this.cognitoUser.confirmPassword(
      this.confirmationForm.value.code,
      this.confirmationForm.value.newPassword,
      {
        onSuccess: (result) => {
          this.snackbar.show("Your password is updated.", "success");
          this.confirmationStep = false;
        },
        onFailure: (err) => {
          this.snackbar.show(err.message || JSON.stringify(err), "danger");
        }
      }
    );
  }
}

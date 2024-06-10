import { Injectable, OnInit } from "@angular/core";
import { CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class UserTokenService {
  idToken: string = "";
  cognitoUser: any;
  constructor() {}

  async generateRefreshToken(): Promise<string> {
    let session = await this.getSession();
    await this.refreshSession(session);
    return this.idToken;
  }

  private refreshSession(session: CognitoUserSession): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cognitoUser.refreshSession(
        session.getRefreshToken(),
        (err: Error | null, session: CognitoUserSession | null) => {
          if (err) {
            console.error("Error refreshing session:", err);
            reject(err);
          } else {
            if (session !== null) {
              this.idToken = session.getIdToken().getJwtToken();
            }
            resolve();
          }
        }
      );
    });
  }

  getSession(): Promise<CognitoUserSession> {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    this.cognitoUser = userPool.getCurrentUser();

    return new Promise((resolve, reject) => {
      this.cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          reject(err);
        } else {
          resolve(session);
        }
      });
    });
  }
}

import { Injectable } from "@angular/core";
import { CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class IsLoggedInService {
  isLoggedIn(): Promise<boolean> {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (!cognitoUser) {
        reject("Could not retrieve current user");
        return;
      }
      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          reject(err.message || JSON.stringify(err));
          return;
        }
        const res = session.isValid();
        if (res) {
          resolve(res);
        } else {
          reject("Session is not valid");
        }
      });
    });
  }
}

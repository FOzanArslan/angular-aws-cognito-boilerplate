import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { UserTokenService } from "./user-token.service";

@Component({
  selector: "app-iframe-chat",
  templateUrl: "./iframe-chat.component.html",
  styleUrls: ["./iframe-chat.component.scss"]
})
export class IFrameChatComponent {
  userDetails: any;
  userID: string = "";
  userMail: string = "";
  url: any;
  safeURL: SafeHtml | undefined;
  @Input() showChat: boolean = false;
  @Input() idToken: string = "";
  @Output() idTokenChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() showChatChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  cognitoUser: any;

  constructor(private sanitizer: DomSanitizer) {
    const user = localStorage.getItem("userDetails");
    this.userDetails = JSON.parse(user || "{}");
    this.userID = this.userDetails.sub;
    this.userMail = this.userDetails.email;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["idToken"]) {
      const currentToken = changes["idToken"].currentValue;
      this.idToken = currentToken;
      this.url = new URL("http://localhost:4200/chat");
      this.url.searchParams.set("user_token", this.idToken);
      this.url.searchParams.set("user_id", this.userID);
      this.url.searchParams.set("user_mail", this.userMail);
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.url.href);
    }
  }
}

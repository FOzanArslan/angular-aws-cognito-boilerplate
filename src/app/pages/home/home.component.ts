import { Component } from "@angular/core";
import { faCircle, faMessage } from "@fortawesome/free-solid-svg-icons";
import { UserTokenService } from "src/app/core/components/iframe-chat/user-token.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
  constructor(private tokenService: UserTokenService) {}
  faMessage = faMessage;
  faCircle = faCircle;
  showChat = false;
  idToken = "";
  async toggleChat() {
    if (!this.showChat) {
      this.idToken = await this.tokenService.generateRefreshToken();
    }
    this.showChat = !this.showChat;
  }
}

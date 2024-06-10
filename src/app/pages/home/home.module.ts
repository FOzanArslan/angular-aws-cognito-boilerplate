import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { IFrameChatComponent } from "src/app/core/components/iframe-chat/iframe-chat.component";

@NgModule({
  declarations: [HomeComponent, IFrameChatComponent],
  imports: [CommonModule, HomeRoutingModule]
})
export class HomeModule {}

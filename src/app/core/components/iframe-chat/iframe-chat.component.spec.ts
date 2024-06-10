import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IFrameChatComponent } from "./iframe-chat.component";

describe("SnackbarComponent", () => {
  let component: IFrameChatComponent;
  let fixture: ComponentFixture<IFrameChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IFrameChatComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IFrameChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

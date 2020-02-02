import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChampionComponent } from './champion/champion.component';
import { MatchComponent } from './match/match.component';
import { PositionComponent } from './position/position.component';
import {FormsModule} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    ChampionComponent,
    MatchComponent,
    PositionComponent
  ],
  imports: [
      BrowserModule,
      FormsModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

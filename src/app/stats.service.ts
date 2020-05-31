import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private cookieName = 'LolRoleGuesser-Stats';

  public wins = 0;
  public losses = 0;
  public currentStreak = 0;
  public isWinningStreak = true; // If the current streak is for wins or losses
  public bestWinningStreak = 0;
  public tier = 'Gold';

  tierChange: Subject<string> = new Subject<string>();
  winsChange: Subject<number> = new Subject<number>();
  lossesChange: Subject<number> = new Subject<number>();

  constructor(private cookieService: CookieService) {
    try {
      const stats = JSON.parse(cookieService.get(this.cookieName));
      this.wins = stats.wins;
      this.losses = stats.losses;
      this.tier = stats.tier;
      this.currentStreak = stats.currentStreak;
      this.isWinningStreak = stats.isWinningStreak;
      this.bestWinningStreak = stats.bestWinningStreak;
    } catch (e) {
      console.error('Error while trying to load stats.');
    }

    this.tierChange.subscribe(value => { this.tier = value; this.updateCookie(); });
    this.winsChange.subscribe(value => { this.wins = value; this.updateCookie(); });
    this.lossesChange.subscribe(value => { this.losses = value; this.updateCookie(); });
  }

  private updateCookie() {
    this.cookieService.set(this.cookieName, JSON.stringify({
      wins: this.wins,
      losses: this.losses,
      currentStreak: this.currentStreak,
      isWinningStreak: this.isWinningStreak,
      bestWinningStreak: this.bestWinningStreak,
      tier: this.tier
    }));
  }

  setTier(tier: string) {
    this.tierChange.next(tier);
  }

  addWin() {
    const wins = this.wins + 1;
    // Streak
    if (this.isWinningStreak) {
      this.currentStreak++;
      this.bestWinningStreak = Math.max(this.bestWinningStreak, this.currentStreak);
    } else {
      this.isWinningStreak = true;
      this.currentStreak = 1;
    }
    this.winsChange.next(wins);
  }

  addLoss() {
    const losses = this.losses + 1;
    // Streak
    if (this.isWinningStreak) {
      this.isWinningStreak = false;
      this.currentStreak = 1;
    } else {
      this.currentStreak++;
    }
    this.lossesChange.next(losses);
  }
}

import {Component, ElementRef} from '@angular/core';
import {StatsService} from './stats.service';
import {TIERS} from './riotapi.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public TIERS = TIERS;
  public tierSelectorToggle = false;

  constructor(public statsService: StatsService) { }

  title = 'LoL Role Guesser';

  toggleTierSelector() {
    this.tierSelectorToggle = !this.tierSelectorToggle;
  }

  selectTier(tier: string) {
    this.statsService.setTier(tier);
    this.tierSelectorToggle = false;
  }
}

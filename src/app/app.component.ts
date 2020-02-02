import {Component, ElementRef, OnInit} from '@angular/core';
import {StatsService} from './stats.service';
import {TIERS} from './riotapi.types';
import {PreloaderService} from './preloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public TIERS = TIERS;
  public tierSelectorToggle = false;

  constructor(public statsService: StatsService, private preloaderService: PreloaderService) { }

  title = 'LoL Role Guesser';

  ngOnInit() {
    for (const tier of TIERS) {
      this.preloaderService.loader.next({url: `/assets/images/emblems/Emblem_${tier}.png`, type: 'image'});
    }
  }
  toggleTierSelector() {
    this.tierSelectorToggle = !this.tierSelectorToggle;
  }

  selectTier(tier: string) {
    this.statsService.setTier(tier);
    this.tierSelectorToggle = false;
  }
}

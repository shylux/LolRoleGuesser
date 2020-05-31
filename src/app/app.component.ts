import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {StatsService} from './stats.service';
import {TIERS} from './riotapi.types';
import {PreloaderService} from './preloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public TIERS = TIERS;
  public tierSelectorToggle = false;

  constructor(public statsService: StatsService, private preloaderService: PreloaderService, public elementRef: ElementRef) {
    for (const tier of TIERS) {
      this.preloaderService.loader.next({url: `/assets/images/emblems/Emblem_${tier}.png`, type: 'image'});
    }
  }

  title = 'LoL Role Guesser';

  ngAfterViewInit() {
    const heading = $('h1', this.elementRef.nativeElement).get(0);
    fitOnOneLine(heading);
    const observer = new ResizeObserver(() => {
      fitOnOneLine(heading);
    }).observe(heading);
  }

  toggleTierSelector() {
    this.tierSelectorToggle = !this.tierSelectorToggle;
  }

  selectTier(tier: string) {
    this.statsService.setTier(tier);
    this.tierSelectorToggle = false;
  }
}

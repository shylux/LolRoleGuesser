import {Component, Input, OnInit} from '@angular/core';
import {POSITION_NAMES, Positions} from '../riotapi.types';
import {StatsService} from '../stats.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {

  constructor(public statsService: StatsService) { }

  @Input()
  protected position: Positions;

  public name: string;

  ngOnInit() {
    this.name = POSITION_NAMES[this.position];
  }

  getImgSrc() {
    let tier = this.statsService.tier;
    if (tier === 'Platinum') { tier = 'Plat'; }
    return `assets/images/positions/Position_${tier}-${this.name}.png`;
  }
}

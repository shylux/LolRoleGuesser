import {Component, Input, OnInit} from '@angular/core';
import {POSITION_NAMES, Positions} from '../riotapi.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {

  constructor() { }

  @Input()
  protected tier = 'Iron';

  @Input()
  protected position: Positions;

  protected name: string;

  ngOnInit() {
    this.name = POSITION_NAMES[this.position];
  }

  getImgSrc() {
    let tier = this.tier;
    if (tier === 'Platinum') { tier = 'Plat'; }
    return `assets/images/positions/Position_${tier}-${this.name}.png`;
  }
}

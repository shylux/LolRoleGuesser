import { Component, OnInit } from '@angular/core';
import {RiotAPIService} from '../riotapi.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  hero = 'Aatrox';

  constructor(private apiService: RiotAPIService) { }

  ngOnInit() {
  }

  getName(): string {
    return this.apiService.getHero(this.hero);
  }

}

import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RiotAPIService} from '../riotapi.service';
import {IChampion, IParticipant} from '../riotapi.types';

@Component({
  selector: 'app-champion',
  templateUrl: './champion.component.html',
  styleUrls: ['./champion.component.scss']
})
export class ChampionComponent implements OnInit {

  @Input()
  participant: IParticipant;

  champion: IChampion;
  iconUrl: string;

  @Output() moveUpEvent = new EventEmitter();
  @Output() moveDownEvent = new EventEmitter();

  constructor(private apiService: RiotAPIService, public elementRef: ElementRef) { }

  ngOnInit() {
    this.apiService.getChampion(this.participant.championId).then((champ) => {
      this.champion = champ;
      this.iconUrl = this.apiService.getChampionIconUrl(champ);
    });
  }
}

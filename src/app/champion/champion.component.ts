import {Component, Input, OnInit} from '@angular/core';
import {IChampion, IParticipant, RiotAPIService} from '../riotapi.service';

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

  constructor(private apiService: RiotAPIService) { }

  ngOnInit() {
    this.apiService.getChampion(this.participant.championId).then((champ) => {
      this.champion = champ;
      this.iconUrl = this.apiService.getChampionIconUrl(champ);
    });
  }
}

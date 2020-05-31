import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
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

  constructor(private apiService: RiotAPIService, public elementRef: ElementRef) {
  }

  ngOnInit() {
    this.apiService.getChampion(this.participant.championId).then((champ) => {
      this.champion = champ;
      this.iconUrl = this.apiService.getChampionIconUrl(champ);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const icon = $('.icon', this.elementRef.nativeElement);
    icon.width(icon.height());

    // resize text
    fitOnOneLine($('.name', this.elementRef.nativeElement).get(0));
  }
}

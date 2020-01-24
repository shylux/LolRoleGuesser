import {Component, ElementRef} from '@angular/core';
import {StatsService} from './stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public statsService: StatsService) { }

  title = 'LoL Role Guesser';
}

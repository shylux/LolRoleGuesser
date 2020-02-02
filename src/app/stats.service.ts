import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  public wins = 0;
  public losses = 0;
  public tier = 'Gold';

  tierChange: Subject<string> = new Subject<string>();

  constructor() {
    this.tierChange.subscribe(value => this.tier = value);
  }

  setTier(tier: string) {
    this.tierChange.next(tier);
  }

}

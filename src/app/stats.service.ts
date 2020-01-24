import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor() { }

  public wins = 0;
  public losses = 0;
}

import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {

  loader: Subject<PreloadType> = new Subject<PreloadType>();

  constructor() {
    this.loader.subscribe(value => {
      $(() => {
        $('head').append($('<link rel="preload"/>').attr('href', value.url).attr('as', value.type));
      });
    });
  }
}

export class PreloadType {
  url: string;
  type: string;
}

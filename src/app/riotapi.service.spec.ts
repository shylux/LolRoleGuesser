import { TestBed } from '@angular/core/testing';

import { RiotAPIService } from './riotapi.service';

describe('RiotapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RiotAPIService = TestBed.get(RiotAPIService);
    expect(service).toBeTruthy();
  });
});

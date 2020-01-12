import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: ChampionComponent;
  let fixture: ComponentFixture<ChampionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChampionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

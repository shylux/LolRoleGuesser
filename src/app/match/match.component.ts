import {Component, ElementRef, OnInit} from '@angular/core';
import {RiotAPIService, } from '../riotapi.service';
import * as $ from 'jquery';
import {TIERS, DIVISIONS, IMatch, IParticipant, Positions, ITimeline, getPosition} from '../riotapi.types';
import {StatsService} from '../stats.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  constructor(private elementRef: ElementRef, private apiService: RiotAPIService, private statsService: StatsService) {
    statsService.tierChange.subscribe(tier => {
      this.searchMatch();
    });
  }

  private static LANE_ORDER = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM'];
  private static ROLE_ORDER = ['SOLO', 'DUO_CARRY', 'DUO', 'NONE', 'DUO_SUPPORT'];
  public TIERS = TIERS;
  public DIVISIONS = DIVISIONS;

  selectedDivision = 'I';

  protected wins = 0;
  protected losses = 0;

  public match: IMatch;
  protected lockedIn = false;
  protected result: boolean;
  public complete = false;
  public teamA: IParticipant[] = [];
  public teamB: IParticipant[] = [];
  public positionsB: Positions[] = [];

  // drag n drop
  protected dragEl;
  protected dragCurrentHover;

  ngOnInit() {
    this.searchMatch();
  }

  searchMatch() {
    delete this.match;
    delete this.teamA;
    delete this.positionsB;
    delete this.teamB;
    delete this.result;
    this.apiService.getRandomGame(this.statsService.tier, this.selectedDivision).then(this.displayMatch.bind(this));
  }

  displayMatch(match: IMatch) {
    this.match = match;
    this.lockedIn = false;
    this.complete = false;
    this.teamA = [];
    this.teamB = [];
    this.positionsB = [];
    for (const participant of match.participants) {
      if (participant.teamId === 100) { this.teamA.push(participant); }
      if (participant.teamId === 200) {
        this.teamB.push(participant);
        this.positionsB.push(getPosition(participant.timeline));
      }
    }
    this.teamA.sort((a, b) => this.roleSorter(a.timeline, b.timeline));
    this.positionsB.sort();
  }

  lockIn() {
    const championElements = $('.teamB', this.elementRef.nativeElement).removeClass('idiot correct').toArray();
    const ids = championElements.map((e) => $(e).data('participant-id'));
    const positions: Positions[] = ids.map((id) => {
      return getPosition(this.getParticipant(id).timeline);
    });

    let success = true;
    positions.forEach((pos, index) => {
      if (pos !== this.positionsB[index]) {
        success = false;
        $(championElements[index]).addClass('idiot');
      } else {
        $(championElements[index]).addClass('correct');
      }
    });
    if (!this.lockedIn) {
      if (success) {
        this.result = true;
        this.statsService.wins++;
      } else {
        this.result = false;
        this.statsService.losses++;
      }
      this.lockedIn = true;
    }
    if (success) { this.complete = true; }
  }

  roleSorter(a: ITimeline, b: ITimeline) {
    const laneDiff = MatchComponent.LANE_ORDER.indexOf(a.lane) - MatchComponent.LANE_ORDER.indexOf(b.lane);
    if (laneDiff !== 0) { return laneDiff; }
    return MatchComponent.ROLE_ORDER.indexOf(a.role) - MatchComponent.ROLE_ORDER.indexOf(b.role);
  }

  getParticipant(id: number) {
    for (const part of this.match.participants) {
      if (part.participantId === id) { return part; }
    }
    throw Error('Invalid participant number: ' + id);
  }

  dragStart(e: DragEvent) {
    this.dragEl = e.target;
    e.dataTransfer.effectAllowed = 'move';
  }
  dragOver(e: DragEvent) {
    e.preventDefault();
    if (!this.dragEl) { return; }
    $('.drag-over', this.elementRef.nativeElement).removeClass('drag-over');
    if (this.dragEl === e.target) {
      delete this.dragCurrentHover;
      return;
    }
    this.dragCurrentHover = $(e.target).closest('.teamB').addClass('drag-over').get(0);
  }
  dragEnd(e: DragEvent) {
    e.preventDefault();
    if (!this.dragEl) { return; }
    $('.drag-over', this.elementRef.nativeElement).removeClass('drag-over');
    if (this.dragCurrentHover) {
      const parent = this.dragEl.parentNode;
      const nextNode = this.dragEl.nextSibling === this.dragCurrentHover ? this.dragEl : this.dragEl.nextSibling;
      parent.insertBefore(this.dragEl, this.dragCurrentHover);
      parent.insertBefore(this.dragCurrentHover, nextNode);
      this.dragEl = undefined;
    }
  }
}

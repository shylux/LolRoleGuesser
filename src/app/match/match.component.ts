import {Component, ElementRef, OnInit} from '@angular/core';
import {RiotAPIService,} from '../riotapi.service';
import * as $ from 'jquery';
import {TIERS, DIVISIONS, IMatch, IParticipant, Positions, ITimeline} from '../riotapi.types';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  constructor(private elementRef: ElementRef, private apiService: RiotAPIService) { }

  private static LANE_ORDER = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM'];
  private static ROLE_ORDER = ['SOLO', 'DUO_CARRY', 'DUO', 'NONE', 'DUO_SUPPORT'];
  public TIERS = TIERS;
  public DIVISIONS = DIVISIONS;

  selectedTier = 'Gold';
  selectedDivision = 'I';

  protected match: IMatch;
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
    this.apiService.getRandomGame(this.selectedTier.toUpperCase(), this.selectedDivision).then(this.displayMatch.bind(this));
  }

  displayMatch(match: IMatch) {
    this.match = match;
    this.teamA = [];
    this.teamB = [];
    this.positionsB = [];
    for (const participant of match.participants) {
      if (participant.teamId === 100) { this.teamA.push(participant); }
      if (participant.teamId === 200) {
        this.teamB.push(participant);
        this.positionsB.push(this.getPosition(participant.timeline));
      }
    }
    this.teamA.sort((a, b) => {return this.roleSorter(a.timeline, b.timeline)});
    this.positionsB.sort();
  }

  lockIn() {
    const championElements = $('.teamB', this.elementRef.nativeElement).removeClass('idiot correct').toArray();
    const ids = championElements.map((e) => $(e).data('participant-id'));
    const positions: Positions[] = ids.map((id) => {
      return this.getPosition(this.getParticipant(id).timeline);
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
  }

  getPosition(timeline: ITimeline): Positions {
    switch (timeline.lane) {
      case 'TOP':
        return Positions.TOP;
      case 'JUNGLE':
        return Positions.JUNGLE;
      case 'MIDDLE':
        return Positions.MID;
      case 'BOTTOM':
      default:
        if (timeline.role === 'DUO_SUPPORT') {
          return Positions.SUPPORT;
        } else {
          return Positions.BOT;
        }
    }
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

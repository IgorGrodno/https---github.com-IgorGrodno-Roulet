import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';

interface prizeForList {
  id: number;
  prize: prize;
}
import { PrizeComponent } from "../prize/prize.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-prizes-flex',
  standalone: true,
  imports: [PrizeComponent, CommonModule],
  templateUrl: './prizes-flex.component.html',
  styleUrls: ['./prizes-flex.component.css']
})


export class PrizesFlexComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() prizes!: prize[];
  @Input() animationSpeed: number = 0;

  @ViewChild('wrapper', { static: false }) wrapperRef!: ElementRef<HTMLDivElement>;

  prizesForList: prizeForList[] = [];
  private animationFrameId: number | null = null;
  private speedMap = { 0: 0, 1: 20, 2: 40, 3: 60 };
  private container: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.container = this.wrapperRef.nativeElement;
    this.initAnimation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prizes'] || changes['animationSpeed']) {
      this.initAnimation();
    }
  }

  private initAnimation() {
    this.stopAnimation();

    if (!this.container || !this.prizes?.length) return;

    this.fillContainer();
    this.startAnimation(this.animationSpeed);
  }

  private startAnimation(speed: number) {
    if (!this.wrapperRef || speed === 0) return;

    const wrapper = this.wrapperRef.nativeElement;

    const move = () => {
      wrapper.scrollLeft += this.speedMap[speed as keyof typeof this.speedMap];


      if (wrapper.scrollLeft >= wrapper.scrollWidth / 2) {
        wrapper.scrollLeft = 0;
      }

      this.animationFrameId = requestAnimationFrame(move);
    };

    this.animationFrameId = requestAnimationFrame(move);
  }




  private stopAnimation() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private fillContainer() {
    const original = this.prizes.map((prize, index) => ({ id: index, prize }));
    const duplicate = original.map((p, i) => ({
      id: original.length + i,
      prize: p.prize
    }));
    this.prizesForList = [...original];
    while (this.prizesForList.length < 500) {
      this.prizesForList.push(...duplicate);
    }
  }




  ngOnDestroy() {
    this.stopAnimation();
  }

  trackByFn(index: number, prize: prizeForList): number {
    return prize.id;
  }
}


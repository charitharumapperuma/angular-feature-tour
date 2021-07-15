import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {TourService} from './tour.service';
import {BehaviorSubject, combineLatest, fromEvent, interval, merge, Observable, Subscription} from 'rxjs';
import {debounce, startWith} from 'rxjs/operators';
import {Tour, TourStep} from './tour.model';

@Component({
  selector: 'tour-step-template',
  template: `
    <div
      *ngIf="isReady && isActive"
      [popover]="tourPopover"
      [popoverContext]="context"
      [containerClass]="'tour-popover'"
      [placement]="'auto'"
      [isOpen]="isActive"
      class="wrapper">
    </div>

    <ng-template #tourPopover let-step="step">
      <p class="tour-step-title">
        {{step?.message}}
      </p>

      <div class="tour-step-navigation" *ngIf="!step.isSequential">
        <button class="link" (click)="tourService.prev()">
          Check
        </button>
        <button class="fill" (click)="tourService.end()">
          Got it
        </button>
      </div>
      <div class="tour-step-navigation" *ngIf="step.isSequential">
        <button class="fill" (click)="tourService.prev()">
          Back
        </button>
        <button class="fill" *ngIf="isLast" (click)="tourService.next()">
          Next
        </button>
        <button class="fill" (click)="tourService.end()">
          Done
        </button>
      </div>
    </ng-template>
  `,
  styleUrls: [
    './tour-step-template.component.less'
  ]
})
export class TourStepTemplateComponent implements OnInit, OnDestroy {
  public tour: Tour;
  public step: TourStep;
  public context: any;
  public targetElement: HTMLElement;
  public isReady = false;
  public isActive = false;
  public isLast = false;
  @HostBinding('class') hostClass = 'tour-step-area';
  @HostBinding('style.width.px') public width = 0;
  @HostBinding('style.height.px') public height = 0;
  @HostBinding('style.top.px') public offsetVertical: number;
  @HostBinding('style.left.px') public offsetHorizontal: number;

  private stepIdSubj: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private windowEvents$: Observable<Event> = this.subscribeToWindowEvents();
  private subscription: Subscription;

  constructor(
    public tourService: TourService
  ) {
  }

  public ngOnInit() {
    this.subscription = combineLatest([
      this.stepIdSubj.asObservable(),
      this.windowEvents$,
      this.tourService.tour$,
      this.tourService.anchors$,
      this.tourService.currentStep$
    ]).subscribe(([stepId, resize, tour, anchors, currentStep]) => {
      if (tour && anchors && currentStep) {
        this.step = this.tourService.getStep(stepId);
        if (this.step) {
          this.tour = tour;
          this.context = {step: this.step};
          this.isActive = this.step.id === currentStep.id;
          this.isLast = this.step.index === this.tour.steps.length - 1;
          this.targetElement = anchors.get(this.step.id).element;

          const boundingRect: DOMRect = this.targetElement.getBoundingClientRect() as DOMRect;
          this.width = boundingRect.width;
          this.height = boundingRect.height;
          this.offsetVertical = boundingRect.top + document.scrollingElement.scrollTop;
          this.offsetHorizontal = boundingRect.left + document.scrollingElement.scrollLeft;

          this.isReady = true;
        }
      }
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public setStep(step: string): void {
    this.stepIdSubj.next(step);
  }

  private subscribeToWindowEvents(): Observable<Event> {
    const resize$ = fromEvent(window, 'resize').pipe(startWith(new Event('resize')));
    const scroll$ = fromEvent(window, 'scroll').pipe(startWith(new Event('scroll')));
    return merge(resize$, scroll$).pipe(
      debounce(() => interval(10))
    );
  }
}

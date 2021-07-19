import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {TourService} from './tour.service';
import {BehaviorSubject, combineLatest, fromEvent, interval, merge, Observable, Subscription} from 'rxjs';
import {debounce, startWith} from 'rxjs/operators';
import {Tour, TourStep} from './tour.model';

@Component({
  selector: 'tour-step-template',
  templateUrl: './tour-step-template.component.html',
  styleUrls: [
    './tour-step-template.component.less'
  ]
})
export class TourStepTemplateComponent implements OnInit, OnDestroy {
  public tour: Tour;
  public step: TourStep;
  public data: any;
  public context: any;
  public targetElement: HTMLElement;
  public isReady = false;
  public isActive = false;
  public isLast = false;
  @HostBinding('class.tour-step-area') true;
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
      if (tour && anchors) {
        if (currentStep) {
          this.setup(stepId, tour, anchors, currentStep);
        } else {
          this.isActive = false;
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

  private setup(stepId, tour, anchors, currentStep): void {
    this.step = this.tourService.getStep(stepId);
    if (this.step) {
      this.tour = tour;
      this.context = {
        step: this.step,
        data: this.data
      };
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
}

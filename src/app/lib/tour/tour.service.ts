import {Injectable} from '@angular/core';
import {Tour, TourActionEvent, TourStep} from './tour.model';
import {TourStepDirective} from './tour-step.directive';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor() {
    this.events$.subscribe(() => {
      if (!this.currentStepSubj.value) {
        this.removeCurrentAnchor();
        return;
      }
      const anchor = this.anchorsSubj.value.get(this.currentStepSubj.value.id);
      if (!anchor) {
        return;
      }
      setTimeout(() => {
        this.removeCurrentAnchor();
        anchor.element.scrollIntoView({
          behavior: 'smooth'
        });
        anchor.show();
        this.activeAnchor = anchor;
      });
    });
  }
  private readonly stepStatusHandlers = {
    next: this.handleNext.bind(this),
    prev: this.handlePrev.bind(this),
    end: this.handleEnd.bind(this),
    check: this.handleCheck.bind(this),
    got_it: this.handleGotIt.bind(this)
  };

  private tourSubj: BehaviorSubject<Tour> = new BehaviorSubject<Tour>(null);
  private anchorsSubj: BehaviorSubject<Map<string, TourStepDirective>> = new BehaviorSubject(new Map<string, TourStepDirective>());
  private currentStepSubj: BehaviorSubject<TourStep> = new BehaviorSubject<TourStep>(null);
  private actionSubj: BehaviorSubject<TourActionEvent> = new BehaviorSubject<TourActionEvent>(null);
  private persistSubj: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private activeAnchor: TourStepDirective;
  private stepsMap: Map<string, TourStep> = new Map<string, TourStep>();
  private stepsSequence: string[] = [];

  public tour$: Observable<Tour> = this.tourSubj.asObservable();
  public anchors$: Observable<Map<string, TourStepDirective>> = this.anchorsSubj.asObservable();
  public currentStep$: Observable<TourStep> = this.currentStepSubj.asObservable();
  public action$: Observable<TourActionEvent> = this.actionSubj.asObservable();
  public persist$: Observable<string> = this.persistSubj.asObservable();
  public events$: Observable<[Tour, Map<string, TourStepDirective>, TourStep, TourActionEvent, string]> = combineLatest([
    this.tour$,
    this.anchors$,
    this.currentStep$,
    this.action$,
    this.persist$
  ]);

  public static getPersistenceId(tour: Tour, id?: string): string {
    return 'tour.' + tour.id + '.' + (id ? id : '*');
  }

  /**
   * Initialize the tour
   * clean up all the previous states of the tour state service
   * and setup tour based on passed configuration
   */
  public initialize(tour: Tour) {
    // if tour is disabled or already completed
    const isTourComplete = tour.completeness_test_fn();
    if (tour.disabled || isTourComplete) {
      return;
    }

    this.clear();
    tour.steps.forEach((step, index) => {
      this.stepsMap.set(step.id, {index, ...step});
      this.stepsSequence.push(step.id);
    });
    this.tourSubj.next(Object.assign({}, tour));
  }

  /**
   * Register a step and its associated TourStepDirective
   * (automatically gets called from the TourStepDirective OnInit hook)
   */
  public register(id: string, directive: TourStepDirective) {
    if (this.anchorsSubj && this.anchorsSubj.value && this.anchorsSubj.value.get(id)) {
      return;
    }
    this.anchorsSubj.next(this.anchorsSubj.value.set(id, directive));
  }

  /**
   * Unregister a step and its associated setup
   * (automatically gets called from the TourStepDirective OnDestroy hook)
   */
  public unregister(id: string) {
    if (this.anchorsSubj && this.anchorsSubj.value && this.anchorsSubj.value.has(id)) {
      const isDeleted = this.anchorsSubj.value.delete(id);
      if (isDeleted) {
        this.anchorsSubj.next(this.anchorsSubj.value);
      }
    }
  }

  /**
   * Start a tour
   * By default starts from the first step of the currently active tour
   * If a specific step id has been passed, tour will start from the given step
   * If there is no step in the current tour with the given id, skip
   */
  public start(id?: string) {
    const next = id ? id : this.getNextStep(-1);
    if (!this.stepsMap.has(next)) {
      console.log('[ERR] Step not found...');
      return;
    }
    this.setStep(next);
  }

  /**
   * Trigger a event
   * Events are triggered from the buttons within the tooltip
   */
  public trigger(event: string, step: TourStep, data: any) {
    this.stepStatusHandlers[event](step.id, step.index, data);
    this.triggerActionEvent(this.stepsSequence[step.index] + '.' + event, data);
  }

  public getStep(id): TourStep {
    return this.stepsMap.get(id);
  }

  private handleCheck(id: string, index: number, data: any) {
    // handled externally
  }

  private handleGotIt(id: string, index: number, data: any) {
    this.completeStep(id);
    const onCompleteActions = this.stepsMap.get(id).on_complete;
    if (onCompleteActions && onCompleteActions.length > 0) {
      onCompleteActions.forEach((action) => this.triggerActionEvent(action, data));
    }
    this.setStep(this.getNextStep(index));
  }

  private handleNext(id: string, index: number, data: any) {
    this.setStep(this.getNextStep(index));
  }

  private handlePrev(id: string, index: number, data: any) {
    this.setStep(this.getPrevStep(index));
  }

  private handleEnd(id: string, index: number, data: any) {
    this.completeStep(id);
  }

  private clear(): void {
    this.stepsMap.clear();
    this.stepsSequence = [];
  }

  private getNextStep(index: number): string {
    const next = index + 1;
    if (next === this.stepsSequence.length) {
      return null;
    }
    const id = this.stepsSequence[next];
    const step = this.stepsMap.get(id);
    if (!step) {
      return null;
    }
    if (step.disabled || step.completed || step.completeness_test_fn()) {
      return this.getNextStep(next);
    } else {
      return id;
    }
  }

  private getPrevStep(index: number): string {
    const prev = index + 1;
    if (prev === -1) {
      return null;
    }
    const id = this.stepsSequence[prev];
    const step = this.stepsMap.get(id);
    if (!step) {
      return null;
    }
    if (step.disabled || step.completed || step.completeness_test_fn()) {
      return this.getPrevStep(prev);
    } else {
      return id;
    }
  }

  private setStep(id: string) {
    this.currentStepSubj.next(this.stepsMap.get(id));
  }

  private dismissStep(): void {
    this.currentStepSubj.next(null);
  }

  private completeStep(id: string): void {
    const step: TourStep = this.stepsMap.get(id);
    step.completed = true;
    if (step.persist) {
      this.persistSubj.next(TourService.getPersistenceId(this.tourSubj.value, id));
    }
  }

  private triggerActionEvent(id: string, data: any): void {
    this.actionSubj.next({id, data});
  }

  private removeCurrentAnchor(): void {
    if (this.activeAnchor) {
      this.activeAnchor.hide();
    }
  }
}

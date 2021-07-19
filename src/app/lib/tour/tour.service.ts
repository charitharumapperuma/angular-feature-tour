import {Injectable} from '@angular/core';
import {Tour, TourAction, TourActionEvent, TourStep} from './tour.model';
import {TourStepDirective} from './tour-step.directive';
import {BehaviorSubject, combineLatest, fromEvent, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourService {
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

  private stepsMap: Map<string, TourStep> = new Map<string, TourStep>();
  private stepsSequence: string[] = [];

  public tour$: Observable<Tour> = this.tourSubj.asObservable();
  public anchors$: Observable<Map<string, TourStepDirective>> = this.anchorsSubj.asObservable();
  public currentStep$: Observable<TourStep> = this.currentStepSubj.asObservable();
  public action$: Observable<TourActionEvent> = this.actionSubj.asObservable();
  public events$: Observable<[Tour, Map<string, TourStepDirective>, TourStep]> = combineLatest([
    this.tour$,
    this.anchors$,
    this.currentStep$
  ]);

  constructor() {
    this.events$.subscribe(() => {
      if (!this.currentStepSubj.value) {
        return;
      }
      const anchor = this.anchorsSubj.value.get(this.currentStepSubj.value.id);
      if (!anchor) {
        return;
      }
      setTimeout(() => anchor.show());
    });
  }

  public initialize(tour: Tour) {
    this.stepsMap.clear();
    this.stepsSequence = [];
    tour.steps.forEach((step, index) => {
      this.stepsMap.set(step.id, {index, ...step});
      this.stepsSequence.push(step.id);
    });
    this.tourSubj.next(Object.assign({}, tour));
  }

  public register(step: string, directive: TourStepDirective) {
    if (this.anchorsSubj && this.anchorsSubj.value && this.anchorsSubj.value.get(step)) {
      return;
    }
    this.anchorsSubj.next(this.anchorsSubj.value.set(step, directive));
  }

  public unregister(step: string) {
    if (this.anchorsSubj && this.anchorsSubj.value && this.anchorsSubj.value.has(step)) {
      const isDeleted = this.anchorsSubj.value.delete(step);
      if (isDeleted) {
        this.anchorsSubj.next(this.anchorsSubj.value);
      }
    }
  }

  public start(stepId?: string) {
    let index = 0;

    if (stepId) {
      const step = this.stepsMap.get(stepId);
      index = step ? step.index : -1;
    }

    if (index === -1) {
      console.log('[ERR] Step not found...');
      return;
    }

    this.setStep(this.stepsSequence[index]);
  }

  public trigger(event: string, step: TourStep, data: any) {
    this.stepStatusHandlers[event](step.id, step.index, data);
    this.triggerActionEvent(this.stepsSequence[step.index] + '.' + event, data);
  }

  public getStep(id): TourStep {
    return this.stepsMap.get(id);
  }

  private setStep(id: string) {
    this.currentStepSubj.next(this.stepsMap.get(id));
  }

  private dismissStep(): void {
    this.currentStepSubj.next(null);
  }

  private completeStep(id: string): void {
    const step = this.stepsMap.get(id);
    step.completed = true;
  }

  private triggerActionEvent(id: string, data: any): void {
    this.actionSubj.next({id, data});
  }

  private handleOnCompleteAction(event: string, origin: string, data: any): void {
    if (event.startsWith('tour#')) {
      this.setStep(event.split('#', 2)[1]);
    } else {
      this.triggerActionEvent(event, data);
    }
  }

  private handleCheck(key: string, index: number, data: any) {
    console.error('Not implemented');
  }

  private handleGotIt(id: string, index: number, data: any) {
    this.completeStep(id);
    const onCompleteActions = this.stepsMap.get(id).on_complete;
    if (onCompleteActions && onCompleteActions.length > 0) {
      onCompleteActions.forEach((action) => this.handleOnCompleteAction(action, id, data));
    } else {
      this.dismissStep();
    }
  }

  private handleNext(key: string, index: number, data: any) {
    this.setStep(this.stepsSequence[index + 1]);
  }

  private handlePrev(key: string, index: number, data: any) {
    this.setStep(this.stepsSequence[index - 1]);
  }

  private handleEnd(key: string, index: number, data: any) {
    console.error('Not implemented');
  }
}

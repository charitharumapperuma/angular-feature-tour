import {Injectable} from '@angular/core';
import {Tour, TourStep} from './tour.model';
import {TourStepDirective} from './tour-step.directive';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private tourSubj: BehaviorSubject<Tour> = new BehaviorSubject<Tour>(null);
  private anchorsSubj: BehaviorSubject<Map<string, TourStepDirective>> = new BehaviorSubject(new Map<string, TourStepDirective>());
  private currentStepSubj: BehaviorSubject<TourStep> = new BehaviorSubject<TourStep>(null);
  public stepsMap: Map<string, TourStep> = new Map<string, TourStep>();

  public tour$: Observable<Tour> = this.tourSubj.asObservable();
  public anchors$: Observable<Map<string, TourStepDirective>> = this.anchorsSubj.asObservable();
  public currentStep$: Observable<TourStep> = this.currentStepSubj.asObservable();
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
    tour.steps.forEach((step, index) => {
      this.stepsMap.set(step.id, step);
      return {
        ...step,
        index
      };
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

  public start(step?: string) {
    let index = 0;

    if (step) {
      index = this.tourSubj.value.steps.findIndex(s => s.id === step);
    }

    if (index === -1) {
      console.log('Step not found...');
      return;
    }

    this.setStep(index);
  }

  public next() {
    if (this.currentStepSubj.value) {
      console.log('First start the tour..');
      return;
    }
    this.setStep(this.currentStepSubj.value.index + 1);
  }

  public prev() {
    console.error('Not implemented');
  }

  public end() {
    console.error('Not implemented');
  }

  public getStep(id): TourStep {
    return this.stepsMap.get(id);
  }

  private setStep(index) {
    const step = this.tourSubj.value.steps[index];
    this.currentStepSubj.next(step);
  }
}

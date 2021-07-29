import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TourService} from './lib/tour/tour.service';
import {TOUR_CONFIG} from './tour.config';
import {PersistenceService} from './persistence.service';
import {TourActionEvent} from './lib/tour/tour.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  private completenessFn = (id) => this.persistenceService.isCompleted(id);

  constructor(private router: Router, private tourService: TourService, private persistenceService: PersistenceService) {
  }

  ngOnInit() {
    this.setupTour();
  }

  ngAfterViewInit() {
    this.tourService.start();
  }

  public isActive(instruction: any[]): boolean {
    return this.router.isActive(this.router.createUrlTree(instruction), true);
  }

  private setupTour(): void {
    const tour = Object.assign({}, TOUR_CONFIG);

    // check component conditions
    const stepTestFns = {
      'header.get_started': this.isCompletedFn.bind(this)
    };
    tour.completeness_test_fn = () => this.persistenceService.isCompleted(TourService.getPersistenceId(tour));
    tour.steps.forEach(step => {
      step.completeness_test_fn = () => {
        const id = TourService.getPersistenceId(tour, step.id);
        const fn = stepTestFns[step.id];
        let isCompleted;
        if (step.persist) {
          isCompleted = this.persistenceService.isCompleted(id);
        } else {

        }
        if (fn) {
          return step.persist && this.persistenceService.isCompleted(id) && fn();
        } else {
          return step.persist && this.persistenceService.isCompleted(id);
        }
      };
    });

    this.tourService.initialize(tour);
    this.tourService.action$.subscribe((action) => this.handleTourActions(action));
    this.tourService.persist$.subscribe((id) => this.persistenceService.save(id));
  }

  private handleTourActions(action: TourActionEvent): void {
    console.log(action);
    return;
  }

  private isCompletedFn(): boolean {
    return true;
  }

  // private async isCompletedAsyncFn() {
  //   const timerOne$ = timer(1000);
  //   const timerTwo$ = timer(2000);
  //   const v = await combineLatest([timerOne$, timerTwo$]).pipe(take(1), map(() => true)).toPromise();
  //   return v;
  // }
}

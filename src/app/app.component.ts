import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TourService} from './lib/tour/tour.service';
import {TOUR_CONFIG} from './tour.config';
import {PersistenceService} from './persistence.service';
import {Tour, TourActionEvent} from './lib/tour/tour.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  private completenessFn = (id) => this.persistenceService.isCompleted(id);
  private persistenceFn = (id) => this.persistenceService.save(id);

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
    this.tourService.initialize(tour, this.persistenceFn, this.completenessFn);
    this.tourService.action$.subscribe((action) => this.handleTourActions(action));
  }

  private handleTourActions(action: TourActionEvent): void {
    return;
  }
}

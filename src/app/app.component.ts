import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TourService} from './lib/tour/tour.service';
import {TOUR_CONFIG} from './tour.config';
import {PersistenceService} from './persistence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private router: Router, private tourService: TourService, private persistenceService: PersistenceService) {
  }

  ngOnInit() {
    this.tourService.initialize(TOUR_CONFIG, this.persistenceService.save);
    this.tourService.action$.subscribe((action) => {
      console.log(action);
    });
  }

  ngAfterViewInit() {
    this.tourService.start();
  }

  public isActive(instruction: any[]): boolean {
    return this.router.isActive(this.router.createUrlTree(instruction), true);
  }
}

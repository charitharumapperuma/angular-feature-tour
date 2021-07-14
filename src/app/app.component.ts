import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TourService} from './lib/tour/tour.service';
import {TOUR_CONFIG} from './tour.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private router: Router, private tourService: TourService) {
  }

  ngOnInit() {
    this.tourService.initialize(TOUR_CONFIG);
  }

  ngAfterViewInit() {
    this.tourService.start();
  }

  public isActive(instruction: any[]): boolean {
    return this.router.isActive(this.router.createUrlTree(instruction), true);
  }
}

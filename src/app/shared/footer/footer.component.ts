import { Component, OnInit } from '@angular/core';
import {TourService} from '../../lib/tour/tour.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private tourService: TourService) { }

  ngOnInit() {
  }

  public onRestartTour(key?: string) {
    this.tourService.start(key);
  }
}

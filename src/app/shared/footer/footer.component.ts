import {Component, Input, OnInit} from '@angular/core';
import {TourService} from '../../lib/tour/tour.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() checked: boolean;

  constructor(private tourService: TourService) { }

  ngOnInit() {
  }

  public onRestartTour(key?: string) {
    this.tourService.start(key);
  }
}

import {AfterContentInit, Component, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {TourService} from './tour.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'tour-step-template',
  template: `
    <ng-template #tourStep let-step="step">
      <p class="tour-step-content" [innerHTML]="step?.content"></p>
      <div class="tour-step-navigation">
        <!--*ngIf="tourService.hasPrev(step)"-->
        <button class="btn btn-sm btn-default" (click)="tourService.prev()">
          Back
        </button>
        <!--*ngIf="tourService.hasNext(step)"-->
        <button class="btn btn-sm btn-default" (click)="tourService.next()">
          Next
        </button>
        <button class="btn btn-sm btn-default" (click)="tourService.end()">
          Done
        </button>
      </div>
    </ng-template>
  `
})
export class TourStepTemplateComponent implements AfterContentInit {
  @ViewChild('tourStep', { read: TemplateRef, static: true }) public templateRef: TemplateRef<any>;

  constructor(
    public tourService: TourService
  ) {
  }

  public ngAfterContentInit(): void {
    this.tourService.template = this.templateRef;
  }
}

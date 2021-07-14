import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TourPopoverDirective, TourStepDirective} from './tour-step.directive';
import {TourStepTemplateComponent} from './tour-step-template.component';


@NgModule({
  declarations: [TourStepDirective, TourPopoverDirective, TourStepTemplateComponent],
  exports: [TourStepDirective, TourPopoverDirective, TourStepTemplateComponent],
  imports: [CommonModule],
  providers: []
})
export class TourModule {
}

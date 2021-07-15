import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TourStepDirective} from './tour-step.directive';
import {TourStepTemplateComponent} from './tour-step-template.component';
import {PopoverModule} from 'ngx-bootstrap/popover';


@NgModule({
  declarations: [TourStepDirective, TourStepTemplateComponent],
  exports: [TourStepDirective, TourStepTemplateComponent],
  imports: [CommonModule, PopoverModule],
  providers: [],
  entryComponents: [TourStepTemplateComponent]
})
export class TourModule {
}

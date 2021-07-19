import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {TourService} from './tour.service';
import {TourStepTemplateComponent} from './tour-step-template.component';

@Directive({
  selector: '[tourStep]'
})
export class TourStepDirective implements OnInit, OnDestroy {
  @Input() tourStep: string;
  @Input() data: any;

  public element: HTMLElement;

  constructor(
    private elRef: ElementRef,
    private vcRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private tourService: TourService,
  ) {
  }

  ngOnInit() {
    this.tourService.register(this.tourStep, this);
    this.element = this.elRef.nativeElement;
  }

  ngOnDestroy() {
    this.tourService.unregister(this.tourStep);
  }

  public show() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TourStepTemplateComponent);
    const componentRef = this.vcRef.createComponent<TourStepTemplateComponent>(componentFactory);
    componentRef.instance.setStep(this.tourStep);
    componentRef.instance.data = this.data;
  }
}

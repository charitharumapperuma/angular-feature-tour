import {
  ComponentFactory,
  ComponentFactoryResolver, ComponentRef,
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

  private tourStepComponentFactory: ComponentFactory<TourStepTemplateComponent>;
  private tourStepTemplateComponentRef: ComponentRef<TourStepTemplateComponent>;

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
    this.tourStepComponentFactory = this.componentFactoryResolver.resolveComponentFactory(TourStepTemplateComponent);
  }

  ngOnDestroy() {
    this.tourService.unregister(this.tourStep);
  }

  public show() {
    this.tourStepTemplateComponentRef = this.vcRef.createComponent<TourStepTemplateComponent>(this.tourStepComponentFactory);
    this.tourStepTemplateComponentRef.instance.setStep(this.tourStep);
    this.tourStepTemplateComponentRef.instance.data = this.data;
  }

  public hide() {
    const viewRef = this.tourStepTemplateComponentRef.hostView;
    const index = this.vcRef.indexOf(viewRef);
    this.vcRef.remove(index);
  }
}

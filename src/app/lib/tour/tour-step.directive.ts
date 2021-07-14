import {
  Directive,
  ElementRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {TourService} from './tour.service';
import {TourStep} from './tour.model';
import {PopoverDirective} from 'ngx-bootstrap/popover';
import {fromEvent, interval, Subscription} from 'rxjs';
import {debounce} from 'rxjs/operators';
import {ensureVisible} from './tour-utils';

@Directive({selector: '[tourStep]'})
export class TourPopoverDirective extends PopoverDirective {
}

@Directive({
  selector: '[tourStep]'
})
export class TourStepDirective implements OnInit, OnChanges, OnDestroy {
  @Input() tourStep: string;
  @Input() disabled: boolean;
  @Input() active: boolean;

  private backdropBaseElement: HTMLElement;
  private outerHighlightAreaElement: HTMLElement;
  private innerHighlightAreaElement: HTMLElement;
  private targetHtmlElement: HTMLElement;
  private windowResizeSubscription$: Subscription;

  constructor(
    private tourService: TourService,
    @Host() private popoverDirective: TourPopoverDirective,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.tourService.register(this.tourStep, this);
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
    this.tourService.unregister(this.tourStep);
    this.windowResizeSubscription$.unsubscribe();
  }

  public show(step: TourStep) {
    this.active = true;
    this.showHighlighter();
    this.showPopover(step);
  }

  private showPopover(step: TourStep): void {
    this.active = true;
    this.popoverDirective.popover = this.tourService.template;
    this.popoverDirective.popoverContext = {step};
    this.popoverDirective.popoverTitle = step.title;
    this.popoverDirective.container = 'body';
    this.popoverDirective.containerClass = 'ngx-bootstrap';
    this.popoverDirective.placement = 'top';
    this.popoverDirective.show();
  }

  private showHighlighter(): void {
    this.targetHtmlElement = this.elRef.nativeElement;
    if (!this.outerHighlightAreaElement) {
      this.createOuterHighlightAreaElement();
      this.subscribeToWindowResizeEvent();
    }
  }

  private createOuterHighlightAreaElement() {
    const boundingRect: DOMRect = this.targetHtmlElement.getBoundingClientRect() as DOMRect;
    const scrollY = document.scrollingElement.scrollTop;
    const scrollX = document.scrollingElement.scrollLeft;

    this.outerHighlightAreaElement = this.renderer.createElement('div');
    this.renderer.addClass(this.outerHighlightAreaElement, 'tour-highlight--outer');
    this.applyStyles({
      position: 'absolute',
      width: `${boundingRect.width}px`,
      height: `${boundingRect.height}px`,
      top: `${boundingRect.top + scrollY}px`,
      left: `${boundingRect.left + scrollX}px`,
    }, this.outerHighlightAreaElement);
    this.renderer.appendChild(document.body, this.outerHighlightAreaElement);

    this.createInnerHighlightAreaElement();
  }

  private createInnerHighlightAreaElement() {
    this.innerHighlightAreaElement = this.renderer.createElement('div');
    this.renderer.addClass(this.innerHighlightAreaElement, 'tour-highlight--inner');
    this.renderer.appendChild(this.outerHighlightAreaElement, this.innerHighlightAreaElement);
  }

  private applyStyles(styles: Partial<CSSStyleDeclaration>, element: HTMLElement) {
    for (const name of Object.keys(styles)) {
      this.renderer.setStyle(element, name, styles[name]);
    }
  }

  private subscribeToWindowResizeEvent() {
    const resizeObservable$ = fromEvent(window, 'resize');
    this.windowResizeSubscription$ = resizeObservable$
      .pipe(
        debounce(() => interval(10))
      )
      .subscribe(() => {
        this.renderer.removeChild(document.body, this.outerHighlightAreaElement);
        this.outerHighlightAreaElement = null;
        this.showHighlighter();
        ensureVisible(this.targetHtmlElement);
      });
  }
}

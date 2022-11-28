import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Inject,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import {
  Overlay,
  OverlayContainer,
  OverlayKeyboardDispatcher,
  OverlayOutsideClickDispatcher,
  OverlayPositionBuilder,
  OverlayRef,
  ScrollDispatcher,
  ScrollStrategyOptions,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { LoadingOverlayComponent } from '../components/loading-overlay/loading-overlay.component';
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT, Location } from '@angular/common';
import { Platform } from '@angular/cdk/platform';

export class DynamicOverlay extends Overlay {
  private readonly _dynamicOverlayContainer: DynamicOverlayContainer;
  private renderer: Renderer2;

  constructor(
    scrollStrategies: ScrollStrategyOptions,
    _overlayContainer: DynamicOverlayContainer,
    _componentFactoryResolver: ComponentFactoryResolver,
    _positionBuilder: OverlayPositionBuilder,
    _keyboardDispatcher: OverlayKeyboardDispatcher,
    _injector: Injector,
    _ngZone: NgZone,
    @Inject(DOCUMENT) _document: any,
    _directionality: Directionality,
    rendererFactory: RendererFactory2,
    location: Location,
    clickOutsideDispatcher: OverlayOutsideClickDispatcher,
  ) {
    super(
      scrollStrategies,
      _overlayContainer,
      _componentFactoryResolver,
      _positionBuilder,
      _keyboardDispatcher,
      _injector,
      _ngZone,
      _document,
      _directionality,
      location,
      clickOutsideDispatcher,
    );
    this.renderer = rendererFactory.createRenderer(null, null);

    this._dynamicOverlayContainer = _overlayContainer;
  }

  public setContainerElement(containerElement: HTMLElement): void {
    this.renderer.setStyle(containerElement, 'transform', 'translateZ(0)');
    this._dynamicOverlayContainer.setContainerElement(containerElement);
  }

  public createWithDefaultConfig(containerElement: HTMLElement): OverlayRef {
    this.setContainerElement(containerElement);
    return super.create({
      backdropClass: '_loading-overlay-backdrop',
      positionStrategy: this.position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
    });
  }
}

class DynamicOverlayContainer extends OverlayContainer {
  public setContainerElement(containerElement: HTMLElement): void {
    this._containerElement = containerElement;
  }
}

/**
 * Directive for showing a loader overlay for components.
 *
 * Based on https://github.com/Silvere112/ngx-load.
 */
@Directive({
  selector: '[appShowLoadingOverlay]',
})
export class ShowLoadingOverlayDirective implements OnDestroy {

  overlayRef?: OverlayRef;
  currentSubscription: Subscription | undefined;
  private scrollStrategyOptions: ScrollStrategyOptions;
  private overlay?: DynamicOverlay;

  @Input()
  set appShowLoadingOverlay(value: boolean | null) {
    this.unsubscribeCurrentSubscription();
    if (value) {
      this.attachLoader();
    } else {
      this.detachLoader();
    }
  }

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _positionBuilder: OverlayPositionBuilder,
    private _keyboardDispatcher: OverlayKeyboardDispatcher,
    private _injector: Injector,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) private _document: any,
    private _directionality: Directionality,
    private rendererFactory: RendererFactory2,
    private location: Location,
    private clickOutsideDispatcher: OverlayOutsideClickDispatcher,
    private _platform: Platform,
    private elementRef: ElementRef,
    _scrollDispatcher: ScrollDispatcher,
    _viewPortRuler: ViewportRuler,
  ) {
    this.scrollStrategyOptions = new ScrollStrategyOptions(_scrollDispatcher, _viewPortRuler, _ngZone, _document);
  }

  ngOnDestroy(): void {
    this.detachLoader();
    this.unsubscribeCurrentSubscription();
  }

  private unsubscribeCurrentSubscription() {
    if (this.currentSubscription) {
      this.detachLoader();
      this.currentSubscription.unsubscribe();
    }
  }

  private attachLoader() {
    const overlayContainer = new DynamicOverlayContainer(this._document, this._platform);
    overlayContainer.setContainerElement(this.elementRef.nativeElement);
    this.overlay = new DynamicOverlay(
      this.scrollStrategyOptions,
      overlayContainer,
      this._componentFactoryResolver,
      this._positionBuilder,
      this._keyboardDispatcher,
      this._injector,
      this._ngZone,
      this._document,
      this._directionality,
      this.rendererFactory,
      this.location,
      this.clickOutsideDispatcher,
    );
    this.overlayRef = this.overlay.createWithDefaultConfig(this.elementRef.nativeElement);
    this.overlayRef.attach(new ComponentPortal(LoadingOverlayComponent));
  }

  private detachLoader() {
    this.overlayRef?.detach();
  }
}

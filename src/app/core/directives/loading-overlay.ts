import {
  ComponentType,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayKeyboardDispatcher,
  OverlayOutsideClickDispatcher,
  OverlayPositionBuilder,
  OverlayRef,
  ScrollDispatcher,
  ScrollStrategyOptions,
  ViewportRuler,
} from '@angular/cdk/overlay';
import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Inject,
  Injector,
  NgZone,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';

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

  private getDefaultConfig(): OverlayConfig {
    return {
      positionStrategy: this.position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    };
  }

  public createWithBackdrop(backdropClass: string | string[] | undefined): OverlayRef {
    return super.create({
      ...this.getDefaultConfig(),
      backdropClass: backdropClass,
      hasBackdrop: true,
    });
  }
}

export class DynamicOverlayContainer extends OverlayContainer {
  public setContainerElement(containerElement: HTMLElement): void {
    this._containerElement = containerElement;
  }
}

@Directive()
export class LoadingOverlay {

  private overlayRef?: OverlayRef;
  private readonly scrollStrategyOptions: ScrollStrategyOptions;
  private overlay?: DynamicOverlay;

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

  protected attach(genOverlay: (overlay: DynamicOverlay) => OverlayRef, componentType: ComponentType<any>): void {
    this.overlayRef?.detach();
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
    this.overlay.setContainerElement(this.elementRef.nativeElement);
    this.overlayRef = genOverlay(this.overlay);
    this.overlayRef.attach(new ComponentPortal(componentType));
  }

  protected detach(): void {
    this.overlayRef?.detach();
  }
}

import { Directive, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[focusOnLoad]',
})
export class FocusOnLoadDirective implements OnChanges {
  constructor(private element: ElementRef) {}

  ngOnChanges() {
    setTimeout(() => {
      this.element[0].focus();
    });
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hidden',
  templateUrl: './hidden.component.html',
  styleUrls: ['./hidden.component.scss'],
})
export class HiddenComponent {
  @Input() width = 10;

  widthToCollection(): number[] {
    return Array(this.width).fill(this.width);
  }
}

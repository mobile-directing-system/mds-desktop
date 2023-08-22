import { Component, Input } from '@angular/core';
import { AddressBookEntry } from 'src/app/core/model/address-book-entry';

@Component({
  selector: 'app-message-summary',
  templateUrl: './message-summary.component.html',
  styleUrls: ['./message-summary.component.scss']
})
export class MessageSummaryComponent {

  @Input() sender!: AddressBookEntry;


}

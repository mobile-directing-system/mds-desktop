import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { IntelCreationService } from '../../../core/services/intel-creation.service';
import {Subscription} from 'rxjs';
import { WorkspaceService } from '../../../core/services/workspace.service';
import {KeyInfoEntry, KeyInfoService} from "../../../core/services/key-info.service";

@Component({
  selector: 'app-intelligence-layout',
  templateUrl: './intelligence-layout.component.html',
  styleUrls: ['./intelligence-layout.component.scss'],
})
export class IntelligenceLayoutComponent implements OnInit, OnDestroy, AfterViewInit{

  s: Subscription[] = [];

  @ViewChild('butEmptyIntel', { read: ElementRef, static:false }) butEmptyIntel?: ElementRef;

  constructor(public intelCreationService: IntelCreationService, private workspaceService: WorkspaceService,
              private keyInfoService: KeyInfoService){
  }

  /**
   * Showing this keyInfo via {@link KeyInfoService} when no intel is in creation.
   */
  keyInfosWithoutIntelInCreation = [
    new KeyInfoEntry("1", $localize `Empty Intel`, ()=>this.butEmptyIntel?.nativeElement.click())
  ];



  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.workspaceService.operationChange()
      .subscribe(newOperation =>
        this.intelCreationService.selectedOperation.setValue(newOperation? newOperation : null))
    );
    // listen to inIntelCreation to change the key-infos accordingly
    this.s.push(this.intelCreationService.inIntelCreation.subscribe((inIntelCreation:Boolean) => {
      if(!inIntelCreation){
        this.keyInfoService.setKeyInfos(this.keyInfosWithoutIntelInCreation);
      }
    }))
  }

  ngAfterViewInit() {
    // set initial key infos
    this.keyInfoService.setKeyInfos(this.keyInfosWithoutIntelInCreation);
  }

}

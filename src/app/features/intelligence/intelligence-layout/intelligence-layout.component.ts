import { Component, OnDestroy, OnInit } from '@angular/core';
import { IntelCreationService } from '../../../core/services/intel-creation.service';
import { Subscription } from 'rxjs';
import { WorkspaceService } from '../../../core/services/workspace.service';
import {KeyInfoEntry} from "../../../core/components/key-info-bar/key-info-bar.component";

@Component({
  selector: 'app-intelligence-layout',
  templateUrl: './intelligence-layout.component.html',
  styleUrls: ['./intelligence-layout.component.scss'],
})
export class IntelligenceLayoutComponent implements OnInit, OnDestroy{

  s: Subscription[] = [];

  constructor(public intelCreationService: IntelCreationService, private workspaceService: WorkspaceService){
  }

  protected readonly keyInfos = [
    new KeyInfoEntry("1", "Read Changes Changes", ()=>console.log("Read Changes Changes")),
    new KeyInfoEntry("2", "Changes Changes", ()=>console.log("Changes Changes")),
    null, null, null, null, null, null,null, null, null, null,
  ];

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.workspaceService.operationChange()
      .subscribe(newOperation =>
        this.intelCreationService.selectedOperation.setValue(newOperation? newOperation : null))
    );
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { IntelCreationService } from '../../../core/services/intel-creation.service';
import { Subscription } from 'rxjs';
import { WorkspaceService } from '../../../core/services/workspace.service';

@Component({
  selector: 'app-intelligence-layout',
  templateUrl: './intelligence-layout.component.html',
  styleUrls: ['./intelligence-layout.component.scss'],
})
export class IntelligenceLayoutComponent implements OnInit, OnDestroy{

  s: Subscription[] = [];

  constructor(public intelCreationService: IntelCreationService, private workspaceService: WorkspaceService){
  }

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

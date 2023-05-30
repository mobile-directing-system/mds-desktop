import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RadioDeliveryService} from "../../../core/services/radio-delivery.service";
import {WorkspaceService} from "../../../core/services/workspace.service";
import {DetailedRadioDelivery, RadioDelivery} from "../../../core/model/radio-delivery";
import {NotificationService} from "../../../core/services/notification.service";
import {IntelService} from "../../../core/services/intel.service";
import {first, Subscription} from "rxjs";

/**
 * Component for managing radio deliveries. {@link RadioDelivery} can be picked up, released and finished.
 */
@Component({
  selector: 'app-radio-delivery',
  templateUrl: './radio-delivery.component.html',
  styleUrls: ['./radio-delivery.component.scss']
})
export class RadioDeliveryComponent implements OnDestroy{

  /**
   * Currently selected operation in the workspace
   */
  private operationId: string | undefined = undefined;
  /**
   * Currently picked up radio delivery if that is the case
   */
  detailedRadioDelivery: DetailedRadioDelivery | undefined = undefined;
  /**
   * Subscription array for cleaning up on destroy
   */
  private s: Subscription[] = [];

  constructor(private router: Router, private route: ActivatedRoute,
              private radioDeliveryService: RadioDeliveryService, private workspaceService: WorkspaceService,
              private notificationService: NotificationService, private intelService: IntelService) {
    this.workspaceService.operationChange().subscribe((operationId: string | undefined)=>{
      this.operationId = operationId;
    });
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());

    // release picked up radio delivery if exists
    if(this.detailedRadioDelivery){
      this.radioDeliveryService.releaseRadioDelivery(this.detailedRadioDelivery.radioDelivery.id).pipe(first()).subscribe(
        {
          next: _ => {
            this.detailedRadioDelivery = undefined;
            this.notificationService.notifyUninvasiveShort($localize`Released current radio delivery.`);
          },
          error: _ => {
            this.notificationService.notifyUninvasiveShort($localize`Releasing current radio delivery failed.`);
          }
        }
      )
    }

  }

  /**
   * Picks up next available {@link RadioDelivery} for the currently selected operation.
   */
  pickUpNextRadioDelivery(): void {
    if(this.operationId){
      this.s.push(this.radioDeliveryService.getNextRadioDelivery(this.operationId).subscribe({
          next: radioDelivery => {
            if(radioDelivery == undefined){
              this.notificationService.notifyUninvasiveShort($localize`Currently no radio delivery job available.`);
              this.detailedRadioDelivery = radioDelivery;
            }else{
              this.s.push(this.intelService.getIntelById(radioDelivery.intel).subscribe({
                next: intel => {

                  this.detailedRadioDelivery = {
                    radioDelivery: radioDelivery,
                    intel: intel
                  };
                },
                error: _ => {
                  this.notificationService.notifyUninvasiveShort($localize`Picking up next radio delivery failed - can not find intel.`);
                }

              }));
            }
          },
          error: _ => {
            this.notificationService.notifyUninvasiveShort($localize`Picking up next radio delivery failed.`);
        },
      }));
    }else{
      this.notificationService.notifyUninvasiveShort($localize`Please select an operation for this workspace before.`);
    }

  }

  /**
   * Releases currently picked up {@link RadioDelivery}.
   */
  releaseCurrentRadioDelivery(){
    if(this.detailedRadioDelivery){
      this.radioDeliveryService.releaseRadioDelivery(this.detailedRadioDelivery.radioDelivery.id).subscribe(
        {
          next: _ => {
            this.detailedRadioDelivery = undefined;
            this.notificationService.notifyUninvasiveShort($localize`Released current radio delivery.`);
          },
          error: _ => {
            this.notificationService.notifyUninvasiveShort($localize`Releasing current radio delivery failed.`);
          }
        }
      )
    }
  }

  /**
   * Finishes currently picked up {@link RadioDelivery}.
   *
   * @param success If the delivery should be marked as successfully or unsuccessfully
   */
  finishCurrentRadioDelivery(success: boolean){
    if(this.detailedRadioDelivery){
      this.s.push(this.radioDeliveryService.finishRadioDelivery(this.detailedRadioDelivery.radioDelivery.id, success).subscribe(
        {
          next: _ => {
            this.detailedRadioDelivery = undefined;
            if(success){
              this.notificationService.notifyUninvasiveShort($localize`Confirmed radio delivery`);
            }else{
              this.notificationService.notifyUninvasiveShort($localize`Marked radio delivery as unsuccessfully.`);
            }
          },
          error: _ => {
            this.notificationService.notifyUninvasiveShort($localize`Finishing current radio delivery failed.`);
          }
        }
      ));
    }
  }

}

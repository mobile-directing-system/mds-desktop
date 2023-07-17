import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesLayoutComponent } from './resources-layout.component';
import { CoreModule } from 'src/app/core/core.module';
import { CreateResourceView } from './create-resource/create-resource.component';
import { RouterModule } from '@angular/router';
import { ListResourcesComponent } from './list-resources/list-resources.component';
import { EditResourceComponent } from './edit-resource/edit-resource.component';



@NgModule({
  declarations: [
    ResourcesLayoutComponent,
    CreateResourceView,
    ListResourcesComponent,
    EditResourceComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ]
})
export class ResourcesModule { }

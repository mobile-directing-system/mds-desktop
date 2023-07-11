import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesLayoutComponent } from './resources-layout.component';
import { CoreModule } from 'src/app/core/core.module';
import { CreateResourceView } from './create-resource/create-resource.component';
import { RouterModule } from '@angular/router';
import { ListResourcesComponent } from './list-resources/list-resources.component';



@NgModule({
  declarations: [
    ResourcesLayoutComponent,
    CreateResourceView,
    ListResourcesComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ]
})
export class ResourcesModule { }

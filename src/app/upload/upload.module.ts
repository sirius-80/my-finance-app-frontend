import { NgModule } from '@angular/core';
import { UploadComponent } from './upload.component';
import { CommonModule } from '@angular/common';
import { UploadRoutingModule } from './upload-routing.module';
import { MatButtonModule } from '@angular/material';

@NgModule({
    declarations: [
        UploadComponent
    ],
    imports: [
        CommonModule,
        UploadRoutingModule,
        MatButtonModule,
    ]
})
export class UploadModule {}

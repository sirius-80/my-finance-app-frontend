import { Routes, RouterModule } from "@angular/router";
import { UploadComponent } from './upload.component';
import { NgModule } from '@angular/core';

const uploadRoutes: Routes = [
    {path: 'upload', component: UploadComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(uploadRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class UploadRoutingModule {}
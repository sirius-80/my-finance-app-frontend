import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  private filename: string = null;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  csvInputChange(fileInputEvent: any) {
    const file:File = fileInputEvent.target.files[0]; 
    this.filename = file.name;
    const filereader = new FileReader();
    filereader.onload = () => {
      const contents = filereader.result;
      this.httpClient.put('http://localhost:5002/upload', contents).subscribe( (response) => {
        console.log(response);
    });
      this.filename = null;
    };
    filereader.readAsText(file);
    console.log(file);
  }
}

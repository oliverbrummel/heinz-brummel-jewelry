import { Component, OnInit } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.sass']
})
export class ImageUploaderComponent implements OnInit {
  constructor( private storage: AngularFireStorage) { }

  selectedFile: File = null;
  uploadTask: AngularFireUploadTask;
  snapshot: Observable<any>;
  percentage: Observable<number>;
  downloadURL: Observable<string>;

  ngOnInit() {
  }

  onFileSelected(event: any): any {
    console.log('onFileSelected - event', event);
    this.selectedFile = event.target.files[0] as File;
  }

  onUpload(): any {
    const path = `earring/${new Date().getTime()}_${this.selectedFile.name}`;
    const fileRef = this.storage.ref(path);
    this.uploadTask = this.storage.upload(path, this.selectedFile);

    this.percentage = this.uploadTask.percentageChanges();

    this.uploadTask.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL())
    )
      .subscribe();

    this.percentage.subscribe((percent) => {
      console.log('percentage!', percent);
    });
  }

}

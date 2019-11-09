import { Component, OnInit } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { JewelryService } from '../jewelry/jewelry.service';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.sass']
})
export class ImageUploaderComponent implements OnInit {
  previewURL: any;
  selectedFile: File = null;
  uploadTask: AngularFireUploadTask;
  snapshot: Observable<any>;
  percentage: Observable<number>;
  downloadURL: Observable<string>;
  docIdSubscription: Subscription;

  metadata: any;

  constructor( private storage: AngularFireStorage, private jewelryService: JewelryService) {
    this.jewelryService.docId$.subscribe((docId) => {
      console.log('docId in CHILD!!', docId);
      this.metadata = { documentId: docId };
      this.onUpload();
    });
  }

  ngOnInit() {
  }

  onFileSelected(event: any): any {
    console.log('onFileSelected - event', event);
    this.selectedFile = event.target.files[0] as File;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.previewURL = reader.result;
    }, false);

    reader.readAsDataURL(this.selectedFile);
  }

  onUpload(): any {
    const path = `earring/${this.selectedFile.name}`;
    const fileRef = this.storage.ref(path);
    this.uploadTask = this.storage.upload(path, this.selectedFile, this.metadata);

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

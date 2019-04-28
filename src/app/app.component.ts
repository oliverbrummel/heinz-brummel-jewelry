import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { JewelryService } from './jewelry/jewelry.service';
import { JewelryBag } from './jewelry/jewelry-bag';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private jewelryService: JewelryService,
    private storage: AngularFireStorage
    ) {}

  private jewelryBagsSub: Subscription;
  title = 'heinz-brummel-jewelry';
  selectedFile: File = null;
  uploadTask: AngularFireUploadTask;
  snapshot: Observable<any>;
  percentage: Observable<number>;
  downloadURL: Observable<string>;

  ngOnInit() {
    this.jewelryBagsSub = this.jewelryService.getUpdateListener()
      .subscribe((updatedBags: JewelryBag[]) => {
        console.log('LIST OF BAGS', updatedBags);
      });
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

  addJewelryBag() {
    const mockBag: JewelryBag = {
      desc: 'testing',
      name: 'wawaweewa',
      price: '$100',
      image: '.....',
      type: 'earring'
    };
    this.jewelryService.addToCollection(mockBag);
  }

  ngOnDestroy() {
    this.jewelryBagsSub.unsubscribe();
  }
}

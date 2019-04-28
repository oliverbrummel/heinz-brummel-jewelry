import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JewelryService } from './jewelry/jewelry.service';
import { JewelryBag } from './jewelry/jewelry-bag';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private jewelryService: JewelryService,
    private http: HttpClient
    ) {}

  private jewelryBagsSub: Subscription;
  title = 'heinz-brummel-jewelry';
  selectedFile: File = null;

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
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name)
    this.http.post('https://us-central1-heinz-brummel-jewelry.cloudfunctions.net/uploadFile', fd)
      .subscribe(res => {
        console.log('RESPONSE FROM UPLOAD', res);
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

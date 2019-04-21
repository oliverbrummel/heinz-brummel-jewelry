import { Component, OnInit } from '@angular/core';
import { JewelryService } from './jewelry/jewelry.service';
import { Subscription } from 'rxjs';
import { JewelryBag } from './jewelry/jewelry-bag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private jewelryService: JewelryService) {}
  private jewelryBagsSub: Subscription;
  title = 'heinz-brummel-jewelry';

  ngOnInit() {
    this.jewelryService.getEarrings();
    this.jewelryBagsSub = this.jewelryService.getUpdateListener()
      .subscribe((updatedBags: JewelryBag[]) => {
        console.log('LIST OF BAGS', updatedBags);
      });
  }
}

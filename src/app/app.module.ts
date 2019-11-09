import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { HomePageComponent } from './home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageUploaderComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'heinz-brummel-jewelry'),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {}}],
  bootstrap: [AppComponent]
})
export class AppModule { }

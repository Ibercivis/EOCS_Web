import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EOCS-web';
  username = "";
  constructor(private storageService: StorageService) {

  }

  ngOnInit() {
    this.username = this.storageService.getCurrentUser();
    this.storageService.triggerEventSession.subscribe(() => {
      this.username = this.storageService.getCurrentUser();
    })
  }

  logout() {
    this.storageService.logout();
  }
}

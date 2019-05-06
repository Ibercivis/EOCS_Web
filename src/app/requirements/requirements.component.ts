import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit {

  requirements = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.obtenerRequerimientos();
  }

  obtenerRequerimientos() {
    
      this.obtenerRequerimientosObs().subscribe(apiData => (this.requirements = apiData));
  }

  //service
  obtenerRequerimientosObs(): Observable<any> {
    const url = 'http://193.146.116.148:3000/requirements';
    return this.httpClient.get(url);
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {

  constructor(private httpClient: HttpClient) { }

  getRequirements(): Observable<any> {
    const url = 'http://193.146.116.148:3000/requirements';
    return this.httpClient.get(url);
  }
}

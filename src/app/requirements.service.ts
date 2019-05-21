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

  getRequirementsByProject(project): Observable<any> {
    const url = 'http://193.146.116.148:3000/requirements?project='+ project;
    return this.httpClient.get(url);
  }

  getProjects(): Observable<any> {
    const url = 'http://193.146.116.148:3000/projects';
    return this.httpClient.get(url);
  }
}

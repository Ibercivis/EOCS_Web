import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {
  
  baseURL = "http://193.146.116.148:3000";

  constructor(private httpClient: HttpClient) { }

  getRequirements(): Observable<any> {
    const url = this.baseURL + '/requirements';
    return this.httpClient.get(url);
  }

  getRequirementsByProject(project): Observable<any> {
    const url = this.baseURL + '/requirements?project='+ project;
    return this.httpClient.get(url);
  }

  getProjects(): Observable<any> {
    const url = this.baseURL + '/projects';
    return this.httpClient.get(url);
  }

  deleteRequirement(requirement): Observable<any> {
    const url = this.baseURL + '/requirement?requirement=' + requirement;
    return this.httpClient.delete(url);
  }
}

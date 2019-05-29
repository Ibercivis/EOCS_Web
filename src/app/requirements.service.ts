import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


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
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError('deleteRequirement'))
    );;
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead

      // TODO: better job of transforming error for user consumption
    //  this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };

  }

}

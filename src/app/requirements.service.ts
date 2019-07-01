import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReqClass } from './req-class.enum';



@Injectable({
  providedIn: 'root'
})
export class RequirementsService {

  constructor(private httpClient: HttpClient) { }

  getProjects(): Observable<any> {
    const url = environment.microservices_url + ':9682/hitec/repository/twitter/observables';
    return this.httpClient.get(url);
  }

  getRequirementsByProject(project): Observable<any> {
    const url = environment.microservices_url + ':9682/hitec/repository/twitter/account_name/' 
      + project + '/all';
    return this.httpClient.get(url);
  }

  addObserveAccount(account): Observable<any> {
    const url = environment.microservices_url + ":9703/hitec/orchestration/twitter/observe/tweet/account/"
      + account + "/interval/hourly/lang/en"
    return this.httpClient.post(url, null);
  }

  insertRequirement(account, text, reqClass, from): Observable<any> {
    const url = environment.microservices_url + ":9682/hitec/repository/twitter/store/tweet/"
    if(Object.values(ReqClass).includes(reqClass)){
      reqClass = reqClass.toLowerCase();
    }else{
      reqClass = ReqClass.IRRELEVANT;
    }
    var body = [
      {
        "sentiment": "",
        "sentiment_score": 0,
        "status_id": "" + (Math.floor(Math.random() * (999999 - 100000)) + 100000),
        "in_reply_to_screen_name": account,
        "tweet_class": reqClass,
        "user_name": from,
        "created_at": 20190601,
        "favorite_count": 0,
        "text": text,
        "lang": "en",
        "retweet_count": 0
      }
    ];
    return this.httpClient.post(url, JSON.stringify(body));
  }

  deleteRequirement(requirement): Observable<any> {
    const url = environment.backend_url + '/requirement?requirement=' + requirement;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError('deleteRequirement'))
    );
  }

  deleteProject(account) {
    const url = environment.microservices_url + ':9703/hitec/orchestration/twitter/observe/account/'
      + account;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError('deleteProject'))
    );
  }

  deleteProjectRequirements(selectedAccount){
    const url = environment.backend_url + '/requirements?account=' + selectedAccount;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError('deleteProjectRequirements'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    };
  }

  createProjectEdemocracy(project, requirements) : Observable<any> {
    console.log(project);
    let url = environment.microservices_url + ":9750/api/projects?";

    let tickets = "";
    let index = 0;
    for (let req of requirements) {
      let urlTicket ="tickets[" + index + "][url]=url";
      let titletTicket = "&tickets[" + index + "][title]=" + req.text;
      let idTicket = "&tickets[" + index + "][id]=" + index;
      let externalIdTicket = "&tickets[" + index + "][external_id]=" + req.status_id.slice(-7);
      let descriptionTicket = "&tickets[" + index + "][description]=" + req.text;
      tickets += urlTicket + titletTicket + idTicket + externalIdTicket + descriptionTicket + "&";
      index++;
    }
    url += tickets;

    let body = new URLSearchParams();
    body.set('title', project);
   
    //TODO create form with phase dates
    body.set('phase_end', '2019-09-18T12:06:06.855Z');
    body.set('phase_candidates', '2019-06-18T12:06:06.855Z');
    body.set('id', '10');

    url += body;
    return this.httpClient.post(url, JSON.stringify(body));
  }

}

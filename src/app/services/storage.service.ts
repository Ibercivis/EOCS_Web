import { Injectable } from '@angular/core';
import { Session } from '../model/Session';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private localStorageService;
  private currentSession : Session = null;
  keySession = "currentSession";
  keyProject = "selectedProject";
  triggerEventSession = new BehaviorSubject(false);
  triggerEventObs = this.triggerEventSession.asObservable();
  project;

  constructor() {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
    this.project = this.loadProjectData();
   }

  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem(this.keySession, JSON.stringify(session));
  }

  loadSessionData(): Session{
    var sessionStr = this.localStorageService.getItem(this.keySession);
    return (sessionStr) ? <Session> JSON.parse(sessionStr) : null;
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }
  removeCurrentSession(): void {
    this.localStorageService.removeItem(this.keySession);
    this.currentSession = null;
  }

  getCurrentUser(): string {
    var session: Session = this.getCurrentSession();
    return (session && session.userName) ? session.userName : null;
  };

  getUserId(): string {
    var session: Session = this.getCurrentSession();
    return (session && session.userId) ? session.userId : null;
  };

  isAuthenticated(): boolean {
    return (this.getCurrentToken() != null) ? true : false;
  };

  getCurrentToken(): string {
    var session = this.getCurrentSession();
    return (session && session.token) ? session.token : null;
  };
  
  logout(): void{
    this.removeCurrentSession();
  }

  setSelectedProject(project){
    this.project=project;
    this.localStorageService.setItem(this.keyProject, JSON.stringify(project));
  }

  loadProjectData(): Session{
    var projectStr = this.localStorageService.getItem(this.keyProject);
    return (projectStr) ? <Session> JSON.parse(projectStr) : null;
  }

  getSelectedProject(){
    return this.project;
  }

  removeSelectedProject(): void {
    this.localStorageService.removeItem(this.keyProject);
    this.project = null;
  }
  
}

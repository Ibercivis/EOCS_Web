import { Component, OnInit } from '@angular/core';
import { RequirementsService } from '../services/requirements.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {

  projects;

  constructor(private requirementService: RequirementsService, private router: Router,
    private storageService: StorageService) { }

  ngOnInit() {
    this.storageService.removeSelectedProject();
    this.getProjects();
  }

  getProjects() {
    this.requirementService.getProjects().subscribe(apiData => {
      this.projects = apiData;
    });
  }

  goProject(project){
    this.storageService.setSelectedProject(project);
    this.storageService.triggerEventSession.next(true);
    this.router.navigateByUrl('project/'+project.account_name);
  }

}

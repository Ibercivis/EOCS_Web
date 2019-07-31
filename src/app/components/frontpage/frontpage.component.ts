import { Component, OnInit } from '@angular/core';
import { RequirementsService } from '../../services/requirements.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Phase } from 'src/app/enums/phase.enum';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {

  projects;
  phase0 = Phase.PHASE_0;

  constructor(private requirementService: RequirementsService, private router: Router,
    private storageService: StorageService) { }

  ngOnInit() {
    this.storageService.removeSelectedProject();
    this.getProjects();
  }

  getProjects() {
    this.requirementService.getProjects().subscribe(apiData => {
      this.projects = apiData;
      if(!this.projects) return;
      this.requirementService.getEdemocracyProjects().subscribe(data => {
        let edemocracyProjects = data;
        for (let project of this.projects) {
          for (let edeProject of edemocracyProjects) {
            if (project.account_name == edeProject.title) {
              project.phase = this.getPhase(edeProject.current_phase);
              continue;
            }
          }
        }
      });     
    });
  }

  private getPhase(edePhase){
    let phase;
    switch(edePhase){
      case "phase_users" : phase=Phase.PHASE_1; break;
      case "phase_candidates" : phase=Phase.PHASE_2; break;
      case "phase_end" : phase=Phase.PHASE_3; break;
    }
    return phase;
  }

  goProject(project){
    this.storageService.setSelectedProject(project);
    this.storageService.triggerEventSession.next(true);
    this.router.navigateByUrl('project/'+project.account_name);
  }

}

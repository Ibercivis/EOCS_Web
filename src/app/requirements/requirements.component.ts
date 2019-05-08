import { Component, OnInit } from '@angular/core';
import { Requirement } from '../Requirement';
import { RequirementsService } from '../requirements.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit {

  requirements:Requirement[] = [];

  constructor(private requirementService : RequirementsService) { }

  ngOnInit() {
    this.getRequirements();
  }

  getRequirements() {
    this.requirementService.getRequirements().subscribe(apiData => (this.requirements = apiData));
  }
  
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Requirement } from '../../model/Requirement';
import { RequirementsService } from '../../services/requirements.service';
import { Phase } from '../../enums/phase.enum';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit {

  requirements: Requirement[];
  filteredRequirements: Requirement[] = [];

  //Forms
  searchRequirementForm;
  selectProjectForm;
  candidateForm;

  projects;
  projectSelected;

  sortType = 'text';
  sortReverse = false;

  //Phase
  phase;
  phase_candidates_at;
  phase_end_at;
  phase0 = Phase.PHASE_0;
  phase1 = Phase.PHASE_1;
  phase2 = Phase.PHASE_2;
  phase3 = Phase.PHASE_3;

  //Participation
  roleParticipant;
  candidates;
  isParticipant = false;
  voted = false;
  votes = new Array();


  constructor(private requirementService: RequirementsService, private storageService: StorageService) {
    this.selectProjectForm = new FormGroup({
      projectSelected: new FormControl('')
    });
    this.searchRequirementForm = new FormGroup({
      searchRequirement: new FormControl('')
    });
    this.candidateForm = new FormGroup({
      candidate_summary: new FormControl('')
    });
  }

  ngOnInit() {
    this.getProjects();
    this.searchRequirementForm.controls['searchRequirement'].valueChanges
      .subscribe(
        value => {
          this.filterRequirements();
        }
      );
  }

  filterRequirements() {
    if (this.searchRequirementForm.controls['searchRequirement'].value == null) {
      this.searchRequirementForm.controls['searchRequirement'].value = '';
    }
    if (this.requirements != null) {
      this.filteredRequirements = this.requirements.filter(requirement =>
        requirement.text.toLowerCase().indexOf(
          this.searchRequirementForm.controls['searchRequirement'].value.toLowerCase()) !== -1);
    }
  }

  getProjects() {
    this.requirementService.getProjects().subscribe(apiData => {
      this.projects = apiData;
      this.requirementService.getEdemocracyProjects().subscribe(data => {
        let edemocracyProjects = data;
        if (this.projects !== null && this.projects.length > 0) {
          this.projectSelected = this.projects[0];
          let account_name = this.projects[0].account_name;
          this.getRequirementsByProject(account_name);
          this.selectProjectForm.controls['projectSelected'].setValue(account_name, { onlySelf: true });
          this.associateProjectWithEdemocracy(edemocracyProjects);
        }
      });
    });
  }

  associateProjectWithEdemocracy(edemocracyProjects) {
    for (let project of this.projects) {
      for (let edeProject of edemocracyProjects) {
        if (project.account_name == edeProject.title) {
          project.idEde = edeProject.id;
          break;
        }
      }
    }
  }

  getRequirementsByProject(project) {
    this.requirementService.getRequirementsByProject(project).subscribe(
      apiData => {
        this.filteredRequirements = this.requirements = apiData;
        console.log("idEde=" + this.projectSelected.idEde);
        if (this.projectSelected.idEde) {      //call Edemocracy and get more info
          this.getEdemocracyInfo();
        } else {
          this.phase = Phase.PHASE_0;
        }
      });
  }

  private getEdemocracyInfo() {
    this.getVotes();
    this.requirementService.getProjectEdemocracy(this.projectSelected.idEde).subscribe(
      data => {
        this.fillPhase(data);
        this.voted = false;
        if (this.isAuthenticated()) {
          this.requirementService.getParticipants(this.projectSelected.idEde).subscribe(
            participants => {
              console.log("UserID=" + this.storageService.getCurrentSession().userId);
              this.roleParticipant = "";
              this.isParticipant = this.hasParticipated(participants, this.storageService.getCurrentSession().userId);
              console.log(this.isParticipant ? "Participant" : "No partipant");
              this.managePhase();
            }
          )
        }
      });
  }

  private fillPhase(data){
    this.phase_candidates_at = data.phase_candidates_at;
    this.phase_end_at = data.phase_end_at;
    this.phase = this.getProjectPhase();
    console.log(this.phase);
  }

  private managePhase(){
    if (this.roleParticipant == 'user' && this.phase == Phase.PHASE_1) {
      this.getCandidates();
      this.hasDelegateVote();
    }
    if (this.roleParticipant == 'candidate' && this.phase == Phase.PHASE_2) {
      this.getParticipationForUser();
    }
  }

  hasDates(): boolean {
    if (this.projectSelected && this.projectSelected.idEde) {
      return true;
    }
    return false;
  }

  changeProject(value) {
    console.log("\n**** Change project ****");
    this.searchRequirementForm.controls['searchRequirement'].setValue(null, { onlySelf: true });
    var account = value.substring(value.indexOf(' ') + 1, value.length);
    for (let acc of this.projects) {
      if (acc.account_name == account) {
        this.projectSelected = acc;
      }
    }
    this.getRequirementsByProject(account);
  }

  isAuthenticated(): boolean {
    return this.storageService.isAuthenticated();
  }

  private hasParticipated(participants, userId) {
    for (var i = 0; i < participants.length; i++) {
      if (participants[i].user_id == userId) {
        this.roleParticipant = participants[i].role;
        console.log('Role=' + this.roleParticipant);
        return true;
      }
    }
    return false;
  }

  getCandidates() {
    this.requirementService.getParticipants(this.projectSelected.idEde).subscribe(
      participants => {
        this.candidates = participants.filter(participant =>
          participant.role == 'candidate');
          for(let candidate of this.candidates){
            this.requirementService.getParticipantName(candidate.user_id).subscribe(
              data => {                
                candidate.name = data.username;
              }
            );
          }
          
      });
  }

  private getProjectPhase(): String {
    var phase;
    var a = new Date().getTime() - new Date(this.phase_candidates_at).getTime();
    var b = new Date().getTime() - new Date(this.phase_end_at).getTime();
    if (a > 0) {
      if (b > 0) {
        phase = Phase.PHASE_3;
      } else {
        phase = Phase.PHASE_2;
      }
    } else {
      phase = Phase.PHASE_1;
    }
    return phase;
  }

  isPhase(phaseId): boolean {
    let phases = Object.values(Phase);
    return phases[phaseId] === this.phase;
  }

  deleteRequirement(requirementId) {
    console.log('Delete requirement: ' + requirementId);
    this.requirementService.deleteRequirement(requirementId)
      .subscribe(data => {
        let index = 0;
        for (let req of this.filteredRequirements) {
          if (req['status_id'] == requirementId) {
            this.filteredRequirements.splice(index, 1);
            break;
          }
          index++;
        }
      }, error => {
        console.log('Error deleting requirement');
      });
  }

  deleteProject() {
    let projectSelected = this.projectSelected.account_name;
    console.log('Delete project: ' + projectSelected);
    this.requirementService.deleteProject(projectSelected)
      .subscribe(data => {
        alert('Project account deleted');
        //Delete all Project's requirements
        this.deleteAllRequirements(projectSelected);
        this.getProjects();
      }, error => {
        console.log('Error deleting project');
      });
  }

  deleteAllRequirements(projectSelected) {
    console.log('Delete requirements from: ' + projectSelected);
    this.requirementService.deleteProjectRequirements(projectSelected)
      .subscribe(data => {
        console.log('Success deleting project requirements');
      }, error => {
        console.log('Error deleting project requirements');
      });
  }

  deleteVoting() {
    this.requirementService.deleteVotingProject(this.projectSelected.account_name, this.projectSelected.idEde)
      .subscribe(data => {
        console.log('Success deleting voting project');
        this.projectSelected.idEde = null;
        this.getRequirementsByProject(this.projectSelected.account_name);
      }, error => {
        console.log('Error deleting voting project');
      });
  }

  createParticipation(rol) {
    let session = this.storageService.getCurrentSession();
    let candidate_summary;
    if (rol == 'candidate') {
      candidate_summary = this.candidateForm.controls['candidate_summary'].value;
      this.candidateForm.controls['candidate_summary'].setValue(null, { onlySelf: true });
    }
    this.requirementService.createParticipation(session, rol, this.projectSelected.idEde, candidate_summary).subscribe(data => {
      console.log('Success participation');
      this.getRequirementsByProject(this.projectSelected.account_name);
    }, error => {
      console.log('Error creating participation');
    });
  }

  delegateVote(userId) {
    let participation = new Array();
    participation.push(userId);
    this.requirementService.vote(this.projectSelected.idEde,
      this.storageService.getCurrentSession().token, participation).subscribe(result => {
        this.voted = true;
      });
  }

  hasDelegateVote() {
    this.requirementService.getProjectParticipationForUser(this.projectSelected.idEde,
      this.storageService.getCurrentSession().token).subscribe(result => {
        if (result && typeof result.votes !== 'undefined' && result.votes.length > 0) {
          this.voted = true;
          console.log("Vote already delegated");
        } else {
          this.voted = false;
          console.log("Vote not yet delegated");
        }
      });
  }

  getParticipationForUser() {
    this.requirementService.getProjectParticipationForUser(this.projectSelected.idEde,
      this.storageService.getCurrentSession().token).subscribe(result => {
        if (result && typeof result.votes !== 'undefined' && result.votes.length > 0) {
          this.votes = new Array();
          for (let i = 0; i < result.votes.length; i++) {
            this.votes[i] = result.votes[i].id;
          }
          for (let vote of result.votes) {
            this.registerVoted(vote.external_id, true);
          }
        }
      });
  }

  private registerVoted(externalId, voted) {
    for (let req of this.requirements) {
      if (req.status_id == externalId) {
        req.voted = voted;
      }
    }
    this.filteredRequirements = this.requirements;
  }

  vote(externalId) {
    this.requirementService.getTicketsEdemocracy(this.projectSelected.idEde)
      .subscribe(data => {
        this.findTicketAndVote(data, externalId);
      });
  }

  findTicketAndVote(data, externalId) {
    let tickets = data;
    let ticketFound = false;
    let voted = false;
    for (let ticket of tickets) {
      if (ticket.external_id == externalId) {
        ticketFound = true;
        let ticketId = ticket.id;
        let voteFound = false;
        if (this.votes) {
          for (let vote of this.votes) {
            if (vote == ticketId) {
              voteFound = true;
              break;
            }
          }
        }
        if (voteFound) {
          this.votes = this.votes.filter(element => element != ticketId);
        } else {
          this.votes.push(ticketId);
          voted = true;
        }
        this.requirementService.vote(this.projectSelected.idEde,
          this.storageService.getCurrentSession().token, this.votes).subscribe(result => {
            this.registerVoted(externalId, voted);
          });
        break; //Already found
      }
    }
    if (!ticketFound) {
      alert("Vote hasn't been completed because ticket hasn't been found. This ticket could have been created after the voting started");
    }
  }

  deleteVote(externalId) {
    this.requirementService.getTicketsEdemocracy(this.projectSelected.idEde)
      .subscribe(data => {
        this.findTicketAndVote(data, externalId);
      });
  }

  getVotes() {
    this.requirementService.getReport(this.projectSelected.idEde).subscribe(result => {
      for (let ticket of result.votes.tickets) {
        for (let req of this.requirements) {
          if (req.status_id == ticket.ticket.external_id) {
            req.votes = ticket.votes_received;
          }
        }
        this.filteredRequirements = this.requirements;
      }
    });
  }

}


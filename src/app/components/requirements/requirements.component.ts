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
  filteredOptions: Requirement[] = [];searchRequirementForm;
  selectProjectForm;
  candidateForm;
  sortType = 'text';
  sortReverse = false;
  accounts;
  projectSelected;
  phase;
  phase_candidates_at;
  phase_end_at;
  phase0 = Phase.PHASE_0;
  phase1 = Phase.PHASE_1;
  phase2 = Phase.PHASE_2;
  phase3 = Phase.PHASE_3;
  isParticipant = false;
  roleParticipant;
  candidates;
  voted = false;

  constructor(private requirementService: RequirementsService, private storageService: StorageService) {
    this.selectProjectForm = new FormGroup({
      selectedAccount: new FormControl('')
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

  getProjects() {
    this.requirementService.getProjects().subscribe(apiData => {
      this.accounts = apiData;
      this.requirementService.getProjectsEdemocracy().subscribe(data => {
        let projectsEdemocracy = data;
        if (this.accounts !== null && this.accounts.length > 0) {
          this.projectSelected = this.accounts[0];
          var account_name = this.accounts[0].account_name;
          this.getRequirementsByProject(account_name);
          this.selectProjectForm.controls['selectedAccount'].setValue(account_name, { onlySelf: true });
          this.associateProjectWithEdemocracy(projectsEdemocracy);
        }
      });
    });
  }

  associateProjectWithEdemocracy(projectsEdemocracy) {
    for (let account of this.accounts) {
      for (let projectEde of projectsEdemocracy) {
        if (account.account_name == projectEde.title) {
          account.idEde = projectEde.id;
          break;
        }
      }
    }
  }

  hasDates(): boolean {
    if (this.projectSelected && this.projectSelected.idEde) {
      return true;
    }
    return false;
  }

  accountChange(value) {
    this.searchRequirementForm.controls['searchRequirement'].setValue(null, { onlySelf: true });
    var account = value.substring(value.indexOf(' ') + 1, value.length);
    for (let acc of this.accounts) {
      if (acc.account_name == account) {
        this.projectSelected = acc;
      }
    }
    this.getRequirementsByProject(account);
  }

  getRequirementsByProject(project) {
    this.requirementService.getRequirementsByProject(project).subscribe(
      apiData => {
        this.filteredOptions = this.requirements = apiData;
        console.log("idEde=" + this.projectSelected.idEde);
        console.log(this.requirements);
        if (this.projectSelected.idEde) {        //call Edemocracy and get more info
          this.getVotes();
          this.requirementService.getProjectEdemocracy(this.projectSelected.idEde).subscribe(
            data => {
              this.phase_candidates_at = data.phase_candidates_at;
              this.phase_end_at = data.phase_end_at;
              this.phase = this.getProjectPhase();
              console.log("Phase = " + this.phase);
              if (this.isAuthenticated()) {
                this.requirementService.getParticipants(this.projectSelected.idEde).subscribe(
                  participants => {
                    console.log(this.storageService.getCurrentSession().userId);
                    console.log(participants);
                    this.isParticipant = this.hasParticipated(participants, this.storageService.getCurrentSession().userId);
                    console.log('role=' + this.roleParticipant + ' phase=' + this.phase);
                    if (this.roleParticipant == 'user' && this.phase == Phase.PHASE_1) {
                      this.getCandidates();
                      this.hasDelegateVote();
                    }
                    if (this.roleParticipant == 'candidate' && this.phase == Phase.PHASE_2) {
                      this.getParticipationForUser();
                    }
                  }
                )
              }
            });
        } else {
          this.phase = Phase.PHASE_0;
        }
      });
  }

  isAuthenticated(): boolean {
    return this.storageService.isAuthenticated();
  }

  private hasParticipated(participants, userId) {
    for (var i = 0; i < participants.length; i++) {
      if (participants[i].user_id == userId) {
        this.roleParticipant = participants[i].role;
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

  filterRequirements() {
    if (this.searchRequirementForm.controls['searchRequirement'].value == null) {
      this.searchRequirementForm.controls['searchRequirement'].value = '';
    }
    if (this.requirements != null) {
      this.filteredOptions = this.requirements.filter(requirement =>
        requirement.text.toLowerCase().indexOf(
          this.searchRequirementForm.controls['searchRequirement'].value.toLowerCase()) !== -1);
    }
  }

  deleteRequirement(req) {
    console.log('Delete requirement: ' + req);
    this.requirementService.deleteRequirement(req)
      .subscribe(data => {
        let index = 0;
        for (let obj of this.filteredOptions) {
          if (obj['status_id'] == req) {
            this.filteredOptions.splice(index, 1);
            break;
          }
          index++;
        }
      }, error => {
        console.log('Error deleting requirement');
      });
  }

  deleteProject() {
    let selectedAccount = this.selectProjectForm.controls['selectedAccount'].value;
    console.log('Delete project: ' + selectedAccount);
    this.requirementService.deleteProject(selectedAccount)
      .subscribe(data => {
        alert('Project account deleted');
        //Delete all Project's requirements
        this.deleteAllRequirements(selectedAccount);
        this.getProjects();
      }, error => {
        console.log('Error deleting project');
      });
  }

  deleteAllRequirements(selectedAccount) {
    console.log('Delete requirements from: ' + selectedAccount);
    this.requirementService.deleteProjectRequirements(selectedAccount)
      .subscribe(data => {
        console.log('Success deleting project requirements');
      }, error => {
        console.log('Error deleting project requirements');
      });
  }

  deleteVoting() {
    alert("Delete voting..");
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
    this.requirementService.vote(this.projectSelected.idEde,
      this.storageService.getCurrentSession().token, userId).subscribe(result => {
        this.voted = true;
      });
  }

  hasDelegateVote() {
    this.requirementService.getProjectParticipationForUser(this.projectSelected.idEde,
      this.storageService.getCurrentSession().token).subscribe(result => {
        console.log(result);
        if (result && typeof result.votes !== 'undefined' && result.votes.length > 0) {
          this.voted = true;
          console.log("ha delegado voto");
        } else {
          this.voted = false;
          console.log("no ha delegado voto");
        }
      });
  }

  getParticipationForUser(){
    this.requirementService.getProjectParticipationForUser(this.projectSelected.idEde,
      this.storageService.getCurrentSession().token).subscribe(result => {
        console.log(result);
        if (result && typeof result.votes !== 'undefined' && result.votes.length > 0) {
          //TODO GUardar result.votes para la hora de votar o borrar voto
          for(let vote of result.votes){
            console.log("Ha sido votado:" + vote.external_id);
            for(let req of this.requirements){              
              if(req.status_id == vote.external_id){               
                req.voted = true;
              }
            }
            this.filteredOptions = this.requirements;
          }
        } 
      });
  }

  vote(externalId) {
    console.log("externalID=" + externalId);
    this.requirementService.getTicketsEdemocracy(this.projectSelected.idEde)
      .subscribe(data => {
        console.log(data);
        this.findTicketAndVote(data, externalId);
      });
  }

  findTicketAndVote(data, externalId){
    let tickets = data;
    let ticketFound = false;
    for (let ticket of tickets) {
      if (ticket.external_id == externalId) {
        ticketFound = true;
        let ticketId = ticket.id;
        console.log("ticketId=" + ticketId);
        this.requirementService.vote(this.projectSelected.idEde,
          this.storageService.getCurrentSession().token, ticketId).subscribe(result => {
            console.log("vote ended");
            console.log(result);
            this.voted = true;
          });
      }
    }
    if(!ticketFound){
      alert("Vote hasn't been completed because ticket hasn't been found. This ticket could have been created after the voting started");
    }
  }

  deleteVote(requirementId) {

  }

  getVotes(){
    this.requirementService.getReport(this.projectSelected.idEde).subscribe(result => {
      for(let ticket of result.votes.tickets){
        console.log("ticket id:" + ticket.ticket.external_id + " - votos: " + ticket.votes_received);
        for(let req of this.requirements){
          console.log("status_id:" + req.status_id);
          if(req.status_id == ticket.ticket.external_id){
            console.log("aaaa");
            req.votes = ticket.votes_received;
          }
        }
        this.filteredOptions = this.requirements;
      }
    });
  }

}


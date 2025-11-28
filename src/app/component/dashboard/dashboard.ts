import { Component, OnInit } from '@angular/core';
import { JOB_LIST } from './jobs';
import { JOB_DETAILS } from './job-details';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{
   jobs = JOB_LIST;
  selectedJob: any = null;
  selectedDetails: any = null;
   ngOnInit() {
    // Select the first job automatically
    this.selectedJob = this.jobs[0];

    // Load its details
    if (this.jobs[0].descriptionData) {
      this.selectedDetails = JOB_DETAILS[this.jobs[0].descriptionData];
    }
  }

   showDetails(job: any) {
    this.selectedJob = job;

    if (job.descriptionData) {
      this.selectedDetails = JOB_DETAILS[job.descriptionData];
    } else {
      this.selectedDetails = null;
    }
  }
}

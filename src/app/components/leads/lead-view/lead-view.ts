import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LeadService } from '../../../services/lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../../../models/lead.model';

@Component({
 standalone: true,
  selector: 'app-lead-view',
  imports: [CommonModule, RouterModule],
  templateUrl: './lead-view.html',
  styleUrl: './lead-view.css'
})

export class LeadView implements OnInit {
  private route = inject(ActivatedRoute);
  private leadService = inject(LeadService);

  lead$!: Observable<Lead>;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.lead$ = this.leadService.getLeadById(id);
  }
}
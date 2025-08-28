import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LeadService } from '../../../services/lead.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-lead-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css']  
})
export class LeadDetailComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);

  leadId = this.route.snapshot.params['id'];
  form = this.fb.group({ name: [''], email: [''], phone: [''], status: ['Prospect'], priority: ['Medium'], notes: [''] });
  private sub = new Subscription();

  constructor() {
    const s1 = this.leadService.getLeads().subscribe(list => {
      const lead = list.find(l => l.id === this.leadId);
      if (lead) this.form.patchValue(lead, { emitEvent: false });
    });
    this.sub.add(s1);

    const s2 = this.form.valueChanges.pipe(debounceTime(600)).subscribe(async (v) => {
      // Convert nulls to undefined for Lead compatibility
      const sanitized = Object.fromEntries(
        Object.entries(v).map(([k, val]) => [k, val === null ? undefined : val])
      );
      await this.leadService.updateLead(this.leadId, sanitized);
    });
    this.sub.add(s2);
  }

  ngOnDestroy(){ this.sub.unsubscribe(); }
}

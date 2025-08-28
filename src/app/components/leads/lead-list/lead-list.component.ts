import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LeadService } from '../../../services/lead.service';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Lead } from '../../../models/lead.model';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-lead-list',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css']
})
export class LeadListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);
  private router = inject(Router);

  filterForm = this.fb.group({ q: [''], status: [''], region: [''], priority: [''] });
  leads$!: Observable<Lead[]>;

  ngOnInit() {
    this.leads$ = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(filters => {
        const sanitizedFilters = {
          q: filters.q ?? undefined,
          status: filters.status ?? undefined,
          region: filters.region ?? undefined,
          priority: filters.priority ?? undefined
        };
        return this.leadService.queryLeads(sanitizedFilters);
      })
    );
  }

  async deleteLead(id?: string) {
    if (!id) return;
    if (!confirm('Delete this lead?')) return;
    await this.leadService.deleteLead(id);
  }


  addLead() {
    this.router.navigate(['/leads/new']);
  }
}

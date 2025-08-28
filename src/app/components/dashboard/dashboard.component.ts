import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime, switchMap, startWith } from 'rxjs/operators';
import { LeadService } from '../../services/lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../../models/lead.model';
import { DashboardService } from '../../services/dashboard.service';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, NgChartsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);
  private dash = inject(DashboardService);

  form = this.fb.group({ q: [''], region: [''], product: [''] });
  leads$!: Observable<Lead[]>;
  conversion$ = this.dash.getConversionRates();
  chart$ = this.dash.getConversionTrend();

  ngOnInit() {
    this.leads$ = this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),   // ✅ ensures initial load
      debounceTime(300),                    // ✅ wait for typing stop
      switchMap(values => {
        // ✅ always build fresh filters
        return this.leadService.queryLeads({
          q: values.q?.trim() || undefined,
          region: values.region || undefined,
          product: values.product || undefined
        });
      })
    );
  }
}
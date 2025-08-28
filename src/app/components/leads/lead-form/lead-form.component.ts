import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadService } from '../../../services/lead.service';

@Component({
  standalone: true,
  selector: 'app-lead-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.css']
})
export class LeadFormComponent {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]],
    phone: ['', ],
    product: [''],
    priority: [''],
    region: [''],
    status: ['Prospect'],
    notes: ['']
  });

  get f(){ return this.form.controls; }

  async save() {
    if (this.form.invalid) return;
    await this.leadService.addLead(this.form.value as any);
    this.router.navigate(['/leads']);
  }
}

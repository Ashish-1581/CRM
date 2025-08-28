import { inject, Injectable } from '@angular/core';
import { LeadService } from './lead.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private leadService = inject(LeadService);

  getConversionRates() {
    return this.leadService.getLeads().pipe(
      map((list) => {
        const total = list.length;
        const qualified = list.filter(
          (l: any) => l.status === 'Qualified'
        ).length;
        return total ? (qualified / total) * 100 : 0;
      })
    );
  }

  getConversionTrend() {
    return this.leadService.getLeads().pipe(
      map((list) => {
        const labels = [ 'Prospect', 'Qualified'];
        const data = labels.map(
          (lbl) => list.filter((l: any) => l.status === lbl).length
        );
        return { labels, data };
      })
    );
  }
}

import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query as firestoreQuery,
  where,
  orderBy,
  QueryConstraint,
  docData
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Lead } from '../models/lead.model';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private firestore = inject(Firestore);
  private path = 'leads';

  getLeads(): Observable<Lead[]> {
    const colRef = collection(this.firestore, this.path);
    return collectionData(colRef, { idField: 'id' }) as Observable<Lead[]>;
  }

  queryLeads(filters: {
    q?: string;
    region?: string;
    product?: string;
    status?: string;
    priority?: string;
  }): Observable<Lead[]> {
    const colRef = collection(this.firestore, this.path);
    const constraints: QueryConstraint[] = [];

    // Firestore filters (server-side)
    if (filters.region) constraints.push(where('region', '==', filters.region));
    if (filters.product)
      constraints.push(where('product', '==', filters.product));
    if (filters.status) constraints.push(where('status', '==', filters.status));
    if (filters.priority)
      constraints.push(where('priority', '==', filters.priority));

    // Always order by updatedAt (if your Firestore rules/indexes allow)
    constraints.push(orderBy('updatedAt', 'desc'));

    const q = firestoreQuery(colRef, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs: any[]) => docs.map((doc) => doc as Lead)),
      map((leads: Lead[]) => {
        // Client-side keyword search (q)
        if (filters.q) {
          const keyword = filters.q.toLowerCase();
          return leads.filter(
            (l) =>
              l.name?.toLowerCase().includes(keyword) ||
              l.email?.toLowerCase().includes(keyword) ||
              l.product?.toLowerCase().includes(keyword) ||
              l.region?.toLowerCase().includes(keyword)
          );
        }
        return leads;
      })
    );
  }

  addLead(lead: Lead) {
    const now = Date.now();
    return addDoc(collection(this.firestore, this.path), {
      ...lead,
      createdAt: now,
      updatedAt: now,
    });
  }

  getLeadById(id: string): Observable<Lead> {
  const ref = doc(this.firestore, `${this.path}/${id}`);
  return docData(ref, { idField: 'id' }) as Observable<Lead>;
}

  updateLead(id: string, partial: Partial<Lead>) {
    const ref = doc(this.firestore, `${this.path}/${id}`);
    return updateDoc(ref, { ...partial, updatedAt: Date.now() } as any);
  }

  deleteLead(id: string) {
    const ref = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(ref);
  }
}

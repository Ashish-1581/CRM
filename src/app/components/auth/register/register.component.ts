import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email=''; password=''; displayName=''; role:'user'|'sales'|'manager'='user'; error='';
  async onRegister(){ try{ await this.auth.register(this.email,this.password,this.displayName,this.role); this.router.navigate(['/dashboard']); } catch(e:any){ this.error = e?.message || 'Registration failed'; } }
}

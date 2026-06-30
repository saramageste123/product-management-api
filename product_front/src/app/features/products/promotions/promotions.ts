import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotions.html',
  styleUrl: './promotions.css'
})
export class PromotionsComponent {

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']);
  }

}
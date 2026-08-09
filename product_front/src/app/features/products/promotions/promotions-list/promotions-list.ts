import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Promotion } from '../../models/promotion.model';

@Component({
  selector: 'app-promotions-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotions-list.html',
  styleUrl: './promotions-list.css'
})
export class PromotionsListComponent{
  
  @Input()
  promotions: Promotion[] = [];

}
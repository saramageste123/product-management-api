import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list';
import { NotificationsHistoryComponent } from './features/products/notifications/notifications-history/notifications-history';
import { PromotionsComponent } from './features/products/promotions/promotions';

export const routes: Routes = [
    {
        path: '',
        component: ProductListComponent
    },
    {
        path: 'notifications',
        component: NotificationsHistoryComponent
    },
    {
        path: 'promotions',
        component: PromotionsComponent
    }
];
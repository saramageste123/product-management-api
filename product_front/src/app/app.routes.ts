import { Routes } from '@angular/router';
import { HomeComponent } from './features/products/home/home';
import { NotificationsHistoryComponent } from './features/products/notifications/notifications-history/notifications-history';
import { PromotionsComponent } from './features/products/promotions/promotions';
import { LoginComponent } from './features/products/login/login';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: HomeComponent
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
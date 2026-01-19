import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { ProductService } from './features/products/service/product.service';
import { of } from 'rxjs';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProductsPaged: () =>
              of({
                products: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0
              })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});

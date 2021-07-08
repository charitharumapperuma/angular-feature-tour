import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export class Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products$: Observable<Product[]>;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.products$ = this.httpClient.get<Product[]>('https://fakestoreapi.com/products');
  }

}

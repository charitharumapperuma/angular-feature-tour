import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
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
  public desc = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium alias autem debitis delectus dignissimos distinctio dolor ea earum, eligendi error ex excepturi explicabo fuga impedit ipsa ipsam iure laudantium maxime nam natus nihil obcaecati officiis perferendis possimus praesentium quo quod repudiandae sed sunt tempore ut velit veniam vero vitae, voluptatem voluptatum. Alias aperiam architecto corporis deserunt dicta dolore dolorem eos nemo nostrum odio, quod soluta, vero! Amet delectus enim laboriosam mollitia quas quia velit? Distinctio id in iure, nobis officia rerum sapiente unde. A alias asperiores deleniti ducimus, eveniet, ex expedita nulla optio provident qui reiciendis reprehenderit repudiandae soluta tempore voluptate. Ab beatae deserunt ipsa ipsum natus odit officiis quo tenetur totam, vero. Aut culpa enim est fugiat impedit iste laborum maiores, molestiae necessitatibus nesciunt nobis odit officia praesentium quae quam recusandae reiciendis repellat repellendus, repudiandae vitae! Assumenda blanditiis commodi deserunt dolore dolorem doloremque doloribus ea eaque error esse eum eveniet illo, impedit ipsa ipsam libero magni maxime minus nam, non numquam odit repudiandae rerum soluta suscipit temporibus vel voluptas. Adipisci corporis cum deleniti dignissimos et id illo in itaque iure laboriosam mollitia nam nobis odit omnis provident, ut velit voluptas voluptatibus. Dicta ex ipsum omnis qui repellendus voluptatum!';
  public products$: Observable<Product[]>;

  get description(): string {
    return this.desc.substr(Math.random() * 80, 120);
  }

  constructor(private httpClient: HttpClient ) {
  }

  ngOnInit() {
    this.products$ = this.httpClient.get<Product[]>('https://fakestoreapi.com/products');
  }

}

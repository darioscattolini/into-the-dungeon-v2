import { Component } from '@angular/core';
import { paths } from '../app-routing.paths';

@Component({
  selector: 'dungeon-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public readonly paths = paths;  
}

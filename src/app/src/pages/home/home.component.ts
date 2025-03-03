import { Component } from '@angular/core';
import { ToolbarComponent } from "../../navigation/components/toolbar/toolbar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToolbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

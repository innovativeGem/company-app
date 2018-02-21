import { Component, OnInit } from '@angular/core';
import { CompanyService } from './service/company.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.companyService.getData().subscribe((data) => console.log(data));
  }
}

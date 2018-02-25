import { Component, OnInit } from '@angular/core';
import { CompanyService } from './service/company.service';
import { EmployeeComponent } from './employee/employee.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private companyService: CompanyService) { }

  ceo = '150'; // CEOs id
  employees = []; // Array of all employees as per their position
  compHierarchy = []; // Array sorted as per company hierarchy
  templateString = `
    <td>%col-1%</td>
    <td>%col-2%</td>
    <td>%col-3%</td>`;

  ngOnInit() {
    this.companyService.getData().subscribe((data) => {

      const empArr = []; // temporary employees array.

      // Create new employee from the data object.
      data.map((curr, i, arr) => {
        const employee = new Employee(curr.name, curr.id, curr.managerId);
        const pos = employee.getPosition(curr);
        const mId = curr.managerId;

        empArr.push({employee, pos});

      });

      empArr.sort(function(a, b){
        const posA = a.pos, posB = b.pos;
        return posA - posB;
      });

      // console.log(empArr);

      // Push sorted array to the main employees array.
      empArr.forEach(curr => this.employees.push(curr));

      this.employees.forEach((el, i, arr) => {
        this.addUIElement(el);
      });

      this.hierarchy(this.employees);
    });
  }

  hierarchy(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].pos === 0) {
        this.compHierarchy.push(arr[i]);
        // break;
      } else if ((arr[i].employee.managerId !== '') && (arr[i].employee.managerId !== arr[i - 1].employee.managerId)) {

        const mId = arr[i].employee.managerId; // Manager ID
        const nPos = this.compHierarchy.findIndex(e => e.employee.id === mId) ; // Position of the manager object
        const eArr = arr.filter(e => e.employee.managerId === mId);
        // this.compHierarchy = this.compHierarchy.concat(eArr);
        console.log('nPos: ', nPos);
        eArr.forEach((el, j) => {
          this.compHierarchy.splice((nPos + (j + 1)), 0, el);
        });
        // console.log(arr[i].employee.managerId, '   ', eArr);
      }
    }
    console.log('compHierarchy: ' , this.compHierarchy);
  }

  hierarchyStr(e, p) {
    let str;

    if (p === 0) {
      str = this.templateString.replace('%col-1%', e.name).replace('%col-2%', '').replace('%col-3%', '');
    } else if (p === 1) {
      str = this.templateString.replace('%col-1%', '').replace('%col-2%', e.name).replace('%col-3%', '');
    } else if (p === 2) {
      str = this.templateString.replace('%col-1%', '').replace('%col-2%', '').replace('%col-3%',  e.name);
    }
    return str;
  }

  addUIElement(e) {
    const employee = e.employee;
    const position = e.pos;
    const mId = employee.managerId;

    // console.log(`${employee.name} ${employee.id} ${mId} `);
    // const manager = document.querySelector('#id' + mId);
    const trNode = document.createElement('tr');
    trNode.setAttribute('id', `id${employee.id}`);
    trNode.innerHTML = this.hierarchyStr(employee, position);

    document.getElementById('employee-table').appendChild(trNode);
  }

}

// Employee Class
class Employee {
  name: String;
  id: String;
  managerId: any;
  position: string;
  hierarchyOrder = new Map();
  ceoId = '150'; // Company id of the CEO
  constructor(name, id, managerId) {

    // initial values
    this.name = name;
    this.id = id;
    this.managerId = managerId || '';
    this.position = 'worker';

    // Set hierarchal positions
    this.hierarchyOrder.set('ceo', 0);
    this.hierarchyOrder.set('manager', 1);
    this.hierarchyOrder.set('worker', 2);
  }

  // Company hierarchy logic
  getPosition(e) {
    if (e.id === this.ceoId) {
      return this.hierarchyOrder.get('ceo');
    } else if (e.managerId === this.ceoId) {
      return this.hierarchyOrder.get('manager');
    } else if (e.managerId !== this.ceoId) {
      return this.hierarchyOrder.get('worker');
    }
  }
}

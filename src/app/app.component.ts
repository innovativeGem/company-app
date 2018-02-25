import { Component, OnInit } from '@angular/core';
import { CompanyService } from './service/company.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private companyService: CompanyService) { }

  ceo = '150'; // CEOs id
  compHierarchy = []; // Array sorted as per company hierarchy
  invalidEmployees = []; // Array for invalid employees

  ngOnInit() {
    this.companyService.getData().subscribe((data) => {

      const empArr = []; // temporary employees array.

      // Create new employee from the data object.
      data.map((curr, i, arr) => {
        const employee = new Employee(curr.name, curr.id, curr.managerId);
        const pos = employee.getPosition(curr, this.ceo);
        const mId = curr.managerId;

        if (pos === 4) {
          this.invalidEmployees.push({employee, pos});
        }else {
          empArr.push({employee, pos});
        }

      });

      // Sort temperory employees array as per their position.
      empArr.sort(function(a, b){
        const posA = a.pos, posB = b.pos;
        return posA - posB;
      });

      // console.log(empArr);

      // Sort employees array in the order of their hierarchy.
      this.hierarchy(empArr);
      this.hierarchyInvalidE(this.invalidEmployees);
    });
  }

  hierarchy(arr) {
    const pEl = 'employee-table';
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].pos === 0) {
        this.compHierarchy.push(arr[i]);
        // break;
      } else if ((arr[i].employee.managerId !== '') && (arr[i].employee.managerId !== arr[i - 1].employee.managerId)) {
        const checkEl = this.compHierarchy.includes(arr[i]);
        console.log(checkEl);

        if (!checkEl) { // Check if element already exist?
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
      } else if (arr[i].pos === 3) {
        // console.log('Unsupervised: ', arr[i]);
        this.compHierarchy.splice(this.compHierarchy.length, 0, arr[i]);
      }
    }
    console.log('compHierarchy: ' , this.compHierarchy);

    this.addEmployees(this.compHierarchy, pEl);
  }

  hierarchyInvalidE(arr) {
    if (arr.length > 0) {
      const pEl = 'invalid-employee-table';
      document.getElementById('invalid-employee-table').style.display = 'table';
      // this.invalidEmployees.push(arr[i]);
      console.log('Invalid employee: ' , this.invalidEmployees);
      this.addEmployees(this.invalidEmployees, pEl);
    }
  }

  addEmployees(arr, parentE) {
    arr.forEach(el => {
      this.addUIElement(el, parentE);
    });
  }

  hierarchyStr(e, p) {
    let str;
    let templateString = `
    <td>%col-1%</td>
    <td>%col-2%</td>
    <td>%col-3%</td>`;

    if (p === 0) {
      str = templateString.replace('%col-1%', e.name).replace('%col-2%', '').replace('%col-3%', '');
    } else if (p === 1) {
      str = templateString.replace('%col-1%', '').replace('%col-2%', e.name).replace('%col-3%', '');
    } else if (p === 2) {
      str = templateString.replace('%col-1%', '').replace('%col-2%', '').replace('%col-3%',  e.name);
    } else if (p === 3) {
      templateString = `<td colspan="3" style="text-align:right;">%col-1%</td>`;
      str = templateString.replace('%col-1%', e.name);
    } else if (p === 4) {
      templateString = `<td colspan="3" style="text-align:center;">%col-1%</td>`;
      str = templateString.replace('%col-1%', e.name);
    }
    return str;
  }

  addUIElement(e, parentE) {
    const employee = e.employee;
    const position = e.pos;
    const mId = employee.managerId;

    // console.log(`${employee.name} ${employee.id} ${mId} `);
    // const manager = document.querySelector('#id' + mId);
    const trNode = document.createElement('tr');
    trNode.setAttribute('id', `id${employee.id}`);
    trNode.innerHTML = this.hierarchyStr(employee, position);

    document.getElementById(parentE).appendChild(trNode);
  }

}

// Employee Class
class Employee {
  name: String;
  id: String;
  managerId: any;
  position: string;
  hierarchyOrder = new Map();
  // ceoId = '150'; // Company id of the CEO
  constructor(name, id, managerId) {

    // initial values
    this.name = name;
    this.id = id || '';
    this.managerId = managerId || '';
    this.position = 'worker';

    // Set hierarchal positions
    this.hierarchyOrder.set('ceo', 0);
    this.hierarchyOrder.set('manager', 1);
    this.hierarchyOrder.set('worker', 2);
    this.hierarchyOrder.set('unsupervised worker', 3);
    this.hierarchyOrder.set('invalid manager', 4);
  }

  // Company hierarchy logic
  getPosition(e, cId) {
    const mId = e.managerId;
    const eId = e.id;
    if (e.id === cId) { // If the employee id matched CEO id, that employee is the CEO.
      return this.hierarchyOrder.get('ceo');
    } else if ((eId) && (mId === cId)) { // If the employee is reporting to the CEO, that employee is the manager.
      return this.hierarchyOrder.get('manager');
    } else if ((mId) && (mId !== cId)) { // If the employee has a managerId and is not reporting to the CEO, that employee is a worker.
      return this.hierarchyOrder.get('worker');
    } else if ((mId === '') && (e.id !== cId)) { // Employee with no manager.
      return this.hierarchyOrder.get('unsupervised worker');
    } else if ((eId === '') && (mId === cId)) {
      return this.hierarchyOrder.get('invalid manager');
    }
  }
}

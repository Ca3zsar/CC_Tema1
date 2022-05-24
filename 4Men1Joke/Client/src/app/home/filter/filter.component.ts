import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  author: string = '';
  isChecked: boolean = false;
  sortingCriteria: any;

  tags = [
    "cringe", "meme", "ironic", "short", "pun", "mic drop", "bad joke"
  ];

  selectedItems = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'Deselect All',
    itemsShowLimit: 3,
  };

  filterOptions: any;

  @Output() emitter: EventEmitter<string> = new EventEmitter<string>();

  emit() {
    setTimeout(() => {
      this.filterOptions = {
        'author': this.author,
        'tags': this.selectedItems,
        'hasImage': this.isChecked,
        "sort": this.sortingCriteria
      }
      this.emitter.emit(this.filterOptions);
    }, 100);
  }

  checkText(event: any) {
    this.author = event.target.value;
    this.emit();
  }

  constructor() { }
  
  ngOnInit(): void {
    this.sortingCriteria = "date asc";
    this.emit();
  }

}

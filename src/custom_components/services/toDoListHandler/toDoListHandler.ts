// Purpose: Exports the toDoListService object, which contains all the functions needed to handle to-do lists.
import * as Filter from './Filter/toDoListFilter';
import * as Persistence from './Persistence/toDoListPersistence';
import * as Sorter from "./Sorter/toDoListSort";
import * as Categories from './Categories/categories';
import { IToDoListService } from './IToDoListService';

const toDoListService: IToDoListService = {
  loadAllToDoLists: Persistence.loadAllToDoLists,
  loadToDoList: Persistence.loadToDoList,
  saveToDoList: Persistence.saveToDoList,
  generateUniqueToDoId: Persistence.generateUniqueToDoId,
  sortToDoList: Sorter.sortToDoList,
  filterToDoListByNextXDays: Filter.filterToDoListByNextXDays,
  filterToDoListByPriority: Filter.filterToDoListByPriority,
  filterToDoListByCategory: Filter.filterToDoListByCategory,
  getCategories: Categories.getCategories,
};

export default toDoListService;
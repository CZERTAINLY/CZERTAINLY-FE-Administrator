import { ReactElement } from "react";

interface Rows {
  id?: string;
  column: Column;
  data?: any;
}

export interface Column {
  [key: string]: ColumnContent;
}

interface ColumnContent {
  id?: string;
  content?: any;
  styledContent: any;
  lineBreak?: boolean;
}

interface Headers {
  content: any;
  sort?: boolean;
  id?: string;
  styledContent?: ReactElement<any, any>;
  width?: string;
}

const getMergedRowContent = (updatedHeaders: Headers[], row: Rows) => {
  return updatedHeaders
    .map((header) => {
      return row.column[header?.content]?.content?.toLowerCase() || "";
    })
    .join();
};

export function checkHandler(
  selectedRow: any,
  checkedRows: any,
  setCheckedRows: Function
) {
  let updated = [...checkedRows];

  if (updated.includes(selectedRow.uuid)) {
    const index = updated.indexOf(selectedRow.uuid);
    updated.splice(index, 1);
  } else {
    updated.push(selectedRow.uuid);
  }
  setCheckedRows(updated);
}

export function checkAllHandler(
  isSelectAll: boolean,
  data: any,
  searchText: string,
  entries: number,
  currentPage: number,
  setCheckedRows: Function,
  updatedHeaders?: Headers[]
) {
  if (!isSelectAll) {
    setCheckedRows([]);
    return;
  }
  let updated = [];
  let newData = [...data];
  for (let i of newData.splice(
    (currentPage - 1) * entries,
    currentPage * entries
  )) {
    if (
      searchText &&
      getMergedRowContent(updatedHeaders || [], i).includes(
        searchText.toLowerCase()
      )
    ) {
      updated.push(i.id);
    } else if (!searchText) {
      updated.push(i.id);
    }
  }
  setCheckedRows(updated);
}

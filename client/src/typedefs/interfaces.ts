export interface argumentsInterface {
  title: string;
  defaultSSId: string;
  defaultSId: number;
  sheet_name: string;
  startingDate: string;
  employee: string;
  employeeEmail: string;
  employeeNumber: string;
  manager: string;
  selectAll: boolean;
}

export interface responseInterface {
  spreadsheetUrl: string;
  stat: number[];
}

export type EmployeeType = {
  id: number;
  fullName: string;
  email: string;
  manager: string;
};

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
}

export interface responseInterface {
  spreadsheetUrl: string;
  stat: number[];
}
export interface employeesDataInterface {
  employees_id: number[];
  employees_full_names: string[];
  employees_emails: string[];
  employees_managers: string[];
}

import { getWeekDay } from "../helpers/dateGetter";

export const initialArgs = {
  title: "",
  defaultSSId: "1Znc2RBemy_rvsBZXv2EwDItin4e76Vp3nM3iWv_QqKw",
  defaultSId: 1805430215,
  //Default sheet name is chosen in functions chain if nothing is provided. Reason: input field has to be empty initially
  sheet_name: "",
  startingDate: getWeekDay(1),
  employee: "",
  employeeEmail: "",
  manager: "",
};

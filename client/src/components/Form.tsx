import {
  Box,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Typography,
  Link,
  Grid,
} from "@mui/material";
import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useStyles from "../style/materialOverwrite";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import {
  argumentsInterface,
  employeesDataInterface,
  responseInterface,
} from "../typedefs/interfaces";
import { initialArgs } from "../typedefs/initial";
import MenuItem from "@mui/material/MenuItem";

const Form = () => {
  const [args, setArgs] = useState<argumentsInterface>(initialArgs);

  const [responseOfChain, setResponseOfChain] = useState<responseInterface>();
  const [errors, setErrors] = useState(false);
  const [employeesData, setEmployeesData] = useState<employeesDataInterface>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const classes = useStyles();

  useEffect(() => {
    getEmployeesData();
  }, []);

  const getEmployeesData = async () => {
    setErrors(false);
    try {
      await fetch("http://localhost:9000/getemployees", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setEmployeesData(res.employeesRes);
        });
    } catch (error) {
      setErrors(true);
    }
  };
  const callApi = async () => {
    setErrors(false);
    setIsLoading(true);
    try {
      await fetch("http://localhost:9000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.stat.filter((code: number) => code !== 200).length > 0) {
            setErrors(true);
          }
          setResponseOfChain(res);
        });
      setArgs(initialArgs);
      setIsLoading(false);
    } catch (error) {
      setErrors(true);
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Grid
        container
        spacing={1}
        columns={{ xs: 4, sm: 6, md: 9, lg: 12 }}
        className={classes.root}
        sx={{
          marginX: "auto",
          justifyItems: "center",
        }}
      >
        <Grid item xs={4} sm={6} md={3} lg={3}>
          <FormControl>
            <InputLabel htmlFor="Title">Title</InputLabel>
            <Input
              value={args.title}
              onChange={(e) =>
                setArgs({
                  ...args,
                  title: e.target.value,
                })
              }
              id="Title"
              aria-describedby="title-helper"
            />
            <FormHelperText id="title-helper">
              Title of the new spreadsheet
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={6} md={3} lg={3}>
          <FormControl>
            <InputLabel htmlFor="Name">{`${
              args.title ? args.title + "'s sheet" : "Sheet"
            } name`}</InputLabel>
            <Input
              value={args.sheet_name}
              onChange={(e) =>
                setArgs({
                  ...args,
                  sheet_name: e.target.value,
                })
              }
              id="Name"
              aria-describedby="name-helper"
            />
            <FormHelperText id="name-helper">
              Name of the new spreadsheet's sheet
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={6} md={3} lg={3}>
          <FormControl>
            <InputLabel id="employee-select-label" htmlFor="Employee">
              Employee
            </InputLabel>
            <Select
              labelId="employee-select-label"
              id="employee-select"
              label="Employee name"
              value={args.employee}
              onChange={(e) => {
                setArgs({
                  ...args,
                  employee: e.target.value as string,
                });
              }}
            >
              <MenuItem value="">None</MenuItem>
              {employeesData?.employees_full_names?.map((full_name) => {
                return (
                  <MenuItem key={full_name} value={full_name}>
                    {full_name}
                  </MenuItem>
                );
              })}
            </Select>
            {/* <Input
              value={args.employee}
              onChange={(e) => {
                setArgs({
                  ...args,
                  employee: e.target.value,
                });
              }}
              id="Employee"
              aria-describedby="employee-helper"
            /> */}
            <FormHelperText id="employee-helper">Employee name</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={6} md={3} lg={3}>
          <FormControl>
            <InputLabel htmlFor="EmployeeEmail">Employee email</InputLabel>
            <Input
              value={args.employeeEmail}
              onChange={(e) => {
                setArgs({
                  ...args,
                  employeeEmail: e.target.value,
                });
              }}
              id="EmployeeEmail"
              aria-describedby="employeeemail-helper"
            />
            <FormHelperText id="employeeemail-helper">
              Employee email
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={6} md={3} lg={3}>
          <FormControl>
            <InputLabel htmlFor="EmployeeNumber">Employee number</InputLabel>
            <Input
              value={args.employeeNumber}
              onChange={(e) => {
                setArgs({
                  ...args,
                  employeeNumber: e.target.value,
                });
              }}
              id="EmployeeNumber"
              aria-describedby="employeenumber-helper"
            />
            <FormHelperText id="employeenumber-helper">
              Employee Number
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={6} md={3} lg={3}>
          <FormControl>
            <InputLabel htmlFor="Manager">Manager</InputLabel>
            <Input
              value={args.manager}
              onChange={(e) => {
                setArgs({
                  ...args,
                  manager: e.target.value,
                });
              }}
              id="Manager"
              aria-describedby="manager-helper"
            />
            <FormHelperText id="manager-helper">Manager name</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={6} md={3} lg={3}>
          <FormControl>
            <InputLabel htmlFor="Date">Starting date</InputLabel>
            <Input
              value={args.startingDate}
              type="date"
              onChange={(e) => {
                setArgs({
                  ...args,
                  startingDate: e.target.value,
                });
              }}
              id="Date"
              aria-describedby="date-helper"
            />
            <FormHelperText id="date-helper">
              Default date is the nearest Monday
            </FormHelperText>
          </FormControl>
        </Grid>
        <Box
          sx={{
            display: "flex",
            margin: "auto",
            marginTop: "1em",
          }}
        >
          <Button onClick={() => callApi()} color="success" variant="outlined">
            Create
          </Button>
        </Box>
        {isLoading && (
          <Box
            sx={{
              margin: "auto",
              marginTop: "1em",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {!isLoading && responseOfChain && (
          <Box
            sx={{
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "2em",
              backgroundColor: `${
                errors ? "#B22727" : "rgba(46, 125, 50, 0.5)"
              }`,
              paddingX: "1em",
            }}
          >
            <Typography variant={"overline"} color="white">
              {!errors
                ? `Created successfully. Status: ${responseOfChain?.stat}`
                : `Failed. Status: ${responseOfChain?.stat}`}
            </Typography>
            <Typography variant={"overline"} color="white">
              <Link
                sx={{
                  color: "rgb(37, 150, 190)",
                }}
                target="_blank"
                variant="body2"
                href={
                  responseOfChain?.spreadsheetUrl
                    ? responseOfChain?.spreadsheetUrl
                    : "#"
                }
              >
                Sheet URL
              </Link>
            </Typography>
          </Box>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default Form;

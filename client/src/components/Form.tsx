import {
  Box,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { CircularProgress } from "@material-ui/core";
import React, { useState } from "react";
import { getWeekDay } from "../helpers/dateGetter";
import useStyles from "../style/materialOverwrite";

const Form = () => {
  const initialArgs = {
    title: "",
    defaultSSId: "1Znc2RBemy_rvsBZXv2EwDItin4e76Vp3nM3iWv_QqKw",
    defaultSId: 1805430215,
    //Default sheet name is chosen in functions chain if nothing is provided. Reason: input field has to be empty initially
    sheet_name: "",
    startingDate: getWeekDay(1),
  };
  interface responseType {
    spreadsheetUrl: string;
    stat: number[];
  }
  const [args, setArgs] = useState(initialArgs);

  const [responseOfChain, setResponseOfChain] = useState<responseType>();
  const [errors, setErrors] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const classes = useStyles();

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
      <Box
        className={classes.root}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          width: "max-content",
          minWidth: "md",
          height: "100%",
          maxHeight: "lg",
          marginX: "auto",
        }}
      >
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
        <FormControl>
          <InputLabel htmlFor="Name">{`${
            args.title ? args.title + "'s sheet" : "Sheet"
          } name`}</InputLabel>
          <Input
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // FIXME: should choose the bigger value from 1em and auto, in css its max("auto", "1em")
            marginTop: "1em",
            // marginTop: "auto",
          }}
        >
          <Button onClick={() => callApi()} color="success" variant="outlined">
            Create
          </Button>
        </Box>
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
            backgroundColor: `${errors ? "#B22727" : "rgba(46, 125, 50, 0.5)"}`,
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
    </React.Fragment>
  );
};

export default Form;

import React from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";
import { shadows } from "@mui/system";

import { Button } from "@mui/material";
import useStyles from "./style/materialOverwrite";

const App = () => {
  const classes = useStyles();

  return (
    <div className="App">
      <Box
        sx={{
          width: "50%",
          height: "60vh",
          backgroundColor: "#232F34",
          margin: "auto",
          padding: "2em",
          borderRadius: "2em",
          color: "#FFFFFF",
          boxShadow: 2,
        }}
      >
        <FormControl className={classes.root}>
          <InputLabel htmlFor="Title">Title</InputLabel>
          <Input
            className={classes.root}
            id="Title"
            aria-describedby="title-helper"
          />
          <FormHelperText id="title-helper">
            Title of the new spreadsheet
          </FormHelperText>
        </FormControl>
      </Box>
    </div>
  );
};

export default App;

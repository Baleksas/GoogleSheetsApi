import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import { Container, shadows } from "@mui/system";

import { Button } from "@mui/material";
import useStyles from "./style/materialOverwrite";

const App = () => {
  const defaultSheetName: string = "";
  const [args, setArgs] = useState({
    title: "",
    defaultSSId: "1Znc2RBemy_rvsBZXv2EwDItin4e76Vp3nM3iWv_QqKw",
    defaultSId: 1805430215,
    sheet_name: defaultSheetName,
  });

  const [responseOfChain, setResponseOfChain] = useState<(string | number)[]>(
    []
  );

  const classes = useStyles();

  useEffect(() => {
    console.log("Response of chain changed: ", responseOfChain);
  }, [responseOfChain]);

  const callApi = () => {
    fetch("http://localhost:9000/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    })
      .then((res) => res.json())
      .then((res) => setResponseOfChain(res));
  };
  return (
    <div className="App">
      <Container
        sx={{
          height: "lg",
          maxHeight: "lg",
          backgroundColor: "#232F34",
          padding: "2em",
          borderRadius: "1em",
          boxShadow: 2,
          display: "flex",
          flexDirection: "column",
          width: "max-content",
          minWidth: "md",
          maxWidth: "lg",
        }}
      >
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
            <FormHelperText id="title-helper">
              Name of the new spreadsheet's sheet
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
            <Button
              onClick={() => callApi()}
              color="success"
              variant="outlined"
            >
              Create
            </Button>
          </Box>
        </Box>
        {responseOfChain && (
          <Typography
            sx={{
              margin: "auto",
              marginTop: "2em",
              backgroundColor: "rgba(46, 125, 50, 0.5)",
              paddingX: "1em",
            }}
            variant={"overline"}
            color="white"
          >
            {responseOfChain[responseOfChain.length - 1] === 200
              ? "Created successfully"
              : responseOfChain}
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default App;

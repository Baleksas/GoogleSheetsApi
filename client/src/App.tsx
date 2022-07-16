import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Link,
  Typography,
} from "@mui/material";
import { Container, shadows } from "@mui/system";

import { Button } from "@mui/material";
import useStyles from "./style/materialOverwrite";
import CircularProgress from "@mui/material/CircularProgress";

const App = () => {
  const defaultSheetName: string = "";
  const initialArgs = {
    title: "",
    defaultSSId: "1Znc2RBemy_rvsBZXv2EwDItin4e76Vp3nM3iWv_QqKw",
    defaultSId: 1805430215,
    sheet_name: defaultSheetName,
  };
  const [args, setArgs] = useState(initialArgs);

  const [responseOfChain, setResponseOfChain] = useState<(string | number)[]>();
  const [errors, setErrors] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>();
  const classes = useStyles();

  //FIXME: more efficient way for error checking

  const callApi = async () => {
    setIsLoading(true);
    await fetch("http://localhost:9000/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res[res.length - 1] !== 200) setErrors(true);
        setResponseOfChain(res);
      });
    setArgs(initialArgs);
    setIsLoading(false);
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
              error
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
              {/* Name of the new spreadsheet's sheet */}
              This feature is not supported at the moment
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
                ? "Created successfully "
                : responseOfChain[responseOfChain.length - 1]}
            </Typography>
            <Typography variant={"overline"} color="white">
              <Link
                sx={{
                  color: "rgb(37, 150, 190)",
                }}
                target="_blank"
                variant="body2"
                href={responseOfChain[0] ? responseOfChain[0].toString() : "#"}
              >
                Sheet URL
              </Link>
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default App;

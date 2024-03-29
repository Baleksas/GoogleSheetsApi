import React from "react";

import { Container } from "@mui/system";
import Form from "./components/Form";

const App = () => {
  return (
    <div className="App">
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          minHeight: "100vh",
          height: "max-content",
        }}
      >
        <Container
          sx={{
            backgroundColor: "#ADD1E1",
            padding: "2em",
            borderRadius: "1em",
            boxShadow: 2,
          }}
        >
          <Form />
        </Container>
      </Container>
    </div>
  );
};

export default App;

// TODO: Think about deployment option
// TODO: Research of the best option to send an email or form. in terms of access, might need to modify general access of a spreadsheet by setting it anyone with a link or choosing an organization (TDS) or specifying email

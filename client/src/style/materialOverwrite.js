import { makeStyles } from "@material-ui/styles";

export default makeStyles({
  root: {
    "& .MuiFormControl-root": {
      margin: "1em",
    },
    "& .css-1nrlq1o-MuiFormControl-root": {
      margin: "1em",
    },

    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.8)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgba(255,255,255,0.8)",
    },
    "& .MuiInput-root": {
      //input field to white (what user writes)
      color: "rgba(255,255,255,0.8)",
      // "&:hover": {
      //   borderBottom: "1px solid rgba(255,255,255,0.8)",
      // },
      "&:hover:not:before": {
        borderBottom: "1px solid rgba(255,255,255,0.8)",
      },

      "&:after": {
        borderBottom: "1px solid rgba(255,255,255,0.8)",
      },
    },
    "& .MuiInput-root:hover:not(.Mui-disabled):before": {
      borderBottom: "1px solid rgba(255,255,255,0.8)",
    },

    "& .MuiInput-underline": {
      borderBottom: "1px solid rgba(100,100,100,0.8)",
    },
    "& .MuiFormHelperText-root": {
      color: "rgba(255,255,255,0.8)",
    },
    "& .MuiSelect-select": {
      color: "rgba(255,255,255,0.8)",
    },
    "& .MuiSelect-nativeInput": {
      borderColor: "rgba(255,255,255,0.8)",
      color: "rgba(255,255,255,0.8)",
    },
    "& .MuiSelect-outlined": {
      borderColor: "rgba(255,255,255,0.8)",
      color: "rgba(255,255,255,0.8)",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "yellow",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgb(40, 190,230)",
      },
    },
  },
});

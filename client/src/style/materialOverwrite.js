import { makeStyles } from "@material-ui/styles";

export default makeStyles({
  root: {
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.8)", // or black
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgba(255,255,255,0.8)", // or black
    },
    "& .MuiInput-root": {
      //input field to white (what user writes)
      color: "rgba(255,255,255,0.8)", // or black
      // "&:hover": {
      //   borderBottom: "1px solid rgba(255,255,255,0.8)", // or black
      // },
      "&:hover:not:before": {
        borderBottom: "1px solid rgba(255,255,255,0.8)", // or black
      },

      "&:after": {
        borderBottom: "1px solid rgba(255,255,255,0.8)", // or black
      },
    },
    "& MuiInput-root:hover:not(.Mui-disabled):before": {
      borderBottom: "1px solid rgba(255,255,255,0.8)", // or black
    },

    "& .MuiInput-underline": {
      borderBottom: "1px solid rgba(255,255,255,0.8)", // or black
    },
    "& .MuiFormHelperText-root": {
      color: "rgba(255,255,255,0.8)", // or black
    },
  },
});

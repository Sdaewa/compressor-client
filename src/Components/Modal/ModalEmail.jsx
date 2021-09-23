import React, { useState } from "react";
import axios from "axios";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  CssBaseline,
} from "@material-ui/core";
import ProgressBar from "../UI/ProgressBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalEmail = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    console.log("value", value);
    setEmail(value);
  };

  const postEmail = () => {
    axios
      .post(
        "http://localhost:8000/convertToPdf",
        {
          data: {
            emailAddress: email,
          },
        },
        {
          onDownloadProgress: (ProgressEvent) => {
            setIsLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      // axios({
      //   method: "POST",
      //   url: "http://localhost:8000/sendByEmail",

      //   data: {
      //     emailAddress: email,
      //   },
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      .then((res) => {
        console.log("response");
        toast.success("Sending email successful");
        setTimeout(() => {
          setIsLoading(false);
        }, 6000);
      })
      .then((data) => {
        console.log(data);
        alert(data.message);
        setEmail("");
        setTimeout(() => {
          setIsLoading(false);
        }, 6000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Sending email failed");
        setIsLoading(false);
      });
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadIcon = <ProgressBar value={isLoaded} />;

  return (
    <>
      <CssBaseline />
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Enter email
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            Please enter an email address to send PDF to
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            onChange={onChange}
            id="email"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {isLoading === true ? (
            loadIcon
          ) : (
            <Button
              type="submit"
              onClick={() => {
                setIsLoading(true);
                postEmail();
              }}
              color="primary">
              Send
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEmail;

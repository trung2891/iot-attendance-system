import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import axios from 'axios';
import { Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  textField: {
    margin: theme.spacing(1),
    width: '25ch',
  },
  submitButton: {
    margin: theme.spacing(2),
  },
}));

export default function AddUser() {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    fullname: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    axios.post('https://iot-attendance-system-be.vercel.app/users', formData)
      .then((response) => {
        console.log(response.data);
        // Handle successful API response
        setShowSuccessModal(true);
      })
      .catch((error) => {
        console.log(error);
        // Handle API error
      });
    //   handleClose(); 
    // Show success modal dialog
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleFormSubmit}>
        <TextField
          className={classes.textField}
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleFormChange}
        />
        <TextField
          className={classes.textField}
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleFormChange}
        />
        <TextField
          className={classes.textField}
          label="Fullname"
          name="fullname"
          value={formData.fullname}
          onChange={handleFormChange}
        />
        <Button
          className={classes.submitButton}
          variant="contained"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      </form>
      <Dialog
        open={showSuccessModal}
        onClose={handleClose}
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <p>Your form has been successfully submitted!</p>
        </DialogContent>
        <DialogActions>
          <Link
          component={RouterLink}
          to={`/home`}
          >
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
};
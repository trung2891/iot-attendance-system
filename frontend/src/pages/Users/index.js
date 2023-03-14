import React, { useEffect, Fragment, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { FS } from "../../redux/other/constance";
import { selectAllUser, selectUserSlice, fetchUserData } from './../../redux/users/index';
import CloseIcon from "@material-ui/icons/Close";
import TableUserDetail from './component/TableUserDetail';
import axios from 'axios';
import TableUserCommon from './component/TableUserCommon';

const API_URL = "https://iot-attendance-system-be.vercel.app"
export default function UserPage() {
  // const dp = useDispatch();
  const [fetchingStatus, setFetchingStatus] = useState(FS.INITIAL);
  // console.log(fetchingStatus);
  // const rows = useSelector((state) => selectAllUser(state));
  // useEffect(() => {
  //   dp(fetchUserData(window.location.pathname.split("/")[3]));
  // }, []);

  // At the beginning, posts is an empty array
  const [rowsDetail, setRowsDetail] = useState([]);
  const [rowsCommon, setRowsCommon] = useState([]);

  // Define the function that fetches the data from API
  const fetchDataDetail = async () => {
    const { data } = await axios.get(`${API_URL}/attendances/user/${window.location.pathname.split("/")[3]}`);
    setRowsDetail(data);
    setFetchingStatus(FS.SUCCESS);
  };

  // Define the function that fetches the data from API
  const fetchDataCommon = async () => {
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let data = [];
    for(let i = 1; i<= Number(day); i++) {
      // console.log(`${API_URL}/attendances/user/${window.location.pathname.split("/")[3]}/${year}-${month}-${day}`);
      var date1 = `${i}/${month}/${year}`;
      let res = (await axios.get(`${API_URL}/attendances/user/${window.location.pathname.split("/")[3]}/date?date=${year}-${month}-${i}`)).data;
      // console.log(res[0], i);
      if (res.length <= 1) continue;
      var now1 = new Date(res[0].time);
      var time1 = now1.toLocaleTimeString();

      var now2 = new Date(res[res.length-1].time);
      var time2 = now2.toLocaleTimeString();
      var fullname = res[0].fullname;
      var resTime = `${time1} -> ${time2}` 
      
      data.push({"date": date1,"time": resTime,"fullname": fullname});
    }
    setRowsCommon(data);
    setFetchingStatus(FS.SUCCESS);
  };

  // Trigger the fetchDataDetail after the initial render by using the useEffect hook
  useEffect(() => {
    fetchDataDetail();
    fetchDataCommon();
  }, []);

  if (fetchingStatus === FS.INITIAL || fetchingStatus === FS.FETCHING) {
    return (
      <Box py={3} display="flex" justifyContent="center">
        <CircularProgress color="primary" size={30} />
      </Box>
    );
  }

  if (fetchingStatus === FS.FAIL) {
    return (
      <Box py={3} display="flex" flexDirection="column" alignItems="center">
        <CloseIcon color="error" />
        <Box py={1}></Box>
        <Typography color="error">Error when fetching data. Please try again!</Typography>
      </Box>
    );
  }

  return (
    <Fragment>
      <TableUserDetail rows = {rowsDetail} />

      <TableUserCommon rows = {rowsCommon} />
    </Fragment>
  );
}

import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { fetchAdminPageData, selectAllAttendancesSlice } from "../../redux/admin";
import { FS } from "../../redux/other/constance";
import CloseIcon from "@material-ui/icons/Close";
import TableSorterDetail from './component/TableSorterDetail';
import { selectAllAttendances } from "../../redux/admin";
import Search from './component/Search';
import TableSorterCommon from './component/TableSorterCommon';
import axios from 'axios';

const API_URL = "https://iot-attendance-system-be.vercel.app";
export default function HomePage() {
  const dp = useDispatch();
  const fetchingStatus = useSelector((state) => selectAllAttendancesSlice(state).fetchAllAttendancesStatus);
  const rows = useSelector((state) => selectAllAttendances(state));
  const [rowsCommon, setRowsCommon] = React.useState([]);

  // Define the function that fetches the data from API
  const fetchData = async () => {
    const { data } = await axios.get(`${API_URL}/attendances/month`);
    setRowsCommon(data);
  };

  // Trigger the fetchData after the initial render by using the useEffect hook
  React.useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    dp(fetchAdminPageData());
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
      <Search />
      <TableSorterDetail rows = {rows} />
      <TableSorterCommon rows = {rowsCommon} />
    </Fragment>
  );
}

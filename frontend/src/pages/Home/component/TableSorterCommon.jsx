import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import EnhancedTableHead from "./EnhancedTableHead";
import {
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  TableSortLabel,
  TablePagination,
  Paper,
  Toolbar,
  Typography,
  Link,
} from "@material-ui/core";
import { selectAllAttendances } from "../../../redux/admin";
import { Link as RouterLink, NavLink } from "react-router-dom";
import axios from "axios";
import { FS } from "../../../redux/other/constance";

function descendingComparator(a, b, orderBy) {
  if (typeof Number(a) === "number") {
    if (Number(b[orderBy]) < Number(a[orderBy])) {
      return -1;
    }
    if (Number(b[orderBy]) > Number(a[orderBy])) {
      return 1;
    }
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser
// compatibility, if you don't need to support IE11,
// you can use Array.prototype.sort() directly

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const columns = [
  { id: "id", label: "userId", minWidth: 170, align: "center" },
  {
    id: "fullName",
    label: "Họ và tên",
    minWidth: 170,
    align: "center",
  },
  {
    id: "userName",
    label: "userName",
    minWidth: 170,
    align: "center",
  },
  {
    id: "numDay",
    label: "Số ngày",
    minWidth: 170,
    align: "center",
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return <Toolbar></Toolbar>;
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function TableSorterCommon(props) {
  const { rows } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("STT");
  const [selected, setSelected] = React.useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const rows = useSelector((state) => selectAllAttendances(state));

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
          <EnhancedTableHead
            columns={columns}
            rows={rows}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell align="center">
                      <Typography>{row.id}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        <Link
                          component={RouterLink}
                          to={`/user/${row.id}`}
                          variant="body2"
                        >
                          {row.fullname}
                        </Link>
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{row.username}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{row.numDay}</Typography>
                    </TableCell>
                    {/* {columns.map((column) => {
                      console.log(row)
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })} */}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

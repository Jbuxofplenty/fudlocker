import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 4,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

export default class FrequentUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      org: null,
      purchasedNotCompleted: null,
      uid: null,
      total: null,
    };
  }

  render() {
    if (this.props.usersData) {
      return (
        <div>
          <Paper className={styles.root}>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell align="center">Customer</CustomTableCell>
                  <CustomTableCell align="center">Headshot</CustomTableCell>
                  <CustomTableCell align="center">Orders</CustomTableCell>
                  <CustomTableCell align="center">Last Order</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {this.props.usersData.map((row, index) => (
                  <TableRow className="meal-row-item" key={index}>
                    <CustomTableCell component="th" scope="row">
                      {row.name}
                    </CustomTableCell>
                    <CustomTableCell align="center"><img src={row.headshot} className="headshot" alt="" /></CustomTableCell>
                    <CustomTableCell align="center">{row.orders}</CustomTableCell>
                    <CustomTableCell align="center">{row.lastPurchased}</CustomTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <div className="check-container">
            <a href="http://fudlkr.com" className="check-text">Check all the users</a>
          </div>
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}


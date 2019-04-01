import React from 'react';
import PropTypes from 'prop-types';
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

function MealTable(props) {
  const { classes, inventory, locations, history } = props;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>ID #</CustomTableCell>
            <CustomTableCell align="center">Image</CustomTableCell>
            <CustomTableCell align="center">Meal Name</CustomTableCell>
            <CustomTableCell align="center">Location</CustomTableCell>
            <CustomTableCell align="center">Net Weight (oz)</CustomTableCell>
            <CustomTableCell align="center">Shelf Life (days)</CustomTableCell>
            <CustomTableCell align="center">Cost ($)</CustomTableCell>
            <CustomTableCell align="center">Category</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map(row => (
            <TableRow className="meal-row-item" onClick={() => { history.push({ pathname: '/addmeal', state: { meal: row } }) }} key={row.idTemplate}>
              <CustomTableCell component="th" scope="row">
                {row.idTemplate}
              </CustomTableCell>
              <CustomTableCell align="center"><img src={row.strTemplateThumb} className="headshot" alt="" /></CustomTableCell>
              <CustomTableCell align="center">{row.strTemplate}</CustomTableCell>
              <CustomTableCell align="center">{locations[row.location].title}</CustomTableCell>
              <CustomTableCell align="center">{row.netWeight}</CustomTableCell>
              <CustomTableCell align="center">{row.shelfLife}</CustomTableCell>
              <CustomTableCell align="center">{row.strCost}</CustomTableCell>
              <CustomTableCell align="center">{row.strCategory}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

MealTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MealTable);

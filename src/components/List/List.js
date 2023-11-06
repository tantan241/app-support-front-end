import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Snackbar,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridPagination, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { fetchData } from "../../common";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { Add, Margin } from "@mui/icons-material";
import classNames from "classnames/bind";
import styles from "./List.module.scss";
const cx = classNames.bind(styles);
function CustomFooter(props) {
  const { count, page, handleChangePage, rowsPerPage, handleChangeRowsPerPage, rowsPerPageOptions } = props;
  return (
    <TablePagination
      className={cx("bottom-list")}
      component="div"
      labelRowsPerPage="Số dòng hiện thị"
      count={count}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );
}
function List(props) {
  const {
    disableCheckbox,
    url,
    model,
    actions,
    customAction,
    customEdit,
    cellCustom,
    mapFunction,
    disableAdd,
    rowsPerPageOptions,
    filter,
    addAction,
    // reload = () => {},
  } = props;
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [reload, setReload] = useState(0);
  const [rowsSelect, setRowsSelect] = useState([]);
  const [clickDeleteMultiple, setClickDeleteMultiple] = useState();
  const [oneRowDelete, setOneRowDelete] = useState();
  const [openDialogDelete, setOpenDialogDelete] = useState();
  const [alert, setAlert] = useState({ open: false, variant: "success", messenger: "" });
  const handleCloseDialogDelete = useCallback(() => {
    setOpenDialogDelete(false);
  }, []);
  const handleCloseAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
  });
  const deleteRows = useCallback((data) => {
    let ids = [];
    if (Array.isArray(data)) {
      data.forEach((item) => {
        ids.push(item.id);
      });
    } else {
      ids.push(data.id);
    }

    ids = JSON.stringify(ids);
    fetchData(`${url}list?ids=${ids}`, "DELETE", {}).then((res) => {
      setAlert({ open: true, variant: res.status === 1 ? "success" : "error", messenger: res.messenger });
      if (res.status === 1) {
        setReload(new Date() * 1);
        setOpenDialogDelete(false);
      }
    });
  }, []);
  useEffect(() => {
    const body = {
      limit: rowsPerPage,
      page: page,
      filter: filter,
    };

    fetchData(`${url}list`, "POST", body).then((res) => {
      if (res.status === 1) {
        // setPageInfo(res.pageInfo);
        // setDataSearch(res.dataSearch);
        // setDataFilter(res.dataFilter);
        let columns = res.data.columns;

        columns.push({
          field: "action",
          headerName: "Hành  động",
          description: "Hành động",
          sortable: false,
          flex: 0.9,
          filterable: false,
          renderCell: actions
            ? actions
            : (params) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>{params.value}</div>
                  {customAction ? (
                    customAction(params)
                  ) : (
                    <div style={{ marginLeft: "auto", display: "flex" }}>
                      {addAction ? addAction(params.row) : ""}
                      {customEdit ? (
                        customEdit(params)
                      ) : (
                        <Fab size="small" color="primary">
                          <IconButton aria-label="edit" onClick={() => navigate(`${params.row.id}`)}>
                            <EditIcon style={{ color: "white" }} />
                          </IconButton>
                        </Fab>
                      )}

                      <div style={{ margin: "0 4px" }}></div>
                      <Fab size="small" color="error">
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            setClickDeleteMultiple(false);
                            setOneRowDelete(params.row);
                            setOpenDialogDelete(true);
                          }}
                        >
                          <DeleteIcon style={{ color: "white" }} />
                        </IconButton>
                      </Fab>
                    </div>
                  )}
                </div>
              ),
        });
        if (cellCustom) {
          if (cellCustom.field && cellCustom.data) {
            columns = columns.map((item) =>
              item.field === cellCustom.field ? { ...item, renderCell: cellCustom.data } : item
            );
          }
        }
        setColumns(columns);
        let rowsList = res.data.rows;
        if (mapFunction && typeof mapFunction === "function") {
          rowsList = mapFunction(rowsList);
        }
        setRows(rowsList);
      }
    });
  }, [url, mapFunction, model, reload, page, rowsPerPage, filter]);
  const handleSelectionModelChange = useCallback(
    (newSelectionModel) => {
      const selectedRows = rows.filter((row) => newSelectionModel.includes(row.id));

      setRowsSelect(selectedRows);
    },
    [rows]
  );
  return (
    <div>
      <div
        style={{
          textAlign: "right",
          margin: "20px 20px 5px",
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "space-between",
        }}
      >
        {rowsSelect.length > 0 && (
          <Fab
            color="error"
            size="small"
            style={{ marginRight: "10px" }}
            onClick={() => {
              setClickDeleteMultiple(true);
              setOpenDialogDelete(true);
            }}
          >
            <Tooltip title="Xóa">
              <DeleteIcon></DeleteIcon>
            </Tooltip>
          </Fab>
        )}
        {disableAdd ? (
          ""
        ) : (
          <Link to={`${window.location.pathname}/add`}>
            <Fab color="primary" size="small">
              <Tooltip title="Thêm mới">
                <Add></Add>
              </Tooltip>
            </Fab>
          </Link>
        )}
      </div>

      <DataGrid
        className={cx("list")}
        column={{ xs: 12, md: 6 }}
        autoHeight={true}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        checkboxSelection={disableCheckbox ? false : true}
        onRowSelectionModelChange={handleSelectionModelChange}
        hideFooterPagination
        disableColumnMenu
        components={{
          Footer: () => (
            <CustomFooter
              count={10}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangeRowsPerPage={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              handleChangePage={(e, newPage) => setPage(newPage)}
              rowsPerPageOptions={rowsPerPageOptions}
            ></CustomFooter>
          ),
        }}
      />

      <Dialog open={openDialogDelete} onClose={handleCloseDialogDelete}>
        <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (clickDeleteMultiple) {
                deleteRows(rowsSelect);
              } else {
                deleteRows(oneRowDelete);
              }
            }}
          >
            Xóa
          </Button>
          <Button variant="outlined" autoFocus onClick={handleCloseDialogDelete}>
            Quay lại
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.variant} sx={{ width: "100%" }}>
          {alert.messenger}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default List;

import { Alert, Button, Grid, MenuItem, Snackbar, TextField, Typography } from "@mui/material";
import AppBar from "../../componentCore/AppBar";
import classNames from "classnames/bind";
import styles from "./CodeUpdateEdit.module.scss";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useRef, useState } from "react";
import ComboBox from "../../componentCore/ComboBox/ComboBox";
import { fetchData, handleClickCopy, showSnackbar } from "../../common";
import { API_ADD_DATA_CODE_UPDATE, API_GET_DATA_ROW_CODE_UPDATE } from "../../api/codeUpdateApi";
import { GET_CATEGORY } from "../../api/categoriesApi";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const cx = classNames.bind(styles);
function CodeUpdateEdit(props) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, variant: "success", messenger: "" });
  const [valueTextField, setValuesTextField] = useState({ cartType: [], methods: [], entityType: [] });
  const [pathName, setPathName] = useState("");
  const [title, setTitle] = useState("Thêm mới");
  const [values, setValues] = useState({
    code: "",
    cartType: "",
    entityType: "",
    method: "",
    field: "",
    description: "",
    keywords: "",
    type: 0,
  });
  useEffect(() => {
    const entityType = fetchData(`${GET_CATEGORY}?id=2`);
    const methods = fetchData(`${GET_CATEGORY}?id=3`);
    Promise.all([entityType, methods]).then((res) =>
      setValuesTextField({ entityType: res[0].data, methods: res[1].data })
    );
    const pathFull = window.location.pathname;
    let pathFullSplit = [];
    let id = "";
    if (pathFull) {
      pathFullSplit = pathFull.split("/");
    }
    if (pathFullSplit.length > 1) {
      setPathName(pathFullSplit[1]);
      id = pathFullSplit.pop();
    }
    if (id !== "" && id !== "add") {
      setTitle("Chỉnh sửa");
      fetchData(API_GET_DATA_ROW_CODE_UPDATE, "POST", { id: id }).then((res) => {
        if (res.status === 1) {
          setValues({ ...res.data, entityType: res.data.entity_type, cartType: res.data.cart_type });
        }
      });
    }
  }, []);
  const handleSave = useCallback(() => {
    fetchData(API_ADD_DATA_CODE_UPDATE, "POST", {
      id: values?.id ? values.id : 0,
      code: values.code,
      cart_type: values.cartType,
      entity_type: values.entityType,
      method: values.method,
      field: values.field,
      description: values.description,
      keywords: values.keywords,
      type: values.type
    }).then((res) => {
      if (res.status === 1) {
        showSnackbar("success", values?.id ? "Cập nhập thành công" : "Thêm mới thành công", enqueueSnackbar);
        navigate(`/${pathName}`);
      }
    });
  }, [values]);
  const handleInputChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
  });
  return (
    <div className={cx("wrapper")} container>
      <AppBar
        text={title}
        moreButton={
          <>
            <Button variant="contained" color="primary" onClick={() => handleSave()}>
              Lưu
            </Button>
            <Button
              style={{ margin: "0 10px" }}
              variant="contained"
              color="error"
              onClick={() => {
                navigate(`/${pathName}`);
              }}
            >
              Quay lại
            </Button>
          </>
        }
      ></AppBar>

      <Grid container spacing={4} style={{ padding: "20px" }}>
        <Grid item xs={12}>
          <Typography variant="h6">CODE</Typography>
          <div style={{ position: "relative", width: "100%", border: "1px solid #000", paddingTop: "20px" }}>
            <CodeMirror
              value={values.code}
              height="400px"
              maxWidth="180vh"
              extensions={[python()]}
              onChange={(e) => setValues((prev) => ({ ...prev, code: e }))}
            />
            <div className={cx("button-copy")}>
              <Button size="small" variant="contained" onClick={() => handleClickCopy(values.code)}>
                Code <ContentCopyIcon></ContentCopyIcon>
              </Button>
            </div>

            {/* <button className={cx("button-copy")} onClick={() => handleClickCopy()}>
              Copy
            </button> */}
          </div>
        </Grid>
        <Grid item xs={3}>
          <ComboBox
            url={`${GET_CATEGORY}?id=1`}
            valueProps={values.cartType}
            onChange={(value) => setValues((prev) => ({ ...prev, cartType: value }))}
            label="Cart type"
            
          ></ComboBox>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            select
            label="Entity Type"
            value={values.entityType}
            required
            onChange={(e) => handleInputChange("entityType", e.target.value)}
          >
            {valueTextField.entityType.length > 0 &&
              valueTextField.entityType.map((item) => <MenuItem value={item.value}>{item.name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            value={values.method}
            fullWidth
            select
            label="Phương thức"
            onChange={(e) => handleInputChange("method", e.target.value)}
          >
            {valueTextField.methods.length > 0 &&
              valueTextField.methods.map((item) => <MenuItem value={item.value}>{item.name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Field"
            onChange={(e) => handleInputChange("field", e.target.value)}
            value={values.field}
          ></TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Keywords"
            onChange={(e) => handleInputChange("keywords", e.target.value)}
            value={values.keywords}
          ></TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Type"
            select
            onChange={(e) => handleInputChange("type", e.target.value)}
            value={values.type}
          >
            <MenuItem value={0}>Code update</MenuItem>
            <MenuItem value={1}>Hàm bình thường</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6} onChange={(e) => handleInputChange("description", e.target.value)} value={values.description}>
          <TextField fullWidth label="Mô tả" value={values.description} multiline rows={4}></TextField>
        </Grid>
      </Grid>
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

export default CodeUpdateEdit;

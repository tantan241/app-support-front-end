import { Fab, Grid, MenuItem, TextField, Typography } from "@mui/material";
import AppBar from "../../componentCore/AppBar";
import List from "../../components/List";
import ComboBox from "../../componentCore/ComboBox";
import { GET_CATEGORY } from "../../api/categoriesApi";
import classNames from "classnames/bind";
import styles from "./Migration.module.scss";
import { useCallback, useEffect, useState } from "react";
import { MIGRATION } from "../../api/rootApi";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { fetchData, showSnackbar } from "../../common";
import { enqueueSnackbar } from "notistack";
import { GET_LIST_USER } from "../../api/userApi";
const cx = classNames.bind(styles);
function Migration() {
  const [values, setValues] = useState({
    sourceCart: "",
    targetCart: "",
    keywords: "",
    user: "all",
  });
  useEffect(() => {
    fetchData(`${GET_LIST_USER}`).then((res) => {
      if (res.status === 1) {
        setListUser(res.data);
      }
    });
  }, []);
  const [listUser, setListUser] = useState([]);
  const handleClickCopy = useCallback(
    (data) => {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(data)
          .then(function () {
            showSnackbar("success", "Copy thành công", enqueueSnackbar);
          })
          .catch(function (err) {
            console.error("Lỗi khi sao chép dữ liệu vào clipboard:", err);
          });
      } else {
        console.warn("Trình duyệt không hỗ trợ Clipboard API");
      }
    },
    [values.code]
  );
  return (
    <div className={cx("wrapper")}>
      <AppBar text="Migration"></AppBar>
      <div className={cx("content")}>
        <Typography variant="h5" marginBottom={"5px"}>
          Bộ lọc
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <ComboBox
              url={`${GET_CATEGORY}?id=1`}
              valueProps={values.sourceCart}
              onChange={(value) => setValues((prev) => ({ ...prev, sourceCart: value }))}
              label="Source Cart"
            ></ComboBox>
          </Grid>
          <Grid item xs={3}>
            <ComboBox
              url={`${GET_CATEGORY}?id=1`}
              valueProps={values.targetCart}
              onChange={(value) => setValues((prev) => ({ ...prev, targetCart: value }))}
              label="Target Cart"
            ></ComboBox>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Keywords"
              onChange={(e) => setValues((prev) => ({ ...prev, keywords: e.target.value }))}
              value={values.keywords}
            ></TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              select
              label="User"
              value={values.user}
              onChange={(e) => setValues((prev) => ({ ...prev, user: e.target.value }))}
            >
              {listUser.length > 0 && listUser.map((item) => <MenuItem value={item}>{item}</MenuItem>)}
              <MenuItem value={"all"}>ALL</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </div>
      <List
        url={MIGRATION}
        model={"migration"}
        rowsPerPageOptions={[3, 10, 100]}
        filter={values}
        // mapFunction={mapFunction}
        addAction={(data) => (
          <div style={{ margin: "0 8px" }}>
            <Fab size="small" title="Copy" onClick={() => handleClickCopy(data.migration)}>
              <ContentCopyIcon color="primary"></ContentCopyIcon>
            </Fab>
          </div>
        )}
      ></List>
    </div>
  );
}

export default Migration;

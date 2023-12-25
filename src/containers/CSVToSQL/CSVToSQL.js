import { Button, Grid, TextField } from "@mui/material";
import AppBar from "../../componentCore/AppBar/AppBar";
import { useCallback, useEffect, useState } from "react";
import { UPLOAD_FILE } from "../../api/filesApi";
import { TOKEN } from "../../constants";
import { URL } from "../../api/rootApi";
import { fetchData, showSnackbar } from "../../common";
import classNames from "classnames/bind";
import styles from "./CSVToSQL.module.scss";
import RefreshIcon from "@mui/icons-material/Refresh";
const cx = classNames.bind(styles);
function CSVToSQL() {
  const [values, setValues] = useState({
    file: "",
    fileName: "",
    filePath: "",
  });
  const [refresh, setRefresh] = useState(0);
  const [listFile, setListFile] = useState([]);
  const [resultLocal, setResultLocal] = useState({});
  useEffect(() => {
    fetchData(`${UPLOAD_FILE}?type=getListFileCsv`, "POST", {}).then((res) => {
      if (res.status === 1) {
        setListFile(res.data);
        res.data.map((item, index) => setResultLocal((prev) => ({ ...prev, [index]: { fileName: "", filePath: "" } })));
      }
    });
  }, [refresh]);

  const handleConvert = useCallback(() => {
    const token = JSON.parse(localStorage.getItem(TOKEN));
    let formData = new FormData();
    formData.append("file", values.file);
    fetch(`${UPLOAD_FILE}?type=convertcsv`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        // showSnackbar();
        showSnackbar(res.status === 1 ? "success" : "error", res.messenger);
        if (res.status === 1) {
          setValues({ ...values, fileName: res.fileName, filePath: res.filePath });
          // showSnackbar("success", res.messenger)
        }
      });
  }, [values.file]);
  const handleDownload = useCallback(
    (fileName, filePath) => {
      const url = URL + filePath;
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const a = document.createElement("a");
          a.href = window.URL.createObjectURL(blob);
          a.download = fileName;
          document.body.appendChild(a);
          a.style.display = "none";
          a.click();
          document.body.removeChild(a);
        })
        .catch((error) => {
          console.error("Lỗi tải tệp:", error);
        });
    },
    [values]
  );
  const handleConvertSQLLocal = useCallback(
    (fileName, key) => {
      const data = { fileName };
      fetchData(`${UPLOAD_FILE}?type=convertcsvLocal`, "POST", data).then((res) => {
        showSnackbar(res.status === 1 ? "success" : "error", res.messenger);
        if (res.status === 1) {
          setResultLocal((prev) => ({ ...prev, [key]: { fileName: res.fileName, filePath: res.filePath } }));
        }
      });
    },
    [resultLocal]
  );
  return (
    <div>
      <AppBar text="Chuyển CSV thành SQl"></AppBar>
      <Grid container spacing={8} style={{ padding: "40px 20px 40px 20px" }}>
        <Grid item xs={3}>
          <TextField
            fullWidth
            type="file"
            label="Chọn file"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setValues({ ...values, file: e.target.files[0] })}
          ></TextField>
        </Grid>

        <Grid item xs={3}>
          <Button variant="outlined" onClick={() => handleConvert()}>
            Convert
          </Button>
        </Grid>
        {values.fileName ? (
          <>
            {" "}
            <Grid item xs={3}>
              <TextField disabled fullWidth InputLabelProps={{ shrink: true }} value={values.fileName}></TextField>
            </Grid>
            <Grid item xs={3}>
              <Button variant="outlined" onClick={() => handleDownload(values.fileName, values.filePath)}>
                Tải xuống
              </Button>
            </Grid>
          </>
        ) : (
          ""
        )}
      </Grid>

      <Grid container className={cx("csv2sql-local")}>
        {listFile.map((item, index) => (
          <Grid item xs={12} className={cx("csv2sql-local-item")}>
            <Grid container spacing={4} className={cx("item-content")}>
              <Grid item xs={3}>
                <TextField disabled fullWidth InputLabelProps={{ shrink: true }} value={item.path}></TextField>
              </Grid>
              <Grid item xs={1}>
                <div style={{textAlign: "center"}}> {item.size} KB</div>
              </Grid>
              <Grid item xs={2}>
                <Button variant="outlined" onClick={() => handleConvertSQLLocal(item.path, index)}>
                  Convert
                </Button>
              </Grid>
              {resultLocal[index].fileName ? (
                <>
                  {" "}
                  <Grid item xs={3}>
                    <TextField
                      disabled
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={resultLocal[index].fileName}
                    ></TextField>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="outlined"
                      onClick={() => handleDownload(resultLocal[index].fileName, resultLocal[index].filePath)}
                    >
                      Tải xuống
                    </Button>
                  </Grid>
                </>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        ))}
        <div className={cx("label-csv2sql-local")}>Convert SQL Local</div>
        <div className={cx("icon-refresh")}>
          <Button variant="contained" onClick={() => setRefresh(new Date() * 1)}>
            <RefreshIcon></RefreshIcon>
          </Button>
        </div>
      </Grid>
    </div>
  );
}

export default CSVToSQL;

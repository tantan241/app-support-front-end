import { Button, Grid, MenuItem, TextField } from "@mui/material";
import AppBar from "../../componentCore/AppBar/AppBar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import classNames from "classnames/bind";
import styles from "./ArrayString.module.scss";
import { useCallback, useState } from "react";

const cx = classNames.bind(styles);

function ArrayString() {
  const fakeData = [
    // {
    //   name: "Un Serializer",
    //   value: "unSerializer",
    // },
    {
      name: "Array String",
      value: "arrString",
    },
  ];
  const [values, setValues] = useState({
    type: "arrString",
    source: "",
    target: "",
  });
  const [reload, setReload] = useState(0);
  
  const arrayString = useCallback((data) => {
    const dataSplit = data.split(",")
    setValues({...values,target: JSON.stringify(dataSplit)})
  }, []);
  const handleChange = useCallback(() => {
    switch (values.type) {
      case "arrString":
        arrayString(values.source);
      default :
        console.log("aaaaaaa");
    }
  }, [values]);
  return (
    <div>
      <AppBar text="Biến đổi các phần tử trong mảng thành string"></AppBar>
      <Grid container spacing={4} style={{ padding: "10px" }}>
        <Grid item xs={5}>
          <TextField
            fullWidth
            label={"Đầu vào"}
            multiline
            rows={20}
            value={values.source}
            onChange={(e) => setValues({ ...values, source: e.target.value })}
          ></TextField>
        </Grid>
        <Grid item xs={2} className={cx("arrow")}>
          <div className={cx("arrow-content")}>
            <TextField
              select
              label="Kiểu"
              fullWidth
              value={values.type}
              onChange={(e) => setValues({ ...values, type: e.target.value })}
            >
              {fakeData.map((item) => (
                <MenuItem value={item.value}>{item.name}</MenuItem>
              ))}
            </TextField>
            <div style={{ margin: "20px 0" }}></div>
            {/* <ArrowForwardIcon></ArrowForwardIcon> */}
            <Button variant="contained" onClick={() => handleChange()}>
              Biến đổi
            </Button>
          </div>
        </Grid>
        <Grid item xs={5} className={cx('result')}>
          <TextField fullWidth label={"Kết quả"} multiline rows={20} value={values.target}></TextField>
        </Grid>
      </Grid>
    </div>
  );
}

export default ArrayString;

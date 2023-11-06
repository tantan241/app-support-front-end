import classNames from "classnames/bind";
import styles from "./CodeUpdate.module.scss";
import AppBar from "../../componentCore/AppBar/AppBar";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ComboBox from "../../componentCore/ComboBox";
import List from "../../components/List";
import { CODE_UPDATE } from "../../api/rootApi";
import { useCallback, useEffect, useState } from "react";
import { GET_CATEGORY } from "../../api/categoriesApi";
import { fetchData } from "../../common";
import { GET_LIST_USER } from "../../api/userApi";
const cx = classNames.bind(styles);

function CodeUpdate() {
  const [reload, setReload] = useState(1);
  const [values, setValues] = useState({
    cartType: "",
    entityType: "",
    method: "",
    field: "",
    keywords: "",
    type: "",
    user:"all"
  });
  const [valueTextField, setValuesTextField] = useState({ cartType: [], methods: [], entityType: [] ,listUser: []});
  useEffect(() => {
    const cartType = fetchData(`${GET_CATEGORY}?id=1`);
    const entityType = fetchData(`${GET_CATEGORY}?id=2`);
    const methods = fetchData(`${GET_CATEGORY}?id=3`);
    const listUser = fetchData(`${GET_LIST_USER}`)
    Promise.all([cartType, entityType, methods,listUser]).then((res) => {
      setValuesTextField({ cartType: res[0].data, entityType: res[1].data, methods: res[2].data  ,listUser: res[3].data });
    });
  }, []);

  const handleInputChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const mapFunction = useCallback(
    (data) => {
      const cartType = valueTextField.cartType;
      const entityType = valueTextField.entityType;
      return data.map((item) => ({
        ...item,
        method: item.method.toUpperCase(),
        entity_type: entityType.find((it) => it.value === item.entity_type)
          ? entityType.find((it) => it.value === item.entity_type).name
          : item.entity_type,
        cart_type: cartType.find((it) => it.code === item.cart_type)
          ? cartType.find((it) => it.code === item.cart_type).label
          : item.cart_type,
      }));
    },
    [valueTextField.cartType]
  );
  return (
    <div className={cx("wrapper")}>
      <AppBar text="Thêm mới"></AppBar>

      <div className={cx("content")}>
        <Typography variant="h5" marginBottom={"5px"}>
          Bộ lọc
        </Typography>

        <Grid container spacing={2}>
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
              select
              label="Entity Type"
              value={values.entityType}
              onChange={(e) => handleInputChange("entityType", e.target.value)}
            >
              {valueTextField.entityType.length > 0 &&
                valueTextField.entityType.map((item) => <MenuItem value={item.value}>{item.name}</MenuItem>)}
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
          <Grid item xs={3}>
            <TextField
              fullWidth
              select
              label="User"
              value={values.user}
              onChange={(e) => handleInputChange("user", e.target.value)}
            >
              {valueTextField.listUser.length > 0 &&
                valueTextField.listUser.map((item) => <MenuItem value={item}>{item}</MenuItem>)}
                <MenuItem value={"all"}>ALL</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </div>
      <List
        url={CODE_UPDATE}
        model={"code-update"}
        rowsPerPageOptions={[10, 50, 100]}
        filter={values}
        mapFunction={mapFunction}
      ></List>
    </div>
  );
}

export default CodeUpdate;

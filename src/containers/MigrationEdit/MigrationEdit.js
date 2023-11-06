import { Button, Grid, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../componentCore/AppBar";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ComboBox from "../../componentCore/ComboBox";
import { GET_CATEGORY } from "../../api/categoriesApi";
import { fetchData, showSnackbar } from "../../common";
import { API_ADD_DATA_MIG, API_GET_DATA_ROW_MIGRATION } from "../../api/migrationApi";

import { enqueueSnackbar } from "notistack";
function MigrationEdit() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Thêm mới");
  const [pathName, setPathName] = useState("");
  const [values, setValues] = useState({
    sourceCart: "",
    targetCart: "",
    keywords: "",
    description: "",
    migration: "",
  });
  useEffect(() => {
    // const entityType = fetchData(`${GET_CATEGORY}?id=2`);
    // const methods = fetchData(`${GET_CATEGORY}?id=3`);
    // Promise.all([entityType, methods]).then((res) =>
    //   setValuesTextField({ entityType: res[0].data, methods: res[1].data })
    // );
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
      fetchData(API_GET_DATA_ROW_MIGRATION, "POST", { id: id }).then((res) => {
        if (res.status === 1) {
          setValues({ ...res.data, sourceCart: res.data.source_cart, targetCart: res.data.target_cart });
        }
      });
    }
  }, []);
  const handleSave = useCallback(() => {
    fetchData(API_ADD_DATA_MIG, "POST", {
      id: values?.id ? values.id : 0,
      migration: values.migration,
      source_cart: values.sourceCart,
      target_cart: values.targetCart,
      description: values.description,
      keywords: values.keywords
    }).then((res) => {
      if (res.status === 1) {
        showSnackbar("success", values?.id ? "Cập nhập thành công" : "Thêm mới thành công", enqueueSnackbar);
        navigate(`/${pathName}`);
      }
    });
  }, [values]);

  return (
    <div>
      {" "}
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
            label="Migration"
            onChange={(e) => setValues((prev) => ({ ...prev, migration: e.target.value }))}
            value={values.migration}
          ></TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Keywords"
            onChange={(e) => setValues((prev) => ({ ...prev, keywords: e.target.value }))}
            value={values.keywords}
          ></TextField>
        </Grid>
        <Grid item xs={6}>
          <CKEditor
            editor={ClassicEditor}
            data={values.description}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setValues((prev) => ({ ...prev, description: data }));
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default MigrationEdit;

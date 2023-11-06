import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import AppBar from "../../componentCore/AppBar";
import classNames from "classnames/bind";
import styles from "./GetInfoCart.module.scss";
import ComboBox from "../../componentCore/ComboBox";
import { ADD_INFO_CART, GET_CATEGORY, GET_INFO_CART } from "../../api/categoriesApi";
import { useCallback, useEffect, useState } from "react";
import { fetchData, handleClickCopy, showSnackbar } from "../../common";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { enqueueSnackbar } from "notistack";
const cx = classNames.bind(styles);
function GetInfoCart() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [listCart, setListCart] = useState([]);
  const [valueDialog, setValueDialog] = useState({ id: "", code: "", content: "" });
  useEffect(() => {
    fetchData(`${GET_CATEGORY}?id=1`).then((res) => {
      if (res.status === 1) {
        setListCart(res.data);
      }
    });
  }, []);
  const handleComboBoxChange = useCallback(
    (value) => {
      const cart = listCart.find((item) => item.label === value)
        ? listCart.find((item) => item.label === value).code
        : "";
      fetchData(`${GET_INFO_CART}?id=${cart}`).then((res) => {
        if (res.status === 1) {
          const cart = listCart.find((item) => item.code === res.data.code)
            ? listCart.find((item) => item.code === res.data.code).label
            : "";
          setValueDialog({ ...res.data, code: cart });
        }
      });
    },
    [listCart]
  );
  const handleSave = useCallback(() => {
    const cart = listCart.find((item) => item.label === valueDialog.code)
      ? listCart.find((item) => item.label === valueDialog.code).code
      : "";
    fetchData(ADD_INFO_CART, "post", { ...valueDialog, code: cart }).then((res) => {
      if (res.status === 1) {
        showSnackbar("success", res.messenger, enqueueSnackbar);
      }
    });
  }, [valueDialog]);

  return (
    <div className={cx("wrapper")}>
      <AppBar
        moreButton={
          <Button style={{ marginRight: "30px" }} variant="contained" onClick={() => setOpen(true)}>
            Thêm mới
          </Button>
        }
        text="Các câu để xin thông tin cart"
      ></AppBar>
      <div className={cx("content")}>
        <div className={cx("group-button")}>
          <ComboBox
            style={{ flex: 0.5 }}
            url={`${GET_CATEGORY}?id=1`}
            label="Cart"
            valueProps={value}
            onChange={(value) => {
              setValue(value);
              handleComboBoxChange(value);
            }}
          ></ComboBox>
          {/* <Button style={{ flex: 0.1, margin: "0 20px" }} variant="contained" onClick={() => handleClickCopy(valueDialog.content)}>
            Copy
          </Button> */}
          <Button
            style={{ flex: 0.1, margin: "0 20px" }}
            variant="contained"
            onClick={() => setOpen(true)}
            disabled={!value}
          >
            Chỉnh sửa
          </Button>
          <div style={{ flex: 1 }}>
            <CKEditor
              editor={ClassicEditor}
              style={{ height: "200px", minHeight: "200px" }}
              onReady={(editor) => {}}
              data={valueDialog.content ? valueDialog.content : ""}
            />
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>THÊM MỚI</DialogTitle>
        <div style={{ padding: "20px" }}>
          <ComboBox
            style={{ flex: 0.5, marginTop: "20px" }}
            url={`${GET_CATEGORY}?id=1`}
            label="Cart"
            valueProps={valueDialog.code}
            onChange={(value) => setValueDialog({ ...valueDialog, code: value })}
          ></ComboBox>
          <div style={{ margin: "30px 0" }}></div>
          <CKEditor
            editor={ClassicEditor}
            style={{ height: "200px", minHeight: "200px" }}
            onReady={(editor) => {}}
            data={valueDialog.content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setValueDialog((prev) => ({ ...prev, content: data }));
            }}
          />
        </div>
        <DialogActions>
          <Button variant="contained" onClick={() => handleSave()}>
            Lưu
          </Button>
          <Button variant="contained" color="error" onClick={() => setOpen(false)}>
            Hủy bỏ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GetInfoCart;

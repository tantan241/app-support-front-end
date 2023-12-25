import { Button, Dialog, DialogActions, DialogTitle, Fab, Grid, TextField, Tooltip } from "@mui/material";
import AppBar from "../../componentCore/AppBar";
import ComboBox from "../../componentCore/ComboBox";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ListArticleEdit.module.scss";
import { Add } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
const cx = classNames.bind(styles);
function ListArticleEdit() {
    const navigate = useNavigate();
    const [pathName, setPathName] = useState("");
    const [title, setTitle] = useState("Thêm mới");
    const [articles, setArticles] = useState(() => {
        const uniqueId = uuidv4();

        return [{ id: uniqueId, value: "" }];
    });
    const [openDialog, setOpenDialog] = useState(true);
    const handleSave = useCallback(() => {});
    useEffect(() => {
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
            //   fetchData(API_GET_DATA_ROW_CODE_UPDATE, "POST", { id: id }).then((res) => {
            //     if (res.status === 1) {
            //       setValues({ ...res.data, entityType: res.data.entity_type, cartType: res.data.cart_type });
            //     }
            //   });
        }
    }, []);
    const handleArticleInputChange = useCallback((id, value) => {
        setArticles((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
    }, []);
    const handleAddArticle = useCallback(() => {
        setArticles((prev) => {
            const uniqueId = uuidv4();
            return [...prev, { id: uniqueId, value: "" }];
        });
    }, []);
    const handleDeleteArticle = useCallback((id) => {
        setArticles((prev) => prev.filter((item) => item.id !== id));
    }, []);
    return (
        <div className={cx("wrapper")}>
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
            <Grid container spacing={4} className={cx("content")}>
                <Grid item xs={6}>
                    <ComboBox label="Cart"></ComboBox>
                </Grid>
                <Grid item xs={6}>
                    <ComboBox label="Key words"></ComboBox>
                </Grid>
                {articles.map((item) => (
                    <Grid item xs={6}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <TextField
                                fullWidth
                                value={item.value}
                                onChange={(e) => handleArticleInputChange(item.id, e.target.value)}
                            ></TextField>
                            <div style={{ margin: "0 5px" }}></div>
                            <Fab color="error" size="small" onClick={() => handleDeleteArticle()}>
                                <Tooltip title="Xóa article">
                                    <DeleteIcon></DeleteIcon>
                                </Tooltip>
                            </Fab>
                        </div>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Fab color="primary" size="small" onClick={() => handleAddArticle()}>
                        <Tooltip title="Thêm mới article">
                            <Add></Add>
                        </Tooltip>
                    </Fab>
                </Grid>
            </Grid>
            <Dialog open={openDialog}>
                <DialogTitle>Bạn có chắc muốn xóa không?</DialogTitle>
                <DialogActions>
                    <Button color="primary" variant="contained">
                        Đồng ý
                    </Button>
                    <Button color="error" variant="contained">
                        Quay lại
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ListArticleEdit;

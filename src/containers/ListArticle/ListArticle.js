import classNames from "classnames/bind";
import styles from "./ListArticle.module.scss";
import AppBar from "../../componentCore/AppBar";
import ComboBox from "../../componentCore/ComboBox";
import { Grid, TextField } from "@mui/material";
import TextfieldChip from "../../components/TextfieldChip";
import { useState } from "react";
const cx = classNames.bind(styles);
function ListArticle() {
    const [values, setValues] = useState({ cart: "", chips: [] });
    console.log(values.chips);
    return (
        <div>
            <AppBar text="Danh sách bài viết"></AppBar>
            <div className={cx("filters")}>
                <span className={cx("filter-text")}>Bộ lọc</span>
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <ComboBox label="Cart" onChange={(value) => setValues({ ...values, cart: value })}></ComboBox>
                    </Grid>
                    <Grid item xs={4}>
                        <TextfieldChip
                            onChipInputChange={(values) => setValues({ ...values, chips: values })}
                            label="Key words"
                        ></TextfieldChip>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default ListArticle;

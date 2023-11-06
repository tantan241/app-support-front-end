import AppBar from "../../componentCore/AppBar";
import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import { Box, Button, Container, Grid } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { handleClickCopy } from "../../common";
const cx = classNames.bind(styles);
function Dashboard() {
  const fakeData = [
    {
      id: 1,
      name: "Code Xóa Orders Demo",
      content: 
        `if not self._notice.get('clear_target_orders_demo'):
    self._notice['clear_target_orders_demo'] = True
    self.clear_target_orders_demo()`,
    },
    {
      id: 2,
      name: "Code Check Install App Development Shopify",
      content: 
    `function create() {
        var checkBoxs = document.querySelectorAll('.Polaris-Checkbox__Input_30ock');
        var index = 0;
        checkBoxs.forEach(check => {
            if (check.checked != true) {
                check.click();
                setTimeout(() => { console.log("Enable checkbox " + index) }, 1000);
                index += 1;
            } else {
                return;
            }
        });
    }
    create();`,
    },
    {
      id: 3,
      name: "Code Lấy Danh Sách Soure Status",
      content: 
    `const sectionOrderStatus = document.getElementById('order-status-section')
    const orderStatusContent = sectionOrderStatus.querySelector('.migration-map-content')
    const listForm = orderStatusContent.querySelectorAll('.form-group')
    var listTitle = ''
    for (let i = 1; i< listForm.length; i++) {
          const title = listForm[i].querySelector('div').innerText
          listTitle = listTitle + title +"\\n"
    }
    console.log(listTitle)`,
    },
    
  ];
  return (
    <Grid className={cx("wrapper")}>
      <AppBar text="dashboard"></AppBar>
      <div className={cx("content")}>
        {fakeData.map((item) => (
          <div item xs={4} className={cx("code-item")}>
            <div>{item.name}</div>
            <Button size="small" variant="contained" onClick={() => handleClickCopy(item.content)}>
              Code <ContentCopyIcon></ContentCopyIcon>
            </Button>
          </div>
        ))}
      </div>
    </Grid>
  );
}

export default Dashboard;

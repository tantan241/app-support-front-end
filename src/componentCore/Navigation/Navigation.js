import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Link } from "react-router-dom";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { navigation } from "../variable";
import classNames from "classnames/bind";
import styles from "./Navigation.module.scss";
function filterArrayByValue(array1, object) {
  const resultArray = [];

  array1.forEach((item) => {
    for (const key in object) {
      if (key.toString() === item.role) {
        if (!!item?.child) {
          if (item.child.length > 0) {
            let child_list = [];
            item.child.forEach((item_child) => {
              object[key].forEach((it_child) => {
                if (item_child.role === it_child) {
                  child_list.push(item_child);
                }
              });
            });
            item.child = child_list;
          }
        }
        resultArray.push(item);
      }
    }
  });

  return resultArray;
}
const cx = classNames.bind(styles);
function Navigation({ appName = "App Name" }) {
  const fakeData = { codeUpdate: {}, processData: ["csvToSql"] };
  const [localOpen, setLocalOpen] = useState();
  const [reload, seReload] = useState(0);
  // var array = filterArrayByValue(navigation, fakeData);
  var array = navigation;


  const transformArrayToObject = useCallback(() => {
    const result = {};

    function traverseAndTransform(item) {
      const key = `${item.name}${item.id}`;
      result[key] = false;

      if (item.child && item.child.length > 0) {
        for (const childItem of item.child) {
          traverseAndTransform(childItem);
        }
      }
    }

    for (const item of array) {
      traverseAndTransform(item);
    }

    return result;
  }, []);
  useEffect(() => {
    const result = transformArrayToObject();
    setLocalOpen(result);
  }, []);
  useEffect(() => {
    console.log(localOpen);
  }, [localOpen]);
  const renderItem = useCallback(
    (data) => {
      if (localOpen) {
        const Icon = data.icon;
        return (
          <Link to={data.link} className={cx("link-button")}>
            <ListItemButton
              sx={data.margin ? { pl: data.margin } : ""}
              onClick={
                data?.child && data.child.length > 0
                  ? () => {
                      setLocalOpen((prev) => {
                        prev[`${data.name}${data.id}`] = !prev[`${data.name}${data.id}`];

                        return prev;
                      });
                      seReload(new Date() * 1);
                    }
                  : () => {}
              }
            >
              <ListItemIcon className={cx("icon")}>
                <Icon></Icon>
              </ListItemIcon>

              <ListItemText primary={data.name} />
              {data?.child &&
                data.child.length > 0 &&
                (localOpen[`${data.name}${data.id}`] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
            {data?.child && data.child.length > 0 && (
              <Collapse in={localOpen[`${data.name}${data.id}`]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {data.child.map((item) => {
                    return renderItem(item);
                  })}
                </List>
              </Collapse>
            )}
          </Link>
        );
      }
    },
    [localOpen]
  );
  return (
    <>
      {localOpen ? (
        <List
          className={cx("wrapper")}
          sx={{ bgcolor: "background.paper" }}
          component="nav"
          subheader={<div className={cx("app-name")}>{appName}</div>}
        >
          {array.map((item) => {
            return renderItem(item);
          })}
        </List>
      ) : (
        <></>
      )}
    </>
  );
}

export default Navigation;

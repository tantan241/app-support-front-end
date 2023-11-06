import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";

import { useEffect, useState } from "react";
import CodeUpdate from "./containers/CodeUpdate/CodeUpdate";
import Migration from "./containers/Migration/Migration";
import EmailTemplate from "./containers/EmailTemplate/EmailTemplate";
import { TOKEN } from "./constants";
import Login from "./containers/Login/Login";
import { AUTH_API, USER_API_LOGIN } from "./api/userApi";
import CodeUpdateEdit from "./containers/CodeUpdateEdit/CodeUpdateEdit";
import ArrayString from "./containers/ArrayString/ArrayString";
import CSVToSQL from "./containers/CSVToSQL/CSVToSQL";
import Dashboard from "./containers/Dashboard";
import MigrationEdit from "./containers/MigrationEdit";
import GetInfoCart from "./containers/GetInfoCart";

const publicLayouts = [
  {
    id: 1,
    path: "/",
    component: Dashboard,
  },
  {
    id: 2,
    path: "/code-update",
    component: CodeUpdate,
  },
  {
    id: 3,
    path: "/migration",
    component: Migration,
  },
  {
    id: 4,
    path: "/email-template",
    component: EmailTemplate,
  },
  {
    id: 5,
    path: "/code-update/:id",
    component: CodeUpdateEdit,
  },
  {
    id: 6,
    path: "/array-string",
    component: ArrayString,
  },
  {
    id: 7,
    path: "/csv-to-sql",
    component: CSVToSQL,
  },
  {
    id: 8,
    path: "/migration/:id",
    component: MigrationEdit,
  },
  {
    id: 9,
    path: "/get-info-cart",
    component: GetInfoCart,
  },
];
function App() {
  const [login, setLogin] = useState(false);
  useEffect(() => {
    const cookieGet = document.cookie.split(";");
    let username = "";
    let password = "";
    cookieGet.forEach((item) => {
      const itemSplit = item.split("=");
      if (itemSplit[0].trim() === "username") {
        username = itemSplit[1];
      }
      if (itemSplit[0].trim() === "password") {
        password = itemSplit[1];
      }
    });
    const payload = { username: username, password: password };
    fetch(USER_API_LOGIN, {
      method: "POST",
      
      headers: {
        "Content-Type": "application/json", // Đảm bảo chỉ định loại dữ liệu gửi đi
      },
      body: JSON.stringify(payload), // Chuyển đổi đối tượng thành chuỗi JSON để gửi đi
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 1) {
          setLogin(true);
          fetch(AUTH_API, {
            method: "POST",
            
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
            .then((res) => res.json())
            .then((res) => localStorage.setItem(TOKEN, JSON.stringify(res.access)));
        }
      });
  }, []);

  return (
    <Router>
      {login ? (
        <Routes>
          {publicLayouts.map((publicLayout, index) => {
            const Page = publicLayout.component;
            return (
              <Route
                key={publicLayout.id}
                path={publicLayout.path}
                element={
                  <MainLayout>
                    <Page></Page>
                  </MainLayout>
                }
              ></Route>
            );
          })}
        </Routes>
      ) : (
        <Login setLogin={setLogin}></Login>
      )}
    </Router>
  );
}

export default App;

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { useCallback, useState } from "react";
import { Link, redirect } from "react-router-dom";
import { AUTH_API, USER_API_LOGIN } from "../../api/userApi";
import { TOKEN } from "../../constants";
import { Copyright } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Paper from "@mui/material/Paper";
const cx = classNames.bind(styles);
function Login({ setLogin }) {
  const [values, setValues] = useState({ username: "", password: "" });
  const handleInputChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleLoginClick = useCallback(() => {
    fetch(USER_API_LOGIN, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 1) {
          document.cookie = `username= ${values.username}`;
          document.cookie = `password= ${values.password}`;

          fetch(AUTH_API, {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((res) => res.json())
            .then((res) => {
              localStorage.setItem(TOKEN, JSON.stringify(res.access));
              setLogin(true);
            });
        }
      });
  }, [values]);
  return (
    <Grid className={cx("wrapper")} container style={{ flexDirection: "column" }}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              //  onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                label={"Tài khoản"}
                fullWidth
                value={values.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              ></TextField>
              <TextField
                margin="normal"
                fullWidth
                label={"Mật khẩu"}
                type="password"
                value={values.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              ></TextField>
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button  fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLoginClick}>
                Đăng nhập
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* <Grid item className={cx("form")} style={{ marginBottom: "20px" }}>
        <Grid container spacing={8}>
          <Grid item sx={12}>
            <TextField
              label={"Tài khoản"}
              value={values.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            ></TextField>
          </Grid>
          <Grid item sx={12}>
            <TextField
              label={"Mật khẩu"}
              value={values.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            ></TextField>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={6}>
        <Grid container spacing={8}>
          <Grid item sx={12}>
            <Button variant="contained" onClick={handleLoginClick}>
              Đăng Nhập
            </Button>
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
}

export default Login;

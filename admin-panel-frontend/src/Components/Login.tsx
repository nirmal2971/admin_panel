import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      // ✅ Show success snackbar
      setSnack({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      // ✅ Navigate after short delay
      setTimeout(() => {
        navigate("/users");
      }, 2000);
    } catch (err: any) {
      setSnack({
        open: true,
        message: err.response?.data?.message || "Login failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #2c5364, #00bf8f)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Roboto Condensed, sans-serif",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{ padding: 4, marginTop: 8, bgcolor: "#1e1e1e", color: "white" }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            Admin Panel Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              InputProps={{
                sx: { backgroundColor: "#2d2d2d", color: "white" },
              }}
              InputLabelProps={{ style: { color: "#aaa" } }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="filled"
              InputProps={{
                sx: { backgroundColor: "#2d2d2d", color: "white" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: "#aaa" } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, bgcolor: "#1976d2" }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <Link href="/signup" underline="hover" color="primary">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity={snack.severity}
          sx={{
            width: "100%",
            bgcolor: snack.severity === "success" ? "#43a047" : "#d32f2f",
            color: "white",
            borderRadius: "12px",
          }}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;

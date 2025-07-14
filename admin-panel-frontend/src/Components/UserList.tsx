import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  CircularProgress,
  Alert,
  IconButton,TableContainer,Chip
} from "@mui/material";
import { Delete, Download, Logout } from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "blocked";
  createdAt: string;
  lastActive: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch {
      alert("Error deleting user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const downloadExcel = () => {
    const data = users.map((user) => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status,
      CreatedAt: new Date(user.createdAt).toLocaleString(),
      LastActive: dayjs(user.lastActive).fromNow(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "UserList.xlsx");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #2c5364, #00bf8f)",
        padding: 4,
        fontFamily: "Roboto Condensed, sans-serif",
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold">
            User List
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Download />}
            onClick={downloadExcel}
          >
            Download as Excel
          </Button>
        </Box>

<TableContainer
  component={Paper}
  elevation={3}
  sx={{
    background: '#121212',
    borderRadius: 3,
    px: 2,
    py: 1,
    color: '#fff',
  }}
>
  <Table>
    <TableHead>
      <TableRow>
        {['Name', 'Email', 'Role', 'Status', 'Created At', 'Last Active', 'Action'].map((heading) => (
          <TableCell
            key={heading}
            sx={{
              color: '#ffffff',
              fontWeight: 'bold',
              borderBottom: '1px solid #333',
              backgroundColor: '#1e1e1e',
            }}
          >
            {heading}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      {users.map((user) => (
        <TableRow
          key={user._id}
          sx={{
            backgroundColor: '#1b1b1b',
            '&:hover': {
              backgroundColor: '#2a2a2a',
            },
            borderBottom: '1px solid #333',
          }}
        >
          <TableCell sx={{ color: '#f1f1f1' }}>{user.name}</TableCell>
          <TableCell sx={{ color: '#f1f1f1' }}>{user.email}</TableCell>

          <TableCell>
            <Chip
              label={user.role}
              size="small"
              sx={{
                backgroundColor: user.role === 'admin' ? '#1976d2' : '#555',
                color: '#fff',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
          </TableCell>

          <TableCell>
            <Chip
              label={user.status}
              size="small"
              sx={{
                backgroundColor: user.status === 'active' ? '#43a047' : '#d32f2f',
                color: '#fff',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
          </TableCell>

          <TableCell sx={{ color: '#ccc' }}>
            {new Date(user.createdAt).toLocaleString()}
          </TableCell>

          <TableCell sx={{ color: '#bbb' }}>
            {dayjs(user.lastActive).fromNow()}
          </TableCell>

          <TableCell>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(user._id)}
              sx={{
                bgcolor: '#b71c1c',
                '&:hover': { bgcolor: '#d32f2f' },
                color: '#fff',
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}

      {users.length === 0 && (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ color: '#aaa', py: 4 }}>
            No users found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

      </Container>
    </Box>
  );
};

export default UserList;

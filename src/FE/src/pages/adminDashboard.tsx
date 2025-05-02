import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import UserFormDialog from "../components/formDialog";

const UserManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [users, setUsers] = useState([]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: () => (
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleAddUser = (user: any) => {
    setUsers([...users, user]);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Add User
      </Button>
      <DataGrid rows={users} columns={columns} pageSize={10} autoHeight />
      <UserFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
};

export default UserManagement;

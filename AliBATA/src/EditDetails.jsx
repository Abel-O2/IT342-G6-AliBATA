import { Dialog, DialogTitle, DialogContent,DialogActions, TextField, Button, Box, } from "@mui/material";
import { useState, useEffect } from "react";
  
  const EditUserModal = ({ open, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({
      firstName: "",
      middleName: "",
      lastName: "",
    });
  
    useEffect(() => {
      if (initialData) {
        setFormData(initialData);
      }
    }, [initialData]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSave = () => {
      onSave(formData); 
      onClose(); 
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Your Details</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Username"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EditUserModal;
  
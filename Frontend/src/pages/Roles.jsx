// frontend/src/pages/Roles.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { hasPermission, baseURL } = useAuth();
  
  

  useEffect(() => {
    if (hasPermission('ROLE_READ')) {
      fetchRoles();
    }
    if (hasPermission('PERMISSION_READ')) {
      fetchPermissions();
    }
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/permissions`);
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleOpenDialog = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions.map(p => p.name)
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',

        description: '',
        permissions: []
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRole(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingRole) {
        await axios.put(`${baseURL}/api/roles/${editingRole.id}/permissions`, {
          permissions: formData.permissions
        });
      } else {
        await axios.post(`${baseURL}/api/roles`, formData);
      }
      
      fetchRoles();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving role');
    }
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        setDeleteError('');
        await axios.delete(`${baseURL}/api/roles/${roleId}`);
        fetchRoles();
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error deleting role';
        setDeleteError(errorMsg);
        console.error('Error deleting role:', error);
        // Reset error after 5 seconds
        setTimeout(() => setDeleteError(''), 5000);
      }
    }
  };

  const togglePermission = (permissionName) => {
    const newPermissions = formData.permissions.includes(permissionName)
      ? formData.permissions.filter(p => p !== permissionName)
      : [...formData.permissions, permissionName];
    setFormData({...formData, permissions: newPermissions});
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Roles Management</Typography>
        {hasPermission('ROLE_CREATE') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={loading}
          >
            Add Role
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDeleteError('')}>
          {deleteError}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No roles found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>#{role.id}</TableCell>
                    <TableCell>
                      <Chip label={role.name} color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {role.permissions && role.permissions.length > 0 ? (
                          role.permissions.map((permission) => (
                            <Chip
                              key={permission.id}
                              label={permission.name}
                              size="small"
                              variant="outlined"
                            />
                          ))
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            No permissions
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {hasPermission('ROLE_UPDATE') && (
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(role)}
                          title="Edit role"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {hasPermission('ROLE_DELETE') && (
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(role.id)}
                          color="error"
                          title="Delete role"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}

                      {(!hasPermission('ROLE_UPDATE') && !hasPermission('ROLE_DELETE')) && (
                        <Typography variant="body2" color="text.secondary">
                          No actions available
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRole ? 'Edit Role' : 'Add New Role'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            disabled={!!editingRole || submitting}
            error={!formData.name.trim() && formData.name !== ''}
            helperText={!formData.name.trim() && formData.name !== '' ? 'Name is required' : ''}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            disabled={submitting}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle2" gutterBottom>
            Permissions
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
            {permissions.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary">No permissions available</Typography>
              </Box>
            ) : (
              <List dense>
                {permissions.map((permission) => (
                  <ListItem
                    key={permission.id}
                    disabled={submitting}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={formData.permissions.includes(permission.name)}
                        onChange={() => togglePermission(permission.name)}
                        disabled={submitting}
                      />
                    }
                  >
                    <ListItemText
                      primary={permission.name}
                      secondary={`${permission.resource} - ${permission.action}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                {editingRole ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingRole ? 'Update' : 'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Roles;
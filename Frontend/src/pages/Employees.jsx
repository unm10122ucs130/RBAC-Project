// frontend/src/pages/Employees.jsx
import React, { useEffect, useState } from 'react';
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
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Employees = () => {
    const { hasPermission, baseURL } = useAuth();

    const [employees, setEmployees] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        salary: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    /*if the user has read permission, it fetches employees from backend*/
    useEffect(() => {
        if (hasPermission('EMPLOYEE_READ')) {
            fetchEmployees();
        }
    }, []);

    /* API ---- it call backend API to get all employees  */

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseURL}/api/employees`);
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    /*  Dialog --->  If employee exists → edit mode
                        Else → add mode */

    const handleOpenDialog = (employee = null) => {
        if (employee) {
            setEditingEmployee(employee);
            setFormData({
                name: employee.name,
                email: employee.email,
                department: employee.department || '',
                salary: employee.salary || ''
            });
        } else {
            setEditingEmployee(null);
            setFormData({
                name: '',
                email: '',
                department: '',
                salary: ''
            });
        }
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingEmployee(null);
    };

    /* ---------------- CREATE / UPDATE ---------
       This function is used to create or update.
    it runs when the submit button is clicked.
    If editingEmployee exists, that means we are editing, 
    editingEmployee is null, then it’s a new employee.

*/

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            if (editingEmployee) {
                await axios.put(
                    `${baseURL}/api/employees/${editingEmployee.id}`,
                    {
                        name: formData.name,
                        department: formData.department,
                        salary: Number(formData.salary)
                    }
                );
            } else {
                await axios.post(`${baseURL}/api/employees`, {
                    ...formData,
                    salary: Number(formData.salary)
                });
            }

            fetchEmployees();
            handleCloseDialog();
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving employee');
        } finally {
            setSubmitting(false);
        }
    };

    /*Delete 
    It is used to deletes an employee.
     Before deleting, it ask confirmation, 
     if the user clicks delete icon,it delete the employee
     otherwise, the function stops
    */

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this employee?')) return;

        try {
            await axios.delete(`${baseURL}/api/employees/${id}`);
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting employee');
        }
    };

    /* This is the UI part */

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Employees</Typography>
                {hasPermission('EMPLOYEE_CREATE') && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Employee
                    </Button>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',

                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Salary</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No employees found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.map((emp) => (
                                    <TableRow key={emp.id}>
                                        <TableCell>#{emp.id}</TableCell>
                                        <TableCell>{emp.name}</TableCell>
                                        <TableCell>{emp.email}</TableCell>
                                        <TableCell>{emp.department || '-'}</TableCell>
                                        <TableCell>{emp.salary ?? '-'}</TableCell>
                                        <TableCell>
                                            {hasPermission('EMPLOYEE_UPDATE') && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog(emp)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            {hasPermission('EMPLOYEE_DELETE') && (
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(emp.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                            {(!hasPermission('EMPLOYEE_UPDATE') && !hasPermission('EMPLOYEE_DELETE')) && (
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

            {/*             Dialog             */}

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingEmployee ? 'Edit Employee' : 'Add Employee'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="dense"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={submitting}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="dense"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!!editingEmployee || submitting}
                    />
                    <TextField
                        label="Department"
                        fullWidth
                        margin="dense"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        disabled={submitting}
                    />
                    <TextField
                        label="Salary"
                        fullWidth
                        margin="dense"
                        type="number"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        disabled={submitting}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting
                            ? <CircularProgress size={20} />
                            : editingEmployee ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default Employees;

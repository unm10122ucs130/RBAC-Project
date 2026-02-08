// frontend/src/pages/Projects.jsx
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

const Projects = () => {
    const { hasPermission, baseURL } = useAuth();

    const [projects, setProjects] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: '',
        startDate: '',
        endDate: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    /* -------------------- API ------------------*/

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseURL}/api/projects`);
            setProjects(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    /* --------------------- DIALOG -------------------- */

    const handleOpenDialog = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                name: project.name,
                description: project.description || '',
                status: project.status || '',
                startDate: project.startDate || '',
                endDate: project.endDate || ''
            });
        } else {
            setEditingProject(null);
            setFormData({
                name: '',
                description: '',
                status: '',
                startDate: '',
                endDate: ''
            });
        }
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProject(null);
    };

    /* -------------- SAVE -------------- */

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            if (editingProject) {
                await axios.put(
                    `${baseURL}/api/projects/${editingProject.id}`,
                    {
                        description: formData.description,
                        status: formData.status,
                        startDate: formData.startDate,
                        endDate: formData.endDate
                    }
                );
            } else {
                await axios.post(`${baseURL}/api/projects`, formData);
            }

            fetchProjects();
            handleCloseDialog();
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving project');
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------- DELETE ----------------*/

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;

        try {
            await axios.delete(`${baseURL}/api/projects/${id}`);
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting project');
        }
    };

    /*--------------- UI -----------------*/

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Projects</Typography>
                {hasPermission('PROJECT_CREATE') && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Project
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
                        minHeight: '60vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
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
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Start & End Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No projects found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>{project.id}</TableCell>
                                        <TableCell>{project.name}</TableCell>
                                        <TableCell>{project.status || '-'}</TableCell>
                                        <TableCell>{project.description || '-'}</TableCell>
                                        <TableCell>{new Date(project.startDate).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        }) || '-'} to {project.endDate ? new Date(project.endDate).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        }) : '-'}</TableCell>
                                        <TableCell>
                                            {hasPermission('PROJECT_UPDATE') && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog(project)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            {hasPermission('PROJECT_DELETE') && (
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(project.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                            {(!hasPermission('PROJECT_UPDATE') && !hasPermission('PROJECT_DELETE')) && (
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

            {/* ------------- DIALOG ------------------ */}

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingProject ? 'Edit Project' : 'Add Project'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="dense"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!!editingProject || submitting}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="dense"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={submitting}
                    />
                    <TextField
                        label="Status"
                        fullWidth
                        margin="dense"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        disabled={submitting}
                    />
                    <TextField
                        label="Start Date"
                        type="datetime-local"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        disabled={submitting}
                    />
                    <TextField
                        label="End Date"
                        type="datetime-local"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                            : editingProject ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Projects;

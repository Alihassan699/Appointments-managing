import React, { useState, useEffect } from 'react';
import '../styles/AppointmentsTable.css'; 
import EditDel from './EditDel'; 
import Modal from 'react-modal';

const AppointmentsTable = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(''); 
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/appointments');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleEdit = (appointment) => {
        setSelectedAppointment(appointment);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (appointment) => {
        try {
            const response = await fetch(`http://localhost:5000/api/appointments/${appointment.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete appointment');
            }
            await fetchAppointments(); // Refetch appointments after deletion
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    const handleSave = async (formData) => {
        const { id, customerName, providerName, service, date, time, status } = formData;
    
        if (!customerName || !providerName || !service || !date || !time || !status) {
            console.error('All fields are required');
            return;
        }
    
        if (modalMode === 'edit') {
            try {
                const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ customerName, providerName, service, date, time, status }),
                });
                if (!response.ok) {
                    throw new Error('Failed to update appointment');
                }
                await fetchAppointments(); // Refetch appointments after update
            } catch (error) {
                console.error('Error updating appointment:', error);
            }
        }
        handleCloseModal();
    };

    const indexOfLastAppointment = currentPage * itemsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
    const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(appointments.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); 
    };

    return (
        <div className="appointments-table-container">
            <div className="appointments-header">
                <input type="text" placeholder="Search" className="search-input" />
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <table className="appointments-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Provider Name</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td>{appointment.id}</td>
                            <td>{appointment.customername || 'N/A'}</td>
                            <td>{appointment.providername || 'N/A'}</td>
                            <td>{appointment.service || 'N/A'}</td>
                            <td>{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</td>
                            <td>{appointment.time || 'N/A'}</td>
                            <td>{appointment.status || 'N/A'}</td>
                            <td>
                                <button onClick={() => handleEdit(appointment)} className="edit-button">Edit</button>
                                <button onClick={() => handleDelete(appointment)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="items-per-page-select">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <button 
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    className="pagination-button"
                    disabled={currentPage === 1}
                >
                    &#9664; Previous
                </button>
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`pagination-button ${number === currentPage ? 'active' : ''}`}
                    >
                        {number}
                    </button>
                ))}
                <button 
                    onClick={() => setCurrentPage(currentPage < pageNumbers.length ? currentPage + 1 : pageNumbers.length)}
                    className="pagination-button"
                    disabled={currentPage === pageNumbers.length}
                >
                    Next &#9654;
                </button>
            </div>

            {/* Render Modal */}
            {isModalOpen && (
                <EditDel 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    appointment={selectedAppointment}
                    mode={modalMode}
                />
            )}
        </div>
    );
};

export default AppointmentsTable;

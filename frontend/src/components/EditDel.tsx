import React, { useState, useEffect } from 'react';
import '../styles/EditDel.css'; // Import your CSS file for styling

const EditDel = ({ isOpen, onClose, onSave, appointment }) => {
    const [formData, setFormData] = useState({
        id: '',
        customerName: '',
        providerName: '',
        service: '',
        date: '',
        time: '',
        status: '',
    });

    useEffect(() => {
        if (appointment) {
            setFormData({
                id: appointment.id,
                customerName: appointment.customername || '',
                providerName: appointment.providername || '',
                service: appointment.service || '',
                date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
                time: appointment.time || '',
                status: appointment.status || '',
            });
        }
    }, [appointment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>{appointment ? 'Edit Appointment' : 'Add Appointment'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Customer Name:
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Provider Name:
                        <input
                            type="text"
                            name="providerName"
                            value={formData.providerName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Service:
                        <input
                            type="text"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Date:
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Time:
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Status:
                        <select
                            className="status-select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                    <button type="submit">{appointment ? 'Save Changes' : 'Add Appointment'}</button>
                </form>
            </div>
        </div>
    );
};

export default EditDel;

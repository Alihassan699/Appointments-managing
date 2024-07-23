// src/App.js
import React, { useState } from 'react';
import AppointmentsTable from './components/AppointmentsTable';
import ModalForm from './components/ModalForm';
import './App.css';

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = (formData) => {
        console.log('Form Submitted:', formData);
        setIsModalOpen(false);
        // Add logic to save the appointment
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>Appointment Management</h1>
                <button className="add-button" onClick={handleAddClick}>+ Add Appointment</button>
            </header>
            <AppointmentsTable />
            <ModalForm 
                isOpen={isModalOpen} 
                onRequestClose={handleModalClose} 
                onSubmit={handleFormSubmit} 
            />
        </div>
    );
};

export default App;

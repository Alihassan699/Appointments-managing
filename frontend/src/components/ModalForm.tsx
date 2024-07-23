import React from 'react';
import Modal from 'react-modal';
import '../styles/ModalForm.css'; // Import the CSS file

const ModalForm = ({ isOpen, onRequestClose, onSubmit }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            customerName: formData.get('customerName'),
            providerName: formData.get('providerName'),
            service: formData.get('service'),
            date: formData.get('date'),
            time: formData.get('time'),
            status: formData.get('status')
        };

        fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            onSubmit(data); // Call the onSubmit callback with the response data
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Appointment Form"
            className="modal-content" // Apply the CSS class
        >
            <h2>Add Appointment</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Customer Name:
                    <input type="text" name="customerName" required />
                </label>
                <label>
                    Provider Name:
                    <input type="text" name="providerName" required />
                </label>
                <label>
                    Service:
                    <input type="text" name="service" required />
                </label>
                <label>
                    Date:
                    <input type="date" name="date" required />
                </label>
                <label>
                    Time:
                    <input type="time" name="time" required />
                </label>
                <label>
                    Status:
                    <select name="status" className="status-select" required>
                        <option value="Active">Active</option>
                        <option value="Deactive">Deactive</option>
                    </select>
                </label>
                <div>
                    <button type="submit" className="submit-button">Submit</button>
                    <button type="button" className="cancel-button" onClick={onRequestClose}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalForm;

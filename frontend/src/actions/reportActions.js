import { ENDPOINT_URL } from "../constants/constants";

export const createReport = async (rg) => {
    try {
        const response = await fetch(`${ENDPOINT_URL}/createReport`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rg)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error('Error creating report:', err);
        throw err; // Re-throw error to be handled by the caller
    }
};

export const getAllReport = async () => {
    try {
        const response = await fetch(`${ENDPOINT_URL}/getAllReport`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error('Error fetching reports:', err);
        throw err; // Re-throw error to be handled by the caller
    }
};

export const deleteReport = async (id) => {
    try {
        const response = await fetch(`${ENDPOINT_URL}/deleteReportById/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error('Error deleting report:', err);
        throw err; // Re-throw error to be handled by the caller
    }
};

export const updateReport = async (id, data) => {
    try {
        const response = await fetch(`${ENDPOINT_URL}/updateReportById/${id}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error('Error updating report:', err);
        throw err; // Re-throw error to be handled by the caller
    }
};

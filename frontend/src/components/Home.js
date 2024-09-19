import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { createReport, getAllReport, updateReport, deleteReport } from '../actions/reportActions';
import DatePicker from 'react-datepicker';  // Import the DatePicker component
import 'react-datepicker/dist/react-datepicker.css';  // Import DatePicker styles
import { format } from 'date-fns';  // Import date-fns to format the date

const Home = () => {
    const [data, setData] = useState({
        eventName: '',
        eventDate: '',  // We'll store eventDate as a string after formatting
        eventVenue: '',
        eventDescription: '',
        eventImage: '',
        id: ''
    });

    const [allReport, setAllReport] = useState([]);
    const [showData, setShowData] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFetched, setIsFetched] = useState(false);  // New state to track fetch status

    useEffect(() => {
        //fetchReport(); 
    }, []);

    const fetchReport = async () => {
        try {
            const res = await getAllReport();
            if (res && res.data) {
                setAllReport(res.data);
                setShowData(true);
                setIsFetched(true);  // Mark as fetched
                console.log("Data fetched:", res.data);
            } else {
                console.log("Unexpected response structure:", res);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = event => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const handleDateChange = (date) => {
        const formattedDate = format(date, 'dd-MM-yyyy'); // Format date as DD-MM-YYYY
        setData({ ...data, eventDate: formattedDate });
    };

    const handleSubmit = () => {
        if (!data.eventName || !data.eventDate || !data.eventVenue || !data.eventDescription || !data.eventImage) {
            alert('Please fill in all fields');
            return;
        }
        const body = {
            eventName: data.eventName,
            eventDate: data.eventDate,
            eventVenue: data.eventVenue,
            eventDescription: data.eventDescription,
            eventImage: data.eventImage
        };

        createReport(body).then(res => {
            console.log('response', res);
            setData({
                eventName: '',
                eventDate: '',
                eventVenue: '',
                eventDescription: '',
                eventImage: ''
            });
            console.log(body);
            alert('Data Submitted Successfully');
            // Clear the existing reports
            setAllReport([]);
            setIsFetched(false);  // Reset fetch status
            // Optionally re-fetch the reports after clearing
            // fetchReport();
        }).catch(err => {
            console.log(err);
        });
    };

    const handleValue = (element) => {
        setData({
            eventName: element.eventName,
            eventDate: element.eventDate,
            eventVenue: element.eventVenue,
            eventDescription: element.eventDescription,
            eventImage: element.eventImage,
            id: element._id
        });
        setSelectedData(element);
    };

    const handleUpdate = async () => {
        if (!data.eventName || !data.eventDate || !data.eventVenue || !data.eventDescription || !data.eventImage) {
            alert('Please Select Report');
            return;
        }

        const body = {
            eventName: data.eventName,
            eventDate: data.eventDate,
            eventVenue: data.eventVenue,
            eventDescription: data.eventDescription,
            eventImage: data.eventImage
        };

        try {
            const res = await updateReport(data.id, body);
            console.log('response', res);
            setData({
                eventName: '',
                eventDate: '',
                eventVenue: '',
                eventDescription: '',
                eventImage: ''
            });
            fetchReport();
            alert("Updated Successfully")
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteReport(id);
            console.log('delete', res);
            setData({
                eventName: '',
                eventDate: '',
                eventVenue: '',
                eventDescription: '',
                eventImage: ''
            });
            fetchReport();
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
       // localStorage.removeItem('userToken'); 
        alert('You have been logged out');
        window.location.href = '/'; 
    };

    const createPDF = (data) => {
        if (!data || !data.eventName) {
            console.error('Invalid data provided to createPDF');
            return;
        }
    
        const doc = new jsPDF();
    
        // Background color
        doc.setFillColor(245, 245, 245); // Light gray background
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
    
        // Event Name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(36); // Larger font size
        doc.setTextColor(0,0,0); // Dark blue color for the event name
        const eventNameWidth = doc.getTextWidth(data.eventName);
        const eventNameX = (doc.internal.pageSize.width - eventNameWidth) / 2;
        doc.text(data.eventName, eventNameX, 40);
    
        // Date
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(24); // Medium font size
        doc.setTextColor(0,0,0); // Bright orange color for the date
        doc.text(`On ${data.eventDate}`, 10, 60); // Date position
    
        // Descriptive Text
        const descriptiveText = `The '${data.eventName}' took place at '${data.eventVenue}'. This event was designed to '${data.eventDescription}'. The venue provided a fitting backdrop, enhancing the experience for all participants. The event was successfully executed, making it a memorable occasion for everyone involved.`;
        doc.setFontSize(20); // Slightly smaller font size
        doc.setTextColor(0, 0, 0); // Black color for the description
        doc.text(descriptiveText, 10, 80, { maxWidth: doc.internal.pageSize.width - 20 });
    
        // Event Image URL
        if (data.eventImage) {
            doc.setFontSize(16); // Smaller font size for image URL
            doc.setTextColor(0, 0, 0); // Black color for image URL
            doc.text(`Event Image URL: ${data.eventImage}`, 10, 140, { maxWidth: doc.internal.pageSize.width - 20 });
        }
    
        // Save the PDF
        doc.save(`${data.eventName}_report.pdf`);
    };

    const handleCreateReport = () => {
        if (!selectedData) {
            alert('No data selected to create PDF');
            return;
        }
        setLoading(true); 
        createPDF(selectedData);
        setLoading(false); 
    };

    const handleToggleFetch = () => {
        if (isFetched) {
            setAllReport([]);  // Clear the fetched data
            setShowData(false);  // Hide the data
            setIsFetched(false);  // Reset fetch status
        } else {
            fetchReport();  // Fetch the data
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', color: 'black' }}>Event Report Generator</h1>

            <style>
                {`
                    .custom-date-picker {
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid #ced4da;
                        width: 100%;
                    }
                    
                    .custom-date-picker input {
                        font-size: 20px; /* Increase font size here */
                        padding: 8px;
                    }
                `}
            </style>d
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <button 
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', fontSize: '17px', padding: '10px 20px', borderRadius: '5px' }} 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <div style={{ padding: '30px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Name</label>
                    <input 
                        type="text" 
                        name="eventName" 
                        value={data.eventName} 
                        placeholder='Event Name' 
                        onChange={handleChange} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', transition: 'all 0.3s ease', width: '100%' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Date</label>
                    <DatePicker 
                        selected={data.eventDate ? new Date(data.eventDate.split('-').reverse().join('-')) : null} 
                        onChange={handleDateChange} 
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select a date"
                        className="custom-date-picker"
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Venue</label>
                    <input 
                        type="text" 
                        name="eventVenue" 
                        value={data.eventVenue} 
                        placeholder='Venue' 
                        onChange={handleChange} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', transition: 'all 0.3s ease', width: '100%' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Description</label>
                    <textarea 
                        name="eventDescription" 
                        value={data.eventDescription} 
                        placeholder='Description' 
                        onChange={handleChange} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', transition: 'all 0.3s ease', width: '100%' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Image URL</label>
                    <input 
                        type="text" 
                        name="eventImage" 
                        value={data.eventImage} 
                        placeholder='Image URL' 
                        onChange={handleChange} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', transition: 'all 0.3s ease', width: '100%' }}
                    />
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button 
                    style={{ backgroundColor: '#28a745', color: 'white', border: 'none', fontSize : '17px', padding: '10px 20px', borderRadius: '5px', margin: '0 10px', transition: 'all 0.3s ease' }} 
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                <button 
                    style={{ backgroundColor: isFetched ? '#dc3545' : '#007bff', color: 'white', border: 'none',fontSize : '17px', padding: '10px 20px', borderRadius: '5px', margin: '0 10px', transition: 'all 0.3s ease' }} 
                    onClick={handleToggleFetch}
                >
                    {isFetched ? 'Unfetch' : 'Fetch'}
                </button>
                <button 
                    style={{ backgroundColor: '#fd7e14', color: 'white', border: 'none',fontSize : '17px', padding: '10px 20px', borderRadius: '5px', margin: '0 10px', transition: 'all 0.3s ease' }} 
                    onClick={handleUpdate}
                >
                    Update
                </button>
                <button 
                    style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none',fontSize : '17px', padding: '10px 20px', borderRadius: '5px', margin: '0 10px', transition: 'all 0.3s ease' }} 
                    onClick={handleCreateReport}
                >
                    {loading ? 'Creating PDF...' : 'Create Report'}
                </button>
            </div>

            {showData && (
                <div style={{ marginTop: '20px' }}>
                    <h2 style={{ textAlign: 'center', color: 'black' }}>Reports List</h2>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {allReport.map(report => (
                            <li 
                                key={report._id} 
                                style={{ 
                                    padding: '10px', 
                                    borderBottom: '1px solid #ced4da', 
                                    transition: 'background-color 0.3s ease', 
                                    cursor: 'pointer', 
                                    backgroundColor: selectedData && selectedData._id === report._id ? '#e9ecef' : '#ffffff',
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center' 
                                }} 
                                onClick={() => handleValue(report)}
                            >
                                <div>
                                    <h3>{report.eventName}</h3>
                                    <p>Date: {report.eventDate}</p>
                                    <p>Venue: {report.eventVenue}</p>
                                    <p>Description: {report.eventDescription}</p>
                                    <p>Image URL: {report.eventImage}</p>
                                </div>
                                <div>
                                    <button 
                                        style={{ 
                                            backgroundColor: '#dc3545', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '5px 10px', 
                                            borderRadius: '4px', 
                                            margin: '0 5px', 
                                            cursor: 'pointer' 
                                        }} 
                                        onClick={(e) => { 
                                            e.stopPropagation(); // Prevent the li click event
                                            handleDelete(report._id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;

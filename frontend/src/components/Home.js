import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { createReport, getAllReport, updateReport, deleteReport } from '../actions/reportActions';

const Home = () => {
    const [data, setData] = useState({
        eventName: '',
        eventDate: '',
        eventVenue: '',
        eventDescription: '',
        eventImage: '',
        id: ''
    });

    const [allReport, setAllReport] = useState([]);
    const [showData, setShowData] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReport(); 
    }, []);

    const fetchReport = async () => {
        try {
            const res = await getAllReport();
            if (res && res.data) {
                setAllReport(res.data);
                setShowData(true);
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
            fetchReport(); 
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

        try {
            const res = await updateReport(data.id, body);
            console.log('response', res);
            fetchReport();
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteReport(id);
            console.log('delete', res);
            fetchReport();
        } catch (err) {
            console.log(err);
        }
    };

    const createPDF = (data) => {
        if (!data || !data.eventName) {
            console.error('Invalid data provided to createPDF');
            return;
        }
    
        const doc = new jsPDF();
    
        // Background color
        doc.setFillColor(255, 255, 255); // White background
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
    
        // Event Name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(30); // Increased font size
        doc.setTextColor(0, 51, 102); // Dark blue color
        const eventNameWidth = doc.getTextWidth(data.eventName);
        const eventNameX = (doc.internal.pageSize.width - eventNameWidth) / 2;
        doc.text(data.eventName, eventNameX, 40); 

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(20); // Increased font size
        doc.setTextColor(0, 102, 204); // Blue color
        doc.text(`On ${data.eventDate},`, 10, 60); 
    
        const descriptiveText = `The '${data.eventName}' took place at '${data.eventVenue}'. This event was designed to '${data.eventDescription}'. The venue provided a fitting backdrop, enhancing the experience for all participants. The event was successfully executed, making it a memorable occasion for everyone involved.`;
        doc.setFontSize(18); // Increased font size
        doc.setTextColor(0, 0, 0); // Black color
        doc.text(descriptiveText, 10, 80, { maxWidth: 180, lineHeightFactor: 1.5 }); // Increased line height for more space
    
        if (data.eventImage) {
            doc.setFontSize(16); // Increased font size
            doc.setTextColor(0, 0, 0); // Black color
            doc.text(`Event Image URL: ${data.eventImage}`, 10, 140, { maxWidth: 180, lineHeightFactor: 1.5 }); // Increased line height for more space
        }
    
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

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', color: '#343a40' }}>Event Report Generator</h1>

            <div style={{ padding: '30px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Name</label>
                    <input 
                        type="text" 
                        name="eventName" 
                        value={data.eventName} 
                        placeholder='Event Name' 
                        onChange={handleChange} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', transition: 'all 0.3s ease' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Date</label>
                    <input 
                        type="text" 
                        name="eventDate" 
                        value={data.eventDate} 
                        placeholder='DD-MM-YYYY' 
                        onChange={handleChange} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', transition: 'all 0.3s ease' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Venue</label>
                    <input 
                        type="text" 
                        name="eventVenue" 
                        value={data.eventVenue} 
                        placeholder='Event Venue' 
                        onChange={handleChange} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', transition: 'all 0.3s ease' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Description</label>
                    <textarea 
                        name="eventDescription" 
                        value={data.eventDescription} 
                        placeholder='Brief Description of the Event' 
                        onChange={handleChange}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', transition: 'all 0.3s ease' }}
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
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', transition: 'all 0.3s ease' }}
                    />
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button 
                    style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px', transition: 'all 0.3s ease' }} 
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                <button 
                    style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px', transition: 'all 0.3s ease' }} 
                    onClick={fetchReport}
                >
                    Fetch
                </button>
                <button 
                    style={{ backgroundColor: '#fd7e14', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px', transition: 'all 0.3s ease' }} 
                    onClick={handleUpdate}
                >
                    Update
                </button>
                <button 
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px', transition: 'all 0.3s ease' }} 
                    onClick={() => handleDelete(data.id)}
                >
                    Delete
                </button>
                <button 
                    style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px', transition: 'all 0.3s ease' }} 
                    onClick={handleCreateReport}
                >
                    {loading ? 'Creating PDF...' : 'Create Report'}
                </button>
            </div>

            {showData && (
                <div style={{ marginTop: '20px' }}>
                    <h2 style={{ textAlign: 'center', color: '#343a40' }}>Reports List</h2>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {allReport.map(report => (
                            <li 
                                key={report._id} 
                                style={{ padding: '10px', borderBottom: '1px solid #ced4da', transition: 'background-color 0.3s ease', cursor: 'pointer', backgroundColor: selectedData && selectedData._id === report._id ? '#e9ecef' : '#ffffff' }} 
                                onClick={() => handleValue(report)}
                            >
                                <h3>{report.eventName}</h3>
                                <p>Date: {report.eventDate}</p>
                                <p>Venue: {report.eventVenue}</p>
                                <p>Description: {report.eventDescription}</p>
                                <p>Image URL: {report.eventImage}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;

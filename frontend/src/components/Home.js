import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation
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
            // Optionally, refresh the list after submission
            //fetchReport();
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
        const doc = new jsPDF();
        
        const eventNameFontSize = 20;
        const detailFontSize = 16;
        const verticalOffset = 40;
        const pageWidth = doc.internal.pageSize.width;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(eventNameFontSize);
        const eventNameWidth = doc.getTextWidth(data.eventName);
        const eventNameX = (pageWidth - eventNameWidth) / 2;
        doc.text(data.eventName, eventNameX, verticalOffset);

        const detailOffset = verticalOffset + 30;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(detailFontSize);
        doc.text(`On ${data.eventDate},`, 14, detailOffset);

        const descriptiveText = `The '${data.eventName}' took place at '${data.eventVenue}'. This event was designed to '${data.eventDescription}'. The venue provided a fitting backdrop, enhancing the experience for all participants. The event was successfully executed, making it a memorable occasion for everyone involved.`;

        const descriptiveTextOffset = detailOffset + 20;
        doc.text(descriptiveText, 14, descriptiveTextOffset, { maxWidth: 180 });

        if (data.eventImage) {
            const base64StringOffset = descriptiveTextOffset + 40;
            doc.setFontSize(10);
            doc.text(`Event Image URL: ${data.eventImage}`, 14, base64StringOffset, { maxWidth: 180 });
        }

        doc.save(`${data.eventName}_report.pdf`);
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', color: '#343a40' }}>Event Report Generator</h1>

            <div style={{ padding: '30px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Name</label>
                    <input 
                        type="text" 
                        name="eventName" 
                        value={data.eventName} 
                        placeholder='Event Name' 
                        onChange={handleChange} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Date</label>
                    <input 
                        type="text" 
                        name="eventDate" 
                        value={data.eventDate} 
                        placeholder='YYYY-MM-DD' 
                        onChange={handleChange} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
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
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', marginRight: '10px' }}>
                    <label>Description</label>
                    <textarea 
                        name="eventDescription" 
                        value={data.eventDescription} 
                        placeholder='Brief Description of the Event' 
                        onChange={handleChange}
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
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button 
                    style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px' }} 
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                <button 
                    style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px' }} 
                    onClick={fetchReport}
                >
                    Fetch
                </button>
                <button 
                    style={{ backgroundColor: '#fd7e14', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px' }} 
                    onClick={handleUpdate}
                >
                    Update
                </button>
            </div>

            {showData && (
                <div style={{ padding: '10px' }}>
                    {allReport.map((element, i) => (
                        <div 
                            className='border border-primary col-md-12 my-2' 
                            key={i} 
                            style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}
                        >
                            <div onClick={() => handleValue(element)}>
                                <h2 style={{ color: '#343a40' }}>{element.eventName}</h2>
                                <p>
                                    <b>Venue:</b> {element.eventVenue} <span style={{ marginRight: '20px' }}></span>
                                    <b>Date:</b> {element.eventDate} <span style={{ marginRight: '20px' }}></span>
                                    <b>Description:</b> {element.eventDescription} <span style={{ marginRight: '20px' }}></span>
                                    <b>Image URL:</b> {element.eventImage}
                                </p>
                                <div style={{ textAlign: 'center' }}>
                                    <button 
                                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px' }} 
                                        onClick={() => handleDelete(element._id)}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        style={{ backgroundColor: '#20c997', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '0 10px' }} 
                                        onClick={() => createPDF(selectedData)}
                                    >
                                        Create Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, IconButton, Button, Paper } from '@mui/material';
const SmallButton = ({ tag, color, onClick }) => {
    return (
        <IconButton
            onClick={onClick}
            sx={{
                fontSize: '10px',
                backgroundColor: color,
                color: 'white',
                padding: '5px',
                borderRadius: '10px',
                margin: '0 4px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s',
                ':hover': {
                    backgroundColor: '#0A5CE8',
                },
            }}
        >
            {tag}
        </IconButton>
    );
};
const FeatureComponent = ({ feature, selectedLabel, handleSave, index }) => {
    const [open, setOpen] = useState(false);
    const [editedData, setEditedData] = useState(feature);
    const editOpen = () => {
        setOpen(!open);
    };
    const formRef = useRef(null);
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Get the original property type from prevData
        const originalType = typeof editedData.properties[name];

        // Convert the value based on the original property type
        const convertedValue = originalType === "number" ? Number(value) : String(value);

        setEditedData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                [name]: convertedValue,
            },
        }));
    };
    return (
        <Paper elevation={3} style={{ padding: '15px', marginBottom: '10px' }}>
            <p style={{ marginBottom: '5px' }}>{selectedLabel}: {feature.properties[selectedLabel]}</p>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {Object.keys(feature.properties).map((property) => (
                    property !== selectedLabel && (
                        <p key={property} style={{ marginRight: '10px', marginBottom: '5px' }}>
                            {property}: {feature.properties[property]}
                        </p>
                    )
                ))}
            </div>
            <div style={{ textAlign: 'right' }}>
                <SmallButton color="green" tag="EDIT" onClick={() => editOpen()}></SmallButton>
            </div>
            {open && (<div>
                <h3>Edit Properties</h3>
                <form ref={formRef}>
                    {Object.entries(editedData.properties).map(([key, value]) => (
                        <div key={key}>
                            <label htmlFor={key}>{key}:</label>
                            <input
                                type="text"
                                id={key}
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}
                </form>
                <SmallButton color="green" tag="SAVE" onClick={() => {
                    handleSave(editedData, index)
                    editOpen()
                }}>Save</SmallButton>

            </div>)}

        </Paper>
    )
};
const DataEditPanel = ({ geojsonData, onSave, features, panelClose }) => {
    const [selectedLabel, setSelectedLabel] = useState("None");
    const formRef = useRef(null);
    const [query, setQuery] = useState("");

    const handleSave = (editedData, featureIndex) => {
        console.log("editedData: ", editedData);
        console.log("editedData.id: ", editedData.id);

        const updatedGeojsonData = { ...geojsonData };
        updatedGeojsonData.features[featureIndex].properties = {
            ...updatedGeojsonData.features[featureIndex].properties,
            ...editedData.properties,
        };
        console.log("Saving following: ", updatedGeojsonData);
        onSave(updatedGeojsonData);
    };

    const handleReferenceLabSelect = (value) => {
        setSelectedLabel(value);
    }
    const handleInput = (e) => {
        setQuery(e.target.value);
    }
    return (
        <div>
            <Autocomplete
                value={selectedLabel}
                onChange={(e, value) => handleReferenceLabSelect(value)}
                options={['None', ...features.map((feature) => feature.name)]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Reference Label"
                        size="small"
                        fullWidth
                    />
                )}
                style={{ minWidth: '200px', flex: 1 }}
            />

            <TextField
                label="Search"
                value={query}
                onChange={handleInput}
                fullWidth
                size="small"
                margin="normal"
                style={{ minWidth: '200px', marginRight: '8px' }}
            />
            <Button variant="contained" sx={{
                borderRadius: '10px',
                backgroundColor: '#0844A4', // Replace with your desired color
                color: 'white', // Text color
                marginTop: '10px',
                marginLeft: '10px',
                marginBottom: '10px',
            }} onClick={panelClose}>
                Cancel
            </Button>
            {(selectedLabel !== "None") && geojsonData.features.map((feature, index) => {
                const labelValue = feature.properties[selectedLabel];

                if ((typeof labelValue === 'string' && labelValue.includes(query)) || (typeof labelValue === 'number' && labelValue.toString().includes(query)) || query === "") {
                    return (
                        <FeatureComponent
                            key={index}
                            index={index}
                            feature={feature}
                            selectedLabel={selectedLabel}
                            handleSave={handleSave}
                        />
                    );
                } else {
                    return null; // Skip rendering for this feature
                }
            })}

            {/* {editedData && (
                <div>
                    <h3>Edit Properties</h3>
                    <form ref={formRef}>
                        {Object.entries(editedData.properties).map(([key, value]) => (
                            <div key={key}>
                                <label htmlFor={key}>{key}:</label>
                                <input
                                    type="text"
                                    id={key}
                                    name={key}
                                    value={value}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                    </form>
                    <button onClick={handleSave}>Save</button>

                </div>
            )} */}
        </div>
    );
};

export default DataEditPanel;
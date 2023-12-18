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
    return(
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
        {open && (                <div>
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
  )};
const DataEditPanel = ({ geojsonData, onSave, features, panelClose }) => {
    // const [editedData, setEditedData] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState("None");
    // const [initialScrollPosition, setInitialScrollPosition] = useState(0);
    const formRef = useRef(null);
    // const handleEdit = (feature) => {
    //     setEditedData({ ...feature });
    //     setInitialScrollPosition(window.scrollY);
    // };
    // useEffect(() => {
    //     if (editedData) {
    //         formRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // }, [editedData]);

    const handleSave = (editedData, featureIndex) => {
        console.log("editedData: ", editedData);
        console.log("editedData.id: ", editedData.id);
    
        // Create a copy of the original geojsonData to avoid mutating the state directly
        const updatedGeojsonData = { ...geojsonData };
    
        // Update the properties of the corresponding feature
        updatedGeojsonData.features[featureIndex].properties = {
            ...updatedGeojsonData.features[featureIndex].properties,
            ...editedData.properties,
        };
    
        // Call onSave with the updated geojsonData
        console.log("Saving following: ", updatedGeojsonData);
        onSave(updatedGeojsonData);
    
        // Reset the state
        // setEditedData(null);
        // window.scrollTo({
        //     top: initialScrollPosition,
        //     behavior: 'smooth',
        // });
    };
    // const compareLabels = (labelA, labelB) => {
    //     // Compare labels for sorting
    //     return labelA.localeCompare(labelB);
    // };
    // const sortProperties = (properties) => {
    //     // Separate properties into string and numeric arrays
    //     const stringProperties = [];
    //     const numericProperties = [];

    //     for (const property in properties) {
    //         if (typeof properties[property] === 'string') {
    //             stringProperties.push({ label: property, value: properties[property] });
    //         } else if (typeof properties[property] === 'number') {
    //             numericProperties.push({ label: property, value: properties[property] });
    //         }
    //     }

    //     // Sort string properties alphabetically
    //     stringProperties.sort((a, b) => compareLabels(a.label, b.label));

    //     // Sort numeric properties numerically
    //     numericProperties.sort((a, b) => a.value - b.value);

    //     // Concatenate and return the sorted properties
    //     return stringProperties.concat(numericProperties);
    // };
    const handleReferenceLabSelect = (value) => {
        setSelectedLabel(value);
    }
    return (
        <div>
            <Autocomplete
                value={selectedLabel}
                onChange={(e, value) => handleReferenceLabSelect(value)}
                options={[
                    'None',
                    ...features.map((feature) => feature.name)
                ]}
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
            {(selectedLabel !== "None") && geojsonData.features.map((feature, index) => (
                <FeatureComponent
                    key={index}
                    index={index}
                    feature={feature}
                    selectedLabel={selectedLabel}
                    handleSave={handleSave}
                />
            ))}

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
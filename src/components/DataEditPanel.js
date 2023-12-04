import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField } from '@mui/material';

const DataEditPanel = ({ geojsonData, onSave, features, panelClose }) => {
    const [editedData, setEditedData] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState("None");
    const [initialScrollPosition, setInitialScrollPosition] = useState(0);
    const formRef = useRef(null);
    const handleEdit = (feature) => {
        setEditedData({ ...feature });
        setInitialScrollPosition(window.scrollY);
    };
    useEffect(() => {
        if (editedData) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [editedData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                [name]: value,
            },
        }));
    };

const handleSave = () => {
  // Find the index of the edited feature in geojsonData
  const featureIndex = geojsonData.features.findIndex(
    (feature) => feature.id === editedData.id
  );

  // Create a copy of the original geojsonData to avoid mutating the state directly
  const updatedGeojsonData = { ...geojsonData };

  // Update the properties of the corresponding feature
  updatedGeojsonData.features[featureIndex].properties = {
    ...updatedGeojsonData.features[featureIndex].properties,
    ...editedData.properties,
  };

  // Call onSave with the updated geojsonData
  onSave(updatedGeojsonData);

  // Reset the state
  setEditedData(null);
  window.scrollTo({
    top: initialScrollPosition,
    behavior: 'smooth',
  });
};

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
            <button onClick={panelClose}>Cancel</button>
            {(selectedLabel!=="None") && geojsonData.features.map((feature) => (
                <div key={feature.id}>
                    <p>{feature.properties[selectedLabel]}</p>
                    <button onClick={() => handleEdit(feature)}>Edit</button>
                </div>
            ))}

            {editedData && (
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
            )}
        </div>
    );
};

export default DataEditPanel;
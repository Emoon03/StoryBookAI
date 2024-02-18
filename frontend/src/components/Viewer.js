import React, { useState, useEffect } from 'react';
import './Viewer.css'; // Make sure to create Viewer.css in the same directory

const Viewer = () => {
  const [currentSection, setCurrentSection] = useState(0);

  // Change to useEffect if you are fetching real data
  useEffect(() => {
    // Load your data here in a real app
  }, []);

  const goToNextSection = () => {
    setCurrentSection((prevSection) => Math.min(prevSection + 1, sections.length - 1));
  };

  const goToPreviousSection = () => {
    setCurrentSection((prevSection) => Math.max(prevSection - 1, 0));
  };

  return (
    <div className="viewer">
      <div className="navigation">
        <button onClick={goToPreviousSection}>&lt; Previous</button>
        <button onClick={goToNextSection}>Next &gt;</button>
      </div>
      <div className="content">
        {sections[currentSection].images.map((image, index) => (
          <img key={index} src={image} alt={`Section ${sections[currentSection].sectionId} Image ${index + 1}`} />
        ))}
        <audio controls src={sections[currentSection].sound} autoPlay>
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default Viewer;

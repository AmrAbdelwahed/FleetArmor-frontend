import React, { useState } from 'react';
import '@/assets/LoginSignup.css';
import '@/assets/navbar.css';
import { TextField, Snackbar, Alert, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import DialpadTwoToneIcon from '@mui/icons-material/DialpadTwoTone';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InfoIcon from '@mui/icons-material/Info';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Navbar from './Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const specialtyOptions = {
  'A': {
    label: 'Management & Operations',
    subcategories: [
      'Fleet Manager',
      'Fleet Supervisor',
      'Fleet Operations Manager',
      'Fleet Maintenance Manager',
      'Fleet Safety and Training Manager',
      'Logistics Coordinator',
      'Project Manager'
    ]
  },
  'B': {
    label: 'Technical & Maintenance Jobs',
    subcategories: [
      'Fleet Technician',
      'Heavy Duty Mechanic',
      'Apprentice Mechanic',
      'Fleet Administrator',
      'Purchasing Agent/Supplier Manager',
      'Fleet Mechanic / Diesel Technician',
      'Fleet Supervisor/Dispatcher',
      'Fleet Washer/Yard Helper'
    ]
  },
  'C': {
    label: 'Snow & Wind Services',
    subcategories: [
      'Snow Plow Operator',
      'Wind/Storm Response Crew'
    ]
  },
  'D': {
    label: 'Fleet Vehicle Operator Roles',
    subcategories: [
      'DT (Dump Truck Operator)',
      'SW (Sweeper Truck Operator)',
      'RO (Roll-Off Truck Operator)',
      'WT (Water Truck Operator)',
      'FT (Fuel Truck Operator)'
    ]
  },
  'E': {
    label: 'Fleet Drivers & Other Support Jobs',
    subcategories: [
      'Lowboy Truck Driver',
      'Loader Operator (Fleet Yard)',
      'GPS/Telematics Technician'
    ]
  }
};

const FleetWorkersForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    specialtyCategory: '',
    specialtySubcategory: '',
    yearsOfExperience: '',
    cdlLicense: '',
    details: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone format';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.specialtyCategory) newErrors.specialtyCategory = 'Specialty category is required';
    if (!formData.specialtySubcategory) newErrors.specialtySubcategory = 'Specialty subcategory is required';
    if (!formData.yearsOfExperience.trim()) newErrors.yearsOfExperience = 'Years of experience is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset subcategory when category changes
    if (name === 'specialtyCategory') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        specialtySubcategory: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/submit-fleet-worker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Fleet worker form submitted successfully!',
          severity: 'success',
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          city: '',
          specialtyCategory: '',
          specialtySubcategory: '',
          yearsOfExperience: '',
          cdlLicense: '',
          details: '',
        });
      } else {
        throw new Error(data.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An unexpected error occurred',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container" style={{ backgroundColor: 'rgb(255, 255, 255)', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      <div className="container-form">
        <div className="header">
          <div className="text" style={{ color: '#b35c0d' }}>Fleet Worker Application</div>
        </div>
        <div className="inputs">
          {[ 
            { icon: AccountCircleIcon, name: 'firstName', placeholder: 'First Name' },
            { icon: AccountCircleIcon, name: 'lastName', placeholder: 'Last Name' },
            { icon: EmailIcon, name: 'email', placeholder: 'Your Email Address', type: 'email' },
            { icon: DialpadTwoToneIcon, name: 'phone', placeholder: 'Phone Number', type: 'tel' },
            { icon: LocationCityIcon, name: 'city', placeholder: 'Your City' },
          ].map(({ icon: Icon, name, placeholder, type = 'text' }) => (
            <div className="input" key={name}>
              <Icon style={{ margin: '0px 30px', color: '#555' }} />
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && <p className="error" style={{ color: 'red' }}>{errors[name]}</p>}
            </div>
          ))}

          {/* Specialty Category Dropdown */}
          <div className="input">
            <LocalShippingIcon style={{ margin: '0px 30px', color: '#555' }} />
            <FormControl fullWidth variant="outlined" style={{ marginLeft: '10px' }}>
              <InputLabel id="specialty-category-label" style={{ color: '#555' }}>
                Your Fleet Specialty Category
              </InputLabel>
              <Select
                labelId="specialty-category-label"
                name="specialtyCategory"
                value={formData.specialtyCategory}
                onChange={handleChange}
                label="Your Fleet Specialty Category"
                style={{
                  backgroundColor: 'transparent',
                  color: '#797979',
                  fontSize: '19px',
                }}
              >
                {Object.entries(specialtyOptions).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {key} - {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.specialtyCategory && <p className="error" style={{ color: 'red' }}>{errors.specialtyCategory}</p>}
          </div>

          {/* Specialty Subcategory Dropdown */}
          {formData.specialtyCategory && (
            <div className="input">
              <LocalShippingIcon style={{ margin: '0px 30px', color: '#555' }} />
              <FormControl fullWidth variant="outlined" style={{ marginLeft: '10px' }}>
                <InputLabel id="specialty-subcategory-label" style={{ color: '#555' }}>
                  Specific Fleet Role
                </InputLabel>
                <Select
                  labelId="specialty-subcategory-label"
                  name="specialtySubcategory"
                  value={formData.specialtySubcategory}
                  onChange={handleChange}
                  label="Specific Fleet Role"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#797979',
                    fontSize: '19px',
                  }}
                >
                  {specialtyOptions[formData.specialtyCategory]?.subcategories.map((subcategory, index) => (
                    <MenuItem key={index} value={subcategory}>
                      {subcategory}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.specialtySubcategory && <p className="error" style={{ color: 'red' }}>{errors.specialtySubcategory}</p>}
            </div>
          )}

          {/* Years of Experience */}
          <div className="input">
            <InfoIcon style={{ margin: '0px 30px', color: '#555' }} />
            <input
              type="text"
              name="yearsOfExperience"
              placeholder="Years of Experience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
            />
            {errors.yearsOfExperience && <p className="error" style={{ color: 'red' }}>{errors.yearsOfExperience}</p>}
          </div>

          {/* CDL License */}
          <div className="input">
            <InfoIcon style={{ margin: '0px 30px', color: '#555' }} />
            <input
              type="text"
              name="cdlLicense"
              placeholder="CDL License Type (if applicable)"
              value={formData.cdlLicense}
              onChange={handleChange}
            />
          </div>

          <div className="input-container">
            <div className="input">
              <TextField
                label="Additional Details (please include your availability)"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                name="details"
                value={formData.details}
                onChange={handleChange}
                InputProps={{
                  style: {
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#797979',
                    fontSize: '19px',
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: '#555',
                  },
                }}
              />
              {errors.details && (
                <p
                  className="error"
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '0',
                    color: 'red',
                    margin: 0,
                    textAlign: 'right',
                  }}
                >
                  {errors.details}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="submit-container">
          <button className="submit" onClick={handleSubmit} style={{ backgroundColor: '#b35c0d' }}>
            Submit
            {loading && <CircularProgress size={20} style={{ marginLeft: '10px', color: '#fff' }} />}
          </button>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FleetWorkersForm;
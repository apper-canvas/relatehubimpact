import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { toast } from 'react-toastify';

function CompanyModal({ isOpen, onClose, company, onSave }) {
  const [formData, setFormData] = useState({
    name_c: '',
    industry_c: '',
    website_c: '',
    email_c: '',
    phone_c: '',
    address_c: '',
    employees_c: '',
    revenue_c: '',
    description_c: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Construction',
    'Transportation',
    'Energy',
    'Media',
    'Food & Beverage',
    'Real Estate',
    'Consulting',
    'Other'
  ];

  useEffect(() => {
    if (company) {
      setFormData({
        name_c: company.name_c || '',
        industry_c: company.industry_c || '',
        website_c: company.website_c || '',
        email_c: company.email_c || '',
        phone_c: company.phone_c || '',
        address_c: company.address_c || '',
        employees_c: company.employees_c || '',
        revenue_c: company.revenue_c || '',
        description_c: company.description_c || ''
      });
    } else {
      setFormData({
        name_c: '',
        industry_c: '',
        website_c: '',
        email_c: '',
        phone_c: '',
        address_c: '',
        employees_c: '',
        revenue_c: '',
        description_c: ''
      });
    }
    setErrors({});
  }, [company, isOpen]);

  function validateForm() {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = 'Company name is required';
    }

    if (formData.email_c && !/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = 'Please enter a valid email address';
    }

    if (formData.website_c && !formData.website_c.startsWith('http')) {
      newErrors.website_c = 'Website must start with http:// or https://';
    }

    if (formData.employees_c && (isNaN(formData.employees_c) || parseInt(formData.employees_c) < 0)) {
      newErrors.employees_c = 'Employees must be a positive number';
    }

    if (formData.revenue_c && (isNaN(formData.revenue_c) || parseFloat(formData.revenue_c) < 0)) {
      newErrors.revenue_c = 'Revenue must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    try {
      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        employees_c: formData.employees_c ? parseInt(formData.employees_c) : 0,
        revenue_c: formData.revenue_c ? parseFloat(formData.revenue_c) : 0
      };
      
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving company:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {company ? 'Edit Company' : 'Add Company'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Company Name"
                    required
                    error={errors.name_c}
                    className="md:col-span-2"
                  >
                    <input
                      type="text"
                      value={formData.name_c}
                      onChange={(e) => handleChange('name_c', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </FormField>

                  <FormField label="Industry" error={errors.industry_c}>
                    <select
                      value={formData.industry_c}
                      onChange={(e) => handleChange('industry_c', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Website" error={errors.website_c}>
                    <input
                      type="url"
                      value={formData.website_c}
                      onChange={(e) => handleChange('website_c', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://company.com"
                    />
                  </FormField>

                  <FormField label="Email" error={errors.email_c}>
                    <input
                      type="email"
                      value={formData.email_c}
                      onChange={(e) => handleChange('email_c', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="contact@company.com"
                    />
                  </FormField>

                  <FormField label="Phone" error={errors.phone_c}>
                    <input
                      type="tel"
                      value={formData.phone_c}
                      onChange={(e) => handleChange('phone_c', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </FormField>

                  <FormField label="Employees" error={errors.employees_c}>
                    <input
                      type="number"
                      min="0"
                      value={formData.employees_c}
                      onChange={(e) => handleChange('employees_c', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0"
                    />
                  </FormField>

                  <FormField label="Annual Revenue" error={errors.revenue_c}>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.revenue_c}
                      onChange={(e) => handleChange('revenue_c', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0"
                    />
                  </FormField>
                </div>

                <FormField label="Address" error={errors.address_c}>
                  <input
                    type="text"
                    value={formData.address_c}
                    onChange={(e) => handleChange('address_c', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Company address"
                  />
                </FormField>

                <FormField label="Description" error={errors.description_c}>
                  <textarea
                    value={formData.description_c}
                    onChange={(e) => handleChange('description_c', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Company description"
                  />
                </FormField>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Check" className="h-4 w-4" />
                    <span>{company ? 'Update' : 'Create'} Company</span>
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CompanyModal;
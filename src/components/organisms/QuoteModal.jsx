import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { toast } from 'react-toastify';
import { contactService } from '@/services/api/contactService';
import { dealService } from '@/services/api/dealService';

const QuoteModal = ({ isOpen, onClose, quote, onSave }) => {
  const [formData, setFormData] = useState({
    company_c: '',
    contact_id_c: null,
    deal_id_c: null,
    quote_date_c: '',
    status_c: 'Draft',
    delivery_method_c: 'Email',
    expires_on_c: '',
    billing_name_c: '',
    billing_street_c: '',
    billing_city_c: '',
    billing_state_c: '',
    billing_country_c: '',
    billing_pincode_c: '',
    shipping_name_c: '',
    shipping_street_c: '',
    shipping_city_c: '',
    shipping_state_c: '',
    shipping_country_c: '',
    shipping_pincode_c: ''
  });
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadContacts();
      loadDeals();
      if (quote) {
        setFormData({
          company_c: quote.company_c || '',
          contact_id_c: quote.contact_id_c || null,
          deal_id_c: quote.deal_id_c || null,
          quote_date_c: quote.quote_date_c || '',
          status_c: quote.status_c || 'Draft',
          delivery_method_c: quote.delivery_method_c || 'Email',
          expires_on_c: quote.expires_on_c || '',
          billing_name_c: quote.billing_name_c || '',
          billing_street_c: quote.billing_street_c || '',
          billing_city_c: quote.billing_city_c || '',
          billing_state_c: quote.billing_state_c || '',
          billing_country_c: quote.billing_country_c || '',
          billing_pincode_c: quote.billing_pincode_c || '',
          shipping_name_c: quote.shipping_name_c || '',
          shipping_street_c: quote.shipping_street_c || '',
          shipping_city_c: quote.shipping_city_c || '',
          shipping_state_c: quote.shipping_state_c || '',
          shipping_country_c: quote.shipping_country_c || '',
          shipping_pincode_c: quote.shipping_pincode_c || ''
        });
      } else {
        // Reset form for new quote
        setFormData({
          company_c: '',
          contact_id_c: null,
          deal_id_c: null,
          quote_date_c: new Date().toISOString().split('T')[0],
          status_c: 'Draft',
          delivery_method_c: 'Email',
          expires_on_c: '',
          billing_name_c: '',
          billing_street_c: '',
          billing_city_c: '',
          billing_state_c: '',
          billing_country_c: '',
          billing_pincode_c: '',
          shipping_name_c: '',
          shipping_street_c: '',
          shipping_city_c: '',
          shipping_state_c: '',
          shipping_country_c: '',
          shipping_pincode_c: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, quote]);

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    }
  };

  const loadDeals = async () => {
    try {
      const data = await dealService.getAll();
      setDeals(data);
    } catch (error) {
      console.error('Error loading deals:', error);
      toast.error('Failed to load deals');
    }
  };

  const validateForm = () => {
const newErrors = {};

    if (!formData.company_c?.trim()) {
      newErrors.company_c = 'Company is required';
    }

    if (!formData.quote_date_c) {
      newErrors.quote_date_c = 'Quote date is required';
    }

    if (!formData.status_c) {
      newErrors.status_c = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving quote:', error);
      toast.error('Failed to save quote');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shipping_name_c: prev.billing_name_c,
      shipping_street_c: prev.billing_street_c,
      shipping_city_c: prev.billing_city_c,
      shipping_state_c: prev.billing_state_c,
      shipping_country_c: prev.billing_country_c,
      shipping_pincode_c: prev.billing_pincode_c
    }));
  };

  const contactOptions = contacts.map(contact => ({
    value: contact.Id,
    label: contact.name_c || contact.Name || `Contact ${contact.Id}`
  }));

  const dealOptions = deals.map(deal => ({
    value: deal.Id,
    label: deal.title_c || deal.Name || `Deal ${deal.Id}`
  }));

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Sent', label: 'Sent' },
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  const deliveryOptions = [
    { value: 'Email', label: 'Email' },
    { value: 'Post', label: 'Post' },
    { value: 'In Person', label: 'In Person' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {quote ? 'Edit Quote' : 'Create Quote'}
              </h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Company"
                    type="text"
                    value={formData.company_c}
                    onChange={(value) => handleChange('company_c', value)}
                    error={errors.company_c}
                    required
                  />
                  <FormField
                    label="Contact"
                    type="select"
                    value={formData.contact_id_c?.Id || formData.contact_id_c || ''}
                    onChange={(value) => handleChange('contact_id_c', parseInt(value) || null)}
                    options={[{ value: '', label: 'Select Contact' }, ...contactOptions]}
                    error={errors.contact_id_c}
                  />
                  <FormField
                    label="Deal"
                    type="select"
                    value={formData.deal_id_c?.Id || formData.deal_id_c || ''}
                    onChange={(value) => handleChange('deal_id_c', parseInt(value) || null)}
                    options={[{ value: '', label: 'Select Deal' }, ...dealOptions]}
                    error={errors.deal_id_c}
                  />
                  <FormField
                    label="Quote Date"
                    type="date"
                    value={formData.quote_date_c}
                    onChange={(value) => handleChange('quote_date_c', value)}
                    error={errors.quote_date_c}
                    required
                  />
                  <FormField
                    label="Status"
                    type="select"
                    value={formData.status_c}
                    onChange={(value) => handleChange('status_c', value)}
                    options={statusOptions}
                    error={errors.status_c}
                    required
                  />
                  <FormField
                    label="Delivery Method"
                    type="select"
                    value={formData.delivery_method_c}
                    onChange={(value) => handleChange('delivery_method_c', value)}
                    options={deliveryOptions}
                    error={errors.delivery_method_c}
                  />
                  <FormField
                    label="Expires On"
                    type="date"
                    value={formData.expires_on_c}
                    onChange={(value) => handleChange('expires_on_c', value)}
                    error={errors.expires_on_c}
                  />
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Billing Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Bill To Name"
                      type="text"
                      value={formData.billing_name_c}
                      onChange={(value) => handleChange('billing_name_c', value)}
                      error={errors.billing_name_c}
                    />
                    <FormField
                      label="Street"
                      type="text"
                      value={formData.billing_street_c}
                      onChange={(value) => handleChange('billing_street_c', value)}
                      error={errors.billing_street_c}
                    />
                    <FormField
                      label="City"
                      type="text"
                      value={formData.billing_city_c}
                      onChange={(value) => handleChange('billing_city_c', value)}
                      error={errors.billing_city_c}
                    />
                    <FormField
                      label="State"
                      type="text"
                      value={formData.billing_state_c}
                      onChange={(value) => handleChange('billing_state_c', value)}
                      error={errors.billing_state_c}
                    />
                    <FormField
                      label="Country"
                      type="text"
                      value={formData.billing_country_c}
                      onChange={(value) => handleChange('billing_country_c', value)}
                      error={errors.billing_country_c}
                    />
                    <FormField
                      label="Pincode"
                      type="text"
                      value={formData.billing_pincode_c}
                      onChange={(value) => handleChange('billing_pincode_c', value)}
                      error={errors.billing_pincode_c}
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Shipping Address
                    </h3>
                    <Button
                      type="button"
                      onClick={copyBillingToShipping}
                      variant="ghost"
                      size="sm"
                      className="text-sm"
                    >
                      <ApperIcon name="Copy" className="h-4 w-4 mr-2" />
                      Copy from Billing
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Ship To Name"
                      type="text"
                      value={formData.shipping_name_c}
                      onChange={(value) => handleChange('shipping_name_c', value)}
                      error={errors.shipping_name_c}
                    />
                    <FormField
                      label="Street"
                      type="text"
                      value={formData.shipping_street_c}
                      onChange={(value) => handleChange('shipping_street_c', value)}
                      error={errors.shipping_street_c}
                    />
                    <FormField
                      label="City"
                      type="text"
                      value={formData.shipping_city_c}
                      onChange={(value) => handleChange('shipping_city_c', value)}
                      error={errors.shipping_city_c}
                    />
                    <FormField
                      label="State"
                      type="text"
                      value={formData.shipping_state_c}
                      onChange={(value) => handleChange('shipping_state_c', value)}
                      error={errors.shipping_state_c}
                    />
                    <FormField
                      label="Country"
                      type="text"
                      value={formData.shipping_country_c}
                      onChange={(value) => handleChange('shipping_country_c', value)}
                      error={errors.shipping_country_c}
                    />
                    <FormField
                      label="Pincode"
                      type="text"
                      value={formData.shipping_pincode_c}
                      onChange={(value) => handleChange('shipping_pincode_c', value)}
                      error={errors.shipping_pincode_c}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                >
                  {quote ? 'Update Quote' : 'Create Quote'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
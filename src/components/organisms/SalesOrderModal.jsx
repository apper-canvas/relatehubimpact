import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { toast } from 'react-toastify';
import { contactService } from '@/services/api/contactService';
import { dealService } from '@/services/api/dealService';
import { quoteService } from '@/services/api/quoteService';

const SalesOrderModal = ({ isOpen, onClose, salesOrder, onSave }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    contact_id_c: '',
    deal_id_c: '',
    quote_id_c: '',
    order_date_c: '',
    status_c: 'Draft',
    total_amount_c: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLookupData();
      if (salesOrder) {
        setFormData({
          name_c: salesOrder.name_c || '',
          contact_id_c: getDisplayValue(salesOrder.contact_id_c, 'lookup'),
          deal_id_c: getDisplayValue(salesOrder.deal_id_c, 'lookup'),
          quote_id_c: getDisplayValue(salesOrder.quote_id_c, 'lookup'),
          order_date_c: salesOrder.order_date_c || '',
          status_c: salesOrder.status_c || 'Draft',
          total_amount_c: salesOrder.total_amount_c || ''
        });
      } else {
        setFormData({
          name_c: '',
          contact_id_c: '',
          deal_id_c: '',
          quote_id_c: '',
          order_date_c: new Date().toISOString().split('T')[0],
          status_c: 'Draft',
          total_amount_c: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, salesOrder]);

  function getDisplayValue(value, fieldType = "text") {
    if (fieldType === "lookup") {
      if (typeof value === 'object' && value !== null) {
        return value.Id || '';
      }
      return value || '';
    }
    return value || '';
  }

  const loadLookupData = async () => {
    setLookupLoading(true);
    try {
      const [contactsData, dealsData, quotesData] = await Promise.all([
        loadContacts(),
        loadDeals(),
        loadQuotes()
      ]);
      setContacts(contactsData);
      setDeals(dealsData);
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error loading lookup data:', error);
      toast.error('Failed to load lookup data');
    } finally {
      setLookupLoading(false);
    }
  };

  async function loadContacts() {
    try {
      const data = await contactService.getAll();
      return data.map(contact => ({
        value: contact.Id.toString(),
        label: contact.name_c || contact.Name || `Contact ${contact.Id}`
      }));
    } catch (error) {
      console.error('Error loading contacts:', error);
      return [];
    }
  }

  async function loadDeals() {
    try {
      const data = await dealService.getAll();
      return data.map(deal => ({
        value: deal.Id.toString(),
        label: deal.title_c || deal.Name || `Deal ${deal.Id}`
      }));
    } catch (error) {
      console.error('Error loading deals:', error);
      return [];
    }
  }

  async function loadQuotes() {
    try {
      const data = await quoteService.getAll();
      return data.map(quote => ({
        value: quote.Id.toString(),
        label: quote.Name || `Quote ${quote.Id}`
      }));
    } catch (error) {
      console.error('Error loading quotes:', error);
      return [];
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name_c?.trim()) {
      newErrors.name_c = 'Name is required';
    }

    if (!formData.order_date_c) {
      newErrors.order_date_c = 'Order date is required';
    }

    if (!formData.status_c) {
      newErrors.status_c = 'Status is required';
    }

    if (formData.total_amount_c && isNaN(parseFloat(formData.total_amount_c))) {
      newErrors.total_amount_c = 'Total amount must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving sales order:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
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
  }

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {salesOrder ? 'Edit Sales Order' : 'Create Sales Order'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Name"
                  type="text"
                  value={formData.name_c}
                  onChange={(value) => handleChange('name_c', value)}
                  error={errors.name_c}
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
                  label="Contact"
                  type="select"
                  value={formData.contact_id_c}
                  onChange={(value) => handleChange('contact_id_c', value)}
                  options={contacts}
                  error={errors.contact_id_c}
                  loading={lookupLoading}
                />

                <FormField
                  label="Deal"
                  type="select"
                  value={formData.deal_id_c}
                  onChange={(value) => handleChange('deal_id_c', value)}
                  options={deals}
                  error={errors.deal_id_c}
                  loading={lookupLoading}
                />

                <FormField
                  label="Quote"
                  type="select"
                  value={formData.quote_id_c}
                  onChange={(value) => handleChange('quote_id_c', value)}
                  options={quotes}
                  error={errors.quote_id_c}
                  loading={lookupLoading}
                />

                <FormField
                  label="Order Date"
                  type="date"
                  value={formData.order_date_c}
                  onChange={(value) => handleChange('order_date_c', value)}
                  error={errors.order_date_c}
                  required
                />

                <div className="md:col-span-2">
                  <FormField
                    label="Total Amount"
                    type="number"
                    value={formData.total_amount_c}
                    onChange={(value) => handleChange('total_amount_c', value)}
                    error={errors.total_amount_c}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Save" size={16} />
                  {salesOrder ? 'Update' : 'Create'} Sales Order
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SalesOrderModal;
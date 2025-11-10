import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function CompanyDetailsModal({ isOpen, onClose, company }) {
  if (!company) return null;

  function formatCurrency(amount) {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatEmployees(count) {
    if (!count) return 'Not specified';
    return new Intl.NumberFormat('en-US').format(count);
  }

  function formatWebsite(url) {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://${url}`;
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
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Building2" className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {company.name_c}
                    </h2>
                    {company.industry_c && (
                      <p className="text-sm text-gray-600">{company.industry_c}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Name</label>
                      <p className="mt-1 text-sm text-gray-900">{company.name_c || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="mt-1 text-sm text-gray-900">{company.industry_c || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Employees</label>
                      <p className="mt-1 text-sm text-gray-900">{formatEmployees(company.employees_c)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Annual Revenue</label>
                      <p className="mt-1 text-sm text-gray-900">{formatCurrency(company.revenue_c)}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {company.email_c ? (
                          <a
                            href={`mailto:${company.email_c}`}
                            className="text-primary hover:underline"
                          >
                            {company.email_c}
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {company.phone_c ? (
                          <a
                            href={`tel:${company.phone_c}`}
                            className="text-primary hover:underline"
                          >
                            {company.phone_c}
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {company.website_c ? (
                          <a
                            href={formatWebsite(company.website_c)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center space-x-1"
                          >
                            <span>{company.website_c}</span>
                            <ApperIcon name="ExternalLink" className="h-3 w-3" />
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                {company.address_c && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Address</h3>
                    <p className="text-sm text-gray-900">{company.address_c}</p>
                  </div>
                )}

                {/* Description */}
                {company.description_c && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{company.description_c}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button onClick={onClose} variant="outline">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CompanyDetailsModal;
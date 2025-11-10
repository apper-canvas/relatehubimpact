import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function CompanyCard({ company, onView, onEdit, onDelete }) {
  function formatCurrency(amount) {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }

  function formatEmployees(count) {
    if (!count) return null;
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(count);
  }

  const employeeCount = formatEmployees(company.employees_c);
  const revenue = formatCurrency(company.revenue_c);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Building2" className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {company.name_c}
            </h3>
            {company.industry_c && (
              <p className="text-sm text-gray-500 truncate">{company.industry_c}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={() => onView(company)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
            title="View details"
          >
            <ApperIcon name="Eye" className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(company)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
            title="Edit company"
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(company.Id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete company"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Contact Info */}
        <div className="space-y-2">
          {company.email_c && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Mail" className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{company.email_c}</span>
            </div>
          )}
          {company.phone_c && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Phone" className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{company.phone_c}</span>
            </div>
          )}
          {company.website_c && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Globe" className="h-4 w-4 flex-shrink-0" />
              <a
                href={company.website_c.startsWith('http') ? company.website_c : `https://${company.website_c}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {company.website_c.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Company Stats */}
        {(employeeCount || revenue) && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {employeeCount && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <ApperIcon name="Users" className="h-4 w-4" />
                <span>{employeeCount} employees</span>
              </div>
            )}
            {revenue && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <ApperIcon name="DollarSign" className="h-4 w-4" />
                <span>{revenue} revenue</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {company.description_c && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2">
              {company.description_c}
            </p>
          </div>
        )}
      </div>

      {/* View Details Button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(company)}
          className="w-full"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
}

export default CompanyCard;
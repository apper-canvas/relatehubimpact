import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { companyService } from '@/services/api/companyService';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CompanyModal from '@/components/organisms/CompanyModal';
import CompanyDetailsModal from '@/components/organisms/CompanyDetailsModal';
import CompanyCard from '@/components/molecules/CompanyCard';
import SearchBar from '@/components/molecules/SearchBar';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Loading from '@/components/ui/Loading';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);

  async function loadCompanies() {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }

  function filterCompanies() {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter(company =>
      company.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email_c?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }

  function handleSearch(term) {
    setSearchTerm(term);
  }

  function handleAddCompany() {
    setSelectedCompany(null);
    setIsAddModalOpen(true);
  }

  function handleEditCompany(company) {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  }

  async function handleDeleteCompany(companyId) {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      await companyService.delete(companyId);
      await loadCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  }

  async function handleSaveCompany(companyData) {
    try {
      if (selectedCompany) {
        await companyService.update(selectedCompany.Id, companyData);
      } else {
        await companyService.create(companyData);
      }
      
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedCompany(null);
      await loadCompanies();
    } catch (error) {
      console.error('Error saving company:', error);
    }
  }

  function handleViewDetails(company) {
    setSelectedCompany(company);
    setIsDetailsModalOpen(true);
  }

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadCompanies}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage your company relationships and business partnerships
          </p>
        </div>
        <Button onClick={handleAddCompany} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Company</span>
        </Button>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search companies by name, industry, or email..."
        className="max-w-md"
      />

      {/* Companies Grid */}
      <AnimatePresence>
        {filteredCompanies.length === 0 ? (
          <Empty
            icon="Building2"
            title={searchTerm ? "No companies found" : "No companies yet"}
            description={
              searchTerm
                ? `No companies match "${searchTerm}". Try adjusting your search.`
                : "Get started by adding your first company."
            }
            action={
              !searchTerm && (
                <Button onClick={handleAddCompany} variant="outline">
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Add First Company
                </Button>
              )
            }
          />
        ) : (
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
              >
                <CompanyCard
                  company={company}
                  onView={() => handleViewDetails(company)}
                  onEdit={() => handleEditCompany(company)}
                  onDelete={() => handleDeleteCompany(company.Id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <CompanyModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCompany(null);
        }}
        company={null}
        onSave={handleSaveCompany}
      />

      <CompanyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onSave={handleSaveCompany}
      />

      <CompanyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
      />
    </div>
  );
}

export default Companies;
import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

// Mock data storage (in-memory)
let companies = [
  {
    Id: 1,
    name_c: "Acme Corporation",
    industry_c: "Technology",
    website_c: "https://acme.com",
    email_c: "contact@acme.com",
    phone_c: "+1 (555) 123-4567",
    address_c: "123 Tech Street, San Francisco, CA 94105",
    employees_c: 250,
    revenue_c: 15000000,
    description_c: "Leading technology solutions provider specializing in enterprise software and cloud services."
  },
  {
    Id: 2,
    name_c: "Global Industries Inc",
    industry_c: "Manufacturing",
    website_c: "https://globalind.com",
    email_c: "info@globalind.com",
    phone_c: "+1 (555) 234-5678",
    address_c: "456 Industrial Blvd, Detroit, MI 48201",
    employees_c: 1200,
    revenue_c: 85000000,
    description_c: "International manufacturing company with expertise in automotive and aerospace components."
  },
  {
    Id: 3,
    name_c: "Healthcare Partners",
    industry_c: "Healthcare",
    website_c: "https://healthpartners.com",
    email_c: "contact@healthpartners.com",
    phone_c: "+1 (555) 345-6789",
    address_c: "789 Medical Center Dr, Boston, MA 02115",
    employees_c: 500,
    revenue_c: 35000000,
    description_c: "Comprehensive healthcare services provider with multiple locations across the Northeast."
  },
  {
    Id: 4,
    name_c: "Financial Solutions LLC",
    industry_c: "Finance",
    website_c: "https://finsolutions.com",
    email_c: "info@finsolutions.com",
    phone_c: "+1 (555) 456-7890",
    address_c: "101 Wall Street, New York, NY 10005",
    employees_c: 180,
    revenue_c: 22000000,
    description_c: "Full-service financial consulting firm specializing in investment management and financial planning."
  },
  {
    Id: 5,
    name_c: "Green Energy Corp",
    industry_c: "Energy",
    website_c: "https://greenenergy.com",
    email_c: "contact@greenenergy.com",
    phone_c: "+1 (555) 567-8901",
    address_c: "555 Solar Way, Austin, TX 73301",
    employees_c: 320,
    revenue_c: 45000000,
    description_c: "Renewable energy company focused on solar and wind power solutions for commercial and residential clients."
  },
  {
    Id: 6,
    name_c: "Retail Masters",
    industry_c: "Retail",
    website_c: "https://retailmasters.com",
    email_c: "support@retailmasters.com",
    phone_c: "+1 (555) 678-9012",
    address_c: "222 Commerce Plaza, Chicago, IL 60601",
    employees_c: 850,
    revenue_c: 120000000,
    description_c: "National retail chain with focus on sustainable products and exceptional customer experience."
  },
  {
    Id: 7,
    name_c: "Construction Pro",
    industry_c: "Construction",
    website_c: "https://constructionpro.com",
    email_c: "projects@constructionpro.com",
    phone_c: "+1 (555) 789-0123",
    address_c: "888 Builder Ave, Phoenix, AZ 85001",
    employees_c: 650,
    revenue_c: 75000000,
    description_c: "Commercial construction company specializing in office buildings and industrial facilities."
  },
  {
    Id: 8,
    name_c: "Education First",
    industry_c: "Education",
    website_c: "https://educationfirst.com",
    email_c: "admin@educationfirst.com",
    phone_c: "+1 (555) 890-1234",
    address_c: "333 Learning Lane, Denver, CO 80201",
    employees_c: 420,
    revenue_c: 28000000,
    description_c: "Educational technology company providing innovative learning solutions for schools and universities."
  },
  {
    Id: 9,
    name_c: "Transport Solutions",
    industry_c: "Transportation",
    website_c: "https://transportsol.com",
    email_c: "logistics@transportsol.com",
    phone_c: "+1 (555) 901-2345",
    address_c: "777 Freight St, Atlanta, GA 30301",
    employees_c: 290,
    revenue_c: 38000000,
    description_c: "Comprehensive transportation and logistics services company serving the Southeast region."
  },
  {
    Id: 10,
    name_c: "Media Group Ltd",
    industry_c: "Media",
    website_c: "https://mediagroup.com",
    email_c: "contact@mediagroup.com",
    phone_c: "+1 (555) 012-3456",
    address_c: "444 Studio Blvd, Los Angeles, CA 90210",
    employees_c: 380,
    revenue_c: 52000000,
    description_c: "Full-service media production company specializing in digital content and advertising campaigns."
  },
  {
    Id: 11,
    name_c: "Food & Beverage Co",
    industry_c: "Food & Beverage",
    website_c: "https://foodbevco.com",
    email_c: "sales@foodbevco.com",
    phone_c: "+1 (555) 123-4500",
    address_c: "666 Taste Ave, Portland, OR 97201",
    employees_c: 720,
    revenue_c: 95000000,
    description_c: "Regional food and beverage distributor with focus on organic and locally-sourced products."
  },
  {
    Id: 12,
    name_c: "Tech Innovators",
    industry_c: "Technology",
    website_c: "https://techinnovators.com",
    email_c: "hello@techinnovators.com",
    phone_c: "+1 (555) 234-5600",
    address_c: "999 Innovation Dr, Seattle, WA 98101",
    employees_c: 145,
    revenue_c: 18000000,
    description_c: "Startup technology company developing AI-powered solutions for small and medium businesses."
  },
  {
    Id: 13,
    name_c: "Real Estate Holdings",
    industry_c: "Real Estate",
    website_c: "https://realestateholdings.com",
    email_c: "properties@realestateholdings.com",
    phone_c: "+1 (555) 345-6700",
    address_c: "111 Property Plaza, Miami, FL 33101",
    employees_c: 95,
    revenue_c: 42000000,
    description_c: "Commercial and residential real estate investment and management company serving South Florida."
  },
  {
    Id: 14,
    name_c: "Consulting Experts",
    industry_c: "Consulting",
    website_c: "https://consultingexperts.com",
    email_c: "solutions@consultingexperts.com",
    phone_c: "+1 (555) 456-7800",
    address_c: "555 Advisory St, Washington, DC 20001",
    employees_c: 125,
    revenue_c: 16000000,
    description_c: "Strategic business consulting firm helping organizations optimize operations and drive growth."
  },
  {
    Id: 15,
    name_c: "Manufacturing Plus",
    industry_c: "Manufacturing",
    website_c: "https://manufacturingplus.com",
    email_c: "operations@manufacturingplus.com",
    phone_c: "+1 (555) 567-8900",
    address_c: "777 Factory Rd, Cleveland, OH 44101",
    employees_c: 980,
    revenue_c: 135000000,
    description_c: "Advanced manufacturing company specializing in precision components for aerospace and defense industries."
  }
];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CompanyService {
  // Get all companies
  async getAll() {
    try {
      await delay(300); // Simulate API delay
      return [...companies]; // Return copy to prevent direct mutation
    } catch (error) {
      console.error('Error fetching companies:', error?.response?.data?.message || error);
      toast.error('Failed to load companies');
      throw error;
    }
  }

  // Get company by ID
  async getById(id) {
    try {
      await delay(300);
      const company = companies.find(c => c.Id === parseInt(id));
      if (!company) {
        throw new Error('Company not found');
      }
      return { ...company }; // Return copy
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load company details');
      throw error;
    }
  }

  // Create new company
  async create(companyData) {
    try {
      await delay(300);
      
      // Generate new ID
      const newId = Math.max(...companies.map(c => c.Id)) + 1;
      
      // Create company object with only updateable fields
      const newCompany = {
        Id: newId,
        name_c: companyData.name_c || '',
        industry_c: companyData.industry_c || '',
        website_c: companyData.website_c || '',
        email_c: companyData.email_c || '',
        phone_c: companyData.phone_c || '',
        address_c: companyData.address_c || '',
        employees_c: companyData.employees_c || 0,
        revenue_c: companyData.revenue_c || 0,
        description_c: companyData.description_c || ''
      };

      companies.push(newCompany);
      toast.success('Company created successfully');
      return { ...newCompany };
    } catch (error) {
      console.error('Error creating company:', error?.response?.data?.message || error);
      toast.error('Failed to create company');
      throw error;
    }
  }

  // Update company
  async update(id, companyData) {
    try {
      await delay(300);
      
      const index = companies.findIndex(c => c.Id === parseInt(id));
      if (index === -1) {
        throw new Error('Company not found');
      }

      // Update only provided fields
      const updatedCompany = {
        ...companies[index],
        ...companyData,
        Id: parseInt(id) // Ensure ID doesn't change
      };

      companies[index] = updatedCompany;
      toast.success('Company updated successfully');
      return { ...updatedCompany };
    } catch (error) {
      console.error(`Error updating company ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to update company');
      throw error;
    }
  }

  // Delete company
  async delete(id) {
    try {
      await delay(300);
      
      const index = companies.findIndex(c => c.Id === parseInt(id));
      if (index === -1) {
        throw new Error('Company not found');
      }

      companies.splice(index, 1);
      toast.success('Company deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting company ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to delete company');
      throw error;
    }
  }
}

// Export singleton instance
export const companyService = new CompanyService();
import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const quoteService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}}, 
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "billing_name_c"}},
          {"field": {"Name": "billing_street_c"}},
          {"field": {"Name": "billing_city_c"}},
          {"field": {"Name": "billing_state_c"}},
          {"field": {"Name": "billing_country_c"}},
          {"field": {"Name": "billing_pincode_c"}},
          {"field": {"Name": "shipping_name_c"}},
          {"field": {"Name": "shipping_street_c"}},
          {"field": {"Name": "shipping_city_c"}},
          {"field": {"Name": "shipping_state_c"}},
          {"field": {"Name": "shipping_country_c"}},
          {"field": {"Name": "shipping_pincode_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords('quote_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching quotes:', error?.response?.data?.message || error);
      toast.error('Failed to fetch quotes');
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "billing_name_c"}},
          {"field": {"Name": "billing_street_c"}},
          {"field": {"Name": "billing_city_c"}},
          {"field": {"Name": "billing_state_c"}},
          {"field": {"Name": "billing_country_c"}},
          {"field": {"Name": "billing_pincode_c"}},
          {"field": {"Name": "shipping_name_c"}},
          {"field": {"Name": "shipping_street_c"}},
          {"field": {"Name": "shipping_city_c"}},
          {"field": {"Name": "shipping_state_c"}},
          {"field": {"Name": "shipping_country_c"}},
          {"field": {"Name": "shipping_pincode_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('quote_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to fetch quote details');
      return null;
    }
  },

  async create(quoteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // Only include Updateable fields, convert lookup objects to IDs
      const cleanData = {
        company_c: quoteData.company_c,
        contact_id_c: quoteData.contact_id_c?.Id || quoteData.contact_id_c,
        deal_id_c: quoteData.deal_id_c?.Id || quoteData.deal_id_c,
        quote_date_c: quoteData.quote_date_c,
        status_c: quoteData.status_c,
        delivery_method_c: quoteData.delivery_method_c,
        expires_on_c: quoteData.expires_on_c,
        billing_name_c: quoteData.billing_name_c,
        billing_street_c: quoteData.billing_street_c,
        billing_city_c: quoteData.billing_city_c,
        billing_state_c: quoteData.billing_state_c,
        billing_country_c: quoteData.billing_country_c,
        billing_pincode_c: quoteData.billing_pincode_c,
        shipping_name_c: quoteData.shipping_name_c,
        shipping_street_c: quoteData.shipping_street_c,
        shipping_city_c: quoteData.shipping_city_c,
        shipping_state_c: quoteData.shipping_state_c,
        shipping_country_c: quoteData.shipping_country_c,
        shipping_pincode_c: quoteData.shipping_pincode_c
      };

      // Remove undefined/null fields
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === undefined || cleanData[key] === null || cleanData[key] === '') {
          delete cleanData[key];
        }
      });

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.createRecord('quote_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Quote created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating quote:', error?.response?.data?.message || error);
      toast.error('Failed to create quote');
      return null;
    }
  },

  async update(id, quoteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // Only include Updateable fields, convert lookup objects to IDs
      const cleanData = {
        Id: id,
        company_c: quoteData.company_c,
        contact_id_c: quoteData.contact_id_c?.Id || quoteData.contact_id_c,
        deal_id_c: quoteData.deal_id_c?.Id || quoteData.deal_id_c,
        quote_date_c: quoteData.quote_date_c,
        status_c: quoteData.status_c,
        delivery_method_c: quoteData.delivery_method_c,
        expires_on_c: quoteData.expires_on_c,
        billing_name_c: quoteData.billing_name_c,
        billing_street_c: quoteData.billing_street_c,
        billing_city_c: quoteData.billing_city_c,
        billing_state_c: quoteData.billing_state_c,
        billing_country_c: quoteData.billing_country_c,
        billing_pincode_c: quoteData.billing_pincode_c,
        shipping_name_c: quoteData.shipping_name_c,
        shipping_street_c: quoteData.shipping_street_c,
        shipping_city_c: quoteData.shipping_city_c,
        shipping_state_c: quoteData.shipping_state_c,
        shipping_country_c: quoteData.shipping_country_c,
        shipping_pincode_c: quoteData.shipping_pincode_c
      };

      // Remove undefined/null fields (except Id)
      Object.keys(cleanData).forEach(key => {
        if (key !== 'Id' && (cleanData[key] === undefined || cleanData[key] === null || cleanData[key] === '')) {
          delete cleanData[key];
        }
      });

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.updateRecord('quote_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Quote updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating quote:', error?.response?.data?.message || error);
      toast.error('Failed to update quote');
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('quote_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Quote deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting quote:', error?.response?.data?.message || error);
      toast.error('Failed to delete quote');
      return false;
    }
  }
};
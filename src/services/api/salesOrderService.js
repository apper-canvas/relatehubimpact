import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class SalesOrderService {
  constructor() {
    this.tableName = 'sales_order_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}}, 
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_id_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}}
        ],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching sales orders:', error?.response?.data?.message || error.message);
      toast.error('Failed to load sales orders');
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_id_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching sales order ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to load sales order');
      return null;
    }
  }

  async create(salesOrderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Prepare data with only Updateable fields
      const payload = {
        records: [{
          name_c: salesOrderData.name_c || '',
          contact_id_c: salesOrderData.contact_id_c ? parseInt(salesOrderData.contact_id_c) : null,
          deal_id_c: salesOrderData.deal_id_c ? parseInt(salesOrderData.deal_id_c) : null,
          quote_id_c: salesOrderData.quote_id_c ? parseInt(salesOrderData.quote_id_c) : null,
          order_date_c: salesOrderData.order_date_c || new Date().toISOString().split('T')[0],
          status_c: salesOrderData.status_c || 'Draft',
          total_amount_c: salesOrderData.total_amount_c ? parseFloat(salesOrderData.total_amount_c) : 0
        }]
      };

      // Remove null/undefined fields
      Object.keys(payload.records[0]).forEach(key => {
        if (payload.records[0][key] === null || payload.records[0][key] === undefined || payload.records[0][key] === '') {
          delete payload.records[0][key];
        }
      });

      const response = await apperClient.createRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} sales orders:`, failed);
          failed.forEach(record => {
            if (record.errors && Array.isArray(record.errors)) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel || 'Field'}: ${error.message || error}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
          
          if (successful.length === 0) {
            throw new Error('Failed to create sales order');
          }
        }
        
        if (successful.length > 0) {
          toast.success('Sales order created successfully');
          return successful[0].data;
        }
      }

      toast.success('Sales order created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating sales order:', error?.response?.data?.message || error.message);
      if (!error.message?.includes('Failed to create')) {
        toast.error('Failed to create sales order');
      }
      throw error;
    }
  }

  async update(id, salesOrderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Prepare data with only Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: salesOrderData.name_c || '',
          contact_id_c: salesOrderData.contact_id_c ? parseInt(salesOrderData.contact_id_c) : null,
          deal_id_c: salesOrderData.deal_id_c ? parseInt(salesOrderData.deal_id_c) : null,
          quote_id_c: salesOrderData.quote_id_c ? parseInt(salesOrderData.quote_id_c) : null,
          order_date_c: salesOrderData.order_date_c || '',
          status_c: salesOrderData.status_c || 'Draft',
          total_amount_c: salesOrderData.total_amount_c ? parseFloat(salesOrderData.total_amount_c) : 0
        }]
      };

      // Remove null/undefined/empty fields except required ones
      Object.keys(payload.records[0]).forEach(key => {
        if (key !== 'Id' && (payload.records[0][key] === null || payload.records[0][key] === undefined || payload.records[0][key] === '')) {
          delete payload.records[0][key];
        }
      });

      const response = await apperClient.updateRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} sales orders:`, failed);
          failed.forEach(record => {
            if (record.errors && Array.isArray(record.errors)) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel || 'Field'}: ${error.message || error}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
          
          if (successful.length === 0) {
            throw new Error('Failed to update sales order');
          }
        }
        
        if (successful.length > 0) {
          toast.success('Sales order updated successfully');
          return successful[0].data;
        }
      }

      toast.success('Sales order updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating sales order:', error?.response?.data?.message || error.message);
      if (!error.message?.includes('Failed to update')) {
        toast.error('Failed to update sales order');
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} sales orders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          
          if (successful.length === 0) {
            throw new Error('Failed to delete sales order');
          }
        }
        
        if (successful.length > 0) {
          toast.success('Sales order deleted successfully');
          return true;
        }
      }

      toast.success('Sales order deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting sales order:', error?.response?.data?.message || error.message);
      if (!error.message?.includes('Failed to delete')) {
        toast.error('Failed to delete sales order');
      }
      throw error;
    }
  }
}

export const salesOrderService = new SalesOrderService();
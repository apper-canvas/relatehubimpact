import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class DealService {
  constructor() {
    this.tableName = 'deal_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || deal.Name || "",
        value: deal.value_c || 0,
        stage: deal.stage_c || "Lead",
        probability: deal.probability_c || 0,
        expectedCloseDate: deal.expected_close_date_c || "",
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Deal with Id ${id} not found`);
      }

      // Transform data to match UI expectations
      const deal = response.data;
      return {
        Id: deal.Id,
        title: deal.title_c || deal.Name || "",
        value: deal.value_c || 0,
        stage: deal.stage_c || "Lead",
        probability: deal.probability_c || 0,
        expectedCloseDate: deal.expected_close_date_c || "",
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Transform data to database field names - only updateable fields
      const dbData = {};
      if (dealData.title) dbData.title_c = dealData.title;
      if (dealData.value !== undefined) dbData.value_c = parseFloat(dealData.value);
      if (dealData.stage) dbData.stage_c = dealData.stage;
      if (dealData.probability !== undefined) dbData.probability_c = parseInt(dealData.probability);
      if (dealData.expectedCloseDate) dbData.expected_close_date_c = dealData.expectedCloseDate;
      if (dealData.contactId) dbData.contact_id_c = parseInt(dealData.contactId);

      // Set Name field (required)
      dbData.Name = dealData.title || 'Unnamed Deal';

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdDeal = successful[0].data;
          return {
            Id: createdDeal.Id,
            title: createdDeal.title_c || createdDeal.Name || "",
            value: createdDeal.value_c || 0,
            stage: createdDeal.stage_c || "Lead",
            probability: createdDeal.probability_c || 0,
            expectedCloseDate: createdDeal.expected_close_date_c || "",
            contactId: createdDeal.contact_id_c?.Id || createdDeal.contact_id_c || null,
            createdAt: createdDeal.CreatedOn,
            updatedAt: createdDeal.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Transform data to database field names - only updateable fields
      const dbData = { Id: parseInt(id) };
      if (dealData.title) dbData.title_c = dealData.title;
      if (dealData.value !== undefined) dbData.value_c = parseFloat(dealData.value);
      if (dealData.stage) dbData.stage_c = dealData.stage;
      if (dealData.probability !== undefined) dbData.probability_c = parseInt(dealData.probability);
      if (dealData.expectedCloseDate) dbData.expected_close_date_c = dealData.expectedCloseDate;
      if (dealData.contactId) dbData.contact_id_c = parseInt(dealData.contactId);

      // Update Name field if title changed
      if (dealData.title) dbData.Name = dealData.title;

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedDeal = successful[0].data;
          return {
            Id: updatedDeal.Id,
            title: updatedDeal.title_c || updatedDeal.Name || "",
            value: updatedDeal.value_c || 0,
            stage: updatedDeal.stage_c || "Lead",
            probability: updatedDeal.probability_c || 0,
            expectedCloseDate: updatedDeal.expected_close_date_c || "",
            contactId: updatedDeal.contact_id_c?.Id || updatedDeal.contact_id_c || null,
            createdAt: updatedDeal.CreatedOn,
            updatedAt: updatedDeal.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
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
          console.error(`Failed to delete ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const dealService = new DealService();
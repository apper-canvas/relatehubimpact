import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class ActivityService {
  constructor() {
    this.tableName = 'activity_c';
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
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{
          "fieldName": "timestamp_c",
          "sorttype": "DESC"
        }]
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
      return response.data.map(activity => ({
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null,
        description: activity.description_c || "",
        timestamp: activity.timestamp_c || activity.CreatedOn || "",
        type: activity.type_c || "note",
        createdAt: activity.CreatedOn,
        updatedAt: activity.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
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
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "type_c"}},
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
        throw new Error(`Activity with Id ${id} not found`);
      }

      // Transform data to match UI expectations
      const activity = response.data;
      return {
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null,
        description: activity.description_c || "",
        timestamp: activity.timestamp_c || activity.CreatedOn || "",
        type: activity.type_c || "note",
        createdAt: activity.CreatedOn,
        updatedAt: activity.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "contact_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)]
        }],
        orderBy: [{
          "fieldName": "timestamp_c",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(activity => ({
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null,
        description: activity.description_c || "",
        timestamp: activity.timestamp_c || activity.CreatedOn || "",
        type: activity.type_c || "note",
        createdAt: activity.CreatedOn,
        updatedAt: activity.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "deal_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(dealId)]
        }],
        orderBy: [{
          "fieldName": "timestamp_c",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(activity => ({
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null,
        description: activity.description_c || "",
        timestamp: activity.timestamp_c || activity.CreatedOn || "",
        type: activity.type_c || "note",
        createdAt: activity.CreatedOn,
        updatedAt: activity.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Transform data to database field names - only updateable fields
      const dbData = {};
      if (activityData.contactId) dbData.contact_id_c = parseInt(activityData.contactId);
      if (activityData.dealId) dbData.deal_id_c = parseInt(activityData.dealId);
      if (activityData.description) dbData.description_c = activityData.description;
      if (activityData.timestamp) dbData.timestamp_c = activityData.timestamp;
      if (activityData.type) dbData.type_c = activityData.type;

      // Set Name field (required)
      dbData.Name = `${activityData.type || 'activity'}: ${activityData.description || 'Activity'}`.substring(0, 100);

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
          console.error(`Failed to create ${failed.length} activities: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdActivity = successful[0].data;
          return {
            Id: createdActivity.Id,
            contactId: createdActivity.contact_id_c?.Id || createdActivity.contact_id_c || null,
            dealId: createdActivity.deal_id_c?.Id || createdActivity.deal_id_c || null,
            description: createdActivity.description_c || "",
            timestamp: createdActivity.timestamp_c || createdActivity.CreatedOn || "",
            type: createdActivity.type_c || "note",
            createdAt: createdActivity.CreatedOn,
            updatedAt: createdActivity.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Transform data to database field names - only updateable fields
      const dbData = { Id: parseInt(id) };
      if (activityData.contactId) dbData.contact_id_c = parseInt(activityData.contactId);
      if (activityData.dealId) dbData.deal_id_c = parseInt(activityData.dealId);
      if (activityData.description) dbData.description_c = activityData.description;
      if (activityData.timestamp) dbData.timestamp_c = activityData.timestamp;
      if (activityData.type) dbData.type_c = activityData.type;

      // Update Name field
      if (activityData.description || activityData.type) {
        dbData.Name = `${activityData.type || 'activity'}: ${activityData.description || 'Activity'}`.substring(0, 100);
      }

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
          console.error(`Failed to update ${failed.length} activities: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedActivity = successful[0].data;
          return {
            Id: updatedActivity.Id,
            contactId: updatedActivity.contact_id_c?.Id || updatedActivity.contact_id_c || null,
            dealId: updatedActivity.deal_id_c?.Id || updatedActivity.deal_id_c || null,
            description: updatedActivity.description_c || "",
            timestamp: updatedActivity.timestamp_c || updatedActivity.CreatedOn || "",
            type: updatedActivity.type_c || "note",
            createdAt: updatedActivity.CreatedOn,
            updatedAt: updatedActivity.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} activities: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();
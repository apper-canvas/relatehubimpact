import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class TaskService {
  constructor() {
    this.tableName = 'task_c';
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
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "due_date_c"}},
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
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || "",
        completed: task.completed_c || false,
        dueDate: task.due_date_c || "",
        contactId: task.contact_id_c?.Id || task.contact_id_c || null,
        createdAt: task.CreatedOn,
        updatedAt: task.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
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
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "due_date_c"}},
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
        throw new Error(`Task with Id ${id} not found`);
      }

      // Transform data to match UI expectations
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || task.Name || "",
        completed: task.completed_c || false,
        dueDate: task.due_date_c || "",
        contactId: task.contact_id_c?.Id || task.contact_id_c || null,
        createdAt: task.CreatedOn,
        updatedAt: task.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "contact_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)]
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
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || "",
        completed: task.completed_c || false,
        dueDate: task.due_date_c || "",
        contactId: task.contact_id_c?.Id || task.contact_id_c || null,
        createdAt: task.CreatedOn,
        updatedAt: task.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching tasks by contact:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Transform data to database field names - only updateable fields
      const dbData = {};
      if (taskData.title) dbData.title_c = taskData.title;
      if (taskData.completed !== undefined) dbData.completed_c = taskData.completed;
      if (taskData.dueDate) dbData.due_date_c = taskData.dueDate;
      if (taskData.contactId) dbData.contact_id_c = parseInt(taskData.contactId);

      // Set Name field (required)
      dbData.Name = taskData.title || 'Unnamed Task';

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
          console.error(`Failed to create ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdTask = successful[0].data;
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || createdTask.Name || "",
            completed: createdTask.completed_c || false,
            dueDate: createdTask.due_date_c || "",
            contactId: createdTask.contact_id_c?.Id || createdTask.contact_id_c || null,
            createdAt: createdTask.CreatedOn,
            updatedAt: createdTask.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Transform data to database field names - only updateable fields
      const dbData = { Id: parseInt(id) };
      if (taskData.title) dbData.title_c = taskData.title;
      if (taskData.completed !== undefined) dbData.completed_c = taskData.completed;
      if (taskData.dueDate) dbData.due_date_c = taskData.dueDate;
      if (taskData.contactId) dbData.contact_id_c = parseInt(taskData.contactId);

      // Update Name field if title changed
      if (taskData.title) dbData.Name = taskData.title;

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
          console.error(`Failed to update ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || updatedTask.Name || "",
            completed: updatedTask.completed_c || false,
            dueDate: updatedTask.due_date_c || "",
            contactId: updatedTask.contact_id_c?.Id || updatedTask.contact_id_c || null,
            createdAt: updatedTask.CreatedOn,
            updatedAt: updatedTask.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
}
export const taskService = new TaskService();
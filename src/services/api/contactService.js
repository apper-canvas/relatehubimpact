import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class ContactService {
  constructor() {
    this.tableName = 'contact_c';
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
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
      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.name_c || contact.Name || "",
        company: contact.company_c || "",
        email: contact.email_c || "",
        phone: contact.phone_c || "",
        tags: contact.tags_c ? contact.tags_c.split(',').map(tag => tag.trim()) : [],
        notes: contact.notes_c || "",
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
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
        throw new Error(`Contact with Id ${id} not found`);
      }

      // Transform data to match UI expectations
      const contact = response.data;
      return {
        Id: contact.Id,
        name: contact.name_c || contact.Name || "",
        company: contact.company_c || "",
        email: contact.email_c || "",
        phone: contact.phone_c || "",
        tags: contact.tags_c ? contact.tags_c.split(',').map(tag => tag.trim()) : [],
        notes: contact.notes_c || "",
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Transform data to database field names - only updateable fields
      const dbData = {};
      if (contactData.name) dbData.name_c = contactData.name;
      if (contactData.company) dbData.company_c = contactData.company;
      if (contactData.email) dbData.email_c = contactData.email;
      if (contactData.phone) dbData.phone_c = contactData.phone;
      if (contactData.tags) {
        dbData.tags_c = Array.isArray(contactData.tags) 
          ? contactData.tags.join(',')
          : contactData.tags.toString();
      }
      if (contactData.notes) dbData.notes_c = contactData.notes;

      // Set Name field (required)
      dbData.Name = contactData.name || 'Unnamed Contact';

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
          console.error(`Failed to create ${failed.length} contacts: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdContact = successful[0].data;
          return {
            Id: createdContact.Id,
            name: createdContact.name_c || createdContact.Name || "",
            company: createdContact.company_c || "",
            email: createdContact.email_c || "",
            phone: createdContact.phone_c || "",
            tags: createdContact.tags_c ? createdContact.tags_c.split(',').map(tag => tag.trim()) : [],
            notes: createdContact.notes_c || "",
            createdAt: createdContact.CreatedOn,
            updatedAt: createdContact.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Transform data to database field names - only updateable fields
      const dbData = { Id: parseInt(id) };
      if (contactData.name) dbData.name_c = contactData.name;
      if (contactData.company) dbData.company_c = contactData.company;
      if (contactData.email) dbData.email_c = contactData.email;
      if (contactData.phone) dbData.phone_c = contactData.phone;
      if (contactData.tags) {
        dbData.tags_c = Array.isArray(contactData.tags) 
          ? contactData.tags.join(',')
          : contactData.tags.toString();
      }
      if (contactData.notes) dbData.notes_c = contactData.notes;

      // Update Name field if name changed
      if (contactData.name) dbData.Name = contactData.name;

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
          console.error(`Failed to update ${failed.length} contacts: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedContact = successful[0].data;
          return {
            Id: updatedContact.Id,
            name: updatedContact.name_c || updatedContact.Name || "",
            company: updatedContact.company_c || "",
            email: updatedContact.email_c || "",
            phone: updatedContact.phone_c || "",
            tags: updatedContact.tags_c ? updatedContact.tags_c.split(',').map(tag => tag.trim()) : [],
            notes: updatedContact.notes_c || "",
            createdAt: updatedContact.CreatedOn,
            updatedAt: updatedContact.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} contacts: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const contactService = new ContactService();